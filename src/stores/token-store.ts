import { TokenType } from "@/types/interfaces";

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
  }

  clearToken() {
    this.#token = undefined;
  }

  isTokenExpired() {
    if (!this.#token?.refresh_token) return true;
    return Date.now() > Number.parseInt(this.#token?.refresh_token, 10);
  }
}

export const tokenStore = new TokenStore();
