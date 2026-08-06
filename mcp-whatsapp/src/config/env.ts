import { loadEnv } from "@mcp-marketing/shared";
import { z } from "zod";

const whatsAppEnvSchema = z.object({
  WHATSAPP_TOKEN: z.string().min(1, "WHATSAPP_TOKEN is required"),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1, "WHATSAPP_PHONE_NUMBER_ID is required"),
  WHATSAPP_API_VERSION: z.string().default("v21.0"),
});

export type WhatsAppEnv = z.infer<typeof whatsAppEnvSchema>;

export function loadWhatsAppEnv(): WhatsAppEnv {
  return loadEnv({ schema: whatsAppEnvSchema });
}
