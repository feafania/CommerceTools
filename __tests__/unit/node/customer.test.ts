import {
  mockToken,
  newTestCustomer,
  oldTestCustomer,
  updatedResponse,
} from "../__mocks__/customer.mock";

import { CustomerActionType } from "@/types/api-types";
import customerRepository from "@/api/repositories/customer-repository";
import { findDefaultAddress } from "@/utils/helpers";
import { AddressType } from "@/types/enum";
import { changeCustomerPassword } from "@/api/repositories/endpoints/customer/change-password";
import MappingHelpers from "@/api/repositories/mapping-helpers";
import { updateCustomer } from "@/api/repositories/endpoints/customer/update-customer";

jest.mock("@/api/repositories/endpoints/customer/change-password", () => ({
  changeCustomerPassword: jest.fn(),
}));

jest.mock("@/api/repositories/mapping-helpers", () => ({
  __esModule: true,
  default: {
    updateCustomer: jest.fn(),
    toInternalCustomer: jest.fn(),
  },
}));

jest.mock("@/api/repositories/endpoints/customer/update-customer", () => ({
  updateCustomer: jest.fn().mockResolvedValue(updatedResponse),
}));

describe("customerRepository.update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MappingHelpers.updateCustomer as jest.Mock).mockResolvedValue(
      updatedResponse,
    );
  });

  it("should generate correct update actions and return updated customer", async () => {
    const result = await customerRepository.update(
      oldTestCustomer,
      newTestCustomer,
      mockToken,
    );

    expect(updateCustomer).toHaveBeenCalledWith(
      1,
      expect.arrayContaining([
        {
          action: CustomerActionType.ChangeEmail,
          email: "john.doe@example.com",
        },
        { action: CustomerActionType.SetFirstName, firstName: "Johnny" },
        expect.objectContaining({
          action: CustomerActionType.SetDefaultBillingAddress,
          addressId: "addr-1", // без addressKey
        }),
        expect.objectContaining({ action: CustomerActionType.AddAddress }),
        expect.objectContaining({
          action: CustomerActionType.SetDefaultShippingAddress,
        }),
      ]),
      mockToken,
    );

    expect(result).toEqual(
      expect.objectContaining({
        email: "john.doe@example.com",
        firstName: "Johnny",
        version: 2,
        addresses: expect.any(Array),
      }),
    );
  });

  it("should add new address if it has no id", async () => {
    const newAddress = {
      streetName: "New Street",
      postalCode: "99999",
      city: "Newtown",
      country: "DE",
      isDefaultShipping: true,
      isDefaultBilling: false,
    };

    const modifiedCustomer = {
      ...newTestCustomer,
      addresses: [...newTestCustomer.addresses, newAddress],
    };

    const result = await customerRepository.update(
      oldTestCustomer,
      modifiedCustomer,
      mockToken,
    );

    expect(updateCustomer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.arrayContaining([
        expect.objectContaining({
          action: CustomerActionType.AddAddress,
          address: expect.objectContaining({ city: "Newtown" }),
        }),
      ]),
      mockToken,
    );

    expect(result?.addresses.length).toBe(updatedResponse.addresses.length);
  });

  it("should remove address if it no longer exists in new data", async () => {
    const modifiedCustomer = {
      ...newTestCustomer,
      addresses: [], // no addresses at all
    };

    const result = await customerRepository.update(
      oldTestCustomer,
      modifiedCustomer,
      mockToken,
    );

    expect(updateCustomer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.arrayContaining([
        {
          action: CustomerActionType.RemoveAddress,
          addressId: oldTestCustomer.addresses[0].id,
        },
      ]),
      mockToken,
    );

    expect(result?.addresses).toBeDefined();
  });

  it("should change an existing address if data differs", async () => {
    const modifiedCustomer = {
      ...newTestCustomer,
      addresses: [
        {
          ...newTestCustomer.addresses[0],
          streetName: "New Street 1",
        },
        {
          ...newTestCustomer.addresses[1],
          postalCode: "33333",
        },
      ],
    };

    await customerRepository.update(
      oldTestCustomer,
      modifiedCustomer,
      mockToken,
    );
    expect(updateCustomer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.arrayContaining([
        {
          action: CustomerActionType.ChangeAddress,
          addressId: newTestCustomer.addresses[0].id,
          address: expect.objectContaining({ streetName: "New Street 1" }),
        },
      ]),
      mockToken,
    );
  });

  it("should update default shipping address", async () => {
    const modifiedCustomer = {
      ...oldTestCustomer,
      addresses: [
        {
          ...oldTestCustomer.addresses[0],
          isDefaultShipping: false,
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

    await customerRepository.update(
      oldTestCustomer,
      modifiedCustomer,
      mockToken,
    );

    const newDefault = findDefaultAddress(
      modifiedCustomer.addresses,
      AddressType.Shipping,
    );

    expect(updateCustomer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.arrayContaining([
        expect.objectContaining({
          action: CustomerActionType.SetDefaultShippingAddress,
          ...(newDefault?.id
            ? { addressId: newDefault.id }
            : { addressKey: newDefault?.key }),
        }),
      ]),
      mockToken,
    );
  });

  it("should update default billing address", async () => {
    const modifiedCustomer = {
      ...oldTestCustomer,
      addresses: [
        {
          ...oldTestCustomer.addresses[0],
          isDefaultBilling: false,
        },
        {
          key: "work",
          streetName: "Workplace Blvd",
          postalCode: "22222",
          city: "Worktown",
          country: "DE",
          isDefaultShipping: false,
          isDefaultBilling: true,
        },
      ],
    };

    await customerRepository.update(
      oldTestCustomer,
      modifiedCustomer,
      mockToken,
    );

    const newDefault = findDefaultAddress(
      modifiedCustomer.addresses,
      AddressType.Billing,
    );
    expect(updateCustomer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.arrayContaining([
        expect.objectContaining({
          action: CustomerActionType.SetDefaultBillingAddress,
          ...(newDefault?.id
            ? { addressId: newDefault.id }
            : { addressKey: newDefault?.key }),
        }),
      ]),
      mockToken,
    );
  });

  it("should not call updateCustomer if there are no changes", async () => {
    await customerRepository.update(
      oldTestCustomer,
      oldTestCustomer,
      mockToken,
    );

    expect(MappingHelpers.updateCustomer).not.toHaveBeenCalled();
  });

  it("should not change addresses if only the order changed", async () => {
    const reorderedCustomer = {
      ...oldTestCustomer,
      addresses: [...oldTestCustomer.addresses].reverse(),
    };

    await customerRepository.update(
      oldTestCustomer,
      reorderedCustomer,
      mockToken,
    );

    expect(MappingHelpers.updateCustomer).not.toHaveBeenCalled();
  });

  it("should throw if version is missing", async () => {
    const noVersion = { ...oldTestCustomer, version: undefined };
    await expect(
      customerRepository.update(noVersion, newTestCustomer, mockToken),
    ).rejects.toThrow("Customer version is missing.");
  });

  it("should rethrow API errors", async () => {
    (MappingHelpers.updateCustomer as jest.Mock).mockRejectedValueOnce(
      new Error("API error"),
    );

    await expect(
      customerRepository.update(oldTestCustomer, newTestCustomer, mockToken),
    ).rejects.toThrow("API error");
  });
});

describe("customerRepository.changePassword", () => {
  const mockVersion = 2;
  const currentPassword = "123456";
  const newPassword = "newpass123";
  const token = "mocked-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call changeCustomerPassword and return updated customer", async () => {
    (changeCustomerPassword as jest.Mock).mockResolvedValue(updatedResponse);
    const expectedCustomer = {
      id: updatedResponse.id,
      email: updatedResponse.email,
    };

    (MappingHelpers.toInternalCustomer as jest.Mock).mockReturnValue(
      expectedCustomer,
    );

    const result = await customerRepository.changePassword(
      mockVersion,
      currentPassword,
      newPassword,
      token,
    );

    expect(changeCustomerPassword).toHaveBeenCalledWith(
      mockVersion,
      currentPassword,
      newPassword,
      token,
    );

    expect(MappingHelpers.toInternalCustomer).toHaveBeenCalledWith(
      updatedResponse,
      newPassword,
    );

    expect(result).toEqual(expectedCustomer);
  });

  it("should throw if API call fails", async () => {
    (changeCustomerPassword as jest.Mock).mockRejectedValue(
      new Error("Change password failed"),
    );

    await expect(
      customerRepository.changePassword(
        mockVersion,
        currentPassword,
        newPassword,
        token,
      ),
    ).rejects.toThrow("Change password failed");
  });

  it("should return undefined if API returns undefined", async () => {
    (changeCustomerPassword as jest.Mock).mockResolvedValue(JSON.parse("null"));

    const result = await customerRepository.changePassword(
      mockVersion,
      currentPassword,
      newPassword,
      token,
    );

    expect(result).toBeUndefined();
    expect(MappingHelpers.toInternalCustomer).not.toHaveBeenCalled();
  });
});
