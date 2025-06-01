import {
  Asset,
  Attribute,
  AttributeDefinition,
  Category,
  CategoryReference,
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
} from "@/types/interfaces";
import getProductList from "@/api/repositories/endpoints/product/get-product-list";
import { InAttributes, LanguageCode, LanguageVariants } from "@/types/types";
import getProductAttributes from "@/api/repositories/endpoints/product/get-product-attributes";
import getProductTypes from "@/api/repositories/endpoints/product/get-product-types";
import getProductByKey from "@/api/repositories/endpoints/product/get-product-by-key";
import getProductTypeByKey from "@/api/repositories/endpoints/product/get-product-type-by-key";

const productRepository = {
  async getCategories(): Promise<InCategory[]> {
    try {
      const response = await getCategories();
      if (response) {
        return response.results.map((category) =>
          this.mapCategoryToInternal(category),
        );
      }
    } catch (error) {
      throw error;
    }
    return [] as InCategory[];
  },
  async getCategoryByKey(key: string): Promise<InCategory> {
    try {
      const response = await getCategoryByKey(key);
      if (!response) {
        throw new Error(`Category with key "${key}" not found.`);
      }
      return this.mapCategoryToInternal(response);
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

  async getProductByKey(key: string): Promise<InProduct | undefined> {
    try {
      const response = await getProductByKey(key);
      return response ? this.mapProductToInternal(response) : undefined;
    } catch (error) {
      console.error("Error getting product by key:", error);
      throw error;
    }
  },

  async getProductsByCategoryKey(categoryKey: string): Promise<InProduct[]> {
    try {
      const category = await this.getCategoryByKey(categoryKey);
      const allProducts = await this.getProductList();

      return allProducts.filter((product) =>
        product.categories.includes(category.id),
      );
    } catch (error) {
      console.error("Error getting products by category key:", error);
      throw error;
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

  mapProductToInternal(product: ProductProjection): InProduct {
    return {
      id: product.id,
      key: product.key,
      name: this.mapLocalizedField(product.name),
      description: this.mapLocalizedField(product.description),
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
      variants:
        product.variants?.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          images: variant.images ?? [],
          price: variant.price?.value.centAmount ?? 0,
          discountedPrice:
            variant.price?.discounted?.value.centAmount ?? undefined,
          isDiscounted: !!variant.price?.discounted,
          attributes: this.matAttributesArray(variant.attributes ?? []),
          available: variant.availability?.isOnStock ?? false,
        })) ?? [],
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
};

export default productRepository;
