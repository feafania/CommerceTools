import { InCart } from "@/types/interfaces";
import MappingHelpers from "@/api/repositories/mapping-helpers";
import { SETTINGS } from "@/config/settings";
import {
  addItemToCart,
  applyDiscountCodeToCart,
  createAnonymousCart,
  createCustomerCart,
  deleteAnonymousCart,
  deleteCustomerCart,
  getAnonymousCart,
  getCustomerCart,
  removeItemFromCart,
} from "@/api/repositories/endpoints/basket";

const basketRepository = {
  async getCart(
    cartId?: string,
    customerToken?: string,
  ): Promise<InCart | undefined> {
    try {
      let cart;
      if (customerToken) {
        cart = await getCustomerCart(customerToken);
      }
      if (cartId) {
        cart = await getAnonymousCart(cartId);
      }
      return cart
        ? MappingHelpers.toInternalCart(cart)
        : await this.createCart();
    } catch (error) {
      console.error("Error getting cart:", error);
      throw error;
    }
  },

  async createCart(parameters?: {
    currency: string;
    country?: string;
    customerToken?: string;
  }): Promise<InCart | undefined> {
    try {
      const { currency, country, customerToken } = parameters ?? {
        currency: SETTINGS.currentCurrency,
      };

      const baseDraft = {
        currency,
        country,
      };

      const cart = await (customerToken
        ? createCustomerCart(baseDraft, customerToken)
        : createAnonymousCart(baseDraft));

      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }

      return undefined;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  },

  async addItemToCart(
    cartId: string,
    productId: string,
    variantId: number | undefined = undefined,
    quantity = SETTINGS.basketParameters.quantity,
    token?: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await addItemToCart(
        cartId,
        productId,
        variantId,
        quantity,
        token,
      );
      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  async removeItemFromCart(
    cartId: string,
    lineItemId: string,
    quantity: number | undefined = undefined,
    token?: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await removeItemFromCart(
        cartId,
        lineItemId,
        quantity,
        token,
      );
      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  },

  async applyDiscountCode(
    cartId: string,
    discountCode: string,
    version: number,
    token?: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await applyDiscountCodeToCart(
        cartId,
        discountCode,
        version,
        token,
      );
      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }
    } catch (error) {
      console.error("Error applying discount code:", error);
      throw error;
    }
  },

  async deleteCart(
    cartId: string,
    version: number,
    token?: string,
  ): Promise<void> {
    try {
      await (token
        ? deleteCustomerCart(cartId, version, token)
        : deleteAnonymousCart(cartId, version));
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  },
};

export default basketRepository;
