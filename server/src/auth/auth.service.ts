import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import {
  AUTH_SESSION_TTL_MS,
  USER_ROLES,
} from "./auth.constants";
import type {
  AdminUserRow,
  AuthenticatedSession,
  PublicUser,
  UserCredentialRow,
  UserSessionRow,
} from "./auth.types";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import { PasswordService } from "./password.service";

const PUBLIC_USER_COLUMNS = `
  id,
  name,
  email,
  role`;

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function invalidCredentials(): UnauthorizedException {
  return new UnauthorizedException({ error: "Invalid email or password." });
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
    @Inject(PasswordService)
    private readonly passwordService: PasswordService,
  ) {}

  async register(input: RegisterDto): Promise<AuthenticatedSession> {
    const id = randomUUID();
    const email = input.email.trim().toLowerCase();
    const passwordHash = await this.passwordService.hash(input.password);
    const session = this.createSessionDetails();

    try {
      const result = await this.databaseService.query<UserSessionRow>(
        `WITH new_user AS (
          INSERT INTO users (id, name, email, password_hash, role)
          VALUES ($1, $2, $3, $4, '${USER_ROLES.USER}')
          RETURNING ${PUBLIC_USER_COLUMNS}
        ), new_session AS (
          INSERT INTO user_sessions (token_hash, user_id, expires_at)
          SELECT $5, id, $6 FROM new_user
          RETURNING token_hash
        )
        SELECT ${PUBLIC_USER_COLUMNS} FROM new_user`,
        [
          id,
          input.name.trim(),
          email,
          passwordHash,
          hashSessionToken(session.token),
          session.expiresAt,
        ],
      );

      const user = result.rows[0];
      if (!user) {
        throw new Error("PostgreSQL did not return the registered user.");
      }

      return { ...session, user };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException({
          error: "An account with this email already exists.",
        });
      }

      throw error;
    }
  }

  async login(input: LoginDto): Promise<AuthenticatedSession> {
    const email = input.email.trim().toLowerCase();
    const result = await this.databaseService.query<UserCredentialRow>(
      `SELECT
        ${PUBLIC_USER_COLUMNS},
        password_hash AS "passwordHash"
      FROM users
      WHERE email = $1`,
      [email],
    );
    const user = result.rows[0];
    const passwordIsValid = await this.passwordService.verify(
      input.password,
      user?.passwordHash,
    );

    if (!user || !passwordIsValid) {
      throw invalidCredentials();
    }

    const session = this.createSessionDetails();
    await this.databaseService.query(
      `WITH expired_sessions AS (
        DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP
      )
      INSERT INTO user_sessions (token_hash, user_id, expires_at)
      VALUES ($1, $2, $3)`,
      [hashSessionToken(session.token), user.id, session.expiresAt],
    );

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return { ...session, user: publicUser };
  }

  async authenticateSession(token?: string): Promise<PublicUser | null> {
    if (!token || token.length > 200) {
      return null;
    }

    const result = await this.databaseService.query<UserSessionRow>(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role
      FROM user_sessions AS sessions
      INNER JOIN users AS u ON u.id = sessions.user_id
      WHERE sessions.token_hash = $1
        AND sessions.expires_at > CURRENT_TIMESTAMP`,
      [hashSessionToken(token)],
    );

    return result.rows[0] ?? null;
  }

  async revokeSession(token?: string): Promise<void> {
    if (!token || token.length > 200) {
      return;
    }

    await this.databaseService.query(
      "DELETE FROM user_sessions WHERE token_hash = $1",
      [hashSessionToken(token)],
    );
  }

  async listUsers(): Promise<AdminUserRow[]> {
    const result = await this.databaseService.query<AdminUserRow>(
      `SELECT
        ${PUBLIC_USER_COLUMNS},
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      ORDER BY created_at ASC, id ASC`,
    );

    return result.rows;
  }

  private createSessionDetails(): Omit<AuthenticatedSession, "user"> {
    return {
      token: randomBytes(32).toString("base64url"),
      expiresAt: new Date(Date.now() + AUTH_SESSION_TTL_MS),
    };
  }
}
