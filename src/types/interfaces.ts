import { CountryValueType } from "./types";

import { CountryCode, PageType } from "@/types/enum";

type ControlBase = {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  id: string;
  class: string | string[];
  disabled: boolean;
  required: boolean;
  validationName?: string;
  relatedCountryField?: string;
};

export interface ControlSelect extends ControlBase {
  options: string[];
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
  getValidationMessage?: (code: CountryCode) => string;
}

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

export type CTErrorObject = {
  code: string;
  message: string;
  detailedErrorMessage?: string;
  field?: string;
  value?: string;
  duplicateValue?: string;
  [key: string]: unknown;
};

export type CTApiError = {
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
  id?: string;
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
