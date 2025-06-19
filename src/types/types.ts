import translations from "@/config/interfaces";
import {
  InAttributeDefinition,
  InCart,
  ProductListParameters,
  ValidationRule,
} from "@/types/interfaces";
import { AddressType, CountryCode, CurrencyCode, FormType } from "@/types/enum";
import { VALIDATION } from "@/config/validation";

export type Listener = () => void;

export type LanguageCode = keyof typeof translations;

export type RouteType = {
  canActivate: () => boolean;
  render: () => Promise<HTMLElement | undefined>;
};

export type ValidationType = Record<string, ValidationRule>;
export type ValidationKey = keyof typeof VALIDATION;

export type CountryConfig = {
  postalCodePattern: RegExp;
};

export type CountryCodeMap = {
  [key in CountryCode]: string;
};

export type CurrencyCodeMap = {
  [key in CurrencyCode]: string;
};

export type AddressTypeMap = {
  [key in AddressType]: string;
};

export type CountryValueType = { value: string; countryCode?: CountryCode };

export type FormField = {
  name: string;
  label: string;
  validation: ValidationRule;
};

export type FormFieldsMap = {
  [key in FormType]: FormField[];
};

export type FieldErrorType = { field: string; message: string };

export type NavMenu = "header" | "main";

export type GetProductListParameters = Partial<ProductListParameters>;

type AttributeType =
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean>
  | LanguageVariants;

export type InAttributes = Record<string, AttributeType>;

export type LanguageVariants = Record<LanguageCode, string>;

export type SortOptions =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | undefined;

export type AttributeMap = Map<string, InAttributeDefinition>;

export type StringRecords = Record<string, string>;

export type SimpleAttributes = {
  [key: string]: AttributeType | InAttributes;
};

export type CartContextType = {
  cart: InCart | undefined;
  setCart: (cart: InCart | undefined) => void;
};
