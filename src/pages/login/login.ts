import "./login.css";
import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";
import createButton from "@/components/button/button";
import showModalMessage from "@/components/modal-window/modal-window";

const LoginView = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.id = "login";
    container.className = "view login-view";

    const h2 = document.createElement("h2");
    h2.className = "login-title";
    h2.textContent = "Authentication";

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
      label: "Login",
      name: "username",
      placeholder: "Enter your name...",
      id: "username",
      class: "login-input",
      // required: true,
      validation: VALIDATION.username,
    });
  },

  renderPassword(): HTMLElement {
    return createInput({
      type: "password",
      label: "Password",
      name: "password",
      placeholder: "Enter your password...",
      id: "password",
      class: "password-input",
      // required: true,
      validation: VALIDATION.password,
    });
  },

  renderSubmit(): HTMLElement {
    return createButton({
      name: "Submit",
      id: "submit-login",
      class: "submit-login-button",
    });
  },

  async onSubmit(event: SubmitEvent) {
    console.log("Login form submitted");

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const login = (formData.get("username") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    const loginInput = form.querySelector<HTMLInputElement>("#username");
    const passwordInput = form.querySelector<HTMLInputElement>("#password");

    if (!login) {
      showModalMessage("Please enter your username.");
      loginInput?.focus();
      return;
    }

    if (!VALIDATION.username.pattern.test(login)) {
      showModalMessage("Username is invalid. Please follow the rules.");
      loginInput?.focus();
      return;
    }

    if (!password) {
      showModalMessage("Please enter your password.");
      passwordInput?.focus();
      return;
    }

    if (!VALIDATION.password.pattern.test(password)) {
      showModalMessage("Password is invalid. Please follow the rules.");
      passwordInput?.focus();
      return;
    }

    // const user: UserType = { login, password };
    // await wsClient.login(user);
  },
};

export default LoginView;
