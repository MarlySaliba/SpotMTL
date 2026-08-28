import type { QueryResultRow } from "pg";

export const ATTRACTION_FILTER_VALUES = {
  activity: [
    "Not Specified",
    "Hiking",
    "Skiing",
    "Museum",
    "Escape Room",
    "Eating Out",
    "Dining In",
  ],
  price: ["Not Specified", "Free", "$", "$$", "$$$"],
  location: [
    "Not Specified",
    "Downtown",
    "Nature",
    "Suburbs",
    "Chinatown",
  ],
  effort: ["Not Specified", "Low", "Medium", "High"],
  groupSize: ["Not Specified", "Solo", "Couple", "Family", "Group"],
  season: ["Not Specified", "Summer", "Fall", "Winter", "Spring"],
  time: ["Not Specified", "Morning", "Afternoon", "Evening"],
  dietaryRestrictions: [
    "Not Specified",
    "Vegan",
    "Vegetarian",
    "Halal",
  ],
} as const;

export type AttractionFilterKey = keyof typeof ATTRACTION_FILTER_VALUES;
export type AttractionActivity =
  (typeof ATTRACTION_FILTER_VALUES.activity)[number];
export type AttractionPrice =
  (typeof ATTRACTION_FILTER_VALUES.price)[number];
export type AttractionLocation =
  (typeof ATTRACTION_FILTER_VALUES.location)[number];
export type AttractionEffort =
  (typeof ATTRACTION_FILTER_VALUES.effort)[number];
export type AttractionGroupSize =
  (typeof ATTRACTION_FILTER_VALUES.groupSize)[number];
export type AttractionSeason =
  (typeof ATTRACTION_FILTER_VALUES.season)[number];
export type AttractionTime = (typeof ATTRACTION_FILTER_VALUES.time)[number];
export type AttractionDietaryRestrictions =
  (typeof ATTRACTION_FILTER_VALUES.dietaryRestrictions)[number];

export interface AttractionFilters {
  activity?: AttractionActivity;
  price?: AttractionPrice;
  location?: AttractionLocation;
  effort?: AttractionEffort;
  groupSize?: AttractionGroupSize;
  season?: AttractionSeason;
  time?: AttractionTime;
  dietaryRestrictions?: AttractionDietaryRestrictions;
}

export interface Attraction {
  id: number;
  name: string;
  activity: AttractionActivity;
  price: AttractionPrice;
  location: AttractionLocation;
  effort: AttractionEffort;
  groupSize: AttractionGroupSize;
  season: AttractionSeason;
  time: AttractionTime;
  dietaryRestrictions: AttractionDietaryRestrictions;
  description: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttractionRow extends Attraction, QueryResultRow {}
