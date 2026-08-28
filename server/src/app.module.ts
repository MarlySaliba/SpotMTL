import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
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
    AuthModule,
  ],
})
export class AppModule {}
