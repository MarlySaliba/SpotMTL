import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { ApplicationConfigService } from "../config/application-config.service";
import { AUTH_COOKIE_NAME } from "./auth.constants";
import { AuthService } from "./auth.service";
import type { PublicUser } from "./auth.types";
import { CurrentUser } from "./decorators/current-user.decorator";
import { createAuthBodyValidationPipe } from "./dto/auth-body-validation.pipe";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SessionGuard } from "./guards/session.guard";
import {
  getSessionCookie,
  getSessionCookieOptions,
} from "./session-cookie";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ApplicationConfigService)
    private readonly configuration: ApplicationConfigService,
  ) {}

  @Post("register")
  @Header("Cache-Control", "no-store")
  async register(
    @Body(createAuthBodyValidationPipe(RegisterDto)) input: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.authService.register(input);
    response.cookie(
      AUTH_COOKIE_NAME,
      session.token,
      getSessionCookieOptions(this.configuration.server.nodeEnv),
    );

    return { user: session.user };
  }

  @Post("login")
  @HttpCode(200)
  @Header("Cache-Control", "no-store")
  async login(
    @Body(createAuthBodyValidationPipe(LoginDto)) input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.authService.login(input);
    response.cookie(
      AUTH_COOKIE_NAME,
      session.token,
      getSessionCookieOptions(this.configuration.server.nodeEnv),
    );

    return { user: session.user };
  }

  @Get("me")
  @UseGuards(SessionGuard)
  @Header("Cache-Control", "no-store")
  getCurrentUser(@CurrentUser() user: PublicUser): { user: PublicUser } {
    return { user };
  }

  @Post("logout")
  @HttpCode(204)
  @Header("Cache-Control", "no-store")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.revokeSession(getSessionCookie(request));
    response.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      path: "/api",
      sameSite: "lax",
      secure: this.configuration.server.nodeEnv === "production",
    });
  }
}
