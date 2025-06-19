import { mockSETTINGS } from "../common.mock";

import { testKeys } from "./__mocks__/integration.mock";

import {
  getProductList,
  getProductAttributes,
  getProductTypes,
  getProductByKey,
  getProductTypeByKey,
  getCategories,
  getCategoryByKey,
  getProductById,
} from "@/api/repositories/endpoints/product";
import productRepository from "@/api/repositories/product-repository";

jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));

jest.mock("@/api/repositories/mapping-helpers", () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});
jest.mock("@/assets/svg/eye-password-hide.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/eye-password-show.inline.svg", () => "mocked-svg");

describe("Product API endpoints", () => {
  it("should fetch raw categories", async () => {
    const response = await getCategories();

    expect(response).toBeDefined();
    expect(response).toHaveProperty("results");
    if (!response) return;
    expect(Array.isArray(response.results)).toBe(true);
  });

  it("should fetch category by key", async () => {
    const response = await getCategoryByKey(testKeys.category);

    expect(response).toBeDefined();
    if (!response) return;
    expect(response.key).toBe(testKeys.category);
  });

  it("should fetch product list", async () => {
    const response = await getProductList();

    expect(response).toBeDefined();
    expect(response).toHaveProperty("results");
    if (!response) return;
    expect(Array.isArray(response.results)).toBe(true);
  });

  it("should fetch product attributes by product ID", async () => {
    const productListResponse = await getProductList();
    expect(productListResponse).toBeDefined();
    if (!productListResponse || productListResponse.results.length === 0) {
      throw new Error("No products found to test attributes.");
    }

    const productId = productListResponse.results[0].id;
    const attributesResponse = await getProductAttributes(productId);

    expect(attributesResponse).toBeDefined();
    expect(Array.isArray(attributesResponse)).toBe(true);
  });

  it("should fetch all product types", async () => {
    const response = await getProductTypes();

    expect(response).toBeDefined();
    expect(Array.isArray(response)).toBe(true);
  });

  it("should fetch product by key", async () => {
    const response = await getProductByKey(testKeys.product);

    expect(response).toBeDefined();
    if (!response) return;
    expect(response.key).toBe(testKeys.product);
  });

  it("should fetch product by id", async () => {
    const response = await getProductById(testKeys.productId);

    expect(response).toBeDefined();
    if (!response) return;
    expect(response.id).toBe(testKeys.productId);
  });

  it("should fetch product type by key", async () => {
    const response = await getProductTypeByKey(testKeys.productType);

    expect(response).toBeDefined();
    if (!response) return;
    expect(response.key).toBe(testKeys.productType);
  });

  it("should fetch products by category key", async () => {
    const categoryKey = testKeys.category;
    const products =
      await productRepository.getProductsByCategoryKey(categoryKey);

    expect(products.results).toBeDefined();
    expect(Array.isArray(products.results)).toBe(true);
    for (const product of products.results) {
      expect(product.categories).toContainEqual(expect.any(String));
    }
  });
});
