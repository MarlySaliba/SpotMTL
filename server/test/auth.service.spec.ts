import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { createHash } from "node:crypto";
import { AuthService } from "../src/auth/auth.service";
import type { PasswordService } from "../src/auth/password.service";
import type { DatabaseService } from "../src/database/database.service";

const publicUser = {
  id: "a0f8bf09-9cb1-47d0-b11a-47a2d3372904",
  name: "Alexa Test",
  email: "alexa@example.com",
  role: "user" as const,
};

describe("AuthService", () => {
  const query = jest.fn();
  const hash = jest.fn();
  const verify = jest.fn();
  let service: AuthService;

  beforeEach(() => {
    query.mockReset();
    hash.mockReset();
    verify.mockReset();
    service = new AuthService(
      { query } as unknown as DatabaseService,
      { hash, verify } as unknown as PasswordService,
    );
  });

  it("registers a normalized user and assigns the user role server-side", async () => {
    hash.mockResolvedValue("scrypt$stored-password-hash");
    query.mockResolvedValue({ rows: [publicUser] });

    const session = await service.register({
      name: " Alexa Test ",
      email: " Alexa@Example.COM ",
      password: "correct horse battery staple",
    });

    expect(hash).toHaveBeenCalledWith("correct horse battery staple");
    const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("'user'");
    expect(sql).not.toContain("correct horse battery staple");
    expect(parameters).toContain("Alexa Test");
    expect(parameters).toContain("alexa@example.com");
    expect(parameters).toContain("scrypt$stored-password-hash");
    expect(parameters).not.toContain("correct horse battery staple");
    expect(parameters).not.toContain(session.token);
    expect(session.user).toEqual(publicUser);
    expect(session).not.toHaveProperty("passwordHash");
  });

  it("maps a duplicate normalized email to a conflict", async () => {
    hash.mockResolvedValue("scrypt$stored-password-hash");
    query.mockRejectedValue({ code: "23505" });

    await expect(
      service.register({
        name: "Duplicate User",
        email: "duplicate@example.com",
        password: "correct horse battery staple",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("returns the same login error for an unknown email and a wrong password", async () => {
    query.mockResolvedValueOnce({ rows: [] });
    verify.mockResolvedValueOnce(false);

    const unknownEmail = service.login({
      email: "missing@example.com",
      password: "not-the-password",
    });
    await expect(unknownEmail).rejects.toEqual(
      new UnauthorizedException({ error: "Invalid email or password." }),
    );
    expect(verify).toHaveBeenCalledWith("not-the-password", undefined);

    query.mockResolvedValueOnce({
      rows: [{ ...publicUser, passwordHash: "scrypt$stored" }],
    });
    verify.mockResolvedValueOnce(false);

    const wrongPassword = service.login({
      email: publicUser.email,
      password: "not-the-password",
    });
    await expect(wrongPassword).rejects.toEqual(
      new UnauthorizedException({ error: "Invalid email or password." }),
    );
  });

  it("stores only a hash of the session token after a successful login", async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ ...publicUser, passwordHash: "scrypt$stored" }],
      })
      .mockResolvedValueOnce({ rows: [] });
    verify.mockResolvedValue(true);

    const session = await service.login({
      email: "ALEXA@EXAMPLE.COM",
      password: "correct horse battery staple",
    });

    const [selectSql, selectParameters] = query.mock.calls[0] as [
      string,
      unknown[],
    ];
    expect(selectSql).not.toContain("ALEXA@EXAMPLE.COM");
    expect(selectParameters).toEqual(["alexa@example.com"]);

    const [, insertParameters] = query.mock.calls[1] as [string, unknown[]];
    expect(insertParameters[0]).toBe(
      createHash("sha256").update(session.token).digest("hex"),
    );
    expect(insertParameters).not.toContain(session.token);
    expect(session.user).toEqual(publicUser);
    expect(session.user).not.toHaveProperty("passwordHash");
  });

  it("loads the current database role for every authenticated request", async () => {
    query.mockResolvedValue({
      rows: [{ ...publicUser, role: "administrator" }],
    });

    const user = await service.authenticateSession("browser-session-token");

    expect(user?.role).toBe("administrator");
    const [sql, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("INNER JOIN users");
    expect(sql).toContain("expires_at > CURRENT_TIMESTAMP");
    expect(parameters[0]).toBe(
      createHash("sha256").update("browser-session-token").digest("hex"),
    );
  });

  it("revokes sessions using a token hash", async () => {
    query.mockResolvedValue({ rows: [] });

    await service.revokeSession("browser-session-token");

    const [, parameters] = query.mock.calls[0] as [string, unknown[]];
    expect(parameters).toEqual([
      createHash("sha256").update("browser-session-token").digest("hex"),
    ]);
  });
});
