import {
  createApiBuilderFromCtpClient,
  CartUpdateAction,
  Cart,
} from "@commercetools/platform-sdk";

import { createExistingTokenClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function removeDiscountCodeFromCart(
  cartId: string,
  discountCodeId: string,
  version: number,
  token: string,
): Promise<Cart | undefined> {
  try {
    const ctpClient = createExistingTokenClient(token);

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const actions: CartUpdateAction[] = [
      {
        action: "removeDiscountCode",
        discountCode: {
          typeId: "discount-code",
          id: discountCodeId,
        },
      },
    ];

    const response = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    // console.error("Removing discount code from cart failed:", error);
    handleApiError(error);
    return undefined;
  }
}
