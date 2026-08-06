#!/usr/bin/env node
/**
 * Validate Google Ads provider — env, auth manager, 10 tools, mock round-trip.
 */
import { createGoogleAdsModule, GOOGLE_ADS_TOOL_NAMES } from "../src/providers/google-ads/index.js";

const required = [
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_REFRESH_TOKEN",
  "GOOGLE_ADS_DEVELOPER_TOKEN",
  "GOOGLE_ADS_CUSTOMER_ID",
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`PASS: ${message}`);
}

console.log("Google Ads provider validation");
console.log("==============================");

process.env.GOOGLE_ADS_SKIP_AUTH_VALIDATE ??= "true";
process.env.GOOGLE_ADS_FORCE_MOCK ??= "true";
process.env.GOOGLE_ADS_LIVE_AUTH ??= "0";
process.env.SKIP_DOTENV_FILE ??= "true";

for (const key of required) {
  if (!process.env[key]) {
    process.env[key] = `validate-${key.toLowerCase()}`;
  }
}

if (GOOGLE_ADS_TOOL_NAMES.length !== 10) {
  fail(`Expected 10 tools, found ${GOOGLE_ADS_TOOL_NAMES.length}`);
}
ok(`tool catalog: ${GOOGLE_ADS_TOOL_NAMES.length}`);

const module = await createGoogleAdsModule();
ok(`auth initialized (customerId=${module.auth.getCustomerId()}, live=${module.auth.isLiveMode()})`);

const checks = [
  ["list_campaigns", () => module.provider.listCampaigns()],
  ["get_campaign", () => module.provider.getCampaign("1001")],
  ["create_campaign", () =>
    module.provider.createCampaign({
      name: "Validate Campaign",
      budgetMicros: 1_000_000,
      channelType: "SEARCH",
    })],
  ["pause_campaign", () => module.provider.pauseCampaign("1001")],
  ["enable_campaign", () => module.provider.enableCampaign("1001")],
  ["update_budget", () => module.provider.updateBudget("1001", 2_000_000)],
  ["campaign_report", () => module.provider.campaignReport({ dateRange: "LAST_30_DAYS" })],
  ["search_keywords", () => module.provider.searchKeywords("marketing", 3)],
  ["list_customers", () => module.provider.listCustomers()],
  ["account_info", () => module.provider.accountInfo()],
];

for (const [name, fn] of checks) {
  const started = performance.now();
  await fn();
  ok(`${name} (${Math.round(performance.now() - started)}ms)`);
}

console.log("\nGoogle Ads validation passed — connect a real account with GOOGLE_ADS_LIVE_AUTH=1.");
