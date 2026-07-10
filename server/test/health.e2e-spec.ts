import { Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { configureApplication } from "../src/configure-application";
import { DatabaseService } from "../src/database/database.service";
import { HealthController } from "../src/health/health.controller";

describe("health endpoints", () => {
  let app: NestExpressApplication;
  const verifyConnection = jest.fn();

  beforeEach(async () => {
    verifyConnection.mockReset();

    const moduleReference = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DatabaseService,
          useValue: { verifyConnection },
        },
      ],
    }).compile();

    app = moduleReference.createNestApplication<NestExpressApplication>({
      bodyParser: false,
    });
    configureApplication(app, {
      nodeEnv: "test",
      port: 0,
      clientOrigin: "http://localhost:5173",
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  it("returns process health", async () => {
    await request(app.getHttpServer())
      .get("/api/health")
      .expect(200)
      .expect({ status: "ok" });
  });

  it("returns 200 after a successful database test query", async () => {
    verifyConnection.mockResolvedValue({
      connected: true,
      serverTime: new Date("2026-07-10T12:00:00.000Z"),
      latencyMs: 4,
    });

    await request(app.getHttpServer())
      .get("/api/health/database")
      .expect(200)
      .expect({
        status: "ok",
        database: "connected",
        databaseTime: "2026-07-10T12:00:00.000Z",
        latencyMs: 4,
      });
  });

  it("returns a generic 503 response when PostgreSQL is unavailable", async () => {
    const loggerError = jest
      .spyOn(Logger.prototype, "error")
      .mockImplementation(() => undefined);
    verifyConnection.mockRejectedValue(
      new Error(
        "Could not connect to postgresql://private-user:private-password@localhost/spotmtl",
      ),
    );

    const response = await request(app.getHttpServer())
      .get("/api/health/database")
      .expect(503)
      .expect({ status: "error", database: "unavailable" });

    expect(JSON.stringify(response.body)).not.toMatch(
      /private-user|private-password/,
    );
    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining("postgresql://[REDACTED]@localhost"),
    );
  });

  it("preserves the generic not-found response", async () => {
    await request(app.getHttpServer())
      .get("/api/not-a-route")
      .expect(404)
      .expect({ error: "Route not found." });
  });
});
