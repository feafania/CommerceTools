import { AdressTypeMap, CountryCodeMap } from "@/types/types";

export interface AppTranslation {
  header: {
    appTitle: string;
  };
  nav: {
    signIn: string;
    registration: string;
    main: string;
    about: string;
    signOut: string;
    directions: {
      toSignIn: string;
      toSignUp: string;
    };
    directionsLabels: {
      toSignIn: string;
      toSignUp: string;
    };
  };
  login: {
    email: string;
    password: string;
    header: string;
    emptyField: string;
    submit: string;
  };
  registration: {
    firstName: string;
    lastName: string;
    birthDay: string;
    email: string;
    password: string;
    header: string;
    openBillingAddress: string;
    submit: string;
  };
  address: {
    headers: AdressTypeMap;
    country: string;
    city: string;
    street: string;
    postalCode: string;
    default: AdressTypeMap;
    isSameAddress: string;
    countryNames: CountryCodeMap;
    placeholders: {
      country: string;
    };
  };
  main: {
    title: string;
  };
  validation: {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passwordLoginPage: string;
    password: string;
    city: string;
    street: string;
    postalCode: CountryCodeMap;
    commonError: string;
  };
  errorsTypes: {
    duplicate: string;
    required: string;
    credentials: string;
    invalid: string;
    invalidPostalCode: string;
    invalidEmail: string;
    invalidPhoneNumber: string;
    unknown: string;
  };
  errors: {
    login: string;
    registration: string;
  };
  messages: {
    onSignIn: string;
    onSignUp: string;
    onSignOut: string;
  };
}
