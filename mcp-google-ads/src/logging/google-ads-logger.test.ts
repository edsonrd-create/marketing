import { describe, it, expect, vi } from "vitest";
import {
  GoogleAdsApiError,
  maskToken,
  withGoogleAdsLogging,
  withLoggingGoogleAdsService,
  GoogleAdsLogger,
} from "./google-ads-logger.js";

describe("Google Ads Logging Utility", () => {
  it("masks tokens correctly", () => {
    expect(maskToken(undefined)).toBe("[EMPTY]");
    expect(maskToken("123")).toBe("***");
    expect(maskToken("dev-token-123456789")).toBe("dev-...6789");
  });

  it("logs success lifecycle with info level logger", async () => {
    const logger: GoogleAdsLogger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const dummyOperation = vi.fn().mockResolvedValue({ success: true });

    const result = await withGoogleAdsLogging(
      dummyOperation,
      { operation: "getCampaigns", customerId: "7587497137", developerToken: "secret-token-value" },
      logger,
    );

    expect(result).toEqual({ success: true });
    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      "[Google Ads Logging Middleware] Starting operation: getCampaigns",
      expect.objectContaining({
        operation: "getCampaigns",
        customerId: "7587497137",
        developerTokenMasked: "secr...alue",
      }),
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      "[Google Ads Logging Middleware] Operation succeeded: getCampaigns",
      expect.objectContaining({
        operation: "getCampaigns",
        customerId: "7587497137",
        durationMs: expect.any(Number),
      }),
    );
  });

  it("captures GoogleAdsApiError and logs full context", async () => {
    const logger: GoogleAdsLogger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const failingOperation = vi.fn().mockRejectedValue(
      new GoogleAdsApiError("Quota Exceeded", {
        status: 429,
        customerId: "7587497137",
        rawResponseBody: '{"error": {"code": 429, "message": "RESOURCE_EXHAUSTED"}}',
        parsedResponseBody: { error: { code: 429, message: "RESOURCE_EXHAUSTED" } },
      }),
    );

    await expect(
      withGoogleAdsLogging(
        failingOperation,
        { operation: "mutateCampaign", customerId: "7587497137" },
        logger,
      ),
    ).rejects.toThrow("Quota Exceeded");

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      "[Google Ads Logging Middleware] Captured API Error (429): Quota Exceeded",
      expect.objectContaining({
        status: 429,
        customerId: "7587497137",
        rawResponseBody: '{"error": {"code": 429, "message": "RESOURCE_EXHAUSTED"}}',
        parsedResponseBody: { error: { code: 429, message: "RESOURCE_EXHAUSTED" } },
      }),
    );
  });

  it("wraps service methods automatically with logging middleware", async () => {
    const logger: GoogleAdsLogger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    const rawService = {
      listCampaigns: vi.fn().mockResolvedValue(["cmp-1", "cmp-2"]),
    };

    const wrapped = withLoggingGoogleAdsService(rawService, logger, "7587497137");

    const campaigns = await wrapped.listCampaigns("7587497137");

    expect(campaigns).toEqual(["cmp-1", "cmp-2"]);
    expect(logger.info).toHaveBeenCalledWith(
      "[Google Ads Logging Middleware] Starting operation: listCampaigns",
      expect.objectContaining({ customerId: "7587497137" }),
    );
  });
});
