import { SETTINGS } from "@/config/settings";
// import { handleOnSubmit } from "@/utils/validation";
import createInput from "@/components/input/input";
// import createButton from "@/components/button/button";
import createEyeButton from "@/components/eye-button/eye-button";
// import { FormType } from "@/types/enum";
import authStore from "@/stores/auth-store";

const ChangePassword = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "user-profile";
    container.className = "view user-profile-view";

    const passwordForm = document.createElement("form");
    passwordForm.id = "password-form";
    passwordForm.className = "form";
    passwordForm.append(this.renderPassword());

    container.append(passwordForm);
    return container;
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
      value: authStore.user?.password,
    });

    const eyeButton = createEyeButton();
    passwordWrapper.append(passwordInput, eyeButton);

    return passwordWrapper;
  },
};
export default ChangePassword;
