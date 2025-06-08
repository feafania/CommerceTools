import { Customer, MyCustomerUpdateAction } from "@commercetools/platform-sdk";

import { InAddress, InCustomer } from "@/types/interfaces";
import { CustomerActionType } from "@/types/api-types";
import { deepEqual } from "@/utils/helpers";
import { updateCustomer } from "@/api/repositories/endpoints/customer/update-customer";
import { changeCustomerPassword } from "@/api/repositories/endpoints/customer/change-password";
import authRepository from "@/api/repositories/auth-repository";

export const customerRepository = {
  async update(
    oldCustomer: InCustomer,
    newCustomer: InCustomer,
    token: string,
  ): Promise<InCustomer | undefined> {
    try {
      const actions = this.transformCustomer(oldCustomer, newCustomer);
      const version = oldCustomer.version;
      if (version === null || version === undefined) {
        throw new Error("Customer version is missing.");
      }
      if (actions.length === 0) {
        return undefined;
      }

      const updatedCustomer = await updateCustomer(version, actions, token);
      if (updatedCustomer) {
        return this.updateCustomer(oldCustomer, updatedCustomer);
      }
    } catch (error) {
      console.error("Customer update failed:", error);
      throw error;
    }
  },

  async changePassword(
    version: number,
    currentPassword: string,
    newPassword: string,
    token: string,
  ): Promise<InCustomer | undefined> {
    try {
      const customer = await changeCustomerPassword(
        version,
        currentPassword,
        newPassword,
        token,
      );

      if (customer) {
        return authRepository.toInternalCustomer(customer, newPassword);
      }
    } catch (error) {
      throw error;
    }
  },

  transformCustomer(
    oldCustomer: InCustomer,
    newCustomer: InCustomer,
  ): MyCustomerUpdateAction[] {
    newCustomer.addresses = this.ensureAddressKeys(newCustomer.addresses);
    const actions = this.transformAttributes(oldCustomer, newCustomer);

    // addresses
    const oldAddresses = oldCustomer.addresses ?? [];
    const newAddresses = newCustomer.addresses ?? [];

    const oldMap = new Map(oldAddresses.map((a) => [a.id, a]));

    const usedOldIds = new Set<string>();

    for (const addr of newAddresses) {
      if (addr.id) {
        const existing = oldMap.get(addr.id);
        if (existing && !deepEqual(existing, addr)) {
          actions.push({
            action: CustomerActionType.ChangeAddress,
            addressId: addr.id,
            address: addr,
          });
        }
        usedOldIds.add(addr.id);
      } else {
        actions.push({ action: CustomerActionType.AddAddress, address: addr });
      }
    }

    // remove addresses
    for (const addr of oldAddresses) {
      if (addr.id && !usedOldIds.has(addr.id)) {
        actions.push({
          action: CustomerActionType.RemoveAddress,
          addressId: addr.id,
        });
      }
    }

    const addressActions = this.transformDefaultAddresses(
      oldCustomer,
      newCustomer,
    );

    return [...actions, ...addressActions];
  },

  transformAttributes(
    oldCustomer: InCustomer,
    newCustomer: InCustomer,
  ): MyCustomerUpdateAction[] {
    const actions: MyCustomerUpdateAction[] = [];

    if (oldCustomer.email !== newCustomer.email) {
      actions.push({
        action: CustomerActionType.ChangeEmail,
        email: newCustomer.email,
      });
    }

    if (oldCustomer.firstName !== newCustomer.firstName) {
      actions.push({
        action: CustomerActionType.SetFirstName,
        firstName: newCustomer.firstName,
      });
    }

    if (oldCustomer.lastName !== newCustomer.lastName) {
      actions.push({
        action: CustomerActionType.SetLastName,
        lastName: newCustomer.lastName,
      });
    }

    if (oldCustomer.dateOfBirth !== newCustomer.dateOfBirth) {
      actions.push({
        action: CustomerActionType.SetDateOfBirth,
        dateOfBirth: newCustomer.dateOfBirth,
      });
    }
    return actions;
  },

  transformDefaultAddresses(
    oldCustomer: InCustomer,
    newCustomer: InCustomer,
  ): MyCustomerUpdateAction[] {
    const actions: MyCustomerUpdateAction[] = [];

    actions.push(
      ...([
        ["isDefaultShipping", CustomerActionType.SetDefaultShippingAddress],
        ["isDefaultBilling", CustomerActionType.SetDefaultBillingAddress],
      ]
        .map(([flag, action]) =>
          this.getDefaultChangeAction(
            action as CustomerActionType,
            oldCustomer.addresses,
            newCustomer.addresses,
            flag as keyof InAddress,
          ),
        )
        .filter(Boolean) as MyCustomerUpdateAction[]),
    );
    return actions;
  },

  getDefaultChangeAction(
    type: CustomerActionType,
    oldAddresses: InAddress[],
    newAddresses: InAddress[],
    flag: keyof InAddress,
  ): MyCustomerUpdateAction | undefined {
    const oldDefault = oldAddresses.findIndex((a) => a[flag]);
    const newDefault = newAddresses.findIndex((a) => a[flag]);
    if (oldDefault !== newDefault) {
      let newAction;
      if (newDefault === -1) {
        newAction = {
          action: type,
          addressId: JSON.parse("null"),
        };
      } else {
        newAction = newAddresses[newDefault]?.id
          ? {
              action: type,
              addressId: newAddresses[newDefault]?.id,
            }
          : {
              action: type,
              addressKey: newAddresses[newDefault]?.key,
            };
      }
      return newAction as MyCustomerUpdateAction;
    }
    return undefined;
  },

  ensureAddressKeys(addresses: InAddress[]): InAddress[] {
    return addresses.map((addr, index) => {
      if (!addr.key) {
        return {
          ...addr,
          key: `auto-${index}-${Date.now()}`,
        };
      }
      return addr;
    });
  },

  updateCustomer(oldCustomer: InCustomer, newCustomer: Customer): InCustomer {
    return {
      version: newCustomer.version,
      id: newCustomer.id,
      email: newCustomer.email,
      password: oldCustomer.password,
      firstName: newCustomer.firstName ?? "",
      lastName: newCustomer.lastName ?? "",
      dateOfBirth: newCustomer.dateOfBirth ?? "",

      addresses: newCustomer.addresses.map(
        (address): InAddress => ({
          id: address.id,
          key: address.key ?? "",
          streetName: address.streetName ?? "",
          streetNumber: address.streetNumber ?? "",
          postalCode: address.postalCode ?? "",
          city: address.city ?? "",
          country: address.country ?? "",
          isDefaultShipping:
            newCustomer.defaultShippingAddressId === address.id,
          isDefaultBilling: newCustomer.defaultBillingAddressId === address.id,
        }),
      ),
    };
  },
};

export default customerRepository;
