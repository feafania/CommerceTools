import {
  createApiBuilderFromCtpClient,
  ProductProjection,
} from "@commercetools/platform-sdk";

import { createCredentialsClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getProductById(
  id: string,
): Promise<ProductProjection | undefined> {
  try {
    const ctpClient = createCredentialsClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .productProjections()
      .withId({ ID: id })
      .get({
        queryArgs: {
          staged: true,
          expand: ["productType"],
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    handleApiError(error);
  }
}
