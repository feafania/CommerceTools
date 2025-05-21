export default async function getCustomerToken(
  email: string,
  password: string,
): Promise<{ access_token: string } | undefined> {
  const projectKey = process.env.CTP_PROJECT_KEY!;
  const authUrl = process.env.CTP_AUTH_URL!;
  const clientID = process.env.CTP_CLIENT_ID!;
  const clientSecret = process.env.CTP_CLIENT_SECRET!;

  const credentials = `${clientID}:${clientSecret}`;
  const basicAuth = Buffer.from(credentials).toString("base64");

  const body = [
    ["grant_type", "password"],
    ["username", email],
    ["password", password],
  ]
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  const response = await fetch(
    `${authUrl}/oauth/${projectKey}/customers/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  if (!response.ok) {
    console.error("Token request failed", await response.text());
    return;
  }

  return await response.json();
}
