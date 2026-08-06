import pino, { type Logger, type LoggerOptions } from "pino";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

export interface LoggerFactoryOptions {
  service?: string;
  level?: LogLevel;
  pretty?: boolean;
}

const isProduction = process.env.NODE_ENV === "production";

function buildPinoOptions(level: LogLevel, pretty: boolean): LoggerOptions {
  const base: LoggerOptions = {
    level,
  };

  if (!pretty) {
    return {
      ...base,
      formatters: {
        level(label) {
          return { severity: label.toUpperCase() };
        },
      },
    };
  }

  return {
    ...base,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  };
}

/** Centralized Pino factory — levels: info, warn, error, debug (+ fatal/trace/silent). */
export class LoggerFactory {
  static create(options: LoggerFactoryOptions = {}): Logger {
    const service = options.service ?? "marketing-brain";
    const level = options.level ?? ((process.env.LOG_LEVEL as LogLevel | undefined) || "info");
    const pretty = options.pretty ?? !isProduction;
    return pino(buildPinoOptions(level, pretty)).child({ service });
  }

  static info(service: string, message: string, data?: Record<string, unknown>): void {
    LoggerFactory.create({ service, level: "info" }).info(data ?? {}, message);
  }

  static warn(service: string, message: string, data?: Record<string, unknown>): void {
    LoggerFactory.create({ service, level: "warn" }).warn(data ?? {}, message);
  }

  static error(service: string, message: string, data?: Record<string, unknown>): void {
    LoggerFactory.create({ service, level: "error" }).error(data ?? {}, message);
  }

  static debug(service: string, message: string, data?: Record<string, unknown>): void {
    LoggerFactory.create({ service, level: "debug" }).debug(data ?? {}, message);
  }
}

export function createLogger(service: string, level: LogLevel = "info"): Logger {
  return LoggerFactory.create({ service, level });
}

export type { Logger };
