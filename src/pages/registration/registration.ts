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
      this.renderCountry(),
      this.renderCity(),
      this.renderStreet(),
      this.renderPostcode(),
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
      validation: VALIDATION.username,
    });
  },

  renderLastName(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.lastName,
      name: "lastname",
      placeholder:
        "Enter your " + SETTINGS.label.registration.lastName + " name...",
      id: "lastname",
      class: "registration-input",
      validation: VALIDATION.username,
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
      validation: VALIDATION.username,
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
      validation: VALIDATION.username,
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
      validation: VALIDATION.username,
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
      validation: VALIDATION.username,
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
      validation: VALIDATION.username,
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

    const name = (formData.get("name") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    const nameInput = form.querySelector<HTMLInputElement>("#name");
    const passwordInput = form.querySelector<HTMLInputElement>("#password");

    if (!name) {
      showModalMessage("Please enter your name.");
      nameInput?.focus();
      return;
    }

    if (!VALIDATION.username.pattern.test(name)) {
      showModalMessage("Name is invalid. Please follow the rules.");
      nameInput?.focus();
      return;
    }

    if (!password) {
      showModalMessage("Please enter your password.");
      passwordInput?.focus();
      return;
    }

    if (!VALIDATION.password.pattern.test(password)) {
      showModalMessage("Password is invalid. Please follow the rules.");
      passwordInput?.focus();
      return;
    }

    // const newUser: UserType = { name, password };
    // await apiClient.register(newUser);
  },
};

export default RegistrationView;
