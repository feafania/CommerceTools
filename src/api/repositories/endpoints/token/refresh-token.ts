import { TokenResponse } from "@/types/api-types";
import { handleApiError, handleFailedResponse } from "@/api/handle-api-error";
import {
  buildScopes,
  createBasicAuth,
  createTokenRequestBody,
} from "@/api/api-helpers";

export default async function refreshCustomerToken(
  token: string,
): Promise<TokenResponse> {
  const projectKey = process.env.CTP_PROJECT_KEY!;
  const authUrl = process.env.CTP_AUTH_URL!;

  const basicAuth = createBasicAuth();
  const scope = buildScopes(projectKey, [
    "manage_my_orders",
    "manage_my_profile",
    "view_published_products",
    "manage_my_shopping_lists",
  ]);

  const body = createTokenRequestBody("refresh_token", {
    ["refresh_token"]: token,
    scope,
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
      await handleFailedResponse(response, "Token refresh failed");
    }

    return (await response.json()) as TokenResponse;
  } catch (error) {
    console.error("Error refreshing token:", error);
    handleApiError(error);
  }
}
