export enum ErrorCode {
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  AUTH = "AUTH",
  CONFIG = "CONFIG",
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export interface AppErrorOptions {
  code: ErrorCode;
  message: string;
  details?: unknown;
  cause?: unknown;
  statusCode?: number;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly statusCode: number;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.statusCode = options.statusCode ?? defaultStatusCode(options.code);
    if (options.details !== undefined) {
      this.details = options.details;
    }
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown, cause?: unknown) {
    super({
      code: ErrorCode.VALIDATION,
      message,
      details,
      cause,
      statusCode: 400,
    });
    this.name = "ValidationError";
  }
}

export class ExternalApiError extends AppError {
  readonly provider: string;

  constructor(provider: string, message: string, details?: unknown, cause?: unknown) {
    super({
      code: ErrorCode.EXTERNAL,
      message,
      details,
      cause,
      statusCode: 502,
    });
    this.name = "ExternalApiError";
    this.provider = provider;
  }
}

function defaultStatusCode(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.VALIDATION:
      return 400;
    case ErrorCode.AUTH:
      return 401;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.CONFIG:
      return 500;
    case ErrorCode.EXTERNAL:
      return 502;
    default:
      return 500;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isExternalApiError(error: unknown): error is ExternalApiError {
  return error instanceof ExternalApiError;
}

export function toErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown error";
}
