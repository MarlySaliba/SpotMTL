import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { getSafeErrorDetails } from "./common/logging/safe-error";
import { ApplicationConfigService } from "./config/application-config.service";
import { configureApplication } from "./configure-application";
import { DatabaseService } from "./database/database.service";

const logger = new Logger("Bootstrap");

async function bootstrap(): Promise<void> {
  let app: NestExpressApplication | undefined;

  try {
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      abortOnError: false,
      bodyParser: false,
    });

    const configuration = app.get(ApplicationConfigService);
    const databaseService = app.get(DatabaseService);
    const databaseTarget = databaseService.getTarget();

    configureApplication(app, configuration.server);
    app.enableShutdownHooks(["SIGINT", "SIGTERM"]);

    logger.log(
      `Verifying PostgreSQL at ${databaseTarget.host}:${databaseTarget.port}/${databaseTarget.database} (${databaseTarget.source}).`,
    );
    const databaseHealth = await databaseService.verifyConnection();
    logger.log(
      `PostgreSQL connection verified in ${databaseHealth.latencyMs}ms.`,
    );

    await app.listen(configuration.server.port);
    logger.log(
      `SpotMTL API listening on http://localhost:${configuration.server.port} (${configuration.server.nodeEnv}).`,
    );
  } catch (error) {
    logger.error(
      `PostgreSQL verification failed; the API was not started: ${getSafeErrorDetails(error)}`,
    );

    if (app) {
      try {
        await app.close();
      } catch (closeError) {
        logger.error(
          `Failed to close the Nest application: ${getSafeErrorDetails(closeError)}`,
        );
      }
    }

    process.exitCode = 1;
  }
}

void bootstrap();
