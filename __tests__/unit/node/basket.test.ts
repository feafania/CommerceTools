import { mockSETTINGS } from "../../common.mock";
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
  changeCartItemQuantity,
  createAnonymousCart,
  createCustomerCart,
  deleteAnonymousCart,
  deleteCustomerCart,
  getAnonymousCart,
  getCustomerCart,
  removeItemFromCart,
  recalculateCart,
} from "@/api/repositories/endpoints/basket";
import { CountryCode, CurrencyCode } from "@/types/enum";

jest.mock("@/api/repositories/mapping-helpers");

jest.mock("@/api/repositories/endpoints/basket", () => ({
  addItemToCart: jest.fn(),
  applyDiscountCodeToCart: jest.fn(),
  createAnonymousCart: jest.fn(),
  createCustomerCart: jest.fn(),
  deleteAnonymousCart: jest.fn(),
  deleteCustomerCart: jest.fn(),
  getAnonymousCart: jest.fn(),
  getCustomerCart: jest.fn(),
  removeItemFromCart: jest.fn(),
  changeCartItemQuantity: jest.fn(),
  recalculateCart: jest.fn(),
}));
jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));
jest.mock("@/pages/catalog/catalog", () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});
jest.mock("@/utils/page-render", () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});
jest.mock("@/config/routes", () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});
jest.mock("@/components/search-button/search-button", () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});
jest.mock("@/components/layout/header/header", () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});

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

  describe("recalculateCart", () => {
    it("should recalculate cart and map the result", async () => {
      (recalculateCart as jest.Mock).mockResolvedValue(mockedCartApiResponse);

      const cart = await basketRepository.recalculateCart(
        mockedCartApiResponse.id,
        mockedCartApiResponse.version,
        true,
        mockToken,
      );

      expect(recalculateCart).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        mockedCartApiResponse.version,
        true,
        mockToken,
      );
      expect(MappingHelpers.toInternalCart).toHaveBeenCalledWith(
        mockedCartApiResponse,
      );
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

  describe("changeItemQuantity", () => {
    it("should change item quantity and return updated cart", async () => {
      (changeCartItemQuantity as jest.Mock).mockResolvedValue(
        mockedCartApiResponse,
      );

      const cart = await basketRepository.changeItemQuantity(
        mockedCartApiResponse.id,
        lineItemId,
        3,
        mockToken,
      );

      expect(changeCartItemQuantity).toHaveBeenCalledWith(
        mockedCartApiResponse.id,
        lineItemId,
        3,
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
