import authRepository from "@/api/repositories/auth-repository";
import { InCustomer } from "@/types/interfaces";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import authStore from "@/stores/auth-store";
import { tokenStore } from "@/stores/token-store";
import { FieldErrorType } from "@/types/types";

class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<InCustomer | FieldErrorType[] | undefined> {
    try {
      const result = await authRepository.login(email, password);
      if (!result) return;

      const { customer, token } = result;
      console.log(customer);
      console.log("TOKEN:", token.access_token);
      // console.log("REFRESH TOKEN:", token.refresh_token);
      authStore.setUser(customer, token);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(`${SETTINGS.label.errors.login}\n${error.message}`);
        return error.invalidFields;
      }
    }
  }

  async refreshToken() {
    try {
      if (tokenStore.isTokenExpired()) {
        const token = await authRepository.refreshToken();
        if (!token) return;

        console.info("TOKEN:", token.access_token);
        // console.log("REFRESH TOKEN:", token.refresh_token);
        tokenStore.setToken(token);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(`${SETTINGS.label.errors.login}\n${error.message}`);
        return error.invalidFields;
      }
    }
  }

  async register(
    data: InCustomer,
  ): Promise<InCustomer | FieldErrorType[] | undefined> {
    try {
      const customer: InCustomer | undefined =
        await authRepository.register(data);
      console.log(customer);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${SETTINGS.label.errors.registration}\n${error.message}`,
        );
        return error.invalidFields;
      }
    }
  }

  logout() {
    try {
      authStore.setUser(undefined);
      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
}

const authService = new AuthService();
export default authService;
