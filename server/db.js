import { Pool } from "pg";
import { getDatabaseConfig } from "./config.js";
import { logOperationalError } from "./logging.js";

let pool;
let target;

function getPool() {
  if (!pool) {
    const databaseConfig = getDatabaseConfig();
    target = databaseConfig.target;
    pool = new Pool(databaseConfig.poolOptions);

    pool.on("error", (error) => {
      logOperationalError(
        console,
        "[database] Unexpected error on an idle PostgreSQL connection",
        error,
      );
    });
  }

  return pool;
}

export function getDatabaseTarget() {
  getPool();
  return { ...target };
}

export function query(text, parameters = []) {
  return getPool().query(text, parameters);
}

export async function verifyDatabaseConnection() {
  const startedAt = Date.now();
  const result = await query("SELECT 1 AS connected, NOW() AS server_time");

  if (result.rows[0]?.connected !== 1) {
    throw new Error("PostgreSQL returned an unexpected health-check response.");
  }

  return {
    connected: true,
    serverTime: result.rows[0].server_time,
    latencyMs: Date.now() - startedAt,
  };
}

export async function closeDatabasePool() {
  if (!pool) {
    return;
  }

  const activePool = pool;
  pool = undefined;
  target = undefined;
  await activePool.end();
}
