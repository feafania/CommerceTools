import { CustomerSignInResult } from "@commercetools/platform-sdk";

import apiRoot from "@/api/repositories/api-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function loginCustomer(
  email: string,
  password: string,
): Promise<CustomerSignInResult> {
  try {
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
