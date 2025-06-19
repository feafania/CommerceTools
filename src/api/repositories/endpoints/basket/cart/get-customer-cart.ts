import {
  Cart,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { createExistingTokenClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCustomerCart(
  token: string,
): Promise<Cart | undefined> {
  try {
    const ctpClient = createExistingTokenClient(token);
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });
    const response = await apiRoot.me().activeCart().get().execute();
    return response.body;
  } catch (error) {
    // console.error("Getting customer cart failed:", error);
    handleApiError(error);
  }
}
