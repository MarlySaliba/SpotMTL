import { Module } from "@nestjs/common";
import { AttractionsModule } from "./attractions/attractions.module";
import { ApplicationConfigModule } from "./config/application-config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ApplicationConfigModule,
    DatabaseModule,
    HealthModule,
    AttractionsModule,
  ],
})
export class AppModule {}
