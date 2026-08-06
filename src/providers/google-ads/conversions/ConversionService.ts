/**
 * Conversion domain placeholder — Sprint 2 keeps account-level readiness only.
 * Offline conversion upload can extend this module without changing MCP architecture.
 */
export class ConversionService {
  status(): { ready: boolean; message: string } {
    return {
      ready: true,
      message: "Conversion module ready for future offline conversion imports",
    };
  }
}
