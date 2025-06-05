import "./profile.css";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import createInput from "@/components/input/input";
import createButton from "@/components/button/button";
import { FormType, PageType } from "@/types/enum";
import AddressElement from "@/components/address/address";
import { AddressItem, InAddress, InCustomer } from "@/types/interfaces";
import authStore from "@/stores/auth-store";
import PageRouter from "@/router/page-router";
import showModalMessage from "@/components/modal-window/modal-window";
import customerService from "@/api/services/customer-service";

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
  passwordButton: undefined as HTMLButtonElement | undefined,
  isEdited: false,
  isGlobalEditingEnabled: false,
  addresses: [] as AddressItem[],
  addressContainer: undefined as HTMLElement | undefined,
  nextAddressId: 1,
  containerElement: undefined as HTMLElement | undefined,

  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "user-profile";
    container.className = "view user-profile-view";

    this.containerElement = container;
    container.append(
      this.createHeader(),
      this.createGlobalEditButton(container),
      await this.createForm(),
    );

    this.disableAllFields(container);
    return container;
  },

  createHeader(): HTMLElement {
    const headerElement = document.createElement("h2");
    headerElement.className = "profile-title";
    headerElement.textContent = SETTINGS.label.userProfile.header;
    return headerElement;
  },

  createGlobalEditButton(container: HTMLElement): HTMLElement {
    this.globalEditButton = createButton({
      type: "button",
      name: SETTINGS.label.userProfile.editModeBtn,
      id: "enable-editing-button",
      class: "enable-editing-button",
    }) as HTMLButtonElement;

    this.globalEditButton.addEventListener("click", () => {
      this.toggleGlobalEditingMode(container);
    });

    return this.globalEditButton;
  },

  createPasswordButton(): HTMLElement {
    this.passwordButton = createButton({
      type: "button",
      name: SETTINGS.label.userProfile.editPassword,
      id: "password-page",
    }) as HTMLButtonElement;

    this.passwordButton.addEventListener("click", () => {
      PageRouter.navigateTo(PageType.changepassword);
    });

    return this.passwordButton;
  },

  createLoginDataContainer(): HTMLElement {
    const loginDataContainer = document.createElement("div");
    loginDataContainer.className = "form-group";
    loginDataContainer.append(this.renderEmail(), this.createPasswordButton());
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
        value: authStore.user?.firstName,
      }),
      createInput({
        type: "text",
        label: SETTINGS.label.userProfile.lastName,
        name: "lastname",
        placeholder: `${SETTINGS.label.userProfile.lastName}...`,
        id: "lastname",
        class: "lastname-input",
        value: authStore.user?.lastName,
      }),
      createInput({
        type: "date",
        label: SETTINGS.label.userProfile.birthDay,
        name: "birthday",
        id: "birthday",
        class: "birthday-input",
        value: authStore.user?.dateOfBirth,
      }),
    );

    return userDataContainer;
  },

  async createForm(): Promise<HTMLElement> {
    const container = document.createElement("div");
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
      this.renderSubmit(SETTINGS.label.userProfile.submitBtn),
    );
    formElement.addEventListener("submit", (event) => {
      this.renderOnSubmit(event);
    });

    const addressesForm = document.createElement("div");
    addressesForm.append(this.renderAddress());

    container.append(formElement, addressesForm);

    return container;
  },
  async renderOnSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const isValid = handleOnSubmit(form, FormType.PROFILE);
    if (!isValid) return;

    const formData = new FormData(form);
    event.preventDefault();
    const addresses = authStore.user?.addresses || [];

    const updatedCustomerData: InCustomer = {
      firstName: formData.get("firstname") as string,
      lastName: formData.get("lastname") as string,
      email: formData.get("email") as string,
      dateOfBirth: formData.get("birthday") as string,
      addresses,
    };
    try {
      const result = await customerService.update(updatedCustomerData);
      if (result) {
        await showModalMessage(SETTINGS.label.userProfile.editUSer);
        // Reset edit state and disable submit button
        this.isEdited = false;
        if (this.submitButton) {
          this.submitButton.disabled = true;
        }
        if (this.containerElement) {
          this.disableGlobalEditingMode(this.containerElement);
        }
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  },

  async submitAddress(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;

    const isValid = handleOnSubmit(form, FormType.PROFILE);
    if (!isValid) return;

    const formData = new FormData(form);
    event.preventDefault();

    let addressId = form.dataset.addressId || this.generateAddressId();
    const currentAddressForm = this.reciveCurrentForm(addressId);
    if (currentAddressForm?.hasAttribute("data-address-id-new")) {
      addressId =
        currentAddressForm.dataset.addressIdNew || this.generateAddressId();
    }

    const newAddress = {
      streetName: formData.get("street-billing") as string,
      postalCode: formData.get("postalcode-billing") as string,
      city: formData.get("city-billing") as string,
      country: formData.get("country-billing") as string,
      isDefaultBilling:
        formData.get("default-billing-address-billing") === "on",
      isDefaultShipping:
        formData.get("default-shipping-address-billing") === "on",
    };

    await this.processAddressUpdate(addressId, newAddress, form);
  },

  async processAddressUpdate(
    addressId: string,
    newAddress: {
      streetName: string;
      postalCode: string;
      city: string;
      country: string;
      isDefaultBilling: boolean;
      isDefaultShipping: boolean;
    },
    form?: HTMLFormElement,
  ) {
    const updatedAddresses = this.prepareAddressUpdate(addressId, newAddress);

    if (!updatedAddresses) return;

    const userData = authStore.user;
    const updatedCustomerData: InCustomer = {
      firstName: userData?.firstName as string,
      lastName: userData?.lastName as string,
      email: userData?.email as string,
      dateOfBirth: userData?.dateOfBirth as string,
      addresses: updatedAddresses.addresses,
    };

    const result = await customerService.update(updatedCustomerData);

    if (result) {
      this.handleAddressUpdateSuccess(
        result,
        updatedAddresses.isNewAddress,
        addressId,
        form,
      );
    }
  },

  prepareAddressUpdate(addressId: string, newAddress: InAddress) {
    let userAddresses = structuredClone(authStore.user?.addresses);

    if (!userAddresses) return;

    const isNewAddress = !userAddresses.some((addr) => addr.id === addressId);

    if (isNewAddress) {
      userAddresses.push({
        ...newAddress,
        key: "billing-address-" + Date.now(),
      });
    } else {
      userAddresses = userAddresses.map((addr) =>
        addr.id === addressId ? { ...newAddress, id: addressId } : addr,
      );
    }

    return {
      addresses: userAddresses,
      isNewAddress,
    };
  },

  async handleAddressUpdateSuccess(
    result: InCustomer,
    isNewAddress: boolean,
    addressId: string,
    form?: HTMLFormElement,
  ) {
    if (authStore.user) {
      const updatedUser: InCustomer = {
        ...authStore.user,
        addresses: result.addresses,
      };
      authStore.setUser(updatedUser);
    }

    if (isNewAddress && form) {
      const newlyCreatedAddress = result.addresses.at(-1)?.id || "no-id";
      const form1 = document.querySelector(
        "form[data-address-id=" + addressId + "]",
      ) as HTMLFormElement;
      if (form1) {
        form1.dataset.addressIdNew = newlyCreatedAddress;
      }
    }

    await showModalMessage(
      isNewAddress
        ? SETTINGS.label.userProfile.addAddress
        : SETTINGS.label.userProfile.editAddress,
    );

    if (addressId) {
      const addressItem = this.addresses.find((addr) => addr.id === addressId);
      if (addressItem && addressItem.isEditing) {
        this.toggleAddressEditing(addressId);
      }
    }
  },
  reciveCurrentForm(addressId: string): HTMLElement {
    return document.querySelector(
      "form[data-address-id=" + addressId + "]",
    ) as HTMLFormElement;
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
    this.enableBasicProfileFields(container);
    this.toggleAddressButtons(true);
    this.addChangeListenersToBasicFields(container);
    // disable nav
    const headerNav = document.querySelectorAll(
      ".header-actions a, .header-actions select",
    );
    for (const link of headerNav) {
      (link as HTMLElement).style.pointerEvents = "none";
    }
    if (this.globalEditButton) {
      this.globalEditButton.textContent =
        SETTINGS.label.userProfile.editModeStop;
    }
  },

  disableGlobalEditingMode(container: HTMLElement): void {
    this.isGlobalEditingEnabled = false;
    this.isEdited = false;

    this.disableAllFields(container);

    // enable nav
    const headerNav = document.querySelectorAll(
      ".header-actions a, .header-actions select",
    );
    for (const link of headerNav) {
      (link as HTMLElement).style.pointerEvents = "";
    }

    if (this.globalEditButton) {
      this.globalEditButton.textContent =
        SETTINGS.label.userProfile.editModeBtn;
    }
  },

  enableBasicProfileFields(container: HTMLElement): void {
    // Enable only basic profile input elements
    const basicFields = container.querySelectorAll(
      "#firstname, #lastname, #birthday, #email",
    );
    for (const field of basicFields) {
      (field as HTMLInputElement).disabled = false;
    }
  },

  disableAllFields(container: HTMLElement): void {
    // all elements
    const allInputElements = container.querySelectorAll(
      "input, select, textarea, .address-element input, .address-element select",
    );
    for (const element of allInputElements) {
      (element as HTMLInputElement).disabled = true;
    }

    const specificElements = container.querySelectorAll(
      "#default-shipping-address-billing, #default-billing-address-billing, .submit-address-button",
    );
    for (const element of specificElements) {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLButtonElement
      ) {
        element.disabled = true;
      }
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
      this.globalEditButton.textContent =
        SETTINGS.label.userProfile.editModeBtn;
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
      value: authStore.user?.email,
    });
  },

  generateAddressId(): string {
    const id = `add${this.nextAddressId}`;
    this.nextAddressId++;
    return id;
  },

  createAddressEditButton(addressId: string): HTMLElement {
    const addressEditButton = createButton({
      type: "button",
      name: SETTINGS.label.address.editAddress,
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

    const submitButton = addressWrapper.querySelector(
      `#submit-address-${addressId}`,
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !addressItem.isEditing;
    }

    this.updateAddressEditButton(addressId);

    // Add change listeners to address fields if editing is enabled
    if (addressItem.isEditing) {
      this.addChangeListenersToAddress(addressWrapper);
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
        ? SETTINGS.label.address.editAddressStop
        : SETTINGS.label.address.editAddress;
      addressEditButton.classList.toggle(
        "editing-active",
        addressItem.isEditing,
      );
    }
  },

  createAddressWithControls(
    index: number,
    isEmpty: boolean = false,
    addressData?: InAddress,
  ): HTMLElement {
    const addressId = addressData?.id || this.generateAddressId();
    const addressName = `${SETTINGS.label.address.addressProfileTitle} ${index + 1}`;

    const addressWrapper = document.createElement("form");
    addressWrapper.className = "address-wrapper form";
    addressWrapper.dataset.addressId = addressId;
    addressWrapper.dataset.addressIndex = index.toString();

    const addressElement = this.createAddressElement(isEmpty, addressData);
    this.storeAddressReference(addressId, addressElement, index, addressName);

    this.setupAddressCheckboxListeners(addressWrapper, addressId);

    const addSubmitAddress = createButton({
      type: "submit",
      name: "Submit",
      id: `submit-address-${addressId}`,
      class: "submit-address-button",
    }) as HTMLButtonElement;

    addSubmitAddress.disabled = true;

    addressWrapper.addEventListener("submit", (event) => {
      this.submitAddress(event);
    });
    addressWrapper.append(
      this.createAddressHeader(addressName, addressId),
      addressElement.element,
      addSubmitAddress,
    );

    return addressWrapper;
  },

  createAddressElement(
    isEmpty: boolean,
    addressData?: InAddress,
  ): AddressElement {
    const addressElement = new AddressElement("billing");
    addressElement.render();
    if (addressData) {
      addressElement.setData(addressData);
    }
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
    requestAnimationFrame(() => {
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
    });
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
      name: SETTINGS.label.address.addAdress,
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

        // Enable submit button for new address
        const submitButton = addressWrapper.querySelector(
          `#submit-address-${addressId}`,
        ) as HTMLButtonElement;
        if (submitButton) {
          submitButton.disabled = false;
        }

        this.updateAddressEditButton(addressId);

        this.addChangeListenersToAddress(addressWrapper);
      }
    }

    this.updateDeleteButtonsVisibility();
  },

  async deleteAddress(addressId: string): Promise<void> {
    // if we need to delete just created address (with new id)
    let databaseAddressId = addressId;
    const currentAddressForm = this.reciveCurrentForm(addressId);
    if (currentAddressForm?.hasAttribute("data-address-id-new")) {
      databaseAddressId =
        currentAddressForm.dataset.addressIdNew || this.generateAddressId();
    }

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

    this.updateAddressIndicesAndNames();

    this.updateDeleteButtonsVisibility();

    let userAddresses = structuredClone(authStore.user?.addresses);
    if (userAddresses) {
      const addressExists = userAddresses.some(
        (addr) => addr.id === databaseAddressId,
      );
      if (!addressExists) {
        console.warn(`Address with id "${databaseAddressId}" not found.`);
        return;
      }
      userAddresses = userAddresses.filter(
        (addr) => addr.id !== databaseAddressId,
      );

      const userData = authStore.user;
      const updatedCustomerData: InCustomer = {
        firstName: userData?.firstName as string,
        lastName: userData?.lastName as string,
        email: userData?.email as string,
        dateOfBirth: userData?.dateOfBirth as string,
        addresses: userAddresses,
      };
      try {
        const result = await customerService.update(updatedCustomerData);
        if (result) {
          await showModalMessage(SETTINGS.label.userProfile.deleteAddress);
        }
      } catch (error) {
        console.error("Update failed", error);
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
        addressItem.name = `${SETTINGS.label.address.addressProfileTitle} ${index + 1}`;
      }

      // Update address title
      const addressTitle = addressWrapper.querySelector(".address-title");
      if (addressTitle) {
        addressTitle.textContent = `${SETTINGS.label.address.addressProfileTitle} ${index + 1}`;
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

    const sectionHeader = document.createElement("h3");
    sectionHeader.className = "address-section-header";
    sectionHeader.textContent = SETTINGS.label.address.addressesList;
    addressContainer.append(sectionHeader);

    // reciving addresses
    const userAddresses = authStore.user?.addresses || [];
    if (userAddresses.length > 0) {
      let index = 0;
      for (const address of userAddresses) {
        const addressElement = this.createAddressWithControls(
          index,
          false,
          address,
        );
        addressContainer.append(addressElement);
        index++;
      }
    } else {
      const initialAddress = this.createAddressWithControls(0, false);
      addressContainer.append(initialAddress);
    }

    const addButton = this.createAddButton();
    addressContainer.append(addButton);

    return addressContainer;
  },

  renderSubmit(submitName: string): HTMLElement {
    this.submitButton = createButton({
      type: "submit",
      name: submitName,
      id: "submit-profile",
      class: "submit-profile-button submit",
    }) as HTMLButtonElement;

    this.submitButton.disabled = true;

    return this.submitButton;
  },

  getAddressById(addressId: string): AddressItem | undefined {
    return this.addresses.find((addr) => addr.id === addressId);
  },

  getAllAddresses(): AddressItem[] {
    return this.addresses;
  },

  setDefaultShipping(addressId: string, isDefault: boolean): void {
    if (isDefault) {
      for (const addressItem of this.addresses) {
        if (addressItem.id !== addressId && addressItem.isDefaultShipping) {
          addressItem.isDefaultShipping = false;
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

  setDefaultBilling(addressId: string, isDefault: boolean): void {
    if (isDefault) {
      for (const addressItem of this.addresses) {
        if (addressItem.id !== addressId && addressItem.isDefaultBilling) {
          addressItem.isDefaultBilling = false;
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

  getDefaultShippingAddress(): AddressItem | undefined {
    return this.addresses.find((addr) => addr.isDefaultShipping);
  },

  getDefaultBillingAddress(): AddressItem | undefined {
    return this.addresses.find((addr) => addr.isDefaultBilling);
  },
};

export default UserProfile;
