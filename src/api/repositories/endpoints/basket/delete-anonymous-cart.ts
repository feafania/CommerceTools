import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createAnonymousClient } from "@/api/repositories/build-client";

export default async function deleteAnonymousCart(
  cartId: string,
  version: number,
): Promise<void> {
  try {
    const ctpClient = createAnonymousClient();

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    await apiRoot
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version } })
      .execute();
  } catch (error) {
    console.error("Deleting anonymous cart failed:", error);
    handleApiError(error);
  }
}
