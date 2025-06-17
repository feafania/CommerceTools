import {
  CustomerSignInResult,
  MyCustomerUpdateAction,
} from "@commercetools/platform-sdk";

import { mockSETTINGS } from "../common.mock";

import {
  getTestDraft,
  testAddresses,
  testPassword,
} from "./__mocks__/integration.mock";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import { updateCustomer } from "@/api/repositories/endpoints/customer/update-customer";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";

jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));

describe("Update Customer Addresses Integration", () => {
  let result: CustomerSignInResult;
  let version: number;
  let accessToken: string;

  beforeAll(async () => {
    const testDraft = getTestDraft();
    result = await registerCustomer(testDraft);
    expect(result).toBeDefined();

    const tokenResponse = await getCustomerToken(testDraft.email, testPassword);
    expect(tokenResponse?.access_token).toBeDefined();

    accessToken = tokenResponse!.access_token;
    version = result.customer.version;
  });

  it("should add a new address to the customer", async () => {
    const newAddress = testAddresses[0];

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "addAddress",
        address: newAddress,
      },
    ];

    const updated = await updateCustomer(version, actions, accessToken);
    expect(updated).toBeDefined();
    expect(updated?.addresses.length).toBeGreaterThan(0);

    const added = updated!.addresses.find((a) => a.city === "Berlin");
    expect(added).toBeDefined();

    version = updated!.version;
  });

  it("should change the existing address", async () => {
    const addressId = result.customer.addresses[0]?.id;
    expect(addressId).toBeDefined();

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "changeAddress",
        addressId: addressId!,
        address: {
          ...result.customer.addresses[0],
          city: "Munich",
        },
      },
    ];

    const updated = await updateCustomer(version, actions, accessToken);
    expect(updated).toBeDefined();

    const changed = updated!.addresses.find((a) => a.id === addressId);
    expect(changed?.city).toBe("Munich");

    version = updated!.version;
  });

  it("should remove an existing address", async () => {
    const addressId = result.customer.addresses[0]?.id;
    expect(addressId).toBeDefined();

    const actions: MyCustomerUpdateAction[] = [
      {
        action: "removeAddress",
        addressId: addressId!,
      },
    ];

    const updated = await updateCustomer(version, actions, accessToken);
    expect(updated).toBeDefined();
    expect(updated!.addresses.find((a) => a.id === addressId)).toBeUndefined();

    version = updated!.version;
  });

  it("should set address as default billing address", async () => {
    const newAddress = testAddresses[1];

    let updated = await updateCustomer(
      version,
      [{ action: "addAddress", address: newAddress }],
      accessToken,
    );
    const addedAddressId = updated!.addresses.find(
      (a) => a.city === "Warsaw",
    )!.id;
    version = updated!.version;

    updated = await updateCustomer(
      version,
      [{ action: "setDefaultBillingAddress", addressId: addedAddressId }],
      accessToken,
    );
    expect(updated?.defaultBillingAddressId).toBe(addedAddressId);

    version = updated!.version;
  });

  it("should unset default billing address", async () => {
    const actions: MyCustomerUpdateAction[] = [
      {
        action: "setDefaultBillingAddress",
        addressId: JSON.parse("null"),
      },
    ];

    const updated = await updateCustomer(version, actions, accessToken);
    expect(updated?.defaultBillingAddressId).toBeUndefined();

    version = updated!.version;
  });

  it("should set address as default shipping address", async () => {
    const newAddress = {
      country: "NL",
      city: "Amsterdam",
      streetName: "Damrak",
      postalCode: "1012",
    };

    let updated = await updateCustomer(
      version,
      [{ action: "addAddress", address: newAddress }],
      accessToken,
    );

    const addressId = updated!.addresses.find(
      (a) => a.city === "Amsterdam",
    )?.id;
    expect(addressId).toBeDefined();

    version = updated!.version;

    updated = await updateCustomer(
      version,
      [{ action: "setDefaultShippingAddress", addressId }],
      accessToken,
    );

    expect(updated?.defaultShippingAddressId).toBe(addressId);
    version = updated!.version;
  });

  it("should unset default shipping address", async () => {
    const updated = await updateCustomer(
      version,
      [{ action: "setDefaultShippingAddress", addressId: JSON.parse("null") }],
      accessToken,
    );

    expect(updated?.defaultShippingAddressId).toBeUndefined();
    version = updated!.version;
  });
});
