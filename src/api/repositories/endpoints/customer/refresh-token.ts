import { TokenResponse } from "@/types/interfaces";
import { handleApiError } from "@/api/handle-api-error";

export default async function refreshToken(
  token: string,
): Promise<TokenResponse> {
  const projectKey = process.env.CTP_PROJECT_KEY!;
  const authUrl = process.env.CTP_AUTH_URL!;
  const clientID = process.env.CTP_CLIENT_ID!;
  const clientSecret = process.env.CTP_CLIENT_SECRET!;

  const credentials = `${clientID}:${clientSecret}`;
  const isBrowser = typeof document !== "undefined";

  const basicAuth = isBrowser
    ? btoa(credentials)
    : Buffer.from(credentials).toString("base64");

  const body = new URLSearchParams({
    ["grant_type"]: "refresh_token",
    ["refresh_token"]: token,
  });

  try {
    const response = await fetch(
      `${authUrl}/oauth/${projectKey}/customers/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      },
    );

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return (await response.json()) as TokenResponse;
  } catch (error) {
    console.error("Error refreshing token:", error);
    handleApiError(error);
  }
}
