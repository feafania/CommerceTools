import { UserType } from "../types/interfaces";
import { deleteState, getState, saveState } from "../utils/helpers";

export class AuthStore {
  private _user: UserType | undefined = undefined;

  constructor() {
    this._user = AuthStore.restoreUser();
    // renderHeaderUsername();
  }

  get user() {
    return this._user;
  }

  static restoreUser(): UserType | undefined {
    const storedUser = getState("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  }

  setUser(user: UserType | undefined) {
    this._user = user;
    // renderHeaderUsername();
    if (user) {
      saveState({ key: "user", value: JSON.stringify(user) });
    } else {
      deleteState("user");
    }
  }
}

const authStore = new AuthStore();

export default authStore;
