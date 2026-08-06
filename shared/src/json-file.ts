import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { AppError, ErrorCode } from "./errors.js";

export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new AppError({
      code: ErrorCode.INTERNAL,
      message: `Failed to read JSON file: ${filePath}`,
      cause: error,
    });
  }
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    const content = `${JSON.stringify(data, null, 2)}\n`;
    await writeFile(filePath, content, "utf8");
  } catch (error) {
    throw new AppError({
      code: ErrorCode.INTERNAL,
      message: `Failed to write JSON file: ${filePath}`,
      cause: error,
    });
  }
}
