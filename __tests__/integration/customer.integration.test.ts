import {
  MyCustomerDraft,
  MyCustomerUpdateAction,
} from "@commercetools/platform-sdk";
import { v4 as uuidv4 } from "uuid";

import { mockSETTINGS } from "../common.mock";

import {
  getRandomPassword,
  getTestDraft,
  testPassword,
} from "./__mocks__/integration.mock";
jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import { updateCustomer } from "@/api/repositories/endpoints/customer/update-customer";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";
import { changeCustomerPassword } from "@/api/repositories/endpoints/customer/change-password";
import getMe from "@/api/repositories/endpoints/customer/get-me";
import getAnonToken from "@/api/repositories/endpoints/token/get-anonymous-token";

describe("Update Customer Integration", () => {
  let version: number;
  let accessToken: string;
  let email: string;
  let currentPassword: string;

  const setupCustomer = async (): Promise<void> => {
    const draft: MyCustomerDraft = getTestDraft();
    const anon = await getAnonToken(uuidv4());
    const anonymousToken = anon?.access_token;
    if (!anonymousToken) throw new Error("Failed to get anonymous token");

    await registerCustomer(draft, anonymousToken);

    email = draft.email;
    currentPassword = draft.password ?? testPassword;

    const token = await getCustomerToken(email, currentPassword);
    accessToken = token!.access_token;

    const me = await getMe(accessToken);
    version = me.version;
  };

  it("should update the first name of the customer", async () => {
    await setupCustomer();

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
  });

  it("should update the email of the customer", async () => {
    await setupCustomer();

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
  });

  it("should fail to update customer with wrong version", async () => {
    await setupCustomer();

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "setLastName",
        lastName: "ShouldFail",
      },
    ];

    const wrongVersion = version - 1;

    await expect(
      updateCustomer(wrongVersion, actions, accessToken),
    ).rejects.toThrow(/version/i);
  });

  it("should fail to update email to an existing one", async () => {
    // Setup first customer
    await setupCustomer();

    const originalAccessToken = accessToken;
    const originalVersion = version;

    const secondDraft = getTestDraft();
    const modifiedSecondDraft = {
      ...secondDraft,
      email: `duplicate-${Date.now()}@example.com`,
    };
    const anon = await getAnonToken(uuidv4());
    const anonymousToken = anon?.access_token;
    if (!anonymousToken)
      throw new Error("Failed to get anonymous token for second customer");

    await registerCustomer(modifiedSecondDraft, anonymousToken);
    await new Promise((r) => setTimeout(r, 1000));
    const actions: MyCustomerUpdateAction[] = [
      {
        action: "changeEmail",
        email: modifiedSecondDraft.email,
      },
    ];

    await expect(
      updateCustomer(originalVersion, actions, originalAccessToken),
    ).rejects.toThrow(/email/i);
  });

  it("should change customer password", async () => {
    await setupCustomer();

    const newPassword = getRandomPassword();

    const updatedCustomer = await changeCustomerPassword(
      version,
      currentPassword,
      newPassword,
      accessToken,
    );

    expect(updatedCustomer).toBeDefined();
    expect(updatedCustomer!.version).toBeGreaterThan(version);

    await expect(getCustomerToken(email, currentPassword)).rejects.toThrow(
      /invalid|credentials|password/i,
    );

    const login = await getCustomerToken(email, newPassword);
    expect(login?.access_token).toBeDefined();
  });
});
