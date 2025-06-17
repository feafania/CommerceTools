import { InCart, InCustomer } from "@/types/interfaces";
import { calculateTokenExpiry } from "@/utils/helpers";
import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";
import refreshCustomerToken from "@/api/repositories/endpoints/token/refresh-token";
import revokeCustomerToken from "@/api/repositories/endpoints/token/revoke-token";
import { TokenKeys, TokenType } from "@/types/api-types";
import getMe from "@/api/repositories/endpoints/customer/get-me";
import MappingHelpers from "@/api/repositories/mapping-helpers";
import getAnonToken from "@/api/repositories/endpoints/token/get-anonymous-token";

const authRepository = {
  async login(
    email: string,
    password: string,
    token: string,
  ): Promise<
    { customer: InCustomer; token: TokenType; cart?: InCart } | undefined
  > {
    try {
      const response = await loginCustomer(email, password, token);
      const tokenData = await getCustomerToken(email, password);

      if (response && tokenData?.access_token) {
        const customer = MappingHelpers.toInternalCustomer(
          response.customer,
          password,
        );

        const cart = response.cart
          ? MappingHelpers.toInternalCart(response.cart)
          : undefined;

        return {
          customer,
          token: {
            ["access_token"]: tokenData.access_token,
            ["refresh_token"]: tokenData.refresh_token,
            ["token_expires_in"]: calculateTokenExpiry(tokenData.expires_in),
          },
          cart,
        };
      }
    } catch (error) {
      throw error;
    }
  },

  async register(data: InCustomer): Promise<InCustomer | undefined> {
    try {
      const draft = MappingHelpers.toMyCustomerDraft(data);
      const response = await registerCustomer(draft);
      if (response) {
        const customer = response.customer;
        return MappingHelpers.toInternalCustomer(customer, data.password);
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
        return MappingHelpers.toInternalCustomer(customer, "");
      }
    } catch (error) {
      throw error;
    }
  },

  async getAnonToken(anonymousId: string): Promise<TokenType | undefined> {
    try {
      const rawToken = await getAnonToken(anonymousId);

      if (rawToken?.access_token) {
        const token: TokenType = {
          ["access_token"]: rawToken.access_token,
          ["refresh_token"]: rawToken.refresh_token,
          ["token_expires_in"]: String(Date.now() + rawToken.expires_in * 1000),
        };

        return token;
      }

      return undefined;
    } catch (error) {
      throw error;
    }
  },
};

export default authRepository;
