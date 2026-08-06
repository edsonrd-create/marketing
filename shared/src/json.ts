export function toPrettyJson(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent);
}
