import { LanguageCode } from "@/types/types";
import translations from "@/config/interfaces";
import { getLocalState, saveLocalState } from "@/utils/helpers";
import { ProductListParameters } from "@/types/interfaces";
import { CurrencyCode, SortDirection, SortName } from "@/types/enum";

const defaultLang: LanguageCode =
  (getLocalState("lang") as LanguageCode) || "en";

const defaultCurrency: CurrencyCode =
  (getLocalState("curr") as CurrencyCode) || CurrencyCode.EUR;

export const SETTINGS = {
  currentLang: defaultLang,
  availableLanguages: Object.keys(translations),
  get label() {
    return translations[this.currentLang];
  },
  fallbackLanguage: defaultLang,
  setLang(lang: LanguageCode) {
    this.currentLang = lang;
    saveLocalState({
      key: "lang",
      value: lang,
    });
  },
  productListParameters: {
    limit: 12,
    offset: 0,
    sortName: SortName.NAME,
    sortDirection: SortDirection.ASC,
  } as ProductListParameters,
  basketParameters: {
    quantity: 1,
    promoLimit: 5,
  },
  currentCurrency: defaultCurrency,
  fallbackCurrency: defaultCurrency,
};
