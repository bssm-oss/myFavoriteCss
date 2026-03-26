import { createHash, createHmac, randomBytes } from "node:crypto";

import { env } from "../env";

export function createOpaqueToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function signValue(value: string): string {
  return createHmac("sha256", env.SESSION_TOKEN_SECRET).update(value).digest("hex");
}

export function createPkceChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}
