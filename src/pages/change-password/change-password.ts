import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import createInput from "@/components/input/input";
import createButton from "@/components/button/button";
import createEyeButton from "@/components/eye-button/eye-button";
import { PageType, FormType } from "@/types/enum";
import PageRouter from "@/router/page-router";
import authStore from "@/stores/auth-store";
import customerService from "@/api/services/customer-service";
import showModalMessage from "@/components/modal-window/modal-window";

const ChangePassword = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "user-profile";
    container.className = "view user-profile-view";

    const headerElement = document.createElement("h2");
    headerElement.className = "profile-title";
    headerElement.textContent = SETTINGS.label.changePassword.formTitle;

    const passwordForm = document.createElement("form");
    passwordForm.id = "password-form";
    passwordForm.className = "form";
    passwordForm.append(this.renderPassword());

    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.renderOnSubmit(event);
    });

    container.append(passwordForm);
    return container;
  },

  renderPassword(): HTMLElement {
    const passwordWrapper = document.createElement("div");
    passwordWrapper.className = "password-container";

    const currentPasswordContainer = document.createElement("div");
    currentPasswordContainer.className = "password-wrapper";
    const currentPassword = createInput({
      type: "password",
      label: SETTINGS.label.changePassword.current,
      name: "current-password",
      placeholder: `${SETTINGS.label.changePassword.current}...`,
      id: "current-password",
      class: "password-input",
      disabled: false,
      validationName: "password",
      value: authStore.user?.password,
    });
    const currentEyeButton = createEyeButton("current-password");
    currentPasswordContainer.append(currentPassword, currentEyeButton);

    const newPasswordContainer = document.createElement("div");
    newPasswordContainer.className = "password-wrapper";
    const newPassword = createInput({
      type: "password",
      label: SETTINGS.label.changePassword.newPassword,
      name: "new-password",
      placeholder: `${SETTINGS.label.changePassword.newPassword}...`,
      id: "new-password",
      class: "password-input",
      validationName: "password",
      disabled: false,
    });
    const newEyeButton = createEyeButton("new-password");
    newPasswordContainer.append(newPassword, newEyeButton);

    const confirmContainer = document.createElement("div");
    confirmContainer.className = "password-wrapper";
    const confirmNewPassword = createInput({
      type: "password",
      label: SETTINGS.label.changePassword.confirmNewPassword,
      name: "confirm-password",
      placeholder: `${SETTINGS.label.changePassword.confirmNewPassword}...`,
      id: "confirm-password",
      class: "password-input",
      validationName: "password",
      disabled: false,
    });
    const confirmEyeButton = createEyeButton("confirm-password");
    confirmContainer.append(confirmNewPassword, confirmEyeButton);

    passwordWrapper.append(
      currentPasswordContainer,
      newPasswordContainer,
      confirmContainer,
      this.createCancelButton(),
      this.createSaveButton(),
    );

    return passwordWrapper;
  },
  createCancelButton(): HTMLElement {
    const cancelButton = createButton({
      type: "button",
      name: "Cancel",
      id: "cancel",
    }) as HTMLButtonElement;

    cancelButton.addEventListener("click", () => {
      PageRouter.navigateTo(PageType.profile);
    });

    return cancelButton;
  },
  createSaveButton(): HTMLElement {
    const saveButton = createButton({
      type: "submit",
      name: "Save",
      id: "save",
    }) as HTMLButtonElement;

    saveButton.addEventListener("click", () => {});

    return saveButton;
  },
  async renderOnSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;

    const isValid = handleOnSubmit(form, FormType.PROFILE);
    if (!isValid) return;

    const formData = new FormData(form);
    const newPassword = formData.get("new-password")?.toString().trim();
    const confirmPassword = formData.get("confirm-password")?.toString().trim();

    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      await showModalMessage(SETTINGS.label.changePassword.wrongConfirm);
      return;
    }

    const result = await customerService.changePassword(newPassword);

    if (Array.isArray(result)) {
      const message = result[0]?.message;
      await showModalMessage(message);
    } else if (result) {
      await showModalMessage(SETTINGS.label.changePassword.success);
      PageRouter.navigateTo(PageType.profile);
    } else {
      await showModalMessage(SETTINGS.label.errors.updatePassword);
    }
  },
};
export default ChangePassword;
