import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { Cart, CartUpdateAction } from "@commercetools/platform-sdk";

import {
  createAnonymousClient,
  createExistingTokenClient,
} from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function applyDiscountCodeToCart(
  cartId: string,
  discountCode: string,
  version: number,
  token?: string,
): Promise<Cart> {
  try {
    const client = token
      ? createExistingTokenClient(token)
      : createAnonymousClient();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const actions: CartUpdateAction[] = [
      {
        action: "addDiscountCode",
        code: discountCode,
      },
    ];

    return apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute()
      .then((response) => response.body);
  } catch (error) {
    console.error("Applying discount code to cart failed:", error);
    handleApiError(error);
  }
}
