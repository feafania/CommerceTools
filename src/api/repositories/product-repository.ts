import {
  Asset,
  Attribute,
  AttributeDefinition,
  Category,
  CategoryReference,
  Price,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
  ProductType,
} from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";
import {
  InAttributeDefinition,
  InCategory,
  InProduct,
  InProductType,
  ProductSearchResult,
} from "@/types/interfaces";
import getProductList from "@/api/repositories/endpoints/product/get-product-list";
import {
  GetProductListParameters,
  InAttributes,
  LanguageCode,
  LanguageVariants,
} from "@/types/types";
import getProductAttributes from "@/api/repositories/endpoints/product/get-product-attributes";
import getProductTypes from "@/api/repositories/endpoints/product/get-product-types";
import getProductByKey from "@/api/repositories/endpoints/product/get-product-by-key";
import getProductTypeByKey from "@/api/repositories/endpoints/product/get-product-type-by-key";
import { SETTINGS } from "@/config/settings";
import { CurrencyCode } from "@/types/enum";
// import getProductListHttp from "@/api/repositories/endpoints/product/get-product-list-http";

const productRepository = {
  async getCategories(): Promise<InCategory[]> {
    try {
      const response = await getCategories();
      if (!response) return [];

      const flatCategories = response.results.map((category) =>
        this.mapCategoryToInternal(category),
      );

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
      console.error("Error fetching categories:", error);
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

      const category = this.mapCategoryToInternal(response);

      if (withChildren) {
        const allCategories = await this.getCategories();
        const found = this.findCategoryById(category.id, allCategories);
        return found ?? category;
      }

      return category;
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  },

  async getProductList(
    parameters: GetProductListParameters = {},
    currency: CurrencyCode = SETTINGS.currentCurrency,
  ): Promise<ProductSearchResult> {
    try {
      const response: ProductProjectionPagedSearchResponse | undefined =
        await getProductList(parameters);

      if (!response) {
        return this.emptyProductResponse();
      }

      const productResult = response.results.map((product) =>
        this.mapProductToInternal(product, currency),
      );
      return {
        limit: response?.limit,
        offset: response?.offset,
        count: response?.count,
        total: response?.total,
        results: productResult,
      };
    } catch (error) {
      console.error("Error getting product list:", error);
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
        ? this.mapProductToInternal(response, currency)
        : undefined;
    } catch (error) {
      console.error("Error getting product by key:", error);
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
      const allCategories = await this.getCategories(); // атрымай поўны спіс катэгорый

      if (category) {
        const categoryIds = await this.getAllCategoryIdsRecursive(
          category,
          allCategories,
        );

        const limit = parameters.limit ?? SETTINGS.productListParametrs.limit;
        const offset =
          parameters.offset ?? SETTINGS.productListParametrs.offset;

        const categoryFilter = parameters.searchText
          ? `categories.id:${categoryIds.map((id) => `"${id}"`).join(",")}`
          : `categories(id in (${categoryIds.map((id) => `"${id}"`).join(",")}))`;
        const combinedFilters = [...(parameters.filters ?? []), categoryFilter];

        const response = await getProductList({
          ...parameters,
          limit,
          offset,
          filters: combinedFilters,
        });

        if (!response) {
          return this.emptyProductResponse();
        }

        const productResult = response.results.map((product) =>
          this.mapProductToInternal(product, currency),
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
    } catch (error) {
      console.error("Error getting products by category key:", error);
      return this.emptyProductResponse();
    }
  },

  async getProductTypes(): Promise<InProductType[]> {
    try {
      const response = await getProductTypes();
      return response.map((productType) =>
        this.mapProductTypeToInternal(productType),
      );
    } catch (error) {
      console.error("Error getting product types:", error);
      throw error;
    }
  },

  async getProductTypeByKey(key: string): Promise<InProductType | undefined> {
    try {
      const response = await getProductTypeByKey(key);
      return response ? this.mapProductTypeToInternal(response) : undefined;
    } catch (error) {
      console.error("Error getting product type by key:", error);
      throw error;
    }
  },

  async getProductAttributes(productId: string): Promise<InAttributes> {
    try {
      const attributes = await getProductAttributes(productId);
      return this.matAttributesArray(attributes);
    } catch (error) {
      console.error("Error getting product attributes:", error);
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

  mapProductToInternal(
    product: ProductProjection,
    currency: CurrencyCode = SETTINGS.currentCurrency,
  ): InProduct {
    const masterPrices = product.masterVariant?.prices ?? [];
    const { price, discountedPrice, currencyCode, isDiscounted } =
      this.getPriceByCurrency(masterPrices, currency);

    return {
      id: product.id,
      key: product.key,
      name: this.mapLocalizedField(product.name),
      description: this.mapLocalizedField(product.description),
      images: product.masterVariant?.images ?? [],
      price,
      discountedPrice,
      isDiscounted,
      discountPercent: this.calculateDiscountPercent(price, discountedPrice),
      currencyCode,
      variantId: product.masterVariant?.id,
      available: product.masterVariant?.availability?.isOnStock ?? false,
      attributes:
        this.matAttributesArray(product.masterVariant?.attributes) ?? {},
      sku: product.masterVariant?.sku,
      categories:
        product.categories?.map((cat: CategoryReference) => cat.id) ?? [],
      variants:
        product.variants?.map((variant) => {
          const variantPrices = variant.prices ?? [];
          const {
            price: vPrice,
            discountedPrice: vDiscountedPrice,
            currencyCode: vCurrencyCode,
            isDiscounted: vIsDiscounted,
          } = this.getPriceByCurrency(variantPrices, currency);

          return {
            id: variant.id,
            sku: variant.sku,
            images: variant.images ?? [],
            price: vPrice,
            discountedPrice: vDiscountedPrice,
            isDiscounted: vIsDiscounted,
            discountPercent: this.calculateDiscountPercent(
              vPrice,
              vDiscountedPrice,
            ),
            currencyCode: vCurrencyCode,
            available: variant.availability?.isOnStock ?? false,
            attributes: this.matAttributesArray(variant.attributes ?? []),
          };
        }) ?? [],
    };
  },

  mapAsset(asset: Asset): InCategory["assets"][number] {
    return {
      id: asset.id,
      key: asset.key,
      name: this.mapLocalizedField(asset.name),
      description: this.mapLocalizedField(asset.description),
      sources: asset.sources.map((source) => ({
        key: source.key,
        uri: source.uri,
        dimensions: source.dimensions,
        contentType: source.contentType,
      })),
    };
  },

  mapCategoryToInternal(category: Category): InCategory {
    const localAsset = {
      id: `${category.id}-local`,
      key: `${category.key}-local`,
      sources: [
        {
          uri: `assets/img/categories/${category.key}.png`,
          contentType: "image/png",
        },
      ],
      name: category.name,
      description: category.description,
    };

    const mappedAssets = category.assets?.length
      ? category.assets.map((asset) => this.mapAsset(asset))
      : [];

    return {
      id: category.id,
      key: category.key,
      name: this.mapLocalizedField(category.name),
      description: this.mapLocalizedField(category.description),
      assets: [localAsset, ...mappedAssets],
      parentId: category.parent?.id,
      children: [],
    };
  },

  matAttributesArray(attributes: Attribute[] = []): InAttributes {
    return attributes.reduce((accumulator, attribute) => {
      accumulator[attribute.name] = attribute.value;
      return accumulator;
    }, {} as InAttributes);
  },

  mapProductTypeToInternal(productType: ProductType): InProductType {
    return {
      id: productType.id,
      key: productType.key,
      name: productType.name,
      description: productType.description,
      attributes: productType.attributes
        ? productType.attributes.map((attribute) =>
            this.mapAttributeDefinitionToInternal(attribute),
          )
        : [],
    };
  },

  mapAttributeDefinitionToInternal(
    attributeDefinition: AttributeDefinition,
  ): InAttributeDefinition {
    return {
      name: attributeDefinition.name,
      label: this.mapLocalizedField(attributeDefinition.label),
      type: attributeDefinition.type.name,
      required: attributeDefinition.isRequired,
      isSearchable: attributeDefinition.isSearchable,
    };
  },

  mapLocalizedField(field?: Record<string, string>): LanguageVariants {
    return (field ?? {}) as unknown as Record<LanguageCode, string>;
  },

  calculateDiscountPercent(
    price?: number,
    discounted?: number | undefined,
  ): number | undefined {
    if (price && discounted !== undefined && price > 0) {
      return Math.round(((price - discounted) / price) * 100);
    }
    return undefined;
  },

  getPriceByCurrency(prices: Price[] = [], currency: string) {
    const priceObject = prices.find((p) => p.value?.currencyCode === currency);

    if (!priceObject?.value)
      return {
        price: 0,
        discountedPrice: undefined,
        currencyCode: currency,
        isDiscounted: false,
      };

    const centAmount = priceObject.value.centAmount ?? 0;
    const discounted = priceObject.discounted?.value?.centAmount;
    const isDiscounted = !!priceObject.discounted;

    return {
      price: centAmount,
      discountedPrice: discounted,
      currencyCode: priceObject.value.currencyCode,
      isDiscounted,
    };
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
};

export default productRepository;
