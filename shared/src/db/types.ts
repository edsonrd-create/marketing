export interface TokenRecord {
  id: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledMessageRecord {
  id: string;
  channel: string;
  recipient: string;
  body: string;
  scheduledAt: string;
  status: "pending" | "sent" | "failed" | "cancelled";
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  saveToken(record: Omit<TokenRecord, "createdAt" | "updatedAt">): Promise<TokenRecord>;
  getToken(id: string): Promise<TokenRecord | null>;
  listTokens(provider?: string): Promise<TokenRecord[]>;
  deleteToken(id: string): Promise<boolean>;

  saveScheduledMessage(
    record: Omit<ScheduledMessageRecord, "createdAt" | "updatedAt">,
  ): Promise<ScheduledMessageRecord>;
  getScheduledMessage(id: string): Promise<ScheduledMessageRecord | null>;
  listScheduledMessages(status?: ScheduledMessageRecord["status"]): Promise<ScheduledMessageRecord[]>;
  updateScheduledMessageStatus(
    id: string,
    status: ScheduledMessageRecord["status"],
  ): Promise<ScheduledMessageRecord | null>;
  deleteScheduledMessage(id: string): Promise<boolean>;
}

export type DatabaseDriver = "memory" | "sqlite" | "postgres";

export interface CreateDatabaseOptions {
  driver: DatabaseDriver;
  sqlitePath?: string;
  databaseUrl?: string;
}
