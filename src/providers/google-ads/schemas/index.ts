import { z } from "zod";

const optionalBool = z
  .enum(["true", "false"])
  .optional()
  .transform((v) => v === "true");

export const googleAdsEnvSchema = z.object({
  GOOGLE_ADS_CLIENT_ID: z.string().min(1),
  GOOGLE_ADS_CLIENT_SECRET: z.string().min(1),
  GOOGLE_ADS_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().min(1),
  GOOGLE_ADS_CUSTOMER_ID: z.string().min(1),
  /** Login-customer-id for MCC accounts (optional). */
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: z
    .string()
    .optional()
    .transform((v) => (!v || v.trim() === "" ? undefined : v)),
  GOOGLE_ADS_SKIP_AUTH_VALIDATE: optionalBool,
  /** When "1", perform live OAuth refresh and Google Ads API calls. */
  GOOGLE_ADS_LIVE_AUTH: z
    .enum(["0", "1"])
    .optional()
    .transform((v) => v === "1"),
  /** Force mock data layer even if live auth is on (tests). */
  GOOGLE_ADS_FORCE_MOCK: optionalBool,
});

export type GoogleAdsEnv = z.infer<typeof googleAdsEnvSchema>;

export const listCampaignsSchema = z.object({}).strict();

export const getCampaignSchema = z.object({
  campaign_id: z.string().min(1),
});

export const createCampaignSchema = z.object({
  name: z.string().min(1),
  budget_micros: z.number().int().positive(),
  channel_type: z.string().min(1).optional().default("SEARCH"),
});

export const pauseCampaignSchema = z.object({
  campaign_id: z.string().min(1),
});

export const enableCampaignSchema = z.object({
  campaign_id: z.string().min(1),
});

export const updateBudgetSchema = z.object({
  campaign_id: z.string().min(1),
  budget_micros: z.number().int().positive(),
});

export const campaignReportSchema = z.object({
  campaign_id: z.string().min(1).optional(),
  date_range: z.string().min(1).optional().default("LAST_30_DAYS"),
});

export const searchKeywordsSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

export const listCustomersSchema = z.object({}).strict();

export const accountInfoSchema = z.object({}).strict();
