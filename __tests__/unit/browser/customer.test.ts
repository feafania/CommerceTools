import { oldTestCustomer } from "../__mocks__/customer.mock";

import customerService from "@/api/services/customer-service";
import customerRepository from "@/api/repositories/customer-repository";
import authStore from "@/stores/auth-store";
import { tokenStore } from "@/stores/token-store";
import authService from "@/api/services/auth-service";
import showModalMessage from "@/components/modal-window/modal-window";
import { SETTINGS } from "@/config/settings";
import { ApiError } from "@/api/handle-api-error";

jest.mock("@/api/repositories/customer-repository");
jest.mock("@/api/services/auth-service");
jest.mock("@/components/modal-window/modal-window", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/assets/svg/eye-password-hide.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/eye-password-show.inline.svg", () => "mocked-svg");

describe("customerService.update", () => {
  const oldCustomer = oldTestCustomer;

  const newCustomer = {
    ...oldCustomer,
    firstName: "Johnny",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authStore.setUser(oldCustomer);
    jest
      .spyOn(tokenStore, "accessToken", "get")
      .mockReturnValue("mocked-token");
    tokenStore.isTokenExpired = jest.fn().mockReturnValue(false);
  });

  it("should refresh token if expired", async () => {
    (tokenStore.isTokenExpired as jest.Mock).mockReturnValue(true);
    (authService.refreshToken as jest.Mock).mockResolvedValue(
      JSON.parse("null"),
    );
    (customerRepository.update as jest.Mock).mockResolvedValue(newCustomer);

    await customerService.update(newCustomer);

    expect(authService.refreshToken).toHaveBeenCalled();
  });

  it("should not proceed without token", async () => {
    jest
      .spyOn(tokenStore, "accessToken", "get")
      .mockReturnValue(JSON.parse("null"));

    const result = await customerService.update(newCustomer);

    expect(customerRepository.update).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should not proceed without authStore.user", async () => {
    authStore.setUser(undefined);

    const result = await customerService.update(newCustomer);

    expect(customerRepository.update).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should update customer and setUser", async () => {
    const setUserSpy = jest.spyOn(authStore, "setUser");
    (customerRepository.update as jest.Mock).mockResolvedValue(newCustomer);

    const result = await customerService.update(newCustomer);

    expect(customerRepository.update).toHaveBeenCalledWith(
      oldCustomer,
      newCustomer,
      "mocked-token",
    );
    expect(setUserSpy).toHaveBeenCalledWith(newCustomer);
    expect(result).toEqual(newCustomer);
  });

  it("should show modal if nothing to update", async () => {
    (customerRepository.update as jest.Mock).mockResolvedValue(
      JSON.parse("null"),
    );

    await customerService.update(newCustomer);

    expect(showModalMessage).toHaveBeenCalledWith(
      SETTINGS.label.messages.nothingToUpdate,
    );
  });

  it("should show modal on ApiError", async () => {
    const error = new ApiError(400, "Bad Request");
    (customerRepository.update as jest.Mock).mockRejectedValue(error);

    await customerService.update(newCustomer);

    expect(showModalMessage).toHaveBeenCalledWith(
      expect.stringContaining("Bad Request"),
    );
    expect((showModalMessage as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });
});

describe("customerService.changePassword", () => {
  const oldCustomer = oldTestCustomer;
  const newPassword = "newStrongPassword123";

  beforeEach(() => {
    jest.clearAllMocks();
    authStore.setUser({ ...oldCustomer, password: "oldPassword" });
    jest
      .spyOn(tokenStore, "accessToken", "get")
      .mockReturnValue("mocked-token");
    tokenStore.isTokenExpired = jest.fn().mockReturnValue(false);
  });

  it("should refresh token if expired", async () => {
    (tokenStore.isTokenExpired as jest.Mock).mockReturnValue(true);
    (authService.refreshToken as jest.Mock).mockResolvedValue(
      JSON.parse("null"),
    );
    (customerRepository.changePassword as jest.Mock).mockResolvedValue(
      oldCustomer,
    );
    (authService.login as jest.Mock).mockResolvedValue(oldCustomer);

    await customerService.changePassword(oldCustomer.password!, newPassword);

    expect(authService.refreshToken).toHaveBeenCalled();
  });

  it("should not proceed and return undefined if token is missing", async () => {
    jest
      .spyOn(tokenStore, "accessToken", "get")
      .mockReturnValue(JSON.parse("null"));

    const result = await customerService.changePassword(
      oldCustomer.password!,
      newPassword,
    );

    expect(customerRepository.changePassword).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should not proceed and return undefined if user is missing or has no password", async () => {
    authStore.setUser(undefined);
    let result = await customerService.changePassword(undefined, newPassword);
    expect(customerRepository.changePassword).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    authStore.setUser({ ...oldCustomer, password: undefined });
    result = await customerService.changePassword(undefined, newPassword);
    expect(customerRepository.changePassword).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    authStore.setUser({ ...oldCustomer, version: undefined });
    result = await customerService.changePassword(
      oldCustomer.password!,
      newPassword,
    );
    expect(customerRepository.changePassword).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should call changePassword and then login with new password", async () => {
    (customerRepository.changePassword as jest.Mock).mockResolvedValue(
      oldCustomer,
    );
    (authService.login as jest.Mock).mockResolvedValue(oldCustomer);

    const result = await customerService.changePassword(
      oldCustomer.password!,
      newPassword,
    );

    expect(customerRepository.changePassword).toHaveBeenCalledWith(
      oldCustomer.version,
      oldCustomer.password!,
      newPassword,
      "mocked-token",
    );
    expect(authService.login).toHaveBeenCalledWith(
      oldCustomer.email,
      newPassword,
    );
    expect(result).toEqual(oldCustomer);
  });

  it("should show modal error and return invalid fields on ApiError", async () => {
    const fieldErrors = [{ field: "password", message: "Invalid password" }];
    const error = new ApiError(400, "Bad Request", fieldErrors);

    (customerRepository.changePassword as jest.Mock).mockRejectedValue(error);

    const result = await customerService.changePassword(
      oldCustomer.password!,
      newPassword,
    );

    expect(showModalMessage).toHaveBeenCalledWith(
      expect.stringContaining("Bad Request"),
    );
    expect(result).toEqual(fieldErrors);
  });

  it("should return undefined on unknown error without showing modal", async () => {
    const unknownError = new Error("Unexpected error");

    (customerRepository.changePassword as jest.Mock).mockRejectedValue(
      unknownError,
    );

    const result = await customerService.changePassword(
      oldCustomer.password!,
      newPassword,
    );

    expect(showModalMessage).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
