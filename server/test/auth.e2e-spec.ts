import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AdminUsersController } from "../src/auth/admin-users.controller";
import { AUTH_REQUEST_HEADER } from "../src/auth/auth.constants";
import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";
import type { PublicUser } from "../src/auth/auth.types";
import { RolesGuard } from "../src/auth/guards/roles.guard";
import { SessionGuard } from "../src/auth/guards/session.guard";
import { ApplicationConfigService } from "../src/config/application-config.service";
import { configureApplication } from "../src/configure-application";

const normalUser: PublicUser = {
  id: "a0f8bf09-9cb1-47d0-b11a-47a2d3372904",
  name: "Alexa Test",
  email: "alexa@example.com",
  role: "user",
};

const administrator: PublicUser = {
  ...normalUser,
  role: "administrator",
};

describe("authentication endpoints", () => {
  const register = jest.fn();
  const login = jest.fn();
  const authenticateSession = jest.fn();
  const revokeSession = jest.fn();
  const listUsers = jest.fn();
  let app: NestExpressApplication;

  beforeEach(async () => {
    jest.clearAllMocks();
    register.mockResolvedValue({
      token: "register-session-token",
      expiresAt: new Date(Date.now() + 60_000),
      user: normalUser,
    });
    login.mockResolvedValue({
      token: "login-session-token",
      expiresAt: new Date(Date.now() + 60_000),
      user: normalUser,
    });
    authenticateSession.mockResolvedValue(normalUser);
    revokeSession.mockResolvedValue(undefined);
    listUsers.mockResolvedValue([normalUser]);

    const moduleReference = await Test.createTestingModule({
      controllers: [AuthController, AdminUsersController],
      providers: [
        SessionGuard,
        RolesGuard,
        {
          provide: AuthService,
          useValue: {
            authenticateSession,
            listUsers,
            login,
            register,
            revokeSession,
          },
        },
        {
          provide: ApplicationConfigService,
          useValue: { server: { nodeEnv: "test" } },
        },
      ],
    }).compile();

    app = moduleReference.createNestApplication<NestExpressApplication>({
      bodyParser: false,
    });
    configureApplication(app, {
      nodeEnv: "test",
      port: 0,
      clientOrigin: "http://localhost:5173",
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("registers only name, email, and password and sets an HttpOnly cookie", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/register")
      .set(AUTH_REQUEST_HEADER, "1")
      .send({
        name: " Alexa Test ",
        email: " Alexa@Example.COM ",
        password: "correct horse battery staple",
      })
      .expect(201)
      .expect({ user: normalUser });

    expect(register).toHaveBeenCalledWith({
      name: "Alexa Test",
      email: "alexa@example.com",
      password: "correct horse battery staple",
    });
    expect(JSON.stringify(response.body)).not.toMatch(/session|password/i);
    const cookie = response.headers["set-cookie"]?.[0] ?? "";
    expect(cookie).toContain("spotmtl_session=register-session-token");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/api");
    expect(cookie).not.toContain("Domain=");
    expect(cookie).not.toContain("Secure");
  });

  it.each([
    ["role", "administrator"],
    ["isAdmin", true],
  ])("rejects the client privilege field %s before registration", async (field, value) => {
    await request(app.getHttpServer())
      .post("/api/auth/register")
      .set(AUTH_REQUEST_HEADER, "1")
      .send({
        name: "Alexa Test",
        email: "alexa@example.com",
        password: "correct horse battery staple",
        [field]: value,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe("Invalid request body.");
      });

    expect(register).not.toHaveBeenCalled();
  });

  it("rejects unsafe requests without the application verification header", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: normalUser.email, password: "a password" })
      .expect(403)
      .expect({ error: "Request verification failed." });

    expect(login).not.toHaveBeenCalled();
  });

  it("logs in, resolves the current user, and clears the session on logout", async () => {
    const loginResponse = await request(app.getHttpServer())
      .post("/api/auth/login")
      .set(AUTH_REQUEST_HEADER, "1")
      .send({
        email: normalUser.email,
        password: "correct horse battery staple",
      })
      .expect(200)
      .expect({ user: normalUser });
    const cookie = loginResponse.headers["set-cookie"]?.[0].split(";")[0];

    await request(app.getHttpServer())
      .get("/api/auth/me")
      .set("Cookie", cookie)
      .expect(200)
      .expect({ user: normalUser });
    expect(authenticateSession).toHaveBeenCalledWith("login-session-token");

    const logoutResponse = await request(app.getHttpServer())
      .post("/api/auth/logout")
      .set(AUTH_REQUEST_HEADER, "1")
      .set("Cookie", cookie)
      .expect(204);
    expect(revokeSession).toHaveBeenCalledWith("login-session-token");
    expect(logoutResponse.headers["set-cookie"]?.[0]).toContain(
      "spotmtl_session=;",
    );
  });

  it("enforces the administrator role using the server-loaded session user", async () => {
    await request(app.getHttpServer())
      .get("/api/admin/users")
      .set("Cookie", "spotmtl_session=user-token")
      .expect(403)
      .expect({ error: "Administrator access required." });
    expect(listUsers).not.toHaveBeenCalled();

    authenticateSession.mockResolvedValueOnce(administrator);
    listUsers.mockResolvedValueOnce([administrator]);
    await request(app.getHttpServer())
      .get("/api/admin/users")
      .set("Cookie", "spotmtl_session=admin-token")
      .expect(200)
      .expect([administrator]);
  });

  it("supports credentialed CORS only for the configured origin", async () => {
    const allowed = await request(app.getHttpServer())
      .options("/api/auth/login")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "X-SpotMTL-Request,Content-Type")
      .expect(204);

    expect(allowed.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(allowed.headers["access-control-allow-credentials"]).toBe("true");

    const blocked = await request(app.getHttpServer())
      .options("/api/auth/login")
      .set("Origin", "https://attacker.example")
      .set("Access-Control-Request-Method", "POST");
    expect(blocked.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
