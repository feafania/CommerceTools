import {
  Customer,
  MyCustomerChangePassword,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createExistingTokenClient } from "@/api/repositories/build-client";

export async function changeCustomerPassword(
  version: number,
  currentPassword: string,
  newPassword: string,
  token: string,
): Promise<Customer | undefined> {
  try {
    const ctpClient = createExistingTokenClient(token);

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const payload: MyCustomerChangePassword = {
      version,
      currentPassword,
      newPassword,
    };

    const response = await apiRoot
      .me()
      .password()
      .post({ body: payload })
      .execute();

    return response.body;
  } catch (error) {
    console.error("Customer password change failed:", error);
    handleApiError(error);
  }
}
