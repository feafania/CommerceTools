import { SETTINGS } from "@/config/settings";
import { CountryCodeMap, LanguageCode } from "@/types/types";
import { StorageItem } from "@/types/interfaces";
import { CountryCode } from "@/types/enum";

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

export function getCountriesOptions(countries: CountryCodeMap) {
  return Object.entries(countries).map(([, name]) => name);
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
