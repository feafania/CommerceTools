import {
  categoriesApiResponse,
  CategoryByKeyApiResponse,
  mockedGetCategories,
  mockedGetCategoryByKey,
} from "../__mocks__/product.mock";

import { InCategory } from "@/types/interfaces";
import productRepository from "@/api/repositories/product-repository";

jest.mock("@/api/repositories/endpoints/product/get-categories");
jest.mock("@/api/repositories/endpoints/product/get-category-by-key");

describe("product categories", () => {
  beforeEach(() => {
    mockedGetCategories.mockReset();
    mockedGetCategoryByKey.mockReset();
  });

  it("should fetch mapped categories from product repository", async () => {
    mockedGetCategories.mockResolvedValue(categoriesApiResponse);

    const categories: InCategory[] = await productRepository.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories).toHaveLength(2);

    expect(categories[0]).toMatchObject({
      id: "cat1",
      name: "Category 1",
    });

    expect(categories[1].assets.length).toBeGreaterThan(0);
  });

  it("should fetch category from product repository", async () => {
    mockedGetCategoryByKey.mockResolvedValue(CategoryByKeyApiResponse);

    const category: InCategory | undefined =
      await productRepository.getCategoryByKey("dhs");
    expect(Object.prototype.toString.call(category)).toBe("[object Object]");

    expect(category).toMatchObject({
      id: "cat1",
      key: "dhs",
    });
  });
});
