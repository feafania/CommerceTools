import { ApiError } from "@/api/handle-api-error";
import showModalMessage from "@/components/modal-window/modal-window";
import authRepository from "@/api/repositories/auth-repository";
import authService from "@/api/services/auth-service";

jest.mock("@/components/modal-window/modal-window", () => ({
  __esModule: true,
  default: jest.fn(), // mock showModalMessage as jest.fn()
}));

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        "email",
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
