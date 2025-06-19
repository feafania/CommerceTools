import { Cart, CartRemoveLineItemAction } from "@commercetools/platform-sdk";

import getCartUpdateApi from "@/api/repositories/endpoints/basket/basket-helpers";
import { handleApiError } from "@/api/handle-api-error";

export default async function removeItemFromCart(
  cartId: string,
  lineItemId: string,
  quantity: number,
  token: string,
): Promise<Cart | undefined> {
  try {
    const { cart, post } = await getCartUpdateApi(cartId, token);

    const action: CartRemoveLineItemAction = {
      action: "removeLineItem",
      lineItemId,
      quantity,
    };

    const response = await post({
      body: {
        version: cart.version,
        actions: [action],
      },
    }).execute();

    return response.body;
  } catch (error) {
    // console.error("Adding item to cart failed:", error);
    handleApiError(error);
  }
}
