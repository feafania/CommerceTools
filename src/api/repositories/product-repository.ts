import { Asset, Category } from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";
import { InCategory } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";

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
      throw error;
    }
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
};

export default productRepository;
