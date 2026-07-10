import { createApp } from "./app.js";
import { getServerConfig } from "./config.js";
import {
  closeDatabasePool,
  getDatabaseTarget,
  verifyDatabaseConnection,
} from "./db.js";
import { logOperationalError } from "./logging.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

function registerGracefulShutdown(httpServer) {
  let shuttingDown = false;

  const shutdown = (signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.info(`[server] ${signal} received. Shutting down gracefully.`);

    const forcedShutdown = setTimeout(() => {
      console.error("[server] Graceful shutdown timed out.");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forcedShutdown.unref();

    httpServer.close(async (httpError) => {
      let exitCode = httpError ? 1 : 0;

      if (httpError) {
        logOperationalError(console, "[server] HTTP shutdown failed", httpError);
      }

      try {
        await closeDatabasePool();
        console.info("[database] PostgreSQL connection pool closed.");
      } catch (databaseError) {
        exitCode = 1;
        logOperationalError(
          console,
          "[database] Failed to close PostgreSQL connection pool",
          databaseError,
        );
      } finally {
        clearTimeout(forcedShutdown);
        process.exit(exitCode);
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

async function startServer() {
  try {
    const serverConfig = getServerConfig();
    const databaseTarget = getDatabaseTarget();

    console.info(
      `[database] Verifying ${databaseTarget.host}:${databaseTarget.port}/${databaseTarget.database} (${databaseTarget.source}).`,
    );

    const databaseHealth = await verifyDatabaseConnection();
    console.info(
      `[database] PostgreSQL connection verified in ${databaseHealth.latencyMs}ms.`,
    );

    const app = createApp({
      databaseHealthCheck: verifyDatabaseConnection,
      clientOrigin: serverConfig.clientOrigin,
    });
    const httpServer = app.listen(serverConfig.port, () => {
      console.info(
        `[server] SpotMTL API listening on http://localhost:${serverConfig.port} (${serverConfig.nodeEnv}).`,
      );
    });

    registerGracefulShutdown(httpServer);
  } catch (error) {
    logOperationalError(
      console,
      "[startup] PostgreSQL verification failed; the API was not started",
      error,
    );

    try {
      await closeDatabasePool();
    } catch (closeError) {
      logOperationalError(
        console,
        "[database] Failed to close PostgreSQL connection pool",
        closeError,
      );
    }

    process.exitCode = 1;
  }
}

await startServer();
