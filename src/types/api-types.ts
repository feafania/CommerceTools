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
   * Filters applied to narrow down the product list.
   * Example: ['variants.attributes.color.key:"red"'].
   */
  where?: string;

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
   * serch text.
   */
  searchText?: string;
} & {
  /**
   * Full-text search query localized by language.
   * The key must follow the format `text.<locale>`, e.g., "text.en".
   */
  [key: `text.${string}`]: string;
};
