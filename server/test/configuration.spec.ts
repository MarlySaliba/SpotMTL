import {
  getDatabaseConfig,
  getServerConfig,
} from "../src/config/environment";

const individualDatabaseEnvironment = {
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_NAME: "spotmtl",
  DB_USER: "spotmtl_app",
  DB_PASSWORD: "test-only-password",
};

describe("environment configuration", () => {
  it("builds pool settings from individual database variables", () => {
    const { poolOptions, target } = getDatabaseConfig(
      individualDatabaseEnvironment,
    );

    expect(poolOptions).toMatchObject({
      host: "localhost",
      port: 5432,
      database: "spotmtl",
      user: "spotmtl_app",
      password: "test-only-password",
    });
    expect(target).toEqual({
      host: "localhost",
      port: "5432",
      database: "spotmtl",
      source: "DB_* variables",
    });
  });

  it("prefers DATABASE_URL and keeps credentials out of the log target", () => {
    const environment = {
      ...individualDatabaseEnvironment,
      DATABASE_URL:
        "postgresql://secret-user:secret-password@db.example.com:6543/spotmtl_prod",
    };
    const { poolOptions, target } = getDatabaseConfig(environment);

    expect(poolOptions.connectionString).toBe(environment.DATABASE_URL);
    expect(target).toEqual({
      host: "db.example.com",
      port: "6543",
      database: "spotmtl_prod",
      source: "DATABASE_URL",
    });
    expect(JSON.stringify(target)).not.toMatch(/secret-user|secret-password/);
  });

  it("requires a URL or all individual database variables", () => {
    expect(() => getDatabaseConfig({ DB_HOST: "localhost" })).toThrow(
      /DB_PORT, DB_NAME, DB_USER, DB_PASSWORD/,
    );
  });

  it("rejects invalid numeric and boolean settings", () => {
    expect(() =>
      getDatabaseConfig({
        ...individualDatabaseEnvironment,
        DB_PORT: "not-a-port",
      }),
    ).toThrow(/DB_PORT must be an integer/);
    expect(() =>
      getDatabaseConfig({
        ...individualDatabaseEnvironment,
        DB_SSL: "sometimes",
      }),
    ).toThrow(/DB_SSL must be either true or false/);
  });

  it("uses safe server defaults", () => {
    expect(getServerConfig({})).toEqual({
      nodeEnv: "development",
      port: 3001,
      clientOrigin: "http://localhost:5173",
    });
  });
});
