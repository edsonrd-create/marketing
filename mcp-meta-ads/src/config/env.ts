import { z } from "zod";
import { loadEnv } from "@mcp-marketing/shared";

const metaAdsEnvSchema = z.object({
  META_ACCESS_TOKEN: z.string().min(1),
  META_AD_ACCOUNT_ID: z.string().min(1),
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  META_SKIP_AUTH_VALIDATE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export type MetaAdsEnv = z.infer<typeof metaAdsEnvSchema>;

export function loadMetaAdsEnv(): MetaAdsEnv {
  return loadEnv({
    schema: metaAdsEnvSchema,
  });
}
