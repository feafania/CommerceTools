import { AppTranslation } from "@/types/translation";

const pl: AppTranslation = {
  header: {
    appTitle: "Prezenty",
  },
  nav: {
    signIn: "Zaloguj się",
    registration: "Załóż konto",
    main: "Strona główna",
    about: "O nas",
    signOut: "Wyloguj się",
    directions: {
      toSignIn: "Masz już konto?",
      toSignUp: "Nie masz konta?",
    },
    directionsLabels: {
      toSignIn: "Zaloguj się",
      toSignUp: "Załóż konto",
    },
  },
  login: {
    email: "Adres e-mail",
    password: "Hasło",
    header: "Logowanie",
    submit: "Zaloguj się",
    emptyField: "Proszę wpisać",
  },
  registration: {
    firstName: "Imię",
    lastName: "Nazwisko",
    birthDay: "Data urodzenia",
    email: "Adres e-mail",
    password: "Hasło",
    header: "Rejestracja",
    submit: "Zarejestruj się",
  },
  main: {
    title: "Witamy w sklepie z prezentami",
  },
  address: {
    headers: {
      billing: "Adres do faktury",
      shipping: "Adres dostawy",
    },
    country: "Kraj",
    city: "Miasto",
    street: "Ulica",
    postalCode: "Kod pocztowy",
    default: {
      billing: "Ustaw jako domyślny adres do faktury",
      shipping: "Ustaw jako domyślny adres dostawy",
    },
    isSameAddress:
      "Mój adres rozliczeniowy nie jest taki sam jak adres dostawy.",
    countryNames: {
      PL: "Polska",
      UK: "Wielka Brytania",
      DE: "Niemcy",
      FR: "Francja",
      ES: "Hiszpania",
    },
    placeholders: {
      country: "Wybierz kraj",
    },
  },
  validation: {
    email:
      "Proszę podać prawidłowy adres e-mail (np. uzytkownik@przyklad.com). Nie może" +
      " zawierać spacji, musi zawierać znak '@' oraz poprawną domenę (np. przyklad.com).",
    firstName:
      "Imię musi zawierać tylko litery i składać się z co najmniej jednego znaku.",
    lastName:
      "Nazwisko musi zawierać tylko litery i składać się z co najmniej jednego znaku.",
    dateOfBirth: "Musisz mieć co najmniej 13 lat.",
    passwordLoginPage:
      "Hasło musi mieć co najmniej 8 znaków, zawierać duże i małe litery" +
      " cyfrę oraz opcjonalnie znak specjalny (!@#$%^&*). Nie może" +
      " zawierać spacji na początku ani na końcu.",
    password:
      "Hasło musi mieć co najmniej 8 znaków," +
      " zawierać duże i małe litery oraz cyfrę.",
    city: "Miasto musi zawierać tylko litery i spacje.",
    street: "Nie może być puste",
    postalCode: {
      PL: "Kod pocztowy musi być zgodny z formatem obowiązującym w Polsce (00-000).",
      UK: "Kod pocztowy musi być zgodny z formatem obowiązującym w Wielkiej Brytanii (SW1A 1AA).",
      DE: "Kod pocztowy musi być zgodny z formatem obowiązującym w Niemczech  (12345).",
      FR: "Kod pocztowy musi być zgodny z formatem obowiązującym we Francji  (75000 lub 75 000).",
      ES: "Kod pocztowy musi być zgodny z formatem obowiązującym w Hiszpanii  (28001).",
    },
    commonError: "Błąd walidacji.",
  },
  errorsTypes: {
    duplicate: "Wartość już istnieje",
    required: "Pole obowiązkowe",
    credentials: "Nieprawidłowy adres e-mail lub hasło",
    invalid: "Nieprawidłowa wartość",
    invalidPostalCode: "Nieprawidłowy kod pocztowy",
    invalidEmail: "Nieprawidłowy e-mail",
    invalidPhoneNumber: "Nieprawidłowy numer telefonu",
    unknown: "Nieznany błąd",
  },
  errors: {
    login: "Logowanie nie powiodło się.",
    registration: "Rejestracja nie powiodła się.",
    categories: "Nie udało się załadować kategorii.",
  },
  messages: {
    onSignIn: "Zostałeś pomyślnie zalogowany.",
    onSignUp: "Twoje konto zostało utworzone.",
    onSignOut: "Zostałeś wylogowany.",
  },
};

export default pl;
