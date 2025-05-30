import { InCustomer } from "@/types/interfaces";
import authStore from "@/stores/auth-store";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { tokenStore } from "@/stores/token-store";
import authService from "@/api/services/auth-service";
import customerRepository from "@/api/repositories/customer-repository";

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
}

const customerService = new CustomerService();
export default customerService;
