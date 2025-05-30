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

export interface BaseCustomerUpdateAction {
  action: string;
}
