import { handleApiError } from "@/api/handle-api-error";
import { TokenKeys } from "@/types/api-types";

export default async function revokeCustomerToken(
  token: string,
  tokenTypeHint?: TokenKeys,
): Promise<boolean> {
  const authUrl = process.env.CTP_AUTH_URL!;
  const clientID = process.env.CTP_CLIENT_ID!;
  const clientSecret = process.env.CTP_CLIENT_SECRET!;
  const isBrowser = typeof document !== "undefined";

  const credentials = `${clientID}:${clientSecret}`;
  const basicAuth = isBrowser
    ? btoa(credentials)
    : Buffer.from(credentials).toString("base64");

  const body = new URLSearchParams({
    token,
  });

  if (tokenTypeHint) {
    body.set("token_type_hint", tokenTypeHint);
  }

  try {
    const response = await fetch(`${authUrl}/oauth/token/revoke`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error revoking token:", error);
    handleApiError(error);
    return false;
  }
}
