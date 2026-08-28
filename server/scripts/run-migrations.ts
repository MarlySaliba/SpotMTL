import path from "node:path";
import type { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getSafeErrorDetails } from "../src/common/logging/safe-error";
import { ApplicationConfigModule } from "../src/config/application-config.module";
import { ApplicationConfigService } from "../src/config/application-config.service";

type MigrationDirection = "up" | "down";

let applicationContext: INestApplicationContext | undefined;

function getDirection(argument: string | undefined): MigrationDirection {
  if (!argument || argument === "up") {
    return "up";
  }

  if (argument === "down") {
    return "down";
  }

  throw new Error('Migration direction must be either "up" or "down".');
}

async function runMigrations(): Promise<void> {
  try {
    const direction = getDirection(process.argv[2]);
    applicationContext = await NestFactory.createApplicationContext(
      ApplicationConfigModule,
      {
        abortOnError: false,
        logger: false,
      },
    );

    const configuration = applicationContext.get(ApplicationConfigService);
    const target = configuration.database.target;
    const { runner } = await import("node-pg-migrate");

    console.info(
      `[database] Running ${direction} migrations on ${target.host}:${target.port}/${target.database}.`,
    );

    const migrations = await runner({
      databaseUrl: configuration.database.poolOptions,
      dir: path.join(__dirname, "..", "migrations"),
      direction,
      count: direction === "down" ? 1 : undefined,
      migrationsTable: "pgmigrations",
      checkOrder: true,
      singleTransaction: true,
    });

    console.info(
      `[database] Migration command completed (${migrations.length} migration${migrations.length === 1 ? "" : "s"} applied).`,
    );
  } catch (error) {
    console.error(
      `[database] Migration command failed: ${getSafeErrorDetails(error)}`,
    );
    process.exitCode = 1;
  } finally {
    if (applicationContext) {
      try {
        await applicationContext.close();
      } catch (error) {
        console.error(
          `[database] Application shutdown failed: ${getSafeErrorDetails(error)}`,
        );
        process.exitCode = 1;
      }
    }
  }
}

void runMigrations();
