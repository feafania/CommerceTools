import { ApiRequest, Cart, MyCartUpdate } from "@commercetools/platform-sdk";

export enum CustomerActionType {
  ChangeEmail = "changeEmail",
  SetFirstName = "setFirstName",
  SetLastName = "setLastName",
  SetDateOfBirth = "setDateOfBirth",
  AddAddress = "addAddress",
  ChangeAddress = "changeAddress",
  RemoveAddress = "removeAddress",
  SetDefaultShippingAddress = "setDefaultShippingAddress",
  SetDefaultBillingAddress = "setDefaultBillingAddress",
}

export type TokenKeys = "access_token" | "refresh_token";

export interface TokenType {
  access_token: string;
  token_expires_in: string;
  refresh_token: string;
}

export interface TokenResponse extends Omit<TokenType, "token_expires_in"> {
  expires_in: number;
  scope: string;
  token_type: "Bearer";
}

export type QueryArguments = {
  /**
   * Maximum number of products to return in the response.
   * Used for pagination control.
   */
  limit?: number;

  /**
   * Number of products to skip from the beginning.
   * Used for pagination control.
   */
  offset?: number;

  /**
   * Sorting criteria for the product list.
   * Example: "price asc" or ["name.en asc", "price desc"].
   */
  sort?: string | string[];

  /**
   * Filters applied to narrow down the product list (for regular queries).
   * Example: ['variants.attributes.color.key:"red"'].
   * Uses `where` parameter in API requests.
   */
  where?: string;

  /**
   * Filters applied for search queries.
   * Example: ['variants.attributes.color.key:"red"'].
   * Uses `filter` parameter in search() requests.
   */
  filter?: string[];

  /**
   * Whether to include staged (unpublished) product data.
   * Set to true to get draft changes as well.
   */
  staged?: boolean;

  /**
   * Enables fuzzy search for text queries.
   * Useful for forgiving typos in search input.
   */
  fuzzy?: boolean;
  /**
   * Only applicable if fuzzy is true.
   * 0 for text with 1-2 characters
   * 1 for text with 3-5 characters
   * 2 for text with more than 5 characters
   */

  fuzzyLevel?: number;

  /**
   * Search text (deprecated, use `text.<locale>` instead).
   */
  searchText?: string;
} & {
  /**
   * Full-text search query localized by language.
   * The key must follow the format `text.<locale>`, e.g., "text.en".
   */
  [key: `text.${string}`]: string;
  /**
   * Currency code used for price-based sorting and filtering.
   * Required when sorting or filtering by price.
   * Example: "EUR", "USD", etc.
   */
  priceCurrency?: string;
};

export type CartPostFunction = (arguments_: {
  body: MyCartUpdate;
}) => ApiRequest<Cart>;
