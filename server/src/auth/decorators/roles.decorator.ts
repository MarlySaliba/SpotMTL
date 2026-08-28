import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "../auth.types";

export const ROLES_METADATA_KEY = "spotmtl.roles";
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
