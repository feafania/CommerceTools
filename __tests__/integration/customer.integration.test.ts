import {
  CustomerSignInResult,
  MyCustomerUpdateAction,
} from "@commercetools/platform-sdk";

import { testDraft, testPassword } from "./__mocks__/integration.mock";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import { updateCustomer } from "@/api/repositories/endpoints/customer/update-customer";
import getCustomerToken from "@/api/repositories/endpoints/customer/get-customer-token";

describe("Update Customer Integration", () => {
  let result: CustomerSignInResult;
  let version: number;
  let accessToken: string;

  beforeAll(async () => {
    result = await registerCustomer(testDraft);
    expect(result).toBeDefined();

    const tokenResponse = await getCustomerToken(testDraft.email, testPassword);
    expect(tokenResponse?.access_token).toBeDefined();

    accessToken = tokenResponse!.access_token;
    version = result.customer.version;
  });

  it("should update the first name of the customer", async () => {
    const newFirstName = "UpdatedName";

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "setFirstName",
        firstName: newFirstName,
      },
    ];

    const updated = await updateCustomer(version, actions, accessToken);
    expect(updated).toBeDefined();
    expect(updated?.firstName).toBe(newFirstName);

    version = updated!.version;
  });

  it("should update the email of the customer", async () => {
    const newEmail = `updated-${Date.now()}@example.com`;

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "changeEmail",
        email: newEmail,
      },
    ];

    const updated = await updateCustomer(version, actions, accessToken);
    expect(updated).toBeDefined();
    expect(updated?.email).toBe(newEmail);

    version = updated!.version;
  });

  it("should fail to update customer with wrong version", async () => {
    const actions: MyCustomerUpdateAction[] = [
      {
        action: "setLastName",
        lastName: "ShouldFail",
      },
    ];

    const wrongVersion = version - 5;

    await expect(
      updateCustomer(wrongVersion, actions, accessToken),
    ).rejects.toThrow();
  });

  it("should fail to update email to an existing one", async () => {
    const secondEmail = `duplicate-${Date.now()}@example.com`;
    const secondCustomerDraft = { ...testDraft, email: secondEmail };
    const secondCustomer = await registerCustomer(secondCustomerDraft);
    expect(secondCustomer).toBeDefined();

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "changeEmail",
        email: secondEmail,
      },
    ];

    await expect(updateCustomer(version, actions, accessToken)).rejects.toThrow(
      /email/i,
    );
  });
});
