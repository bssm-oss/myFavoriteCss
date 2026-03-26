import type { FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";

import { siteSettingSchema } from "@morph-ui/shared";

import { requireUser } from "../auth/require-user";
import { db } from "../db/client";
import { siteSettings } from "../db/schema";

export const siteSettingsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/site-settings", { preHandler: requireUser }, async (request) => {
    const rows = await db.query.siteSettings.findMany({
      where: eq(siteSettings.userId, request.auth!.user.id)
    });
    return rows.map((row) => siteSettingSchema.parse({
      id: row.id,
      userId: row.userId,
      origin: row.origin,
      enabled: row.enabled,
      autoApply: row.autoApply,
      privacyMode: row.privacyMode,
      allowScreenshots: row.allowScreenshots,
      profileId: row.profileId,
      overridePreferences: row.overridePreferencesJson,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }));
  });

  app.post("/api/site-settings", { preHandler: requireUser }, async (request) => {
    const body = siteSettingSchema.parse(request.body);
    const [row] = await db.insert(siteSettings).values({
      userId: request.auth!.user.id,
      origin: body.origin,
      enabled: body.enabled,
      autoApply: body.autoApply,
      privacyMode: body.privacyMode,
      allowScreenshots: body.allowScreenshots,
      profileId: body.profileId,
      overridePreferencesJson: body.overridePreferences
    }).onConflictDoUpdate({
      target: [siteSettings.userId, siteSettings.origin],
      set: {
        enabled: body.enabled,
        autoApply: body.autoApply,
        privacyMode: body.privacyMode,
        allowScreenshots: body.allowScreenshots,
        profileId: body.profileId,
        overridePreferencesJson: body.overridePreferences,
        updatedAt: new Date()
      }
    }).returning();

    if (!row) {
      throw new Error("Site setting upsert did not return a row.");
    }

    return siteSettingSchema.parse({
      id: row.id,
      userId: row.userId,
      origin: row.origin,
      enabled: row.enabled,
      autoApply: row.autoApply,
      privacyMode: row.privacyMode,
      allowScreenshots: row.allowScreenshots,
      profileId: row.profileId,
      overridePreferences: row.overridePreferencesJson,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    });
  });
};
