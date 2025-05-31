import { CustomerSignInResult } from "@commercetools/platform-sdk";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createPasswordClient } from "@/api/repositories/build-client";

export default async function loginCustomer(
  email: string,
  password: string,
): Promise<CustomerSignInResult> {
  try {
    const client = createPasswordClient(email, password);
    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
          activeCartSignInMode: "MergeWithExistingCustomerCart",
          // or "UseAsNewActiveCustomerCart" (clear basket)
        },
      })
      .execute();

    return response.body;
  } catch (error: unknown) {
    console.error(`Login with email "${email}" failed:`, error);
    handleApiError(error);
  }
}
