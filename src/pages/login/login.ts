import "./login.css";
import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";

const LoginView = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "login";
    container.className = "view login-view";

    const h2 = document.createElement("h2");
    h2.className = "login-title";
    h2.textContent = SETTINGS.label.login.header;

    const form = document.createElement("form");
    form.className = "login-form";
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
      label: SETTINGS.label.registration.password,
      name: "password",
      placeholder: SETTINGS.label.registration.password,
      id: "password",
      class: "password-input",
      validation: VALIDATION.password,
    });

    // Create eye icon
    const eyeButton = document.createElement("button");
    eyeButton.type = "button";
    eyeButton.className = "toggle-password-button";
    eyeButton.innerHTML = "👁️";

    // Toggle logic
    eyeButton.addEventListener("click", () => {
      const input = wrapper.querySelector<HTMLInputElement>("#password");
      if (input) {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        eyeButton.innerHTML = isHidden ? "🙈" : "👁️";
      }
    });

    // Append eye icon inside the wrapper
    wrapper.append(passwordInput, eyeButton);

    return wrapper;
    // return createInput({
    //   type: "password",
    //   label: SETTINGS.label.login.password,
    //   name: "password",
    //   placeholder: SETTINGS.label.login.password,
    //   id: "password",
    //   class: "password-input",
    //   // required: true,
    //   validation: VALIDATION.passwordLoginPage,
    // });
  },

  renderSubmit(): HTMLElement {
    return createButton({
      name: SETTINGS.label.login.submit,
      id: "submit-login",
      class: "submit-login-button",
    });
  },

  async onSubmit(event: SubmitEvent) {
    console.log("Login form submitted");

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const formFields = [
      { name: "username", label: "Name", validation: VALIDATION.email },
      {
        name: "password",
        label: "Password",
        validation: VALIDATION.passwordLoginPage,
      },
    ];

    for (const field of formFields) {
      const value = (formData.get(field.name) as string)?.trim();
      const inputElement = form.querySelector<HTMLInputElement>(
        `#${field.name}`,
      );

      if (!value) {
        showModalMessage(`${SETTINGS.label.login.emptyField} ${field.label}.`);
        inputElement?.focus();
        return;
      }

      const validation = field.validation;
      const isPatternValid =
        "pattern" in validation && validation.pattern
          ? validation.pattern.test(value)
          : true;
      const isValid =
        "isValid" in validation && validation.isValid
          ? validation.isValid(value)
          : true;

      if (!isPatternValid || !isValid) {
        showModalMessage(validation.message);
        inputElement?.focus();
        return;
      }
    }

    // const user: UserType = { login, password };
    // await wsClient.login(user);
  },
};

export default LoginView;
