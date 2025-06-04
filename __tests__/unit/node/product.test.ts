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
} from "../__mocks__/product.mock";

jest.mock("@/api/repositories/endpoints/product/get-product-list-http");
jest.mock("@/api/repositories/endpoints/product/get-product-by-key");
jest.mock("@/api/repositories/endpoints/product/get-product-types");
jest.mock("@/api/repositories/endpoints/product/get-product-type-by-key");
jest.mock("@/api/repositories/endpoints/product/get-product-attributes");

import { InCategory } from "@/types/interfaces";
import productRepository from "@/api/repositories/product-repository";

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

    const products = await productRepository.getProductList();

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
    const expectedPrice = productRepository.mapProductToInternal(
      mockedProductProjection,
    ).price;

    expect(products[0].price).toBe(expectedPrice);
  });

  it("should fetch product by key and map to internal format", async () => {
    mockedGetProductByKey.mockResolvedValue(mockedProductProjection);

    const product = await productRepository.getProductByKey("key1");

    const expected = productRepository.mapProductToInternal(
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

    const products = await productRepository.getProductsByCategoryKey("dhs");

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
