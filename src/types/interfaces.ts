import { CountryValueType, InAttributes, LanguageVariants } from "./types";

import { CountryCode, PageType, SortDirection, SortName } from "@/types/enum";

type ControlBase = {
  type: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  id: string;
  class: string | string[];
  disabled: boolean;
  required: boolean;
  validationName?: string;
  relatedCountryField?: string;
};

export interface ControlSelect extends ControlBase {
  options: SelectType[];
}

export interface SelectType {
  label: string;
  code: string;
}

export type ControlConfig = Partial<ControlBase>;
export type SelectConfig = Partial<ControlSelect>;

export interface StorageItem {
  key: string;
  value: string;
}

export interface NavType {
  label: string;
  page: PageType;
  visible: boolean;
  disabled: boolean;
}

export interface ModalOptions {
  onOk?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export interface ValidationRule {
  pattern?: RegExp;
  isValid?: (value: string | CountryValueType) => boolean;
  message?: string;
  getValidationMessage?: (code: CountryCode | undefined) => string;
}

export interface CTErrorObject {
  code: string;
  message: string;
  detailedErrorMessage?: string;
  field?: string;
  value?: string;
  duplicateValue?: string;
  [key: string]: unknown;
}

export interface CTApiError {
  statusCode?: number;
  message?: string;
  body?: {
    statusCode?: number;
    message?: string;
    errors?: CTErrorObject[];
  };
  error?: {
    message?: string;
    errors?: CTErrorObject[];
  };
}

export interface InCategory {
  id: string;
  key?: string;
  name: LanguageVariants;
  description?: LanguageVariants;
  assets: InAsset[];
}

export interface InAssetSource {
  key?: string;
  uri: string;
  dimensions?: { w: number; h: number };
  contentType?: string;
}

export interface InAsset {
  id: string;
  key?: string;
  sources: InAssetSource[];
  name: LanguageVariants;
  description?: LanguageVariants;
}

export interface InAddress {
  id?: string;
  key?: string;
  streetName: string;
  streetNumber?: string;
  postalCode: string;
  city: string;
  country: string;
  isDefaultBilling?: boolean;
  isDefaultShipping?: boolean;
}

export interface InCustomer {
  version?: number;
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  addresses: InAddress[];
}

export interface ProductListParameters {
  limit: number;
  offset: number;
  sortName: SortName;
  sortDirection: SortDirection;
  searchText?: string;
  filters?: string[];
}

export interface InProduct {
  id: string;
  key?: string;
  name: LanguageVariants;
  description?: LanguageVariants;
  images: ProductImage[];
  price: number; // main price in cents (without discount)
  discountedPrice?: number | null;
  isDiscounted: boolean;
  categories: string[];
  attributes: InAttributes;
  available: boolean;
  sku?: string;
  variantId?: number; // ID of main variant
  variants: InVariant[];
}

export interface InVariant {
  id: number;
  sku?: string;
  images: ProductImage[];
  price?: number;
  discountedPrice?: number | null;
  isDiscounted: boolean;
  attributes: InAttributes;
  available: boolean;
}

export interface ProductImage {
  url: string;
  label?: string;
  dimensions?: {
    w: number;
    h: number;
  };
}

export interface InAttributeDefinition {
  name: string;
  label: LanguageVariants;
  type?: string;
  required: boolean;
  isSearchable: boolean;
}

export interface InProductType {
  id: string;
  key?: string;
  name: string;
  description?: string;
  attributes: InAttributeDefinition[];
}
