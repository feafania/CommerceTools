import { AppTranslation } from "@/types/translation";

const pl: AppTranslation = {
  header: {
    appTitle: "Prezenty",
  },
  nav: {
    signIn: "Zaloguj się",
    registration: "Załóż konto",
    main: "Strona główna",
    catalog: "Katalog",
    product: "Produkt",
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
    userProfile: "Profil Użytkownika",
    changePassword: "Zmień hasło",
    basket: "Koszyk",
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
    title: "Zapraszamy do naszego sklepu",
  },
  catalog: {
    search: "Szukaj...",
    title: "Nasz asortyment",
    allProducts: "Wszystkie produkty",
    sort: {
      default: "Sortuj według",
      priceAsc: "Cena: od niskiej do wysokiej",
      priceDesc: "Cena: od wysokiej do niskiej",
      nameAsc: "Nazwa: od A do Z",
      nameDesc: "Nazwa: Z do A",
    },
    filters: {
      priceRange: "Przedział cenowy",
      applyFilters: "Zastosuj",
      resetFilters: "Resetuj",
      priceFrom: "Od",
      priceFromPlaceholder: "0",
      priceTo: "Do",
      priceToPlaceholder: "9999",
      filtersApplied: "Filtry są stosowane",
      filterBy: "Filtruj według",
    },
  },
  product: {
    title: "Szczegóły Produkta",
    backButton: "Powrót do katalogu",
  },
  userProfile: {
    firstName: "Imię",
    lastName: "Nazwisko",
    birthDay: "Dzień urodzenia",
    email: "Adres e-mail",
    password: "Hasło",
    header: "Profil użytkownika",
    editModeBtn: "Tryb Edycji",
    editModeStop: "Pozostaw tryb edycji",
    editPassword: "Zmień hasło",
    deleteAddress: "Adres został pomyślnie usunięty",
    editUSer: "Informacje o użytkowniku zostały pomyślnie zaktualizowane",
    editAddress: "Adres został pomyślnie zaktualizowany",
    addAddress: "Nowy adres został pomyślnie dodany",
    submitBtn: "Zapisz Zmiany",
  },
  changePassword: {
    current: "Aktualne hasło",
    newPassword: "Nowe hasło",
    confirmNewPassword: "Potwierdź nowe hasło",
    formTitle: "Zmień Hasło",
    wrongConfirm: "Błędne potwierdzenie hasła",
    success: "Twoje hasło zostało pomyślnie zmienione",
    wrongOldPassword: "Błędne aktualne hasło",
    emptyPassword: "Pole hasła jest puste",
  },
  basketButton: {
    title: "Koszyk",
    addToCard: "Dodaj do koszyka",
    alreadyInCard: "Już w Koszyku",
    addedToCard: "Dodano do koszyka",
    errorAddingToCart: "Błąd dodawania do koszyka",
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
    editAddress: "Edytuj",
    editAddressStop: "Zatrzymaj edycję",
    addAdress: "+ Dodaj adres",
    addressProfileTitle: "Adres",
    addressesList: "Adresy",
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
    password:
      "Hasło musi mieć co najmniej 8 znaków, zawierać duże i małe litery" +
      " cyfrę oraz opcjonalnie znak specjalny (!@#$%^&*). Nie może" +
      " zawierać spacji na początku ani na końcu.",
    country: "Kraj musi zawierać tylko litery i spacje.",
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
    selectCountry: "Proszę wybrać kraj",
  },
  errorsTypes: {
    duplicate: "Wartość już istnieje w systemie.",
    required: "Pole jest wymagane.",
    credentials: "Nieprawidłowy adres e-mail lub hasło",
    invalid: "Nieprawidłowa wartość.",
    invalidPostalCode: "Nieprawidłowy format kodu pocztowego.",
    invalidEmail: "Podaj poprawny adres e-mail.",
    invalidPhoneNumber: "Nieprawidłowy numer telefonu.",
    unknown: "Wystąpił nieznany błąd. Spróbuj ponownie.",
    emailExist:
      "Konto z tym adresem e-mail już istnieje. Zaloguj się lub użyj innego adresu.",
    invalidJson:
      "Niepoprawne dane żądania. Skontaktuj się z pomocą techniczną.",
    invalidQueryParam: "Nieprawidłowy parametr URL.",
    invalidPathParam: "Nieprawidłowa ścieżka żądania.",
    fieldValueNotFound: "Nie znaleziono wskazanej wartości.",
    authError: "Błąd uwierzytelniania. Zaloguj się ponownie.",
    authzError: "Nie masz uprawnień do wykonania tej czynności.",
    resourceNotFound: "Nie znaleziono żądanego zasobu.",
    concurrent: "Konflikt aktualizacji. Odśwież i spróbuj ponownie.",
    gitError: "Repozytorium Git jest niedostępne.",
    badGateway: "Serwer jest przeciążony. Spróbuj ponownie później.",
    serverError: "Wystąpił błąd serwera. Spróbuj ponownie później.",
    general: "Trwa aktualizacja systemu. Spróbuj ponownie za kilka minut.",
    connectorCertified:
      "Ten konektor jest już certyfikowany i gotowy do użycia.",
    connectorNotFound:
      "Nie znaleziono konektora ‘$identifier’ w wersji $version. Sprawdź identyfikator i wersję.",
    connectorFileNotFound:
      "Nie znaleziono pliku connect.yaml pod adresem $url (tag: $tag). Zweryfikuj adres i tag.",
    connectorFileNotValid:
      "Plik connect.yaml pod adresem $url (tag: $tag) jest nieprawidłowy. Sprawdź format lub zawartość.",
    connectorInCertification:
      "Ten konektor jest w trakcie procesu certyfikacji. Będzie dostępny po jego zakończeniu.",
    versionMismatch:
      "Błąd niezgodności wersji. Proszę odświeżyć i spróbować ponownie.",
    lineItemNotFound: "Produkt nie został znaleziony w Koszyku",
    insufficientStock: "Za mało towarów w magazynie",
    anonymousIdConflict: "Błąd anonimowego użytkownika",
    discountCodeInvalid: "Kod promocyjny nie jest odpowiedni",
    invalidOperation: "It is impossible to perform the action.",
  },
  errors: {
    login: "Logowanie nie powiodło się.",
    logout:
      "Wylogowanie nie powiodło się. Być może już zostałeś wylogowany. Spróbuj ponownie.",
    registration: "Rejestracja nie powiodła się.",
    categories: "Nie udało się załadować kategorii.",
    updateCustomer: "Nie udało się zaktualizować informacji o kliencie.",
    updatePassword: "Nie udało się zaktualizować hasła klienta.",
    token: "Nie udało się zdobyć tokena.",
    getCurrentUser: "Nie udało się pobrać bieżącego użytkownika",
    getCart: "Nie można dostać koszyka",
    createCart: "Nie można utworzyć koszyka",
    applyDiscountCode: "Nie można zastosować kodu promocyjnego",
    deleteCart: "Nie można usunąć koszyka",
    recalculateCart: "Nie można przeliczyć koszyka",
    addItemToCart: "Nie można dodać przedmiotu do koszyka",
    removeItemFromCart: "Nie można usunąć przedmiotu z koszyka",
    changeItemQuantity: "Nie można zmienić przedmiotu z koszyka",
  },
  messages: {
    onSignIn: "Zostałeś pomyślnie zalogowany.",
    onSignUp: "Twoje konto zostało utworzone.",
    onSignOut: "Zostałeś wylogowany.",
    nothingToUpdate: "Brak zmian. Twój profil jest już aktualny.",
  },
};

export default pl;
