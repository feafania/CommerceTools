import {
  mockedRegisterCustomer,
  mockedLoginCustomer,
  registerResponse,
  loginResponse,
  mockCustomer,
} from "../__mocks__/auth.mock";

import authRepository from "@/api/repositories/auth-repository";

jest.mock("@/api/repositories/endpoints/customer/register-customer");
jest.mock("@/api/repositories/endpoints/customer/login-customer");

const inMockCustomer = authRepository.toInternalCustomer(mockCustomer);

describe("authRepository", () => {
  beforeEach(() => {
    mockedRegisterCustomer.mockResolvedValue(registerResponse);
    mockedLoginCustomer.mockResolvedValue(loginResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should call registerCustomer and return a transformed customer", async () => {
      const result = await authRepository.register(inMockCustomer);

      expect(mockedRegisterCustomer).toHaveBeenCalledWith(
        authRepository.toMyCustomerDraft(inMockCustomer),
      );
      expect(result).toEqual(
        authRepository.toInternalCustomer(registerResponse.customer),
      );
    });

    it("should throw if registerCustomer fails", async () => {
      mockedRegisterCustomer.mockRejectedValueOnce(
        new Error("Register failed"),
      );

      await expect(authRepository.register(inMockCustomer)).rejects.toThrow(
        "Register failed",
      );
    });
  });

  describe("login", () => {
    it("should call loginCustomer and return a transformed customer", async () => {
      const { email, password } = inMockCustomer;
      const result = await authRepository.login(email, password!);

      expect(mockedLoginCustomer).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(
        authRepository.toInternalCustomer(loginResponse.customer),
      );
    });

    it("should throw if loginCustomer fails", async () => {
      mockedLoginCustomer.mockRejectedValueOnce(new Error("Login failed"));

      await expect(
        authRepository.login(mockCustomer.email, mockCustomer.password!),
      ).rejects.toThrow("Login failed");
    });
  });
});
