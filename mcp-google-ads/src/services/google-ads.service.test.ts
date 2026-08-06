import { describe, expect, it, beforeAll } from "vitest";
import { createGoogleAdsModule, type GoogleAdsModule } from "../../../src/providers/google-ads/index.js";

describe("GoogleAdsProvider (package suite)", () => {
  let module: GoogleAdsModule;

  beforeAll(async () => {
    module = await createGoogleAdsModule({
      GOOGLE_ADS_CLIENT_ID: "id",
      GOOGLE_ADS_CLIENT_SECRET: "secret",
      GOOGLE_ADS_REFRESH_TOKEN: "refresh",
      GOOGLE_ADS_DEVELOPER_TOKEN: "dev",
      GOOGLE_ADS_CUSTOMER_ID: "1112223333",
      GOOGLE_ADS_SKIP_AUTH_VALIDATE: true,
      GOOGLE_ADS_LIVE_AUTH: false,
      GOOGLE_ADS_FORCE_MOCK: true,
    });
  });

  it("lists seeded campaigns", async () => {
    const campaigns = await module.provider.listCampaigns();
    expect(campaigns.length).toBeGreaterThanOrEqual(2);
  });

  it("creates and gets a campaign", async () => {
    const created = await module.provider.createCampaign({
      name: "Package Test",
      budgetMicros: 3_000_000,
      channelType: "SEARCH",
    });
    const fetched = await module.provider.getCampaign(created.id);
    expect(fetched.name).toBe("Package Test");
  });

  it("pauses and enables campaigns", async () => {
    await module.provider.pauseCampaign("1001");
    expect((await module.provider.getCampaign("1001")).status).toBe("PAUSED");
    await module.provider.enableCampaign("1001");
    expect((await module.provider.getCampaign("1001")).status).toBe("ENABLED");
  });

  it("updates budget", async () => {
    const campaign = await module.provider.updateBudget("1001", 4_000_000);
    expect(campaign.budgetMicros).toBe(4_000_000);
  });

  it("searches keywords", async () => {
    const keywords = await module.provider.searchKeywords("ads", 4);
    expect(keywords).toHaveLength(4);
  });

  it("returns campaign report rows", async () => {
    const rows = await module.provider.campaignReport({ dateRange: "LAST_30_DAYS" });
    expect(rows[0]?.impressions).toBeGreaterThan(0);
  });

  it("lists customers and account info", async () => {
    const customers = await module.provider.listCustomers();
    const account = await module.provider.accountInfo();
    expect(customers[0]?.id).toBe("1112223333");
    expect(account.customerId).toBe("1112223333");
  });
});
