import type {
  CampaignReportRow,
  GoogleAdsAccountInfo,
  GoogleAdsCampaign,
  GoogleAdsCustomerSummary,
  GoogleAdsKeywordIdea,
} from "../schemas/types.js";

/** In-memory store used for mock mode and unit tests. */
export class MockGoogleAdsStore {
  private readonly campaigns = new Map<string, GoogleAdsCampaign>();
  private readonly customers: GoogleAdsCustomerSummary[];
  private readonly account: GoogleAdsAccountInfo;

  constructor(customerId: string) {
    this.customers = [
      {
        id: customerId,
        descriptiveName: "Marketing Brain Demo Account",
        currencyCode: "BRL",
        timeZone: "America/Sao_Paulo",
        manager: false,
      },
      {
        id: "9999999999",
        descriptiveName: "Demo MCC",
        currencyCode: "USD",
        timeZone: "America/New_York",
        manager: true,
      },
    ];

    this.account = {
      customerId,
      descriptiveName: "Marketing Brain Demo Account",
      currencyCode: "BRL",
      timeZone: "America/Sao_Paulo",
      autoTaggingEnabled: true,
      trackingUrlTemplate: null,
      mode: "mock",
    };

    this.seed();
  }

  private seed(): void {
    const defaults: GoogleAdsCampaign[] = [
      {
        id: "1001",
        name: "Brand Awareness",
        status: "ENABLED",
        budgetMicros: 50_000_000,
        channelType: "SEARCH",
      },
      {
        id: "1002",
        name: "Retargeting",
        status: "PAUSED",
        budgetMicros: 25_000_000,
        channelType: "DISPLAY",
      },
    ];
    for (const campaign of defaults) {
      this.campaigns.set(campaign.id, { ...campaign });
    }
  }

  listCampaigns(): GoogleAdsCampaign[] {
    return [...this.campaigns.values()].map((c) => ({ ...c }));
  }

  getCampaign(campaignId: string): GoogleAdsCampaign | null {
    const campaign = this.campaigns.get(campaignId);
    return campaign ? { ...campaign } : null;
  }

  createCampaign(input: {
    name: string;
    budgetMicros: number;
    channelType: string;
  }): GoogleAdsCampaign {
    const id = String(1000 + this.campaigns.size + 1);
    const campaign: GoogleAdsCampaign = {
      id,
      name: input.name,
      status: "ENABLED",
      budgetMicros: input.budgetMicros,
      channelType: input.channelType,
    };
    this.campaigns.set(id, campaign);
    return { ...campaign };
  }

  setStatus(campaignId: string, status: GoogleAdsCampaign["status"]): GoogleAdsCampaign | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;
    campaign.status = status;
    return { ...campaign };
  }

  updateBudget(campaignId: string, budgetMicros: number): GoogleAdsCampaign | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;
    campaign.budgetMicros = budgetMicros;
    return { ...campaign };
  }

  searchKeywords(query: string, limit: number): GoogleAdsKeywordIdea[] {
    const base = query.trim() || "marketing";
    return Array.from({ length: Math.min(limit, 10) }, (_, index) => ({
      keyword: `${base} ${index + 1}`,
      avgMonthlySearches: 1000 * (index + 1),
      competition: (["LOW", "MEDIUM", "HIGH"] as const)[index % 3],
      suggestedBidMicros: 500_000 * (index + 1),
    }));
  }

  campaignReport(input: {
    campaignId?: string;
    dateRange: string;
  }): CampaignReportRow[] {
    const campaigns = input.campaignId
      ? [this.getCampaign(input.campaignId)].filter(Boolean)
      : this.listCampaigns();

    return (campaigns as GoogleAdsCampaign[]).map((campaign, index) => ({
      campaignId: campaign.id,
      campaignName: campaign.name,
      impressions: 10_000 * (index + 1),
      clicks: 500 * (index + 1),
      costMicros: Math.floor(campaign.budgetMicros / 2),
      conversions: 25 * (index + 1),
      dateRange: input.dateRange,
    }));
  }

  listCustomers(): GoogleAdsCustomerSummary[] {
    return this.customers.map((c) => ({ ...c }));
  }

  accountInfo(): GoogleAdsAccountInfo {
    return { ...this.account };
  }
}
