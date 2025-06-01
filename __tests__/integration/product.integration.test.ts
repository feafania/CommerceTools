import { testKeys } from "./__mocks__/integration.mock";

import {
  getProductList,
  getProductAttributes,
  getProductTypes,
  getProductByKey,
  getProductTypeByKey,
  getCategories,
  getCategoryByKey,
} from "@/api/repositories/endpoints/product";
import productRepository from "@/api/repositories/product-repository";

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
    expect(response.key).toBe("dsh");
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

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    for (const product of products) {
      expect(product.categories).toContainEqual(expect.any(String));
    }
  });
});
