import { AddressTypeMap, CountryCodeMap } from "@/types/types";

export interface AppTranslation {
  header: {
    appTitle: string;
  };
  nav: {
    signIn: string;
    registration: string;
    main: string;
    catalog: string;
    product: string;
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
    userProfile: string;
    changePassword: string;
    basket: string;
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
  main: {
    title: string;
    promocodes: string;
  };
  catalog: {
    search: string;
    title: string;
    allProducts: string;
    sort: {
      default: string;
      priceAsc: string;
      priceDesc: string;
      nameAsc: string;
      nameDesc: string;
    };
    filters: {
      priceRange: string;
      applyFilters: string;
      resetFilters: string;
      priceFrom: string;
      priceFromPlaceholder: string;
      priceTo: string;
      priceToPlaceholder: string;
      filtersApplied: string;
      filterBy: string;
    };
  };
  product: {
    title: string;
    backButton: string;
    selectVariant: string;
    defaultVariant: string;
    addToCart: string;
    removeFromCart: string;
    addedToCart: string;
    removedFromCart: string;
    quantity: string;
    variantID: string;
    itemInCart: string;
    itemsInCart: string;
  };
  userProfile: {
    firstName: string;
    lastName: string;
    birthDay: string;
    email: string;
    password: string;
    header: string;
    editModeBtn: string;
    editModeStop: string;
    editPassword: string;
    deleteAddress: string;
    editUSer: string;
    editAddress: string;
    addAddress: string;
    submitBtn: string;
  };
  changePassword: {
    current: string;
    newPassword: string;
    confirmNewPassword: string;
    formTitle: string;
    success: string;
    wrongConfirm: string;
    wrongOldPassword: string;
    emptyPassword: string;
    save: string;
    cancel: string;
  };
  basketButton: {
    title: string;
    addToCard: string;
    alreadyInCard: string;
    addedToCard: string;
    errorAddingToCart: string;
  };
  basket: {
    title: string;
    clear: string;
    remove: string;
    totalItems: string;
    total: string;
    emptyText: string;
    promocodeInput: string;
    applyPromocode: string;
    applied: string;
    invalid: string;
    success: string;
    error: string;
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
    editAddress: string;
    editAddressStop: string;
    addAddress: string;
    addressProfileTitle: string;
    addressesList: string;
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
    lineItemNotFound: string;
    insufficientStock: string;
    anonymousIdConflict: string;
    discountCodeInvalid: string;
    invalidOperation: string;
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
    getCart: string;
    createCart: string;
    applyDiscountCode: string;
    deleteCart: string;
    recalculateCart: string;
    addItemToCart: string;
    removeItemFromCart: string;
    changeItemQuantity: string;
    getPromoCodes: string;
  };
  messages: {
    onSignIn: string;
    onSignUp: string;
    onSignOut: string;
    nothingToUpdate: string;
  };
}
