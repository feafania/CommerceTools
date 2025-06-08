import {
  createApiBuilderFromCtpClient,
  ProductType,
} from "@commercetools/platform-sdk";

import { createAnonymousClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

/**
 * Get all product types with attribute definitions
 */
export default async function getProductTypes(): Promise<ProductType[]> {
  try {
    const ctpClient = createAnonymousClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot.productTypes().get().execute();

    return response.body.results;
  } catch (error) {
    // console.error("Error fetching product types:", error);
    handleApiError(error);
    return [];
  }
}
