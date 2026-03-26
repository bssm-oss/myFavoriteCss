import type { FastifyPluginAsync } from "fastify";

import { authRoutes } from "./auth";
import { cacheRoutes } from "./cache";
import { feedbackRoutes } from "./feedback";
import { healthRoutes } from "./health";
import { profileRoutes } from "./profiles";
import { providerRoutes } from "./providers";
import { siteSettingsRoutes } from "./site-settings";
import { transformRoutes } from "./transform";

export const registerRoutes: FastifyPluginAsync = async (app) => {
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(providerRoutes);
  await app.register(profileRoutes);
  await app.register(siteSettingsRoutes);
  await app.register(cacheRoutes);
  await app.register(transformRoutes);
  await app.register(feedbackRoutes);
};
