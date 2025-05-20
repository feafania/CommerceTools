import { deleteLocalState, getLocalState, saveState } from "@/utils/helpers";
import { tokenStore } from "@/stores/token-store";
import { InCustomer } from "@/types/types";

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
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  }

  setUser(user: InCustomer | undefined, token?: string) {
    this._user = user;
    if (user) {
      saveState({ key: "user", value: JSON.stringify(user) });
      if (token) tokenStore.setToken(token);
    } else {
      deleteLocalState("user");
      tokenStore.clearToken();
    }
  }
}

const authStore = new AuthStore();

export default authStore;
