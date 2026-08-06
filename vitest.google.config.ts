import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/providers/google-ads/**/*.test.ts", "src/providers/google-ads/**/__tests__/**/*.ts"],
  },
});
