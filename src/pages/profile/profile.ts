import "./profile.css";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import createInput from "@/components/input/input";
import createButton from "@/components/button/button";
import createEyeButton from "@/components/eye-button/eye-button";
import { FormType } from "@/types/enum";
import AddressElement from "@/components/address/address";

interface AddressItem {
  element: AddressElement;
  id: string;
  index: number;
  isEditing: boolean;
  name: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

// Move changeHandler to outer scope to avoid linting error
const createAddressChangeHandler = (
  element: HTMLInputElement,
  originalValue: string,
  userProfile: typeof UserProfile,
) => {
  return () => {
    const currentValue =
      element.type === "checkbox" ? element.checked.toString() : element.value;
    if (currentValue !== originalValue && !userProfile.isEdited) {
      userProfile.isEdited = true;
      if (userProfile.submitButton) {
        userProfile.submitButton.disabled = false;
      }
    }
  };
};

const UserProfile = {
  globalEditButton: undefined as HTMLButtonElement | undefined,
  submitButton: undefined as HTMLButtonElement | undefined,
  isEdited: false,
  isGlobalEditingEnabled: false,
  addresses: [] as AddressItem[],
  addressContainer: undefined as HTMLElement | undefined,
  nextAddressId: 1,

  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "user-profile";
    container.className = "view user-profile-view";

    container.append(
      this.createHeader(),
      this.createGlobalEditButton(container),
      await this.createForm(),
    );

    const passwordForm = document.createElement("form");
    passwordForm.id = "password-form";
    passwordForm.className = "form";
    passwordForm.append(this.renderPassword());

    this.disableAllFields(container);
    container.append(passwordForm);
    return container;
  },

  createHeader(): HTMLElement {
    const headerElement = document.createElement("h2");
    headerElement.className = "profile-title";
    headerElement.textContent =
      SETTINGS.label.userProfile.header || "User Profile";
    return headerElement;
  },

  createGlobalEditButton(container: HTMLElement): HTMLElement {
    this.globalEditButton = createButton({
      type: "button",
      name: "Edit mode",
      id: "enable-editing-button",
      class: "enable-editing-button",
    }) as HTMLButtonElement;

    this.globalEditButton.addEventListener("click", () => {
      this.toggleGlobalEditingMode(container);
    });

    return this.globalEditButton;
  },

  createLoginDataContainer(): HTMLElement {
    const loginDataContainer = document.createElement("div");
    loginDataContainer.className = "form-group";
    loginDataContainer.append(this.renderEmail());
    return loginDataContainer;
  },

  createUserDataContainer(): HTMLElement {
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

    return userDataContainer;
  },

  async createForm(): Promise<HTMLElement> {
    const formGroupContainer = document.createElement("div");
    formGroupContainer.className = "form-group-container";
    formGroupContainer.append(
      this.createLoginDataContainer(),
      this.createUserDataContainer(),
    );

    const formElement = document.createElement("form");
    formElement.className = "profile-form form";
    formElement.append(
      formGroupContainer,
      this.renderAddress(),
      this.renderSubmit("Save Changes"),
    );

    return formElement;
  },

  toggleGlobalEditingMode(container: HTMLElement): void {
    if (this.isGlobalEditingEnabled) {
      this.disableGlobalEditingMode(container);
    } else {
      this.enableGlobalEditingMode(container);
    }
  },

  enableGlobalEditingMode(container: HTMLElement): void {
    this.isGlobalEditingEnabled = true;
    this.isEdited = false;

    // Enable only basic profile fields (not addresses)
    this.enableBasicProfileFields(container);

    // Enable add/delete buttons for addresses
    this.toggleAddressButtons(true);

    // Individual address edit buttons are always available - no need to enable/disable them

    // Add change listeners to basic profile fields only
    this.addChangeListenersToBasicFields(container);

    // Update global edit button
    if (this.globalEditButton) {
      this.globalEditButton.textContent = "Leave edit mode";
    }

    // Keep submit button disabled until changes are made
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
  },

  disableGlobalEditingMode(container: HTMLElement): void {
    this.isGlobalEditingEnabled = false;
    this.isEdited = false;

    // Disable all fields including basic profile fields
    this.disableAllFields(container);

    // Disable all individual address editing
    for (const addressItem of this.addresses) {
      addressItem.isEditing = false;
      this.updateAddressEditButton(addressItem.id);
    }

    // Disable add/delete buttons
    this.toggleAddressButtons(false);

    // Individual address edit buttons remain always available - don't disable them

    // Update global edit button
    if (this.globalEditButton) {
      this.globalEditButton.textContent = "Edit mode";
    }

    // Disable submit button when editing is disabled
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
  },

  enableBasicProfileFields(container: HTMLElement): void {
    // Enable only basic profile input elements (firstname, lastname, birthday, email)
    const basicFields = container.querySelectorAll(
      "#firstname, #lastname, #birthday, #email",
    );
    for (const field of basicFields) {
      (field as HTMLInputElement).disabled = false;
    }
  },

  disableAllFields(container: HTMLElement): void {
    // Disable all input elements including basic profile fields
    const inputElements = container.querySelectorAll("input, select, textarea");
    for (const inputElement of inputElements) {
      (inputElement as HTMLInputElement).disabled = true;
    }

    // Disable address elements and checkboxes
    const addressElements = container.querySelectorAll(".address-element");
    for (const addressElement of addressElements) {
      const addressInputs = addressElement.querySelectorAll("input, select");
      for (const addressInput of addressInputs) {
        (addressInput as HTMLInputElement).disabled = true;
      }
    }

    // Disable default address checkboxes within AddressElement components
    const defaultCheckboxes = container.querySelectorAll(
      "#default-shipping-address-billing, #default-billing-address-billing",
    );
    for (const checkbox of defaultCheckboxes) {
      (checkbox as HTMLInputElement).disabled = true;
    }
  },

  enableFields(container: HTMLElement): void {
    // Enable all input elements
    const inputElements = container.querySelectorAll("input, select, textarea");
    for (const inputElement of inputElements) {
      (inputElement as HTMLInputElement).disabled = false;
    }

    // Enable address elements and checkboxes
    const addressElements = container.querySelectorAll(".address-element");
    for (const addressElement of addressElements) {
      const addressInputs = addressElement.querySelectorAll("input, select");
      for (const addressInput of addressInputs) {
        (addressInput as HTMLInputElement).disabled = false;
      }
    }

    // Enable default address checkboxes within AddressElement components
    const defaultCheckboxes = container.querySelectorAll(
      "#default-shipping-address-billing, #default-billing-address-billing",
    );
    for (const checkbox of defaultCheckboxes) {
      (checkbox as HTMLInputElement).disabled = false;
    }

    // Add change listeners to detect edits
    this.addChangeListeners(container);

    // Update button text and disable it initially after enabling fields
    if (this.globalEditButton) {
      this.globalEditButton.textContent = "Editing Enabled";
      this.globalEditButton.disabled = false;
    }
  },

  toggleAddressButtons(enabled: boolean): void {
    const addButtons = document.querySelectorAll(".add-address-button");
    const deleteButtons = document.querySelectorAll(".delete-address-button");

    for (const addButton of addButtons) {
      (addButton as HTMLButtonElement).disabled = !enabled;
    }

    for (const deleteButton of deleteButtons) {
      (deleteButton as HTMLButtonElement).disabled = !enabled;
    }
  },

  toggleIndividualEditButtons(enabled: boolean): void {
    const addressEditButtons = document.querySelectorAll(
      ".address-edit-button",
    );
    for (const addressEditButton of addressEditButtons) {
      (addressEditButton as HTMLButtonElement).disabled = !enabled;
    }
  },

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
    const inputElements = container.querySelectorAll("input, select, textarea");

    for (const inputElement of inputElements) {
      const element = inputElement as HTMLInputElement;
      const originalValue = element.value;
      const changeHandler = this.createChangeHandler(element, originalValue);

      element.addEventListener("input", changeHandler);
      element.addEventListener("change", changeHandler);
    }
  },

  addChangeListenersToBasicFields(container: HTMLElement): void {
    // Add change listeners only to basic profile fields
    const basicFields = container.querySelectorAll(
      "#firstname, #lastname, #birthday, #email",
    );

    for (const inputElement of basicFields) {
      const element = inputElement as HTMLInputElement;
      const originalValue = element.value;
      const changeHandler = this.createChangeHandler(element, originalValue);

      element.addEventListener("input", changeHandler);
      element.addEventListener("change", changeHandler);
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
    const passwordWrapper = document.createElement("div");
    passwordWrapper.className = "password-wrapper";

    const passwordInput = createInput({
      type: "password",
      label: SETTINGS.label.userProfile.password,
      name: "password",
      placeholder: `${SETTINGS.label.userProfile.password}...`,
      id: "password",
      class: "password-input",
      disabled: true,
    });

    const eyeButton = createEyeButton();
    passwordWrapper.append(passwordInput, eyeButton);

    return passwordWrapper;
  },

  generateAddressId(): string {
    const id = `add${this.nextAddressId}`;
    this.nextAddressId++;
    return id;
  },

  createAddressEditButton(addressId: string): HTMLElement {
    const addressEditButton = createButton({
      type: "button",
      name: "Edit",
      id: `edit-address-${addressId}`,
      class: "address-edit-button",
    }) as HTMLButtonElement;

    addressEditButton.addEventListener("click", () => {
      this.toggleAddressEditing(addressId);
    });

    return addressEditButton;
  },

  toggleAddressEditing(addressId: string): void {
    const addressItem = this.addresses.find((addr) => addr.id === addressId);
    if (!addressItem) return;

    addressItem.isEditing = !addressItem.isEditing;

    const addressWrapper = document.querySelector(
      `[data-address-id="${addressId}"]`,
    );
    if (!addressWrapper) return;

    // Toggle address fields and checkboxes
    const addressInputs = addressWrapper.querySelectorAll("input, select");

    for (const addressInput of addressInputs) {
      (addressInput as HTMLInputElement).disabled = !addressItem.isEditing;
    }

    // Toggle default address checkboxes
    const defaultCheckboxes = addressWrapper.querySelectorAll(
      "#default-shipping-address-billing, #default-billing-address-billing",
    );
    for (const checkbox of defaultCheckboxes) {
      (checkbox as HTMLInputElement).disabled = !addressItem.isEditing;
    }

    this.updateAddressEditButton(addressId);

    // Add change listeners to address fields if editing is enabled
    if (addressItem.isEditing) {
      this.addChangeListenersToAddress(addressWrapper);
    }

    // Mark as edited if enabling editing
    if (addressItem.isEditing && !this.isEdited) {
      this.isEdited = true;
      if (this.submitButton) {
        this.submitButton.disabled = false;
      }
    }
  },

  addChangeListenersToAddress(addressWrapper: Element): void {
    const addressInputs = addressWrapper.querySelectorAll(
      "input, select," +
        "#default-shipping-address-billing, #default-billing-address-billing",
    );

    for (const inputElement of addressInputs) {
      const element = inputElement as HTMLInputElement;
      const originalValue =
        element.type === "checkbox"
          ? element.checked.toString()
          : element.value;

      // Use the outer scope function instead of creating inline arrow function
      const changeHandler = createAddressChangeHandler(
        element,
        originalValue,
        this,
      );

      element.addEventListener("input", changeHandler);
      element.addEventListener("change", changeHandler);
    }
  },

  updateAddressEditButton(addressId: string): void {
    const addressItem = this.addresses.find((addr) => addr.id === addressId);
    const addressEditButton = document.querySelector(
      `#edit-address-${addressId}`,
    ) as HTMLButtonElement;

    if (addressEditButton && addressItem) {
      addressEditButton.textContent = addressItem.isEditing
        ? "Stop Editing"
        : "Edit";
      addressEditButton.classList.toggle(
        "editing-active",
        addressItem.isEditing,
      );
    }
  },

  createAddressWithControls(
    index: number,
    isEmpty: boolean = false,
  ): HTMLElement {
    const addressId = this.generateAddressId();
    const addressName = `Address ${index + 1}`;

    const addressWrapper = document.createElement("div");
    addressWrapper.className = "address-wrapper";
    addressWrapper.dataset.addressId = addressId;
    addressWrapper.dataset.addressIndex = index.toString();

    const addressElement = this.createAddressElement(isEmpty);
    this.storeAddressReference(addressId, addressElement, index, addressName);

    // Setup event listeners for the checkboxes within the AddressElement
    this.setupAddressCheckboxListeners(addressWrapper, addressId);

    addressWrapper.append(
      this.createAddressHeader(addressName, addressId),
      addressElement.element,
    );

    return addressWrapper;
  },

  createAddressElement(isEmpty: boolean): AddressElement {
    const addressElement = new AddressElement("billing");
    addressElement.render();

    if (isEmpty) {
      this.clearAddressInputs(addressElement.element);
    }

    return addressElement;
  },

  clearAddressInputs(element: HTMLElement): void {
    const addressInputs = element.querySelectorAll("input, select");
    for (const input of addressInputs) {
      if (input instanceof HTMLInputElement) {
        input.value = "";
      } else if (input instanceof HTMLSelectElement) {
        input.selectedIndex = 0;
      }
    }
  },

  storeAddressReference(
    addressId: string,
    addressElement: AddressElement,
    index: number,
    addressName: string,
  ): void {
    this.addresses[index] = {
      element: addressElement,
      id: addressId,
      index,
      name: addressName,
      isEditing: false,
      isDefaultShipping: false,
      isDefaultBilling: false,
    };
  },

  setupAddressCheckboxListeners(
    addressWrapper: HTMLElement,
    addressId: string,
  ): void {
    // Wait for the next tick to ensure the AddressElement has been fully rendered
    setTimeout(() => {
      const shippingCheckbox = addressWrapper.querySelector(
        "#default-shipping-address-billing",
      ) as HTMLInputElement;

      const billingCheckbox = addressWrapper.querySelector(
        "#default-billing-address-billing",
      ) as HTMLInputElement;

      if (shippingCheckbox) {
        shippingCheckbox.addEventListener("change", () => {
          this.setDefaultShipping(addressId, shippingCheckbox.checked);
        });
      }

      if (billingCheckbox) {
        billingCheckbox.addEventListener("change", () => {
          this.setDefaultBilling(addressId, billingCheckbox.checked);
        });
      }
    }, 0);
  },

  createAddressHeader(addressName: string, addressId: string): HTMLElement {
    const headerContainer = document.createElement("div");
    headerContainer.className = "address-header";

    const addressTitle = document.createElement("h4");
    addressTitle.className = "address-title";
    addressTitle.textContent = addressName;

    const controlsContainer = this.createAddressControls(addressId);

    headerContainer.append(addressTitle, controlsContainer);
    return headerContainer;
  },

  createAddressControls(addressId: string): HTMLElement {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "address-controls";

    const addressEditButton = this.createAddressEditButton(addressId);
    const deleteButton = this.createDeleteButton(addressId);

    controlsContainer.append(addressEditButton, deleteButton);
    return controlsContainer;
  },

  createDeleteButton(addressId: string): HTMLElement {
    const deleteButton = createButton({
      type: "button",
      name: "×",
      id: `delete-address-${addressId}`,
      class: "delete-address-button",
    }) as HTMLButtonElement;

    deleteButton.addEventListener("click", () => {
      this.deleteAddress(addressId);
    });

    return deleteButton;
  },

  createAddButton(): HTMLElement {
    const addAddressButton = createButton({
      type: "button",
      name: "+ Add Address",
      id: "add-address-button",
      class: "add-address-button",
    }) as HTMLButtonElement;

    addAddressButton.addEventListener("click", () => {
      this.addAddress();
    });

    return addAddressButton;
  },

  addAddress(): void {
    if (!this.addressContainer) return;

    const newIndex = this.addresses.length;
    const addressWrapper = this.createAddressWithControls(newIndex, true); // true for empty fields

    // Insert before the add button
    const addButton = this.addressContainer.querySelector(
      ".add-address-button",
    );
    if (addButton) {
      addButton.before(addressWrapper);
    } else {
      this.addressContainer.append(addressWrapper);
    }

    // FIXED: Set the new address as editing and enable its fields
    const addressId = addressWrapper.dataset.addressId;
    if (addressId) {
      const addressItem = this.addresses.find((addr) => addr.id === addressId);
      if (addressItem) {
        addressItem.isEditing = true;

        // Enable address fields and checkboxes
        const addressInputs = addressWrapper.querySelectorAll("input, select");
        for (const addressInput of addressInputs) {
          (addressInput as HTMLInputElement).disabled = false;
        }

        // Enable default address checkboxes
        const defaultCheckboxes = addressWrapper.querySelectorAll(
          "#default-shipping-address-billing, #default-billing-address-billing",
        );
        for (const checkbox of defaultCheckboxes) {
          (checkbox as HTMLInputElement).disabled = false;
        }

        // Update the edit button to show "Stop Editing"
        this.updateAddressEditButton(addressId);

        // Add change listeners to the new address
        this.addChangeListenersToAddress(addressWrapper);
      }
    }

    // Update delete button visibility
    this.updateDeleteButtonsVisibility();

    // Mark as edited
    if (!this.isEdited) {
      this.isEdited = true;
      if (this.submitButton) {
        this.submitButton.disabled = false;
      }
    }
  },

  deleteAddress(addressId: string): void {
    // Don't allow deletion if only one address remains
    if (this.addresses.length <= 1) return;

    const addressWrapper = document.querySelector(
      `[data-address-id="${addressId}"]`,
    );
    if (addressWrapper) {
      addressWrapper.remove();
    }

    // Remove from array
    const addressIndex = this.addresses.findIndex(
      (addr) => addr.id === addressId,
    );
    if (addressIndex !== -1) {
      this.addresses.splice(addressIndex, 1);
    }

    // Update indices and names
    this.updateAddressIndicesAndNames();

    // Update delete button visibility
    this.updateDeleteButtonsVisibility();

    // Mark as edited
    if (!this.isEdited) {
      this.isEdited = true;
      if (this.submitButton) {
        this.submitButton.disabled = false;
      }
    }
  },

  updateAddressIndicesAndNames(): void {
    const addressWrappers = document.querySelectorAll(".address-wrapper");

    for (const [index, addressWrapper] of addressWrappers.entries()) {
      const addressId = (addressWrapper as HTMLElement).dataset.addressId;
      if (!addressId) continue;

      // Update dataset index
      (addressWrapper as HTMLElement).dataset.addressIndex = index.toString();

      // Update address object index and name
      const addressItem = this.addresses.find((addr) => addr.id === addressId);
      if (addressItem) {
        addressItem.index = index;
        addressItem.name = `Address ${index + 1}`;
      }

      // Update address title
      const addressTitle = addressWrapper.querySelector(".address-title");
      if (addressTitle) {
        addressTitle.textContent = `Address ${index + 1}`;
      }
    }
  },

  updateDeleteButtonsVisibility(): void {
    const addressWrappers = document.querySelectorAll(".address-wrapper");
    const shouldShowDelete = addressWrappers.length > 1;

    for (const addressWrapper of addressWrappers) {
      const deleteButton = addressWrapper.querySelector(
        ".delete-address-button",
      ) as HTMLButtonElement;
      if (deleteButton) {
        deleteButton.style.display = shouldShowDelete ? "block" : "none";
      }
    }
  },

  renderAddress(): HTMLElement {
    const addressContainer = document.createElement("div");
    addressContainer.className = "registration-address-container";
    this.addressContainer = addressContainer;

    // Address section header
    const sectionHeader = document.createElement("h3");
    sectionHeader.className = "address-section-header";
    sectionHeader.textContent = "Addresses";
    addressContainer.append(sectionHeader);

    // Add initial address (not empty, with default data)
    const initialAddress = this.createAddressWithControls(0, false);
    addressContainer.append(initialAddress);

    // Add button
    const addButton = this.createAddButton();
    addressContainer.append(addButton);

    return addressContainer;
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

  async onRegistrationSubmit(event: SubmitEvent) {
    const formElement = event.target as HTMLFormElement;

    const isValid = await handleOnSubmit(formElement, FormType.PROFILE);
    if (!isValid) return;

    // const formData = new FormData(formElement);
  },

  // Helper method to get address by ID
  getAddressById(addressId: string): AddressItem | undefined {
    return this.addresses.find((addr) => addr.id === addressId);
  },

  // Helper method to get all addresses
  getAllAddresses(): AddressItem[] {
    return this.addresses;
  },

  // Set default shipping address
  setDefaultShipping(addressId: string, isDefault: boolean): void {
    if (isDefault) {
      // Remove default shipping from all other addresses
      for (const addressItem of this.addresses) {
        if (addressItem.id !== addressId && addressItem.isDefaultShipping) {
          addressItem.isDefaultShipping = false;
          // Find and uncheck the shipping checkbox for this address
          const addressWrapper = document.querySelector(
            `[data-address-id="${addressItem.id}"]`,
          );
          if (addressWrapper) {
            const checkbox = addressWrapper.querySelector(
              "#default-shipping-address-billing",
            ) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = false;
            }
          }
        }
      }
    }

    // Set the current address default shipping status
    const addressItem = this.addresses.find((addr) => addr.id === addressId);
    if (addressItem) {
      addressItem.isDefaultShipping = isDefault;
    }

    // Mark as edited
    if (!this.isEdited) {
      this.isEdited = true;
      if (this.submitButton) {
        this.submitButton.disabled = false;
      }
    }
  },

  // Set default billing address
  setDefaultBilling(addressId: string, isDefault: boolean): void {
    if (isDefault) {
      // Remove default billing from all other addresses
      for (const addressItem of this.addresses) {
        if (addressItem.id !== addressId && addressItem.isDefaultBilling) {
          addressItem.isDefaultBilling = false;
          // Find and uncheck the billing checkbox for this address
          const addressWrapper = document.querySelector(
            `[data-address-id="${addressItem.id}"]`,
          );
          if (addressWrapper) {
            const checkbox = addressWrapper.querySelector(
              "#default-billing-address-billing",
            ) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = false;
            }
          }
        }
      }
    }

    // Set the current address default billing status
    const addressItem = this.addresses.find((addr) => addr.id === addressId);
    if (addressItem) {
      addressItem.isDefaultBilling = isDefault;
    }

    // Mark as edited
    if (!this.isEdited) {
      this.isEdited = true;
      if (this.submitButton) {
        this.submitButton.disabled = false;
      }
    }
  },

  // Helper method to get default shipping address
  getDefaultShippingAddress(): AddressItem | undefined {
    return this.addresses.find((addr) => addr.isDefaultShipping);
  },

  // Helper method to get default billing address
  getDefaultBillingAddress(): AddressItem | undefined {
    return this.addresses.find((addr) => addr.isDefaultBilling);
  },
};

export default UserProfile;
