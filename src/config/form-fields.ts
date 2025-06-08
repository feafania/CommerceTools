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
        return SETTINGS.label.registration.birthDay;
      },
      validation: VALIDATION.dateOfBirth,
    },
    {
      name: "country-shipping",
      get label() {
        return SETTINGS.label.address.country;
      },
      validation: VALIDATION.country,
    },
    {
      name: "city-shipping",
      get label() {
        return SETTINGS.label.address.city;
      },
      validation: VALIDATION.city,
    },
    {
      name: "street-shipping",
      get label() {
        return SETTINGS.label.address.street;
      },
      validation: VALIDATION.street,
    },
    {
      name: "postalcode-shipping",
      get label() {
        return SETTINGS.label.address.postalCode;
      },
      validation: VALIDATION.postalCode,
    },
    {
      name: "country-billing",
      get label() {
        return SETTINGS.label.address.country;
      },
      validation: VALIDATION.country,
    },
    {
      name: "city-billing",
      get label() {
        return SETTINGS.label.address.city;
      },
      validation: VALIDATION.city,
    },
    {
      name: "street-billing",
      get label() {
        return SETTINGS.label.address.street;
      },
      validation: VALIDATION.street,
    },
    {
      name: "postalcode-billing",
      get label() {
        return SETTINGS.label.address.postalCode;
      },
      validation: VALIDATION.postalCode,
    },
  ],
  [FormType.PROFILE]: [
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
        return SETTINGS.label.registration.birthDay;
      },
      validation: VALIDATION.dateOfBirth,
    },
    {
      name: "country",
      get label() {
        return SETTINGS.label.address.country;
      },
      validation: VALIDATION.country,
    },
    {
      name: "city",
      get label() {
        return SETTINGS.label.address.city;
      },
      validation: VALIDATION.city,
    },
    {
      name: "street",
      get label() {
        return SETTINGS.label.address.street;
      },
      validation: VALIDATION.street,
    },
    {
      name: "postalcode",
      get label() {
        return SETTINGS.label.address.postalCode;
      },
      validation: VALIDATION.postalCode,
    },
  ],
  [FormType.PASSWORD]: [
    {
      name: "current-password",
      get label() {
        return SETTINGS.label.changePassword.current;
      },
      validation: VALIDATION.password,
    },
    {
      name: "new-password",
      get label() {
        return SETTINGS.label.changePassword.newPassword;
      },
      validation: VALIDATION.password,
    },
    {
      name: "confirm-password",
      get label() {
        return SETTINGS.label.changePassword.confirmNewPassword;
      },
      validation: VALIDATION.password,
    },
  ],
};
