import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";

import { env } from "./env";
import { registerRoutes } from "./routes";

export function buildServer() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug"
    }
  });

  void app.register(cors, {
    origin: [env.APP_ORIGIN, env.WEB_ORIGIN],
    credentials: true
  });
  void app.register(sensible);
  void app.register(registerRoutes);

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.code(400).send({
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  });

  return app;
}

async function start() {
  const app = buildServer();
  await app.listen({
    host: "0.0.0.0",
    port: env.PORT
  });
}

if (process.env.VITEST !== "true") {
  void start();
}
