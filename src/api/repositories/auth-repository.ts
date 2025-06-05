import { Customer, MyCustomerDraft } from "@commercetools/platform-sdk";

import { InAddress, InCustomer } from "@/types/interfaces";
import { calculateTokenExpiry, findDefaultAddressIndex } from "@/utils/helpers";
import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";
import refreshCustomerToken from "@/api/repositories/endpoints/token/refresh-token";
import revokeCustomerToken from "@/api/repositories/endpoints/token/revoke-token";
import { TokenKeys, TokenType } from "@/types/api-types";
import { AddressType } from "@/types/enum";
import getMe from "@/api/repositories/endpoints/customer/get-me";

const authRepository = {
  async login(
    email: string,
    password: string,
  ): Promise<{ customer: InCustomer; token: TokenType } | undefined> {
    try {
      const response = await loginCustomer(email, password);
      const tokenData = await getCustomerToken(email, password);

      if (response && tokenData?.access_token) {
        const customer = this.toInternalCustomer(response.customer, password);
        return {
          customer,
          token: {
            ["access_token"]: tokenData.access_token,
            ["refresh_token"]: tokenData.refresh_token,
            ["token_expires_in"]: calculateTokenExpiry(tokenData.expires_in),
          },
        };
      }
    } catch (error) {
      throw error;
    }
  },

  async register(data: InCustomer): Promise<InCustomer | undefined> {
    try {
      const draft = this.toMyCustomerDraft(data);
      const response = await registerCustomer(draft);
      if (response) {
        const customer = response.customer;
        return this.toInternalCustomer(customer, data.password);
      }
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(token: string): Promise<TokenType | undefined> {
    try {
      const newTokens = await refreshCustomerToken(token);

      if (newTokens?.access_token) {
        return {
          ["access_token"]: newTokens.access_token,
          ["refresh_token"]: newTokens.refresh_token,
          ["token_expires_in"]: String(
            Date.now() + newTokens.expires_in * 1000,
          ),
        };
      }
    } catch (error) {
      throw error;
    }
  },

  async revokeToken(
    token: string,
    tokenTypeHint?: TokenKeys,
  ): Promise<boolean> {
    try {
      return await revokeCustomerToken(token, tokenTypeHint);
    } catch (error) {
      throw error;
    }
  },

  async getMe(token: string): Promise<InCustomer | undefined> {
    try {
      const customer = await getMe(token);
      if (customer) {
        return this.toInternalCustomer(customer, "");
      }
    } catch (error) {
      throw error;
    }
  },

  toMyCustomerDraft(input: InCustomer): MyCustomerDraft {
    const addresses = input.addresses ?? [];

    const defaultBillingIndex = findDefaultAddressIndex(
      input,
      AddressType.Billing,
    );
    const defaultShippingIndex = findDefaultAddressIndex(
      input,
      AddressType.Shipping,
    );

    return {
      email: input.email,
      password: input.password || "",
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth,
      addresses:
        addresses.length > 0
          ? addresses.map((address) => ({
              key: address.key,
              streetName: address.streetName,
              streetNumber: address.streetNumber ?? "",
              postalCode: address.postalCode,
              city: address.city,
              country: address.country ?? "",
            }))
          : undefined,
      defaultBillingAddress:
        addresses.length > 0 && defaultBillingIndex !== -1
          ? defaultBillingIndex
          : undefined,
      defaultShippingAddress:
        addresses.length > 0 && defaultShippingIndex !== -1
          ? defaultShippingIndex
          : undefined,
    };
  },

  toInternalCustomer(
    customer: Customer,
    password: string | undefined,
  ): InCustomer {
    const addresses = customer.addresses.map((addr) => {
      const isDefaultBilling = addr.id === customer.defaultBillingAddressId;
      const isDefaultShipping = addr.id === customer.defaultShippingAddressId;

      return {
        id: addr.id,
        key: addr.key,
        streetName: addr.streetName,
        streetNumber: addr.streetNumber,
        postalCode: addr.postalCode,
        city: addr.city,
        country: addr.country,
        isDefaultBilling,
        isDefaultShipping,
      };
    }) as InAddress[];

    return {
      version: customer.version,
      id: customer.id,
      email: customer.email,
      password,
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      dateOfBirth: customer.dateOfBirth ?? "",
      addresses,
    };
  },
};

export default authRepository;
