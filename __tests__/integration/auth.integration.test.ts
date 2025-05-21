import { MyCustomerDraft } from "@commercetools/platform-sdk";

import registerCustomer from "@/api/repositories/endpoints/customer/register-customer";
import loginCustomer from "@/api/repositories/endpoints/customer/login-customer";
import getCustomerToken from "@/api/repositories/endpoints/customer/get-customer-token";

describe("Auth Integration", () => {
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const testPassword = "StrongPass123!";

  const testDraft: MyCustomerDraft = {
    email: uniqueEmail,
    password: testPassword,
    firstName: "Test",
    lastName: "User",
    dateOfBirth: "1990-01-01",
    addresses: [
      {
        streetName: "Test Street",
        postalCode: "12345",
        city: "Testville",
        country: "DE",
      },
    ],
    defaultShippingAddress: 0,
    defaultBillingAddress: 0,
  };

  it("should register a new customer successfully", async () => {
    const testRegisterDraft = testDraft;
    const result = await registerCustomer(testRegisterDraft);
    expect(result).toBeDefined();
    expect(result?.customer.email).toBe(testRegisterDraft.email);
    expect(result?.customer.firstName).toBe(testRegisterDraft.firstName);
  });

  const testLoginDraft = {
    ...testDraft,
    email: "test1email@example.com",
    password: "StrongPass123!",
  };

  it("should login an existing customer successfully", async () => {
    // await registerCustomer(testLoginDraft);

    const result = await loginCustomer(
      testLoginDraft.email,
      testLoginDraft.password,
    );
    expect(result).toBeDefined();
    expect(result.customer.email).toBe(testLoginDraft.email);
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
});
