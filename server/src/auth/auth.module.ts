import { Module } from "@nestjs/common";
import { AdminUsersController } from "./admin-users.controller";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RolesGuard } from "./guards/roles.guard";
import { SessionGuard } from "./guards/session.guard";
import { PasswordService } from "./password.service";

@Module({
  controllers: [AuthController, AdminUsersController],
  providers: [AuthService, PasswordService, SessionGuard, RolesGuard],
  exports: [AuthService, SessionGuard, RolesGuard],
})
export class AuthModule {}
