import path from "node:path";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationConfigService } from "./application-config.service";
import { validateEnvironment } from "./environment";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: path.join(__dirname, "..", "..", ".env"),
      isGlobal: true,
      skipProcessEnv: true,
      validate: validateEnvironment,
    }),
  ],
  providers: [ApplicationConfigService],
  exports: [ApplicationConfigService],
})
export class ApplicationConfigModule {}
