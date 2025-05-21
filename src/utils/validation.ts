import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { validateField } from "@/utils/helpers";
import { registrationFormFields, loginFormFields } from "@/config/form-fields";

type SubmitType = "registration" | "login";

export async function handleOnSubmit(
  form: HTMLFormElement,
  type: SubmitType,
): Promise<void> {
  const formData = new FormData(form);
  const formFields =
    type === "registration" ? registrationFormFields : loginFormFields;

  for (const field of formFields) {
    const value = (formData.get(field.name) as string)?.trim();
    const inputElement = form.querySelector<HTMLInputElement>(`#${field.name}`);

    if (!value) {
      showModalMessage(`${SETTINGS.label.login.emptyField} ${field.label}.`);
      inputElement?.focus();
      return;
    }

    const validation = field.validation;

    if (!validateField(value, validation)) {
      showModalMessage(validation.message);
      inputElement?.focus();
      return;
    }
  }

  // const newUser: UserType = { name, password };
  // await apiClient.register(newUser);
}
