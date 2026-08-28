import { BadRequestException } from "@nestjs/common";
import type { PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { ValidationError } from "class-validator";
import {
  ATTRACTION_FILTER_VALUES,
  type AttractionFilterKey,
} from "../attraction.types";
import { AttractionsQueryDto } from "./attractions-query.dto";

const INVALID_QUERY_RESPONSE = {
  error: "Invalid query parameters.",
} as const;

const SUPPORTED_QUERY_PARAMETERS = new Set<AttractionFilterKey>(
  Object.keys(ATTRACTION_FILTER_VALUES) as AttractionFilterKey[],
);

function getValidationDetails(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const details = Object.values(error.constraints ?? {});

    return details.length > 0
      ? details
      : [`${error.property} is not a valid query parameter.`];
  });
}

function invalidQuery(details: string[]): BadRequestException {
  return new BadRequestException({
    ...INVALID_QUERY_RESPONSE,
    details,
  });
}

export class AttractionsQueryValidationPipe
  implements PipeTransform<unknown, Promise<AttractionsQueryDto>>
{
  async transform(value: unknown): Promise<AttractionsQueryDto> {
    const query = value ?? {};

    if (typeof query !== "object" || Array.isArray(query)) {
      throw invalidQuery(["Query parameters must be an object."]);
    }

    const details: string[] = [];

    for (const [parameter, parameterValue] of Object.entries(query)) {
      if (
        !SUPPORTED_QUERY_PARAMETERS.has(parameter as AttractionFilterKey)
      ) {
        details.push(`${parameter} is not a supported query parameter.`);
        continue;
      }

      if (Array.isArray(parameterValue)) {
        details.push(`${parameter} must be provided only once.`);
        continue;
      }

      if (typeof parameterValue !== "string") {
        details.push(`${parameter} must be a single string value.`);
        continue;
      }

      if (parameterValue.trim().length === 0) {
        details.push(`${parameter} must not be empty.`);
      }
    }

    if (details.length > 0) {
      throw invalidQuery(details);
    }

    const queryDto = plainToInstance(AttractionsQueryDto, query);
    const validationErrors = await validate(queryDto, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      whitelist: true,
    });

    if (validationErrors.length > 0) {
      throw invalidQuery(getValidationDetails(validationErrors));
    }

    return queryDto;
  }
}
