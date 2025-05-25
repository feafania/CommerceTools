import { Customer, MyCustomerDraft } from "@commercetools/platform-sdk";

import { InCustomer, InAddress } from "@/types/interfaces";
import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/customer/get-customer-token";
import { TokenType } from "@/types/interfaces";
import { tokenStore } from "@/stores/token-store";
import refreshToken from "@/api/repositories/endpoints/customer/refresh-token";
import { calculateTokenExpiry } from "@/utils/helpers";

const authRepository = {
  async login(
    email: string,
    password: string,
  ): Promise<{ customer: InCustomer; token: TokenType } | undefined> {
    try {
      const response = await loginCustomer(email, password);
      const tokenData = await getCustomerToken(email, password);
      console.info(response.customer);

      if (response && tokenData?.access_token) {
        const customer = this.toInternalCustomer(response.customer);
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
        return this.toInternalCustomer(customer);
      }
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(): Promise<TokenType | undefined> {
    try {
      const newTokens = await refreshToken(tokenStore.refreshToken!);

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

  toMyCustomerDraft(input: InCustomer): MyCustomerDraft {
    const addresses: InAddress[] = input.isSameAddress
      ? [input.billingAddress]
      : [input.billingAddress, input.shippingAddress];

    const billingIndex = 0;
    const shippingIndex = input.isSameAddress ? 0 : 1;

    return {
      email: input.email,
      password: input.password || "",
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth,
      addresses,
      defaultBillingAddress: input.setBillingAsDefault
        ? billingIndex
        : undefined,
      defaultShippingAddress: input.setShippingAsDefault
        ? shippingIndex
        : undefined,
    };
  },

  toInternalCustomer(customer: Customer): InCustomer {
    const findAddressById = (id?: string) =>
      customer.addresses.find((addr) => addr.id === id);

    const billing = findAddressById(customer.defaultBillingAddressId);
    const shipping = findAddressById(customer.defaultShippingAddressId);

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      dateOfBirth: customer.dateOfBirth ?? "",
      billingAddress: {
        id: billing?.id ?? "",
        streetName: billing?.streetName ?? "",
        postalCode: billing?.postalCode ?? "",
        city: billing?.city ?? "",
        country: billing?.country ?? "",
      },
      shippingAddress: {
        id: shipping?.id ?? "",
        streetName: shipping?.streetName ?? "",
        postalCode: shipping?.postalCode ?? "",
        city: shipping?.city ?? "",
        country: shipping?.country ?? "",
      },
      isSameAddress:
        customer.defaultBillingAddressId === customer.defaultShippingAddressId,
      setBillingAsDefault: Boolean(customer.defaultBillingAddressId),
      setShippingAsDefault: Boolean(customer.defaultShippingAddressId),
    };
  },
};

export default authRepository;
