import { CustomerSignInResult, Customer } from "@commercetools/platform-sdk";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";

// Mocked functions
export const mockedRegisterCustomer = registerCustomer as jest.MockedFunction<
  typeof registerCustomer
>;

export const mockedLoginCustomer = loginCustomer as jest.MockedFunction<
  typeof loginCustomer
>;

// Faked customer data
export const mockCustomer: Customer = {
  id: "customer-id-1",
  version: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
  lastModifiedAt: "2025-01-01T00:00:00.000Z",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  addresses: [
    {
      id: "addr-1",
      streetName: "Main Street",
      postalCode: "12345",
      city: "London",
      country: "GB",
    },
    {
      id: "addr-2",
      streetName: "Side Street",
      postalCode: "54321",
      city: "Oxford",
      country: "GB",
    },
  ],
  defaultBillingAddressId: "addr-1",
  defaultShippingAddressId: "addr-2",
  isEmailVerified: true,

  stores: [], // type: StoreKeyReference[]
  authenticationMode: "Password", // or "ExternalAuth"
};

// Fake register response
export const registerResponse: CustomerSignInResult = {
  customer: mockCustomer,
  cart: undefined,
};

// Fake login response
export const loginResponse: CustomerSignInResult = {
  customer: mockCustomer,
  cart: undefined,
};
