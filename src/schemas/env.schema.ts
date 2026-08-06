import { z } from "zod";

/** Treat empty env strings as undefined (common with `.env.example` copies). */
const optionalString = z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val.trim() === "") {
      return undefined;
    }
    return val;
  });

/** Core application environment — validated on boot. */
export const appEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_MODE: z.enum(["memory", "sqlite", "postgres"]).default("memory"),

  OPENAI_API_KEY: optionalString,
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),

  GOOGLE_ADS_CLIENT_ID: optionalString,
  GOOGLE_ADS_CLIENT_SECRET: optionalString,
  GOOGLE_ADS_REFRESH_TOKEN: optionalString,
  GOOGLE_ADS_DEVELOPER_TOKEN: optionalString,
  GOOGLE_ADS_CUSTOMER_ID: optionalString,
  GOOGLE_ADS_SKIP_AUTH_VALIDATE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),

  META_ACCESS_TOKEN: optionalString,
  META_AD_ACCOUNT_ID: optionalString,

  WHATSAPP_TOKEN: optionalString,
  WHATSAPP_PHONE_NUMBER_ID: optionalString,
  WHATSAPP_STUB: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),

  /** When true, provider credentials become mandatory for boot. */
  MARKETING_BRAIN_STRICT_ENV: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export const GOOGLE_ADS_REQUIRED_KEYS = [
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_REFRESH_TOKEN",
  "GOOGLE_ADS_DEVELOPER_TOKEN",
  "GOOGLE_ADS_CUSTOMER_ID",
] as const;

export const OPENAI_REQUIRED_KEYS = ["OPENAI_API_KEY"] as const;
