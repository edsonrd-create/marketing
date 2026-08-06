import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { MCP_WORKSPACES, ROOT } from "./shared.mjs";

/** Placeholder env for stdio smoke/tool tests — never real credentials. */
export function buildSmokeEnv(extra = {}) {
  const base = {
    PATH: process.env.PATH ?? "",
    HOME: process.env.HOME ?? "",
    TMPDIR: process.env.TMPDIR ?? "/tmp",
    NODE_ENV: "test",
    SKIP_DOTENV_FILE: "true",
    DATABASE_MODE: "memory",
    GOOGLE_ADS_CLIENT_ID: "smoke-client-id",
    GOOGLE_ADS_CLIENT_SECRET: "smoke-client-secret",
    GOOGLE_ADS_REFRESH_TOKEN: "smoke-refresh-token",
    GOOGLE_ADS_DEVELOPER_TOKEN: "smoke-developer-token",
    GOOGLE_ADS_CUSTOMER_ID: "1234567890",
    GOOGLE_ADS_SKIP_AUTH_VALIDATE: "true",
    GOOGLE_ADS_FORCE_MOCK: "true",
    GOOGLE_ADS_LIVE_AUTH: "0",
    META_ACCESS_TOKEN: "smoke-meta-token",
    META_AD_ACCOUNT_ID: "act_smoke_123",
    META_SKIP_AUTH_VALIDATE: "true",
    WHATSAPP_TOKEN: "smoke-whatsapp-token",
    WHATSAPP_PHONE_NUMBER_ID: "smoke-phone-id",
    WHATSAPP_API_VERSION: "v21.0",
    WHATSAPP_STUB: "true",
    ...extra,
  };

  /** @type {Record<string, string>} */
  const env = {};
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined && value !== null) {
      env[key] = String(value);
    }
  }
  return env;
}

export function resolveServerEntry(workspaceDir) {
  const candidates =
    workspaceDir === "mcp-google-ads" || workspaceDir === "mcp-meta-ads"
      ? [join(ROOT, workspaceDir, "dist", "index.js")]
      : [join(ROOT, workspaceDir, "dist", "server.js"), join(ROOT, workspaceDir, "dist", "index.js")];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

export function listMcpServerTargets() {
  return MCP_WORKSPACES.map((ws) => {
    const entry = resolveServerEntry(ws.dir);
    return {
      ...ws,
      entry,
      args: entry ? [entry] : [],
    };
  });
}

/**
 * Connect to one MCP server over stdio, run work(), then close cleanly.
 * @param {{ dir: string, name: string, entry: string | null }} target
 * @param {(client: import("@modelcontextprotocol/sdk/client/index.js").Client) => Promise<T>} work
 * @returns {Promise<{ ok: boolean, ms: number, error?: string, result?: T, pid?: number | null }>}
 */
export async function withMcpClient(target, work, env = buildSmokeEnv()) {
  if (!target.entry) {
    return { ok: false, ms: 0, error: `dist entry missing for ${target.dir}` };
  }

  const started = performance.now();
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [target.entry],
    cwd: ROOT,
    env,
    stderr: "pipe",
  });

  const client = new Client({ name: "marketing-brain-mcp-smoke", version: "1.1.0" });

  try {
    await client.connect(transport);
    const result = await work(client);
    const ms = Math.round(performance.now() - started);
    return { ok: true, ms, result, pid: transport.pid };
  } catch (error) {
    const ms = Math.round(performance.now() - started);
    return {
      ok: false,
      ms,
      error: error instanceof Error ? error.message : String(error),
      pid: transport.pid,
    };
  } finally {
    try {
      await client.close();
    } catch {
      /* ignore */
    }
    try {
      await transport.close();
    } catch {
      /* ignore */
    }
  }
}

export function summarizeToolResult(result) {
  if (!result) {
    return "";
  }
  if (result.isError) {
    const text = extractText(result);
    return `error: ${text.slice(0, 200)}`;
  }
  const text = extractText(result);
  return text.slice(0, 200) || "ok";
}

function extractText(result) {
  const parts = result.content ?? [];
  return parts
    .map((part) => {
      if (part.type === "text") {
        return part.text;
      }
      return JSON.stringify(part);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
