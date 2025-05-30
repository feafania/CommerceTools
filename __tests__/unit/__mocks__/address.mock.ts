import { AddressType } from "@/types/enum";

export const ADDRESS_CHILDRENS_NUMBER = 7;

export const mockSettingsLabelAddress = {
  headers: {
    [AddressType.Billing]: "Mock Billing Header Text",
    [AddressType.Shipping]: "Mock Shipping Header Text",
  },
  city: "Mock City Label",
  street: "Mock Street Label",
  postalCode: "Mock Postal Code Label",
  country: "Mock Country Label",
  countryNames: { UK: "United Kingdom", PL: "Poland" },
  placeholders: {
    country: "Mock Select Country Placeholder",
  },
  default: {
    [AddressType.Billing]: "Mock Default Billing Checkbox Label",
    [AddressType.Shipping]: "Mock Default Shipping Checkbox Label",
  },
};

export const mockCountryOptions = [
  { value: "UK", label: "United Kingdom" },
  { value: "PL", label: "Poland" },
];
