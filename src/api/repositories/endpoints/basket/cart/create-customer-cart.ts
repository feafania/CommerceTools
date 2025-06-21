import {
  Cart,
  createApiBuilderFromCtpClient,
  MyCartDraft,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createExistingTokenClient } from "@/api/repositories/build-client";

export default async function createCustomerCart(
  cartDraft: MyCartDraft,
  token: string,
): Promise<Cart | undefined> {
  try {
    const ctpClient = createExistingTokenClient(token);

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .me()
      .carts()
      .post({ body: cartDraft })
      .execute();

    return response.body;
  } catch (error) {
    // console.error("Creating customer cart failed:", error);
    handleApiError(error);
    return undefined;
  }
}
