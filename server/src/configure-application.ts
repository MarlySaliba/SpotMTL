import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Express } from "express";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import type { ServerConfiguration } from "./config/environment";

export function configureApplication(
  app: NestExpressApplication,
  configuration: ServerConfiguration,
): void {
  const expressApplication = app.getHttpAdapter().getInstance() as Express;

  expressApplication.disable("x-powered-by");
  app.useBodyParser("json", { limit: "1mb" });
  app.enableCors({ origin: configuration.clientOrigin });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new AllExceptionsFilter());
}
