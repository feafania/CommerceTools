import { ProductProjectionPagedSearchResponse } from "@commercetools/platform-sdk";

import { SETTINGS } from "@/config/settings";
import { GetProductListParameters } from "@/types/types";
import { handleApiError } from "@/api/handle-api-error";
import getAnonToken from "@/api/repositories/endpoints/token/get-anonymous-token";

export default async function getProductListHttp({
  limit = SETTINGS.productListParametrs.limit,
  offset = SETTINGS.productListParametrs.offset,
  sortName = SETTINGS.productListParametrs.sortName,
  sortDirection = SETTINGS.productListParametrs.sortDirection,
  searchText,
  filters = [],
}: GetProductListParameters = {}) {
  try {
    const lang = SETTINGS.currentLang;
    const sort = `${sortName}.${lang} ${sortDirection}`;

    const token = await getAnonToken();
    if (!token) {
      return emptyResult();
    }
    const headers = {
      Authorization: `Bearer ${await token.access_token}`,
      Accept: "application/json",
    };

    const where = filters.join(" and ");

    const parameters = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      sort,
      staged: "true",
      fuzzy: "true",
    });

    if (where) {
      parameters.append("where", where);
    }

    const projectKey = process.env.CTP_PROJECT_KEY!;
    const apiUrl = process.env.CTP_API_URL!;
    let url = `${apiUrl}/${projectKey}/product-projections`;
    if (searchText?.trim()) {
      if (searchText?.trim()) {
        parameters.append(`text.${lang}`, searchText.trim());
      }
      url = `${url}/search`;
    }
    url = `${url}?${parameters.toString()}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(await response.text());

    const json: ProductProjectionPagedSearchResponse = await response.json();
    console.log("answer", json);
    return json;
  } catch (error) {
    console.error("Error fetching product list:", error);
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
