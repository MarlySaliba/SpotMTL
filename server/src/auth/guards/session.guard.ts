import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthService } from "../auth.service";
import type { AuthenticatedRequest } from "../auth.types";
import { getSessionCookie } from "../session-cookie";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sessionToken = getSessionCookie(request);
    const user = await this.authService.authenticateSession(sessionToken);

    if (!sessionToken || !user) {
      throw new UnauthorizedException({ error: "Authentication required." });
    }

    request.sessionToken = sessionToken;
    request.user = user;
    return true;
  }
}
