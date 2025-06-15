import productRepository from "@/api/repositories/product-repository";
import {
  InCategory,
  InProduct,
  InProductType,
  InVariant,
  ProductSearchResult,
} from "@/types/interfaces";
import {
  GetProductListParameters,
  InAttributes,
  SimpleAttributes,
} from "@/types/types";

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
  ): Promise<ProductSearchResult> {
    try {
      const products = await productRepository.getProductList(parameters);
      return products;
    } catch {
      return productRepository.emptyProductResponse();
    }
  }

  async getProductByKey(key: string): Promise<InProduct | undefined> {
    try {
      return await productRepository.getProductByKey(key);
    } catch {
      return undefined;
    }
  }

  async getProductsByCategoryKey(
    categoryKey: string,
    parameters: GetProductListParameters = {},
  ): Promise<ProductSearchResult> {
    try {
      return await productRepository.getProductsByCategoryKey(
        categoryKey,
        parameters,
      );
    } catch {
      return productRepository.emptyProductResponse();
    }
  }

  async getProductTypes(): Promise<InProductType[]> {
    try {
      return await productRepository.getProductTypes();
    } catch {
      return [];
    }
  }

  async getProductTypeByKey(
    key: string | undefined,
  ): Promise<InProductType | undefined> {
    if (!key) return undefined;
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

  mapFilters(filter: SimpleAttributes): string[] {
    return productRepository.mapFilters(filter);
  }

  getVariantDescription(
    variant: InVariant | InProduct,
    productType: InProductType | undefined,
  ): string {
    return productRepository.getVariantDescription(variant, productType);
  }
}

const productService = new ProductService();
export default productService;
