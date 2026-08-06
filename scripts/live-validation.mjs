import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readVersion, ROOT } from "./lib/shared.mjs";

const envPath = join(ROOT, ".env");
const reportPath = join(ROOT, "LIVE_VALIDATION_REPORT.md");
const version = readVersion();
const timestamp = new Date().toISOString();

if (!existsSync(envPath)) {
  const report = [
    "# Live Validation Report",
    "",
    `Marketing Brain v${version} LTS`,
    "",
    `Generated: ${timestamp}`,
    "",
    "## Status: BLOCKED",
    "",
    "Live validation requires a `.env` file with API credentials.",
    "",
    "1. Copy `.env.example` to `.env`",
    "2. Fill in Google Ads, Meta, and WhatsApp credentials",
    "3. Run `npm run live:validate` again",
    "",
    "This is expected for LTS distribution smoke checks without secrets.",
    "",
  ].join("\n");

  writeFileSync(reportPath, `${report}\n`);
  console.log("No .env found — wrote LIVE_VALIDATION_REPORT.md (blocked, exit 0)");
  process.exit(0);
}

const report = [
  "# Live Validation Report",
  "",
  `Marketing Brain v${version} LTS`,
  "",
  `Generated: ${timestamp}`,
  "",
  "## Status: READY (stub)",
  "",
  ".env file detected. Full live credential validation is not run in LTS scaffolding.",
  "Use each MCP server with real credentials in a controlled environment.",
  "",
].join("\n");

writeFileSync(reportPath, `${report}\n`);
console.log("Wrote LIVE_VALIDATION_REPORT.md — .env present (stub validation, exit 0)");
