import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GoogleAdsOAuth2FlowHelper, createGoogleAdsOAuth2Helper } from "./oauth2-flow.helper.js";

describe("GoogleAdsOAuth2FlowHelper", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.GOOGLE_ADS_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_ADS_CLIENT_SECRET = "test-client-secret";
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN = "test-dev-token";
    process.env.GOOGLE_ADS_REFRESH_TOKEN = "test-refresh-token";
    process.env.GOOGLE_ADS_CUSTOMER_ID = "123-456-7890";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("summarizes credentials status accurately", () => {
    const helper = createGoogleAdsOAuth2Helper();
    const summary = helper.getCredentialsSummary();

    expect(summary.hasClientId).toBe(true);
    expect(summary.hasClientSecret).toBe(true);
    expect(summary.hasRefreshToken).toBe(true);
    expect(summary.hasDeveloperToken).toBe(true);
    expect(summary.customerId).toBe("1234567890");
    expect(summary.configured).toBe(true);
  });

  it("generates authorization URL correctly", () => {
    const helper = new GoogleAdsOAuth2FlowHelper();
    const url = helper.getAuthUrl("http://localhost:3000/callback");

    expect(url).toContain("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url).toContain("client_id=test-client-id");
    expect(url).toContain("redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback");
    expect(url).toContain("scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadwords");
    expect(url).toContain("access_type=offline");
  });

  it("throws error when verifying missing credentials", () => {
    delete process.env.GOOGLE_ADS_CLIENT_ID;
    const helper = new GoogleAdsOAuth2FlowHelper({ clientId: "" });

    expect(() => helper.verifyCredentials()).toThrow("Google Ads OAuth2 credentials missing");
  });
});
