import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { registrationFormFields, loginFormFields } from "@/config/form-fields";
import { ValidationRule } from "@/types/interfaces";
import { PageType } from "@/types/enum";

type SubmitType = "registration" | "login";

export async function handleOnSubmit(
  form: HTMLFormElement,
  type: SubmitType,
): Promise<boolean> {
  const formData = new FormData(form);
  const formFields =
    type === "registration" ? registrationFormFields : loginFormFields;

  for (const field of formFields) {
    const value = (formData.get(field.name) as string)?.trim();
    const inputElement = form.querySelector<HTMLInputElement>(`#${field.name}`);

    if (!value) {
      showModalMessage(`${SETTINGS.label.login.emptyField} ${field.label}.`);
      inputElement?.focus();
      return false;
    }

    const validation = field.validation;

    if (!validateField(value, validation)) {
      showModalMessage(validation.message);
      inputElement?.focus();
      return false;
    }
  }
  return true;
}

export function validateField(
  value: string,
  validation: ValidationRule,
): boolean {
  const isPatternValid = validation.pattern?.test(value) ?? true;
  const isValid = validation.isValid?.(value) ?? true;
  return isPatternValid && isValid;
}

export function isValidPageType(path: string): path is PageType {
  return Object.values(PageType).includes(path as PageType);
}
