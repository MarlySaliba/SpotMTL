import {
  Controller,
  Get,
  Header,
  Inject,
  UseGuards,
} from "@nestjs/common";
import { USER_ROLES } from "./auth.constants";
import { AuthService } from "./auth.service";
import type { AdminUserRow } from "./auth.types";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guards/roles.guard";
import { SessionGuard } from "./guards/session.guard";

@Controller("admin/users")
@UseGuards(SessionGuard, RolesGuard)
@Roles(USER_ROLES.ADMINISTRATOR)
export class AdminUsersController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  @Get()
  @Header("Cache-Control", "no-store")
  findAll(): Promise<AdminUserRow[]> {
    return this.authService.listUsers();
  }
}
