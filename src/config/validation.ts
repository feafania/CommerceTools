import { ValidationType } from "@/types/types";
import { SETTINGS } from "@/config/settings";
import { COUNTRY_CONFIG } from "@/config/country-config";
import { CountryCode } from "@/types/enum";

const MINIMUM_AGE = 13;

export const VALIDATION: ValidationType = {
  email: {
    pattern: /^(?!\s)([^\s@]+)@([^\s@]+\.[^\s@]+)(?<!\s)$/,
    get message() {
      return SETTINGS.label.validation.email;
    },
  },

  password: {
    pattern:
      /^(?!\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])?.{8,}(?<!\s)$/,
    get message() {
      return SETTINGS.label.validation.password;
    },
  } as ValidationType,

  firstName: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]{1,}$/,
    get message() {
      return SETTINGS.label.validation.firstName;
    },
  },

  lastName: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]{1,}$/,
    get message() {
      return SETTINGS.label.validation.lastName;
    },
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

      let day: number, month: number, year: number;

      if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
        // ISO формат: YYYY-MM-DD
        const parts = stringValue.split("-");
        year = Number.parseInt(parts[0], 10);
        month = Number.parseInt(parts[1], 10) - 1;
        day = Number.parseInt(parts[2], 10);
      } else {
        // Старый формат: DD.MM.YYYY или DD/MM/YYYY
        const normalized = stringValue.replaceAll("/", ".").trim();
        const parts = normalized.split(".");
        if (parts.length !== 3) return false;

        day = Number.parseInt(parts[0], 10);
        month = Number.parseInt(parts[1], 10) - 1;
        year = Number.parseInt(parts[2], 10);
      }

      if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
        return false;
      }

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
    get message() {
      return SETTINGS.label.validation.dateOfBirth;
    },
  },

  country: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]+$/,
    get message() {
      return SETTINGS.label.validation.country;
    },
  },

  city: {
    pattern: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\-]+$/,
    get message() {
      return SETTINGS.label.validation.city;
    },
  },

  street: {
    pattern: /^.{1,}$/,
    get message() {
      return SETTINGS.label.validation.street;
    },
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
