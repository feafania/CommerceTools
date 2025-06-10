import basketRepository from "@/api/repositories/basket-repository";
import { InCart } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";

class BasketService {
  async getCart(cartId?: string, token?: string): Promise<InCart | undefined> {
    try {
      return await basketRepository.getCart(cartId, token);
    } catch {
      return undefined;
    }
  }

  async createCart(parameters?: {
    currency: string;
    country?: string;
    customerToken?: string;
  }): Promise<InCart | undefined> {
    try {
      return await basketRepository.createCart(parameters);
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.createCart);
    }
  }

  async addItemToCart(
    cartId: string,
    variantId: number,
    quantity = SETTINGS.basketParameters.quantity,
    token?: string,
  ): Promise<InCart | undefined> {
    try {
      return await basketRepository.addItemToCart(
        cartId,
        variantId,
        quantity,
        token,
      );
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.addItemToCart);
    }
  }

  async removeItemFromCart(
    cartId: string,
    lineItemId: string,
    quantity = 1,
    token?: string,
  ): Promise<InCart | undefined> {
    try {
      return await basketRepository.removeItemFromCart(
        cartId,
        lineItemId,
        quantity,
        token,
      );
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.removeItemFromCart);
    }
  }

  async applyDiscountCode(
    cartId: string,
    discountCode: string,
    version: number,
    token?: string,
  ): Promise<InCart | undefined> {
    try {
      return await basketRepository.applyDiscountCode(
        cartId,
        discountCode,
        version,
        token,
      );
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.applyDiscountCode);
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
