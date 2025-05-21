import apiRoot from "@/api/repositories/api-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCategories() {
  try {
    return apiRoot
      .categories()
      .get({ queryArgs: { withTotal: false } })
      .execute();
  } catch (error) {
    console.error(`Error fetching category:`, error);
    handleApiError(error);
  }
}
