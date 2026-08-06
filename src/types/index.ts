export type HealthStatus = "ok" | "degraded" | "error";

export interface ServiceStatus {
  name: string;
  status: HealthStatus;
  details?: string;
}

export interface AppContextMeta {
  version: string;
  nodeEnv: string;
}
