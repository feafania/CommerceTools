import {
  mockedRegisterCustomer,
  mockedLoginCustomer,
  mockedGetCustomerToken,
  registerResponse,
  loginResponse,
  mockCustomer,
  tokenResponse,
  token,
  mockDate,
  mockedRevokeCustomerToken,
  mockedGetMe,
} from "../__mocks__/auth.mock";

import authRepository from "@/api/repositories/auth-repository";

jest.mock("@/api/repositories/endpoints/customer/register-customer");
jest.mock("@/api/repositories/endpoints/customer/login-customer");
jest.mock("@/api/repositories/endpoints/token/get-customer-token");
jest.mock("@/api/repositories/endpoints/token/revoke-token");
jest.mock("@/api/repositories/endpoints/customer/get-me");

const inMockCustomer = authRepository.toInternalCustomer(
  mockCustomer,
  mockCustomer.password,
);

describe("authRepository", () => {
  beforeEach(() => {
    mockedRegisterCustomer.mockResolvedValue(registerResponse);
    mockedLoginCustomer.mockResolvedValue(loginResponse);
    mockedGetCustomerToken.mockResolvedValue(tokenResponse);
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
        authRepository.toInternalCustomer(
          registerResponse.customer,
          registerResponse.customer.password,
        ),
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
    beforeAll(() => {
      jest.spyOn(Date, "now").mockImplementation(() => mockDate);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    it("should call loginCustomer and return a transformed customer", async () => {
      const { email, password } = inMockCustomer;
      const result = await authRepository.login(email, password!);

      expect(mockedLoginCustomer).toHaveBeenCalledWith(email, password);
      expect(mockedGetCustomerToken).toHaveBeenCalledWith(email, password);

      expect(result).toHaveProperty("customer");
      expect(result).toHaveProperty("token");

      expect(result?.customer).toEqual(
        authRepository.toInternalCustomer(
          loginResponse.customer,
          loginResponse.customer.password,
        ),
      );
      expect(result?.token).toStrictEqual(token);
    });

    it("should throw if loginCustomer fails", async () => {
      mockedLoginCustomer.mockRejectedValueOnce(new Error("Login failed"));

      await expect(
        authRepository.login(mockCustomer.email, mockCustomer.password!),
      ).rejects.toThrow("Login failed");
    });
  });

  describe("revokeToken", () => {
    it("should call revokeCustomerToken and return true", async () => {
      mockedRevokeCustomerToken.mockResolvedValueOnce(true);

      const result = await authRepository.revokeToken(
        "mock-token",
        "refresh_token",
      );

      expect(mockedRevokeCustomerToken).toHaveBeenCalledWith(
        "mock-token",
        "refresh_token",
      );
      expect(result).toBe(true);
    });

    it("should throw if revokeCustomerToken fails", async () => {
      mockedRevokeCustomerToken.mockRejectedValueOnce(
        new Error("Token revoke failed"),
      );

      await expect(
        authRepository.revokeToken("mock-token", "refresh_token"),
      ).rejects.toThrow("Token revoke failed");
    });
  });

  describe("getMe", () => {
    beforeEach(() => {
      mockedGetMe.mockResolvedValue(mockCustomer);
    });
    it("should call getMe and return a transformed customer", async () => {
      mockedGetMe.mockResolvedValueOnce(mockCustomer);

      const result = await authRepository.getMe("mock-token");

      expect(mockedGetMe).toHaveBeenCalledWith("mock-token");
      expect(result).toEqual(
        authRepository.toInternalCustomer(mockCustomer, ""),
      );
    });

    it("should throw if getMe fails", async () => {
      mockedGetMe.mockRejectedValueOnce(new Error("GetMe failed"));

      await expect(authRepository.getMe("mock-token")).rejects.toThrow(
        "GetMe failed",
      );
    });
  });
});
