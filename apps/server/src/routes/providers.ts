import type { FastifyPluginAsync } from "fastify";

import { providerCapabilitiesResponseSchema } from "@morph-ui/shared";

import { listProviderAdapters } from "../providers";

export const providerRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/provider/capabilities", async () =>
    providerCapabilitiesResponseSchema.parse(
      listProviderAdapters().map((adapter) => adapter.capabilities())
    )
  );
};
