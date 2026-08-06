import { randomUUID } from "node:crypto";
import type { CampaignSnapshot, TimelineEvent } from "./store.js";

export interface Insight {
  id: string;
  severity: "info" | "warning" | "critical";
  category: string;
  title: string;
  description: string;
  campaignId?: string;
  metric?: string;
  value?: number;
  recommendation?: string;
}

export interface HealthScore {
  campaignId: string;
  name: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  factors: Array<{ name: string; score: number; weight: number }>;
}

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  campaignId?: string;
  action: string;
}

function ctr(snapshot: CampaignSnapshot): number {
  return snapshot.impressions > 0 ? snapshot.clicks / snapshot.impressions : 0;
}

function cvr(snapshot: CampaignSnapshot): number {
  return snapshot.clicks > 0 ? snapshot.conversions / snapshot.clicks : 0;
}

function roas(snapshot: CampaignSnapshot): number {
  return snapshot.spend > 0 ? snapshot.revenue / snapshot.spend : 0;
}

function cpa(snapshot: CampaignSnapshot): number {
  return snapshot.conversions > 0 ? snapshot.spend / snapshot.conversions : 0;
}

export function analyzeCampaignSnapshot(snapshot: CampaignSnapshot): Insight[] {
  const insights: Insight[] = [];
  const clickRate = ctr(snapshot);
  const conversionRate = cvr(snapshot);
  const returnOnAdSpend = roas(snapshot);
  const costPerAcquisition = cpa(snapshot);

  if (clickRate < 0.01) {
    insights.push({
      id: randomUUID(),
      severity: "warning",
      category: "engagement",
      title: "Low click-through rate",
      description: `CTR is ${(clickRate * 100).toFixed(2)}%, below the 1% benchmark.`,
      campaignId: snapshot.campaignId,
      metric: "ctr",
      value: clickRate,
      recommendation: "Review ad creative and targeting to improve relevance.",
    });
  }

  if (conversionRate < 0.02 && snapshot.clicks > 100) {
    insights.push({
      id: randomUUID(),
      severity: "warning",
      category: "conversion",
      title: "Low conversion rate",
      description: `CVR is ${(conversionRate * 100).toFixed(2)}% with ${snapshot.clicks} clicks.`,
      campaignId: snapshot.campaignId,
      metric: "cvr",
      value: conversionRate,
      recommendation: "Optimize landing page and checkout flow.",
    });
  }

  if (returnOnAdSpend < 1 && snapshot.spend > 0) {
    insights.push({
      id: randomUUID(),
      severity: "critical",
      category: "profitability",
      title: "Negative ROAS",
      description: `ROAS is ${returnOnAdSpend.toFixed(2)}x — spend exceeds revenue.`,
      campaignId: snapshot.campaignId,
      metric: "roas",
      value: returnOnAdSpend,
      recommendation: "Pause or restructure campaign to reduce wasted spend.",
    });
  } else if (returnOnAdSpend >= 3) {
    insights.push({
      id: randomUUID(),
      severity: "info",
      category: "profitability",
      title: "Strong ROAS performance",
      description: `ROAS of ${returnOnAdSpend.toFixed(2)}x indicates healthy returns.`,
      campaignId: snapshot.campaignId,
      metric: "roas",
      value: returnOnAdSpend,
      recommendation: "Consider scaling budget incrementally.",
    });
  }

  if (costPerAcquisition > snapshot.revenue / Math.max(snapshot.conversions, 1) * 0.5) {
    insights.push({
      id: randomUUID(),
      severity: "warning",
      category: "efficiency",
      title: "High cost per acquisition",
      description: `CPA is ${costPerAcquisition.toFixed(2)}.`,
      campaignId: snapshot.campaignId,
      metric: "cpa",
      value: costPerAcquisition,
      recommendation: "Test audience segments and bid adjustments.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: randomUUID(),
      severity: "info",
      category: "general",
      title: "Campaign within normal range",
      description: `${snapshot.name} metrics are within expected benchmarks.`,
      campaignId: snapshot.campaignId,
    });
  }

  return insights;
}

export function analyzeInsights(snapshots: CampaignSnapshot[]): Insight[] {
  return snapshots.flatMap(analyzeCampaignSnapshot);
}

export function getHealthScores(snapshots: CampaignSnapshot[]): HealthScore[] {
  return snapshots.map((snapshot) => {
    const clickRate = ctr(snapshot);
    const conversionRate = cvr(snapshot);
    const returnOnAdSpend = roas(snapshot);

    const factors = [
      { name: "CTR", score: Math.min(clickRate / 0.03, 1) * 100, weight: 0.25 },
      { name: "CVR", score: Math.min(conversionRate / 0.05, 1) * 100, weight: 0.35 },
      { name: "ROAS", score: Math.min(returnOnAdSpend / 4, 1) * 100, weight: 0.4 },
    ];

    const score = Math.round(
      factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0),
    );

    const grade: HealthScore["grade"] =
      score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

    return {
      campaignId: snapshot.campaignId,
      name: snapshot.name,
      score,
      grade,
      factors,
    };
  });
}

export function listRecommendations(snapshots: CampaignSnapshot[]): Recommendation[] {
  const insights = analyzeInsights(snapshots);
  return insights
    .filter((insight) => insight.recommendation)
    .map((insight) => ({
      id: insight.id,
      priority:
        insight.severity === "critical"
          ? ("high" as const)
          : insight.severity === "warning"
            ? ("medium" as const)
            : ("low" as const),
      title: insight.title,
      description: insight.description,
      ...(insight.campaignId !== undefined ? { campaignId: insight.campaignId } : {}),
      action: insight.recommendation ?? "Review campaign performance",
    }));
}

export function getExecutiveDashboard(snapshots: CampaignSnapshot[]) {
  const totalSpend = snapshots.reduce((sum, s) => sum + s.spend, 0);
  const totalRevenue = snapshots.reduce((sum, s) => sum + s.revenue, 0);
  const totalConversions = snapshots.reduce((sum, s) => sum + s.conversions, 0);
  const healthScores = getHealthScores(snapshots);
  const avgHealth =
    healthScores.length > 0
      ? Math.round(healthScores.reduce((sum, h) => sum + h.score, 0) / healthScores.length)
      : 0;

  return {
    summary: {
      campaigns: snapshots.length,
      totalSpend,
      totalRevenue,
      totalConversions,
      overallRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      averageHealthScore: avgHealth,
    },
    topPerformers: [...healthScores].sort((a, b) => b.score - a.score).slice(0, 3),
    criticalInsights: analyzeInsights(snapshots).filter((i) => i.severity === "critical"),
    generatedAt: new Date().toISOString(),
  };
}

export function getHealthCenter(snapshots: CampaignSnapshot[]) {
  const scores = getHealthScores(snapshots);
  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const score of scores) {
    distribution[score.grade]++;
  }

  return {
    overallScore:
      scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
        : 0,
    gradeDistribution: distribution,
    campaigns: scores,
    alerts: analyzeInsights(snapshots).filter(
      (i) => i.severity === "critical" || i.severity === "warning",
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function generateReport(snapshots: CampaignSnapshot[], events: TimelineEvent[]) {
  return {
    title: "Marketing Brain Insights Report",
    generatedAt: new Date().toISOString(),
    dashboard: getExecutiveDashboard(snapshots),
    healthCenter: getHealthCenter(snapshots),
    insights: analyzeInsights(snapshots),
    recommendations: listRecommendations(snapshots),
    timeline: events.slice(-20),
  };
}
