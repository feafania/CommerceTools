import {
  discountCode,
  lineItemId,
  mockedBasketProduct,
  mockedCartApiResponse,
  mockedInternalCart,
} from "../__mocks__/basket.mock";
import { mockToken } from "../__mocks__/customer.mock";

import basketRepository from "@/api/repositories/basket-repository";
import MappingHelpers from "@/api/repositories/mapping-helpers";
import {
  addItemToCart,
  applyDiscountCodeToCart,
  createAnonymousCart,
  createCustomerCart,
  deleteAnonymousCart,
  deleteCustomerCart,
  getAnonymousCart,
  getCustomerCart,
  removeItemFromCart,
} from "@/api/repositories/endpoints/basket";
import { CountryCode, CurrencyCode } from "@/types/enum";

jest.mock("@/api/repositories/endpoints/basket");

jest.mock("@/api/repositories/mapping-helpers");

beforeEach(() => {
  jest.clearAllMocks();
  (MappingHelpers.toInternalCart as jest.Mock).mockReturnValue(
    mockedInternalCart,
  );
});

describe("basketRepository", () => {
  describe("getCart", () => {
    it("should return customer cart if token provided", async () => {
      (getCustomerCart as jest.Mock).mockResolvedValue(mockedCartApiResponse);

      const cart = await basketRepository.getCart(undefined, mockToken);

      expect(getCustomerCart).toHaveBeenCalledWith(mockToken);
      expect(MappingHelpers.toInternalCart).toHaveBeenCalledWith(
        mockedCartApiResponse,
      );
      expect(cart).toEqual(mockedInternalCart);
    });

    it("should return anonymous cart if cartId provided", async () => {
      (getAnonymousCart as jest.Mock).mockResolvedValue(mockedCartApiResponse);

      const cart = await basketRepository.getCart(mockedCartApiResponse.id);

      expect(getAnonymousCart).toHaveBeenCalledWith(mockedCartApiResponse.id);
      expect(cart).toEqual(mockedInternalCart);
    });

    it("should create new cart if none found", async () => {
      (getCustomerCart as jest.Mock).mockResolvedValue(JSON.parse("null"));
      (createAnonymousCart as jest.Mock).mockResolvedValue(
        mockedCartApiResponse,
      );

      const cart = await basketRepository.getCart(undefined, mockToken);

      expect(createAnonymousCart).toHaveBeenCalled();
      expect(cart).toEqual(mockedInternalCart);
    });
  });

  describe("createCart", () => {
    it("should create customer cart when token provided", async () => {
      (createCustomerCart as jest.Mock).mockResolvedValue(
        mockedCartApiResponse,
      );

      const cart = await basketRepository.createCart({
        currency: CurrencyCode.EUR,
        country: CountryCode.PL,
        customerToken: mockToken,
      });

      expect(createCustomerCart).toHaveBeenCalledWith(
        { currency: CurrencyCode.EUR, country: CountryCode.PL },
        mockToken,
      );
      expect(cart).toEqual(mockedInternalCart);
    });

    it("should create anonymous cart when no token provided", async () => {
      (createAnonymousCart as jest.Mock).mockResolvedValue(
        mockedCartApiResponse,
      );

      const cart = await basketRepository.createCart({
        currency: CurrencyCode.EUR,
        country: CountryCode.PL,
      });

      expect(createAnonymousCart).toHaveBeenCalledWith({
        currency: CurrencyCode.EUR,
        country: CountryCode.PL,
      });
      expect(cart).toEqual(mockedInternalCart);
    });
  });

  describe("addItemToCart", () => {
    it("should add item and map result", async () => {
      (addItemToCart as jest.Mock).mockResolvedValue(mockedCartApiResponse);

      const cart = await basketRepository.addItemToCart(
        mockedCartApiResponse.id,
        mockedBasketProduct.id,
        mockedBasketProduct.variantId,
        mockedBasketProduct.quantity,
        mockToken,
      );

      expect(addItemToCart).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        mockedBasketProduct.id,
        mockedBasketProduct.variantId,
        mockedBasketProduct.quantity,
        mockToken,
      );
      expect(cart).toEqual(mockedInternalCart);
    });
  });

  describe("removeItemFromCart", () => {
    it("should remove item and map result", async () => {
      (removeItemFromCart as jest.Mock).mockResolvedValue(
        mockedCartApiResponse,
      );

      const cart = await basketRepository.removeItemFromCart(
        mockedCartApiResponse.id,
        lineItemId,
        mockedBasketProduct.removedQuantity,
        mockToken,
      );

      expect(removeItemFromCart).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        lineItemId,
        mockedBasketProduct.removedQuantity,
        mockToken,
      );
      expect(cart).toEqual(mockedInternalCart);
    });
  });

  describe("applyDiscountCode", () => {
    it("should apply discount and return updated cart", async () => {
      (applyDiscountCodeToCart as jest.Mock).mockResolvedValue(
        mockedCartApiResponse,
      );

      const cart = await basketRepository.applyDiscountCode(
        mockedCartApiResponse.id,
        discountCode,
        mockedCartApiResponse.version,
        mockToken,
      );

      expect(applyDiscountCodeToCart).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        discountCode,
        mockedCartApiResponse.version,
        mockToken,
      );
      expect(cart).toEqual(mockedInternalCart);
    });
  });

  describe("deleteCart", () => {
    it("should delete customer cart if token provided", async () => {
      await basketRepository.deleteCart(mockedCartApiResponse.id, 1, mockToken);

      expect(deleteCustomerCart).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        mockedCartApiResponse.version,
        mockToken,
      );
    });

    it("should delete anonymous cart if no token", async () => {
      await basketRepository.deleteCart(
        mockedCartApiResponse.id,
        mockedCartApiResponse.version,
      );

      expect(deleteAnonymousCart).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        mockedCartApiResponse.version,
      );
    });
  });
});
