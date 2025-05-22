import createInput from "@/components/input/input";
import { AddressType, VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import AuthService from "@/api/services/auth-service";
import { createAddressFields } from "@/components/address/address";

const RegistrationView = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "registration";
    container.className = "view registration-view";

    const h2 = document.createElement("h2");
    h2.className = "registration-title";
    h2.textContent = SETTINGS.label.registration.header;

    const loginDataContainer = document.createElement("div");
    loginDataContainer.className = "form-group";
    loginDataContainer.append(this.renderEmail(), this.renderPassword());

    const userDataContainer = document.createElement("div");
    userDataContainer.className = "form-group";
    userDataContainer.append(
      this.renderFirstName(),
      this.renderLastName(),
      this.renderBirthDay(),
    );

    const form = document.createElement("form");
    form.className = "registration-form form";
    form.append(
      loginDataContainer,
      userDataContainer,
      this.renderAddresses(),
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
    const address1 = createAddressFields(AddressType.Shipping);
    container.append(address1);

    // Checkbox
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "address-toggle checkbox-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "show-billing-address";

    const label = document.createElement("label");
    label.htmlFor = "show-billing-address";
    label.textContent = SETTINGS.label.registration.openBillingAddress;

    toggleWrapper.append(checkbox, label);
    container.append(toggleWrapper);

    // Second address block
    const address2 = createAddressFields(AddressType.Billing);
    address2.className = "address-block secondary-address";
    address2.style.display = "none";
    container.append(address2);

    // Placeholder for billing address
    let billingAddress: HTMLDivElement | undefined = undefined;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        billingAddress = createAddressFields(AddressType.Billing);
        container.append(billingAddress);
      } else {
        if (billingAddress && container.contains(billingAddress)) {
          billingAddress.remove();
          billingAddress = undefined;
        }
      }
    });

    return container;
  },

  renderEmail(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.login,
      name: "email",
      placeholder: SETTINGS.label.registration.login,
      id: "email",
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
      class: "submit-registration-button btn",
    });
  },

  async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const isValid = await handleOnSubmit(form, "registration");
    if (!isValid) return;

    const formData = new FormData(form);

    const customer = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstname") as string,
      lastName: formData.get("lastname") as string,
      dateOfBirth: formData.get("birthday") as string,
      isSameAddress: !(formData.get("show-billing-address") === "on"),
      shippingAddress: {
        streetName: formData.get("shipping-street") as string,
        streetNumber: formData.get("shipping-number") as string,
        postalCode: formData.get("shipping-zip") as string,
        city: formData.get("shipping-city") as string,
        country: formData.get("shipping-country") as string,
      },
      billingAddress: {
        streetName:
          (formData.get("billing-street") as string) ||
          (formData.get("shipping-street") as string),
        streetNumber:
          (formData.get("billing-number") as string) ||
          (formData.get("shipping-number") as string),
        postalCode:
          (formData.get("billing-zip") as string) ||
          (formData.get("shipping-zip") as string),
        city:
          (formData.get("billing-city") as string) ||
          (formData.get("shipping-city") as string),
        country:
          (formData.get("billing-country") as string) ||
          (formData.get("shipping-country") as string),
      },
      setBillingAsDefault: true,
      setShippingAsDefault: true,
    };

    await AuthService.register(customer);
  },
};

export default RegistrationView;
