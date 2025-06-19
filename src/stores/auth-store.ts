import { deleteState, getLocalState, saveState } from "@/utils/helpers";
import { tokenStore } from "@/stores/token-store";
import { InCustomer } from "@/types/interfaces";
import { TokenType } from "@/types/api-types";
import Header from "@/components/layout/header/header";

export class AuthStore {
  private _user: InCustomer | undefined = undefined;

  constructor() {
    this._user = AuthStore.restoreUser();
  }

  get user() {
    return this._user;
  }

  static restoreUser(): InCustomer | undefined {
    const storedUser = getLocalState("user");
    return storedUser ? JSON.parse(storedUser) : undefined;
  }

  setUser(user: InCustomer | undefined, token?: TokenType) {
    this._user = user;
    Header.setUsername();
    if (user) {
      saveState({ key: "user", value: JSON.stringify(user) });
      if (token) tokenStore.setToken(token);
    } else {
      deleteState("user");
      tokenStore.clearToken();
    }
  }
}

const authStore = new AuthStore();

export default authStore;
