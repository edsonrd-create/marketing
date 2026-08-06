import { describe, expect, it, beforeAll } from "vitest";
import {
  createGoogleAdsModule,
  GOOGLE_ADS_TOOL_NAMES,
  type GoogleAdsEnv,
  type GoogleAdsModule,
} from "../index.js";

function testEnv(overrides: Partial<GoogleAdsEnv> = {}): GoogleAdsEnv {
  return {
    GOOGLE_ADS_CLIENT_ID: "test-client-id",
    GOOGLE_ADS_CLIENT_SECRET: "test-client-secret",
    GOOGLE_ADS_REFRESH_TOKEN: "test-refresh-token",
    GOOGLE_ADS_DEVELOPER_TOKEN: "test-dev-token",
    GOOGLE_ADS_CUSTOMER_ID: "123-456-7890",
    GOOGLE_ADS_SKIP_AUTH_VALIDATE: true,
    GOOGLE_ADS_LIVE_AUTH: false,
    GOOGLE_ADS_FORCE_MOCK: true,
    ...overrides,
  };
}

describe("Google Ads provider tools (100% coverage)", () => {
  let module: GoogleAdsModule;

  beforeAll(async () => {
    module = await createGoogleAdsModule(testEnv());
  });

  it("registers exactly 10 sprint-2 tools", () => {
    expect(GOOGLE_ADS_TOOL_NAMES).toHaveLength(10);
    expect(GOOGLE_ADS_TOOL_NAMES).toEqual([
      "list_campaigns",
      "get_campaign",
      "create_campaign",
      "pause_campaign",
      "enable_campaign",
      "update_budget",
      "campaign_report",
      "search_keywords",
      "list_customers",
      "account_info",
    ]);
  });

  it("list_campaigns", async () => {
    const campaigns = await module.provider.listCampaigns();
    expect(campaigns.length).toBeGreaterThanOrEqual(2);
    expect(campaigns[0]?.id).toBeTruthy();
  });

  it("get_campaign", async () => {
    const campaign = await module.provider.getCampaign("1001");
    expect(campaign.name).toBe("Brand Awareness");
  });

  it("create_campaign", async () => {
    const campaign = await module.provider.createCampaign({
      name: "Sprint2 Campaign",
      budgetMicros: 1_000_000,
      channelType: "SEARCH",
    });
    expect(campaign.id).toBeTruthy();
    expect(campaign.budgetMicros).toBe(1_000_000);
  });

  it("pause_campaign", async () => {
    const campaign = await module.provider.pauseCampaign("1001");
    expect(campaign.status).toBe("PAUSED");
  });

  it("enable_campaign", async () => {
    const campaign = await module.provider.enableCampaign("1001");
    expect(campaign.status).toBe("ENABLED");
  });

  it("update_budget", async () => {
    const campaign = await module.provider.updateBudget("1001", 2_500_000);
    expect(campaign.budgetMicros).toBe(2_500_000);
  });

  it("campaign_report", async () => {
    const rows = await module.provider.campaignReport({ dateRange: "LAST_30_DAYS" });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]?.dateRange).toBe("LAST_30_DAYS");
  });

  it("search_keywords", async () => {
    const keywords = await module.provider.searchKeywords("marketing brain", 5);
    expect(keywords).toHaveLength(5);
    expect(keywords[0]?.keyword).toContain("marketing brain");
  });

  it("list_customers", async () => {
    const customers = await module.provider.listCustomers();
    expect(customers.length).toBeGreaterThanOrEqual(1);
    expect(customers[0]?.id).toBe("1234567890");
  });

  it("account_info", async () => {
    const account = await module.provider.accountInfo();
    expect(account.customerId).toBe("1234567890");
    expect(account.mode).toBe("mock");
  });

  it("domain services delegate to provider", async () => {
    await expect(module.campaigns.list()).resolves.toBeTruthy();
    await expect(module.keywords.search("ads", 3)).resolves.toHaveLength(3);
    await expect(module.reports.campaignReport({ dateRange: "LAST_7_DAYS" })).resolves.toBeTruthy();
    await expect(module.budgets.update("1002", 9_000_000)).resolves.toMatchObject({
      budgetMicros: 9_000_000,
    });
    await expect(module.customers.list()).resolves.toBeTruthy();
    await expect(module.customers.accountInfo()).resolves.toMatchObject({ mode: "mock" });
    expect(module.conversions.status().ready).toBe(true);
  });

  it("auth manager exposes customer id without hyphens", () => {
    expect(module.auth.getCustomerId()).toBe("1234567890");
    expect(module.auth.isLiveMode()).toBe(false);
    expect(module.auth.isInitialized()).toBe(true);
  });
});
