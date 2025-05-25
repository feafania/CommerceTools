import { TokenResponse } from "@/types/interfaces";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCustomerToken(
  email: string,
  password: string,
): Promise<TokenResponse | undefined> {
  const projectKey = process.env.CTP_PROJECT_KEY!;
  const authUrl = process.env.CTP_AUTH_URL!;
  const clientID = process.env.CTP_CLIENT_ID!;
  const clientSecret = process.env.CTP_CLIENT_SECRET!;

  const credentials = `${clientID}:${clientSecret}`;
  const isBrowser = typeof document !== "undefined";

  const basicAuth = isBrowser
    ? btoa(credentials)
    : Buffer.from(credentials).toString("base64");
  const scope = [
    `manage_my_orders:${projectKey}`,
    `manage_my_profile:${projectKey}`,
    `view_published_products:${projectKey}`,
  ].join(" ");

  const body = new URLSearchParams({
    ["grant_type"]: "password",
    username: email,
    password,
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
      const errorText = await response.text();
      console.error("Token request failed:", errorText);
      handleApiError(new Error(`Token request failed: ${response.status}`));
    }

    return (await response.json()) as TokenResponse;
  } catch (error) {
    console.error("Error fetching customer token:", error);
    handleApiError(error);
  }
}
