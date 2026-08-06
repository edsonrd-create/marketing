import path from "node:path";
import { readVersion, ROOT, formatPlatform } from "./lib/shared.mjs";

const version = readVersion();
const sample = path.join("mcp-google-ads", "src", "tools", "index.ts");
const normalized = sample.split(path.sep).join("/");

console.log("Compat Init Smoke");
console.log("=================");
console.log(`platform: ${formatPlatform()}`);
console.log(`root: ${ROOT}`);
console.log(`version: ${version}`);
console.log(`path.join sample: ${sample}`);
console.log(`normalized separators: ${normalized}`);
console.log(`path.sep: ${JSON.stringify(path.sep)}`);

const platforms = ["win32", "linux", "darwin"];
for (const p of platforms) {
  const marker = p === process.platform ? " (current)" : "";
  console.log(`- ${p}${marker}`);
}

console.log("\nCompat init OK");
