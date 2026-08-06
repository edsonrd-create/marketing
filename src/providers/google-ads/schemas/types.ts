export type CampaignStatus = "ENABLED" | "PAUSED" | "REMOVED";

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budgetMicros: number;
  channelType: string;
  resourceName?: string;
}

export interface GoogleAdsKeywordIdea {
  keyword: string;
  avgMonthlySearches: number;
  competition: "LOW" | "MEDIUM" | "HIGH" | "UNSPECIFIED";
  suggestedBidMicros: number;
}

export interface CampaignReportRow {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  dateRange: string;
}

export interface GoogleAdsCustomerSummary {
  id: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  manager: boolean;
}

export interface GoogleAdsAccountInfo {
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  autoTaggingEnabled: boolean;
  trackingUrlTemplate: string | null;
  mode: "live" | "mock";
}
