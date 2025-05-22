import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import { SETTINGS } from "@/config/settings";
import { handleOnSubmit } from "@/utils/validation";
import AuthService from "@/api/services/auth-service";

const LoginView = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "login";
    container.className = "view login-view";

    const h2 = document.createElement("h2");
    h2.className = "login-title";
    h2.textContent = SETTINGS.label.login.header;

    const form = document.createElement("form");
    form.className = "login-form form";
    form.append(this.renderLogin(), this.renderPassword(), this.renderSubmit());

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit(event);
    });

    container.append(h2, form);
    return container;
  },

  renderLogin(): HTMLElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.login.name,
      name: "username",
      placeholder: SETTINGS.label.login.name,
      id: "username",
      class: "login-input",
      // required: true,
      validation: VALIDATION.email,
    });
  },

  renderPassword(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "password-wrapper";

    const passwordInput = createInput({
      type: "password",
      label: SETTINGS.label.login.password,
      name: "password",
      placeholder: SETTINGS.label.login.password,
      id: "password",
      class: "password-input",
      validation: VALIDATION.password,
    });

    // Create eye icon
    const eyeButton = document.createElement("button");
    eyeButton.type = "button";
    eyeButton.className = "toggle-password-button";
    eyeButton.setAttribute("aria-label", "Show password");
    eyeButton.innerHTML = `<img src="/public/assets/eye-svgrepo-com.svg"
    width="20" height="20" alt="Show password" />`;

    // Toggle logic
    eyeButton.addEventListener("click", () => {
      const input = wrapper.querySelector<HTMLInputElement>("#password");
      if (input) {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        eyeButton.setAttribute(
          "aria-label",
          isHidden ? "Hide password" : "Show password",
        );
        eyeButton.innerHTML = isHidden
          ? `
            <img src="/public/assets/eye-password-hide.svg"
            width="20" height="20" alt="Show password" />
          `
          : (eyeButton.innerHTML = `<img src="/public/assets/eye-svgrepo-com.svg"
            width="20" height="20" alt="Show password" />
          `);
      }
    });

    // Append eye icon inside the wrapper
    wrapper.append(passwordInput, eyeButton);

    return wrapper;
  },

  renderSubmit(): HTMLElement {
    return createButton({
      name: SETTINGS.label.login.submit,
      id: "submit-login",
      class: "submit-login-button btn",
    });
  },

  async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const isValid = await handleOnSubmit(form, "registration");
    if (!isValid) return;

    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await AuthService.login(email, password);
  },
};

export default LoginView;
