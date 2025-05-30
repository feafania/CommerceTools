import productRepository from "@/api/repositories/product-repository";
import { InCategory } from "@/types/interfaces";

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
}

const productService = new ProductService();
export default productService;
