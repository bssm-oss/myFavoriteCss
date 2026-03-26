import { eq, and, gt, isNull } from "drizzle-orm";

import { authUserSchema, sessionExchangeResponseSchema } from "@morph-ui/shared";

import { db } from "../db/client";
import { authAccounts, authFlows, sessions, users } from "../db/schema";
import { env } from "../env";
import { createOpaqueToken, createPkceChallenge, sha256 } from "./tokens";

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile"
];

export function buildGoogleAuthStartUrl(input: {
  extensionRedirectUri: string;
  extensionState: string;
  codeChallenge: string;
}) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_OAUTH_REDIRECT_URI) {
    throw new Error("Google OAuth is not configured.");
  }

  const internalState = createOpaqueToken(24);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.GOOGLE_OAUTH_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_SCOPES.join(" "));
  url.searchParams.set("state", internalState);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return db.insert(authFlows).values({
    provider: "google",
    state: internalState,
    extensionRedirectUri: input.extensionRedirectUri,
    extensionState: input.extensionState,
    codeChallenge: input.codeChallenge,
    expiresAt
  }).then(() => ({
    internalState,
    authUrl: url.toString()
  }));
}

async function exchangeGoogleCode(code: string) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_OAUTH_REDIRECT_URI) {
    throw new Error("Google OAuth is not configured.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google token exchange failed: ${tokenResponse.status}`);
  }

  const tokenPayload = await tokenResponse.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    id_token?: string;
  };

  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`
    }
  });

  if (!userResponse.ok) {
    throw new Error(`Google userinfo fetch failed: ${userResponse.status}`);
  }

  const userPayload = await userResponse.json() as {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  };

  return { tokenPayload, userPayload };
}

export async function completeGoogleCallback(input: {
  code: string;
  state: string;
}) {
  const flow = await db.query.authFlows.findFirst({
    where: and(
      eq(authFlows.state, input.state),
      isNull(authFlows.usedAt),
      gt(authFlows.expiresAt, new Date())
    )
  });

  if (!flow) {
    throw new Error("Auth flow is missing or expired.");
  }

  const { tokenPayload, userPayload } = await exchangeGoogleCode(input.code);

  let user = await db.query.users.findFirst({
    where: eq(users.email, userPayload.email)
  });

  if (!user) {
    [user] = await db.insert(users).values({
      email: userPayload.email,
      name: userPayload.name,
      avatarUrl: userPayload.picture
    }).returning();
  }

  if (!user) {
    throw new Error("Failed to upsert user.");
  }

  await db.insert(authAccounts).values({
    userId: user.id,
    provider: "google",
    providerUserId: userPayload.sub,
    accessMetadata: {
      hasRefreshToken: Boolean(tokenPayload.refresh_token)
    }
  }).onConflictDoUpdate({
    target: [authAccounts.provider, authAccounts.providerUserId],
    set: {
      userId: user.id,
      accessMetadata: {
        hasRefreshToken: Boolean(tokenPayload.refresh_token)
      },
      updatedAt: new Date()
    }
  });

  const exchangeCode = createOpaqueToken(24);

  await db.update(authFlows)
    .set({
      exchangeCodeHash: sha256(exchangeCode),
      userId: user.id,
      updatedAt: new Date()
    })
    .where(eq(authFlows.id, flow.id));

  return {
    exchangeCode,
    extensionRedirectUri: flow.extensionRedirectUri,
    extensionState: flow.extensionState
  };
}

export async function exchangeExtensionSession(input: {
  exchangeCode: string;
  codeVerifier: string;
  userAgent?: string;
}) {
  const hashedExchange = sha256(input.exchangeCode);
  const flow = await db.query.authFlows.findFirst({
    where: and(
      eq(authFlows.exchangeCodeHash, hashedExchange),
      isNull(authFlows.usedAt),
      gt(authFlows.expiresAt, new Date())
    )
  });

  if (!flow || !flow.userId) {
    throw new Error("Exchange code is invalid or expired.");
  }

  if (createPkceChallenge(input.codeVerifier) !== flow.codeChallenge) {
    throw new Error("PKCE verification failed.");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, flow.userId)
  });
  if (!user) {
    throw new Error("User not found for auth exchange.");
  }

  const accessToken = createOpaqueToken(32);
  const refreshToken = createOpaqueToken(40);
  const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId: user.id,
    accessTokenHash: sha256(accessToken),
    refreshTokenHash: sha256(refreshToken),
    accessExpiresAt,
    refreshExpiresAt,
    userAgent: input.userAgent
  });

  await db.update(authFlows)
    .set({
      usedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(authFlows.id, flow.id));

  return sessionExchangeResponseSchema.parse({
    accessToken,
    refreshToken,
    user: authUserSchema.parse(user),
    expiresAt: accessExpiresAt.toISOString()
  });
}

export async function refreshSession(refreshToken: string) {
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.refreshTokenHash, sha256(refreshToken)),
      gt(sessions.refreshExpiresAt, new Date())
    )
  });

  if (!session) {
    throw new Error("Refresh token is invalid or expired.");
  }

  const accessToken = createOpaqueToken(32);
  const refreshTokenNext = createOpaqueToken(40);
  const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.update(sessions)
    .set({
      accessTokenHash: sha256(accessToken),
      refreshTokenHash: sha256(refreshTokenNext),
      accessExpiresAt,
      refreshExpiresAt,
      updatedAt: new Date()
    })
    .where(eq(sessions.id, session.id));

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user) {
    throw new Error("Session user not found.");
  }

  return {
    accessToken,
    refreshToken: refreshTokenNext,
    user: authUserSchema.parse(user),
    expiresAt: accessExpiresAt.toISOString()
  };
}

export async function authenticateAccessToken(accessToken: string) {
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.accessTokenHash, sha256(accessToken)),
      gt(sessions.accessExpiresAt, new Date())
    )
  });

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user) {
    return null;
  }

  return { session, user };
}
