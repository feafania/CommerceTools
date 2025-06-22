import { CustomerSignInResult, Customer } from "@commercetools/platform-sdk";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";
import { TokenResponse, TokenType } from "@/types/api-types";
import revokeCustomerToken from "@/api/repositories/endpoints/token/revoke-token";
import getMe from "@/api/repositories/endpoints/customer/get-me";

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

export const mockedRevokeCustomerToken =
  revokeCustomerToken as jest.MockedFunction<typeof revokeCustomerToken>;

export const mockedGetMe = getMe as jest.MockedFunction<typeof getMe>;

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

export const mockPassword = "123456";

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
export const mockDate = new Date("2025-05-25T00:00:00Z").getTime();
export const tokenResponse: TokenResponse = {
  ["access_token"]: "mock-access-token",
  ["expires_in"]: 3600,
  scope:
    "view_published_products:your-project-key manage_my_orders:your-project-key manage_my_profile" +
    ":your-project-key customer:mock-customer-id",
  ["refresh_token"]: "your-project-key:mock-refresh-token",
  ["token_type"]: "Bearer",
};
export const token: TokenType = {
  ["access_token"]: tokenResponse.access_token,
  ["token_expires_in"]: new Date(
    mockDate + tokenResponse.expires_in * 1000,
  ).toISOString(),
  ["refresh_token"]: tokenResponse.refresh_token,
};

export class MockFormData {
  private data: Record<string, string>;

  constructor() {
    this.data = {
      email: mockCustomer.email,
      password: "test123",
      firstname: mockCustomer.firstName!,
      lastname: mockCustomer.lastName!,
      birthday: mockCustomer.dateOfBirth!,
      "show-billing-address": "on",
    };
  }

  get(name: string) {
    return this.data[name] ?? "";
  }
}

export const mockedRegisterCall = {
  email: mockCustomer.email,
  password: "test123",
  firstName: mockCustomer.firstName,
  lastName: mockCustomer.lastName,
  dateOfBirth: mockCustomer.dateOfBirth,
  addresses: [
    {
      key: "shipping-address",
      streetName: "",
      streetNumber: "",
      postalCode: "",
      city: "",
      country: "",
      isDefaultShipping: false,
      isDefaultBilling: false,
    },
    {
      key: "billing-address",
      streetName: "",
      streetNumber: "",
      postalCode: "",
      city: "",
      country: "",
      isDefaultShipping: false,
      isDefaultBilling: false,
    },
  ],
};

const PointerEventMock =
  typeof MouseEvent === "undefined"
    ? // Define a no-op fallback or mock for Node.js
      (class {
        constructor() {
          throw new Error(
            "PointerEventMock cannot be used in this environment",
          );
        }
      } as unknown as typeof PointerEvent)
    : class extends MouseEvent implements PointerEvent {
        // Required PointerEvent properties
        public readonly pointerId: number = 1;
        public readonly width: number = 1;
        public readonly height: number = 1;
        public readonly pressure: number = 0;
        public readonly tangentialPressure: number = 0;
        public readonly tiltX: number = 0;
        public readonly tiltY: number = 0;
        public readonly twist: number = 0;
        public readonly pointerType: string = "mouse";
        public readonly isPrimary: boolean = false;
        public readonly altitudeAngle: number = Math.PI / 2;
        public readonly azimuthAngle: number = 0;

        constructor(type: string, eventInitDict?: PointerEventInit) {
          super(type, {
            ...eventInitDict,
            bubbles: eventInitDict?.bubbles ?? true,
            cancelable: eventInitDict?.cancelable,
            composed: eventInitDict?.composed,
            button: eventInitDict?.button ?? 0,
            buttons: eventInitDict?.buttons ?? 0,
          });
        }

        // Required methods
        getCoalescedEvents(): PointerEvent[] {
          return [];
        }

        getPredictedEvents(): PointerEvent[] {
          return [];
        }
      };

export { PointerEventMock };
