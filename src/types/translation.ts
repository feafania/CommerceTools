export interface AppTranslation {
  nav: {
    signIn: string;
    registration: string;
    main: string;
    about: string;
    signOut: string;
  };
  login: {
    name: string;
    password: string;
    header: string;
    submit: string;
  };
  registration: {
    name: string;
    password: string;
    header: string;
    submit: string;
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
