import cors from "cors";
import express from "express";
import { logOperationalError } from "./logging.js";

export function createApp({ databaseHealthCheck, clientOrigin, logger = console }) {
  if (typeof databaseHealthCheck !== "function") {
    throw new TypeError("databaseHealthCheck must be a function.");
  }

  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.get("/api/health/database", async (_request, response) => {
    try {
      const health = await databaseHealthCheck();

      response.status(200).json({
        status: "ok",
        database: "connected",
        databaseTime: health.serverTime,
        latencyMs: health.latencyMs,
      });
    } catch (error) {
      logOperationalError(logger, "[database] Health check failed", error);
      response.status(503).json({
        status: "error",
        database: "unavailable",
      });
    }
  });

  app.use((_request, response) => {
    response.status(404).json({ error: "Route not found." });
  });

  app.use((error, _request, response, _next) => {
    logOperationalError(logger, "[server] Unhandled request error", error);
    response.status(500).json({ error: "Internal server error." });
  });

  return app;
}
