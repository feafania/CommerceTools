import { ValidationType } from "@/types/types";
import { SETTINGS } from "@/config/settings";
import { COUNTRY_CONFIG } from "@/config/country-config";
import { CountryCode } from "@/types/enum";

const MINIMUM_AGE = 13;

export const VALIDATION: ValidationType = {
  email: {
    pattern: /^(?!\s)([^\s@]+)@([^\s@]+\.[^\s@]+)(?<!\s)$/,
    message: SETTINGS.label.validation.email,
  },
  firstName: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]{1,}$/,
    message: SETTINGS.label.validation.firstName,
  },
  lastName: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]{1,}$/,
    message: SETTINGS.label.validation.lastName,
  },
  dateOfBirth: {
    isValid: (value) => {
      let stringValue = "";
      if (typeof value === "string") {
        stringValue = value;
      } else if (typeof value === "object" && value?.value) {
        stringValue = value.value;
      }

      if (!stringValue) return false;

      const normalized = stringValue.replaceAll("/", ".");
      const parts = normalized.split(".");
      if (parts.length !== 3) return false;

      const day = Number.parseInt(parts[0], 10);
      const month = Number.parseInt(parts[1], 10) - 1;
      const year = Number.parseInt(parts[2], 10);

      if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
        return false;

      const inputDate = new Date(year, month, day);
      if (
        inputDate.getFullYear() !== year ||
        inputDate.getMonth() !== month ||
        inputDate.getDate() !== day
      ) {
        return false;
      }

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

      return age >= MINIMUM_AGE;
    },
    message: SETTINGS.label.validation.dateOfBirth,
  },
  passwordLoginPage: {
    pattern:
      /^(?!\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])?.{8,}(?<!\s)$/,
    message: SETTINGS.label.validation.passwordLoginPage,
  } as ValidationType,
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: SETTINGS.label.validation.password,
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
    isValid: (input) => {
      if (typeof input === "string") {
        return Object.values(COUNTRY_CONFIG).some((config) =>
          config.postalCodePattern.test(input.trim()),
        );
      }

      const { value, countryCode } = input;
      if (!countryCode || !value) return false;

      if (!countryCode) return false;

      const pattern = COUNTRY_CONFIG[countryCode]?.postalCodePattern;
      return pattern ? pattern.test(value.trim()) : false;
    },
    getValidationMessage: (code: CountryCode) =>
      SETTINGS.label.validation.postalCode[code],
  },
};
