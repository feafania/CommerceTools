import { waitFor } from "@testing-library/dom";

import {
  mockCustomer,
  mockedRegisterCall,
  MockFormData,
  mockPassword,
  PointerEventMock,
} from "../__mocks__/auth.mock";

import LoginRegistrationView from "@/pages/login-registration/login-registration";
import AuthService from "@/api/services/auth-service";
import PageRouter from "@/router/page-router";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { FormType, PageType } from "@/types/enum";
import * as ValidationUtils from "@/utils/validation";

import "@testing-library/jest-dom";

jest.mock("@/router/page-router");
jest.mock("@/api/services/auth-service");
jest.mock("@/components/modal-window/modal-window");
jest.mock("@/components/layout/header/header");
jest.mock("@/assets/svg/eye-password-hide.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/eye-password-show.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/rs-school-logo.inline.svg", () => "mocked-svg");
jest.spyOn(ValidationUtils, "handleOnSubmit").mockResolvedValue(true);

declare global {
  interface Window {
    PointerEvent: typeof PointerEventMock;
  }
}

describe("LoginRegistrationView", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    globalThis.PointerEvent = PointerEventMock;
  });

  describe("renderLoginForm", () => {
    it("should render login form with email, password and submit button", async () => {
      const form = await LoginRegistrationView.renderLoginForm();
      document.body.append(form);

      expect(form.querySelector("form.login-form")).toBeInTheDocument();
      expect(form.querySelector("#email")).toBeInTheDocument();
      expect(form.querySelector("#password")).toBeInTheDocument();
      expect(form.querySelector("button[type='submit']")).toBeInTheDocument();
    });
  });

  describe("renderRegistrationForm", () => {
    it("should render registration form with user data inputs", async () => {
      const form = await LoginRegistrationView.renderRegistrationForm();
      document.body.append(form);

      expect(form.querySelector("#firstname")).toBeInTheDocument();
      expect(form.querySelector("#lastname")).toBeInTheDocument();
      expect(form.querySelector("#birthday")).toBeInTheDocument();
      expect(form.querySelector("#email")).toBeInTheDocument();
      expect(form.querySelector("#password")).toBeInTheDocument();
    });
  });

  describe("toggleBillingAddress", () => {
    it("should hide billing address when checkbox is unchecked", async () => {
      const form = await LoginRegistrationView.renderRegistrationForm();
      document.body.append(form);

      const checkbox = form.querySelector<HTMLInputElement>(
        "#show-billing-address",
      );
      expect(checkbox).toBeInTheDocument();

      checkbox!.checked = true;
      checkbox!.dispatchEvent(new Event("change", { bubbles: true }));

      await waitFor(() => {
        expect(form.querySelector(".secondary-address")).toBeInTheDocument();
      });

      checkbox!.checked = false;
      checkbox!.dispatchEvent(new Event("change", { bubbles: true }));

      await waitFor(() => {
        expect(
          form.querySelector(".secondary-address"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("onLoginSubmit", () => {
    it("should call AuthService.login and redirect on success", async () => {
      (AuthService.login as jest.Mock).mockResolvedValue(mockCustomer);

      const form = await LoginRegistrationView.renderLoginForm();
      document.body.append(form);

      const email = form.querySelector<HTMLInputElement>("#email")!;
      const password = form.querySelector<HTMLInputElement>("#password")!;
      email.value = mockCustomer.email;
      password.value = mockPassword;

      const formElement = form.querySelector("form")!;
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });

      submitEvent.preventDefault = jest.fn();

      let onSubmitPromise: Promise<void>;
      formElement.addEventListener("submit", (event_) => {
        event_.preventDefault();
        onSubmitPromise = LoginRegistrationView.onLoginSubmit(
          event_ as unknown as SubmitEvent,
        );
      });

      formElement.dispatchEvent(submitEvent);

      await onSubmitPromise!;

      expect(submitEvent.preventDefault).toHaveBeenCalled();
      expect(AuthService.login).toHaveBeenCalledWith(
        mockCustomer.email,
        mockPassword,
      );
      expect(PageRouter.navigateTo).toHaveBeenCalledWith(PageType.main);
      expect(showModalMessage).toHaveBeenCalledWith(
        SETTINGS.label.messages.onSignIn,
      );
    });
  });

  describe("onRegistrationSubmit", () => {
    it("should call AuthService.register and redirect on success", async () => {
      (AuthService.register as jest.Mock).mockResolvedValue(mockCustomer);
      (AuthService.login as jest.Mock).mockResolvedValue(mockCustomer);

      const formContainer =
        await LoginRegistrationView.renderRegistrationForm();
      document.body.append(formContainer);

      const formElement = formContainer.querySelector("form")!;

      jest.spyOn(LoginRegistrationView, "onRegistrationSubmit");
      formElement.addEventListener("submit", (event_) => {
        event_.preventDefault();
        LoginRegistrationView.onRegistrationSubmit(
          event_ as unknown as SubmitEvent,
        );
      });

      const mockFormData = new MockFormData();
      jest
        .spyOn(globalThis, "FormData")
        .mockImplementation(() => mockFormData as unknown as FormData);

      const submitEvent = new Event("submit", { bubbles: true });
      formElement.dispatchEvent(submitEvent);

      await new Promise(process.nextTick);

      expect(AuthService.register).toHaveBeenCalledWith(mockedRegisterCall);

      expect(AuthService.login).toHaveBeenCalledWith(
        mockCustomer.email,
        "test123",
      );
      expect(PageRouter.navigateTo).toHaveBeenCalledWith(PageType.main);
      expect(showModalMessage).toHaveBeenCalledWith(
        SETTINGS.label.messages.onSignUp,
      );
    });
  });

  describe("renderRedirectText", () => {
    it("should navigate to registration when clicking sign-up link", () => {
      const element = LoginRegistrationView.renderRedirectText(FormType.LOGIN);
      const link = element.querySelector("a")!;

      link.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, button: 0 }),
      );

      expect(PageRouter.navigateTo).toHaveBeenCalledWith(PageType.registration);
    });

    it("should navigate to login when clicking sign-in link", () => {
      const element = LoginRegistrationView.renderRedirectText(
        FormType.REGISTRATION,
      );
      const link = element.querySelector("a")!;

      link.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, button: 0 }),
      );

      expect(PageRouter.navigateTo).toHaveBeenCalledWith(PageType.login);
    });
  });
});
