import { mockCustomer } from "../__mocks__/auth.mock";

import { SETTINGS } from "@/config/settings";
import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import authRepository from "@/api/repositories/auth-repository";
import authService from "@/api/services/auth-service";
import authStore from "@/stores/auth-store";
import { tokenStore } from "@/stores/token-store";
import { TokenType } from "@/types/api-types";

jest.mock("@/api/repositories/auth-repository", () => ({
  getMe: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
}));
jest.mock("@/stores/auth-store", () => ({
  setUser: jest.fn(),
  user: { password: "mock-password" },
}));
jest.mock("@/stores/token-store", () => {
  class MockTokenStore {
    #token: { access_token: string; refresh_token: string } | undefined = {
      ["access_token"]: "mock-access-token",
      ["refresh_token"]: "mock-refresh-token",
    };

    get accessToken() {
      if (this.#token) {
        return this.#token.access_token;
      }
    }

    get refreshToken() {
      if (this.#token) {
        return this.#token.refresh_token;
      }
    }

    setToken(token: TokenType) {
      this.#token = token;
    }

    clearToken() {
      this.#token = undefined;
    }

    isTokenExpired() {
      return false;
    }
  }

  return {
    tokenStore: new MockTokenStore(),
  };
});
jest.mock("@/components/modal-window/modal-window", () => ({
  __esModule: true,
  default: jest.fn(), // mock showModalMessage as jest.fn()
}));
jest.spyOn(authService, "getToken").mockResolvedValue("mock-access-token");
jest.mock("@/api/services/basket-service", () => ({
  __esModule: true,
  default: {
    createCart: jest.fn().mockResolvedValue({ id: "mock-cart-id" }),
  },
}));

describe("authServiceLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ["access_token"]: "mocked-token",
        ["expires_in"]: 172_800,
      }),
    });
  });

  describe("login", () => {
    it("should show login error modal", async () => {
      const mockError = new ApiError(401, "Invalid password");
      jest.spyOn(authRepository, "login").mockRejectedValueOnce(mockError);

      await authService.login("bad@example.com", "wrong");

      expect(showModalMessage).toHaveBeenCalledWith(
        expect.stringContaining("Invalid password"),
      );
    });
  });

  describe("register", () => {
    it("should show registration error modal with correct ApiError message", async () => {
      const mockError = new ApiError(409, "The user has already exists", [
        { field: "email", message: "The user has already exists" },
      ]);
      jest.spyOn(authRepository, "register").mockRejectedValueOnce(mockError);

      await authService.register({
        email: "existing@example.com",
        password: "123456",
        firstName: "Test",
        lastName: "User",
        dateOfBirth: "2000-01-01",
        addresses: [
          {
            streetName: "Main St",
            postalCode: "12345",
            city: "London",
            country: "GB",
            isDefaultBilling: true,
            isDefaultShipping: true,
            key: "billing-shipping-address",
          },
        ],
      });

      expect(showModalMessage).toHaveBeenCalled();
      expect(
        (showModalMessage as jest.Mock).mock.calls[0][0],
      ).toMatchSnapshot();
    });
  });
});

describe("authServiceLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authServiceLogout", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("logoutCustomer", () => {
      it("should revoke token, clear user and return true", async () => {
        const setUserSpy = jest
          .spyOn(authStore, "setUser")
          .mockImplementation(() => {});
        const revokeTokenSpy = jest
          .spyOn(authService, "revokeToken")
          .mockResolvedValue(true);

        const result = await authService.logout();

        expect(revokeTokenSpy).toHaveBeenCalled();
        expect(setUserSpy).toHaveBeenCalledWith(undefined);
        expect(result).toEqual(true);
      });

      it("should show error modal and return false on failure", async () => {
        const revokeTokenSpy = jest
          .spyOn(authService, "revokeToken")
          .mockRejectedValue(new Error("Oops"));

        const setUserSpy = jest.spyOn(authStore, "setUser");
        const showModalSpy = showModalMessage as jest.Mock;

        const result = await authService.logout();

        expect(revokeTokenSpy).toHaveBeenCalled();
        expect(setUserSpy).not.toHaveBeenCalled();
        expect(showModalSpy).toHaveBeenCalledWith(
          expect.stringMatching(SETTINGS.label.errors.logout),
        );
        expect(result).toBe(false);
      });
    });
  });
});

describe("authService.getMe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call authRepository.getMe and update authStore with customer data", async () => {
    (authRepository.getMe as jest.Mock).mockResolvedValueOnce(mockCustomer);

    const result = await authService.getMe();

    expect(authRepository.getMe).toHaveBeenCalledWith("mock-access-token");
    expect(authStore.setUser).toHaveBeenCalledWith({
      ...mockCustomer,
      password: "mock-password",
    });
    expect(result).toEqual({
      ...mockCustomer,
      password: "mock-password",
    });
  });

  it("should return undefined and not call getMe if no accessToken in tokenStore", async () => {
    const originalAccessToken = tokenStore.accessToken;

    Object.defineProperty(tokenStore, "accessToken", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const result = await authService.getMe();

    expect(authRepository.getMe).not.toHaveBeenCalled();
    expect(authStore.setUser).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    Object.defineProperty(tokenStore, "accessToken", {
      configurable: true,
      writable: true,
      value: originalAccessToken,
    });
  });

  it("should show modal error when ApiError thrown", async () => {
    const mockError = new ApiError(500, "Server error");
    (authRepository.getMe as jest.Mock).mockRejectedValueOnce(mockError);

    const result = await authService.getMe();

    expect(showModalMessage).toHaveBeenCalledWith(
      expect.stringContaining("Server error"),
    );
    expect(result).toBeUndefined();
  });

  it("should console.error on unknown error and return undefined", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const unknownError = new Error("Unexpected error");
    (authRepository.getMe as jest.Mock).mockRejectedValueOnce(unknownError);

    const result = await authService.getMe();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Get current user failed:",
      unknownError,
    );
    expect(result).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });
});
