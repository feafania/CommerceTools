import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { CountryCode, FormType, PageType } from "@/types/enum";
import { CountryValueType, FormField } from "@/types/types";
import { FORM_FIELDS } from "@/config/form-fields";
import { VALIDATION } from "@/config/validation";
import { getCountryCode } from "@/utils/helpers";
import { ValidationRule } from "@/types/interfaces";

export async function handleOnSubmit(
  form: HTMLFormElement,
  type: FormType,
): Promise<boolean> {
  const formData = new FormData(form);
  const formFields: FormField[] = FORM_FIELDS[type];

  for (const field of formFields) {
    const rawValue = formData.get(field.name);
    const element = form.querySelector<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(`[name="${field.name}"]`);
    if (!element || element.offsetParent === null || element.disabled) {
      continue;
    }

    if (!rawValue) {
      showModalMessage(`${SETTINGS.label.login.emptyField} ${field.label}.`);
      element?.focus();
      return false;
    }

    const value = rawValue.toString().trim();
    const isValid = element ? validateFormField(element, value) : true;

    if (!isValid && element) {
      const { validationRule, countryCode } = defineValidation(element, form);
      showModalMessage(getValidationMessage(validationRule, countryCode));
      return false;
    }
  }

  return true;
}

export function isValidPageType(path: string): path is PageType {
  return Object.values(PageType).includes(path as PageType);
}

export function validateElement(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): boolean {
  const value = element.value.trim();
  return validateFormField(element, value);
}

function validateFormField(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  value: string,
): boolean {
  const form = element.closest("form");

  const { validationName, validationRule, countryCode } = defineValidation(
    element,
    form,
  );

  if (!validationRule) return true;
  const isValid = isValidField(validationName, {
    value,
    countryCode,
  });

  const errorDiv = element.parentElement?.querySelector(".input-error");

  if (isValid) {
    errorDiv?.remove();
  } else {
    if (errorDiv) {
      errorDiv.textContent = getValidationMessage(validationRule, countryCode);
    } else {
      const newError = document.createElement("div");
      newError.className = "input-error error-message";
      newError.textContent = getValidationMessage(validationRule, countryCode);
      element.after(newError);
    }

    element?.focus();
  }

  return isValid;
}

function defineValidation(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  form: HTMLFormElement | null,
) {
  const validationName = element.dataset.validationName ?? element.name;
  const validationRule = VALIDATION[validationName];

  let countryCode: CountryCode | undefined;

  const relatedCountryField =
    element.dataset.relatedCountryField?.trim() || "country";
  if (relatedCountryField && form) {
    const countryElement = form.querySelector<
      HTMLInputElement | HTMLSelectElement
    >(`[name="${relatedCountryField}"], #${relatedCountryField}`);
    const countryValue = countryElement?.value.trim() || "";
    if (countryValue) {
      countryCode = getCountryCode(countryValue);
    }
  }
  return {
    validationName,
    validationRule,
    countryCode,
  };
}

function isValidField(
  fieldName: string,
  value: string | CountryValueType | undefined,
): boolean {
  if (!(fieldName in VALIDATION)) return true;

  const validationRule = VALIDATION[fieldName];
  if (!validationRule) return true;
  if (value === undefined) return false;

  if (validationRule.isValid) {
    return validationRule.isValid(value);
  }

  if (validationRule.pattern) {
    if (typeof value === "string") {
      return validationRule.pattern.test(value);
    }
    if (
      typeof value === "object" &&
      "value" in value &&
      typeof value.value === "string"
    ) {
      return validationRule.pattern.test(value.value);
    }
  }

  return true;
}

function getValidationMessage(
  validationRule: ValidationRule | undefined,
  countryCode?: CountryCode,
): string {
  if (!validationRule) {
    return SETTINGS.label.validation.commonError;
  }

  if (validationRule.getValidationMessage && countryCode) {
    return validationRule.getValidationMessage(countryCode);
  }

  if (validationRule.message) {
    return validationRule.message;
  }

  return SETTINGS.label.validation.commonError;
}
