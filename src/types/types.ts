import translations from "@/config/interfaces";
import { ValidationRule } from "@/types/interfaces";
import { AddressType, CountryCode, FormType } from "@/types/enum";
import { VALIDATION } from "@/config/validation";

export type Listener = () => void;

export type LanguageCode = keyof typeof translations;

export type CTApiError = {
  body?: {
    statusCode?: number;
    message?: string;
    errors?: Array<{ code: string; message: string }>;
  };
};

export type CTErrorObject = {
  code: string;
  message: string;
  field?: string;
  [key: string]: unknown;
};

export type InCategory = {
  id: string;
  key?: string;
  name: string;
  description?: string;
  assets: InAsset[];
};

export type InAssetSource = {
  key?: string;
  uri: string;
  dimensions?: { w: number; h: number };
  contentType?: string;
};

export type InAsset = {
  id: string;
  key?: string;
  sources: InAssetSource[];
  name: string;
  description?: string;
};

export type InAddress = {
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
};

export type InCustomer = {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  billingAddress: InAddress;
  shippingAddress: InAddress;
  isSameAddress?: boolean;
  setBillingAsDefault?: boolean;
  setShippingAsDefault?: boolean;
};

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

export type AdressTypeMap = {
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
