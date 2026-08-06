#!/usr/bin/env node

import { runDoctor } from "../lib/doctor.js";
import { runLive } from "../lib/live.js";
import { runStart } from "../lib/start.js";
import { runStatus } from "../lib/status.js";
import { runUpdate } from "../lib/update.js";
import { runValidate } from "../lib/validate.js";
import { runVersion } from "../lib/version.js";

const COMMANDS = {
  doctor: { run: runDoctor, help: "Check Node, VERSION file, and workspace packages" },
  start: { run: runStart, help: "Show npm run start:* commands for each MCP server" },
  validate: { run: runValidate, help: "Run scripts/system-validation.mjs" },
  live: { run: runLive, help: "Remind about live:validate and .env requirements" },
  status: { run: runStatus, help: "Show version and package build status" },
  update: { run: runUpdate, help: "Print npm update guidance" },
  version: { run: runVersion, help: "Print Marketing Brain version" },
  help: { run: printHelp, help: "Show this help" },
};

function printHelp() {
  console.log("Marketing Brain CLI (v1.1.0 LTS)\n");
  console.log("Usage: marketing-brain <command>\n");
  console.log("Commands:");
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    if (name === "help") continue;
    console.log(`  ${name.padEnd(10)} ${cmd.help}`);
  }
  console.log("\n  help         Show this help");
  return 0;
}

const [, , command = "help", ...args] = process.argv;

if (args.length > 0) {
  console.warn(`Note: extra arguments ignored: ${args.join(" ")}`);
}

const entry = COMMANDS[command] ?? COMMANDS.help;
const exitCode = command === "help" && !COMMANDS[command] ? printHelp() : await entry.run();
process.exit(exitCode);
