import { DiscountCode } from "@commercetools/platform-sdk";

import { InCustomer } from "@/types/interfaces";

export function isInCustomer(user: unknown): user is InCustomer {
  return (
    typeof user === "object" &&
    user !== null &&
    "email" in user &&
    "firstName" in user &&
    "lastName" in user
  );
}

export function isDefinedDiscountCode(
  discount: DiscountCode | undefined,
): discount is DiscountCode {
  return discount !== undefined;
}
