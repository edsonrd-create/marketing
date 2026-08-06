import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { structuredResult, wrapToolError, type TextToolResult } from "./tool-result.js";

type ZodRawShape = Record<string, z.ZodTypeAny>;

type InferShape<T extends ZodRawShape> = {
  [K in keyof T]: z.infer<T[K]>;
};

export interface ToolConfig<T extends ZodRawShape> {
  description: string;
  inputSchema: T;
}

export type ToolHandlerResult = Record<string, unknown> | TextToolResult;

export function registerTool<T extends ZodRawShape>(
  server: McpServer,
  name: string,
  config: ToolConfig<T>,
  handler: (args: InferShape<T>) => Promise<ToolHandlerResult>,
): void {
  const wrapped = async (args: InferShape<T>): Promise<CallToolResult> => {
    try {
      const result = await handler(args);
      if (result && typeof result === "object" && "content" in result) {
        return result as CallToolResult;
      }
      return structuredResult(result as Record<string, unknown>) as CallToolResult;
    } catch (error) {
      return wrapToolError(error) as CallToolResult;
    }
  };

  server.registerTool(
    name,
    {
      description: config.description,
      inputSchema: config.inputSchema,
    },
    wrapped as Parameters<McpServer["registerTool"]>[2],
  );
}
