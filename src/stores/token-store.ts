export class TokenStore {
  #token: string | undefined;

  get token(): string | undefined {
    return this.#token;
  }

  setToken(token: string) {
    this.#token = token;
  }

  clearToken() {
    this.#token = undefined;
  }
}

export const tokenStore = new TokenStore();
