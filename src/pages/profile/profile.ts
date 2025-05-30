import { SETTINGS } from "@/config/settings";
import createInput from "@/components/input/input";
import createButton from "@/components/button/button";
import createEyeButton from "@/components/eye-button/eye-button";
import { AddressType } from "@/types/enum";
import AddressElement from "@/components/address/address";
import createCheckbox from "@/components/checkbox/checkbox";

const UserProfile = {
  enableButton: undefined as HTMLButtonElement | undefined,
  submitButton: undefined as HTMLButtonElement | undefined,
  isEdited: false,
  isEditingEnabled: false,

  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "user-profile";
    container.className = "view user-profile-view";

    const h2 = document.createElement("h2");
    h2.className = "profile-title";
    h2.textContent = SETTINGS.label.userProfile.header || "User Profile";

    // Create enable button
    this.enableButton = createButton({
      type: "button",
      name: "Enable Editing",
      id: "enable-editing-button",
      class: "enable-editing-button",
    }) as HTMLButtonElement;

    this.enableButton.addEventListener("click", () => {
      this.toggleEditingMode(container);
    });

    const loginDataContainer = document.createElement("div");
    loginDataContainer.className = "form-group";
    loginDataContainer.append(this.renderEmail(), this.renderPassword());

    const userDataContainer = document.createElement("div");
    userDataContainer.className = "form-group";
    userDataContainer.append(
      createInput({
        type: "text",
        label: SETTINGS.label.userProfile.firstName,
        name: "firstname",
        placeholder: `${SETTINGS.label.userProfile.firstName}...`,
        id: "firstname",
        class: "firstname-input",
      }),
      createInput({
        type: "text",
        label: SETTINGS.label.userProfile.lastName,
        name: "lastname",
        placeholder: `${SETTINGS.label.userProfile.lastName}...`,
        id: "lastname",
        class: "lastname-input",
      }),
      createInput({
        type: "date",
        label: SETTINGS.label.userProfile.birthDay,
        name: "birthday",
        id: "birthday",
        class: "birthday-input",
      }),
    );

    const form = document.createElement("form");
    form.className = "profile-form form";
    form.append(
      loginDataContainer,
      userDataContainer,
      this.renderAddress(),
      this.renderSubmit("Save Changes"),
    );

    container.append(h2, form, this.enableButton);
    this.disableAllFields(container);
    return container;
  },

  toggleEditingMode(container: HTMLElement): void {
    if (this.isEditingEnabled) {
      this.disableEditingMode(container);
    } else {
      this.enableEditingMode(container);
    }
  },

  enableEditingMode(container: HTMLElement): void {
    this.isEditingEnabled = true;
    this.isEdited = false;

    // Enable all input elements
    const inputs = container.querySelectorAll("input, select, textarea");
    for (const input of inputs) {
      (input as HTMLInputElement).disabled = false;
    }

    // Enable address elements
    const addressElements = container.querySelectorAll(".address-element");
    for (const addressElement of addressElements) {
      const addressInputs = addressElement.querySelectorAll("input, select");
      for (const input of addressInputs) {
        (input as HTMLInputElement).disabled = false;
      }
    }

    // Add change listeners to detect edits
    this.addChangeListeners(container);

    // Update enable button
    if (this.enableButton) {
      this.enableButton.textContent = "Disable Editing";
    }

    // Keep submit button disabled until changes are made
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
  },

  disableEditingMode(container: HTMLElement): void {
    this.isEditingEnabled = false;
    this.isEdited = false;

    this.disableAllFields(container);

    // Update enable button
    if (this.enableButton) {
      this.enableButton.textContent = "Enable Editing";
    }

    // Disable submit button when editing is disabled
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
  },

  disableAllFields(container: HTMLElement): void {
    // Disable all input elements
    const inputs = container.querySelectorAll("input, select, textarea");
    for (const input of inputs) {
      (input as HTMLInputElement).disabled = true;
    }

    // Disable address elements if they have a disable method
    const addressElements = container.querySelectorAll(".address-element");
    for (const addressElement of addressElements) {
      const addressInputs = addressElement.querySelectorAll("input, select");
      for (const input of addressInputs) {
        (input as HTMLInputElement).disabled = true;
      }
    }
  },

  enableFields(container: HTMLElement): void {
    // Enable all input elements
    const inputs = container.querySelectorAll("input, select, textarea");
    for (const input of inputs) {
      (input as HTMLInputElement).disabled = false;
    }

    // Enable address elements
    const addressElements = container.querySelectorAll(".address-element");
    for (const addressElement of addressElements) {
      const addressInputs = addressElement.querySelectorAll("input, select");
      for (const input of addressInputs) {
        (input as HTMLInputElement).disabled = false;
      }
    }

    // Add change listeners to detect edits
    this.addChangeListeners(container);

    // Update button text and disable it initially after enabling fields
    if (this.enableButton) {
      this.enableButton.textContent = "Editing Enabled";
      this.enableButton.disabled = false;
    }
  },

  // Move the function to class level or module level
  createChangeHandler(element: HTMLInputElement, originalValue: string) {
    return () => {
      if (element.value !== originalValue && !this.isEdited) {
        this.isEdited = true;
        // Enable submit button when changes are detected
        if (this.submitButton) {
          this.submitButton.disabled = false;
        }
      }
    };
  },

  addChangeListeners(container: HTMLElement): void {
    const inputs = container.querySelectorAll("input, select, textarea");

    for (const input of inputs) {
      const element = input as HTMLInputElement;
      const originalValue = element.value;
      const handleChange = this.createChangeHandler(element, originalValue);

      element.addEventListener("input", handleChange);
      element.addEventListener("change", handleChange);
    }
  },

  renderEmail(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.userProfile.email,
      name: "email",
      placeholder: `${SETTINGS.label.userProfile.email}...`,
      id: "email",
      class: "email-input",
    });
  },

  renderPassword(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "password-wrapper";

    const passwordInput = createInput({
      type: "password",
      label: SETTINGS.label.userProfile.password,
      name: "password",
      placeholder: `${SETTINGS.label.userProfile.password}...`,
      id: "password",
      class: "password-input",
    });

    const eyeButton = createEyeButton();
    wrapper.append(passwordInput, eyeButton);

    return wrapper;
  },

  renderAddress(): HTMLElement {
    const container = document.createElement("div");
    container.className = "registration-address-container";

    // First address block
    const address1 = new AddressElement(AddressType.Shipping);
    address1.render();
    container.append(address1.element);

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

    // Second address block
    let address2: AddressElement | undefined = undefined;

    const toggleBillingAddress = () => {
      const showBilling = checkbox?.checked;

      if (showBilling && !address2) {
        address2 = new AddressElement(AddressType.Billing);
        address2.render();
        address2.element.classList.add("secondary-address");
        container.append(address2.element);
      } else if (!showBilling && address2) {
        address2.element.remove();
        address2 = undefined;
      }
    };

    if (checkbox) {
      checkbox.addEventListener("change", toggleBillingAddress);
      toggleBillingAddress();
    }
    return container;
  },

  renderSubmit(submitName: string): HTMLElement {
    this.submitButton = createButton({
      type: "submit",
      name: submitName,
      id: "submit-registration-login",
      class: "submit-registration-login-button submit",
    }) as HTMLButtonElement;

    // Initially disable the submit button
    this.submitButton.disabled = true;

    return this.submitButton;
  },
};

export default UserProfile;
