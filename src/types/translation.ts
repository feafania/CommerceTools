import { AddressTypeMap, CountryCodeMap } from "@/types/types";

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
    submit: string;
  };
  address: {
    headers: AddressTypeMap;
    country: string;
    city: string;
    street: string;
    postalCode: string;
    default: AddressTypeMap;
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
    password: string;
    country: string;
    city: string;
    street: string;
    postalCode: CountryCodeMap;
    commonError: string;
    selectCountry: string;
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
    emailExist: string;
    invalidJson: string;
    invalidQueryParam: string;
    invalidPathParam: string;
    fieldValueNotFound: string;
    authError: string;
    authzError: string;
    resourceNotFound: string;
    concurrent: string;
    gitError: string;
    badGateway: string;
    serverError: string;
    general: string;
    connectorCertified: string;
    connectorNotFound: string;
    connectorFileNotFound: string;
    connectorFileNotValid: string;
    connectorInCertification: string;
    versionMismatch: string;
  };
  errors: {
    login: string;
    logout: string;
    registration: string;
    categories: string;
    updateCustomer: string;
    updatePassword: string;
    token: string;
    getCurrentUser: string;
  };
  messages: {
    onSignIn: string;
    onSignUp: string;
    onSignOut: string;
    nothingToUpdate: string;
  };
}
