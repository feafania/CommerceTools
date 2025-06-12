import {
  Cart,
  CartRecalculateAction,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import {
  createAnonymousClient,
  createExistingTokenClient,
} from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

/**
 * Recalculates the cart's prices, discounts, and optionally product data.
 */
export default async function recalculateCart(
  cartId: string,
  version: number,
  updateProductData: boolean = false,
  token?: string,
): Promise<Cart | undefined> {
  try {
    const client = token
      ? createExistingTokenClient(token)
      : createAnonymousClient();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const action: CartRecalculateAction = {
      action: "recalculate",
      updateProductData,
    };

    const response = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions: [action],
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    console.error("Recalculating cart failed:", error);
    handleApiError(error);
  }
}
