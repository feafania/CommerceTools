import { ValidationType } from "../types/types";

import { SETTINGS } from "./settings";

import { AppTranslation } from "@/types/translation";
import translations from "@/config/interfaces/index";

export const VIEW_CONTAINER_NAME = "view-container";

export const VALIDATION = {
  login: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address (e.g., example@email.com).",
  },
  firstName: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]{1,}$/,
    message: SETTINGS.label.validation.firstName,
  },
  lastName: {
    pattern: /^[A-Za-z]{1,}$/,
    message: "Last name must contain only letters and at least one character.",
  },
  dateOfBirth: {
    isValid: (value: string) => {
      if (!value) return false;
      const parts = value.split(".");
      if (parts.length !== 3) return false;

      const day = Number.parseInt(parts[0], 10);
      const month = Number.parseInt(parts[1], 10) - 1;
      const year = Number.parseInt(parts[2], 10);

      // if any invalid
      if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
        return false;

      const inputDate = new Date(year, month, day);
      // check the date is valid
      if (
        inputDate.getFullYear() !== year ||
        inputDate.getMonth() !== month ||
        inputDate.getDate() !== day
      ) {
        return false;
      }

      // check is it future
      const today = new Date();
      if (inputDate > today) return false;

      let age = today.getFullYear() - inputDate.getFullYear();
      if (
        today.getMonth() < inputDate.getMonth() ||
        (today.getMonth() === inputDate.getMonth() &&
          today.getDate() < inputDate.getDate())
      ) {
        age--;
      }

      return age >= 13;
    },
    message: "You must be at least 13 years old.",
  },

  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message:
      "Password must be at least 8 characters long," +
      " include uppercase, lowercase letters and a number.",
  } as ValidationType,

  city: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]+$/,
    message: SETTINGS.label.validation.city,
  },

  street: {
    pattern: /^.{1,}$/,
    message: SETTINGS.label.validation.street,
  },

  postalCode: {
    message: SETTINGS.label.validation.postalCodeGeneric,
    isValid: (value: string, context?: { country?: string }) => {
      const selectedCountryLocalizedName = context?.country;
      const countryLocalizedMap: Record<string, string> = {};

      if (SETTINGS.label.address.countryPl) {
        countryLocalizedMap[SETTINGS.label.address.countryPl] = "PL";
      }
      if (SETTINGS.label.address.countryEn) {
        countryLocalizedMap[SETTINGS.label.address.countryEn] = "UK";
      }

      const countryCode = selectedCountryLocalizedName
        ? countryLocalizedMap[selectedCountryLocalizedName]
        : undefined;

      if (countryCode && POSTAL_CODE_PATTERNS[countryCode]) {
        return POSTAL_CODE_PATTERNS[countryCode].test(value.trim());
      }

      return false;
    },

    getSpecificMessage: (context?: { country?: string }) => {
      const country = context?.country;
      const validationMessages = SETTINGS.label.validation;

      const countryPlLocalized = validationMessages.countryPoland;
      const countryUKLocalized = validationMessages.countryUnitedKingdom;

      if (country === countryPlLocalized) {
        return validationMessages.postalCodePoland;
      }
      if (country === countryUKLocalized) {
        return validationMessages.postalCodeUK;
      }
      return validationMessages.postalCodeGeneric;
    },
  },
};

export const COUNTRY_OPTIONS = (
  settingsLabelAddress: AppTranslation["address"],
): string[] => {
  return [settingsLabelAddress.countryPl, settingsLabelAddress.countryEn];
};

export const AVAILABLE_LANGUAGES = Object.keys(translations);

const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  PL: /^\d{2}-\d{3}$/,
  UK: /^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$/i,
};

// src/types/enums.ts (или constants.ts)

export enum AddressType {
  Billing = "billing",
  Shipping = "shipping",
}
