import { IsIn, IsOptional } from "class-validator";
import {
  ATTRACTION_FILTER_VALUES,
  type AttractionActivity,
  type AttractionDietaryRestrictions,
  type AttractionEffort,
  type AttractionFilters,
  type AttractionGroupSize,
  type AttractionLocation,
  type AttractionPrice,
  type AttractionSeason,
  type AttractionTime,
} from "../attraction.types";

export class AttractionsQueryDto implements AttractionFilters {
  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.activity, {
    message: `activity must be one of: ${ATTRACTION_FILTER_VALUES.activity.join(", ")}.`,
  })
  activity?: AttractionActivity;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.price, {
    message: `price must be one of: ${ATTRACTION_FILTER_VALUES.price.join(", ")}.`,
  })
  price?: AttractionPrice;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.location, {
    message: `location must be one of: ${ATTRACTION_FILTER_VALUES.location.join(", ")}.`,
  })
  location?: AttractionLocation;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.effort, {
    message: `effort must be one of: ${ATTRACTION_FILTER_VALUES.effort.join(", ")}.`,
  })
  effort?: AttractionEffort;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.groupSize, {
    message: `groupSize must be one of: ${ATTRACTION_FILTER_VALUES.groupSize.join(", ")}.`,
  })
  groupSize?: AttractionGroupSize;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.season, {
    message: `season must be one of: ${ATTRACTION_FILTER_VALUES.season.join(", ")}.`,
  })
  season?: AttractionSeason;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.time, {
    message: `time must be one of: ${ATTRACTION_FILTER_VALUES.time.join(", ")}.`,
  })
  time?: AttractionTime;

  @IsOptional()
  @IsIn(ATTRACTION_FILTER_VALUES.dietaryRestrictions, {
    message: `dietaryRestrictions must be one of: ${ATTRACTION_FILTER_VALUES.dietaryRestrictions.join(", ")}.`,
  })
  dietaryRestrictions?: AttractionDietaryRestrictions;
}
