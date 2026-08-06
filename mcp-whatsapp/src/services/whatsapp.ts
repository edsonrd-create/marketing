import type { WhatsAppEnv } from "../config/env.js";

export interface SendMessageInput {
  to: string;
  body: string;
  templateName?: string;
  templateParams?: string[];
}

export interface SendMessageResult {
  messageId: string;
  to: string;
  status: "sent" | "queued" | "scheduled";
  body: string;
  sentAt: string;
}

export interface WhatsAppService {
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
}

export interface WhatsAppLogger {
  error(message: string, meta?: Record<string, unknown>): void;
  info?(message: string, meta?: Record<string, unknown>): void;
}

export class WhatsAppApiError extends Error {
  public readonly status: number;
  public readonly rawResponseBody: string;
  public readonly parsedResponseBody?: unknown;
  public readonly url: string;

  constructor(
    message: string,
    options: {
      status: number;
      rawResponseBody: string;
      parsedResponseBody?: unknown;
      url: string;
    },
  ) {
    super(message);
    this.name = "WhatsAppApiError";
    this.status = options.status;
    this.rawResponseBody = options.rawResponseBody;
    this.parsedResponseBody = options.parsedResponseBody;
    this.url = options.url;
  }
}

export interface WhatsAppServiceOptions {
  env: WhatsAppEnv;
  fetchImpl?: typeof fetch;
  logger?: WhatsAppLogger;
}

function maskToken(token?: string): string {
  if (!token) return "[EMPTY]";
  if (token.length <= 8) return "***";
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

export function createWhatsAppService(options: WhatsAppServiceOptions): WhatsAppService {
  const { env, fetchImpl = fetch, logger } = options;

  const baseService: WhatsAppService = {
    async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
      const url = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

      const payload = input.templateName
        ? {
            messaging_product: "whatsapp",
            to: input.to,
            type: "template",
            template: {
              name: input.templateName,
              language: { code: "pt_BR" },
              components: input.templateParams?.length
                ? [
                    {
                      type: "body",
                      parameters: input.templateParams.map((text) => ({
                        type: "text",
                        text,
                      })),
                    },
                  ]
                : [],
            },
          }
        : {
            messaging_product: "whatsapp",
            to: input.to,
            type: "text",
            text: { body: input.body },
          };

      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const rawResponseBody = await response.text();
        let parsedResponseBody: unknown;
        try {
          parsedResponseBody = JSON.parse(rawResponseBody);
        } catch {
          parsedResponseBody = undefined;
        }

        const logMeta = {
          status: response.status,
          url,
          recipient: input.to,
          tokenMasked: maskToken(env.WHATSAPP_TOKEN),
          rawResponseBody,
          parsedResponseBody,
          requestPayload: payload,
        };

        if (logger) {
          logger.error(
            `WhatsApp API Error (${response.status}): Failed to send message to ${input.to}`,
            logMeta,
          );
        } else {
          console.error(`[WhatsAppService] API Error (${response.status}):`, logMeta);
        }

        throw new WhatsAppApiError(
          `WhatsApp API Error (${response.status}): ${rawResponseBody}`,
          {
            status: response.status,
            rawResponseBody,
            parsedResponseBody,
            url,
          },
        );
      }

      const data = (await response.json()) as { messages?: Array<{ id: string }> };
      const messageId = data.messages?.[0]?.id ?? `wa_${Date.now()}`;

      return {
        messageId,
        to: input.to,
        status: "sent",
        body: input.body,
        sentAt: new Date().toISOString(),
      };
    },
  };

  return logger ? withLoggingWhatsAppService(baseService, logger) : baseService;
}

/**
 * Logging middleware wrapper for any WhatsAppService instance.
 * Intercepts requests and logs full error context including raw API response body upon failures.
 */
export function withLoggingWhatsAppService(
  service: WhatsAppService,
  logger?: WhatsAppLogger,
): WhatsAppService {
  return {
    async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
      try {
        if (logger?.info) {
          logger.info(`Sending WhatsApp message to ${input.to}`, { recipient: input.to });
        }
        return await service.sendMessage(input);
      } catch (err: unknown) {
        if (err instanceof WhatsAppApiError) {
          const logPayload = {
            status: err.status,
            url: err.url,
            rawResponseBody: err.rawResponseBody,
            parsedResponseBody: err.parsedResponseBody,
            recipient: input.to,
          };
          if (logger) {
            logger.error(`[WhatsApp Logging Middleware] Captured API Error: ${err.message}`, logPayload);
          }
        } else if (err instanceof Error) {
          if (logger) {
            logger.error(`[WhatsApp Logging Middleware] Unexpected Error: ${err.message}`, {
              recipient: input.to,
              errorStack: err.stack,
            });
          }
        }
        throw err;
      }
    },
  };
}

/** Stub service for tests — no network calls. */
export function createStubWhatsAppService(): WhatsAppService {
  return {
    async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
      return {
        messageId: `stub_${Date.now()}`,
        to: input.to,
        status: "sent",
        body: input.body,
        sentAt: new Date().toISOString(),
      };
    },
  };
}
