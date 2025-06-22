import { DiscountCode } from "@commercetools/platform-sdk";

import { InCart, InDiscountCode } from "@/types/interfaces";
import MappingHelpers from "@/api/repositories/mapping-helpers";
import { SETTINGS } from "@/config/settings";
import {
  addItemToCart,
  applyDiscountCodeToCart,
  changeCartItemQuantity,
  createCustomerCart,
  deleteAnonymousCartById,
  deleteCustomerCart,
  getCartById,
  getCustomerCart,
  recalculateCart,
  removeItemFromCart,
  getActiveDiscountCodes,
  removeDiscountCodeFromCart,
  getDiscountCodeById,
} from "@/api/repositories/endpoints/basket";

const basketRepository = {
  async getCart(customerToken: string): Promise<InCart | undefined> {
    try {
      let cart;
      if (customerToken) {
        cart = await getCustomerCart(customerToken);
      }
      return cart
        ? MappingHelpers.toInternalCart(cart)
        : await this.createCart({
            customerToken,
            currency: SETTINGS.currentCurrency,
          });
    } catch (error) {
      // console.error("Error getting cart:", error);
      throw error;
    }
  },

  async getCartById(
    cartId: string,
    customerToken: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await getCartById(cartId, customerToken);
      return cart
        ? MappingHelpers.toInternalCart(cart)
        : await this.createCart({
            customerToken,
            currency: SETTINGS.currentCurrency,
          });
    } catch (error) {
      // console.error("Error getting cart:", error);
      throw error;
    }
  },

  async createCart(parameters: {
    customerToken: string;
    currency: string;
    country?: string;
  }): Promise<InCart | undefined> {
    try {
      const { currency, country, customerToken } = parameters;

      const baseDraft = {
        currency,
        country,
      };

      const cart = await createCustomerCart(baseDraft, customerToken);

      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }

      return undefined;
    } catch (error) {
      // console.error("Error creating cart:", error);
      throw error;
    }
  },

  async recalculateCart(
    cartId: string,
    version: number,
    updateProductData: boolean = false,
    token: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await recalculateCart(
        cartId,
        version,
        updateProductData,
        token,
      );
      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }
    } catch (error) {
      // console.error("Error recalculating cart:", error);
      throw error;
    }
  },

  async addItemToCart(
    cartId: string,
    productId: string,
    variantId: number | undefined = undefined,
    quantity = SETTINGS.basketParameters.quantity,
    token: string,
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
      // console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  async removeItemFromCart(
    cartId: string,
    lineItemId: string,
    quantity: number,
    token: string,
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
      // console.error("Error removing item from cart:", error);
      throw error;
    }
  },

  async changeItemQuantity(
    cartId: string,
    lineItemId: string,
    quantity: number,
    token: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await changeCartItemQuantity(
        cartId,
        lineItemId,
        quantity,
        token,
      );
      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }
    } catch (error) {
      // console.error("Error changing item quantity:", error);
      throw error;
    }
  },

  async applyDiscountCode(
    cartId: string,
    discountCode: string,
    version: number,
    token: string,
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
      // console.error("Error applying discount code:", error);
      throw error;
    }
  },

  async removeDiscountCode(
    cartId: string,
    discountCodeId: string,
    version: number,
    token: string,
  ): Promise<InCart | undefined> {
    try {
      const cart = await removeDiscountCodeFromCart(
        cartId,
        discountCodeId,
        version,
        token,
      );
      if (cart) {
        return MappingHelpers.toInternalCart(cart);
      }
    } catch (error) {
      // console.error("Error removing discount code:", error);
      throw error;
    }
  },

  async deleteCart(
    cartId: string,
    version: number,
    token: string,
  ): Promise<void> {
    try {
      await deleteCustomerCart(cartId, version, token);
    } catch (error) {
      // console.error("Error deleting cart:", error);
      throw error;
    }
  },

  async deleteAnonymousCart(
    cartId: string,
    version: number,
    token: string,
  ): Promise<void> {
    try {
      await deleteAnonymousCartById(cartId, version, token);
    } catch (error) {
      // console.error("Error deleting cart:", error);
      throw error;
    }
  },

  async getActiveDiscountCodes(
    limit: number,
  ): Promise<InDiscountCode[] | undefined> {
    try {
      const discountCodes = await getActiveDiscountCodes(limit);
      const now = new Date();

      if (discountCodes) {
        const validDiscountCodes = discountCodes.filter((code) => {
          return (
            code.isActive &&
            (code.maxApplications ?? 1) > 0 &&
            (code.maxApplicationsPerCustomer ?? 1) > 0 &&
            code.cartDiscounts?.every((cd) => {
              const expanded = cd.obj;
              if (!expanded) return false;

              const from = expanded.validFrom
                ? new Date(expanded.validFrom)
                : undefined;
              const until = expanded.validUntil
                ? new Date(expanded.validUntil)
                : undefined;

              return (!from || from <= now) && (!until || until >= now);
            })
          );
        });

        const uniqueByCartDiscount = new Map<string, DiscountCode>();

        for (const code of validDiscountCodes) {
          const discountIds = (code.cartDiscounts || [])
            .map((cd) => cd.id)
            .sort()
            .join(",");

          if (!uniqueByCartDiscount.has(discountIds)) {
            uniqueByCartDiscount.set(discountIds, code);
          }
        }

        return [...uniqueByCartDiscount.values()].map((code) =>
          MappingHelpers.toInternalDiscountCode(code),
        );
      }

      return undefined;
    } catch (error) {
      // console.error("Error creating cart:", error);
      throw error;
    }
  },

  async getDiscountCodeById(
    discountCodeId: string,
  ): Promise<InDiscountCode | undefined> {
    try {
      const code = await getDiscountCodeById(discountCodeId);

      if (code) {
        return MappingHelpers.toInternalDiscountCode(code);
      }

      return undefined;
    } catch (error) {
      // console.error("Error fetching discount code:", error);
      throw error;
    }
  },
};

export default basketRepository;
