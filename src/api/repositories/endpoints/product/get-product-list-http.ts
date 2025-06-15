import { ProductProjectionPagedSearchResponse } from "@commercetools/platform-sdk";

import { SETTINGS } from "@/config/settings";
import { GetProductListParameters } from "@/types/types";
import { handleApiError } from "@/api/handle-api-error";
import getAnonToken from "@/api/repositories/endpoints/token/get-anonymous-token";

export default async function getProductListHttp({
  limit = SETTINGS.productListParameters.limit,
  offset = SETTINGS.productListParameters.offset,
  sortName = `${SETTINGS.productListParameters.sortName}.${SETTINGS.currentLang}`,
  sortDirection = SETTINGS.productListParameters.sortDirection,
  searchText,
  filters = [],
  expand = [],
}: GetProductListParameters = {}) {
  try {
    const lang = SETTINGS.currentLang;
    const sort = `${sortName} ${sortDirection}`;

    const token = await getAnonToken();
    if (!token) {
      return emptyResult();
    }
    const headers = {
      Authorization: `Bearer ${await token.access_token}`,
      Accept: "application/json",
    };

    const parameters = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      sort,
      staged: "true",
      fuzzy: "true",
      fuzzyLevel: "2",
      priceCurrency: SETTINGS.currentCurrency,
    });

    const projectKey = process.env.CTP_PROJECT_KEY!;
    const apiUrl = process.env.CTP_API_URL!;
    let url = `${apiUrl}/${projectKey}/product-projections`;

    const searchTerm = searchText?.trim();
    if (searchTerm) {
      parameters.append(`text.${lang}`, `*${searchTerm}*`);
      parameters.set("fuzzy", String(searchTerm.length < 5));
    }
    for (const filter of filters) {
      parameters.append("filter", filter);
    }
    parameters.append("expand", "productType");
    for (const item of expand) {
      parameters.append("expand", item);
    }
    url = `${url}/search`;
    // } else {
    //   if (filters.length > 0) {
    //     parameters.append("where", filters.join(" and "));
    //   }
    // }

    url = `${url}?${parameters.toString()}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(await response.text());

    const json: ProductProjectionPagedSearchResponse = await response.json();
    return json;
  } catch (error) {
    // console.error("Error fetching product list:", error);
    handleApiError(error);
    return emptyResult();
  }
}

function emptyResult() {
  return {
    limit: 0,
    offset: 0,
    count: 0,
    total: 0,
    results: [],
  };
}
