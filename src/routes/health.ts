import type { FastifyInstance } from "fastify";
import type { AppContext } from "../core/context.js";
import { VERSION } from "../core/version.js";

export async function registerHealthRoutes(app: FastifyInstance, ctx: AppContext): Promise<void> {
  app.get("/health", async () => {
    const env = ctx.config.env;

    // 1. Google Ads status check
    const hasGoogleClientId = Boolean(env.GOOGLE_ADS_CLIENT_ID);
    const hasGoogleDeveloperToken = Boolean(env.GOOGLE_ADS_DEVELOPER_TOKEN);
    const hasGoogleClientSecret = Boolean(env.GOOGLE_ADS_CLIENT_SECRET);
    const hasGoogleRefreshToken = Boolean(env.GOOGLE_ADS_REFRESH_TOKEN);
    const googleCustomerId = env.GOOGLE_ADS_CUSTOMER_ID || null;

    const isGoogleAdsConfigured = hasGoogleClientId && hasGoogleDeveloperToken;
    const googleAdsStatus = {
      name: "google-ads",
      status: isGoogleAdsConfigured ? "ok" : "degraded",
      configured: isGoogleAdsConfigured,
      details: isGoogleAdsConfigured
        ? "Google Ads API credentials configured and ready"
        : "Google Ads missing GOOGLE_ADS_CLIENT_ID or GOOGLE_ADS_DEVELOPER_TOKEN",
      credentials: {
        hasClientId: hasGoogleClientId,
        hasClientSecret: hasGoogleClientSecret,
        hasDeveloperToken: hasGoogleDeveloperToken,
        hasRefreshToken: hasGoogleRefreshToken,
        customerId: googleCustomerId,
      },
    };

    // 2. Meta Ads status check
    const hasMetaAccessToken = Boolean(env.META_ACCESS_TOKEN);
    const metaAdAccountId = env.META_AD_ACCOUNT_ID || null;
    const isMetaAdsConfigured = hasMetaAccessToken && Boolean(metaAdAccountId);

    const metaAdsStatus = {
      name: "meta-ads",
      status: isMetaAdsConfigured ? "ok" : "degraded",
      configured: isMetaAdsConfigured,
      details: isMetaAdsConfigured
        ? "Meta Ads Graph API access token and ad account configured"
        : "Meta Ads missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID",
      credentials: {
        hasAccessToken: hasMetaAccessToken,
        adAccountId: metaAdAccountId,
      },
    };

    // 3. WhatsApp Service status check
    const hasWhatsAppToken = Boolean(env.WHATSAPP_TOKEN);
    const whatsAppPhoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID || null;
    const isWhatsAppStub = Boolean(env.WHATSAPP_STUB);
    const isWhatsAppConfigured = hasWhatsAppToken && Boolean(whatsAppPhoneNumberId);

    const whatsAppStatus = {
      name: "whatsapp",
      status: isWhatsAppConfigured || isWhatsAppStub ? "ok" : "degraded",
      configured: isWhatsAppConfigured,
      details: isWhatsAppConfigured
        ? "WhatsApp Cloud API token and phone number ID configured"
        : isWhatsAppStub
        ? "WhatsApp service running in stub mode"
        : "WhatsApp service unconfigured (missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID)",
      credentials: {
        hasToken: hasWhatsAppToken,
        phoneNumberId: whatsAppPhoneNumberId,
        stubMode: isWhatsAppStub,
      },
    };

    const openAiServiceStatus = ctx.openAi.status();
    const mcpServiceStatus = ctx.mcp.status();

    const servicesList = [googleAdsStatus, metaAdsStatus, whatsAppStatus, openAiServiceStatus, mcpServiceStatus];
    const isDegraded = servicesList.some((s) => s.status !== "ok");

    return {
      status: isDegraded ? "degraded" : "ok",
      timestamp: new Date().toISOString(),
      version: VERSION,
      app: ctx.config.profile.app,
      nodeEnv: ctx.config.env.NODE_ENV,
      services: {
        googleAds: googleAdsStatus,
        metaAds: metaAdsStatus,
        whatsApp: whatsAppStatus,
        openAi: openAiServiceStatus,
        mcp: mcpServiceStatus,
      },
      summary: servicesList.map((s) => ({
        name: s.name,
        status: s.status,
      })),
    };
  });

  app.get("/ready", async (_request, reply) => {
    const mcp = ctx.mcp.status();
    if (mcp.status === "error") {
      return reply.code(503).send({ ready: false, mcp });
    }
    return { ready: true, mcp };
  });
}

