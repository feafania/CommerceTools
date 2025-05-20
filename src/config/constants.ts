import { ValidationType } from "../types/types";

import { SETTINGS } from "./settings";

export const VIEW_CONTAINER_NAME = "view-container";

export const MINIMUM_AGE = 13;

export const VALIDATION = {
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
};
