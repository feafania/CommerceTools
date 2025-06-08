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
    const ctpClient = createAnonymousClient();

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .categories()
      .withKey({ key })
      .get()
      .execute();

    return response.body;
  } catch (error) {
    // console.error(`Error fetching category with key "${key}":`, error);
    handleApiError(error);
  }
}
