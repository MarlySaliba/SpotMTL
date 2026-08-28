import type { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { getSafeErrorDetails } from "../src/common/logging/safe-error";
import { DatabaseService } from "../src/database/database.service";

interface AttractionSeed {
  name: string;
  activity: string;
  price: string;
  location: string;
  effort: string;
  groupSize: string;
  season: string;
  time: string;
  dietaryRestrictions: string;
  description: string;
  imageUrl: string | null;
}

const seedAttractions: readonly AttractionSeed[] = [
  {
    name: "Oratoire Saint-Joseph",
    activity: "Museum",
    price: "Free",
    location: "Downtown",
    effort: "Low",
    groupSize: "Not Specified",
    season: "Not Specified",
    time: "Not Specified",
    dietaryRestrictions: "Not Specified",
    description:
      "Visit Montréal's landmark basilica, its gardens, and sweeping city views.",
    imageUrl: "/src/assets/Oratoire_St_Joseph.jpg",
  },
  {
    name: "Lachine Canal Trail",
    activity: "Hiking",
    price: "Free",
    location: "Nature",
    effort: "Medium",
    groupSize: "Group",
    season: "Summer",
    time: "Afternoon",
    dietaryRestrictions: "Not Specified",
    description:
      "Follow the waterside trail along the historic Lachine Canal for an active afternoon.",
    imageUrl: "/src/assets/Canal_Lachine.avif",
  },
  {
    name: "Montréal Biosphère",
    activity: "Museum",
    price: "$",
    location: "Nature",
    effort: "Low",
    groupSize: "Family",
    season: "Spring",
    time: "Afternoon",
    dietaryRestrictions: "Not Specified",
    description:
      "Explore environmental exhibitions inside the iconic geodesic dome on Île Sainte-Hélène.",
    imageUrl: "/src/assets/Dome_expo.jpg",
  },
  {
    name: "La Ronde",
    activity: "Not Specified",
    price: "$$$",
    location: "Downtown",
    effort: "High",
    groupSize: "Group",
    season: "Summer",
    time: "Afternoon",
    dietaryRestrictions: "Not Specified",
    description:
      "Spend the day on roller coasters, family rides, and seasonal attractions at Montréal's amusement park.",
    imageUrl: "/src/assets/LaRonde.webp",
  },
  {
    name: "Old Montréal at Night",
    activity: "Hiking",
    price: "Free",
    location: "Downtown",
    effort: "Medium",
    groupSize: "Couple",
    season: "Fall",
    time: "Evening",
    dietaryRestrictions: "Not Specified",
    description:
      "Walk the illuminated streets and historic squares of Old Montréal after sunset.",
    imageUrl: "/src/assets/downtown_night.jpg",
  },
  {
    name: "Chinatown Vegan Supper",
    activity: "Eating Out",
    price: "$$",
    location: "Chinatown",
    effort: "Low",
    groupSize: "Couple",
    season: "Fall",
    time: "Evening",
    dietaryRestrictions: "Vegan",
    description:
      "Enjoy a casual plant-based supper while exploring Montréal's Chinatown.",
    imageUrl: null,
  },
];

const columnCount = 11;
let applicationContext: INestApplicationContext | undefined;

function createValuePlaceholders(): string {
  return seedAttractions
    .map((_, rowIndex) => {
      const firstParameter = rowIndex * columnCount + 1;
      const placeholders = Array.from(
        { length: columnCount },
        (__, columnIndex) => `$${firstParameter + columnIndex}`,
      );

      return `(${placeholders.join(", ")})`;
    })
    .join(",\n");
}

function createParameters(): Array<string | null> {
  return seedAttractions.flatMap((attraction) => [
    attraction.name,
    attraction.activity,
    attraction.price,
    attraction.location,
    attraction.effort,
    attraction.groupSize,
    attraction.season,
    attraction.time,
    attraction.dietaryRestrictions,
    attraction.description,
    attraction.imageUrl,
  ]);
}

async function seed(): Promise<void> {
  try {
    applicationContext = await NestFactory.createApplicationContext(AppModule, {
      abortOnError: false,
      logger: false,
    });
    const database = applicationContext.get(DatabaseService);
    const target = database.getTarget();

    console.info(
      `[database] Seeding attractions in ${target.host}:${target.port}/${target.database}.`,
    );

    const result = await database.query(
      `
        INSERT INTO attractions (
          name,
          activity,
          price,
          location,
          effort,
          group_size,
          season,
          time,
          dietary_restrictions,
          description,
          image_url
        )
        VALUES ${createValuePlaceholders()}
        ON CONFLICT (name) DO UPDATE SET
          activity = EXCLUDED.activity,
          price = EXCLUDED.price,
          location = EXCLUDED.location,
          effort = EXCLUDED.effort,
          group_size = EXCLUDED.group_size,
          season = EXCLUDED.season,
          time = EXCLUDED.time,
          dietary_restrictions = EXCLUDED.dietary_restrictions,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          updated_at = CURRENT_TIMESTAMP
      `,
      createParameters(),
    );

    console.info(
      `[database] Seed completed (${result.rowCount ?? 0} attraction records inserted or updated).`,
    );
  } catch (error) {
    console.error(
      `[database] Attraction seed failed: ${getSafeErrorDetails(error)}`,
    );
    process.exitCode = 1;
  } finally {
    if (applicationContext) {
      try {
        await applicationContext.close();
      } catch (error) {
        console.error(
          `[database] Pool shutdown failed: ${getSafeErrorDetails(error)}`,
        );
        process.exitCode = 1;
      }
    }
  }
}

void seed();
