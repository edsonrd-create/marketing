#!/usr/bin/env node
import { createLogger } from "@mcp-marketing/shared";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerInsightsTools } from "./tools/index.js";

const VERSION = "1.1.0";
const logger = createLogger("mcp-insights");

export function createInsightsMcpServer(): McpServer {
  const server = new McpServer({
    name: "mcp-marketing-insights",
    version: VERSION,
  });

  registerInsightsTools(server);
  return server;
}

async function main(): Promise<void> {
  const server = createInsightsMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info({ version: VERSION }, "Insights MCP server running on stdio");
}

const isDirectRun = process.argv[1]?.endsWith("server.js");
if (isDirectRun) {
  main().catch((error) => {
    logger.error(error, "Failed to start Insights MCP server");
    process.exit(1);
  });
}
