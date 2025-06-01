import {
  Category,
  CategoryPagedQueryResponse,
  ProductProjection,
  ProductType,
} from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import {
  getCategoryByKey,
  getProductAttributes,
  getProductByKey,
  getProductList,
  getProductTypeByKey,
  getProductTypes,
} from "@/api/repositories/endpoints/product";
import productRepository from "@/api/repositories/product-repository";
import { InProduct } from "@/types/interfaces";
import { InAttributes } from "@/types/types";

// mocked functions
export const mockedGetCategories = getCategories as jest.MockedFunction<
  typeof getCategories
>;
export const mockedGetCategoryByKey = getCategoryByKey as jest.MockedFunction<
  typeof getCategoryByKey
>;
export const mockedGetProductList = getProductList as jest.MockedFunction<
  typeof getProductList
>;
export const mockedGetProductByKey = getProductByKey as jest.MockedFunction<
  typeof getProductByKey
>;
export const mockedGetProductTypes = getProductTypes as jest.MockedFunction<
  typeof getProductTypes
>;
export const mockedGetProductTypeByKey =
  getProductTypeByKey as jest.MockedFunction<typeof getProductTypeByKey>;
export const mockedGetProductAttributes =
  getProductAttributes as jest.MockedFunction<typeof getProductAttributes>;

// faked data

export const setOfCategories: Category[] = [
  {
    id: "cat1",
    key: "dhs",
    version: 1,
    createdAt: "2025-01-01T00:00:00.000Z",
    lastModifiedAt: "2025-01-01T00:00:00.000Z",
    name: { en: "Category 1" },
    slug: { en: "category-1" },
    assets: [],
    ancestors: [],
    orderHint: "0.1",
  },
  {
    id: "cat2",
    key: "dhst",
    version: 1,
    createdAt: "2025-01-01T00:00:00.000Z",
    lastModifiedAt: "2025-01-01T00:00:00.000Z",
    name: { en: "Category 2" },
    slug: { en: "category-2" },
    assets: [
      {
        id: "asset1",
        sources: [
          {
            uri: "https://example.com/img.png",
            contentType: "image/png",
          },
        ],
        name: { en: "Example asset" },
      },
    ],
    ancestors: [],
    orderHint: "0.2",
  },
];

export const mockedCategories = setOfCategories.map((category) => {
  return {
    id: category.id,
    key: category.key,
    name: category.name,
    description: category.description,
    assets: [],
  };
});

export const categoriesApiResponse: CategoryPagedQueryResponse = {
  limit: 20,
  offset: 0,
  count: 2,
  total: 2,
  results: [...setOfCategories],
};

export const CategoryByKeyApiResponse: Category = {
  ...setOfCategories[0],
};

export const mockedProductProjection: ProductProjection = {
  id: "prod1",
  version: 1,
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  productType: {
    typeId: "product-type",
    id: "pt1",
  },
  taxCategory: {
    typeId: "tax-category",
    id: "tax1",
  },
  state: {
    typeId: "state",
    id: "state1",
  },
  key: "key1",
  slug: { en: "product-1" },
  name: { en: "Product 1" },
  description: { en: "Description 1" },
  categories: [
    {
      typeId: "category",
      id: setOfCategories[0].id,
    },
  ],
  masterVariant: {
    id: 1,
    sku: "sku1",
    images: [],
    attributes: [],
    availability: { isOnStock: true },
    price: {
      id: "price1",
      value: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 1000,
        fractionDigits: 2,
      },
      discounted: undefined,
    },
  },
  variants: [],
};

export const mockedProductList: ProductProjection[] = [
  mockedProductProjection,
  {
    ...mockedProductProjection,
    id: "prod2",
    key: "key2",
    name: { en: "Product 2" },
    slug: { en: "product-2" },
    categories: [
      {
        typeId: "category",
        id: setOfCategories[1].id,
      },
    ],
    masterVariant: {
      ...mockedProductProjection.masterVariant,
      id: 2,
      sku: "sku2",
      availability: { isOnStock: false },
      price: {
        id: "price2",
        value: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 1500,
          fractionDigits: 2,
        },
        discounted: undefined,
      },
    },
  },
];

export const mappedInProduct = productRepository.mapProductToInternal(
  mockedProductProjection,
);

export const mockedInternalProductList: InProduct[] = mockedProductList.map(
  (element) => productRepository.mapProductToInternal(element),
);

export const mockedProductType: ProductType = {
  id: "pt1",
  key: "prodType1",
  version: 1,
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  name: "ProductType 1",
  description: "desc",
  attributes: [],
};

export const mappedInProductType =
  productRepository.mapProductTypeToInternal(mockedProductType);

export const mockedAttributes = [
  { name: "color", value: "red" },
  { name: "size", value: "M" },
];

export const mappedInAttributeObject = mockedAttributes.reduce(
  (accumulator, { name, value }) => {
    accumulator[name] = value;
    return accumulator;
  },
  {} as InAttributes,
);
