import {
  createApiBuilderFromCtpClient,
  DiscountCode,
} from "@commercetools/platform-sdk";

import { createCredentialsClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getDiscountCodeById(
  discountCodeId: string,
): Promise<DiscountCode | undefined> {
  try {
    const ctpClient = createCredentialsClient();

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .discountCodes()
      .withId({ ID: discountCodeId })
      .get()
      .execute();

    return response.body;
  } catch (error) {
    // console.error("Fetching discount code by ID failed:", error);
    handleApiError(error);
    return undefined;
  }
}
