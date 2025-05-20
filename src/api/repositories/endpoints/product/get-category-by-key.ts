import apiRoot from "@/api/repositories/api-client";
import { handleApiError } from "@/api/handle-api-error";

export default async function getCategoryByKey(key: string) {
  try {
    return await apiRoot.categories().withKey({ key }).get().execute();
  } catch (error) {
    console.error(`Error fetching category with key "${key}":`, error);
    handleApiError(error);
  }
}
