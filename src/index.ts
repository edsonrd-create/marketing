import { startServer } from "./core/index.js";

startServer().catch((error: unknown) => {
  console.error("Failed to start Marketing Brain:", error);
  process.exit(1);
});
