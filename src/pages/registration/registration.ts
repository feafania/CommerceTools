import "./registration.css";
import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";

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
      this.renderAddresses(),
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

  renderAddresses(): HTMLElement {
    const container = document.createElement("div");
    container.className = "registration-address-container";

    // First address block
    // const address1 = createAddressFields("Shipping");

    // Checkbox
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "address-toggle";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "show-billing-address";

    const label = document.createElement("label");
    label.htmlFor = "show-billing-address";

    toggleWrapper.append(checkbox, label);
    container.append(toggleWrapper);

    // Second address block
    //const address2 = createAddressFields("Billing");
    // address2.className = "address-block secondary-address";
    // address2.style.display = "none";

    // Placeholder for billing address
    // let billingAddress: HTMLDivElement | null = null;

    // checkbox.addEventListener("change", () => {
    //   if (checkbox.checked) {
    //     billingAddress = createAddressFields("Billing");
    //     container.appendChild(billingAddress);
    //   } else {
    //     if (billingAddress && container.contains(billingAddress)) {
    //       container.removeChild(billingAddress);
    //       billingAddress = null;
    //     }
    //   }
    // });

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
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    await handleOnSubmit(form, "registration");
  },
};

export default RegistrationView;
