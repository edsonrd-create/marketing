import type { GoogleAdsProvider } from "../services/GoogleAdsProvider.js";

export class CampaignService {
  constructor(private readonly provider: GoogleAdsProvider) {}

  list() {
    return this.provider.listCampaigns();
  }

  get(campaignId: string) {
    return this.provider.getCampaign(campaignId);
  }

  create(input: { name: string; budgetMicros: number; channelType: string }) {
    return this.provider.createCampaign(input);
  }

  pause(campaignId: string) {
    return this.provider.pauseCampaign(campaignId);
  }

  enable(campaignId: string) {
    return this.provider.enableCampaign(campaignId);
  }
}
