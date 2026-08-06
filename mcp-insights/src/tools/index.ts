import { registerTool, textResult } from "@mcp-marketing/shared";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  analyzeInsights,
  generateReport,
  getExecutiveDashboard,
  getHealthCenter,
  getHealthScores,
  listRecommendations,
} from "../services/analytics.js";
import { auditCampaignStructure, auditFromSnapshot } from "../services/audit.js";
import type { CampaignSnapshot, InsightsStore } from "../services/store.js";
import { loadInsightsStore, saveInsightsStore } from "../services/store.js";

export interface InsightsToolsContext {
  storePath?: string;
  getStore?: () => Promise<InsightsStore>;
  saveStore?: (store: InsightsStore) => Promise<void>;
}

const campaignSnapshotSchema = z.object({
  campaignId: z.string(),
  name: z.string(),
  channel: z.string(),
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  revenue: z.number(),
  periodStart: z.string(),
  periodEnd: z.string(),
});

function resolveStoreAccess(ctx: InsightsToolsContext) {
  const storePath = ctx.storePath;
  return {
    getStore: ctx.getStore ?? (() => loadInsightsStore(storePath)),
    saveStore: ctx.saveStore ?? ((store: InsightsStore) => saveInsightsStore(store, storePath)),
  };
}

function getSnapshots(store: InsightsStore, campaignId?: string): CampaignSnapshot[] {
  if (!campaignId) {
    return store.campaignSnapshots;
  }
  return store.campaignSnapshots.filter((s) => s.campaignId === campaignId);
}

export function registerInsightsTools(server: McpServer, ctx: InsightsToolsContext = {}): void {
  const { getStore, saveStore } = resolveStoreAccess(ctx);

  registerTool(
    server,
    "analyze_insights",
    {
      description: "Analyze campaign snapshots and return heuristic insights",
      inputSchema: {
        campaignId: z.string().optional().describe("Filter by campaign ID"),
        snapshots: z.array(campaignSnapshotSchema).optional().describe("Inline campaign snapshots"),
      },
    },
    async ({ campaignId, snapshots }) => {
      const store = await getStore();
      const data = snapshots ?? getSnapshots(store, campaignId);
      const insights = analyzeInsights(data);
      return { tool: "analyze_insights", count: insights.length, insights };
    },
  );

  registerTool(
    server,
    "get_health_scores",
    {
      description: "Calculate health scores for campaigns",
      inputSchema: {
        campaignId: z.string().optional(),
      },
    },
    async ({ campaignId }) => {
      const store = await getStore();
      const scores = getHealthScores(getSnapshots(store, campaignId));
      return { tool: "get_health_scores", scores };
    },
  );

  registerTool(
    server,
    "list_recommendations",
    {
      description: "List actionable recommendations from campaign heuristics",
      inputSchema: {
        campaignId: z.string().optional(),
        priority: z.enum(["high", "medium", "low"]).optional(),
      },
    },
    async ({ campaignId, priority }) => {
      const store = await getStore();
      let recommendations = listRecommendations(getSnapshots(store, campaignId));
      if (priority) {
        recommendations = recommendations.filter((r) => r.priority === priority);
      }
      return { tool: "list_recommendations", recommendations };
    },
  );

  registerTool(
    server,
    "get_executive_dashboard",
    {
      description: "Get executive summary dashboard for all campaigns",
      inputSchema: {},
    },
    async () => {
      const store = await getStore();
      const dashboard = getExecutiveDashboard(store.campaignSnapshots);
      return { tool: "get_executive_dashboard", dashboard };
    },
  );

  registerTool(
    server,
    "list_timeline_events",
    {
      description: "List marketing timeline events",
      inputSchema: {
        campaignId: z.string().optional(),
        limit: z.number().int().positive().max(100).optional(),
      },
    },
    async ({ campaignId, limit }) => {
      const store = await getStore();
      let events = store.timelineEvents;
      if (campaignId) {
        events = events.filter((e) => e.campaignId === campaignId);
      }
      if (limit) {
        events = events.slice(-limit);
      }
      return { tool: "list_timeline_events", events };
    },
  );

  registerTool(
    server,
    "record_timeline_event",
    {
      description: "Record a new timeline event in the JSON event store",
      inputSchema: {
        type: z.string().describe("Event type, e.g. campaign_launched"),
        title: z.string(),
        description: z.string().optional(),
        campaignId: z.string().optional(),
        occurredAt: z.string().optional().describe("ISO datetime, defaults to now"),
        metadata: z.record(z.unknown()).optional(),
      },
    },
    async ({ type, title, description, campaignId, occurredAt, metadata }) => {
      const store = await getStore();
      const now = new Date().toISOString();
      const event = {
        id: randomUUID(),
        type,
        title,
        ...(description !== undefined ? { description } : {}),
        ...(campaignId !== undefined ? { campaignId } : {}),
        ...(metadata !== undefined ? { metadata } : {}),
        occurredAt: occurredAt ?? now,
        createdAt: now,
      };
      store.timelineEvents.push(event);
      await saveStore(store);
      return { tool: "record_timeline_event", event };
    },
  );

  registerTool(
    server,
    "get_health_center",
    {
      description: "Get health center overview with grade distribution and alerts",
      inputSchema: {},
    },
    async () => {
      const store = await getStore();
      const healthCenter = getHealthCenter(store.campaignSnapshots);
      return { tool: "get_health_center", healthCenter };
    },
  );

  registerTool(
    server,
    "generate_report",
    {
      description: "Generate a comprehensive insights report",
      inputSchema: {
        format: z.enum(["json", "summary"]).optional().default("json"),
      },
    },
    async ({ format }) => {
      const store = await getStore();
      const report = generateReport(store.campaignSnapshots, store.timelineEvents);
      if (format === "summary") {
        return textResult(
          `Report: ${report.dashboard.summary.campaigns} campaigns, ROAS ${report.dashboard.summary.overallRoas.toFixed(2)}x, health ${report.dashboard.summary.averageHealthScore}`,
        );
      }
      return { tool: "generate_report", report };
    },
  );

  registerTool(
    server,
    "audit_campaign_structure",
    {
      description: "Audit campaign structures against marketing best practices and generate actionable optimization tasks",
      inputSchema: {
        campaignId: z.string().describe("Unique identifier for the campaign"),
        name: z.string().describe("Campaign name"),
        channel: z.string().optional().default("google").describe("Ad platform (google, meta, tiktok, linkedin)"),
        biddingStrategy: z.string().optional().describe("Bidding strategy (manual_cpc, target_cpa, target_roas, etc.)"),
        dailyBudget: z.number().optional().describe("Daily budget amount"),
        targetCpa: z.number().optional().describe("Target CPA value if applicable"),
        targetRoas: z.number().optional().describe("Target ROAS multiplier if applicable"),
        negativeKeywords: z.array(z.string()).optional().describe("List of negative keywords"),
        negativeKeywordsCount: z.number().optional().describe("Count of negative keywords configured"),
        adGroupsCount: z.number().optional().describe("Number of ad groups"),
        trackingConfig: z.object({
          ga4Configured: z.boolean().optional(),
          gtmConfigured: z.boolean().optional(),
          metaCapiConfigured: z.boolean().optional(),
          serverSideTracking: z.boolean().optional(),
        }).optional().describe("Tracking and CAPI server-side configuration"),
      },
    },
    async (params) => {
      const store = await getStore();
      const auditResult = auditCampaignStructure({
        campaignId: params.campaignId,
        name: params.name,
        channel: params.channel ?? "google",
        biddingStrategy: params.biddingStrategy,
        dailyBudget: params.dailyBudget,
        targetCpa: params.targetCpa,
        targetRoas: params.targetRoas,
        negativeKeywords: params.negativeKeywords,
        negativeKeywordsCount: params.negativeKeywordsCount,
        adGroupsCount: params.adGroupsCount,
        trackingConfig: params.trackingConfig,
      });

      // Save audit results and optimization tasks into the store
      if (!store.auditResults) store.auditResults = [];
      if (!store.optimizationTasks) store.optimizationTasks = [];

      store.auditResults = store.auditResults.filter((a) => a.campaignId !== params.campaignId);
      store.auditResults.push(auditResult);

      // Add new tasks avoiding exact duplicates
      for (const task of auditResult.optimizationTasks) {
        const exists = store.optimizationTasks.some(
          (t) => t.campaignId === task.campaignId && t.title === task.title,
        );
        if (!exists) {
          store.optimizationTasks.push(task);
        }
      }

      await saveStore(store);

      return { tool: "audit_campaign_structure", auditResult };
    },
  );

  registerTool(
    server,
    "list_optimization_tasks",
    {
      description: "List generated optimization tasks from campaign structure audits",
      inputSchema: {
        campaignId: z.string().optional().describe("Filter optimization tasks by campaign ID"),
        priority: z.enum(["high", "medium", "low"]).optional().describe("Filter by task priority"),
        status: z.enum(["pending", "in_progress", "completed"]).optional().describe("Filter by task status"),
      },
    },
    async ({ campaignId, priority, status }) => {
      const store = await getStore();
      let tasks = store.optimizationTasks ?? [];

      // If store has no tasks yet, run default audit from campaignSnapshots
      if (tasks.length === 0 && store.campaignSnapshots.length > 0) {
        for (const snap of store.campaignSnapshots) {
          const audit = auditFromSnapshot(snap);
          tasks.push(...audit.optimizationTasks);
        }
      }

      if (campaignId) {
        tasks = tasks.filter((t) => t.campaignId === campaignId);
      }
      if (priority) {
        tasks = tasks.filter((t) => t.priority === priority);
      }
      if (status) {
        tasks = tasks.filter((t) => t.status === status);
      }

      return { tool: "list_optimization_tasks", count: tasks.length, tasks };
    },
  );
}

export function seedDemoSnapshots(): CampaignSnapshot[] {
  return [
    {
      campaignId: "camp-001",
      name: "Summer Sale",
      channel: "meta",
      spend: 5000,
      impressions: 250000,
      clicks: 7500,
      conversions: 300,
      revenue: 18000,
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    },
    {
      campaignId: "camp-002",
      name: "Retargeting",
      channel: "google",
      spend: 2000,
      impressions: 50000,
      clicks: 500,
      conversions: 10,
      revenue: 800,
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    },
  ];
}
