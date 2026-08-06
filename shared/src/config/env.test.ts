import { afterEach, describe, expect, it } from "vitest";
import { z } from "zod";
import {
  applyEnvAliases,
  formatMissingEnvKeys,
  loadEnv,
  shouldSkipEnvFile,
} from "./env.js";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("env config", () => {
  it("applies environment aliases", () => {
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    process.env.WHATSAPP_TOKEN = "token-value";

    applyEnvAliases();

    expect(process.env.WHATSAPP_ACCESS_TOKEN).toBe("token-value");
  });

  it("loads env from process with schema", () => {
    process.env.TEST_SHARED_VALUE = "hello";

    const result = loadEnv({
      schema: z.object({
        TEST_SHARED_VALUE: z.string(),
      }),
      skipEnvFile: true,
    });

    expect(result.TEST_SHARED_VALUE).toBe("hello");
  });

  it("formats missing keys", () => {
    expect(formatMissingEnvKeys(["A", "B"])).toContain("A");
    expect(formatMissingEnvKeys([])).toContain("No missing");
  });

  it("skips env file in test mode", () => {
    process.env.VITEST = "true";
    expect(shouldSkipEnvFile()).toBe(true);
  });
});
