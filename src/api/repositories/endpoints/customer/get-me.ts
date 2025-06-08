import {
  createApiBuilderFromCtpClient,
  Customer,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createExistingTokenClient } from "@/api/repositories/build-client";

export default async function getMe(token: string): Promise<Customer> {
  try {
    const client = createExistingTokenClient(token);
    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot.me().get().execute();

    return response.body;
  } catch (error: unknown) {
    // console.error("Fetching customer (me) failed:", error);
    handleApiError(error);
  }
}
