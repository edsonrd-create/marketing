import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createLogger } from "@mcp-marketing/shared";
import {
  createGoogleAdsModule,
  registerGoogleAdsTools,
  type GoogleAdsModule,
} from "../../src/providers/google-ads/index.js";

const SERVER_NAME = "mcp-google-ads";
const SERVER_VERSION = "1.1.0";

const logger = createLogger(SERVER_NAME);

export interface GoogleAdsServerContext {
  server: McpServer;
  module: GoogleAdsModule;
}

export async function createGoogleAdsServer(): Promise<GoogleAdsServerContext> {
  const module = await createGoogleAdsModule();
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerGoogleAdsTools(server, module.provider);

  logger.info(
    {
      customerId: module.provider.getCustomerId(),
      mode: module.provider.isLiveMode() ? "live" : "mock",
      tools: 10,
    },
    "Google Ads MCP provider ready",
  );

  return { server, module };
}

export async function startGoogleAdsServer(): Promise<void> {
  const { server, module } = await createGoogleAdsServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info(
    {
      version: SERVER_VERSION,
      customerId: module.provider.getCustomerId(),
      mode: module.provider.isLiveMode() ? "live" : "mock",
    },
    "Google Ads MCP server started (stdio)",
  );
}
