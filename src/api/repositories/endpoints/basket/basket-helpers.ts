import {
  Cart,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { createExistingTokenClient } from "@/api/repositories/build-client";
import getCustomerCart from "@/api/repositories/endpoints/basket/cart/get-customer-cart";
import getCartById from "@/api/repositories/endpoints/basket/cart/get-cart-by-id";
import { CartPostFunction } from "@/types/api-types";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCartUpdateApi(
  cartId: string,
  token: string,
): Promise<{
  cart: Cart;
  post: CartPostFunction;
}> {
  try {
    const ctpClient = createExistingTokenClient(token);

    const api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const cart = token
      ? await getCustomerCart(token)
      : await getCartById(cartId, token);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const post: CartPostFunction = (payload) =>
      (token
        ? api.me().carts().withId({ ID: cart.id })
        : api.carts().withId({ ID: cart.id })
      ).post(payload);

    return { cart, post };
  } catch (error) {
    // console.error("Getting update API failed:", error);
    handleApiError(error);
    throw error;
  }
}
