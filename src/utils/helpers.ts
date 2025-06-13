import Cookies from "js-cookie";

import { SETTINGS } from "@/config/settings";
import { CountryCodeMap, LanguageCode, LanguageVariants } from "@/types/types";
import {
  InAddress,
  InCustomer,
  SelectType,
  StorageItem,
} from "@/types/interfaces";
import { AddressType, CountryCode, CurrencyCode } from "@/types/enum";
import { COOCKIE_LIFE, CurrencySymbolMap } from "@/config/constants";

export function saveState(object: StorageItem) {
  sessionStorage.setItem(object.key, object.value);
}

export function getState(key: string): string | null {
  return sessionStorage.getItem(key);
}

export function deleteState(key: string) {
  return sessionStorage.removeItem(key);
}

export function saveLocalState(object: StorageItem) {
  localStorage.setItem(object.key, object.value);
}

export function getLocalState(key: string): string | null {
  return localStorage.getItem(key);
}

export function deleteLocalState(key: string) {
  return localStorage.removeItem(key);
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalizeString(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function changeLanguage(lang: LanguageCode) {
  SETTINGS.setLang(lang);
}

export function classesToArray(
  classObject: string | string[] | undefined,
): string[] {
  if (Array.isArray(classObject)) {
    return classObject.filter((cls): cls is string => typeof cls === "string");
  } else if (typeof classObject === "string") {
    return classObject.trim().split(/\s+/);
  }
  return [];
}

export function getCountryLabel(code: CountryCode): string {
  return SETTINGS.label.address.countryNames[code];
}

export function getCountryCode(countryLabel: string): CountryCode | undefined {
  return (
    Object.entries(SETTINGS.label.address.countryNames) as [
      CountryCode,
      string,
    ][]
  ).find(([, label]) => label === countryLabel)?.[0];
}

export function getCountriesOptions(countries: CountryCodeMap): SelectType[] {
  return Object.entries(countries).map(([code, label]) => ({
    label,
    code,
  }));
}

export function formatDateForCommercetools(inputDate: string | null): string {
  if (!inputDate) return "";
  const separator = inputDate.includes("/") ? "/" : ".";

  const parts = inputDate.split(separator);
  if (parts.length !== 3) return "";

  const [dayString, monthString, yearString] = parts;
  const day = Number.parseInt(dayString, 10);
  const month = Number.parseInt(monthString, 10);
  const year = Number.parseInt(yearString, 10);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1000
  ) {
    return "";
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }

  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");
  return `${year}-${formattedMonth}-${formattedDay}`;
}

export function calculateTokenExpiry(expiresIn: number): string {
  const expiryTimestamp = Date.now() + expiresIn * 1000;
  return new Date(expiryTimestamp).toISOString();
}

export function findDefaultAddress(
  addresses: InAddress[],
  addressType: AddressType,
): InAddress | undefined {
  if (addressType === "billing") {
    return addresses.find((address) => address.isDefaultBilling);
  } else if (addressType === "shipping") {
    return addresses.find((address) => address.isDefaultShipping);
  }

  return undefined;
}

export function findDefaultAddressIndex(
  customer: InCustomer,
  addressType: AddressType,
): number | undefined {
  if (!customer) return undefined;

  if (addressType === "billing") {
    return customer.addresses.findIndex((address) => address.isDefaultBilling);
  } else if (addressType === "shipping") {
    return customer.addresses.findIndex((address) => address.isDefaultShipping);
  }

  return undefined;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  if (a === null || b === null) return false;

  if (typeof a !== "object") return false;
  if (typeof b !== "object") return false;

  // Arrays
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // Objects
  const objectA = a as Record<string, unknown>;
  const objectB = b as Record<string, unknown>;

  const aKeys = Object.keys(objectA);
  const bKeys = Object.keys(objectB);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!(key in objectB)) return false;
    if (!deepEqual(objectA[key], objectB[key])) return false;
  }

  return true;
}

export function localizeName(variableName: string | LanguageVariants) {
  if (typeof variableName === "string") return variableName;
  if (variableName[SETTINGS.currentLang])
    return variableName[SETTINGS.currentLang];
  return variableName[SETTINGS.fallbackLanguage];
}

export function removeAllChildren(element: Element | undefined | null) {
  if (element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
}

export function formatPriceWithCurrency(
  price: number,
  currencyCode: CurrencyCode,
): string {
  const symbol = CurrencySymbolMap[currencyCode];
  const amount = (price / 100).toFixed(2);

  switch (currencyCode) {
    case CurrencyCode.EUR:
    case CurrencyCode.GBP: {
      return `${symbol}${amount}`;
    }
    default: {
      return `${amount} ${symbol}`;
    }
  }
}

export function formatDate(createdAt: string): string {
  const date = new Date(createdAt);
  return date.toLocaleDateString(SETTINGS.currentLang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function setCookie(
  name: string,
  value: string,
  days: number = COOCKIE_LIFE,
): void {
  Cookies.set(name, value, {
    expires: days,
    secure: true, // only for HTTPS
    sameSite: "Lax", // CSRF protection
    path: "/", // available on the entire site
  });
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function removeCookie(name: string) {
  Cookies.remove(name, { path: "/" });
}
