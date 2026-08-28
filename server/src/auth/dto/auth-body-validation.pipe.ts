import { BadRequestException, ValidationPipe } from "@nestjs/common";
import type { Type } from "@nestjs/common";
import type { ValidationError } from "class-validator";

function getValidationDetails(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const details = Object.values(error.constraints ?? {});
    return details.length > 0 ? details : [`${error.property} is invalid.`];
  });
}

export function createAuthBodyValidationPipe(
  expectedType: Type<unknown>,
): ValidationPipe {
  return new ValidationPipe({
    exceptionFactory: (errors) =>
      new BadRequestException({
        error: "Invalid request body.",
        details: getValidationDetails(errors),
      }),
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    stopAtFirstError: true,
    transform: true,
    whitelist: true,
    expectedType,
  });
}
