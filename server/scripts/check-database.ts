import { Logger } from "@nestjs/common";
import type { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { getSafeErrorDetails } from "../src/common/logging/safe-error";
import { DatabaseService } from "../src/database/database.service";

const logger = new Logger("DatabaseCheck");
let applicationContext: INestApplicationContext | undefined;

async function checkDatabase(): Promise<void> {
  try {
    applicationContext = await NestFactory.createApplicationContext(AppModule, {
      abortOnError: false,
      logger: false,
    });
    const databaseService = applicationContext.get(DatabaseService);
    const target = databaseService.getTarget();

    console.info(
      `[database] Checking ${target.host}:${target.port}/${target.database}.`,
    );
    const health = await databaseService.verifyConnection();
    console.info(`[database] Connected successfully in ${health.latencyMs}ms.`);
  } catch (error) {
    logger.error(`Connection check failed: ${getSafeErrorDetails(error)}`);
    process.exitCode = 1;
  } finally {
    if (applicationContext) {
      try {
        await applicationContext.close();
      } catch (error) {
        logger.error(`Pool shutdown failed: ${getSafeErrorDetails(error)}`);
        process.exitCode = 1;
      }
    }
  }
}

void checkDatabase();
