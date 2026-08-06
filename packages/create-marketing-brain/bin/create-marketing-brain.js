#!/usr/bin/env node

import { scaffoldProject, printQuickstart } from "../lib/scaffold.js";

const targetDir = process.argv[2] ?? "marketing-brain-project";

try {
  const { dest } = scaffoldProject(targetDir);
  printQuickstart(dest);
} catch (error) {
  console.error("create-marketing-brain failed:", error.message);
  process.exit(1);
}
