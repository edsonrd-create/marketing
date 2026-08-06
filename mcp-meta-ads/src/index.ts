#!/usr/bin/env node
import { startMetaAdsServer } from "./server.js";

startMetaAdsServer().catch((error: unknown) => {
  console.error("Failed to start Meta Ads MCP server:", error);
  process.exit(1);
});
