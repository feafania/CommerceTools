import productRepository from "@/api/repositories/product-repository";
import { InCategory } from "@/types/types";

class ProductService {
  async getCategories(): Promise<InCategory[]> {
    const categories = await productRepository.getCategories();
    console.log(categories);
    return categories;
  }

  async getCategoryByKey(key: string): Promise<InCategory | undefined> {
    const category = await productRepository.getCategoryByKey(key);
    console.log(category);
    return category;
  }
}

const productService = new ProductService();
export default productService;
