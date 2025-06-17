import {
  CustomerSignInResult,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import {
  createExistingTokenClient,
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
  token?: string,
): Promise<CustomerSignInResult | undefined> {
  try {
    const ctpClient = token
      ? createExistingTokenClient(token)
      : createPasswordClient(email, password);

    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });
    const body = {
      email,
      password,
      activeCartSignInMode: "MergeWithExistingCustomerCart",
      // ...(isAnonymousFlow
      //   ? {
      //       anonymousCart: {
      //         id: anonymousCartId,
      //         typeId: "cart",
      //       },
      //       anonymousCartSignInMode: "MergeWithExistingCustomerCart",
      //     }
      //   : {
      //       activeCartSignInMode: "MergeWithExistingCustomerCart",
      //       // or "UseAsNewActiveCustomerCart" (clear basket)
      //     }),
    };
    const response = await apiRoot
      .me()
      .login()
      .post({
        body,
      })
      .execute();

    return response.body;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
