import { describe, expect, it } from "vitest";
import {
  cancelAction,
  confirmAction,
  createEmptyAgentStore,
  listPendingApprovals,
  processChat,
} from "../services/agent.js";

describe("AI agent", () => {
  it("responds to chat with rule-based replies", () => {
    const store = createEmptyAgentStore();
    const response = processChat(store, "test-session", "Hello!");
    expect(response.message.role).toBe("assistant");
    expect(response.message.content).toMatch(/Marketing Brain/i);
  });

  it("creates pending approval for campaign actions", () => {
    const store = createEmptyAgentStore();
    const response = processChat(store, "test-session", "Please launch a campaign");
    expect(response.pendingAction).toBeDefined();
    expect(response.pendingAction?.status).toBe("pending");
    expect(listPendingApprovals(store)).toHaveLength(1);
  });

  it("confirms and cancels pending actions", () => {
    const store = createEmptyAgentStore();
    const response = processChat(store, "s1", "Pause the campaign now");
    const actionId = response.pendingAction!.id;

    const confirmed = confirmAction(store, actionId);
    expect(confirmed.status).toBe("confirmed");
    expect(listPendingApprovals(store)).toHaveLength(0);

    const response2 = processChat(store, "s1", "Launch a new campaign");
    const actionId2 = response2.pendingAction!.id;
    const cancelled = cancelAction(store, actionId2);
    expect(cancelled.status).toBe("cancelled");
  });
});
