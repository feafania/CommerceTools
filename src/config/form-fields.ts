import { VALIDATION } from "@/config/constants";
import { SETTINGS } from "@/config/settings";

export const loginFormFields = [
  {
    name: "username",
    label: SETTINGS.label.login.password,
    validation: VALIDATION.email,
  },
  {
    name: "password",
    label: SETTINGS.label.login.password,
    validation: VALIDATION.passwordLoginPage,
  },
];

export const registrationFormFields = [
  {
    name: "name",
    label: SETTINGS.label.registration.login,
    validation: VALIDATION.email,
  },
  {
    name: "password",
    label: SETTINGS.label.registration.password,
    validation: VALIDATION.password,
  },
  {
    name: "firstname",
    label: SETTINGS.label.registration.firstName,
    validation: VALIDATION.firstName,
  },
  {
    name: "lastname",
    label: SETTINGS.label.registration.lastName,
    validation: VALIDATION.lastName,
  },
  {
    name: "birthday",
    label: SETTINGS.label.registration.birthDay,
    validation: VALIDATION.dateOfBirth,
  },
];
