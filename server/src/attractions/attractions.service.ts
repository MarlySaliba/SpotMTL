import { Inject, Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import type {
  Attraction,
  AttractionFilterKey,
  AttractionFilters,
  AttractionRow,
} from "./attraction.types";

const FILTER_COLUMNS: ReadonlyArray<
  readonly [AttractionFilterKey, string]
> = [
  ["activity", "activity"],
  ["price", "price"],
  ["location", "location"],
  ["effort", "effort"],
  ["groupSize", "group_size"],
  ["season", "season"],
  ["time", "time"],
  ["dietaryRestrictions", "dietary_restrictions"],
];

const SELECT_ATTRACTIONS = `SELECT
  id,
  name,
  activity,
  price,
  location,
  effort,
  group_size AS "groupSize",
  season,
  time,
  dietary_restrictions AS "dietaryRestrictions",
  description,
  image_url AS "imageUrl",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM attractions`;

@Injectable()
export class AttractionsService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  async findAll(filters: AttractionFilters): Promise<Attraction[]> {
    const conditions: string[] = [];
    const parameters: string[] = [];

    for (const [filterName, columnName] of FILTER_COLUMNS) {
      const value = filters[filterName];

      if (value === undefined) {
        continue;
      }

      parameters.push(value);
      conditions.push(`${columnName} = $${parameters.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `\nWHERE ${conditions.join(" AND ")}` : "";
    const query = `${SELECT_ATTRACTIONS}${whereClause}
ORDER BY name ASC, id ASC`;
    const result = await this.databaseService.query<AttractionRow>(
      query,
      parameters,
    );

    return result.rows;
  }
}
