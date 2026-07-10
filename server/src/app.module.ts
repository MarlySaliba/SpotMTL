import { Module } from "@nestjs/common";
import { ApplicationConfigModule } from "./config/application-config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [ApplicationConfigModule, DatabaseModule, HealthModule],
})
export class AppModule {}
