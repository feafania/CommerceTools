import {
  Cart,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import {
  createAnonymousClient,
  createExistingTokenClient,
} from "@/api/repositories/build-client";
import getCustomerCart from "@/api/repositories/endpoints/basket/get-customer-cart";
import getAnonymousCart from "@/api/repositories/endpoints/basket/get-anonymous-cart";
import { CartPostFunction } from "@/types/api-types";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCartUpdateApi(
  cartId: string,
  token?: string,
): Promise<{
  cart: Cart;
  post: CartPostFunction;
}> {
  try {
    const ctpClient = token
      ? createExistingTokenClient(token)
      : createAnonymousClient();

    const api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const cart = token
      ? await getCustomerCart(token)
      : await getAnonymousCart(cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const post = token
      ? api.me().carts().withId({ ID: cart.id }).post
      : api.carts().withId({ ID: cart.id }).post;

    return { cart, post };
  } catch (error) {
    console.error("Getting update API failed:", error);
    handleApiError(error);
  }
}
