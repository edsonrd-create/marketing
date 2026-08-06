import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "./paths.js";

export function runValidate() {
  const script = join(REPO_ROOT, "scripts", "system-validation.mjs");
  if (!existsSync(script)) {
    console.error("scripts/system-validation.mjs not found");
    return 1;
  }

  const result = spawnSync(process.execPath, [script], {
    cwd: REPO_ROOT,
    stdio: "inherit",
    env: process.env,
  });

  return result.status ?? 1;
}
