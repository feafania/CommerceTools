import translations from "@/config/interfaces";

export type ValidationType = { pattern: RegExp; message: string };

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
