import "./registration.css";
import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { createAddressFields } from "@/components/address/address";
import { AddressType } from "@/config/constants";

const RegistrationView = {
  async render(): Promise<HTMLElement> {
    //SETTINGS.setLang("pl"); //here is just test to set the language

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
      //this.renderCountry(),
      //this.renderCity(),
      //this.renderStreet(),
      //this.renderPostcode(),
      createAddressFields(AddressType.Billing), //here is just test to render the address block
      this.renderName(),
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
      placeholder:
        "Enter your " + SETTINGS.label.registration.firstName + "...",
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
      placeholder:
        "Enter your " + SETTINGS.label.registration.lastName + " ...",
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
      placeholder:
        "Enter your " + SETTINGS.label.registration.birthDay + " ...",
      id: "birthday",
      class: "registration-input",
      validation: VALIDATION.dateOfBirth,
    });
  },

  renderEmail(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.login,
      name: "birthday",
      placeholder:
        "Enter your " + SETTINGS.label.registration.birthDay + " ...",
      id: "birthday",
      class: "registration-input",
      validation: VALIDATION.dateOfBirth,
    });
  },

  renderCountry(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.country,
      name: "country",
      placeholder: "Enter your " + SETTINGS.label.registration.country + " ...",
      id: "country",
      class: "registration-input",
      validation: VALIDATION.login,
    });
  },

  renderCity(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.city,
      name: "city",
      placeholder: "Enter your " + SETTINGS.label.registration.city + " ...",
      id: "city",
      class: "registration-input",
      validation: VALIDATION.login,
    });
  },

  renderStreet(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.street,
      name: "street",
      placeholder: "Enter your " + SETTINGS.label.registration.street + " ...",
      id: "street",
      class: "registration-input",
      validation: VALIDATION.login,
    });
  },

  renderPostcode(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.postalCode,
      name: "postcode",
      placeholder:
        "Enter your " + SETTINGS.label.registration.postalCode + " ...",
      id: "postcode",
      class: "registration-input",
      validation: VALIDATION.login,
    });
  },

  renderName(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.login,
      name: "name",
      placeholder: "Enter your " + SETTINGS.label.registration.login + "...",
      id: "name",
      class: "registration-input",
      validation: VALIDATION.login,
    });
  },

  renderPassword(): HTMLElement {
    return createInput({
      type: "password",
      label: SETTINGS.label.registration.password,
      name: "password",
      placeholder: "Enter your password...",
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
        validation: VALIDATION.login,
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
