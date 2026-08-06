import { describe, expect, it } from "vitest";
import { auditCampaignStructure, auditFromSnapshot } from "../services/audit.js";

describe("auditCampaignStructure", () => {
  it("flags missing negative keywords for Google Search campaigns", () => {
    const result = auditCampaignStructure({
      campaignId: "test-google-001",
      name: "Google Search High Intent",
      channel: "google",
      biddingStrategy: "manual_cpc",
      negativeKeywordsCount: 0,
    });

    expect(result.auditScore).toBeLessThan(100);
    expect(result.findingsCount.critical).toBeGreaterThan(0);
    expect(result.findings.some((f) => f.category === "negative_keywords")).toBe(true);
    expect(result.optimizationTasks.some((t) => t.actionType === "add_negative_keywords")).toBe(true);
  });

  it("flags manual CPC bidding and recommends Smart Bidding", () => {
    const result = auditCampaignStructure({
      campaignId: "test-bidding-001",
      name: "Meta Lead Gen",
      channel: "meta",
      biddingStrategy: "manual_cpc",
      negativeKeywordsCount: 10,
    });

    expect(result.findings.some((f) => f.category === "bidding_strategy")).toBe(true);
    expect(result.optimizationTasks.some((t) => t.actionType === "update_bidding_strategy")).toBe(true);
  });

  it("flags missing tracking / server-side CAPI integration", () => {
    const result = auditCampaignStructure({
      campaignId: "test-tracking-001",
      name: "Search Campaign",
      channel: "google",
      trackingConfig: {
        ga4Configured: false,
        metaCapiConfigured: false,
        serverSideTracking: false,
      },
    });

    expect(result.findings.some((f) => f.category === "tracking_integration")).toBe(true);
    expect(result.optimizationTasks.some((t) => t.actionType === "configure_tracking")).toBe(true);
  });

  it("audits from snapshot successfully", () => {
    const result = auditFromSnapshot({
      campaignId: "snap-001",
      name: "Search E-commerce",
      channel: "google",
      spend: 3000,
      impressions: 100000,
      clicks: 2000,
      conversions: 50,
      revenue: 12000,
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    });

    expect(result.campaignId).toBe("snap-001");
    expect(result.auditScore).toBeGreaterThanOrEqual(0);
    expect(result.auditScore).toBeLessThanOrEqual(100);
    expect(result.optimizationTasks.length).toBeGreaterThan(0);
  });
});
