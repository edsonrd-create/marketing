import { randomUUID } from "node:crypto";
import type { Database, ScheduledMessageRecord } from "@mcp-marketing/shared";

export interface ScheduleMessageInput {
  to: string;
  body: string;
  scheduledAt: string;
  templateName?: string;
  templateParams?: string[];
}

export function createSchedulerService(db: Database) {
  return {
    async schedule(input: ScheduleMessageInput): Promise<ScheduledMessageRecord> {
      await db.connect();
      const metadata: Record<string, unknown> = {};
      if (input.templateName !== undefined) {
        metadata.templateName = input.templateName;
      }
      if (input.templateParams !== undefined) {
        metadata.templateParams = input.templateParams;
      }
      return db.saveScheduledMessage({
        id: randomUUID(),
        channel: "whatsapp",
        recipient: input.to,
        body: input.body,
        scheduledAt: input.scheduledAt,
        status: "pending",
        ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
      });
    },

    async list(status?: ScheduledMessageRecord["status"]): Promise<ScheduledMessageRecord[]> {
      await db.connect();
      return db.listScheduledMessages(status);
    },

    async getDue(now = new Date()): Promise<ScheduledMessageRecord[]> {
      const pending = await this.list("pending");
      return pending.filter((item) => new Date(item.scheduledAt) <= now);
    },

    async markSent(id: string): Promise<ScheduledMessageRecord | null> {
      await db.connect();
      return db.updateScheduledMessageStatus(id, "sent");
    },
  };
}

export type SchedulerService = ReturnType<typeof createSchedulerService>;
