import { AppTranslation } from "@/types/translation";

const en: AppTranslation = {
  nav: {
    signIn: "Sign In",
    registration: "Registration",
    main: "Main",
    about: "About Us",
    signOut: "Sign Out",
    appTitle: "Gifts shop",
  },
  login: {
    name: "Login",
    password: "Password",
    header: "Authentication",
    emptyField: "Please enter",
    submit: "Sign in",
  },
  registration: {
    firstName: "First name",
    lastName: "Last name",
    birthDay: "Birth day",
    login: "login",
    password: "Password",
    header: "Registration",
    openBillingAddress: "Are the billing and shipping addresses different?",
    submit: "Submit",
  },
  main: {
    title: "Welcome to Gifts Shop",
  },
  address: {
    billingHeader: "Billing Address",
    shippingHeader: "Shipping Address",
    country: "Country",
    city: "City",
    street: "Street",
    postalCode: "Postal Code",
    defaultBilling: "Set as default billing address",
    defaultShipping: "Set as default shipping address",
    countryPl: "Poland",
    countryEn: "United Kingdom",
  },
  validation: {
    email:
      "Please enter a valid email address (e.g., user@example.com). It must" +
      " not have spaces, must include '@', and a valid domain (e.g., example.com).",
    firstName:
      "First name must contain only letters and at least one character.",
    lastName: "Last name must contain only letters and at least one character.",
    dateOfBirth: "You must be at least 13 years old.",
    passwordLoginPage:
      "Password must be at least 8 characters long, include uppercase and lowercase" +
      " letters, a digit, and optionally a special character (!@#$%^&*). It must not" +
      " have leading or trailing spaces.",
    password:
      "Password must be at least 8 characters long," +
      " include uppercase, lowercase letters and a number.",
    city: "City must contain only letters and spaces.",
    street: "Street cannot be empty.",
    postalCodePoland: "Postal code must match format for Poland (00-000).",
    postalCodeUK: "Postal code must match format for UK (SW1A 1AA).",
    postalCodeGeneric:
      "Postal code must match format for Poland (00-000) or UK (SW1A 1AA).",
    countryPoland: "Poland",
    countryUnitedKingdom: "United Kingdom",
  },
  errorsTypes: {
    duplicate: "The value already exists",
    invalid: "Incorrect value",
    required: "Required field",
    credentials: "Invalid email or password",
    unknown: "Unknown error",
  },
  errors: {
    login: "Login failed.",
    registration: "Registration failed.",
  },
};

export default en;
