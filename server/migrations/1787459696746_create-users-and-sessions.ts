import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    name: {
      type: "varchar(80)",
      notNull: true,
    },
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "text",
      notNull: true,
    },
    role: {
      type: "varchar(32)",
      notNull: true,
      default: pgm.func("'user'"),
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("users", "users_role_check", {
    check: "role IN ('user', 'administrator')",
  });
  pgm.addConstraint("users", "users_email_normalized_check", {
    check: "email = LOWER(email)",
  });

  pgm.createTable("user_sessions", {
    token_hash: {
      type: "char(64)",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createIndex("user_sessions", "user_id");
  pgm.createIndex("user_sessions", "expires_at");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("user_sessions");
  pgm.dropTable("users");
}
