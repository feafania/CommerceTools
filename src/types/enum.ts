export enum PageType {
  login = "login",
  registration = "registration",
  main = "main",
  catalog = "catalog",
  product = "product",
  profile = "profile",
  basket = "basket",
  about = "about",
  notfound = "notfound",
  changePassword = "changePassword",
}

export enum AddressType {
  Billing = "billing",
  Shipping = "shipping",
}

export enum CountryCode {
  PL = "PL",
  UK = "UK",
  DE = "DE",
  FR = "FR",
  ES = "ES",
}

export enum CurrencyCode {
  EUR = "EUR",
  GBP = "GBP",
  PLN = "PLN",
}

export enum FormType {
  LOGIN = "login",
  REGISTRATION = "registration",
  PROFILE = "profile",
  PASSWORD = "password",
}

export enum SortName {
  NAME = "name",
  PRICE = "price",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum SliderType {
  Cards = "cards",
  Img = "img",
}

export enum InAttributeTypeValues {
  Enum = "enum",
  Lenum = "lenum",
}

export enum LabelPosition {
  Left = "left",
  Right = "right",
}

export enum AttributeKeys {
  MinPrice = "minPrice",
  MaxPrice = "maxPrice",
}

export enum DiscountState {
  "MatchesCart" = "MatchesCart",
  "DoesNotMatchCart" = "DoesNotMatchCart",
}
