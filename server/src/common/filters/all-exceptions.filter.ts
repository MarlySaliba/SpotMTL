import { Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import type { Response } from "express";
import { getSafeErrorDetails } from "../logging/safe-error";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      if (status === HttpStatus.NOT_FOUND) {
        response.status(status).json({ error: "Route not found." });
        return;
      }

      const exceptionResponse = exception.getResponse();
      response
        .status(status)
        .json(
          typeof exceptionResponse === "string"
            ? { error: exceptionResponse }
            : exceptionResponse,
        );
      return;
    }

    this.logger.error(
      `Unhandled request error: ${getSafeErrorDetails(exception)}`,
    );
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error." });
  }
}
