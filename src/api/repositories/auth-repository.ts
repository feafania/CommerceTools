import { Customer, MyCustomerDraft } from "@commercetools/platform-sdk";

import { InAddress, InCustomer } from "@/types/interfaces";
import { calculateTokenExpiry, findDefaultAddressIndex } from "@/utils/helpers";
import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/customer/get-customer-token";
import refreshCustomerToken from "@/api/repositories/endpoints/customer/refresh-token";
import revokeCustomerToken from "@/api/repositories/endpoints/customer/revoke-token";
import { AddressType } from "@/types/enum";
import { TokenKeys, TokenType } from "@/types/api-types";

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

  toMyCustomerDraft(input: InCustomer): MyCustomerDraft {
    const addresses = input.addresses;

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
      addresses,
      defaultBillingAddress:
        defaultBillingIndex === -1 ? undefined : defaultBillingIndex,
      defaultShippingAddress:
        defaultShippingIndex === -1 ? undefined : defaultShippingIndex,
    };
  },

  toInternalCustomer(
    customer: Customer,
    password: string | undefined,
  ): InCustomer {
    const addresses = customer.addresses.map((addr) => ({
      id: addr.id,
      key: addr.key,
      password,
      streetName: addr.streetName,
      streetNumber: addr.streetNumber,
      postalCode: addr.postalCode,
      city: addr.city,
      country: addr.country,
      isDefaultBilling: addr.id === customer.defaultBillingAddressId,
      isDefaultShipping: addr.id === customer.defaultShippingAddressId,
    })) as InAddress[];

    return {
      version: customer.version,
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      dateOfBirth: customer.dateOfBirth ?? "",
      addresses,
    };
  },
};

export default authRepository;
