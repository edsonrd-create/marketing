import { registerTool } from "@mcp-marketing/shared";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  cancelAction,
  confirmAction,
  getAgentHistory,
  getAiSummary,
  listAuditLogs,
  listPendingApprovals,
  processChat,
} from "../services/agent.js";
import type { AgentStore } from "../services/store.js";
import { loadAgentStore, saveAgentStore } from "../services/store.js";

export interface AiAgentToolsContext {
  storePath?: string;
  getStore?: () => Promise<AgentStore>;
  saveStore?: (store: AgentStore) => Promise<void>;
}

function resolveStoreAccess(ctx: AiAgentToolsContext) {
  const storePath = ctx.storePath;
  return {
    getStore: ctx.getStore ?? (() => loadAgentStore(storePath)),
    saveStore: ctx.saveStore ?? ((store: AgentStore) => saveAgentStore(store, storePath)),
  };
}

export function registerAiAgentTools(server: McpServer, ctx: AiAgentToolsContext = {}): void {
  const { getStore, saveStore } = resolveStoreAccess(ctx);

  registerTool(
    server,
    "chat",
    {
      description: "Chat with the local rule-based marketing agent (no LLM)",
      inputSchema: {
        message: z.string().describe("User message"),
        sessionId: z.string().optional().describe("Session identifier"),
      },
    },
    async ({ message, sessionId }) => {
      const store = await getStore();
      const response = processChat(store, sessionId ?? "default", message);
      await saveStore(store);
      return { tool: "chat", ...response };
    },
  );

  registerTool(
    server,
    "list_pending_approvals",
    {
      description: "List actions awaiting user approval",
      inputSchema: {},
    },
    async () => {
      const store = await getStore();
      const pending = listPendingApprovals(store);
      return { tool: "list_pending_approvals", pending };
    },
  );

  registerTool(
    server,
    "confirm_action",
    {
      description: "Confirm a pending agent action",
      inputSchema: {
        actionId: z.string().describe("Pending action ID"),
      },
    },
    async ({ actionId }) => {
      const store = await getStore();
      const action = confirmAction(store, actionId);
      await saveStore(store);
      return { tool: "confirm_action", action };
    },
  );

  registerTool(
    server,
    "cancel_action",
    {
      description: "Cancel a pending agent action",
      inputSchema: {
        actionId: z.string().describe("Pending action ID"),
      },
    },
    async ({ actionId }) => {
      const store = await getStore();
      const action = cancelAction(store, actionId);
      await saveStore(store);
      return { tool: "cancel_action", action };
    },
  );

  registerTool(
    server,
    "get_agent_history",
    {
      description: "Get chat history for a session",
      inputSchema: {
        sessionId: z.string().optional(),
        limit: z.number().int().positive().max(200).optional(),
      },
    },
    async ({ sessionId, limit }) => {
      const store = await getStore();
      const history = getAgentHistory(store, sessionId, limit);
      return { tool: "get_agent_history", history };
    },
  );

  registerTool(
    server,
    "get_ai_summary",
    {
      description: "Get a summary of agent activity and pending approvals",
      inputSchema: {},
    },
    async () => {
      const store = await getStore();
      const summary = getAiSummary(store);
      return { tool: "get_ai_summary", summary };
    },
  );

  registerTool(
    server,
    "list_audit_logs",
    {
      description: "List agent audit log entries",
      inputSchema: {
        limit: z.number().int().positive().max(200).optional(),
      },
    },
    async ({ limit }) => {
      const store = await getStore();
      const logs = listAuditLogs(store, limit);
      return { tool: "list_audit_logs", logs };
    },
  );
}
