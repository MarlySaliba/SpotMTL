import type { CookieOptions, Request } from "express";
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_TTL_MS,
} from "./auth.constants";

export function getSessionCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  for (const cookie of cookieHeader.split(";")) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const name = cookie.slice(0, separatorIndex).trim();
    if (name === AUTH_COOKIE_NAME) {
      return cookie.slice(separatorIndex + 1).trim() || undefined;
    }
  }

  return undefined;
}

export function getSessionCookieOptions(nodeEnv: string): CookieOptions {
  return {
    httpOnly: true,
    maxAge: AUTH_SESSION_TTL_MS,
    path: "/api",
    sameSite: "lax",
    secure: nodeEnv === "production",
  };
}
