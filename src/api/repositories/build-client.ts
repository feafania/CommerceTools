import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  MiddlewareRequest,
  MiddlewareResponse,
  PasswordAuthMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import fetch from "cross-fetch";

const projectKey = process.env.CTP_PROJECT_KEY!;
const scopes = process.env.CTP_SCOPES?.split(" ") || [];

const baseAuthOptions = {
  host: process.env.CTP_AUTH_URL!,
  projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID!,
    clientSecret: process.env.CTP_CLIENT_SECRET!,
  },
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL!,
  fetch,
};

function createClientBuilder() {
  return new ClientBuilder()
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware();
}

// 1. Client for Client Credentials Flow (system)
export function createAnonymousClient() {
  return createClientBuilder()
    .withClientCredentialsFlow({
      ...baseAuthOptions,
      scopes,
    })
    .build();
}

// 2. Client for Password Flow (user + password)
export function createPasswordClient(email: string, password: string) {
  const passwordOptions: PasswordAuthMiddlewareOptions = {
    host: process.env.CTP_AUTH_URL!,
    projectKey,
    credentials: {
      clientId: process.env.CTP_CLIENT_ID!,
      clientSecret: process.env.CTP_CLIENT_SECRET!,
      user: {
        username: email,
        password,
      },
    },
    scopes,
    fetch,
  };

  return createClientBuilder().withPasswordFlow(passwordOptions).build();
}

// 3. Client for Existing Token Flow (with existing token)
export function createExistingTokenClient(token: string) {
  return createClientBuilder()
    .withMiddleware(
      (next) =>
        async (request: MiddlewareRequest, response: MiddlewareResponse) => {
          request.headers = {
            ...request.headers,
            Authorization: `Bearer ${token}`,
          };
          return next(request, response);
        },
    )
    .build();
}

// 4. Client for Refresh Token Flow (refresh session)
export function createRefreshTokenClient(refreshToken: string) {
  return createClientBuilder()
    .withRefreshTokenFlow({
      ...baseAuthOptions,
      refreshToken,
    })
    .build();
}
