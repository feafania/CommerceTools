import { AppTranslation } from "@/types/translation";

const en: AppTranslation = {
  header: {
    appTitle: "Gifts shop",
  },
  nav: {
    signIn: "Sign In",
    registration: "Registration",
    main: "Main",
    about: "About Us",
    signOut: "Sign Out",
    directions: {
      toSignIn: "Already have an account?",
      toSignUp: "Don't have an account?",
    },
    directionsLabels: {
      toSignIn: "Sign In",
      toSignUp: "Sign Up",
    },
  },
  login: {
    email: "Email Address",
    password: "Password",
    header: "Authentication",
    emptyField: "Please enter",
    submit: "Sign in",
  },
  registration: {
    firstName: "First name",
    lastName: "Last name",
    birthDay: "Birth day",
    email: "Email Address",
    password: "Password",
    header: "Registration",
    submit: "Sign up",
  },
  main: {
    title: "Welcome to Gifts Shop",
  },
  address: {
    headers: {
      billing: "Billing address",
      shipping: "Shipping address",
    },
    country: "Country",
    city: "City",
    street: "Street",
    postalCode: "Postal Code",
    default: {
      billing: "Set as default billing address",
      shipping: "Set as default shipping address",
    },
    isSameAddress: "My billing address is not the same as my shipping address.",
    countryNames: {
      PL: "Poland",
      UK: "United Kingdom",
      DE: "Germany",
      FR: "France",
      ES: "Spain",
    },
    placeholders: {
      country: "Select a country",
    },
  },
  validation: {
    email:
      "Please enter a valid email address (e.g., user@example.com). It must" +
      " not have spaces, must include '@', and a valid domain (e.g., example.com).",
    firstName:
      "First name must contain only letters and at least one character.",
    lastName: "Last name must contain only letters and at least one character.",
    dateOfBirth: "You must be at least 13 years old.",
    password:
      "Password must be at least 8 characters long, include uppercase and lowercase" +
      " letters, a digit, and optionally a special character (!@#$%^&*). It must not" +
      " have leading or trailing spaces.",
    city: "City must contain only letters and spaces.",
    street: "Street cannot be empty.",
    postalCode: {
      PL: "Postal code must match format for Poland (00-000).",
      UK: "Postal code must match format for UK (SW1A 1AA).",
      DE: "Postal code must match format for Germany (12345).",
      FR: "Postal code must match format for France (75000 or 75 000).",
      ES: "Postal code must match format for Spain (28001).",
    },
    commonError: "Validation error.",
  },
  errorsTypes: {
    duplicate: "The value already exists",
    required: "Required field",
    credentials: "Invalid email or password",
    invalid: "Incorrect value",
    invalidPostalCode: "Incorrect postal code",
    invalidEmail: "Incorrect email",
    invalidPhoneNumber: "Incorrect phone number",
    unknown: "Unknown error",
  },
  errors: {
    login: "Login failed.",
    registration: "Registration failed.",
    categories: "Failed to load categories.",
  },
  messages: {
    onSignIn: "You have successfully signed in.",
    onSignUp: "Your account has been created.",
    onSignOut: "You have been signed out.",
  },
};

export default en;
