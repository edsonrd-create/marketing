import { describe, expect, it } from "vitest";
import {
  analyzeInsights,
  getHealthScores,
  listRecommendations,
} from "../services/analytics.js";
import { seedDemoSnapshots } from "../tools/index.js";

describe("analyzeInsights", () => {
  const snapshots = seedDemoSnapshots();

  it("returns insights for campaign snapshots", () => {
    const insights = analyzeInsights(snapshots);
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.some((i) => i.campaignId === "camp-001")).toBe(true);
  });

  it("flags negative ROAS campaigns", () => {
    const insights = analyzeInsights(snapshots);
    const critical = insights.filter((i) => i.severity === "critical");
    expect(critical.some((i) => i.campaignId === "camp-002")).toBe(true);
  });

  it("computes health scores", () => {
    const scores = getHealthScores(snapshots);
    expect(scores).toHaveLength(2);
    expect(scores[0]?.score).toBeGreaterThan(0);
    expect(["A", "B", "C", "D", "F"]).toContain(scores[0]?.grade);
  });

  it("generates recommendations from insights", () => {
    const recommendations = listRecommendations(snapshots);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]?.action).toBeTruthy();
  });
});
