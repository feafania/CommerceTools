import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";

describe("product API", () => {
  it("should fetch raw categories from endpoint", async () => {
    const response = await getCategories();

    expect(response).toBeDefined();
    expect(response).toHaveProperty("results");
    if (!response) {
      throw new Error("Response is undefined");
    }
    expect(Array.isArray(response.results)).toBe(true);
  });

  it("should fetch a category from endpoint", async () => {
    const response = await getCategoryByKey("dsh");

    expect(response).toBeDefined();
    if (!response) {
      throw new Error("Response is undefined");
    }
    expect(response.key).toBe("dsh");
  });
});
