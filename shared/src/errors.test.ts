import { describe, expect, it } from "vitest";
import {
  AppError,
  ErrorCode,
  ExternalApiError,
  ValidationError,
  isAppError,
  isExternalApiError,
  isValidationError,
  toErrorMessage,
} from "./errors.js";

describe("errors", () => {
  it("creates AppError with code and message", () => {
    const error = new AppError({
      code: ErrorCode.VALIDATION,
      message: "Invalid input",
      details: { field: "name" },
    });

    expect(error.message).toBe("Invalid input");
    expect(error.code).toBe(ErrorCode.VALIDATION);
    expect(error.details).toEqual({ field: "name" });
    expect(error.statusCode).toBe(400);
    expect(isAppError(error)).toBe(true);
  });

  it("creates ValidationError and ExternalApiError", () => {
    const validation = new ValidationError("bad field", { field: "email" });
    expect(validation.name).toBe("ValidationError");
    expect(isValidationError(validation)).toBe(true);
    expect(validation.statusCode).toBe(400);

    const external = new ExternalApiError("openai", "rate limited", { status: 429 });
    expect(external.name).toBe("ExternalApiError");
    expect(external.provider).toBe("openai");
    expect(isExternalApiError(external)).toBe(true);
    expect(external.statusCode).toBe(502);
  });

  it("identifies non-AppError values", () => {
    expect(isAppError(new Error("x"))).toBe(false);
    expect(isAppError("x")).toBe(false);
  });

  it("converts errors to messages", () => {
    expect(toErrorMessage(new AppError({ code: ErrorCode.AUTH, message: "Denied" }))).toBe(
      "Denied",
    );
    expect(toErrorMessage(new Error("boom"))).toBe("boom");
    expect(toErrorMessage("plain")).toBe("plain");
    expect(toErrorMessage(42)).toBe("Unknown error");
  });
});
