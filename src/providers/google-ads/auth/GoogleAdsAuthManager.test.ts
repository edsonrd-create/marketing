import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { GoogleAdsAuthManager } from "./GoogleAdsAuthManager.js";
import type { GoogleAdsEnv } from "../schemas/index.js";

function env(overrides: Partial<GoogleAdsEnv> = {}): GoogleAdsEnv {
  return {
    GOOGLE_ADS_CLIENT_ID: "client",
    GOOGLE_ADS_CLIENT_SECRET: "secret",
    GOOGLE_ADS_REFRESH_TOKEN: "refresh",
    GOOGLE_ADS_DEVELOPER_TOKEN: "dev",
    GOOGLE_ADS_CUSTOMER_ID: "123-456-7890",
    GOOGLE_ADS_SKIP_AUTH_VALIDATE: true,
    GOOGLE_ADS_LIVE_AUTH: false,
    GOOGLE_ADS_FORCE_MOCK: true,
    ...overrides,
  };
}

describe("GoogleAdsAuthManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-03T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns mock token without live OAuth", async () => {
    const auth = new GoogleAdsAuthManager(env());
    await auth.initialize();
    await expect(auth.getAccessToken()).resolves.toBe("mock-access-token");
    expect(auth.getCustomerId()).toBe("1234567890");
    expect(auth.isLiveMode()).toBe(false);
  });

  it("caches live access token and refreshes after expiry skew", async () => {
    const refreshMock = vi.fn()
      .mockResolvedValueOnce({
        credentials: {
          access_token: "token-1",
          expiry_date: Date.now() + 3_600_000,
        },
      })
      .mockResolvedValueOnce({
        credentials: {
          access_token: "token-2",
          expiry_date: Date.now() + 7_200_000,
        },
      });

    vi.doMock("google-auth-library", () => ({
      OAuth2Client: class {
        setCredentials() {}
        refreshAccessToken = refreshMock;
      },
    }));

    // Directly exercise cache via subclass-style override on instance
    const auth = new GoogleAdsAuthManager(
      env({
        GOOGLE_ADS_SKIP_AUTH_VALIDATE: false,
        GOOGLE_ADS_LIVE_AUTH: true,
        GOOGLE_ADS_FORCE_MOCK: false,
      }),
    );

    // Bypass real OAuth by injecting cache through refreshAccessToken spy
    const spy = vi.spyOn(auth, "refreshAccessToken").mockImplementation(async () => {
      const result = await refreshMock();
      const token = result.credentials.access_token as string;
      (auth as unknown as { cache: { accessToken: string; expiresAt: number } }).cache = {
        accessToken: token,
        expiresAt: result.credentials.expiry_date as number,
      };
      (auth as unknown as { initialized: boolean }).initialized = true;
      return token;
    });

    (auth as unknown as { initialized: boolean }).initialized = true;
    (auth as unknown as { oauthClient: object }).oauthClient = {};

    const first = await auth.getAccessToken();
    const second = await auth.getAccessToken();
    expect(first).toBe("token-1");
    expect(second).toBe("token-1");
    expect(spy).toHaveBeenCalledTimes(1);

    vi.setSystemTime(new Date("2026-08-03T13:00:30.000Z")); // past expiry - skew
    const third = await auth.getAccessToken();
    expect(third).toBe("token-2");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("throws CONFIG when credentials missing", async () => {
    const auth = new GoogleAdsAuthManager(
      env({
        GOOGLE_ADS_CLIENT_ID: "",
        GOOGLE_ADS_SKIP_AUTH_VALIDATE: false,
      }),
    );
    await expect(auth.initialize()).rejects.toThrow(/credentials incomplete/i);
  });
});
