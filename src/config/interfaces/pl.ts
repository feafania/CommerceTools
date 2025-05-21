import { AppTranslation } from "@/types/translation";

const pl: AppTranslation = {
  nav: {
    signIn: "Zaloguj się",
    registration: "Załóż konto",
    main: "Strona główna",
    about: "O nas",
    signOut: "Wyloguj się",
    appTitle: "Prezenty",
  },
  login: {
    name: "Login",
    password: "Hasło",
    header: "Logowanie",
    submit: "Zaloguj się",
  },
  registration: {
    firstName: "Imię",
    lastName: "Nazwisko",
    birthDay: "Data urodzenia",
    street: "Street",
    city: "City",
    postalCode: "Post Code",
    country: "Country",
    login: "login",
    password: "Password",
    header: "Registration",
    submit: "Submit",
  },
  address: {
    billingHeader: "Adres do faktury",
    shippingHeader: "Adres dostawy",
    country: "Kraj",
    city: "Miasto",
    street: "Ulica",
    postalCode: "Kod pocztowy",
    defaultBilling: "Ustaw jako domyślny adres do faktury",
    defaultShipping: "Ustaw jako domyślny adres dostawy",
    countryPl: "Polska",
    countryEn: "Wielka Brytania",
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
    postalCodePoland:
      "Kod pocztowy musi być zgodny z formatem obowiązującym w Polsce (00-000).",
    postalCodeUK:
      "Kod pocztowy musi być zgodny z formatem obowiązującym w Wielkiej Brytanii (SW1A 1AA).",
    postalCodeGeneric:
      "Kod pocztowy musi być zgodny z formatem PL (00-000) lub UK (SW1A 1AA).",
    countryPoland: "Polska",
    countryUnitedKingdom: "Wielka Brytania",
  },
};

export default pl;
