import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

import { TokenType } from "@/types/api-types";
import {
  ANONYMOUS_ID_KEY,
  ANONYMOUS_REFRESH_TOKEN_KEY,
  ANONYMOUS_TOKEN_KEY,
  COOKIE_LIFE,
} from "@/config/constants";

class AnonymousSessionStore {
  #anonymousId: string;
  #token: TokenType | undefined;

  constructor() {
    const existingId = Cookies.get(ANONYMOUS_ID_KEY);
    this.#anonymousId = existingId || uuidv4();

    this.loadTokenFromCookies();

    if (!existingId) {
      this.persistAnonymousId();
    }
  }

  get id(): string {
    return this.#anonymousId;
  }

  get accessToken(): string | undefined {
    return this.#token?.access_token;
  }

  get refreshToken(): string | undefined {
    return this.#token?.refresh_token;
  }

  private persistAnonymousId() {
    Cookies.set(ANONYMOUS_ID_KEY, this.#anonymousId, {
      expires: COOKIE_LIFE,
      path: "/",
      sameSite: "Lax",
      secure: true,
    });
  }

  setToken(token: TokenType) {
    this.#token = token;
    Cookies.set(ANONYMOUS_TOKEN_KEY, token.access_token, {
      expires: COOKIE_LIFE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    if (token.refresh_token) {
      Cookies.set(ANONYMOUS_REFRESH_TOKEN_KEY, token.refresh_token, {
        expires: COOKIE_LIFE,
        path: "/",
        secure: true,
        sameSite: "Lax",
      });
    }
  }

  loadTokenFromCookies() {
    const accessToken = Cookies.get(ANONYMOUS_TOKEN_KEY);
    const refreshToken = Cookies.get(ANONYMOUS_REFRESH_TOKEN_KEY);

    if (accessToken && refreshToken) {
      this.#token = {
        ["access_token"]: accessToken,
        ["refresh_token"]: refreshToken,
        ["token_expires_in"]: COOKIE_LIFE.toString(),
      };
    }
  }

  clear() {
    this.#anonymousId = uuidv4();
    this.persistAnonymousId();

    this.#token = undefined;
    Cookies.remove(ANONYMOUS_TOKEN_KEY, { path: "/" });
    Cookies.remove(ANONYMOUS_REFRESH_TOKEN_KEY, { path: "/" });
  }

  isTokenExpired(): boolean {
    if (!this.accessToken) return true;
    return false;
  }
}

export const anonymousSessionStore = new AnonymousSessionStore();
