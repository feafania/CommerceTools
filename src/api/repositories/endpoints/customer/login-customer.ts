import {
  CustomerSignInResult,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import {
  createAnonymousClient,
  createPasswordClient,
  // createPasswordClient,
} from "@/api/repositories/build-client";

/**
 * Login customer using anonymous session to merge carts.
 *
 * @param email
 * @param password
 * @param anonymousCartId - optional anonymous cart to merge
 */
export default async function loginCustomer(
  email: string,
  password: string,
  anonymousCartId?: string,
): Promise<CustomerSignInResult | undefined> {
  try {
    const isAnonymousFlow = Boolean(anonymousCartId);
    const client = isAnonymousFlow
      ? createAnonymousClient()
      : createPasswordClient(email, password);

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
          ...(isAnonymousFlow
            ? {
                anonymousCartId,
                anonymousCartSignInMode: "MergeWithExistingCustomerCart",
              }
            : {
                activeCartSignInMode: "MergeWithExistingCustomerCart",
                // or "UseAsNewActiveCustomerCart" (clear basket)
              }),
        },
      })
      .execute();

    return response.body;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
