import {
  discountCode,
  lineItemId,
  mockDiscountCodes,
  mockedInternalCart,
} from "../__mocks__/basket.mock";
import { mockSETTINGS } from "../../common.mock";

import authService from "@/api/services/auth-service";
import basketStore from "@/stores/basket-store";
import basketRepository from "@/api/repositories/basket-repository";
import basketService from "@/api/services/basket-service";
import showModalMessage from "@/components/modal-window/modal-window";
import productRepository from "@/api/repositories/product-repository";

jest.mock("@/api/repositories/product-repository");
jest.mock("@/api/services/auth-service");
jest.mock("@/stores/basket-store");
jest.mock("@/components/modal-window/modal-window");
jest.mock("@/assets/svg/eye-password-hide.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/eye-password-show.inline.svg", () => "mocked-svg");
jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));
jest.mock("@/api/repositories/basket-repository", () => ({
  __esModule: true,
  default: {
    createCart: jest.fn(),
    getCart: jest.fn(),
    removeItemFromCart: jest.fn(),
    addItemToCart: jest.fn(),
    recalculateCart: jest.fn(),
    changeItemQuantity: jest.fn(),
    applyDiscountCode: jest.fn(),
    deleteCart: jest.fn(),
    getActiveDiscountCodes: jest.fn(),
  },
}));

describe("getCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return cart from repository", async () => {
    const token = "fake-token";
    (authService.getToken as jest.Mock).mockResolvedValue(token);
    (authService.getAnonToken as jest.Mock).mockResolvedValue(token);
    (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
    (basketRepository.getCart as jest.Mock).mockResolvedValue(
      mockedInternalCart,
    );

    const result = await basketService.getCart();
    expect(result).toEqual(mockedInternalCart);
  });

  it("should return undefined on error", async () => {
    (authService.getToken as jest.Mock).mockRejectedValue(new Error("Error"));
    (authService.getAnonToken as jest.Mock).mockRejectedValue(
      new Error("Error"),
    );
    (basketStore.getCart as jest.Mock).mockReturnValue(JSON.parse("null"));
    (basketRepository.getCart as jest.Mock).mockResolvedValue(
      JSON.parse("null"),
    );
    const result = await basketService.getCart();
    expect(result).toBeUndefined();
  });
});

describe("BasketService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCart", () => {
    it("should create and return a cart", async () => {
      const token = "fake-token";
      (authService.getToken as jest.Mock).mockResolvedValue(token);
      (basketRepository.createCart as jest.Mock).mockResolvedValue(
        mockedInternalCart,
      );

      const result = await basketService.createCart();
      expect(result).toEqual(mockedInternalCart);
    });

    it("should show modal on error", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketRepository.createCart as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );

      const result = await basketService.createCart();
      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("addItemToCart", () => {
    it("should add item and return updated cart", async () => {
      const token = "token";
      const product = { id: "prod123" };

      (productRepository.getProductByKey as jest.Mock).mockResolvedValue(
        product,
      );
      (authService.getToken as jest.Mock).mockResolvedValue(token);
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.addItemToCart as jest.Mock).mockResolvedValue(
        mockedInternalCart,
      );

      const result = await basketService.addItemToCart("key1", 1, 2);
      expect(basketRepository.addItemToCart).toHaveBeenCalled();
      expect(basketStore.setCart).toHaveBeenCalledWith(mockedInternalCart);
      expect(result).toEqual(mockedInternalCart);
    });

    it("should show modal when product not found", async () => {
      (productRepository.getProductByKey as jest.Mock).mockResolvedValue(
        JSON.parse("null"),
      );

      const result = await basketService.addItemToCart("invalid", 1);
      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("removeItemFromCart", () => {
    it("should remove item and return updated cart", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.removeItemFromCart as jest.Mock).mockResolvedValue(
        mockedInternalCart,
      );

      const result = await basketService.removeItemFromCart(lineItemId, 1);
      expect(basketRepository.removeItemFromCart).toHaveBeenCalled();
      expect(basketStore.setCart).toHaveBeenCalledWith(mockedInternalCart);
      expect(result).toEqual(mockedInternalCart);
    });

    it("should show modal on error", async () => {
      (basketRepository.removeItemFromCart as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);

      const result = await basketService.removeItemFromCart(lineItemId, 1);
      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("applyDiscountCode", () => {
    it("should apply discount code and return updated cart", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.applyDiscountCode as jest.Mock).mockResolvedValue(
        mockedInternalCart,
      );

      const result = await basketService.applyDiscountCode(discountCode);
      expect(basketStore.setCart).toHaveBeenCalledWith(mockedInternalCart);
      expect(result).toEqual(mockedInternalCart);
    });

    it("should show modal on error", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.applyDiscountCode as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );

      const result = await basketService.applyDiscountCode("invalid-code");
      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("deleteCart", () => {
    it("should delete the cart and clear basket", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);

      await basketService.deleteCart();

      expect(basketRepository.deleteCart).toHaveBeenCalledWith(
        mockedInternalCart.id,
        mockedInternalCart.version,
        "token",
      );
      expect(basketStore.clearCart).toHaveBeenCalled();
    });

    it("should show modal on error", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.deleteCart as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );

      await basketService.deleteCart();
      expect(showModalMessage).toHaveBeenCalled();
    });
  });

  describe("recalculateCart", () => {
    it("should recalculate and return updated cart", async () => {
      const token = "token";
      (authService.getToken as jest.Mock).mockResolvedValue(token);
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.recalculateCart as jest.Mock).mockResolvedValue(
        mockedInternalCart,
      );

      const result = await basketService.recalculateCart(true);

      expect(basketRepository.recalculateCart).toHaveBeenCalledWith(
        mockedInternalCart.id,
        mockedInternalCart.version,
        true,
        token,
      );
      expect(basketStore.setCart).toHaveBeenCalledWith(mockedInternalCart);
      expect(result).toEqual(mockedInternalCart);
    });

    it("should show modal on error", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.recalculateCart as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );

      const result = await basketService.recalculateCart();

      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("changeItemQuantity", () => {
    it("should change item quantity and return updated cart", async () => {
      const token = "token";
      (authService.getToken as jest.Mock).mockResolvedValue(token);
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.changeItemQuantity as jest.Mock).mockResolvedValue(
        mockedInternalCart,
      );

      const result = await basketService.changeItemQuantity(lineItemId, 3);

      expect(basketRepository.changeItemQuantity).toHaveBeenCalledWith(
        mockedInternalCart.id,
        lineItemId,
        3,
        token,
      );
      expect(basketStore.setCart).toHaveBeenCalledWith(mockedInternalCart);
      expect(result).toEqual(mockedInternalCart);
    });

    it("should show modal on error", async () => {
      (authService.getToken as jest.Mock).mockResolvedValue("token");
      (basketStore.getCart as jest.Mock).mockReturnValue(mockedInternalCart);
      (basketRepository.changeItemQuantity as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );

      const result = await basketService.changeItemQuantity(lineItemId, 0);

      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("getActiveDiscountCodes", () => {
    it("should return active discount codes", async () => {
      (basketRepository.getActiveDiscountCodes as jest.Mock).mockResolvedValue(
        mockDiscountCodes,
      );

      const result = await basketService.getActiveDiscountCodes();

      expect(result).toEqual(mockDiscountCodes);
      expect(basketRepository.getActiveDiscountCodes).toHaveBeenCalledWith(
        mockSETTINGS.basketParameters.promoLimit,
      );
    });

    it("should return undefined when no discount codes found", async () => {
      const mockUndefined = undefined;
      (basketRepository.getActiveDiscountCodes as jest.Mock).mockResolvedValue(
        mockUndefined,
      );

      const result = await basketService.getActiveDiscountCodes();

      expect(result).toBeUndefined();
    });

    it("should handle unknown error and show only fallback", async () => {
      (basketRepository.getActiveDiscountCodes as jest.Mock).mockRejectedValue(
        new Error("fail"),
      );

      const result = await basketService.getActiveDiscountCodes();

      expect(showModalMessage).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
