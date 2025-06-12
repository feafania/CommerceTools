import {
  Cart,
  CartChangeLineItemQuantityAction,
} from "@commercetools/platform-sdk";

import getCartUpdateApi from "@/api/repositories/endpoints/basket/basket-helpers";
import { handleApiError } from "@/api/handle-api-error";

export default async function changeCartItemQuantity(
  cartId: string,
  lineItemId: string,
  quantity: number,
  token?: string,
): Promise<Cart | undefined> {
  try {
    const { cart, post } = await getCartUpdateApi(cartId, token);

    const action: CartChangeLineItemQuantityAction = {
      action: "changeLineItemQuantity",
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
    console.error("Changing cart line item quantity failed:", error);
    handleApiError(error);
  }
}
