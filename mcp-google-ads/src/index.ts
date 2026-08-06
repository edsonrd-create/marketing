#!/usr/bin/env node
export * from "./logging/google-ads-logger.js";
export { startGoogleAdsServer } from "./server.js";

startGoogleAdsServer().catch((error: unknown) => {
  console.error("Failed to start Google Ads MCP server:", error);
  process.exit(1);
});

