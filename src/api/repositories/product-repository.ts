import {
  Asset,
  Attribute,
  Category,
  CategoryReference,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
} from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";
import { InCategory, InProduct } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import getProductList from "@/api/repositories/endpoints/product/get-product-list";
import { InAttributes } from "@/types/types";

const productRepository = {
  async getCategories(locale = SETTINGS.currentLang): Promise<InCategory[]> {
    try {
      const response = await getCategories();
      if (response) {
        return response.results.map((category) =>
          this.mapCategoryToInternal(category, locale),
        );
      }
    } catch (error) {
      throw error;
    }
    return [] as InCategory[];
  },
  async getCategoryByKey(
    key: string,
    locale = SETTINGS.currentLang,
  ): Promise<InCategory> {
    try {
      const response = await getCategoryByKey(key);
      if (!response) {
        throw new Error(`Category with key "${key}" not found.`);
      }
      return this.mapCategoryToInternal(response, locale);
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  },

  async getProductList(parameters = {}): Promise<InProduct[]> {
    try {
      const response: ProductProjectionPagedSearchResponse | undefined =
        await getProductList(parameters);

      if (!response || response.results.length === 0) {
        return [];
      }

      return response.results.map((product) =>
        this.mapProductToInternal(product),
      );
    } catch (error) {
      console.error("Error getting product list:", error);
      throw error;
    }
  },

  mapProductToInternal(product: ProductProjection): InProduct {
    return {
      id: product.id,
      key: product.key,
      name: product.name,
      description: product.description,
      images: product.masterVariant?.images ?? [],
      price: product.masterVariant?.price?.value.centAmount ?? 0,
      discountedPrice:
        product.masterVariant?.price?.discounted?.value.centAmount ?? undefined,
      isDiscounted: !!product.masterVariant?.price?.discounted,
      categories:
        product.categories?.map((cat: CategoryReference) => cat.id) ?? [],
      attributes:
        this.matAttributesArray(product.masterVariant?.attributes) ?? {},
      available: product.masterVariant?.availability?.isOnStock ?? false,
      sku: product.masterVariant?.sku,
      variantId: product.masterVariant?.id,
    };
  },

  mapAsset(
    asset: Asset,
    locale: string = SETTINGS.currentLang,
  ): InCategory["assets"][number] {
    return {
      id: asset.id,
      key: asset.key,
      name:
        asset.name?.[locale] ?? asset.name?.[SETTINGS.fallbackLanguage] ?? "",
      description:
        asset.description?.[locale] ??
        asset.description?.[SETTINGS.fallbackLanguage] ??
        "",
      sources: asset.sources.map((source) => ({
        key: source.key,
        uri: source.uri,
        dimensions: source.dimensions,
        contentType: source.contentType,
      })),
    };
  },

  mapCategoryToInternal(
    category: Category,
    locale: string = SETTINGS.currentLang,
  ): InCategory {
    return {
      id: category.id,
      key: category.key,
      name:
        category.name?.[locale] ??
        category.name?.[SETTINGS.fallbackLanguage] ??
        "",
      description:
        category.description?.[locale] ??
        category.description?.[SETTINGS.fallbackLanguage],
      assets:
        category.assets?.map((asset) => this.mapAsset(asset, locale)) ?? [],
    };
  },

  matAttributesArray(attributes: Attribute[] = []): InAttributes {
    return attributes.reduce((accumulator, attribute) => {
      accumulator[attribute.name] = attribute.value;
      return accumulator;
    }, {} as InAttributes);
  },
};

export default productRepository;
