import { AppTranslation } from "@/types/translation";

const pl: AppTranslation = {
  nav: {
    signIn: "Zaloguj się",
    registration: "Załóż konto",
    main: "Strona główna", //Główna
    about: "O nas",
    signOut: "Wyloguj się",
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
};

export default pl;
