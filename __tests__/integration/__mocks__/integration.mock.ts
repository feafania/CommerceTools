import { MyCustomerDraft } from "@commercetools/platform-sdk";

export const testPassword = "StrongPass123!";

export function getTestDraft(): MyCustomerDraft {
  return {
    email: `test-${Date.now()}@example.com`,
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
