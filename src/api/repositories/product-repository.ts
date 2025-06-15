import { ProductProjectionPagedSearchResponse } from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";
import {
  InCategory,
  InProduct,
  InProductType,
  InVariant,
  ProductSearchResult,
} from "@/types/interfaces";
import getProductList from "@/api/repositories/endpoints/product/get-product-list";
import {
  GetProductListParameters,
  InAttributes,
  SimpleAttributes,
} from "@/types/types";
import getProductAttributes from "@/api/repositories/endpoints/product/get-product-attributes";
import getProductTypes from "@/api/repositories/endpoints/product/get-product-types";
import getProductByKey from "@/api/repositories/endpoints/product/get-product-by-key";
import getProductTypeByKey from "@/api/repositories/endpoints/product/get-product-type-by-key";
import { SETTINGS } from "@/config/settings";
import { CurrencyCode } from "@/types/enum";
import MappingHelpers from "@/api/repositories/mapping-helpers";
// import getProductListHttp from "@/api/repositories/endpoints/product/get-product-list-http";

const productRepository = {
  async getCategories(): Promise<InCategory[]> {
    try {
      const response = await getCategories();
      if (!response) return [];

      const flatCategories = response.results.map((category) => {
        return MappingHelpers.mapCategoryToInternal(category);
      });

      const categoryMap = new Map<string, InCategory>();
      for (const cat of flatCategories) categoryMap.set(cat.id, cat);

      const rootCategories: InCategory[] = [];

      for (const category of flatCategories) {
        if (category.parentId && categoryMap.has(category.parentId)) {
          const parent = categoryMap.get(category.parentId)!;
          parent.children = parent.children || [];
          parent.children.push(category);
        } else {
          rootCategories.push(category);
        }
      }

      return rootCategories;
    } catch (error) {
      // console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async getCategoryByKey(
    key: string,
    withChildren = false,
  ): Promise<InCategory> {
    try {
      const response = await getCategoryByKey(key);
      if (!response) {
        throw new Error(`Category with key "${key}" not found.`);
      }

      const category = MappingHelpers.mapCategoryToInternal(response);

      if (withChildren) {
        const allCategories = await this.getCategories();
        const found = this.findCategoryById(category.id, allCategories);
        return found ?? category;
      }

      return category;
    } catch (error) {
      // console.error("Error getting categories:", error);
      throw error;
    }
  },

  async getProductList(
    parameters: GetProductListParameters = {},
    currency: CurrencyCode = SETTINGS.currentCurrency,
  ): Promise<ProductSearchResult> {
    try {
      const response: ProductProjectionPagedSearchResponse | undefined =
        await getProductList(
          MappingHelpers.mapToProductListParameters(parameters),
        );

      if (!response) {
        return this.emptyProductResponse();
      }

      const productResult = response.results.map((product) =>
        MappingHelpers.mapProductToInternal(product, currency),
      );
      return {
        limit: response?.limit,
        offset: response?.offset,
        count: response?.count,
        total: response?.total,
        results: productResult,
      };
    } catch {
      // console.error("Error getting product list:", error);
      return this.emptyProductResponse();
    }
  },

  async getProductByKey(
    key: string,
    currency: CurrencyCode = SETTINGS.currentCurrency,
  ): Promise<InProduct | undefined> {
    try {
      const response = await getProductByKey(key);
      return response
        ? MappingHelpers.mapProductToInternal(response, currency)
        : undefined;
    } catch (error) {
      // console.error("Error getting product by key:", error);
      throw error;
    }
  },

  async getProductsByCategoryKey(
    categoryKey: string,
    parameters: GetProductListParameters = {},
    currency: CurrencyCode = SETTINGS.currentCurrency,
  ): Promise<ProductSearchResult> {
    try {
      const category = await this.getCategoryByKey(categoryKey);
      const allCategories = await this.getCategories();

      if (category) {
        const categoryIds = await this.getAllCategoryIdsRecursive(
          category,
          allCategories,
        );

        const mappedParameters =
          MappingHelpers.mapToProductListParameters(parameters);

        const limit =
          mappedParameters.limit ?? SETTINGS.productListParameters.limit;
        const offset =
          mappedParameters.offset ?? SETTINGS.productListParameters.offset;

        const categoryFilter = `categories.id:${categoryIds.map((id) => `"${id}"`).join(",")}`;
        // const categoryFilter = mappedParameters.searchText
        //   ? `categories.id:${categoryIds.map((id) => `"${id}"`).join(",")}`
        //   : `categories(id in (${categoryIds.map((id) => `"${id}"`).join(",")}))`;
        const combinedFilters = [
          ...(mappedParameters.filters ?? []),
          categoryFilter,
        ];

        const response = await getProductList({
          ...mappedParameters,
          limit,
          offset,
          filters: combinedFilters,
        });

        if (!response) {
          return this.emptyProductResponse();
        }

        const productResult = response.results.map((product) =>
          MappingHelpers.mapProductToInternal(product, currency),
        );
        return {
          limit: response.limit,
          offset: response.offset,
          count: response.count,
          total: response.total,
          results: productResult,
        };
      }

      return this.emptyProductResponse();
    } catch {
      // console.error("Error getting products by category key:", error);
      return this.emptyProductResponse();
    }
  },

  async getProductTypes(): Promise<InProductType[]> {
    try {
      const response = await getProductTypes();
      return response.map((productType) =>
        MappingHelpers.mapProductTypeToInternal(productType),
      );
    } catch (error) {
      // console.error("Error getting product types:", error);
      throw error;
    }
  },

  async getProductTypeByKey(key: string): Promise<InProductType | undefined> {
    try {
      const response = await getProductTypeByKey(key);
      return response
        ? MappingHelpers.mapProductTypeToInternal(response)
        : undefined;
    } catch (error) {
      // console.error("Error getting product type by key:", error);
      throw error;
    }
  },

  async getProductAttributes(productId: string): Promise<InAttributes> {
    try {
      const attributes = await getProductAttributes(productId);
      return MappingHelpers.mapAttributesArray(attributes);
    } catch (error) {
      // console.error("Error getting product attributes:", error);
      throw error;
    }
  },

  async getAllCategoryIdsRecursive(
    category: InCategory,
    allCategories: InCategory[],
  ): Promise<string[]> {
    const result = [category.id];
    const children = allCategories.filter(
      (cat) => cat.parentId === category.id,
    );

    for (const child of children) {
      const childIds = await this.getAllCategoryIdsRecursive(
        child,
        allCategories,
      );
      result.push(...childIds);
    }

    return result;
  },

  findCategoryById(
    id: string,
    categories: InCategory[],
  ): InCategory | undefined {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      if (cat.children?.length) {
        const found = this.findCategoryById(id, cat.children);
        if (found) return found;
      }
    }
  },

  emptyProductResponse() {
    return {
      limit: 0,
      offset: 0,
      count: 0,
      total: 0,
      results: [],
    };
  },

  mapFilters(filter: SimpleAttributes): string[] {
    return MappingHelpers.mapFilters(filter);
  },

  getVariantDescription(
    variant: InVariant | InProduct,
    productType: InProductType | undefined,
  ): string {
    return MappingHelpers.getVariantDescription(variant, productType);
  },
};

export default productRepository;
