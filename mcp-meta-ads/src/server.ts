import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createLogger } from "@mcp-marketing/shared";
import { MetaAdsAuthService } from "./auth/meta-ads-auth.service.js";
import { loadMetaAdsEnv } from "./config/env.js";
import { MetaAdsService } from "./services/meta-ads.service.js";
import { registerMetaAdsTools } from "./tools/index.js";

const SERVER_NAME = "mcp-meta-ads";
const SERVER_VERSION = "1.1.0";

const logger = createLogger(SERVER_NAME);

export interface MetaAdsServerContext {
  server: McpServer;
  auth: MetaAdsAuthService;
  service: MetaAdsService;
}

export async function createMetaAdsServer(): Promise<MetaAdsServerContext> {
  const env = loadMetaAdsEnv();
  const auth = new MetaAdsAuthService(env);
  await auth.initialize();

  const service = new MetaAdsService({
    adAccountId: env.META_AD_ACCOUNT_ID,
  });

  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerMetaAdsTools(server, service);

  return { server, auth, service };
}

export async function startMetaAdsServer(): Promise<void> {
  const { server } = await createMetaAdsServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info({ version: SERVER_VERSION }, "Meta Ads MCP server started (stdio)");
}
