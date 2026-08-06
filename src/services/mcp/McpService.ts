import { existsSync } from "node:fs";
import path from "node:path";
import type { ConfigService } from "../../config/ConfigService.js";
import type { Logger } from "../../logger/index.js";
import type { ServiceStatus } from "../../types/index.js";

export interface McpCatalogEntry {
  id: string;
  packageName: string;
  entry: string;
  available: boolean;
}

const MCP_ENTRIES: Array<{ id: string; dir: string; packageName: string; file: string }> = [
  {
    id: "google-ads",
    dir: "mcp-google-ads",
    packageName: "@mcp-marketing/google-ads",
    file: "dist/index.js",
  },
  {
    id: "meta-ads",
    dir: "mcp-meta-ads",
    packageName: "@mcp-marketing/meta-ads",
    file: "dist/index.js",
  },
  {
    id: "whatsapp",
    dir: "mcp-whatsapp",
    packageName: "@mcp-marketing/whatsapp",
    file: "dist/server.js",
  },
  {
    id: "insights",
    dir: "mcp-insights",
    packageName: "@mcp-marketing/insights",
    file: "dist/server.js",
  },
  {
    id: "ai-agent",
    dir: "mcp-ai-agent",
    packageName: "@mcp-marketing/ai-agent",
    file: "dist/server.js",
  },
  {
    id: "workflows",
    dir: "mcp-workflows",
    packageName: "@mcp-marketing/workflows",
    file: "dist/server.js",
  },
];

export interface McpServiceOptions {
  config: ConfigService;
  logger: Logger;
}

/**
 * MCP catalog service — discovers monorepo MCP server entrypoints (stdio).
 * Does not replace individual MCP packages.
 */
export class McpService {
  private readonly config: ConfigService;
  private readonly logger: Logger;

  constructor(options: McpServiceOptions) {
    this.config = options.config;
    this.logger = options.logger.child({ component: "mcp-service" });
  }

  listServers(): McpCatalogEntry[] {
    return MCP_ENTRIES.map((entry) => {
      const absolute = path.join(this.config.rootDir, entry.dir, entry.file);
      const available = existsSync(absolute);
      return {
        id: entry.id,
        packageName: entry.packageName,
        entry: absolute,
        available,
      };
    });
  }

  status(): ServiceStatus {
    const servers = this.listServers();
    const ready = servers.filter((s) => s.available).length;
    const total = servers.length;
    this.logger.debug({ ready, total }, "MCP catalog scanned");
    if (ready === total) {
      return { name: "mcp", status: "ok", details: `${ready}/${total} servers built` };
    }
    if (ready === 0) {
      return { name: "mcp", status: "error", details: "No MCP dist entrypoints found — run npm run build" };
    }
    return {
      name: "mcp",
      status: "degraded",
      details: `${ready}/${total} servers built`,
    };
  }
}

export function createMcpService(options: McpServiceOptions): McpService {
  return new McpService(options);
}
