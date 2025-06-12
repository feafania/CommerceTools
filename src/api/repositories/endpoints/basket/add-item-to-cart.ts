import { Cart, CartAddLineItemAction } from "@commercetools/platform-sdk";

import getCartUpdateApi from "@/api/repositories/endpoints/basket/basket-helpers";
import { SETTINGS } from "@/config/settings";
import { handleApiError } from "@/api/handle-api-error";

export default async function addItemToCart(
  cartId: string,
  productId: string,
  variantId: number | undefined,
  quantity: number = SETTINGS.basketParameters.quantity,
  token?: string,
): Promise<Cart | undefined> {
  try {
    const { cart, post } = await getCartUpdateApi(cartId, token);
    const action: CartAddLineItemAction = {
      action: "addLineItem",
      productId,
      ...(variantId === undefined ? {} : { variantId }),
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
    console.error("Adding item to cart failed:", error);
    handleApiError(error);
  }
}
