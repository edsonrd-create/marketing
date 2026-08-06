import { loadEnv } from "@mcp-marketing/shared";
import { GoogleAdsAuthManager } from "./auth/GoogleAdsAuthManager.js";
import { CampaignService } from "./campaigns/CampaignService.js";
import { KeywordService } from "./keywords/KeywordService.js";
import { ReportService } from "./reports/ReportService.js";
import { BudgetService } from "./budgets/BudgetService.js";
import { CustomerService } from "./customers/CustomerService.js";
import { ConversionService } from "./conversions/ConversionService.js";
import { GoogleAdsProvider } from "./services/GoogleAdsProvider.js";
import { googleAdsEnvSchema, type GoogleAdsEnv } from "./schemas/index.js";

export { GoogleAdsAuthManager } from "./auth/GoogleAdsAuthManager.js";
export { GoogleAdsProvider } from "./services/GoogleAdsProvider.js";
export { registerGoogleAdsTools, GOOGLE_ADS_TOOL_NAMES } from "./tools/index.js";
export { googleAdsEnvSchema, type GoogleAdsEnv } from "./schemas/index.js";
export type * from "./schemas/types.js";

export interface GoogleAdsModule {
  env: GoogleAdsEnv;
  auth: GoogleAdsAuthManager;
  provider: GoogleAdsProvider;
  campaigns: CampaignService;
  keywords: KeywordService;
  reports: ReportService;
  budgets: BudgetService;
  customers: CustomerService;
  conversions: ConversionService;
}

export function loadGoogleAdsProviderEnv(): GoogleAdsEnv {
  return loadEnv({ schema: googleAdsEnvSchema });
}

export async function createGoogleAdsModule(
  env: GoogleAdsEnv = loadGoogleAdsProviderEnv(),
): Promise<GoogleAdsModule> {
  const auth = new GoogleAdsAuthManager(env);
  await auth.initialize();
  const provider = new GoogleAdsProvider(auth);

  return {
    env,
    auth,
    provider,
    campaigns: new CampaignService(provider),
    keywords: new KeywordService(provider),
    reports: new ReportService(provider),
    budgets: new BudgetService(provider),
    customers: new CustomerService(provider),
    conversions: new ConversionService(),
  };
}
