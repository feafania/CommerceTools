import { mockSETTINGS } from "../../common.mock";
import {
  mockedInternalProductList,
  mappedInProduct,
  mappedInProductType,
  mappedInAttributeObject,
  mockedCategories,
  productRepositoryResponse,
  emptyProductResult,
  mockAttributes,
  mockAttributesExpected,
} from "../__mocks__/product.mock";

import productService from "@/api/services/product-service";
import productRepository from "@/api/repositories/product-repository";
import { SimpleAttributes } from "@/types/types";

jest.mock("@/api/repositories/product-repository");
jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));

jest.mock("@/assets/svg/eye-password-hide.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/eye-password-show.inline.svg", () => "mocked-svg");

const mockedRepository = productRepository as jest.Mocked<
  typeof productRepository
>;

describe("ProductService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategories", () => {
    it("should return list of categories", async () => {
      mockedRepository.getCategories.mockResolvedValue(mockedCategories);

      const result = await productService.getCategories();
      expect(result).toEqual(mockedCategories);
      expect(mockedRepository.getCategories).toHaveBeenCalled();
    });

    it("should return empty array on error", async () => {
      mockedRepository.getCategories.mockRejectedValue(new Error("Error"));

      const result = await productService.getCategories();
      expect(result).toEqual([]);
    });
  });

  describe("getCategoryByKey", () => {
    it("should return category by key", async () => {
      expect(mockedCategories[0]).toBeDefined();

      mockedRepository.getCategoryByKey.mockResolvedValue(mockedCategories[0]);

      const result = await productService.getCategoryByKey(
        mockedCategories[0].key!,
      );
      expect(result).toEqual(mockedCategories[0]);
    });

    it("should return undefined on error", async () => {
      mockedRepository.getCategoryByKey.mockRejectedValue(new Error("Error"));

      const result = await productService.getCategoryByKey("invalid");
      expect(result).toBeUndefined();
    });
  });

  describe("getProductList", () => {
    it("should return list of products", async () => {
      mockedRepository.getProductList.mockResolvedValue(
        productRepositoryResponse,
      );

      const result = await productService.getProductList();
      expect(result.results).toEqual(mockedInternalProductList);
    });

    it("should return empty array on error", async () => {
      mockedRepository.emptyProductResponse.mockReturnValue(emptyProductResult);
      mockedRepository.getProductList.mockRejectedValue(new Error("Error"));

      const result = await productService.getProductList();
      expect(result.results).toEqual([]);
    });
  });

  describe("getProductByKey", () => {
    it("should return product by key", async () => {
      mockedRepository.getProductByKey.mockResolvedValue(mappedInProduct);

      const result = await productService.getProductByKey("key1");
      expect(result).toEqual(mappedInProduct);
    });

    it("should return undefined on error", async () => {
      mockedRepository.getProductByKey.mockRejectedValue(new Error("Error"));

      const result = await productService.getProductByKey("invalid");
      expect(result).toBeUndefined();
    });
  });

  describe("getProductsByCategoryKey", () => {
    it("should return products filtered by category key", async () => {
      mockedRepository.getProductsByCategoryKey.mockResolvedValue(
        productRepositoryResponse,
      );

      const response = await productService.getProductsByCategoryKey("dhs");
      const result = response.results;
      expect(result).toEqual(mockedInternalProductList);
    });

    it("should return empty array on error", async () => {
      mockedRepository.getProductsByCategoryKey.mockRejectedValue(
        new Error("Error"),
      );
      mockedRepository.emptyProductResponse.mockReturnValue(emptyProductResult);

      const result = await productService.getProductsByCategoryKey("invalid");
      expect(result.results).toEqual([]);
    });
  });

  describe("getProductTypes", () => {
    it("should return product types", async () => {
      mockedRepository.getProductTypes.mockResolvedValue([mappedInProductType]);

      const result = await productService.getProductTypes();
      expect(result).toEqual([mappedInProductType]);
    });

    it("should return empty array on error", async () => {
      mockedRepository.getProductTypes.mockRejectedValue(new Error("Error"));

      const result = await productService.getProductTypes();
      expect(result).toEqual([]);
    });
  });

  describe("getProductTypeByKey", () => {
    it("should return product type by key", async () => {
      mockedRepository.getProductTypeByKey.mockResolvedValue(
        mappedInProductType,
      );

      const result = await productService.getProductTypeByKey("prodType1");
      expect(result).toEqual(mappedInProductType);
    });

    it("should return undefined on error", async () => {
      mockedRepository.getProductTypeByKey.mockRejectedValue(
        new Error("Error"),
      );

      const result = await productService.getProductTypeByKey("invalid");
      expect(result).toBeUndefined();
    });
  });

  describe("getProductAttributes", () => {
    it("should return product attributes", async () => {
      mockedRepository.getProductAttributes.mockResolvedValue(
        mappedInAttributeObject,
      );

      const result = await productService.getProductAttributes("prod1");
      expect(result).toEqual(mappedInAttributeObject);
    });

    it("should return empty object on error", async () => {
      mockedRepository.getProductAttributes.mockRejectedValue(
        new Error("Error"),
      );

      const result = await productService.getProductAttributes("invalid");
      expect(result).toEqual({});
    });
  });
});

describe("mapFilters", () => {
  it("should call repository mapFilters and return mapped filters", () => {
    const input: SimpleAttributes = mockAttributes;
    const expected = mockAttributesExpected;

    const mockFunction = jest.fn().mockReturnValue(expected);
    mockedRepository.mapFilters = mockFunction;

    const result = productService.mapFilters(input);

    expect(mockFunction).toHaveBeenCalledWith(input);
    expect(result).toEqual(expected);
  });

  it("should return empty array when mapFilters returns empty", () => {
    const input: SimpleAttributes = {};
    const expected: string[] = [];

    const mockFunction = jest.fn().mockReturnValue(expected);
    mockedRepository.mapFilters = mockFunction;

    const result = productService.mapFilters(input);

    expect(mockFunction).toHaveBeenCalledWith(input);
    expect(result).toEqual(expected);
  });
});
