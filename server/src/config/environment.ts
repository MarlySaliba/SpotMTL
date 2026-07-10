import type { PoolConfig } from "pg";

export const APPLICATION_CONFIGURATION_KEY = "spotmtl";

export interface DatabaseTarget {
  host: string;
  port: string;
  database: string;
  source: "DATABASE_URL" | "DB_* variables";
}

export interface DatabaseConfiguration {
  poolOptions: PoolConfig;
  target: DatabaseTarget;
}

export interface ServerConfiguration {
  nodeEnv: string;
  port: number;
  clientOrigin: string;
}

export interface ApplicationConfiguration {
  server: ServerConfiguration;
  database: DatabaseConfiguration;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseInteger(
  name: string,
  value: unknown,
  fallback?: number,
  { min = 1, max = 65_535 }: { min?: number; max?: number } = {},
): number {
  const normalizedValue = readString(value);

  if (!normalizedValue && fallback !== undefined) {
    return fallback;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    throw new Error(`${name} must be an integer.`);
  }

  const parsedValue = Number.parseInt(normalizedValue, 10);

  if (parsedValue < min || parsedValue > max) {
    throw new Error(`${name} must be between ${min} and ${max}.`);
  }

  return parsedValue;
}

function parseBoolean(
  name: string,
  value: unknown,
  fallback?: boolean,
): boolean {
  const normalizedValue = readString(value).toLowerCase();

  if (!normalizedValue && fallback !== undefined) {
    return fallback;
  }

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  throw new Error(`${name} must be either true or false.`);
}

function parseDatabaseUrl(databaseUrl: string): DatabaseTarget {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
  }

  if (!["postgres:", "postgresql:"].includes(parsedUrl.protocol)) {
    throw new Error(
      "DATABASE_URL must use the postgres:// or postgresql:// protocol.",
    );
  }

  return {
    host: parsedUrl.hostname || "configured host",
    port: parsedUrl.port || "5432",
    database:
      decodeURIComponent(parsedUrl.pathname.replace(/^\//, "")) ||
      "configured database",
    source: "DATABASE_URL",
  };
}

export function getDatabaseConfig(
  environment: Record<string, unknown>,
): DatabaseConfiguration {
  const databaseUrl = readString(environment.DATABASE_URL);
  const poolOptions: PoolConfig = {
    max: parseInteger("DB_POOL_MAX", environment.DB_POOL_MAX, 10, { max: 100 }),
    idleTimeoutMillis: parseInteger(
      "DB_IDLE_TIMEOUT_MS",
      environment.DB_IDLE_TIMEOUT_MS,
      30_000,
      { min: 1_000, max: 600_000 },
    ),
    connectionTimeoutMillis: parseInteger(
      "DB_CONNECTION_TIMEOUT_MS",
      environment.DB_CONNECTION_TIMEOUT_MS,
      5_000,
      { min: 100, max: 120_000 },
    ),
  };

  let target: DatabaseTarget;

  if (databaseUrl) {
    poolOptions.connectionString = databaseUrl;
    target = parseDatabaseUrl(databaseUrl);
  } else {
    const values = {
      host: readString(environment.DB_HOST),
      port: readString(environment.DB_PORT),
      database: readString(environment.DB_NAME),
      user: readString(environment.DB_USER),
      password: readString(environment.DB_PASSWORD),
    };
    const variableNames: Record<keyof typeof values, string> = {
      host: "DB_HOST",
      port: "DB_PORT",
      database: "DB_NAME",
      user: "DB_USER",
      password: "DB_PASSWORD",
    };
    const missingVariables = Object.entries(values)
      .filter(([, value]) => !value)
      .map(([key]) => variableNames[key as keyof typeof values]);

    if (missingVariables.length > 0) {
      throw new Error(
        `Set DATABASE_URL or provide all individual database variables. Missing: ${missingVariables.join(", ")}.`,
      );
    }

    const port = parseInteger("DB_PORT", values.port);

    Object.assign(poolOptions, {
      host: values.host,
      port,
      database: values.database,
      user: values.user,
      password: values.password,
    });

    target = {
      host: values.host,
      port: String(port),
      database: values.database,
      source: "DB_* variables",
    };
  }

  const sslSetting = readString(environment.DB_SSL);

  if (sslSetting) {
    const sslEnabled = parseBoolean("DB_SSL", sslSetting);
    poolOptions.ssl = sslEnabled
      ? {
          rejectUnauthorized: parseBoolean(
            "DB_SSL_REJECT_UNAUTHORIZED",
            environment.DB_SSL_REJECT_UNAUTHORIZED,
            true,
          ),
        }
      : false;
  }

  return { poolOptions, target };
}

export function getServerConfig(
  environment: Record<string, unknown>,
): ServerConfiguration {
  return {
    nodeEnv: readString(environment.NODE_ENV) || "development",
    port: parseInteger("PORT", environment.PORT, 3001),
    clientOrigin:
      readString(environment.CLIENT_ORIGIN) || "http://localhost:5173",
  };
}

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  const configuration: ApplicationConfiguration = {
    server: getServerConfig(environment),
    database: getDatabaseConfig(environment),
  };

  return {
    ...environment,
    [APPLICATION_CONFIGURATION_KEY]: configuration,
  };
}
