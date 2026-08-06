import { createDatabase } from "@mcp-marketing/shared";
import { describe, expect, it } from "vitest";
import { createSchedulerService } from "../services/scheduler.js";
import {
  WhatsAppApiError,
  createStubWhatsAppService,
  createWhatsAppService,
  withLoggingWhatsAppService,
} from "../services/whatsapp.js";

describe("WhatsApp services", () => {
  it("stub service sends messages without network", async () => {
    const service = createStubWhatsAppService();
    const result = await service.sendMessage({
      to: "+5511999999999",
      body: "Hello",
    });
    expect(result.status).toBe("sent");
    expect(result.to).toBe("+5511999999999");
  });

  it("captures full raw API response body when error occurs in WhatsAppService", async () => {
    const mockErrorBody = JSON.stringify({
      error: {
        message: "Invalid OAuth access token",
        type: "OAuthException",
        code: 190,
        fbtrace_id: "A1B2C3D4E5",
      },
    });

    const mockFetch = async () =>
      new Response(mockErrorBody, {
        status: 401,
        statusText: "Unauthorized",
      });

    const loggedErrors: Array<{ message: string; meta?: Record<string, unknown> }> = [];
    const logger = {
      error: (message: string, meta?: Record<string, unknown>) => {
        loggedErrors.push({ message, meta });
      },
    };

    const service = createWhatsAppService({
      env: {
        WHATSAPP_TOKEN: "invalid_token_12345",
        WHATSAPP_PHONE_NUMBER_ID: "100000000",
        WHATSAPP_API_VERSION: "v21.0",
      },
      fetchImpl: mockFetch as unknown as typeof fetch,
      logger,
    });

    await expect(
      service.sendMessage({ to: "5541997806839", body: "Test" }),
    ).rejects.toThrow(WhatsAppApiError);

    expect(loggedErrors.length).toBeGreaterThanOrEqual(1);
    expect(loggedErrors[0]?.meta?.rawResponseBody).toBe(mockErrorBody);
    expect(loggedErrors[0]?.meta?.status).toBe(401);
  });

  it("wraps any WhatsApp service with logging middleware via withLoggingWhatsAppService", async () => {
    const stub = createStubWhatsAppService();
    const infoLogs: string[] = [];
    const logger = {
      error: () => {},
      info: (msg: string) => {
        infoLogs.push(msg);
      },
    };
    const wrapped = withLoggingWhatsAppService(stub, logger);
    await wrapped.sendMessage({ to: "+5541997806839", body: "Wrapped test" });
    expect(infoLogs.length).toBe(1);
  });

  it("scheduler persists scheduled messages via createDatabase memory", async () => {
    const db = createDatabase({ driver: "memory" });
    const scheduler = createSchedulerService(db);
    const scheduled = await scheduler.schedule({
      to: "+5511999999999",
      body: "Future message",
      scheduledAt: "2026-12-01T10:00:00.000Z",
    });
    expect(scheduled.status).toBe("pending");
    expect(await scheduler.list()).toHaveLength(1);
    expect(await scheduler.getDue(new Date("2026-12-02T00:00:00.000Z"))).toHaveLength(1);
  });
});
