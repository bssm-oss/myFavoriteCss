import type { FastifyPluginAsync } from "fastify";

import { cacheLookupRequestSchema, cacheSaveRequestSchema } from "@morph-ui/shared";

import { requireUser } from "../auth/require-user";
import { lookupRemoteCache, saveRemoteCache } from "../services/cache";

export const cacheRoutes: FastifyPluginAsync = async (app) => {
  app.post("/api/cache/lookup", { preHandler: requireUser }, async (request) => {
    const body = cacheLookupRequestSchema.parse(request.body);
    return lookupRemoteCache(request.auth!.user.id, body);
  });

  app.post("/api/cache/save", { preHandler: requireUser }, async (request, reply) => {
    const body = cacheSaveRequestSchema.parse(request.body);
    await saveRemoteCache(request.auth!.user.id, body);
    return reply.code(204).send();
  });
};
