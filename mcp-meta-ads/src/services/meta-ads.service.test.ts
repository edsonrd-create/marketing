import { beforeEach, describe, expect, it } from "vitest";
import { MetaAdsService } from "./meta-ads.service.js";

describe("MetaAdsService", () => {
  let service: MetaAdsService;

  beforeEach(() => {
    service = new MetaAdsService({ adAccountId: "act_123456789" });
  });

  it("lists seeded campaigns", async () => {
    const campaigns = await service.listCampaigns();
    expect(campaigns.length).toBeGreaterThanOrEqual(2);
  });

  it("creates a campaign", async () => {
    const campaign = await service.createCampaign({
      name: "Launch",
      objective: "OUTCOME_AWARENESS",
      dailyBudget: 50,
    });

    expect(campaign.status).toBe("ACTIVE");
    expect(campaign.name).toBe("Launch");
  });

  it("pauses and resumes a campaign", async () => {
    const created = await service.createCampaign({
      name: "Toggle",
      objective: "OUTCOME_TRAFFIC",
      dailyBudget: 30,
    });

    const paused = await service.pauseCampaign(created.id);
    expect(paused.status).toBe("PAUSED");

    const resumed = await service.resumeCampaign(created.id);
    expect(resumed.status).toBe("ACTIVE");
  });

  it("updates budget", async () => {
    const created = await service.createCampaign({
      name: "Budget",
      objective: "OUTCOME_SALES",
      dailyBudget: 40,
    });

    const updated = await service.updateBudget(created.id, 120);
    expect(updated.dailyBudget).toBe(120);
  });

  it("creates audience and ad", async () => {
    const audience = await service.createAudience({ name: "Lookalike 1%" });
    expect(audience.name).toBe("Lookalike 1%");

    const campaigns = await service.listCampaigns();
    const campaignId = campaigns[0]?.id;
    expect(campaignId).toBeTruthy();

    const ad = await service.createAd({
      name: "Carousel Ad",
      campaignId: campaignId!,
      creativeBody: "Shop now",
    });
    expect(ad.creativeBody).toBe("Shop now");
  });

  it("returns metrics", async () => {
    const metrics = await service.getMetrics();
    expect(metrics.length).toBeGreaterThan(0);
    expect(metrics[0]?.impressions).toBeGreaterThan(0);
  });
});
