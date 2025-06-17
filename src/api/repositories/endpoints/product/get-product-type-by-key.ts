import {
  createApiBuilderFromCtpClient,
  ProductType,
} from "@commercetools/platform-sdk";

import { createCredentialsClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getProductTypeByKey(
  key: string,
): Promise<ProductType | undefined> {
  try {
    const ctpClient = createCredentialsClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .productTypes()
      .withKey({ key })
      .get()
      .execute();

    return response.body;
  } catch (error) {
    // console.error(`Error fetching product type with key "${key}":`, error);
    handleApiError(error);
  }
}
