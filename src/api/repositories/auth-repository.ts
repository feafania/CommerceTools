import { Customer, MyCustomerDraft } from "@commercetools/platform-sdk";

import { InCustomer, InAddress } from "@/types/types";
import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";

const authRepository = {
  async login(
    email: string,
    password: string,
  ): Promise<InCustomer | undefined> {
    try {
      const response = await loginCustomer(email, password);
      console.info(response.customer);
      if (response) {
        const customer = response.customer;
        return this.toInternalCustomer(customer);
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
        streetName: billing?.streetName ?? "",
        postalCode: billing?.postalCode ?? "",
        city: billing?.city ?? "",
        country: billing?.country ?? "",
      },
      shippingAddress: {
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
