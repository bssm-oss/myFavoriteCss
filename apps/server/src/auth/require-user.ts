import type { FastifyReply, FastifyRequest } from "fastify";

import { authenticateAccessToken } from "../services/auth";

declare module "fastify" {
  interface FastifyRequest {
    auth?: Awaited<ReturnType<typeof authenticateAccessToken>>;
  }
}

export async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return reply.code(401).send({ error: "Missing access token." });
  }

  const auth = await authenticateAccessToken(token);
  if (!auth) {
    return reply.code(401).send({ error: "Invalid access token." });
  }

  request.auth = auth;
}
