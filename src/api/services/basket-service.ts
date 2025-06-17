import basketRepository from "@/api/repositories/basket-repository";
import { InCart } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import authService from "@/api/services/auth-service";
import basketStore from "@/stores/basket-store";
import productRepository from "@/api/repositories/product-repository";

class BasketService {
  async getCart(cartId?: string): Promise<InCart | undefined> {
    try {
      let cart: InCart | undefined = basketStore.getCart();
      if (
        (!cartId || cart?.id === cartId) &&
        cart &&
        cart.currency === SETTINGS.currentCurrency
      ) {
        return cart;
      }
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }

      if (cartId && token) {
        try {
          cart = await basketRepository.getCartById(cartId ?? cart!.id, token);
        } catch {}
      }
      if (!cart && token) {
        try {
          cart = await basketRepository.getCart(token);
        } catch {}
      }
      console.log("cart when getting", cart);

      if (!cart) {
        cart = await this.createCart();
      }

      if (cart && cart?.currency !== SETTINGS.currentCurrency) {
        const mergedCart = await this.mergeCartWithNewCurrency(cart, token);
        basketStore.setCart(mergedCart);
        return mergedCart;
      }

      basketStore.setCart(cart);
      return cart;
    } catch {
      return undefined;
    }
  }

  async getCartId(): Promise<string | undefined> {
    let cart: InCart | undefined;
    try {
      cart = await this.getCart();
    } catch {
      cart = await this.createCart();
    }
    if (!cart) throw new Error("Cart not found");
    const cartId = cart.id;
    if (!cartId) throw new Error("Cart ID not found");
    return cartId;
  }

  async createCart(parameters?: {
    currency?: string;
    country?: string;
  }): Promise<InCart | undefined> {
    try {
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      if (token) {
        return await basketRepository.createCart({
          currency: parameters?.currency || SETTINGS.currentCurrency,
          country: parameters?.country,
          customerToken: token,
        });
      }
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.createCart);
    }
  }

  async recalculateCart(
    updateProductData = false,
  ): Promise<InCart | undefined> {
    try {
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      const cart = basketStore.getCart();
      if (!cart?.id || cart.version === undefined)
        throw new Error("Cart ID or version is missing");

      let updatedCart: InCart | undefined;

      if (token) {
        updatedCart = await basketRepository.recalculateCart(
          cart.id,
          cart.version,
          updateProductData,
          token,
        );
      }

      basketStore.setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.recalculateCart);
    }
  }

  async addItemToCart(
    productKey: string,
    variantId: number | undefined = undefined, // If not set, refers to the Master Variant.
    quantity = SETTINGS.basketParameters.quantity,
  ): Promise<InCart | undefined> {
    try {
      const product = await productRepository.getProductByKey(productKey);
      if (!product) {
        throw new Error(`Product with key "${productKey}" not found`);
      }
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      if (!token) {
        throw new Error(`Can not add item without token`);
      }
      let cartId = await this.getCartId();
      if (!cartId) {
        const cart = await this.createCart();
        if (!cart) {
          throw new Error(`Cart not found`);
        }
        cartId = cart?.id;
      }
      const updatedCart = await basketRepository.addItemToCart(
        cartId,
        product.id,
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

  /** @quantity
   * If not set, the ShoppingListLineItem is removed from the ShoppingList.
   * If this value matches or exceeds the current quantity of the ShoppingListLineItem,
   * the ShoppingListLineItem is removed from the ShoppingList.
   */
  async removeItemFromCart(
    lineItemId: string,
    quantity: number | undefined = undefined,
  ): Promise<InCart | undefined> {
    try {
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      if (!token) {
        throw new Error(`Can not remove item without token`);
      }
      let cartId = await this.getCartId();
      if (!cartId) {
        const cart = await this.createCart();
        if (!cart) {
          throw new Error(`Cart not found`);
        }
        cartId = cart?.id;
      }

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

  async changeItemQuantity(
    lineItemId: string,
    quantity: number, // If 0, the Line Item is removed from the Cart.
  ): Promise<InCart | undefined> {
    try {
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      if (!token) {
        throw new Error(`Can not change item without token`);
      }
      let cartId = await this.getCartId();
      if (!cartId) {
        const cart = await this.createCart();
        if (!cart) {
          throw new Error(`Cart not found`);
        }
        cartId = cart?.id;
      }

      const updatedCart = await basketRepository.changeItemQuantity(
        cartId,
        lineItemId,
        quantity,
        token,
      );

      basketStore.setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      this.handleError(error, SETTINGS.label.errors.changeItemQuantity);
    }
  }

  async applyDiscountCode(discountCode: string): Promise<InCart | undefined> {
    try {
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      if (!token) {
        throw new Error(`Can not apply promocode without token`);
      }
      const cart = await this.getCart();
      if (!cart) throw new Error("Cart is missing");

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
      let token = await authService.getToken();
      if (!token) {
        token = await authService.getAnonToken();
      }
      if (!token) {
        throw new Error(`Can not remove cart without token`);
      }
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

  private async mergeCartWithNewCurrency(
    oldCart: InCart,
    token: string | undefined,
  ): Promise<InCart> {
    const newCart = await this.createCart({
      currency: SETTINGS.currentCurrency,
      country: oldCart.country,
    });

    if (!newCart?.id) {
      throw new Error("Cannot create a new cart for merging.");
    }
    if (!token) {
      throw new Error("Cannot create a new cart for merging without token.");
    }

    for (const item of oldCart.lineItems) {
      await basketRepository.addItemToCart(
        newCart.id,
        item.productId,
        item.variantId,
        item.quantity,
        token,
      );
    }

    if (oldCart.id && oldCart.version !== undefined) {
      await basketRepository.deleteCart(oldCart.id, oldCart.version, token);
    }

    const mergedCart = await basketRepository.getCart(token);
    if (!mergedCart) throw new Error("Merged cart retrieval failed.");

    return mergedCart;
  }
}

const basketService = new BasketService();
export default basketService;
