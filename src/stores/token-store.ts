import Cookies from "js-cookie";

import { TokenType } from "@/types/api-types";
import {
  COOKIE_LIFE,
  CUSTOMER_EXPIRE_IN,
  CUSTOMER_REFRESH_TOKEN_KEY,
  CUSTOMER_TOKEN_KEY,
} from "@/config/constants";

export class TokenStore {
  #token: TokenType | undefined;

  get accessToken(): string | undefined {
    return this.#token?.access_token;
  }

  get refreshToken(): string | undefined {
    return this.#token?.refresh_token;
  }

  setToken(token: TokenType) {
    this.#token = token;

    Cookies.set("access_token", token.access_token, {
      expires: COOKIE_LIFE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    Cookies.set("refresh_token", token.refresh_token, {
      expires: COOKIE_LIFE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    Cookies.set("token_expires_in", String(token.token_expires_in));
  }

  clearToken() {
    this.#token = undefined;

    Cookies.remove(CUSTOMER_TOKEN_KEY, { path: "/" });
    Cookies.remove(CUSTOMER_REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(CUSTOMER_EXPIRE_IN, { path: "/" });
  }

  isTokenExpired() {
    if (!this.#token?.refresh_token) return true;
    return Date.now() > Number.parseInt(this.#token?.refresh_token, 10);
  }

  loadFromCookies() {
    const accessToken = Cookies.get(CUSTOMER_TOKEN_KEY);
    const refreshToken = Cookies.get(CUSTOMER_REFRESH_TOKEN_KEY);
    const tokenExpiresIn = Cookies.get(CUSTOMER_EXPIRE_IN);

    if (accessToken && refreshToken && tokenExpiresIn) {
      this.#token = {
        [CUSTOMER_TOKEN_KEY]: accessToken,
        ["refresh_token"]: refreshToken,
        ["token_expires_in"]: String(Number.parseInt(tokenExpiresIn, 10)),
      };
    }
  }
}

export const tokenStore = new TokenStore();
