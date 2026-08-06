import { describe, expect, it } from "vitest";
import { MemoryDatabase } from "./memory.js";

describe("MemoryDatabase", () => {
  it("stores and retrieves tokens", async () => {
    const db = new MemoryDatabase();
    await db.connect();

    const saved = await db.saveToken({
      id: "token-1",
      provider: "google",
      accessToken: "access",
    });

    expect(saved.id).toBe("token-1");
    expect(saved.createdAt).toBeTruthy();

    const fetched = await db.getToken("token-1");
    expect(fetched?.accessToken).toBe("access");

    const listed = await db.listTokens("google");
    expect(listed).toHaveLength(1);

    expect(await db.deleteToken("token-1")).toBe(true);
    expect(await db.getToken("token-1")).toBeNull();

    await db.disconnect();
  });

  it("stores and updates scheduled messages", async () => {
    const db = new MemoryDatabase();
    await db.connect();

    const saved = await db.saveScheduledMessage({
      id: "msg-1",
      channel: "whatsapp",
      recipient: "+15551234567",
      body: "Hello",
      scheduledAt: "2026-08-03T12:00:00.000Z",
      status: "pending",
    });

    expect(saved.status).toBe("pending");

    const updated = await db.updateScheduledMessageStatus("msg-1", "sent");
    expect(updated?.status).toBe("sent");

    const pending = await db.listScheduledMessages("sent");
    expect(pending).toHaveLength(1);

    await db.disconnect();
  });
});
