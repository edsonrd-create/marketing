import { z } from "zod";
import { structuredResult, withToolErrorHandling } from "@mcp-marketing/shared";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MetaAdsService } from "../services/meta-ads.service.js";

type ToolHandler = (args: Record<string, unknown>) => Promise<CallToolResult>;

function toolHandler(handler: ToolHandler): ToolHandler {
  return withToolErrorHandling(handler) as ToolHandler;
}

export function registerMetaAdsTools(server: McpServer, service: MetaAdsService): void {
  server.tool(
    "list_campaigns",
    "List all Meta (Facebook/Instagram) ad campaigns",
    {},
    toolHandler(async () => {
      const campaigns = await service.listCampaigns();
      return structuredResult({ campaigns, adAccountId: service.getAdAccountId() });
    }),
  );

  server.tool(
    "create_campaign",
    "Create a new Meta ad campaign",
    {
      name: z.string().min(1).describe("Campaign name"),
      objective: z.string().min(1).describe("Campaign objective"),
      daily_budget: z.number().positive().describe("Daily budget in account currency"),
    },
    toolHandler(async ({ name, objective, daily_budget }) => {
      const campaign = await service.createCampaign({
        name: String(name),
        objective: String(objective),
        dailyBudget: Number(daily_budget),
      });
      return structuredResult({ campaign });
    }),
  );

  server.tool(
    "pause_campaign",
    "Pause a Meta ad campaign",
    { campaign_id: z.string().min(1).describe("Campaign ID") },
    toolHandler(async ({ campaign_id }) => {
      const campaign = await service.pauseCampaign(String(campaign_id));
      return structuredResult({ campaign, action: "paused" });
    }),
  );

  server.tool(
    "resume_campaign",
    "Resume a paused Meta ad campaign",
    { campaign_id: z.string().min(1).describe("Campaign ID") },
    toolHandler(async ({ campaign_id }) => {
      const campaign = await service.resumeCampaign(String(campaign_id));
      return structuredResult({ campaign, action: "resumed" });
    }),
  );

  server.tool(
    "update_budget",
    "Update the daily budget for a Meta ad campaign",
    {
      campaign_id: z.string().min(1).describe("Campaign ID"),
      daily_budget: z.number().positive().describe("New daily budget"),
    },
    toolHandler(async ({ campaign_id, daily_budget }) => {
      const campaign = await service.updateBudget(String(campaign_id), Number(daily_budget));
      return structuredResult({ campaign });
    }),
  );

  server.tool(
    "create_audience",
    "Create a custom audience for Meta ads",
    {
      name: z.string().min(1).describe("Audience name"),
      subtype: z.string().optional().describe("Audience subtype"),
      approximate_count: z.number().int().positive().optional().describe("Approximate audience size"),
    },
    toolHandler(async ({ name, subtype, approximate_count }) => {
      const input: { name: string; subtype?: string; approximateCount?: number } = {
        name: String(name),
      };
      if (subtype !== undefined) {
        input.subtype = String(subtype);
      }
      if (approximate_count !== undefined) {
        input.approximateCount = Number(approximate_count);
      }
      const audience = await service.createAudience(input);
      return structuredResult({ audience });
    }),
  );

  server.tool(
    "create_ad",
    "Create a Meta ad within a campaign",
    {
      name: z.string().min(1).describe("Ad name"),
      campaign_id: z.string().min(1).describe("Campaign ID"),
      creative_body: z.string().min(1).describe("Ad creative body text"),
    },
    toolHandler(async ({ name, campaign_id, creative_body }) => {
      const ad = await service.createAd({
        name: String(name),
        campaignId: String(campaign_id),
        creativeBody: String(creative_body),
      });
      return structuredResult({ ad });
    }),
  );

  server.tool(
    "get_metrics",
    "Get performance metrics for Meta ad campaigns",
    {
      campaign_id: z.string().optional().describe("Optional campaign ID filter"),
    },
    toolHandler(async ({ campaign_id }) => {
      const input: { campaignId?: string } = {};
      if (campaign_id !== undefined) {
        input.campaignId = String(campaign_id);
      }
      const metrics = await service.getMetrics(input);
      return structuredResult({ metrics });
    }),
  );
}
