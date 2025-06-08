import {
  ProductProjectionPagedSearchResponse,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

import { createAnonymousClient } from "@/api/repositories/build-client";
import { handleApiError } from "@/api/handle-api-error";
import { QueryArguments } from "@/types/api-types";
import { SETTINGS } from "@/config/settings";
import { GetProductListParameters } from "@/types/types";

/** getProductList usage
 * default
 * await getProductList();
 * search
 * await getProductList({ searchText: "jacket" });
 * sort
 * await getProductList({ sort: "price asc" });
 * filter
 * await getProductList({
 filters: [
 'variants.attributes.color.key:"red"',
 'variants.attributes.size.key:"M"',
 ],
 * discount
 * In each productProjection → masterVariant → price:
 * const price = product.masterVariant?.price;
 * const value = price?.value.centAmount;
 * const discounted = price?.discounted?.value.centAmount;
 *
 * const finalPrice = discounted ?? value;
 * const isDiscounted = !!price?.discounted;
 */

export default async function getProductList({
  limit = SETTINGS.productListParameters.limit,
  offset = SETTINGS.productListParameters.offset,
  sortName = `${SETTINGS.productListParameters.sortName}.${SETTINGS.currentLang}`,
  sortDirection = SETTINGS.productListParameters.sortDirection,
  searchText,
  filters = [],
}: GetProductListParameters = {}): Promise<
  ProductProjectionPagedSearchResponse | undefined
> {
  try {
    const ctpClient = createAnonymousClient();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY!,
    });
    const sort = `${sortName} ${sortDirection}`;

    const queryArguments: QueryArguments = {
      limit,
      offset,
      sort,
      staged: true,
      fuzzy: true,
      fuzzyLevel: 2,
      priceCurrency: SETTINGS.currentCurrency,
    };

    // if (searchText?.trim()) {
    queryArguments.filter = filters;
    // } else if (filters.length > 0) {
    //   queryArguments.where = filters.join(" and ");
    // }
    // let response;

    const searchTerm = searchText?.trim();
    if (searchTerm) {
      queryArguments[`text.${SETTINGS.currentLang}`] = `*${searchTerm}*`;
    }

    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: queryArguments })
      .execute();
    // } else {
    //   response = await apiRoot
    //     .productProjections()
    //     .get({ queryArgs: queryArguments })
    //     .execute();
    // }

    return response.body;
  } catch (error) {
    // console.error("Error fetching product list:", error);
    handleApiError(error);
    return {
      limit: 0,
      offset: 0,
      count: 0,
      total: 0,
      results: [],
    };
  }
}
