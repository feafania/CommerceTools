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
      name: "firstName",
      label: SETTINGS.label.registration.firstName,
      validation: VALIDATION.firstName,
    },
    {
      name: "lastName",
      label: SETTINGS.label.registration.lastName,
      validation: VALIDATION.lastName,
    },
    {
      name: "dateOfBirth",
      label: SETTINGS.label.registration.birthDay,
      validation: VALIDATION.dateOfBirth,
    },
  ],
};
