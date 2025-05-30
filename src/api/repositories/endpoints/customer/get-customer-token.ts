import { TokenResponse } from "@/types/api-types";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCustomerToken(
  email: string,
  password: string,
): Promise<TokenResponse | undefined> {
  const projectKey = process.env.CTP_PROJECT_KEY!;
  const authUrl = process.env.CTP_AUTH_URL!;
  const clientID = process.env.CTP_CLIENT_ID!;
  const clientSecret = process.env.CTP_CLIENT_SECRET!;
  const isBrowser = typeof document !== "undefined";

  const credentials = `${clientID}:${clientSecret}`;
  const basicAuth = isBrowser
    ? btoa(credentials)
    : Buffer.from(credentials).toString("base64");
  const scopes = [
    `manage_my_orders:${projectKey}`,
    `manage_my_profile:${projectKey}`,
    `view_published_products:${projectKey}`,
    `manage_my_shopping_lists:${projectKey}`,
  ].join(" ");

  const body = new URLSearchParams({
    ["grant_type"]: "password",
    username: email,
    password,
    scope: scopes,
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
      const errorData = await response.json().catch(() => ({}));
      const errorText = await response.text();
      console.error("Token request failed:", errorText);
      handleApiError(
        new Error(
          `Token request failed: ${response.status} ${JSON.stringify(errorData)}`,
        ),
      );
    }

    return (await response.json()) as TokenResponse;
  } catch (error) {
    console.error("Error fetching customer token:", error);
    handleApiError(error);
  }
}
