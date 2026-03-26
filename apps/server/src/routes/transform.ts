import type { FastifyPluginAsync } from "fastify";

import { transformPlanRequestSchema } from "@morph-ui/shared";

import { requireUser } from "../auth/require-user";
import { planTransformForRequest } from "../services/planner";

export const transformRoutes: FastifyPluginAsync = async (app) => {
  app.post("/api/transform/plan", { preHandler: requireUser }, async (request) => {
    const body = transformPlanRequestSchema.parse(request.body);
    return planTransformForRequest(body, request.auth!.user.id);
  });
};
