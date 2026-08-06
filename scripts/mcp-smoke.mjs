#!/usr/bin/env node
/**
 * MCP Smoke Test — starts each MCP server over stdio, lists tools, records init time, shuts down.
 */
import { EXPECTED_TOOLS, getExpectedToolsCount } from "./lib/shared.mjs";
import { listMcpServerTargets, withMcpClient } from "./lib/mcp-client.mjs";

let failed = false;

function report(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) {
    failed = true;
  }
}

console.log("MCP Smoke Test (stdio client)");
console.log("=============================");

const targets = listMcpServerTargets();
let totalTools = 0;
const timings = [];

for (const target of targets) {
  const expected = EXPECTED_TOOLS[target.name] ?? [];
  const outcome = await withMcpClient(target, async (client) => {
    const listed = await client.listTools();
    const names = (listed.tools ?? []).map((t) => t.name).sort();
    return { names, count: names.length };
  });

  timings.push({ server: target.name, ms: outcome.ms, ok: outcome.ok });

  if (!outcome.ok) {
    report(target.name, false, `init failed in ${outcome.ms}ms: ${outcome.error}`);
    continue;
  }

  const { names, count } = outcome.result;
  totalTools += count;
  const missing = expected.filter((tool) => !names.includes(tool));
  const unexpected = names.filter((tool) => !expected.includes(tool));
  const ok = missing.length === 0 && unexpected.length === 0 && count === expected.length;

  report(
    target.name,
    ok,
    `init ${outcome.ms}ms, tools ${count}/${expected.length}` +
      (missing.length ? `, missing=${missing.join(",")}` : "") +
      (unexpected.length ? `, unexpected=${unexpected.join(",")}` : ""),
  );
}

const expectedTotal = getExpectedToolsCount();
report("total tools", totalTools === expectedTotal, `${totalTools}/${expectedTotal}`);

console.log("\nInit timings");
for (const row of timings) {
  console.log(`- ${row.server}: ${row.ms}ms (${row.ok ? "ok" : "fail"})`);
}

if (failed) {
  process.exit(1);
}

console.log("\nSmoke test passed — all MCP servers started, 52 tools registered, processes closed.");
