import {
  CustomerSignInResult,
  MyCustomerDraft,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { handleApiError } from "@/api/handle-api-error";
import { createAnonymousClient } from "@/api/repositories/build-client";

export default async function registerCustomer(
  draft: MyCustomerDraft,
): Promise<CustomerSignInResult> {
  try {
    const anonymousClient = createAnonymousClient();
    const apiRoot = createApiBuilderFromCtpClient(
      anonymousClient,
    ).withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY! });

    const response = await apiRoot
      .me()
      .signup()
      .post({
        body: {
          ...draft,
          // Дадаем стандартныя значэнні для неабавязковых палёў
          addresses: draft.addresses || [],
          defaultShippingAddress: draft.defaultShippingAddress || undefined,
          defaultBillingAddress: draft.defaultBillingAddress || undefined,
        },
      })
      .execute();

    return response.body;
  } catch (error: unknown) {
    console.error(`Registration failed for email "${draft.email}":`, error);
    handleApiError(error);
  }
}
