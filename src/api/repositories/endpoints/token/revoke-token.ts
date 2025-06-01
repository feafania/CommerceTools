import { handleApiError } from "@/api/handle-api-error";
import { TokenKeys } from "@/types/api-types";
import {
  createBasicAuth,
  createRevokeTokenRequestBody,
} from "@/api/api-helpers";

export default async function revokeCustomerToken(
  token: string,
  tokenTypeHint?: TokenKeys,
): Promise<boolean> {
  const authUrl = process.env.CTP_AUTH_URL!;
  const basicAuth = createBasicAuth();

  const body = createRevokeTokenRequestBody(token, tokenTypeHint);

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
