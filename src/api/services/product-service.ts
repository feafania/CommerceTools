import productRepository from "@/api/repositories/product-repository";
import { InCategory, InProduct } from "@/types/interfaces";
import { GetProductListParameters } from "@/types/types";

class ProductService {
  async getCategories(): Promise<InCategory[]> {
    try {
      const categories = await productRepository.getCategories();
      return categories;
    } catch {
      return [] as InCategory[];
    }
  }

  async getCategoryByKey(key: string): Promise<InCategory | undefined> {
    try {
      const category = await productRepository.getCategoryByKey(key);
      return category;
    } catch {}
  }

  async getProductList(
    parameters: GetProductListParameters = {},
  ): Promise<InProduct[]> {
    try {
      const products = await productRepository.getProductList(parameters);
      return products;
    } catch {
      return [];
    }
  }
}

const productService = new ProductService();
export default productService;
