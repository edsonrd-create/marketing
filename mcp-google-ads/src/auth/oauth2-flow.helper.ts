import { OAuth2Client } from "google-auth-library";

export interface GoogleAdsCredentialsConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  developerToken?: string;
  customerId?: string;
  redirectUri?: string;
}

export interface TokenExchangeResult {
  accessToken: string;
  refreshToken?: string;
  expiryDate?: number;
}

export interface CredentialsSummary {
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasRefreshToken: boolean;
  hasDeveloperToken: boolean;
  customerId: string | null;
  configured: boolean;
}

/**
 * OAuth2 Flow Helper for Google Ads in `mcp-google-ads`.
 * Securely handles initial authentication (auth URL, authorization code exchange)
 * and token refresh logic using process.env credentials or custom config.
 */
export class GoogleAdsOAuth2FlowHelper {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private developerToken: string;
  private customerId: string;
  private redirectUri: string;
  private oauth2Client: OAuth2Client;

  constructor(config?: GoogleAdsCredentialsConfig) {
    this.clientId = config?.clientId || process.env.GOOGLE_ADS_CLIENT_ID || "";
    this.clientSecret = config?.clientSecret || process.env.GOOGLE_ADS_CLIENT_SECRET || "";
    this.refreshToken = config?.refreshToken || process.env.GOOGLE_ADS_REFRESH_TOKEN || "";
    this.developerToken = config?.developerToken || process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "";
    this.customerId = config?.customerId || process.env.GOOGLE_ADS_CUSTOMER_ID || "";
    this.redirectUri = config?.redirectUri || process.env.GOOGLE_ADS_REDIRECT_URI || "http://localhost:3000/api/google-ads/oauth/callback";

    this.oauth2Client = new OAuth2Client(this.clientId, this.clientSecret, this.redirectUri);

    if (this.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: this.refreshToken,
      });
    }
  }

  /**
   * Verifies that all required credentials are provided in .env or config.
   */
  public verifyCredentials(): void {
    const missing: string[] = [];
    if (!this.clientId) missing.push("GOOGLE_ADS_CLIENT_ID");
    if (!this.clientSecret) missing.push("GOOGLE_ADS_CLIENT_SECRET");
    if (!this.developerToken) missing.push("GOOGLE_ADS_DEVELOPER_TOKEN");

    if (missing.length > 0) {
      throw new Error(`Google Ads OAuth2 credentials missing in .env: ${missing.join(", ")}`);
    }
  }

  /**
   * Returns a status summary of configured credentials.
   */
  public getCredentialsSummary(): CredentialsSummary {
    const hasClientId = Boolean(this.clientId);
    const hasClientSecret = Boolean(this.clientSecret);
    const hasRefreshToken = Boolean(this.refreshToken);
    const hasDeveloperToken = Boolean(this.developerToken);
    const customerId = this.customerId ? this.customerId.replace(/-/g, "") : null;

    return {
      hasClientId,
      hasClientSecret,
      hasRefreshToken,
      hasDeveloperToken,
      customerId,
      configured: hasClientId && hasClientSecret && hasRefreshToken && hasDeveloperToken && Boolean(customerId),
    };
  }

  /**
   * Returns the underlying Google OAuth2Client instance.
   */
  public getOAuth2Client(): OAuth2Client {
    return this.oauth2Client;
  }

  /**
   * Generates the Google OAuth2 consent URL for initial authentication.
   */
  public getAuthUrl(
    redirectUri?: string,
    scopes: string[] = ["https://www.googleapis.com/auth/adwords"],
  ): string {
    this.verifyCredentials();
    const uri = redirectUri || this.redirectUri;
    const client = new OAuth2Client(this.clientId, this.clientSecret, uri);

    return client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });
  }

  /**
   * Exchanges an authorization code received from consent callback for tokens.
   */
  public async exchangeCodeForTokens(
    code: string,
    redirectUri?: string,
  ): Promise<TokenExchangeResult> {
    this.verifyCredentials();
    const uri = redirectUri || this.redirectUri;
    const client = new OAuth2Client(this.clientId, this.clientSecret, uri);

    const { tokens } = await client.getToken(
      uri ? { code, redirect_uri: uri } : { code }
    );

    client.setCredentials(tokens);
    this.oauth2Client = client;

    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
    }

    const result: TokenExchangeResult = {
      accessToken: tokens.access_token || "",
    };
    if (tokens.refresh_token) {
      result.refreshToken = tokens.refresh_token;
    }
    if (tokens.expiry_date) {
      result.expiryDate = tokens.expiry_date;
    }

    return result;
  }

  /**
   * Refreshes the access token using the refresh token stored in .env or passed parameter.
   */
  public async refreshAccessToken(overrideRefreshToken?: string): Promise<{ accessToken: string; expiryDate?: number }> {
    this.verifyCredentials();
    const tokenToUse = overrideRefreshToken || this.refreshToken;

    if (!tokenToUse) {
      throw new Error("Cannot refresh access token: GOOGLE_ADS_REFRESH_TOKEN is not configured in .env or config");
    }

    this.oauth2Client.setCredentials({
      refresh_token: tokenToUse,
    });

    const { credentials } = await this.oauth2Client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error("Google Ads OAuth2 refresh did not return an access token");
    }

    const refreshResult: { accessToken: string; expiryDate?: number } = {
      accessToken: credentials.access_token,
    };
    if (credentials.expiry_date) {
      refreshResult.expiryDate = credentials.expiry_date;
    }

    return refreshResult;
  }
}

/**
 * Creates a default GoogleAdsOAuth2FlowHelper instance initialized with process.env values.
 */
export function createGoogleAdsOAuth2Helper(config?: GoogleAdsCredentialsConfig): GoogleAdsOAuth2FlowHelper {
  return new GoogleAdsOAuth2FlowHelper(config);
}
