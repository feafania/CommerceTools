import { AppTranslation } from "@/types/translation";

const pl: AppTranslation = {
  nav: {
    signIn: "Sign In",
    registration: "Registration",
    main: "Main",
    about: "About Us",
    signOut: "Sign Out",
  },
  login: {
    name: "Login",
    password: "Haslo",
    header: "Autenfikacia",
    submit: "Podtvierdzic",
  },
  registration: {
    name: "Login",
    password: "Password",
    header: "Authentication",
    submit: "Submit",
  },
  errorsTypes: {
    duplicate: "Wartość już istnieje",
    invalid: "Nieprawidłowa wartość",
    required: "Pole obowiązkowe",
    credentials: "Nieprawidłowy adres e-mail lub hasło",
    unknown: "Nieznany błąd",
  },
  errors: {
    login: "Logowanie nie powiodło się.",
    registration: "Rejestracja nie powiodła się.",
  },
};

export default pl;
