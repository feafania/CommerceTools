import { Asset, Category } from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";
import { InCategory } from "@/types/types";
import { SETTINGS } from "@/config/settings";

const fallbackLang = "en";

const productRepository = {
  async getCategories(locale = SETTINGS.currentLang): Promise<InCategory[]> {
    try {
      const response = await getCategories();
      if (response) {
        return response.body.results.map((category) =>
          this.mapCategoryToInternal(category, locale),
        );
      }
    } catch (error) {
      throw error;
    }
    return [] as InCategory[];
  },
  async getCategory(
    key: string,
    locale = SETTINGS.currentLang,
  ): Promise<InCategory | undefined> {
    try {
      const response = await getCategoryByKey(key);
      if (response) {
        return this.mapCategoryToInternal(response.body, locale);
      }
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
      name: asset.name?.[locale] ?? asset.name?.[fallbackLang] ?? "",
      description:
        asset.description?.[locale] ?? asset.description?.[fallbackLang],
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
      name: category.name?.[locale] ?? category.name?.[fallbackLang] ?? "",
      description:
        category.description?.[locale] ?? category.description?.[fallbackLang],
      assets:
        category.assets?.map((asset) => this.mapAsset(asset, locale)) ?? [],
    };
  },
};

export default productRepository;
