import assert from "node:assert/strict";
import test from "node:test";
import { getDatabaseConfig, getServerConfig } from "../config.js";

const individualDatabaseEnvironment = {
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_NAME: "spotmtl",
  DB_USER: "spotmtl_app",
  DB_PASSWORD: "test-only-password",
};

test("builds a pool configuration from individual database variables", () => {
  const { poolOptions, target } = getDatabaseConfig(individualDatabaseEnvironment);

  assert.equal(poolOptions.host, "localhost");
  assert.equal(poolOptions.port, 5432);
  assert.equal(poolOptions.database, "spotmtl");
  assert.equal(poolOptions.user, "spotmtl_app");
  assert.equal(poolOptions.password, "test-only-password");
  assert.deepEqual(target, {
    host: "localhost",
    port: "5432",
    database: "spotmtl",
    source: "DB_* variables",
  });
});

test("prefers DATABASE_URL and keeps credentials out of the log target", () => {
  const environment = {
    ...individualDatabaseEnvironment,
    DATABASE_URL: "postgresql://secret-user:secret-password@db.example.com:6543/spotmtl_prod",
  };
  const { poolOptions, target } = getDatabaseConfig(environment);

  assert.equal(poolOptions.connectionString, environment.DATABASE_URL);
  assert.deepEqual(target, {
    host: "db.example.com",
    port: "6543",
    database: "spotmtl_prod",
    source: "DATABASE_URL",
  });
  assert.doesNotMatch(JSON.stringify(target), /secret-user|secret-password/);
});

test("requires either DATABASE_URL or all individual database variables", () => {
  assert.throws(
    () => getDatabaseConfig({ DB_HOST: "localhost" }),
    /DB_PORT, DB_NAME, DB_USER, DB_PASSWORD/,
  );
});

test("rejects invalid numeric and boolean settings", () => {
  assert.throws(
    () => getDatabaseConfig({ ...individualDatabaseEnvironment, DB_PORT: "not-a-port" }),
    /DB_PORT must be an integer/,
  );
  assert.throws(
    () => getDatabaseConfig({ ...individualDatabaseEnvironment, DB_SSL: "sometimes" }),
    /DB_SSL must be either true or false/,
  );
});

test("uses safe server defaults", () => {
  assert.deepEqual(getServerConfig({}), {
    nodeEnv: "development",
    port: 3001,
    clientOrigin: "http://localhost:5173",
  });
});
