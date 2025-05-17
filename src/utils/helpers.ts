import { StorageItem } from "../types/interfaces";

import { SETTINGS } from "@/config/settings";
import { LanguageCode } from "@/types/types";

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
