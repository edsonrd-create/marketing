import { LoggerFactory, createLogger, type LogLevel, type Logger } from "@mcp-marketing/shared";

export { LoggerFactory, createLogger, type LogLevel, type Logger };

/** App-level logger helpers (info / warn / error / debug). */
export function getAppLogger(service = "marketing-brain", level?: LogLevel): Logger {
  if (level === undefined) {
    return LoggerFactory.create({ service });
  }
  return LoggerFactory.create({ service, level });
}
