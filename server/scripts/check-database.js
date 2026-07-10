import {
  closeDatabasePool,
  getDatabaseTarget,
  verifyDatabaseConnection,
} from "../db.js";
import { logOperationalError } from "../logging.js";

try {
  const target = getDatabaseTarget();
  console.info(`[database] Checking ${target.host}:${target.port}/${target.database}.`);

  const health = await verifyDatabaseConnection();
  console.info(`[database] Connected successfully in ${health.latencyMs}ms.`);
} catch (error) {
  logOperationalError(console, "[database] Connection check failed", error);
  process.exitCode = 1;
} finally {
  try {
    await closeDatabasePool();
  } catch (error) {
    logOperationalError(console, "[database] Pool shutdown failed", error);
    process.exitCode = 1;
  }
}
