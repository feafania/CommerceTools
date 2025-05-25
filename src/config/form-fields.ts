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
      label: SETTINGS.label.registration.email,
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
      label: SETTINGS.label.address.country,
      validation: VALIDATION.dateOfBirth,
    },
    {
      name: "billing-country",
      label: SETTINGS.label.address.country,
      validation: VALIDATION.country,
    },
    {
      name: "billing-city",
      label: SETTINGS.label.address.city,
      validation: VALIDATION.city,
    },
    {
      name: "billing-street",
      label: SETTINGS.label.address.street,
      validation: VALIDATION.street,
    },
    {
      name: "billing-zip",
      label: SETTINGS.label.address.postalCode,
      validation: VALIDATION.postalCode,
    },
    {
      name: "shipping-country",
      label: SETTINGS.label.address.country,
      validation: VALIDATION.country,
    },
    {
      name: "shipping-city",
      label: SETTINGS.label.address.city,
      validation: VALIDATION.city,
    },
    {
      name: "shipping-street",
      label: SETTINGS.label.address.street,
      validation: VALIDATION.street,
    },
    {
      name: "shipping-postalcode",
      label: SETTINGS.label.address.postalCode,
      validation: VALIDATION.postalCode,
    },
  ],
};
