import { randomUUID } from "node:crypto";

import { CartDraft, MyCustomerDraft } from "@commercetools/platform-sdk";

export const testPassword = "StrongPass123!";
export const testKeys = {
  category: "rwd",
  product: "dandrwd",
  productId: "c4ea9a97-5806-4c06-9bd1-a0ccb1c934bc",
  productType: "printed-pictures",
  productVariantId: 1,
  discountCode: "3YbN",
  customerId: "547acab2-be1b-4281-9e07-0309a06d7756",
};

export function getTestDraft(): MyCustomerDraft {
  return {
    email: `test-${randomUUID()}@example.com`,
    password: testPassword,
    firstName: "Test",
    lastName: "User",
    dateOfBirth: "1990-01-01",
    addresses: [
      {
        streetName: "Test Street",
        postalCode: "12345",
        city: "Testville",
        country: "DE",
      },
    ],
    defaultShippingAddress: 0,
    defaultBillingAddress: 0,
  };
}

export const testLoginDraft = {
  ...getTestDraft(),
  email: "test1email@example.com",
  password: testPassword,
};

export const testAddresses = [
  {
    country: "DE",
    city: "Berlin",
    streetName: "Main Str.",
    postalCode: "10115",
  },
  {
    country: "PL",
    city: "Warsaw",
    streetName: "Nowa",
    postalCode: "00-001",
  },
];

export function getRandomPassword(): string {
  return `P@ssw0rd-${Date.now()}`;
}

export const cartDraft: CartDraft = {
  currency: "EUR",
  lineItems: [],
};
