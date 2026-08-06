import { AppError, ErrorCode } from "../errors.js";
import { createLogger } from "../logger.js";
import { MemoryDatabase } from "./memory.js";
import type { CreateDatabaseOptions, Database } from "./types.js";

const logger = createLogger("database-factory");

export function createDatabase(options: CreateDatabaseOptions): Database {
  const { driver } = options;

  if (driver === "memory") {
    return new MemoryDatabase();
  }

  if (driver === "sqlite" || driver === "postgres") {
    logger.warn(
      { driver },
      "sqlite/postgres drivers are not available in this LTS build; use driver: \"memory\"",
    );
    throw new AppError({
      code: ErrorCode.CONFIG,
      message: `Database driver "${driver}" is not supported in this build. Use driver: "memory".`,
    });
  }

  throw new AppError({
    code: ErrorCode.CONFIG,
    message: `Unknown database driver: ${String(driver)}`,
  });
}
