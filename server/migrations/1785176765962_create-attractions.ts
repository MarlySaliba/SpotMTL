import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("attractions", {
    id: {
      type: "integer",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "BY DEFAULT",
      },
    },
    name: {
      type: "varchar(160)",
      notNull: true,
      unique: true,
    },
    activity: {
      type: "varchar(80)",
      notNull: true,
    },
    price: {
      type: "varchar(32)",
      notNull: true,
    },
    location: {
      type: "varchar(120)",
      notNull: true,
    },
    effort: {
      type: "varchar(32)",
      notNull: true,
    },
    group_size: {
      type: "varchar(32)",
      notNull: true,
    },
    season: {
      type: "varchar(32)",
      notNull: true,
    },
    time: {
      type: "varchar(32)",
      notNull: true,
    },
    dietary_restrictions: {
      type: "varchar(80)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    image_url: {
      type: "text",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("attractions");
}
