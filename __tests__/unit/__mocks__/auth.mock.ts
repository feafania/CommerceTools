import { CustomerSignInResult, Customer } from "@commercetools/platform-sdk";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/customer/get-customer-token";
import { TokenResponse } from "@/types/interfaces";

// Mocked functions
export const mockedRegisterCustomer = registerCustomer as jest.MockedFunction<
  typeof registerCustomer
>;

export const mockedLoginCustomer = loginCustomer as jest.MockedFunction<
  typeof loginCustomer
>;

export const mockedGetCustomerToken = getCustomerToken as jest.MockedFunction<
  typeof getCustomerToken
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

// Fake token response
export const tokenResponse: TokenResponse = {
  ["access_token"]: "mock-access-token",
  ["expires_in"]: 172_800,
  scope:
    "view_published_products:your-project-key manage_my_orders:your-project-key manage_my_profile" +
    ":your-project-key customer:mock-customer-id",
  ["refresh_token"]: "your-project-key:mock-refresh-token",
  ["token_type"]: "Bearer",
};
