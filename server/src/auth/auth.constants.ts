export const AUTH_COOKIE_NAME = "spotmtl_session";
export const AUTH_REQUEST_HEADER = "x-spotmtl-request";
export const AUTH_REQUEST_HEADER_VALUE = "1";
export const AUTH_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1_000;

export const USER_ROLES = {
  USER: "user",
  ADMINISTRATOR: "administrator",
} as const;
