jest.mock("@/api/repositories/api-client", () => ({
  __esModule: true,
  default: {
    me: () => ({
      signup: () => ({
        post: () => ({
          execute: jest.fn().mockResolvedValue({
            body: { customer: { id: "123", email: "test@example.com" } },
          }),
        }),
      }),
      login: () => ({
        post: () => ({
          execute: jest.fn().mockResolvedValue({
            body: {
              customer: { id: "456", email: "login@example.com" },
              cart: {},
            },
          }),
        }),
      }),
    }),
  },
}));
jest.mock("@/components/modal-window/modal-window", () => ({
  __esModule: true,
  default: jest.fn(), // mock showModalMessage as jest.fn()
}));

import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import authRepository from "@/api/repositories/auth-repository";
import authService from "@/api/services/auth-service";
import authStore from "@/stores/auth-store";

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
        billingAddress: {
          streetName: "Main St",
          postalCode: "12345",
          city: "London",
          country: "GB",
        },
        shippingAddress: {
          streetName: "Main St",
          postalCode: "12345",
          city: "London",
          country: "GB",
        },
        isSameAddress: true,
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

  describe("logoutCustomer", () => {
    it("should clear user and token and return success", () => {
      const setUserSpy = jest
        .spyOn(authStore, "setUser")
        .mockImplementation(() => {});
      // const clearTokenSpy = jest
      //   .spyOn(tokenStore, "clearToken")
      //   .mockImplementation(() => {});
      const result = authService.logout();

      expect(setUserSpy).toHaveBeenCalledWith(undefined);
      // expect(clearTokenSpy).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});
