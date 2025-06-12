import {
  Cart,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { createAnonymousClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getAnonymousCart(
  cartId: string,
): Promise<Cart | undefined> {
  try {
    const ctpClient = createAnonymousClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });
    const response = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();
    return response.body;
  } catch (error) {
    console.error("Getting anonymous cart failed:", error);
    handleApiError(error);
  }
}
