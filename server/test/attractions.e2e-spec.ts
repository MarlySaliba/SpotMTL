import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttractionsController } from "../src/attractions/attractions.controller";
import { AttractionsService } from "../src/attractions/attractions.service";
import { configureApplication } from "../src/configure-application";
import { DatabaseService } from "../src/database/database.service";

const databaseRow = {
  id: 1,
  name: "Oratoire Saint-Joseph",
  activity: "Museum",
  price: "Free",
  location: "Downtown",
  effort: "Low",
  groupSize: "Family",
  season: "Summer",
  time: "Morning",
  dietaryRestrictions: "Vegetarian",
  description: "A landmark basilica in Montreal.",
  imageUrl: "https://example.com/oratoire.jpg",
  createdAt: new Date("2026-07-27T12:00:00.000Z"),
  updatedAt: new Date("2026-07-27T12:00:00.000Z"),
};

const responseAttraction = {
  ...databaseRow,
  createdAt: "2026-07-27T12:00:00.000Z",
  updatedAt: "2026-07-27T12:00:00.000Z",
};

const filterCases = [
  ["activity", "Museum", "activity"],
  ["price", "Free", "price"],
  ["location", "Downtown", "location"],
  ["effort", "Low", "effort"],
  ["groupSize", "Family", "group_size"],
  ["season", "Summer", "season"],
  ["time", "Morning", "time"],
  [
    "dietaryRestrictions",
    "Vegetarian",
    "dietary_restrictions",
  ],
] as const;

describe("attractions endpoint", () => {
  const query = jest.fn();
  let app: NestExpressApplication;

  beforeEach(async () => {
    query.mockReset();

    const moduleReference = await Test.createTestingModule({
      controllers: [AttractionsController],
      providers: [
        AttractionsService,
        {
          provide: DatabaseService,
          useValue: { query },
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

  it("GET /api/attractions returns attractions", async () => {
    query.mockResolvedValue({ rows: [databaseRow] });

    await request(app.getHttpServer())
      .get("/api/attractions")
      .expect(200)
      .expect([responseAttraction]);

    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0]?.[1]).toEqual([]);
  });

  it.each(filterCases)(
    "filters by %s",
    async (queryName, value, databaseColumn) => {
      query.mockResolvedValue({ rows: [databaseRow] });

      await request(app.getHttpServer())
        .get("/api/attractions")
        .query({ [queryName]: value })
        .expect(200)
        .expect([responseAttraction]);

      expect(query).toHaveBeenCalledTimes(1);
      const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
      expect(sql).toContain(`${databaseColumn} = $1`);
      expect(sql).not.toContain(value);
      expect(parameters).toEqual([value]);
    },
  );

  it("combines filters in a stable order", async () => {
    query.mockResolvedValue({ rows: [databaseRow] });

    await request(app.getHttpServer())
      .get("/api/attractions")
      .query({
        time: "Morning",
        activity: "Museum",
        dietaryRestrictions: "Vegetarian",
        groupSize: "Family",
      })
      .expect(200)
      .expect([responseAttraction]);

    const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("activity = $1");
    expect(sql).toContain("group_size = $2");
    expect(sql).toContain("time = $3");
    expect(sql).toContain("dietary_restrictions = $4");
    expect(parameters).toEqual([
      "Museum",
      "Family",
      "Morning",
      "Vegetarian",
    ]);
  });

  it("returns an empty array when no attraction matches", async () => {
    query.mockResolvedValue({ rows: [] });

    await request(app.getHttpServer())
      .get("/api/attractions")
      .query({ season: "Winter" })
      .expect(200)
      .expect([]);
  });

  it("rejects an unsupported value before querying PostgreSQL", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/attractions")
      .query({ activity: "Swimming" })
      .expect(400);

    expect(response.body).toEqual({
      error: "Invalid query parameters.",
      details: expect.arrayContaining([expect.any(String)]),
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an empty filter before querying PostgreSQL", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/attractions?activity=")
      .expect(400);

    expect(response.body).toEqual({
      error: "Invalid query parameters.",
      details: expect.arrayContaining([expect.any(String)]),
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an unknown query parameter before querying PostgreSQL", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/attractions")
      .query({ rating: "five" })
      .expect(400);

    expect(response.body).toEqual({
      error: "Invalid query parameters.",
      details: expect.arrayContaining([expect.any(String)]),
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects a repeated query parameter before querying PostgreSQL", async () => {
    const response = await request(app.getHttpServer())
      .get(
        "/api/attractions?activity=Museum&activity=Hiking",
      )
      .expect(400);

    expect(response.body).toEqual({
      error: "Invalid query parameters.",
      details: expect.arrayContaining([expect.any(String)]),
    });
    expect(query).not.toHaveBeenCalled();
  });
});
