import type {
  Database,
  ScheduledMessageRecord,
  TokenRecord,
} from "./types.js";

function nowIso(): string {
  return new Date().toISOString();
}

export class MemoryDatabase implements Database {
  private readonly tokens = new Map<string, TokenRecord>();
  private readonly scheduledMessages = new Map<string, ScheduledMessageRecord>();
  private connected = false;

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  private assertConnected(): void {
    if (!this.connected) {
      throw new Error("Database is not connected");
    }
  }

  async saveToken(
    record: Omit<TokenRecord, "createdAt" | "updatedAt">,
  ): Promise<TokenRecord> {
    this.assertConnected();
    const timestamp = nowIso();
    const existing = this.tokens.get(record.id);
    const saved: TokenRecord = {
      ...record,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    this.tokens.set(record.id, saved);
    return saved;
  }

  async getToken(id: string): Promise<TokenRecord | null> {
    this.assertConnected();
    return this.tokens.get(id) ?? null;
  }

  async listTokens(provider?: string): Promise<TokenRecord[]> {
    this.assertConnected();
    const all = [...this.tokens.values()];
    if (!provider) {
      return all;
    }
    return all.filter((token) => token.provider === provider);
  }

  async deleteToken(id: string): Promise<boolean> {
    this.assertConnected();
    return this.tokens.delete(id);
  }

  async saveScheduledMessage(
    record: Omit<ScheduledMessageRecord, "createdAt" | "updatedAt">,
  ): Promise<ScheduledMessageRecord> {
    this.assertConnected();
    const timestamp = nowIso();
    const existing = this.scheduledMessages.get(record.id);
    const saved: ScheduledMessageRecord = {
      ...record,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    this.scheduledMessages.set(record.id, saved);
    return saved;
  }

  async getScheduledMessage(id: string): Promise<ScheduledMessageRecord | null> {
    this.assertConnected();
    return this.scheduledMessages.get(id) ?? null;
  }

  async listScheduledMessages(
    status?: ScheduledMessageRecord["status"],
  ): Promise<ScheduledMessageRecord[]> {
    this.assertConnected();
    const all = [...this.scheduledMessages.values()];
    if (!status) {
      return all;
    }
    return all.filter((message) => message.status === status);
  }

  async updateScheduledMessageStatus(
    id: string,
    status: ScheduledMessageRecord["status"],
  ): Promise<ScheduledMessageRecord | null> {
    this.assertConnected();
    const existing = this.scheduledMessages.get(id);
    if (!existing) {
      return null;
    }
    const updated: ScheduledMessageRecord = {
      ...existing,
      status,
      updatedAt: nowIso(),
    };
    this.scheduledMessages.set(id, updated);
    return updated;
  }

  async deleteScheduledMessage(id: string): Promise<boolean> {
    this.assertConnected();
    return this.scheduledMessages.delete(id);
  }
}
