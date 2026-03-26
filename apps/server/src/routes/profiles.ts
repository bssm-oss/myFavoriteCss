import type { FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";

import { preferenceProfileSchema } from "@morph-ui/shared";

import { requireUser } from "../auth/require-user";
import { db } from "../db/client";
import { profiles } from "../db/schema";

export const profileRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/profiles", { preHandler: requireUser }, async (request) => {
    const rows = await db.query.profiles.findMany({
      where: eq(profiles.userId, request.auth!.user.id)
    });

    return rows.map((row) => preferenceProfileSchema.parse({
      id: row.id,
      userId: row.userId,
      name: row.name,
      isDefault: row.isDefault,
      naturalLanguageInstruction: row.naturalLanguageInstruction,
      structuredPreferences: row.structuredPreferencesJson,
      learnedAdjustments: row.learnedAdjustmentsJson,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }));
  });

  app.post("/api/profiles", { preHandler: requireUser }, async (request) => {
    const body = preferenceProfileSchema.parse(request.body);
    const [row] = await db.insert(profiles).values({
      id: body.id,
      userId: request.auth!.user.id,
      name: body.name,
      isDefault: body.isDefault,
      naturalLanguageInstruction: body.naturalLanguageInstruction,
      structuredPreferencesJson: body.structuredPreferences,
      learnedAdjustmentsJson: body.learnedAdjustments
    }).onConflictDoUpdate({
      target: profiles.id,
      set: {
        name: body.name,
        isDefault: body.isDefault,
        naturalLanguageInstruction: body.naturalLanguageInstruction,
        structuredPreferencesJson: body.structuredPreferences,
        learnedAdjustmentsJson: body.learnedAdjustments,
        updatedAt: new Date()
      }
    }).returning();

    if (!row) {
      throw new Error("Profile upsert did not return a row.");
    }

    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      isDefault: row.isDefault,
      naturalLanguageInstruction: row.naturalLanguageInstruction,
      structuredPreferences: row.structuredPreferencesJson,
      learnedAdjustments: row.learnedAdjustmentsJson,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    };
  });
};
