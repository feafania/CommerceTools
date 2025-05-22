export interface AppTranslation {
  nav: {
    signIn: string;
    registration: string;
    main: string;
    about: string;
    signOut: string;
    appTitle: string;
  };
  login: {
    name: string;
    password: string;
    header: string;
    emptyField: string;
    submit: string;
  };
  registration: {
    firstName: string;
    lastName: string;
    birthDay: string;
    login: string;
    password: string;
    header: string;
    openBillingAddress: string;
    submit: string;
  };
  address: {
    billingHeader: string;
    shippingHeader: string;
    country: string;
    city: string;
    street: string;
    postalCode: string;
    defaultBilling: string;
    defaultShipping: string;
    countryPl: string;
    countryEn: string;
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
    postalCodePoland: string;
    postalCodeUK: string;
    postalCodeGeneric: string;
    countryPoland: string;
    countryUnitedKingdom: string;
  };
  errorsTypes: {
    duplicate: string;
    invalid: string;
    required: string;
    credentials: string;
    unknown: string;
  };
  errors: {
    login: string;
    registration: string;
  };
}
