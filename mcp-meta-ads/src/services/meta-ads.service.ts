import { AppError, ErrorCode } from "@mcp-marketing/shared";

export interface MetaCampaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  objective: string;
  dailyBudget: number;
}

export interface MetaAudience {
  id: string;
  name: string;
  subtype: string;
  approximateCount: number;
}

export interface MetaAd {
  id: string;
  name: string;
  campaignId: string;
  creativeBody: string;
  status: "ACTIVE" | "PAUSED";
}

export interface MetaMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
}

export interface MetaAdsServiceOptions {
  adAccountId: string;
}

export class MetaAdsService {
  private readonly campaigns = new Map<string, MetaCampaign>();
  private readonly audiences = new Map<string, MetaAudience>();
  private readonly ads = new Map<string, MetaAd>();

  constructor(private readonly options: MetaAdsServiceOptions) {
    this.seedMockData();
  }

  private seedMockData(): void {
    const defaults: MetaCampaign[] = [
      {
        id: "2001",
        name: "Meta Prospecting",
        status: "ACTIVE",
        objective: "OUTCOME_TRAFFIC",
        dailyBudget: 100,
      },
      {
        id: "2002",
        name: "Meta Retargeting",
        status: "PAUSED",
        objective: "OUTCOME_SALES",
        dailyBudget: 75,
      },
    ];

    for (const campaign of defaults) {
      this.campaigns.set(campaign.id, campaign);
    }
  }

  async listCampaigns(): Promise<MetaCampaign[]> {
    return [...this.campaigns.values()];
  }

  async createCampaign(input: {
    name: string;
    objective: string;
    dailyBudget: number;
  }): Promise<MetaCampaign> {
    const id = String(2000 + this.campaigns.size + 1);
    const campaign: MetaCampaign = {
      id,
      name: input.name,
      status: "ACTIVE",
      objective: input.objective,
      dailyBudget: input.dailyBudget,
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async pauseCampaign(campaignId: string): Promise<MetaCampaign> {
    const campaign = await this.getCampaign(campaignId);
    campaign.status = "PAUSED";
    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  async resumeCampaign(campaignId: string): Promise<MetaCampaign> {
    const campaign = await this.getCampaign(campaignId);
    campaign.status = "ACTIVE";
    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  async updateBudget(campaignId: string, dailyBudget: number): Promise<MetaCampaign> {
    const campaign = await this.getCampaign(campaignId);
    campaign.dailyBudget = dailyBudget;
    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  async createAudience(input: {
    name: string;
    subtype?: string;
    approximateCount?: number;
  }): Promise<MetaAudience> {
    const id = String(3000 + this.audiences.size + 1);
    const audience: MetaAudience = {
      id,
      name: input.name,
      subtype: input.subtype ?? "CUSTOM",
      approximateCount: input.approximateCount ?? 10_000,
    };
    this.audiences.set(id, audience);
    return audience;
  }

  async createAd(input: {
    name: string;
    campaignId: string;
    creativeBody: string;
  }): Promise<MetaAd> {
    await this.getCampaign(input.campaignId);
    const id = String(4000 + this.ads.size + 1);
    const ad: MetaAd = {
      id,
      name: input.name,
      campaignId: input.campaignId,
      creativeBody: input.creativeBody,
      status: "ACTIVE",
    };
    this.ads.set(id, ad);
    return ad;
  }

  async getMetrics(input?: { campaignId?: string }): Promise<MetaMetrics[]> {
    const campaigns = input?.campaignId
      ? [await this.getCampaign(input.campaignId)]
      : await this.listCampaigns();

    return campaigns.map((campaign, index) => ({
      campaignId: campaign.id,
      impressions: 8000 * (index + 1),
      clicks: 400 * (index + 1),
      spend: campaign.dailyBudget * 7 * (index + 1),
      reach: 5000 * (index + 1),
      ctr: 0.05,
    }));
  }

  private async getCampaign(campaignId: string): Promise<MetaCampaign> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new AppError({
        code: ErrorCode.NOT_FOUND,
        message: `Meta campaign not found: ${campaignId}`,
      });
    }
    return campaign;
  }

  getAdAccountId(): string {
    return this.options.adAccountId;
  }
}
