export interface GoogleAdsLogger {
  error(message: string, meta?: Record<string, unknown>): void;
  info?(message: string, meta?: Record<string, unknown>): void;
  warn?(message: string, meta?: Record<string, unknown>): void;
  debug?(message: string, meta?: Record<string, unknown>): void;
}

export class GoogleAdsApiError extends Error {
  public readonly status?: number;
  public readonly customerId?: string;
  public readonly rawResponseBody?: string;
  public readonly parsedResponseBody?: unknown;
  public readonly url?: string;
  public readonly operation?: string;

  constructor(
    message: string,
    options?: {
      status?: number;
      customerId?: string;
      rawResponseBody?: string;
      parsedResponseBody?: unknown;
      url?: string;
      operation?: string;
    },
  ) {
    super(message);
    this.name = "GoogleAdsApiError";
    this.status = options?.status;
    this.customerId = options?.customerId;
    this.rawResponseBody = options?.rawResponseBody;
    this.parsedResponseBody = options?.parsedResponseBody;
    this.url = options?.url;
    this.operation = options?.operation;
  }
}

export interface GoogleAdsCallMeta {
  operation: string;
  customerId?: string;
  query?: string;
  params?: Record<string, unknown>;
  developerToken?: string;
}

export function maskToken(token?: string): string {
  if (!token) return "[EMPTY]";
  if (token.length <= 8) return "***";
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

/**
 * Standardized logging middleware wrapper for Google Ads API operations.
 * Intercepts requests, logs start and completion, and captures full error context
 * including raw API response body, HTTP status, customerId, and operation name.
 */
export async function withGoogleAdsLogging<T>(
  fn: () => Promise<T>,
  meta: GoogleAdsCallMeta,
  logger?: GoogleAdsLogger,
): Promise<T> {
  const startedAt = performance.now();
  const customerId = meta.customerId || "unknown";

  if (logger?.info) {
    logger.info(`[Google Ads Logging Middleware] Starting operation: ${meta.operation}`, {
      operation: meta.operation,
      customerId,
      query: meta.query,
      params: meta.params,
      developerTokenMasked: maskToken(meta.developerToken),
    });
  }

  try {
    const result = await fn();
    const durationMs = Math.round(performance.now() - startedAt);

    if (logger?.info) {
      logger.info(`[Google Ads Logging Middleware] Operation succeeded: ${meta.operation}`, {
        operation: meta.operation,
        customerId,
        durationMs,
      });
    }

    return result;
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startedAt);

    if (err instanceof GoogleAdsApiError) {
      const logPayload = {
        status: err.status,
        url: err.url,
        operation: err.operation || meta.operation,
        customerId: err.customerId || customerId,
        rawResponseBody: err.rawResponseBody,
        parsedResponseBody: err.parsedResponseBody,
        developerTokenMasked: maskToken(meta.developerToken),
        durationMs,
      };

      if (logger) {
        logger.error(`[Google Ads Logging Middleware] Captured API Error (${err.status ?? "N/A"}): ${err.message}`, logPayload);
      } else {
        console.error(`[Google Ads Logging Middleware] API Error (${err.status ?? "N/A"}):`, logPayload);
      }
    } else if (err instanceof Error) {
      const logPayload = {
        operation: meta.operation,
        customerId,
        developerTokenMasked: maskToken(meta.developerToken),
        errorStack: err.stack,
        durationMs,
      };

      if (logger) {
        logger.error(`[Google Ads Logging Middleware] Captured Unexpected Error: ${err.message}`, logPayload);
      } else {
        console.error(`[Google Ads Logging Middleware] Unexpected Error: ${err.message}`, logPayload);
      }
    }

    throw err;
  }
}

/**
 * Higher-order function that wraps a service method map with standardized Google Ads logging.
 */
export function withLoggingGoogleAdsService<T extends Record<string, (...args: unknown[]) => Promise<unknown>>>(
  service: T,
  logger?: GoogleAdsLogger,
  defaultCustomerId?: string,
): T {
  const wrappedService = {} as T;

  for (const [key, method] of Object.entries(service)) {
    if (typeof method === "function") {
      (wrappedService as Record<string, unknown>)[key] = function (...args: unknown[]) {
        const customerId = typeof args[0] === "string" ? args[0] : defaultCustomerId;
        return withGoogleAdsLogging(
          () => method.apply(service, args),
          { operation: key, customerId },
          logger,
        );
      };
    } else {
      (wrappedService as Record<string, unknown>)[key] = method;
    }
  }

  return wrappedService;
}
