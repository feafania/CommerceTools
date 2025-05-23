import "./login-registration.css";
import createInput from "@/components/input/input";
import createButton from "@/components/button/button";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import AuthService from "@/api/services/auth-service";
import { AddressType, FormType, PageType } from "@/types/enum";
import AddressElement from "@/components/address/address";
import { createLabel } from "@/components/label/label";
// import { formatDateForCommercetools } from "@/utils/helpers";
import createEyeButton from "@/components/eye-button/eye-button";
import Header from "@/components/layout/header/header";
import PageRouter from "@/router/page-router";
import showModalMessage from "@/components/modal-window/modal-window";
import { getCountryCode } from "@/utils/helpers";

const LoginRegistrationView = {
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
    const address1 = new AddressElement(AddressType.Shipping);
    address1.render();
    container.append(address1.element);

    // Checkbox
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "address-toggle checkbox-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "show-billing-address";
    checkbox.name = checkbox.id;

    const label = createLabel({
      label: SETTINGS.label.address.isSameAddress,
      id: checkbox.id,
      class: `is-same-address`,
    });

    toggleWrapper.append(checkbox, label);
    container.append(toggleWrapper);

    // Second address block
    let address2: AddressElement | undefined = undefined;

    checkbox.addEventListener("change", () => {
      const showBilling = checkbox.checked;

      if (showBilling && !address2) {
        address2 = new AddressElement(AddressType.Billing);
        address2.render();
        address2.element.classList.add("secondary-address");
        container.append(address2.element);
      } else if (!showBilling && address2) {
        address2.element.remove();
        address2 = undefined;
      }
    });

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

    const customer = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstname") as string,
      lastName: formData.get("lastname") as string,
      dateOfBirth: formData.get("birthday") as string,
      // formatDateForCommercetools(
      //   formData.get("birthday")),
      isSameAddress: !(formData.get("show-billing-address") === "on"),
      shippingAddress: {
        streetName: formData.get("shipping-street") as string,
        streetNumber: formData.get("shipping-number") as string,
        postalCode: formData.get("shipping-zip") as string,
        city: formData.get("shipping-city") as string,
        country: getCountryCode(
          formData.get("shipping-country") as string,
        ) as string,
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
          (getCountryCode(
            formData.get("billing-country") as string,
          ) as string) ||
          (getCountryCode(
            formData.get("shipping-country") as string,
          ) as string),
      },
      setBillingAsDefault: true,
      setShippingAsDefault: true,
    };

    const user = await AuthService.register(customer);
    if (user && "email" in user) {
      PageRouter.navigateTo(PageType.login);
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
    if (user && "email" in user) {
      Header.setUsername();
      PageRouter.navigateTo(PageType.main);
      showModalMessage(SETTINGS.label.messages.onSignIn);
    }
  },
};

export default LoginRegistrationView;
