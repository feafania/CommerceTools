import { InCustomer } from "@/types/interfaces";
import authStore from "@/stores/auth-store";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { tokenStore } from "@/stores/token-store";
import authService from "@/api/services/auth-service";
import customerRepository from "@/api/repositories/customer-repository";
import { FieldErrorType } from "@/types/types";
import { anonymousSessionStore } from "@/stores/anonymous-session-store";

class CustomerService {
  async update(newCustomer: InCustomer): Promise<InCustomer | undefined> {
    try {
      if (tokenStore.isTokenExpired()) {
        await authService.refreshToken();
      }
      const token = tokenStore.accessToken;
      if (!token) {
        return;
      }
      if (!authStore.user) {
        return;
      }
      const updatedCustomer = await customerRepository.update(
        authStore.user,
        newCustomer,
        token,
      );
      if (updatedCustomer) {
        authStore.setUser(updatedCustomer);
      } else {
        showModalMessage(`${SETTINGS.label.messages.nothingToUpdate}`);
      }
      return updatedCustomer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${SETTINGS.label.errors.updateCustomer}\n${error.message}`,
        );
      }
    }
  }

  async changePassword(
    oldPassword: string | undefined,
    newPassword: string,
  ): Promise<InCustomer | FieldErrorType[] | undefined> {
    try {
      if (tokenStore.isTokenExpired()) {
        await authService.refreshToken();
      }

      const token = tokenStore.accessToken;
      const user = authStore.user;

      if (!token || !user || !oldPassword || user.version === undefined) {
        return undefined;
      }

      const updatedCustomer = await customerRepository.changePassword(
        user.version,
        oldPassword,
        newPassword,
        token,
      );
      if (updatedCustomer) {
        tokenStore.clearToken();
        anonymousSessionStore.clear();
        await authService.initAnonymousSession();
        return await authService.login(user.email, newPassword);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${SETTINGS.label.errors.updatePassword}\n${error.message}`,
        );
        return error.invalidFields;
      }
    }
  }
}

const customerService = new CustomerService();
export default customerService;
