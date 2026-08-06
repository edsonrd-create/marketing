import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const CLI_ROOT = join(__dirname, "..");
export const REPO_ROOT = join(CLI_ROOT, "..", "..");

export const MIN_NODE_MAJOR = 22;

export const WORKSPACES = [
  { dir: "shared", name: "@mcp-marketing/shared" },
  { dir: "mcp-google-ads", name: "@mcp-marketing/google-ads", tools: 10 },
  { dir: "mcp-meta-ads", name: "@mcp-marketing/meta-ads", tools: 8 },
  { dir: "mcp-whatsapp", name: "@mcp-marketing/whatsapp", tools: 6 },
  { dir: "mcp-insights", name: "@mcp-marketing/insights", tools: 8 },
  { dir: "mcp-ai-agent", name: "@mcp-marketing/ai-agent", tools: 7 },
  { dir: "mcp-workflows", name: "@mcp-marketing/workflows", tools: 13 },
  { dir: "packages/cli", name: "@mcp-marketing/cli" },
  { dir: "packages/create-marketing-brain", name: "@mcp-marketing/create-marketing-brain" },
];

export const START_COMMANDS = [
  { script: "start:google", label: "Google Ads MCP" },
  { script: "start:meta", label: "Meta Ads MCP" },
  { script: "start:whatsapp", label: "WhatsApp MCP" },
  { script: "start:insights", label: "Insights MCP" },
  { script: "start:ai-agent", label: "AI Agent MCP" },
  { script: "start:workflows", label: "Workflows MCP" },
];

export { readFileSync, existsSync } from "node:fs";
export { join } from "node:path";
