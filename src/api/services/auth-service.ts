import authRepository from "@/api/repositories/auth-repository";
import { InCustomer } from "@/types/interfaces";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import authStore from "@/stores/auth-store";
import { tokenStore } from "@/stores/token-store";
import { FieldErrorType } from "@/types/types";
import basketStore from "@/stores/basket-store";
import basketService from "@/api/services/basket-service";

class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<InCustomer | FieldErrorType[] | undefined> {
    try {
      const cart = basketStore.getCart();
      const anonymousCartId = cart?.id;

      const result = await authRepository.login(
        email,
        password,
        anonymousCartId,
      );

      if (!result) return;

      const { customer, token, cart: mergedCart } = result;

      authStore.setUser(customer, token);

      if (mergedCart) {
        basketStore.setCart(mergedCart);
      } else {
        const userCart = await basketService.createCart();
        if (userCart) basketStore.setCart(userCart);
      }
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
        basketStore.clearCart();

        const anonymousCart = await basketService.createCart();
        if (anonymousCart) basketStore.setCart(anonymousCart);

        return true;
      }
    } catch {
      // console.error("Logout failed:", error);
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
    } catch {
      // console.error("Token revocation failed:", error);
      return false;
    }
  }

  async getMe(): Promise<InCustomer | undefined> {
    try {
      if (!tokenStore || !tokenStore.accessToken) return;

      const customer = await authRepository.getMe(tokenStore.accessToken);
      if (customer) {
        customer.password = authStore.user?.password;
        authStore.setUser(customer);
      }
      return customer;
    } catch (error) {
      if (error instanceof ApiError) {
        showModalMessage(
          `${SETTINGS.label.errors.getCurrentUser}\n${error.message}`,
        );
      } else {
        // console.error("Get current user failed:", error);
      }
      return undefined;
    }
  }

  async getToken(): Promise<string | undefined> {
    try {
      if (!tokenStore.accessToken) return undefined;

      if (tokenStore.isTokenExpired()) {
        await this.refreshToken();
      }

      return tokenStore.accessToken;
    } catch (error) {
      console.error("getting token failed:", error);
      if (error instanceof ApiError) {
        showModalMessage(`${SETTINGS.label.errors.token}\n${error.message}`);
      }
      return undefined;
    }
  }
}

const authService = new AuthService();
export default authService;
