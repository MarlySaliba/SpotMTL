import { Inject, Injectable, Logger } from "@nestjs/common";
import type { OnApplicationShutdown } from "@nestjs/common";
import { Pool } from "pg";
import type { QueryResult, QueryResultRow } from "pg";
import { getSafeErrorDetails } from "../common/logging/safe-error";
import { ApplicationConfigService } from "../config/application-config.service";
import type { DatabaseTarget } from "../config/environment";

interface DatabaseHealthRow extends QueryResultRow {
  connected: number;
  server_time: Date;
}

export interface DatabaseHealth {
  connected: true;
  serverTime: Date;
  latencyMs: number;
}

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;
  private readonly target: DatabaseTarget;
  private closed = false;

  constructor(
    @Inject(ApplicationConfigService) configuration: ApplicationConfigService,
  ) {
    this.pool = new Pool(configuration.database.poolOptions);
    this.target = configuration.database.target;

    this.pool.on("error", (error) => {
      this.logger.error(
        `Unexpected error on an idle PostgreSQL connection: ${getSafeErrorDetails(error)}`,
      );
    });
  }

  getTarget(): DatabaseTarget {
    return { ...this.target };
  }

  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    parameters: unknown[] = [],
  ): Promise<QueryResult<Row>> {
    return this.pool.query<Row>(text, parameters);
  }

  async verifyConnection(): Promise<DatabaseHealth> {
    const startedAt = Date.now();
    const result = await this.query<DatabaseHealthRow>(
      "SELECT 1 AS connected, NOW() AS server_time",
    );

    if (result.rows[0]?.connected !== 1) {
      throw new Error("PostgreSQL returned an unexpected health-check response.");
    }

    return {
      connected: true,
      serverTime: result.rows[0].server_time,
      latencyMs: Date.now() - startedAt,
    };
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;
    await this.pool.end();
    this.logger.log("PostgreSQL connection pool closed.");
  }
}
