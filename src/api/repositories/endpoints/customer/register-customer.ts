import {
  CustomerSignInResult,
  MyCustomerDraft,
} from "@commercetools/platform-sdk";

import apiRoot from "@/api/repositories/api-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function registerCustomer(
  draft: MyCustomerDraft,
): Promise<CustomerSignInResult | undefined> {
  try {
    const response = await apiRoot
      .me()
      .signup()
      .post({ body: draft })
      .execute();

    return response.body;
  } catch (error: unknown) {
    console.error(`Registration with email "${draft.email}" failed:`, error);
    handleApiError(error);
  }
}
