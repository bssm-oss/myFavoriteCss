import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { sessionExchangeRequestSchema } from "@morph-ui/shared";

import { completeGoogleCallback, buildGoogleAuthStartUrl, exchangeExtensionSession, refreshSession } from "../services/auth";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/auth/google/start", async (request, reply) => {
    const query = z.object({
      extensionRedirectUri: z.string().url(),
      state: z.string().min(8),
      codeChallenge: z.string().min(43)
    }).parse(request.query);

    const { authUrl } = await buildGoogleAuthStartUrl({
      extensionRedirectUri: query.extensionRedirectUri,
      extensionState: query.state,
      codeChallenge: query.codeChallenge
    });

    return reply.redirect(authUrl);
  });

  app.get("/api/auth/google/callback", async (request, reply) => {
    const query = z.object({
      code: z.string(),
      state: z.string()
    }).parse(request.query);

    const result = await completeGoogleCallback(query);
    const redirect = new URL(result.extensionRedirectUri);
    redirect.searchParams.set("code", result.exchangeCode);
    redirect.searchParams.set("state", result.extensionState);
    return reply.redirect(redirect.toString());
  });

  app.post("/api/auth/session/exchange", async (request) => {
    const body = sessionExchangeRequestSchema.parse(request.body);
    return exchangeExtensionSession({
      exchangeCode: body.exchangeCode,
      codeVerifier: body.codeVerifier,
      ...(request.headers["user-agent"] ? { userAgent: request.headers["user-agent"] } : {})
    });
  });

  app.post("/api/auth/session/refresh", async (request) => {
    const body = z.object({
      refreshToken: z.string().min(20)
    }).parse(request.body);
    return refreshSession(body.refreshToken);
  });
};
