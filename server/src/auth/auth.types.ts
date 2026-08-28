import type { Request } from "express";
import type { QueryResultRow } from "pg";
import type { USER_ROLES } from "./auth.constants";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserCredentialRow extends PublicUser, QueryResultRow {
  passwordHash: string;
}

export interface UserSessionRow extends PublicUser, QueryResultRow {}

export interface AdminUserRow extends PublicUser, QueryResultRow {
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  sessionToken: string;
  user: PublicUser;
}

export interface AuthenticatedSession {
  expiresAt: Date;
  token: string;
  user: PublicUser;
}
