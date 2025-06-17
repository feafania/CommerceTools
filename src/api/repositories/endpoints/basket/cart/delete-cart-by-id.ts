import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createExistingTokenClient } from "@/api/repositories/build-client";

export default async function deleteCartById(
  cartId: string,
  version: number,
  token: string,
): Promise<void> {
  try {
    const ctpClient = createExistingTokenClient(token);

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    await apiRoot
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version } })
      .execute();
  } catch (error) {
    console.error("Deleting cart by id failed:", error);
    handleApiError(error);
  }
}
