#!/usr/bin/env node
import { createLogger } from "@mcp-marketing/shared";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadWhatsAppEnv } from "./config/env.js";
import { createStubWhatsAppService, createWhatsAppService } from "./services/whatsapp.js";
import { registerWhatsAppTools } from "./tools/index.js";

const VERSION = "1.1.0";
const logger = createLogger("mcp-whatsapp");

export function createWhatsAppMcpServer(): McpServer {
  const env = loadWhatsAppEnv();
  const useStub = process.env.WHATSAPP_STUB === "true";
  const whatsapp = useStub ? createStubWhatsAppService() : createWhatsAppService({ env });

  if (useStub) {
    logger.warn("Using WhatsApp stub service (WHATSAPP_STUB=true) — no Graph API calls");
  }

  const server = new McpServer({
    name: "mcp-marketing-whatsapp",
    version: VERSION,
  });

  registerWhatsAppTools(server, { env, whatsapp });
  return server;
}

async function main(): Promise<void> {
  const server = createWhatsAppMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info({ version: VERSION }, "WhatsApp MCP server running on stdio");
}

const isDirectRun = process.argv[1]?.endsWith("server.js");
if (isDirectRun) {
  main().catch((error) => {
    logger.error(error, "Failed to start WhatsApp MCP server");
    process.exit(1);
  });
}
