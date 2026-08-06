import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { structuredResult, withToolErrorHandling } from "@mcp-marketing/shared";
import { z } from "zod";
import type { GoogleAdsProvider } from "../services/GoogleAdsProvider.js";
import {
  accountInfoSchema,
  campaignReportSchema,
  createCampaignSchema,
  enableCampaignSchema,
  getCampaignSchema,
  listCampaignsSchema,
  listCustomersSchema,
  pauseCampaignSchema,
  searchKeywordsSchema,
  updateBudgetSchema,
} from "../schemas/index.js";

type ToolHandler = (args: Record<string, unknown>) => Promise<CallToolResult>;

function toolHandler(handler: ToolHandler): ToolHandler {
  return withToolErrorHandling(handler) as ToolHandler;
}

/** MCP tool names for the Google Ads provider (Sprint 2). */
export const GOOGLE_ADS_TOOL_NAMES = [
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
] as const;

export type GoogleAdsToolName = (typeof GOOGLE_ADS_TOOL_NAMES)[number];

export function registerGoogleAdsTools(server: McpServer, provider: GoogleAdsProvider): void {
  server.tool(
    "list_campaigns",
    "List all Google Ads campaigns for the configured customer",
    listCampaignsSchema.shape,
    toolHandler(async (raw) => {
      listCampaignsSchema.parse(raw);
      const campaigns = await provider.listCampaigns();
      return structuredResult({
        campaigns,
        customerId: provider.getCustomerId(),
        mode: provider.isLiveMode() ? "live" : "mock",
      });
    }),
  );

  server.tool(
    "get_campaign",
    "Get a Google Ads campaign by ID",
    getCampaignSchema.shape,
    toolHandler(async (raw) => {
      const { campaign_id } = getCampaignSchema.parse(raw);
      const campaign = await provider.getCampaign(campaign_id);
      return structuredResult({ campaign, customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "create_campaign",
    "Create a new Google Ads campaign",
    {
      name: z.string().min(1).describe("Campaign name"),
      budget_micros: z.number().int().positive().describe("Daily budget in micros"),
      channel_type: z.string().optional().describe("Channel type, e.g. SEARCH"),
    },
    toolHandler(async (raw) => {
      const input = createCampaignSchema.parse(raw);
      const campaign = await provider.createCampaign({
        name: input.name,
        budgetMicros: input.budget_micros,
        channelType: input.channel_type,
      });
      return structuredResult({ campaign, customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "pause_campaign",
    "Pause a Google Ads campaign",
    pauseCampaignSchema.shape,
    toolHandler(async (raw) => {
      const { campaign_id } = pauseCampaignSchema.parse(raw);
      const campaign = await provider.pauseCampaign(campaign_id);
      return structuredResult({ campaign, action: "paused", customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "enable_campaign",
    "Enable a paused Google Ads campaign",
    enableCampaignSchema.shape,
    toolHandler(async (raw) => {
      const { campaign_id } = enableCampaignSchema.parse(raw);
      const campaign = await provider.enableCampaign(campaign_id);
      return structuredResult({ campaign, action: "enabled", customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "update_budget",
    "Update the daily budget for a Google Ads campaign",
    updateBudgetSchema.shape,
    toolHandler(async (raw) => {
      const { campaign_id, budget_micros } = updateBudgetSchema.parse(raw);
      const campaign = await provider.updateBudget(campaign_id, budget_micros);
      return structuredResult({ campaign, customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "campaign_report",
    "Get performance report for Google Ads campaigns",
    {
      campaign_id: z.string().optional().describe("Optional campaign ID filter"),
      date_range: z.string().optional().describe("Date range label, e.g. LAST_30_DAYS"),
    },
    toolHandler(async (raw) => {
      const input = campaignReportSchema.parse(raw);
      const reportInput: { dateRange: string; campaignId?: string } = {
        dateRange: input.date_range,
      };
      if (input.campaign_id !== undefined) {
        reportInput.campaignId = input.campaign_id;
      }
      const rows = await provider.campaignReport(reportInput);
      return structuredResult({
        rows,
        dateRange: input.date_range,
        customerId: provider.getCustomerId(),
      });
    }),
  );

  server.tool(
    "search_keywords",
    "Search keyword ideas for Google Ads",
    {
      query: z.string().min(1).describe("Seed keyword query"),
      limit: z.number().int().min(1).max(50).optional().describe("Max results"),
    },
    toolHandler(async (raw) => {
      const input = searchKeywordsSchema.parse(raw);
      const keywords = await provider.searchKeywords(input.query, input.limit);
      return structuredResult({ keywords, customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "list_customers",
    "List Google Ads customer accounts accessible to the configured credentials",
    listCustomersSchema.shape,
    toolHandler(async (raw) => {
      listCustomersSchema.parse(raw);
      const customers = await provider.listCustomers();
      return structuredResult({ customers, customerId: provider.getCustomerId() });
    }),
  );

  server.tool(
    "account_info",
    "Get Google Ads account information for the configured customer ID",
    accountInfoSchema.shape,
    toolHandler(async (raw) => {
      accountInfoSchema.parse(raw);
      const account = await provider.accountInfo();
      return structuredResult({ account, customerId: provider.getCustomerId() });
    }),
  );
}
