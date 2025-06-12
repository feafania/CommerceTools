import { getTestDraft, testLoginDraft } from "./__mocks__/integration.mock";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/token/get-customer-token";
import getMe from "@/api/repositories/endpoints/customer/get-me";

describe("Auth Integration", () => {
  const testDraft = getTestDraft();

  it("should register a new customer successfully", async () => {
    const testRegisterDraft = testDraft;
    const result = await registerCustomer(testRegisterDraft);
    expect(result).toBeDefined();
    expect(result?.customer.email).toBe(testRegisterDraft.email);
    expect(result?.customer.firstName).toBe(testRegisterDraft.firstName);
  });

  it("should login an existing customer successfully", async () => {
    // await registerCustomer(testLoginDraft);

    const result = await loginCustomer(
      testLoginDraft.email,
      testLoginDraft.password,
    );
    expect(result).toBeDefined();
    if (result) {
      expect(result.customer.email).toBe(testLoginDraft.email);
    }
  });

  it("should obtain a valid access token after login", async () => {
    const tokenResponse = await getCustomerToken(
      testLoginDraft.email,
      testLoginDraft.password,
    );

    expect(tokenResponse).toBeDefined();
    expect(typeof tokenResponse?.access_token).toBe("string");
    expect(tokenResponse?.access_token.length).toBeGreaterThan(0);
  });

  it("should fail to login with wrong password", async () => {
    try {
      await loginCustomer(testDraft.email, "WrongPassword123!");
      fail("Expected login to fail with incorrect password");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("should fetch the current customer using access token", async () => {
    const tokenResponse = await getCustomerToken(
      testLoginDraft.email,
      testLoginDraft.password,
    );

    expect(tokenResponse?.access_token).toBeDefined();

    const me = await getMe(tokenResponse!.access_token);

    expect(me).toBeDefined();
    expect(me.email).toBe(testLoginDraft.email);
  });
});
