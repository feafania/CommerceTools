import {
  Category,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createAnonymousClient } from "@/api/repositories/build-client";

export default async function getCategoryByKey(
  key: string,
): Promise<Category | undefined> {
  try {
    // Create anonymous client (public access)
    const ctpClient = createAnonymousClient();

    // Create API root with project key
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    // Execute the query
    const response = await apiRoot
      .categories()
      .withKey({ key })
      .get()
      .execute();

    return response.body;
  } catch (error) {
    console.error(`Error fetching category with key "${key}":`, error);
    handleApiError(error);
  }
}
