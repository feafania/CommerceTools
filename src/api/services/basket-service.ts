import basketRepository from "@/api/repositories/basket-repository";
import { InCart } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import authService from "@/api/services/auth-service";
import basketStore from "@/stores/basket-store";

class BasketService {
  async getCart(): Promise<InCart | undefined> {
    try {
      const token = await authService.getToken();
      const cart = basketStore.getCart();

      return await basketRepository.getCart(cart?.id, token);
    } catch {
      return undefined;
    }
  }

  async createCart(parameters?: {
    currency?: string;
    country?: string;
  }): Promise<InCart | undefined> {
    try {
      const token = await authService.getToken();
      return await basketRepository.createCart({
        currency: parameters?.currency || SETTINGS.currentCurrency,
        country: parameters?.country,
        customerToken: token,
      });
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.createCart);
    }
  }

  async addItemToCart(
    variantId: number,
    quantity = SETTINGS.basketParameters.quantity,
  ): Promise<InCart | undefined> {
    try {
      const token = await authService.getToken();
      const cartId = basketStore.getCart()?.id;
      if (!cartId) throw new Error("Cart ID not found");
      const updatedCart = await basketRepository.addItemToCart(
        cartId,
        variantId,
        quantity,
        token,
      );
      basketStore.setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.addItemToCart);
    }
  }

  async removeItemFromCart(
    lineItemId: string,
    quantity = SETTINGS.basketParameters.quantity,
  ): Promise<InCart | undefined> {
    try {
      const token = await authService.getToken();
      const cartId = basketStore.getCart()?.id;
      if (!cartId) throw new Error("Cart ID not found");

      const updatedCart = await basketRepository.removeItemFromCart(
        cartId,
        lineItemId,
        quantity,
        token,
      );

      basketStore.setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.removeItemFromCart);
    }
  }

  async applyDiscountCode(discountCode: string): Promise<InCart | undefined> {
    try {
      const token = await authService.getToken();
      const cart = basketStore.getCart();
      if (!cart?.id || cart.version === undefined)
        throw new Error("Cart ID or version is missing");

      const updatedCart = await basketRepository.applyDiscountCode(
        cart.id,
        discountCode,
        cart.version,
        token,
      );

      basketStore.setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.applyDiscountCode);
    }
  }

  async deleteCart(): Promise<void> {
    try {
      const token = await authService.getToken();
      const cart = basketStore.getCart();
      if (!cart?.id || cart.version === undefined)
        throw new Error("Cart ID or version is missing");

      await basketRepository.deleteCart(cart.id, cart.version, token);
      basketStore.clearCart();
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.deleteCart);
    }
  }

  private handleError(error: unknown, fallbackMessage: string) {
    if (error instanceof ApiError) {
      showModalMessage(`${fallbackMessage}\n${error.message}`);
    } else {
      showModalMessage(fallbackMessage);
      console.error("Unexpected error in basket service:", error);
    }
  }
}

const basketService = new BasketService();
export default basketService;
