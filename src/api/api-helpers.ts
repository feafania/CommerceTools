import { TokenKeys } from "@/types/api-types";

export function createBasicAuth(): string {
  const clientID = process.env.CTP_CLIENT_ID!;
  const clientSecret = process.env.CTP_CLIENT_SECRET!;
  const credentials = `${clientID}:${clientSecret}`;
  const isBrowser = typeof document !== "undefined";

  return isBrowser
    ? btoa(credentials)
    : Buffer.from(credentials).toString("base64");
}

export function createTokenRequestBody(
  type: "password" | "refresh_token" | "client_credentials",
  payload: {
    username?: string;
    password?: string;
    refresh_token?: string;
    scope: string;
  },
): URLSearchParams {
  const body = new URLSearchParams({ ["grant_type"]: type });

  if (type === "password") {
    body.append("username", payload.username!);
    body.append("password", payload.password!);
  }

  if (type === "refresh_token") {
    body.append("refresh_token", payload.refresh_token!);
  }

  body.append("scope", payload.scope);

  return body;
}

export function createRevokeTokenRequestBody(
  token: string,
  tokenTypeHint?: TokenKeys,
): URLSearchParams {
  const body = new URLSearchParams({ token });

  if (tokenTypeHint) {
    body.append("token_type_hint", tokenTypeHint);
  }

  return body;
}

export function buildScopes(projectKey: string, scopes: string[]): string {
  return scopes.map((scope) => `${scope}:${projectKey}`).join(" ");
}
