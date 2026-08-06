import { AppError, ErrorCode, isAppError, toErrorMessage } from "../errors.js";
import { toPrettyJson } from "../json.js";

export interface TextToolResult {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export interface StructuredToolResult {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

export function textResult(text: string, isError = false): TextToolResult {
  const result: TextToolResult = {
    content: [{ type: "text", text }],
  };
  if (isError) {
    result.isError = true;
  }
  return result;
}

export function structuredResult(
  data: Record<string, unknown>,
  isError = false,
): StructuredToolResult {
  const result: StructuredToolResult = {
    content: [{ type: "text", text: toPrettyJson(data) }],
    structuredContent: data,
  };
  if (isError) {
    result.isError = true;
  }
  return result;
}

export type ToolHandler<TArgs, TResult> = (args: TArgs) => Promise<TResult>;

export function asyncHandler<TArgs, TResult>(
  handler: ToolHandler<TArgs, TResult>,
): ToolHandler<TArgs, TResult | TextToolResult> {
  return async (args: TArgs) => {
    try {
      return await handler(args);
    } catch (error) {
      if (isAppError(error)) {
        return textResult(error.message, true);
      }

      return textResult(toErrorMessage(error), true);
    }
  };
}

export const withToolErrorHandling = asyncHandler;

export function wrapToolError(error: unknown): TextToolResult {
  if (isAppError(error)) {
    return textResult(error.message, true);
  }

  return textResult(toErrorMessage(error), true);
}

export function assertToolSuccess<T>(value: T | TextToolResult): T {
  if (
    value &&
    typeof value === "object" &&
    "content" in value &&
    Array.isArray((value as TextToolResult).content) &&
    (value as TextToolResult).isError
  ) {
    throw new AppError({
      code: ErrorCode.INTERNAL,
      message: (value as TextToolResult).content[0]?.text ?? "Tool error",
    });
  }
  return value as T;
}
