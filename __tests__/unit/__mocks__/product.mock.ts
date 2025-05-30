import {
  Category,
  CategoryPagedQueryResponse,
} from "@commercetools/platform-sdk";

import getCategories from "@/api/repositories/endpoints/product/get-categories";
import getCategoryByKey from "@/api/repositories/endpoints/product/get-category-by-key";

// mocked functions
export const mockedGetCategories = getCategories as jest.MockedFunction<
  typeof getCategories
>;
export const mockedGetCategoryByKey = getCategoryByKey as jest.MockedFunction<
  typeof getCategoryByKey
>;

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
