import authRepository from "@/api/repositories/auth-repository";
import { InCustomer } from "@/types/types";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import translations from "@/config/interfaces";
import { SETTINGS } from "@/config/settings";
import authStore from "@/stores/auth-store";

class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<InCustomer | undefined> {
    try {
      const result = await authRepository.login(email, password);
      if (!result) return;

      const { customer, token } = result;
      console.log(customer);
      console.log("TOKEN:", token);
      authStore.setUser(customer, token);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${translations[SETTINGS.currentLang].errors.login}\n${error.message}`,
        );
      }
    }
  }

  async register(data: InCustomer): Promise<InCustomer | undefined> {
    try {
      const customer: InCustomer | undefined =
        await authRepository.register(data);
      console.log(customer);
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${translations[SETTINGS.currentLang].errors.registration}\n${error.message}`,
        );
      }
    }
  }
}

const authService = new AuthService();
export default authService;
