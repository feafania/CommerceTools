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
      authStore.setUser(customer, token);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${SETTINGS.label.errors.updateCustomer}\n${error.message}`,
        );
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

  async logout(): Promise<boolean> {
    try {
      const revokeToken = await this.revokeToken();
      if (revokeToken) {
        authStore.setUser(undefined);
        return true;
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
    showModalMessage(`${SETTINGS.label.errors.logout}`);
    return false;
  }

  async refreshToken() {
    try {
      if (
        tokenStore &&
        tokenStore.isTokenExpired() &&
        tokenStore.refreshToken
      ) {
        const token = await authRepository.refreshToken(
          tokenStore.refreshToken,
        );
        if (!token) return;

        tokenStore.setToken(token);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(`${SETTINGS.label.errors.token}\n${error.message}`);
        return error.invalidFields;
      }
    }
  }

  async revokeToken(): Promise<boolean> {
    try {
      let accessRevoked = false;
      if (tokenStore && tokenStore.accessToken) {
        accessRevoked = await authRepository.revokeToken(
          tokenStore.accessToken,
          "access_token",
        );
        if (!accessRevoked) return false;
      }
      if (tokenStore && tokenStore.refreshToken) {
        await authRepository.revokeToken(
          tokenStore.refreshToken,
          "refresh_token",
        );
      }
      return accessRevoked;
    } catch (error) {
      console.error("Token revocation failed:", error);
      return false;
    }
    return false;
  }
}

const authService = new AuthService();
export default authService;
