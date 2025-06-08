import {
  createApiBuilderFromCtpClient,
  Attribute,
} from "@commercetools/platform-sdk";

import { createAnonymousClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

/**
 * Get attributes of a specific product by ID
 */
export default async function getProductAttributes(
  productId: string,
): Promise<Attribute[]> {
  try {
    const ctpClient = createAnonymousClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .productProjections()
      .withId({ ID: productId })
      .get()
      .execute();

    return response.body.masterVariant.attributes ?? [];
  } catch (error) {
    // console.error("Error fetching product attributes:", error);
    handleApiError(error);
    return [];
  }
}
