import {
  Cart,
  CartDraft,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createAnonymousClient } from "@/api/repositories/build-client";

export default async function createAnonymousCart(
  cartDraft: CartDraft,
): Promise<Cart | undefined> {
  try {
    const ctpClient = createAnonymousClient();

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot.carts().post({ body: cartDraft }).execute();

    return response.body;
  } catch (error) {
    console.error("Creating anonymous cart failed:", error);
    handleApiError(error);
  }
}
