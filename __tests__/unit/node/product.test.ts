import { mockSETTINGS } from "../../common.mock";
import {
  categoriesApiResponse,
  CategoryByKeyApiResponse,
  mockedGetCategories,
  mockedGetCategoryByKey,
  mockedGetProductList,
  mockedGetProductByKey,
  mockedGetProductTypes,
  mockedGetProductTypeByKey,
  mockedGetProductAttributes,
  mockedProductProjection,
  setOfCategories,
  mockedProductList,
  mockedProductType,
  mockedAttributes,
  mockedGetProductById,
} from "../__mocks__/product.mock";

jest.mock("@/api/repositories/endpoints/product/get-product-list");
jest.mock("@/api/repositories/endpoints/product/get-product-by-key");
jest.mock("@/api/repositories/endpoints/product/get-product-by-id");
jest.mock("@/api/repositories/endpoints/product/get-product-types");
jest.mock("@/api/repositories/endpoints/product/get-product-type-by-key");
jest.mock("@/api/repositories/endpoints/product/get-product-attributes");
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

import { InCategory } from "@/types/interfaces";
import productRepository from "@/api/repositories/product-repository";
import MappingHelpers from "@/api/repositories/mapping-helpers";

jest.mock("@/api/repositories/endpoints/product/get-categories");
jest.mock("@/api/repositories/endpoints/product/get-category-by-key");

describe("product categories", () => {
  beforeEach(() => {
    mockedGetCategories.mockReset();
    mockedGetCategoryByKey.mockReset();
    mockedGetProductList.mockReset();
    mockedGetProductByKey.mockReset();
    mockedGetProductTypes.mockReset();
    mockedGetProductTypeByKey.mockReset();
    mockedGetProductById.mockReset();
    mockedGetProductAttributes.mockReset();
  });

  it("should fetch mapped categories from product repository", async () => {
    mockedGetCategories.mockResolvedValue(categoriesApiResponse);

    const categories: InCategory[] = await productRepository.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories).toHaveLength(2);

    expect(categories[0]).toMatchObject({
      id: setOfCategories[0].id,
      name: setOfCategories[0].name,
    });

    expect(categories[1].assets.length).toBeGreaterThan(0);
  });

  it("should fetch category from product repository", async () => {
    mockedGetCategoryByKey.mockResolvedValue(CategoryByKeyApiResponse);

    const category: InCategory | undefined =
      await productRepository.getCategoryByKey("dhs");
    expect(Object.prototype.toString.call(category)).toBe("[object Object]");

    expect(category).toMatchObject({
      id: setOfCategories[0].id,
      key: setOfCategories[0].key,
    });
  });

  it("should fetch product list and map to internal format", async () => {
    mockedGetProductList.mockResolvedValue({
      limit: 20,
      offset: 0,
      count: 1,
      total: 1,
      results: [mockedProductProjection],
    });

    const response = await productRepository.getProductList();
    expect(response).toBeDefined();
    const products = response.results;

    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: mockedProductProjection.id,
      key: mockedProductProjection.key,
      name: mockedProductProjection.name,
      discountedPrice: undefined,
      categories: mockedProductProjection.categories.map((cat) => cat.id),
      available: true,
      sku: mockedProductProjection.masterVariant.sku,
    });
    const expectedPrice = MappingHelpers.mapProductToInternal(
      mockedProductProjection,
    ).price;

    expect(products[0].price).toBe(expectedPrice);
  });

  it("should fetch product by key and map to internal format", async () => {
    mockedGetProductByKey.mockResolvedValue(mockedProductProjection);

    const product = await productRepository.getProductByKey(
      mockedProductProjection.key!,
    );

    const expected = MappingHelpers.mapProductToInternal(
      mockedProductProjection,
    );

    expect(product).toMatchObject({
      id: expected.id,
      key: expected.key,
      name: expected.name,
      description: expected.description,
      price: expected.price,
      discountedPrice: expected.discountedPrice,
      categories: expected.categories,
      available: expected.available,
      sku: expected.sku,
    });
  });

  it("should fetch product by id and map to internal format", async () => {
    mockedGetProductById.mockResolvedValue(mockedProductProjection);

    const product = await productRepository.getProductById(
      mockedProductProjection.id,
    );

    const expected = MappingHelpers.mapProductToInternal(
      mockedProductProjection,
    );

    expect(product).toMatchObject({
      id: expected.id,
      key: expected.key,
      name: expected.name,
      description: expected.description,
      price: expected.price,
      discountedPrice: expected.discountedPrice,
      categories: expected.categories,
      available: expected.available,
      sku: expected.sku,
    });
  });

  it("should fetch products by category key", async () => {
    mockedGetCategoryByKey.mockResolvedValue(CategoryByKeyApiResponse);

    mockedGetProductList.mockResolvedValue({
      limit: 20,
      offset: 0,
      count: 1,
      total: 1,
      results: [mockedProductList[0]],
    });

    const response = await productRepository.getProductsByCategoryKey("dhs");
    const products = response.results;

    expect(products).toHaveLength(1);
    expect(products[0].id).toBe(mockedProductList[0].id);

    expect(products[0].categories).toContain(
      mockedProductList[0].categories[0].id,
    );
  });

  it("should fetch product types and map to internal format", async () => {
    mockedGetProductTypes.mockResolvedValue([mockedProductType]);

    const productTypes = await productRepository.getProductTypes();
    expect(productTypes).toHaveLength(1);
    expect(productTypes[0].key).toBe(mockedProductType.key);
  });

  it("should fetch product type by key and map to internal format", async () => {
    mockedGetProductTypeByKey.mockResolvedValue(mockedProductType);

    const productType = await productRepository.getProductTypeByKey(
      mockedProductType.key!,
    );
    expect(productType).toBeDefined();
    expect(productType?.key).toBe(mockedProductType.key);
  });

  it("should fetch product attributes and map them", async () => {
    mockedGetProductAttributes.mockResolvedValue(mockedAttributes);

    const attributes = await productRepository.getProductAttributes("prod1");
    expect(attributes).toEqual({
      color: mockedAttributes[0].value,
      size: mockedAttributes[1].value,
    });
  });
});
