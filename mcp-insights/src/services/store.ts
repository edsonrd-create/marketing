import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { readJsonFile, writeJsonFile } from "@mcp-marketing/shared";
import type { CampaignAuditResult, OptimizationTask } from "./audit.js";

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  campaignId?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
  createdAt: string;
}

export interface InsightsStore {
  timelineEvents: TimelineEvent[];
  campaignSnapshots: CampaignSnapshot[];
  optimizationTasks?: OptimizationTask[];
  auditResults?: CampaignAuditResult[];
}

export interface CampaignSnapshot {
  campaignId: string;
  name: string;
  channel: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  periodStart: string;
  periodEnd: string;
}

const DEFAULT_STORE: InsightsStore = {
  timelineEvents: [],
  campaignSnapshots: [],
  optimizationTasks: [],
  auditResults: [],
};

export function getDefaultStorePath(): string {
  return (
    process.env.INSIGHTS_STORE_PATH ??
    path.join(os.homedir(), ".marketing-brain", "insights-store.json")
  );
}

export async function loadInsightsStore(storePath = getDefaultStorePath()): Promise<InsightsStore> {
  if (!existsSync(storePath)) {
    return structuredClone(DEFAULT_STORE);
  }
  return readJsonFile<InsightsStore>(storePath);
}

export async function saveInsightsStore(
  store: InsightsStore,
  storePath = getDefaultStorePath(),
): Promise<void> {
  await writeJsonFile(storePath, store);
}
