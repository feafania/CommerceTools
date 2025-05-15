import authRepository from "@/api/repositories/auth-repository";
import { InCustomer } from "@/types/types";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import translations from "@/config/interfaces";
import { SETTINGS } from "@/config/settings";

class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<InCustomer | undefined> {
    try {
      const customer: InCustomer | undefined = await authRepository.login(
        email,
        password,
      );
      console.log(customer);
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
