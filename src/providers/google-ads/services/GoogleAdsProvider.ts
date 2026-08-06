import { AppError, ErrorCode } from "@mcp-marketing/shared";
import type { GoogleAdsAuthManager } from "../auth/GoogleAdsAuthManager.js";
import type { GoogleAdsCampaign } from "../schemas/types.js";
import { LiveGoogleAdsClient } from "./LiveGoogleAdsClient.js";
import { MockGoogleAdsStore } from "./MockGoogleAdsStore.js";
import { withGoogleAdsLogging } from "./logging.js";

type DataSource = MockGoogleAdsStore | LiveGoogleAdsClient;

/**
 * Facade used by domain modules and MCP tools.
 */
export class GoogleAdsProvider {
  private readonly source: DataSource;

  constructor(private readonly auth: GoogleAdsAuthManager) {
    this.source = auth.isLiveMode()
      ? new LiveGoogleAdsClient(auth)
      : new MockGoogleAdsStore(auth.getCustomerId());
  }

  getCustomerId(): string {
    return this.auth.getCustomerId();
  }

  isLiveMode(): boolean {
    return this.auth.isLiveMode();
  }

  private async call<T>(tool: string, fn: () => Promise<T>): Promise<T> {
    return withGoogleAdsLogging(tool, this.getCustomerId(), fn);
  }

  private store(): MockGoogleAdsStore {
    return this.source as MockGoogleAdsStore;
  }

  private live(): LiveGoogleAdsClient {
    return this.source as LiveGoogleAdsClient;
  }

  async listCampaigns() {
    return this.call("list_campaigns", async () =>
      this.isLiveMode() ? this.live().listCampaigns() : this.store().listCampaigns(),
    );
  }

  async getCampaign(campaignId: string) {
    return this.call("get_campaign", async () => {
      if (this.isLiveMode()) {
        return this.live().getCampaign(campaignId);
      }
      const campaign = this.store().getCampaign(campaignId);
      if (!campaign) {
        throw new AppError({
          code: ErrorCode.NOT_FOUND,
          message: `Campaign not found: ${campaignId}`,
        });
      }
      return campaign;
    });
  }

  async createCampaign(input: { name: string; budgetMicros: number; channelType: string }) {
    return this.call("create_campaign", async () =>
      this.isLiveMode() ? this.live().createCampaign(input) : this.store().createCampaign(input),
    );
  }

  async pauseCampaign(campaignId: string) {
    return this.call("pause_campaign", async () => {
      if (this.isLiveMode()) {
        return this.live().pauseCampaign(campaignId);
      }
      const campaign = this.store().setStatus(campaignId, "PAUSED");
      if (!campaign) {
        throw new AppError({
          code: ErrorCode.NOT_FOUND,
          message: `Campaign not found: ${campaignId}`,
        });
      }
      return campaign;
    });
  }

  async enableCampaign(campaignId: string) {
    return this.call("enable_campaign", async () => {
      if (this.isLiveMode()) {
        return this.live().enableCampaign(campaignId);
      }
      const campaign = this.store().setStatus(campaignId, "ENABLED");
      if (!campaign) {
        throw new AppError({
          code: ErrorCode.NOT_FOUND,
          message: `Campaign not found: ${campaignId}`,
        });
      }
      return campaign;
    });
  }

  async updateBudget(campaignId: string, budgetMicros: number) {
    return this.call("update_budget", async () => {
      if (this.isLiveMode()) {
        return this.live().updateBudget(campaignId, budgetMicros);
      }
      const campaign = this.store().updateBudget(campaignId, budgetMicros);
      if (!campaign) {
        throw new AppError({
          code: ErrorCode.NOT_FOUND,
          message: `Campaign not found: ${campaignId}`,
        });
      }
      return campaign;
    });
  }

  async campaignReport(input: { campaignId?: string; dateRange: string }) {
    return this.call("campaign_report", async () => {
      if (this.isLiveMode()) {
        return this.live().campaignReport(input);
      }
      if (input.campaignId && !this.store().getCampaign(input.campaignId)) {
        throw new AppError({
          code: ErrorCode.NOT_FOUND,
          message: `Campaign not found: ${input.campaignId}`,
        });
      }
      return this.store().campaignReport(input);
    });
  }

  async searchKeywords(query: string, limit: number) {
    return this.call("search_keywords", async () =>
      this.isLiveMode()
        ? this.live().searchKeywords(query, limit)
        : this.store().searchKeywords(query, limit),
    );
  }

  async listCustomers() {
    return this.call("list_customers", async () =>
      this.isLiveMode() ? this.live().listCustomers() : this.store().listCustomers(),
    );
  }

  async accountInfo() {
    return this.call("account_info", async () =>
      this.isLiveMode() ? this.live().accountInfo() : this.store().accountInfo(),
    );
  }

  /** Test helper */
  asCampaign(campaign: GoogleAdsCampaign): GoogleAdsCampaign {
    return campaign;
  }
}
