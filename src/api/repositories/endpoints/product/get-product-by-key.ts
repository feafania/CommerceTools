import {
  createApiBuilderFromCtpClient,
  ProductProjection,
} from "@commercetools/platform-sdk";

import { createAnonymousClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getProductByKey(
  key: string,
): Promise<ProductProjection | undefined> {
  try {
    const ctpClient = createAnonymousClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .productProjections()
      .withKey({ key })
      .get({ queryArgs: { staged: true } })
      .execute();

    return response.body;
  } catch (error) {
    console.error(`Error fetching product with key "${key}":`, error);
    handleApiError(error);
  }
}
