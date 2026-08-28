import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Express, NextFunction, Request, Response } from "express";
import {
  AUTH_REQUEST_HEADER,
  AUTH_REQUEST_HEADER_VALUE,
} from "./auth/auth.constants";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import type { ServerConfiguration } from "./config/environment";

export function configureApplication(
  app: NestExpressApplication,
  configuration: ServerConfiguration,
): void {
  const expressApplication = app.getHttpAdapter().getInstance() as Express;

  expressApplication.disable("x-powered-by");
  expressApplication.use(
    (request: Request, response: Response, next: NextFunction) => {
      if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(request.method) &&
        request.headers[AUTH_REQUEST_HEADER] !== AUTH_REQUEST_HEADER_VALUE
      ) {
        response.status(403).json({ error: "Request verification failed." });
        return;
      }

      next();
    },
  );
  app.useBodyParser("json", { limit: "1mb" });
  app.enableCors({
    allowedHeaders: ["Content-Type", "X-SpotMTL-Request"],
    credentials: true,
    origin: (origin, callback) => {
      callback(null, !origin || origin === configuration.clientOrigin);
    },
  });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new AllExceptionsFilter());
}
