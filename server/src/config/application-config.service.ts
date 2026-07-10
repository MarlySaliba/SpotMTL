import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  APPLICATION_CONFIGURATION_KEY,
  type ApplicationConfiguration,
  type DatabaseConfiguration,
  type ServerConfiguration,
} from "./environment";

@Injectable()
export class ApplicationConfigService {
  private readonly configuration: ApplicationConfiguration;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.configuration =
      configService.getOrThrow<ApplicationConfiguration>(
        APPLICATION_CONFIGURATION_KEY,
      );
  }

  get server(): ServerConfiguration {
    return this.configuration.server;
  }

  get database(): DatabaseConfiguration {
    return this.configuration.database;
  }
}
