import { createLogger } from "@mcp-marketing/shared";

const logger = createLogger("google-ads-provider");

export async function withGoogleAdsLogging<T>(
  tool: string,
  customerId: string,
  fn: () => Promise<T>,
): Promise<T> {
  const started = performance.now();
  logger.info({ tool, customerId }, "Google Ads tool request start");
  try {
    const result = await fn();
    logger.info(
      { tool, customerId, ms: Math.round(performance.now() - started) },
      "Google Ads tool request ok",
    );
    return result;
  } catch (error) {
    logger.error(
      {
        err: error,
        tool,
        customerId,
        ms: Math.round(performance.now() - started),
      },
      "Google Ads tool request failed",
    );
    throw error;
  }
}
