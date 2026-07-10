import {
  Controller,
  Get,
  Inject,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { getSafeErrorDetails } from "../common/logging/safe-error";
import { DatabaseService } from "../database/database.service";

@Controller("health")
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getProcessHealth(): { status: "ok" } {
    return { status: "ok" };
  }

  @Get("database")
  async getDatabaseHealth(): Promise<{
    status: "ok";
    database: "connected";
    databaseTime: Date;
    latencyMs: number;
  }> {
    try {
      const health = await this.databaseService.verifyConnection();

      return {
        status: "ok",
        database: "connected",
        databaseTime: health.serverTime,
        latencyMs: health.latencyMs,
      };
    } catch (error) {
      this.logger.error(
        `PostgreSQL health check failed: ${getSafeErrorDetails(error)}`,
      );
      throw new ServiceUnavailableException({
        status: "error",
        database: "unavailable",
      });
    }
  }
}
