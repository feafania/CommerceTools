import Cookies from "js-cookie";

import { TokenType } from "@/types/api-types";
import { COOCKIE_LIFE } from "@/config/constants";

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
      expires: COOCKIE_LIFE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    Cookies.set("refresh_token", token.refresh_token, {
      expires: COOCKIE_LIFE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    Cookies.set("token_expires_in", String(token.token_expires_in));
  }

  clearToken() {
    this.#token = undefined;

    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    Cookies.remove("token_expires_in", { path: "/" });
  }

  isTokenExpired() {
    if (!this.#token?.refresh_token) return true;
    return Date.now() > Number.parseInt(this.#token?.refresh_token, 10);
  }

  loadFromCookies() {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    const tokenExpiresIn = Cookies.get("token_expires_in");

    if (accessToken && refreshToken && tokenExpiresIn) {
      this.#token = {
        ["access_token"]: accessToken,
        ["refresh_token"]: refreshToken,
        ["token_expires_in"]: String(Number.parseInt(tokenExpiresIn, 10)),
      };
    }
  }
}

export const tokenStore = new TokenStore();
