import { SETTINGS } from "@/config/settings";
import { VALIDATION } from "@/config/validation";
import { FormFieldsMap } from "@/types/types";
import { FormType } from "@/types/enum";

export const FORM_FIELDS: FormFieldsMap = {
  [FormType.LOGIN]: [
    {
      name: "email",
      label: SETTINGS.label.login.email,
      validation: VALIDATION.email,
    },
    {
      name: "password",
      label: SETTINGS.label.login.password,
      validation: VALIDATION.passwordLoginPage,
    },
  ],
  [FormType.REGISTRATION]: [
    {
      name: "email",
      get label() {
        return SETTINGS.label.registration.email;
      },
      validation: VALIDATION.email,
    },
    {
      name: "password",
      get label() {
        return SETTINGS.label.registration.password;
      },
      validation: VALIDATION.password,
    },
    {
      name: "firstname",
      get label() {
        return SETTINGS.label.registration.firstName;
      },
      validation: VALIDATION.firstName,
    },
    {
      name: "lastname",
      get label() {
        return SETTINGS.label.registration.lastName;
      },
      validation: VALIDATION.lastName,
    },
    {
      name: "birthday",
      get label() {
        return SETTINGS.label.address.country;
      },
      validation: VALIDATION.dateOfBirth,
    },
    {
      name: "billing-country",
      get label() {
        return SETTINGS.label.address.country;
      },
      validation: VALIDATION.country,
    },
    {
      name: "billing-city",
      get label() {
        return SETTINGS.label.address.city;
      },
      validation: VALIDATION.city,
    },
    {
      name: "billing-street",
      get label() {
        return SETTINGS.label.address.street;
      },
      validation: VALIDATION.street,
    },
    {
      name: "billing-zip",
      get label() {
        return SETTINGS.label.address.postalCode;
      },
      validation: VALIDATION.postalCode,
    },
    {
      name: "shipping-country",
      get label() {
        return SETTINGS.label.address.country;
      },
      validation: VALIDATION.country,
    },
    {
      name: "shipping-city",
      get label() {
        return SETTINGS.label.address.city;
      },
      validation: VALIDATION.city,
    },
    {
      name: "shipping-street",
      get label() {
        return SETTINGS.label.address.street;
      },
      validation: VALIDATION.street,
    },
    {
      name: "shipping-postalcode",
      get label() {
        return SETTINGS.label.address.postalCode;
      },
      validation: VALIDATION.postalCode,
    },
  ],
};
