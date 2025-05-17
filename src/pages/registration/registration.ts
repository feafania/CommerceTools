import "./registration.css";
import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";

const RegistrationView = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "registration";
    container.className = "view registration-view";

    const h2 = document.createElement("h2");
    h2.className = "registration-title";
    h2.textContent = SETTINGS.label.registration.header;

    const form = document.createElement("form");
    form.className = "registration-form";
    form.append(
      this.renderFirstName(),
      this.renderLastName(),
      this.renderBirthDay(),
      this.renderAddress(),
      this.renderEmail(),
      this.renderPassword(),
      this.renderSubmit(),
    );

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit(event);
    });

    container.append(h2, form);
    return container;
  },

  renderFirstName(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.firstName,
      name: "firstname",
      placeholder: SETTINGS.label.registration.firstName,
      id: "firstname",
      class: "registration-input",
      validation: VALIDATION.firstName,
    });
  },

  renderLastName(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.lastName,
      name: "lastname",
      placeholder: SETTINGS.label.registration.lastName,
      id: "lastname",
      class: "registration-input",
      validation: VALIDATION.lastName,
    });
  },

  renderBirthDay(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.birthDay,
      name: "birthday",
      placeholder: SETTINGS.label.registration.birthDay,
      id: "birthday",
      class: "registration-input",
      validation: VALIDATION.dateOfBirth,
    });
  },

  renderAddress(): HTMLElement {
    const container = document.createElement("div");
    container.className = "registration-address-container";

    // First address block
    const address1 = document.createElement("div");
    address1.className = "address-block";
    address1.textContent = "Primary Address (Coming soon...)";

    // Checkbox
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "address-toggle";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "show-second-address";

    const label = document.createElement("label");
    label.htmlFor = "show-second-address";
    label.textContent = "Add secondary address";

    toggleWrapper.append(checkbox, label);

    // Second address block
    const address2 = document.createElement("div");
    address2.className = "address-block secondary-address";
    address2.textContent = "Secondary Address (Coming soon...)";
    address2.style.display = "none";

    // Toggle logic
    checkbox.addEventListener("change", () => {
      address2.style.display = checkbox.checked ? "block" : "none";
    });

    container.append(address1, toggleWrapper, address2);
    return container;
  },

  renderEmail(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.login,
      name: "name",
      placeholder: SETTINGS.label.registration.login,
      id: "name",
      class: "registration-input",
      validation: VALIDATION.email,
    });
  },

  renderPassword(): HTMLElement {
    return createInput({
      type: "password",
      label: SETTINGS.label.registration.password,
      name: "password",
      placeholder: SETTINGS.label.registration.password,
      id: "password",
      class: "password-input",
      validation: VALIDATION.password,
    });
  },

  renderSubmit(): HTMLElement {
    return createButton({
      name: SETTINGS.label.registration.submit,
      id: "submit-registration",
      class: "submit-registration-button",
    });
  },

  async onSubmit(event: SubmitEvent) {
    console.log("Registration form submitted");

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const formFields = [
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

    for (const field of formFields) {
      const value = (formData.get(field.name) as string)?.trim();
      const inputElement = form.querySelector<HTMLInputElement>(
        `#${field.name}`,
      );

      if (!value) {
        showModalMessage(`Please enter your ${field.label}.`);
        inputElement?.focus();
        return;
      }

      const validation = field.validation;
      const isPatternValid =
        "pattern" in validation && validation.pattern
          ? validation.pattern.test(value)
          : true;
      const isValid =
        "isValid" in validation && validation.isValid
          ? validation.isValid(value)
          : true;

      if (!isPatternValid || !isValid) {
        showModalMessage(validation.message);
        inputElement?.focus();
        return;
      }
    }

    // const newUser: UserType = { name, password };
    // await apiClient.register(newUser);
  },
};

export default RegistrationView;
