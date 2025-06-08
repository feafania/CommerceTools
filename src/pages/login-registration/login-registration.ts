import "./login-registration.css";
import createInput from "@/components/input/input";
import createButton from "@/components/button/button";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import AuthService from "@/api/services/auth-service";
import { AddressType, FormType, PageType } from "@/types/enum";
import AddressElement from "@/components/address/address";
import createEyeButton from "@/components/eye-button/eye-button";
import Header from "@/components/layout/header/header";
import PageRouter from "@/router/page-router";
import showModalMessage from "@/components/modal-window/modal-window";
import { isInCustomer } from "@/utils/type-guards";
import { InAddress, InCustomer } from "@/types/interfaces";
import createCheckbox from "@/components/checkbox/checkbox";
import { getState } from "@/utils/helpers";

const LoginRegistrationView = {
  shippingAddressElement: undefined as AddressElement | undefined,
  billingAddressElement: undefined as AddressElement | undefined,
  async renderRegistrationForm(): Promise<HTMLElement> {
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
      this.renderSubmit(SETTINGS.label.registration.submit),
    );

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.onRegistrationSubmit(event);
    });

    container.append(h2, form, this.renderRedirectText(FormType.REGISTRATION));
    return container;
  },

  async renderLoginForm(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "login";
    container.className = "view login-view";

    const h2 = document.createElement("h2");
    h2.className = "login-title";
    h2.textContent = SETTINGS.label.login.header;

    const form = document.createElement("form");
    form.className = "login-form form";
    form.append(
      this.renderEmail(),
      this.renderPassword(),
      this.renderSubmit(SETTINGS.label.login.submit),
    );

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.onLoginSubmit(event);
    });

    container.append(h2, form, this.renderRedirectText(FormType.LOGIN));
    return container;
  },

  renderFirstName(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.firstName,
      name: "firstname",
      placeholder: `${SETTINGS.label.registration.firstName}...`,
      id: "firstname",
      class: "firstname-input",
      validationName: "firstName",
    });
  },

  renderLastName(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.lastName,
      name: "lastname",
      placeholder: `${SETTINGS.label.registration.lastName}...`,
      id: "lastname",
      class: "lastname-input",
      validationName: "lastName",
    });
  },

  renderBirthDay(): HTMLElement {
    return createInput({
      type: "date",
      label: SETTINGS.label.registration.birthDay,
      name: "birthday",
      // placeholder: `${SETTINGS.label.registration.birthDay}...`,
      id: "birthday",
      class: "birthday-input",
      validationName: "dateOfBirth",
    });
  },

  renderAddresses(): HTMLElement {
    const container = document.createElement("div");
    container.className = "registration-address-container";

    // First address block
    this.shippingAddressElement = new AddressElement(AddressType.Shipping);
    this.shippingAddressElement.render();
    container.append(this.shippingAddressElement.element);

    // Checkbox
    const checkboxWrapper = createCheckbox({
      label: SETTINGS.label.address.isSameAddress,
      name: "show-billing-address",
      id: "show-billing-address",
    });
    const checkbox = checkboxWrapper.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    container.append(checkboxWrapper);

    if (checkbox) {
      // Second address block
      this.billingAddressElement = new AddressElement(AddressType.Billing);
      this.billingAddressElement.render();
      this.billingAddressElement.element.classList.add("secondary-address");

      checkbox.addEventListener(
        "change",
        this.toggleBillingAddress(container, checkbox).bind(this),
      );
      this.toggleBillingAddress(container, checkbox).bind(this)();
    }

    return container;
  },

  renderEmail(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.registration.email,
      name: "email",
      placeholder: `${SETTINGS.label.registration.email}...`,
      id: "email",
      class: "email-input",
    });
  },

  renderPassword(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "password-wrapper";

    const passwordInput = createInput({
      type: "password",
      label: SETTINGS.label.login.password,
      name: "password",
      placeholder: `${SETTINGS.label.login.password}...`,
      id: "password",
      class: "password-input",
    });

    const eyeButton = createEyeButton();
    wrapper.append(passwordInput, eyeButton);

    return wrapper;
  },

  renderRedirectText(type: FormType): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "redirect-wrapper";

    const text = document.createElement("span");
    const link = document.createElement("a");
    link.className = "redirect-link";

    let navigatedPage;
    if (type === FormType.LOGIN) {
      text.textContent = SETTINGS.label.nav.directions.toSignUp + " ";
      link.textContent = SETTINGS.label.nav.directionsLabels.toSignUp;
      navigatedPage = PageType.registration;
    } else {
      text.textContent = SETTINGS.label.nav.directions.toSignIn + " ";
      link.textContent = SETTINGS.label.nav.directionsLabels.toSignIn;
      navigatedPage = PageType.login;
    }
    link.href = `#${navigatedPage}`;
    link.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      PageRouter.navigateTo(navigatedPage);
    });

    text.append(link);
    wrapper.append(text);
    return wrapper;
  },

  renderSubmit(submitName: string): HTMLElement {
    return createButton({
      type: "submit",
      name: submitName,
      id: "submit-registration-login",
      class: "submit-registration-login-button submit",
    });
  },

  async onRegistrationSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;

    const isValid = await handleOnSubmit(form, FormType.REGISTRATION);
    if (!isValid) return;

    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const customer = this.setCustomer(formData);
    const user = await AuthService.register(customer);
    if (user && isInCustomer(user)) {
      const response = await AuthService.login(email, password);
      if (response && "email" in response) {
        PageRouter.navigateTo(PageType.main);
      } else {
        // error
        PageRouter.navigateTo(PageType.login);
      }
      Header.setUsername();
      showModalMessage(SETTINGS.label.messages.onSignUp);
    }
  },

  async onLoginSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const isValid = await handleOnSubmit(form, FormType.LOGIN);
    if (!isValid) return;

    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const user = await AuthService.login(email, password);
    if (user && isInCustomer(user)) {
      PageRouter.navigateTo(PageType.main);
      showModalMessage(SETTINGS.label.messages.onSignIn);
    }
  },

  setCustomer(formData: FormData): InCustomer {
    const isSameAddress = formData.get("show-billing-address") !== "on";

    const shippingAddress: InAddress = {
      streetName: formData.get("street-shipping") as string,
      streetNumber: formData.get("number-shipping") as string,
      postalCode: formData.get("postalcode-shipping") as string,
      city: formData.get("city-shipping") as string,
      country: formData.get("country-shipping") as string,
      key: "shipping-address",
      isDefaultShipping:
        formData.get("default-shipping-address-shipping") === "on",
      isDefaultBilling: isSameAddress
        ? formData.get("default-billing-address-shipping") === "on"
        : false,
    };

    const billingAddress: InAddress | undefined = isSameAddress
      ? undefined
      : {
          streetName: formData.get("street-billing") as string,
          streetNumber: formData.get("number-billing") as string,
          postalCode: formData.get("postalcode-billing") as string,
          city: formData.get("city-billing") as string,
          country: formData.get("country-billing") as string,
          key: "billing-address",
          isDefaultShipping: false,
          isDefaultBilling:
            formData.get("default-billing-address-billing") === "on",
        };
    const addresses: InAddress[] = [shippingAddress];
    if (!isSameAddress && billingAddress) {
      addresses.push(billingAddress);
    }

    return {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstname") as string,
      lastName: formData.get("lastname") as string,
      dateOfBirth: formData.get("birthday") as string,
      addresses,
    };
  },

  toggleBillingAddress(container: HTMLDivElement, checkbox: HTMLInputElement) {
    return () => {
      const showBilling = checkbox?.checked;
      const address2: HTMLElement | undefined = this.billingAddressElement
        ? this.billingAddressElement.element
        : undefined;
      const address1: HTMLElement | undefined = this.shippingAddressElement
        ? this.shippingAddressElement.element
        : undefined;

      if (showBilling && address2) {
        this.manageShippingAddress();
        this.manageBillingAddress(container, address2);
      } else if (!showBilling) {
        if (address2) {
          const shippingDefaultBillingCheckbox = address1
            ? address1.querySelector<HTMLInputElement>(
                `#default-billing-address-${AddressType.Shipping}`,
              )
            : undefined;
          if (shippingDefaultBillingCheckbox) {
            const savedValue = getState(shippingDefaultBillingCheckbox.id);
            if (typeof savedValue === "string") {
              shippingDefaultBillingCheckbox.checked = savedValue === "on";
            }
            shippingDefaultBillingCheckbox.value =
              shippingDefaultBillingCheckbox.checked ? "on" : "off";
          }
          address2.remove();
        }
        const shippingDefaultBillingCheckboxWrapper = address1
          ? address1.querySelector<HTMLInputElement>(
              `#default-billing-address-${AddressType.Shipping}-wrapper`,
            )
          : undefined;
        if (shippingDefaultBillingCheckboxWrapper) {
          shippingDefaultBillingCheckboxWrapper.style.display = "";
        }
      }
    };
  },

  manageBillingAddress(container: HTMLDivElement, address2: HTMLElement) {
    container.append(address2);
    const billingDefaultShippingCheckbox =
      address2.querySelector<HTMLInputElement>(
        `#default-shipping-address-${AddressType.Billing}`,
      );
    const billingDefaultBillingCheckbox =
      address2.querySelector<HTMLInputElement>(
        `#default-billing-address-${AddressType.Billing}`,
      );
    if (billingDefaultShippingCheckbox) {
      billingDefaultShippingCheckbox.checked = false;
      billingDefaultShippingCheckbox.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
    }
    if (billingDefaultBillingCheckbox) {
      const savedValue = getState(billingDefaultBillingCheckbox.id);
      if (typeof savedValue === "string") {
        billingDefaultBillingCheckbox.checked = savedValue === "on";
      }
      billingDefaultBillingCheckbox.value =
        billingDefaultBillingCheckbox.checked ? "on" : "off";
    }

    const billingDefaultShippingCheckboxWrapper = address2
      ? address2.querySelector<HTMLInputElement>(
          `#default-shipping-address-${AddressType.Billing}-wrapper`,
        )
      : undefined;
    if (billingDefaultShippingCheckbox) {
      billingDefaultShippingCheckbox.checked = false;
      billingDefaultShippingCheckbox.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
    }
    if (billingDefaultShippingCheckboxWrapper) {
      billingDefaultShippingCheckboxWrapper.style.display = "none";
    }
  },

  manageShippingAddress() {
    const address1: HTMLElement | undefined = this.shippingAddressElement
      ? this.shippingAddressElement.element
      : undefined;
    const shippingDefaultBillingCheckbox = address1
      ? address1.querySelector<HTMLInputElement>(
          `#default-billing-address-${AddressType.Shipping}`,
        )
      : undefined;
    const shippingDefaultBillingCheckboxWrapper = address1
      ? address1.querySelector<HTMLInputElement>(
          `#default-billing-address-${AddressType.Shipping}-wrapper`,
        )
      : undefined;
    if (shippingDefaultBillingCheckboxWrapper) {
      shippingDefaultBillingCheckboxWrapper.style.display = "none";
    }
    if (shippingDefaultBillingCheckbox) {
      shippingDefaultBillingCheckbox.checked = false;
      shippingDefaultBillingCheckbox.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
    }
  },
};

export default LoginRegistrationView;
