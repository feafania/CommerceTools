import { oldTestCustomer } from "../__mocks__/customer";

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
