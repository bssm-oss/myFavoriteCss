import type { FastifyPluginAsync } from "fastify";
import { and, eq } from "drizzle-orm";

import { feedbackEventSchema } from "@morph-ui/shared";

import { requireUser } from "../auth/require-user";
import { db } from "../db/client";
import { feedbackEvents, pageCache, profiles } from "../db/schema";

export const feedbackRoutes: FastifyPluginAsync = async (app) => {
  app.post("/api/feedback", { preHandler: requireUser }, async (request, reply) => {
    const body = feedbackEventSchema.parse(request.body);
    const cacheRow = body.cacheKey
      ? await db.query.pageCache.findFirst({
          where: and(
            eq(pageCache.userId, request.auth!.user.id),
            eq(pageCache.fingerprintHash, body.cacheKey)
          )
        })
      : null;

    await db.insert(feedbackEvents).values({
      userId: request.auth!.user.id,
      pageCacheId: cacheRow?.id,
      eventType: body.eventType,
      eventPayloadJson: body.payload
    });

    if (body.pageContext.profileId && ["accept", "reject", "tweak"].includes(body.eventType)) {
      const profile = await db.query.profiles.findFirst({
        where: and(
          eq(profiles.id, body.pageContext.profileId),
          eq(profiles.userId, request.auth!.user.id)
        )
      });

      if (profile) {
        const existing = Array.isArray(profile.learnedAdjustmentsJson)
          ? profile.learnedAdjustmentsJson
          : [];

        existing.push({
          sourceEventId: crypto.randomUUID(),
          adjustment: body.eventType === "accept"
            ? "Accepted a transform for this page type."
            : body.eventType === "reject"
              ? "Rejected a transform for this page type."
              : "Tweaked a transform for this page type.",
          weight: body.eventType === "accept" ? 0.3 : -0.2,
          createdAt: new Date().toISOString()
        });

        await db.update(profiles)
          .set({
            learnedAdjustmentsJson: existing,
            updatedAt: new Date()
          })
          .where(eq(profiles.id, profile.id));
      }
    }

    return reply.code(202).send({ ok: true });
  });
};
