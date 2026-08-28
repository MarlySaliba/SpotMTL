import { AttractionsService } from "../src/attractions/attractions.service";
import type { DatabaseService } from "../src/database/database.service";

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

describe("AttractionsService", () => {
  const query = jest.fn();
  let service: AttractionsService;

  beforeEach(() => {
    query.mockReset();
    service = new AttractionsService({
      query,
    } as unknown as DatabaseService);
  });

  it("returns camel-cased attraction rows without applying filters", async () => {
    query.mockResolvedValue({ rows: [databaseRow] });

    const attractions = await service.findAll({});

    expect(attractions).toEqual([databaseRow]);
    expect(query).toHaveBeenCalledTimes(1);

    const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain('group_size AS "groupSize"');
    expect(sql).toContain(
      'dietary_restrictions AS "dietaryRestrictions"',
    );
    expect(sql).toContain('image_url AS "imageUrl"');
    expect(sql).toContain('created_at AS "createdAt"');
    expect(sql).toContain('updated_at AS "updatedAt"');
    expect(sql).not.toContain("WHERE");
    expect(sql).toContain("ORDER BY name ASC, id ASC");
    expect(parameters).toEqual([]);
  });

  it("uses ordered placeholders and parameters for all supported filters", async () => {
    const filters = {
      activity: "Museum",
      price: "Free",
      location: "Downtown",
      effort: "Low",
      groupSize: "Family",
      season: "Summer",
      time: "Morning",
      dietaryRestrictions: "Vegetarian",
    } as const;
    const values = Object.values(filters);
    query.mockResolvedValue({ rows: [databaseRow] });

    await service.findAll(filters);

    const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("activity = $1");
    expect(sql).toContain("price = $2");
    expect(sql).toContain("location = $3");
    expect(sql).toContain("effort = $4");
    expect(sql).toContain("group_size = $5");
    expect(sql).toContain("season = $6");
    expect(sql).toContain("time = $7");
    expect(sql).toContain("dietary_restrictions = $8");
    expect(parameters).toEqual(values);

    for (const value of values) {
      expect(sql).not.toContain(value);
    }
  });

  it("returns an empty array when PostgreSQL finds no matching attractions", async () => {
    query.mockResolvedValue({ rows: [] });

    await expect(
      service.findAll({ activity: "Museum" }),
    ).resolves.toEqual([]);
  });

  it('treats "Not Specified" as an explicit filter value', async () => {
    query.mockResolvedValue({ rows: [] });

    await service.findAll({ season: "Not Specified" });

    const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("season = $1");
    expect(sql).not.toContain("Not Specified");
    expect(parameters).toEqual(["Not Specified"]);
  });
});
