import productRepository from "@/api/repositories/product-repository";
import { InCategory, InProduct, InProductType } from "@/types/interfaces";
import { GetProductListParameters, InAttributes } from "@/types/types";

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
    } catch {
      return undefined;
    }
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

  async getProductByKey(key: string): Promise<InProduct | undefined> {
    try {
      return await productRepository.getProductByKey(key);
    } catch {
      return undefined;
    }
  }

  async getProductsByCategoryKey(categoryKey: string): Promise<InProduct[]> {
    try {
      return await productRepository.getProductsByCategoryKey(categoryKey);
    } catch {
      return [];
    }
  }

  async getProductTypes(): Promise<InProductType[]> {
    try {
      return await productRepository.getProductTypes();
    } catch {
      return [];
    }
  }

  async getProductTypeByKey(key: string): Promise<InProductType | undefined> {
    try {
      return await productRepository.getProductTypeByKey(key);
    } catch {
      return undefined;
    }
  }

  async getProductAttributes(productId: string): Promise<InAttributes> {
    try {
      return await productRepository.getProductAttributes(productId);
    } catch {
      return {};
    }
  }
}

const productService = new ProductService();
export default productService;
