import { Customer } from "@commercetools/platform-sdk";

import { InCustomer } from "@/types/interfaces";

export const oldTestCustomer: InCustomer = {
  id: "cust-1",
  version: 1,
  email: "john@example.com",
  password: "123456",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  addresses: [
    {
      id: "addr-1",
      key: "home",
      streetName: "Old St",
      postalCode: "11111",
      city: "Oldtown",
      country: "DE",
      isDefaultShipping: true,
      isDefaultBilling: false,
    },
  ],
};

export const newTestCustomer: InCustomer = {
  ...oldTestCustomer,
  email: "john.doe@example.com",
  firstName: "Johnny",
  addresses: [
    {
      id: "addr-1",
      key: "home",
      streetName: "Old St",
      postalCode: "11111",
      city: "Oldtown",
      country: "DE",
      isDefaultShipping: false,
      isDefaultBilling: true,
    },
    {
      key: "work",
      streetName: "Workplace Blvd",
      postalCode: "22222",
      city: "Worktown",
      country: "DE",
      isDefaultShipping: true,
      isDefaultBilling: false,
    },
  ],
};

export const updatedResponse: Customer = {
  id: "cust-1",
  version: 2,
  email: "john.doe@example.com",
  firstName: "Johnny",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  createdAt: "2020-01-01T00:00:00.000Z",
  lastModifiedAt: "2020-01-01T00:00:00.000Z",
  isEmailVerified: true,
  stores: [],
  authenticationMode: "Password",
  addresses: [
    {
      id: "addr-1",
      key: "home",
      streetName: "Old St",
      postalCode: "11111",
      city: "Oldtown",
      country: "DE",
    },
    {
      id: "addr-2",
      key: "work",
      streetName: "Workplace Blvd",
      postalCode: "22222",
      city: "Worktown",
      country: "DE",
    },
  ],
  defaultShippingAddressId: "addr-2",
  defaultBillingAddressId: "addr-1",
  key: undefined,
  shippingAddressIds: ["addr-1", "addr-2"],
  billingAddressIds: ["addr-1"],
};

export const mockToken = "mocked-token";
