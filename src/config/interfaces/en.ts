import { AppTranslation } from "@/types/translation";

const en: AppTranslation = {
  nav: {
    signIn: "Sign In",
    registration: "Registration",
    main: "Main",
    about: "About Us",
    signOut: "Sign Out",
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
    street: "Street",
    city: "City",
    postalCode: "Post Code",
    country: "Country",
    login: "login",
    password: "Password",
    header: "Registration",
    submit: "Submit",
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
  },
};

export default en;
