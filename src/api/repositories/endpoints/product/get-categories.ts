import {
  CategoryPagedQueryResponse,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createCredentialsClient } from "@/api/repositories/build-client";

export default async function getCategories(): Promise<
  CategoryPagedQueryResponse | undefined
> {
  try {
    // Create anonymous client (no auth needed for public categories)
    const ctpClient = createCredentialsClient();

    // Create API root with project key
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    // Execute the query
    const response = await apiRoot
      .categories()
      .get({
        queryArgs: {
          withTotal: false,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    // console.error("Error fetching categories:", error);
    handleApiError(error);
  }
}
