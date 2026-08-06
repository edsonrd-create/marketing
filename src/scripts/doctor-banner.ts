/**
 * In-process helpers used by `npm run doctor` / future CLI hooks.
 */
export function formatDoctorBanner(version: string): string {
  return `Marketing Brain v${version} — base structure ready`;
}
