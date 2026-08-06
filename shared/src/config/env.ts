import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import { z, type ZodObject, type ZodRawShape } from "zod";
import { AppError, ErrorCode } from "../errors.js";

const ENV_ALIASES: Record<string, string[]> = {
  WHATSAPP_ACCESS_TOKEN: ["WHATSAPP_TOKEN", "WA_ACCESS_TOKEN"],
  META_AD_ACCOUNT_ID: ["META_ACCOUNT_ID", "FACEBOOK_AD_ACCOUNT_ID"],
};

export function applyEnvAliases(): void {
  for (const [canonical, aliases] of Object.entries(ENV_ALIASES)) {
    if (process.env[canonical]) {
      continue;
    }
    for (const alias of aliases) {
      const value = process.env[alias];
      if (value) {
        process.env[canonical] = value;
        break;
      }
    }
  }
}

export function shouldSkipEnvFile(): boolean {
  return (
    process.env.VITEST === "true" ||
    process.env.NODE_ENV === "test" ||
    process.env.SKIP_DOTENV_FILE === "true"
  );
}

export function assertEnvFileExists(envPath = ".env"): void {
  if (shouldSkipEnvFile()) {
    return;
  }

  const resolved = path.resolve(process.cwd(), envPath);
  if (!existsSync(resolved)) {
    throw new AppError({
      code: ErrorCode.CONFIG,
      message: `Environment file not found: ${resolved}`,
    });
  }
}

export function formatMissingEnvKeys(keys: string[]): string {
  if (keys.length === 0) {
    return "No missing environment variables.";
  }
  return `Missing required environment variables: ${keys.join(", ")}`;
}

export interface LoadEnvOptions<T extends ZodRawShape> {
  schema: ZodObject<T>;
  envPath?: string;
  skipEnvFile?: boolean;
}

export function loadEnv<T extends ZodRawShape>(
  options: LoadEnvOptions<T>,
): z.infer<ZodObject<T>> {
  const { schema, envPath = ".env", skipEnvFile = shouldSkipEnvFile() } = options;

  if (!skipEnvFile) {
    assertEnvFileExists(envPath);
    loadDotenv({ path: envPath });
  }

  applyEnvAliases();

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const missingKeys = parsed.error.issues
      .filter((issue) => issue.code === "invalid_type" && issue.received === "undefined")
      .map((issue) => issue.path.join("."));

    const message =
      missingKeys.length > 0
        ? formatMissingEnvKeys(missingKeys)
        : parsed.error.message;

    throw new AppError({
      code: ErrorCode.CONFIG,
      message,
      details: parsed.error.flatten(),
    });
  }

  return parsed.data;
}
