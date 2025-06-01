import translations from "@/config/interfaces";
import { ProductListParameters, ValidationRule } from "@/types/interfaces";
import { AddressType, CountryCode, FormType } from "@/types/enum";
import { VALIDATION } from "@/config/validation";

export type Listener = () => void;

export type LanguageCode = keyof typeof translations;

export type RouteType = {
  canActivate: () => boolean;
  render: () => Promise<HTMLElement>;
};

export type ValidationType = Record<string, ValidationRule>;
export type ValidationKey = keyof typeof VALIDATION;

export type CountryConfig = {
  postalCodePattern: RegExp;
};

export type CountryCodeMap = {
  [key in CountryCode]: string;
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

export type InAttributes = Record<
  string,
  string | number | boolean | null | Array<string | number | boolean>
>;
