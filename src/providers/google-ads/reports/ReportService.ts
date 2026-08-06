import type { GoogleAdsProvider } from "../services/GoogleAdsProvider.js";

export class ReportService {
  constructor(private readonly provider: GoogleAdsProvider) {}

  campaignReport(input: { campaignId?: string; dateRange: string }) {
    return this.provider.campaignReport(input);
  }
}
