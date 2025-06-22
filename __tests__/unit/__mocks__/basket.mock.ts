import { CartDiscount, DiscountCode } from "@commercetools/platform-sdk";

export const mockedCartApiResponse = { id: "cart123", version: 1 };
export const mockedInternalCart = {
  id: mockedCartApiResponse.id,
  version: 1,
  items: [],
  currency: "EUR",
};
export const mockedBasketProduct = {
  id: "product123",
  variantId: 1,
  quantity: 2,
  removedQuantity: 1,
};

export const lineItemId = "lineItem456";
export const discountCode = "3YbN";

export const validDiscountCode: Partial<DiscountCode> = {
  id: "discount-1",
  version: 1,
  code: "WELCOME10",
  isActive: true,
  maxApplications: 10,
  maxApplicationsPerCustomer: 5,
  cartDiscounts: [
    {
      id: "cd-1",
      typeId: "cart-discount",
      obj: {
        id: "cd-1",
        version: 1,
        name: { en: "10% off" },
        description: { en: "10% off" },
        isActive: true,
        validFrom: new Date(Date.now() - 3_600_000).toISOString(),
        validUntil: new Date(Date.now() + 3_600_000).toISOString(),
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        value: {
          type: "relative",
          permyriad: 1000,
        },
        cartPredicate: "true",
        target: {
          type: "lineItems",
          predicate: "true",
        },
        sortOrder: "0.1",
        requiresDiscountCode: true,
        stackingMode: "Stacking",
        references: [],
        stores: [],
      } as CartDiscount,
    },
  ],
};

export const expiredDiscountCode: Partial<DiscountCode> = {
  ...validDiscountCode,
  id: "discount-2",
  code: "OLD",
  cartDiscounts: [
    {
      id: "cd-2",
      typeId: "cart-discount",
      obj: {
        id: "cd-2",
        version: 1,
        name: { en: "Old Discount" },
        description: { en: "Old Discount" },
        isActive: true,
        validFrom: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 10,
        ).toISOString(),
        validUntil: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 5,
        ).toISOString(),
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        value: {
          type: "relative",
          permyriad: 1000,
        },
        cartPredicate: "true",
        target: {
          type: "lineItems",
          predicate: "true",
        },
        sortOrder: "0.1",
        requiresDiscountCode: true,
        stackingMode: "Stacking",
        references: [],
        stores: [],
      } as CartDiscount,
    },
  ],
};

export const mockDiscountCodes = [
  {
    id: "1",
    code: "WELCOME10",
    cartDiscounts: [
      {
        obj: {
          id: "cd1",
          name: { en: "Discount 1" },
          description: { en: "Description 1" },
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 86_400_000).toISOString(),
          isActive: true,
        },
      },
    ],
  },
];
