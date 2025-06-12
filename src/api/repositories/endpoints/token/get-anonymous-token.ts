import { TokenResponse } from "@/types/api-types";
import {
  buildScopes,
  createBasicAuth,
  createTokenRequestBody,
} from "@/api/api-helpers";

export default async function getAnonToken(): Promise<
  TokenResponse | undefined
> {
  const projectKey = process.env.CTP_PROJECT_KEY!;
  const authUrl = process.env.CTP_AUTH_URL!;
  const basicAuth = createBasicAuth();

  const scope = buildScopes(projectKey, [
    "manage_orders",
    "manage_my_orders",
    "view_products",
    "create_anonymous_token",
    "view_discount_codes",
  ]);

  const body = createTokenRequestBody("client_credentials", {
    scope,
  });

  try {
    const response = await fetch(
      `${authUrl}/oauth/${projectKey}/anonymous/token`,
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
      return undefined;
    }
    return (await response.json()) as TokenResponse;
  } catch {
    // console.error("Error fetching anonymous token:", error);
    return undefined;
  }
}
