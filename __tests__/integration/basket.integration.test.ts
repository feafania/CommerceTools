import { Cart, DiscountCode } from "@commercetools/platform-sdk";
import { v4 as uuidv4 } from "uuid";

import { mockSETTINGS } from "../common.mock";

import {
  cartDraft,
  testKeys,
  testLoginDraft,
} from "./__mocks__/integration.mock";

import {
  addItemToCart,
  applyDiscountCodeToCart,
  changeCartItemQuantity,
  createCustomerCart,
  deleteCustomerCart,
  getActiveDiscountCodes,
  getCartUpdateApi,
  getCustomerCart,
  recalculateCart,
  removeItemFromCart,
} from "@/api/repositories/endpoints/basket";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";
import getMe from "@/api/repositories/endpoints/customer/get-me";
import getAnonToken from "@/api/repositories/endpoints/token/get-anonymous-token";

jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));

describe("Cart API endpoints", () => {
  let anonymousCart: Cart;
  let token: string;
  let anonymousToken: string;
  let customerCart: Cart;
  beforeAll(async () => {
    const anon = await getAnonToken(uuidv4());
    if (!anon?.access_token) {
      throw new Error("Failed to obtain anonymous access token");
    }
    anonymousToken = anon.access_token!;

    const createdCart = await createCustomerCart(cartDraft, anonymousToken);
    if (!createdCart) throw new Error("Failed to create anonymous cart");
    anonymousCart = createdCart;

    const tokenResponse = await getCustomerToken(
      testLoginDraft.email,
      testLoginDraft.password,
    );
    if (!tokenResponse?.access_token)
      throw new Error("Failed to obtain customer token");
    token = tokenResponse.access_token;

    const me = await getMe(token);
    if (!me?.id) throw new Error("Failed to fetch customer data");
    testKeys.customerId = me.id;

    const createdCustomerCart = await createCustomerCart(cartDraft, token);
    if (!createdCustomerCart) throw new Error("Failed to create customer cart");
    customerCart = createdCustomerCart;
  });

  it("should add an item to the anonymous cart", async () => {
    const response = await addItemToCart(
      anonymousCart.id,
      testKeys.productId,
      testKeys.productVariantId,
      1,
      anonymousToken,
    );
    expect(response).toBeDefined();
    expect(response?.lineItems.length).toBeGreaterThan(0);
    anonymousCart = response!;
  });

  it("should add an item to the customer cart", async () => {
    const response = await addItemToCart(
      customerCart.id,
      testKeys.productId,
      testKeys.productVariantId,
      1,
      token,
    );
    expect(response).toBeDefined();
    expect(response?.lineItems.length).toBeGreaterThan(0);
    customerCart = response!;
  });

  it("should apply discount code to customer cart", async () => {
    const response = await applyDiscountCodeToCart(
      customerCart.id,
      testKeys.discountCode,
      customerCart.version,
      token,
    );
    expect(response).toBeDefined();
    expect(response?.discountCodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ discountCode: expect.any(Object) }),
      ]),
    );
    customerCart = response;
  });

  it("should update the anonymous cart using getCartUpdateApi", async () => {
    const { cart, post } = await getCartUpdateApi(
      anonymousCart.id,
      anonymousToken,
    );
    const updated = await post({
      body: {
        version: cart.version,
        actions: [],
      },
    }).execute();
    expect(updated.body).toBeDefined();
    expect(updated.body.version).toBeGreaterThan(cart.version);
    anonymousCart = updated.body;
  });

  it("should get anonymous cart by ID", async () => {
    const response = await getCustomerCart(anonymousToken);
    expect(response).toBeDefined();
    expect(response?.id).toBe(anonymousCart.id);
  });

  it("should get customer cart using token", async () => {
    const response = await getCustomerCart(token);

    expect(response).toBeDefined();
    expect(response?.customerId).toBe(testKeys.customerId);
  });

  it("should remove item from customer cart", async () => {
    const lineItem = customerCart.lineItems[0];
    const updatedCart = await removeItemFromCart(
      customerCart.id,
      lineItem.id,
      1,
      token,
    );
    expect(updatedCart).toBeDefined();
    expect(updatedCart!.lineItems.length).toBeLessThan(
      customerCart.lineItems.length,
    );
    customerCart = updatedCart!;
  });

  it("should delete anonymous cart", async () => {
    await expect(
      deleteCustomerCart(
        anonymousCart.id,
        anonymousCart.version,
        anonymousToken,
      ),
    ).resolves.toBeUndefined();
  });

  it("should delete customer cart", async () => {
    await expect(
      deleteCustomerCart(customerCart.id, customerCart.version, token),
    ).resolves.toBeUndefined();
  });

  it("should change quantity of an item in the customer cart", async () => {
    if (customerCart.lineItems.length === 0) {
      const response = await addItemToCart(
        customerCart.id,
        testKeys.productId,
        testKeys.productVariantId,
        1,
        token,
      );
      customerCart = response!;
    }

    const lineItem = customerCart.lineItems[0];

    const updatedCart = await changeCartItemQuantity(
      customerCart.id,
      lineItem.id,
      2,
      token,
    );

    expect(updatedCart).toBeDefined();
    const updatedItem = updatedCart!.lineItems.find(
      (li) => li.id === lineItem.id,
    );
    expect(updatedItem?.quantity).toBe(2);

    customerCart = updatedCart!;
  });

  it("should recalculate the customer cart with updateProductData", async () => {
    const updatedCart = await recalculateCart(
      customerCart.id,
      customerCart.version,
      true,
      token,
    );

    expect(updatedCart).toBeDefined();
    expect(updatedCart!.version).toBeGreaterThan(customerCart.version);
    customerCart = updatedCart!;
  });
});

describe("getActiveDiscountCodes", () => {
  it("should return an array of active discount codes with expanded cart discounts", async () => {
    const limit = 10;
    const result = await getActiveDiscountCodes(limit);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    for (const code of result as DiscountCode[]) {
      expect(code.isActive).toBe(true);
      expect(code.cartDiscounts?.length).toBeGreaterThan(0);
      for (const cartDiscountReference of code.cartDiscounts) {
        expect(cartDiscountReference.obj).toBeDefined();
        expect(cartDiscountReference.obj?.id).toBeDefined();
        expect(cartDiscountReference.obj?.isActive).toBeDefined();
      }
    }
  });
});
