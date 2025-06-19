import {
  CountryValueType,
  InAttributes,
  LanguageVariants,
  StringRecords,
} from "./types";

import {
  CountryCode,
  CurrencyCode,
  InAttributeTypeValues,
  PageType,
  SortDirection,
} from "@/types/enum";
import AddressElement from "@/components/address/address";

type ControlBase = {
  type: string;
  label: string;
  name: string;
  value: string;
  forbidValueFromState: boolean | undefined;
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
  parentId?: string;
  children?: InCategory[];
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
  sortName: string;
  sortDirection: SortDirection;
  searchText?: string;
  filters?: string[];
  expand?: string[];
}

export interface InProduct {
  id: string;
  key?: string;
  name: LanguageVariants;
  description?: LanguageVariants;
  images: ProductImage[];
  price: number; // main price in cents (without discount)
  currencyCode?: string;
  discountedPrice?: number | undefined;
  isDiscounted: boolean;
  discountPercent?: number | undefined;
  categories: string[];
  attributes: InAttributes;
  available: boolean;
  sku?: string;
  variantId?: number; // ID of main variant
  variants: InVariant[];
  productTypeKey?: string;
}

export interface InVariant {
  id: number;
  sku?: string;
  images: ProductImage[];
  price?: number;
  currencyCode?: string;
  discountedPrice?: number | undefined;
  isDiscounted: boolean;
  discountPercent?: number | undefined;
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
  type?: InAttributeType;
  required: boolean;
  isSearchable: boolean;
}

export interface InAttributeType {
  name: InAttributeTypeValues;
  values: {
    key: string;
    label: string | StringRecords;
  }[];
}

export interface InProductType {
  id: string;
  key?: string;
  name: string;
  description?: string;
  attributes: InAttributeDefinition[];
}

export interface ProductSearchResult {
  /**
   *	The maximum number of results
   *
   *
   */
  readonly limit: number;
  /**
   *	The starting point for the retrieved
   *
   *
   */
  readonly offset: number;
  /**
   *	Actual number of results returned.
   *
   *
   */
  readonly count: number;
  /**
   *	Total number of results matching the query.
   *
   *
   */
  readonly total?: number;
  /**
   *	Products where at least one ProductVariant(ctp:api:type:ProductVariant)
   *   matches the search query.
   *
   */
  readonly results: InProduct[];
}

export interface AddressItem {
  element: AddressElement;
  id: string;
  index: number;
  isEditing: boolean;
  name: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface InLineItem {
  id: string;
  productId: string;
  name: LanguageVariants;
  quantity: number;
  price: number; // for 1 piece
  totalPrice: number; // price * quantity
  variantId: number;
  sku?: string;
  image?: string;
}

export interface InCart {
  id: string;
  version: number;
  currency: CurrencyCode;
  lineItems: InLineItem[];
  totalPrice: number; // Total price of the cart including all discounts, taxes, shipping, etc.
  subtotalPrice: number; // unitPrice * quantity
  discountCodes?: InCartDiscountCode[];
  discountTotal?: number;
  createdAt: string; // new Date(cart.createdAt);
  customerId?: string;
  anonymousId?: string;
  country?: CountryCode;
}

export interface InCartDiscountCode {
  id: string;
  matchesCart: boolean;
}

export interface InCartDiscount {
  id: string;
  name?: Record<string, string>;
  description?: Record<string, string>;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
}

export interface InDiscountCode {
  id: string;
  code: string;
  key?: string;
  name?: LanguageVariants;
  description?: LanguageVariants;
  isActive: boolean;
  maxApplications?: number;
  maxApplicationsPerCustomer?: number;
  cartPredicate?: string;
  groups?: string[];
  cartDiscounts?: InCartDiscount[];
}
