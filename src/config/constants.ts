import { ValidationType } from "../types/types";

export const VIEW_CONTAINER_NAME = "view-container";

export const VALIDATION = {
  login: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address (e.g., example@email.com).",
  },
  email: {
    pattern: /^(?!\s)([^\s@]+)@([^\s@]+\.[^\s@]+)(?<!\s)$/,
    message:
      "Please enter a valid email address (e.g., user@example.com). It must" +
      " not have spaces, must include '@', and a valid domain (e.g., example.com).",
  },
  firstName: {
    pattern: /^[A-Za-z]{1,}$/,
    message: "First name must contain only letters and at least one character.",
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
  passwordLoginPage: {
    pattern:
      /^(?!\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])?.{8,}(?<!\s)$/,
    message:
      "Password must be at least 8 characters long, include uppercase and lowercase" +
      " letters, a digit, and optionally a special character (!@#$%^&*). It must not" +
      " have leading or trailing spaces.",
  } as ValidationType,
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message:
      "Password must be at least 8 characters long," +
      " include uppercase, lowercase letters and a number.",
  } as ValidationType,
};
