/**
 * Tool registry placeholder for the HTTP/app shell.
 * MCP tools remain in mcp-* packages (52 tools) — do not duplicate here.
 */
export const APP_TOOL_MODULES = [
  "google-ads",
  "meta-ads",
  "whatsapp",
  "insights",
  "ai-agent",
  "workflows",
] as const;

export type AppToolModule = (typeof APP_TOOL_MODULES)[number];
