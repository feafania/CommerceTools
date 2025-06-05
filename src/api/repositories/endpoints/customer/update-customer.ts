import {
  Customer,
  MyCustomerUpdateAction,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createExistingTokenClient } from "@/api/repositories/build-client";

export async function updateCustomer(
  version: number,
  actions: MyCustomerUpdateAction[],
  token: string,
): Promise<Customer | undefined> {
  try {
    // Create client with the existing token
    const ctpClient = createExistingTokenClient(token);

    // Create API root from the client
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .me()
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    console.error("Customer update failed:", error);
    handleApiError(error);
  }
}
