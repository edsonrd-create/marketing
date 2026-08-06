import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import { ValidationError } from "@mcp-marketing/shared";
import {
  GOOGLE_ADS_REQUIRED_KEYS,
  appEnvSchema,
  type AppEnv,
} from "../schemas/env.schema.js";

export interface EnvValidationResult {
  env: AppEnv;
  warnings: string[];
  missingProviders: string[];
}

/**
 * Zod-based environment validator for Marketing Brain.
 * Loads `.env` (unless skipped) and validates required app variables.
 */
export class EnvValidator {
  constructor(private readonly envPath = ".env") {}

  loadDotEnv(cwd = process.cwd()): void {
    if (
      process.env.SKIP_DOTENV_FILE === "true" ||
      process.env.VITEST === "true" ||
      process.env.NODE_ENV === "test"
    ) {
      return;
    }

    const resolved = path.resolve(cwd, this.envPath);
    if (existsSync(resolved)) {
      loadDotenv({ path: resolved });
    }
  }

  validate(raw: NodeJS.ProcessEnv = process.env): EnvValidationResult {
    const parsed = appEnvSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ValidationError("Invalid environment configuration", parsed.error.flatten());
    }

    const env = parsed.data;
    const warnings: string[] = [];
    const missingProviders: string[] = [];

    const missingGoogle = GOOGLE_ADS_REQUIRED_KEYS.filter((key) => !env[key]);
    if (missingGoogle.length > 0) {
      missingProviders.push("google-ads");
      warnings.push(`Google Ads incomplete: missing ${missingGoogle.join(", ")}`);
    }

    if (!env.OPENAI_API_KEY) {
      missingProviders.push("openai");
      warnings.push("OpenAI incomplete: missing OPENAI_API_KEY");
    }

    if (!env.META_ACCESS_TOKEN || !env.META_AD_ACCOUNT_ID) {
      missingProviders.push("meta-ads");
      warnings.push("Meta Ads incomplete: missing META_ACCESS_TOKEN and/or META_AD_ACCOUNT_ID");
    }

    if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
      missingProviders.push("whatsapp");
      warnings.push("WhatsApp incomplete: missing WHATSAPP_TOKEN and/or WHATSAPP_PHONE_NUMBER_ID");
    }

    if (env.MARKETING_BRAIN_STRICT_ENV && missingProviders.length > 0) {
      throw new ValidationError("Strict env mode requires provider credentials", {
        missingProviders,
        warnings,
      });
    }

    return { env, warnings, missingProviders };
  }

  /** Load dotenv + validate in one step. */
  loadAndValidate(cwd = process.cwd()): EnvValidationResult {
    this.loadDotEnv(cwd);
    return this.validate(process.env);
  }
}
