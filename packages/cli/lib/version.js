import { readVersion } from "./doctor.js";

export function runVersion() {
  const version = readVersion();
  console.log(`Marketing Brain v${version} LTS`);
  return 0;
}
