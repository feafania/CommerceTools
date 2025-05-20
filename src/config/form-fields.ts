import { VALIDATION } from "@/config/constants";
import { SETTINGS } from "@/config/settings";

export const loginFormFields = [
  { name: "username", label: "Name", validation: VALIDATION.email },
  {
    name: "password",
    label: SETTINGS.label.login.password,
    validation: VALIDATION.passwordLoginPage,
  },
];
