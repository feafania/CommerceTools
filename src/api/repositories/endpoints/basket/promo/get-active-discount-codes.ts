import {
  createApiBuilderFromCtpClient,
  DiscountCode,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createCredentialsClient } from "@/api/repositories/build-client";

export default async function getActiveDiscountCodes(
  limit: number,
): Promise<DiscountCode[] | undefined> {
  try {
    const ctpClient = createCredentialsClient();

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .discountCodes()
      .get({
        queryArgs: {
          where: "isActive = true",
          expand: ["cartDiscounts[*]"],
          withTotal: false,
          limit,
        },
      })
      .execute();

    return response.body?.results;
  } catch (error) {
    handleApiError(error);
    return undefined;
  }
}
