import { randomUUID } from "node:crypto";
import type { AgentStore, AuditLogEntry, ChatMessage, PendingAction } from "./store.js";

export interface ChatResponse {
  message: ChatMessage;
  pendingAction?: PendingAction;
  suggestions?: string[];
}

const RULES: Array<{
  pattern: RegExp;
  response: (match: RegExpMatchArray, message: string) => string;
  actionType?: string;
  requiresApproval?: boolean;
}> = [
  {
    pattern: /send.*campaign|launch.*campaign|disparar.*campanha/i,
    response: () =>
      "I can help launch a campaign. This action requires approval before execution.",
    actionType: "launch_campaign",
    requiresApproval: true,
  },
  {
    pattern: /pause.*campaign|pausar.*campanha/i,
    response: () => "I can pause the campaign. Please confirm to proceed.",
    actionType: "pause_campaign",
    requiresApproval: true,
  },
  {
    pattern: /budget|orçamento|spend/i,
    response: () =>
      "Based on current metrics, I recommend reviewing campaigns with ROAS below 1.0 and reallocating 15-20% of budget to top performers.",
  },
  {
    pattern: /report|relatório|dashboard/i,
    response: () =>
      "Use the generate_report tool in the Insights MCP server for a full marketing report, or ask me for a quick summary of pending actions.",
  },
  {
    pattern: /hello|hi|olá|oi\b/i,
    response: () =>
      "Hello! I'm the Marketing Brain agent. I can help with campaigns, budgets, reports, and workflow actions. What would you like to do?",
  },
  {
    pattern: /help|ajuda/i,
    response: () =>
      "Available commands: ask about campaigns, budgets, reports, or request actions like launching/pausing campaigns (requires approval).",
  },
];

export function processChat(
  store: AgentStore,
  sessionId: string,
  userMessage: string,
): ChatResponse {
  const userEntry: ChatMessage = {
    id: randomUUID(),
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    sessionId,
  };
  store.history.push(userEntry);

  let replyContent =
    "I understand your request. For detailed analytics, use the Insights MCP tools. For messaging, use WhatsApp MCP tools.";
  let pendingAction: PendingAction | undefined;
  const suggestions = [
    "Show campaign health scores",
    "Generate marketing report",
    "Schedule a WhatsApp message",
  ];

  for (const rule of RULES) {
    const match = userMessage.match(rule.pattern);
    if (match) {
      replyContent = rule.response(match, userMessage);
      if (rule.requiresApproval && rule.actionType) {
        pendingAction = {
          id: randomUUID(),
          type: rule.actionType,
          description: replyContent,
          payload: { originalMessage: userMessage, match: match[0] },
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        store.pendingActions.push(pendingAction);
        appendAudit(store, "action_proposed", "agent", {
          actionId: pendingAction.id,
          type: pendingAction.type,
        });
      }
      break;
    }
  }

  const assistantEntry: ChatMessage = {
    id: randomUUID(),
    role: "assistant",
    content: replyContent,
    timestamp: new Date().toISOString(),
    sessionId,
  };
  store.history.push(assistantEntry);

  appendAudit(store, "chat", "user", { sessionId, messageLength: userMessage.length });

  return {
    message: assistantEntry,
    ...(pendingAction !== undefined ? { pendingAction } : {}),
    suggestions,
  };
}

export function listPendingApprovals(store: AgentStore): PendingAction[] {
  return store.pendingActions.filter((a) => a.status === "pending");
}

export function confirmAction(store: AgentStore, actionId: string): PendingAction {
  const action = store.pendingActions.find((a) => a.id === actionId);
  if (!action) {
    throw new Error(`Action not found: ${actionId}`);
  }
  if (action.status !== "pending") {
    throw new Error(`Action ${actionId} is already ${action.status}`);
  }
  action.status = "confirmed";
  action.resolvedAt = new Date().toISOString();
  appendAudit(store, "action_confirmed", "user", { actionId, type: action.type });
  return action;
}

export function cancelAction(store: AgentStore, actionId: string): PendingAction {
  const action = store.pendingActions.find((a) => a.id === actionId);
  if (!action) {
    throw new Error(`Action not found: ${actionId}`);
  }
  if (action.status !== "pending") {
    throw new Error(`Action ${actionId} is already ${action.status}`);
  }
  action.status = "cancelled";
  action.resolvedAt = new Date().toISOString();
  appendAudit(store, "action_cancelled", "user", { actionId, type: action.type });
  return action;
}

export function getAgentHistory(store: AgentStore, sessionId?: string, limit = 50): ChatMessage[] {
  let history = store.history;
  if (sessionId) {
    history = history.filter((m) => m.sessionId === sessionId);
  }
  return history.slice(-limit);
}

export function getAiSummary(store: AgentStore) {
  const pending = listPendingApprovals(store);
  const recent = store.history.slice(-10);
  const confirmed = store.pendingActions.filter((a) => a.status === "confirmed").length;
  const cancelled = store.pendingActions.filter((a) => a.status === "cancelled").length;

  return {
    totalMessages: store.history.length,
    pendingApprovals: pending.length,
    confirmedActions: confirmed,
    cancelledActions: cancelled,
    recentTopics: recent
      .filter((m) => m.role === "user")
      .map((m) => m.content.slice(0, 60)),
    generatedAt: new Date().toISOString(),
  };
}

export function listAuditLogs(store: AgentStore, limit = 50): AuditLogEntry[] {
  return store.auditLogs.slice(-limit);
}

function appendAudit(
  store: AgentStore,
  action: string,
  actor: string,
  details: Record<string, unknown>,
): void {
  store.auditLogs.push({
    id: randomUUID(),
    action,
    actor,
    details,
    timestamp: new Date().toISOString(),
  });
}

export function createEmptyAgentStore(): AgentStore {
  return {
    history: [],
    pendingActions: [],
    auditLogs: [],
  };
}
