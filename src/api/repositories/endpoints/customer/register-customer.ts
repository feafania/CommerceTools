import {
  CustomerSignInResult,
  MyCustomerDraft,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createExistingTokenClient } from "@/api/repositories/build-client";

export default async function registerCustomer(
  draft: MyCustomerDraft,
  token: string,
): Promise<CustomerSignInResult> {
  try {
    const ctpClient = createExistingTokenClient(token);
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });

    const response = await apiRoot
      .me()
      .signup()
      .post({
        body: {
          ...draft,
          addresses: draft.addresses || [],
          defaultShippingAddress: draft.defaultShippingAddress || undefined,
          defaultBillingAddress: draft.defaultBillingAddress || undefined,
        },
      })
      .execute();

    return response.body;
  } catch (error: unknown) {
    // console.error(`Registration failed for email "${draft.email}":`, error);
    handleApiError(error);
  }
}
