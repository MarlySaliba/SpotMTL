import type { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { QueryResultRow } from "pg";
import { AppModule } from "../src/app.module";
import { USER_ROLES } from "../src/auth/auth.constants";
import type { UserRole } from "../src/auth/auth.types";
import { getSafeErrorDetails } from "../src/common/logging/safe-error";
import { DatabaseService } from "../src/database/database.service";

let applicationContext: INestApplicationContext | undefined;

interface RoleUpdateRow extends QueryResultRow {
  email: string;
  role: UserRole;
}

function getArguments(): { email: string; role: UserRole } {
  const email = process.argv[2]?.trim().toLowerCase() ?? "";
  const role = process.argv[3]?.trim() ?? "";
  const supportedRoles = Object.values(USER_ROLES) as string[];

  if (!email || !email.includes("@")) {
    throw new Error("Provide the existing user's email address.");
  }

  if (!supportedRoles.includes(role)) {
    throw new Error(
      `Role must be ${USER_ROLES.USER} or ${USER_ROLES.ADMINISTRATOR}.`,
    );
  }

  return { email, role: role as UserRole };
}

async function setUserRole(): Promise<void> {
  try {
    const { email, role } = getArguments();
    applicationContext = await NestFactory.createApplicationContext(AppModule, {
      abortOnError: false,
      logger: false,
    });
    const database = applicationContext.get(DatabaseService);
    const result = await database.query<RoleUpdateRow>(
      `UPDATE users
      SET role = $2, updated_at = CURRENT_TIMESTAMP
      WHERE email = $1
      RETURNING email, role`,
      [email, role],
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error("No account exists with that email address.");
    }

    console.info(`[database] Updated ${user.email} to role ${user.role}.`);
  } catch (error) {
    console.error(`[database] Role update failed: ${getSafeErrorDetails(error)}`);
    process.exitCode = 1;
  } finally {
    if (applicationContext) {
      await applicationContext.close();
    }
  }
}

void setUserRole();
