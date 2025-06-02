import { LanguageCode } from "@/types/types";
import translations from "@/config/interfaces";
import { getLocalState, saveLocalState } from "@/utils/helpers";
import { ProductListParameters } from "@/types/interfaces";
import { CurrencyCode, SortDirection, SortName } from "@/types/enum";

const defaultLang: LanguageCode =
  (getLocalState("lang") as LanguageCode) || "en";

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
  productListParametrs: {
    limit: 20,
    offset: 0,
    sortName: SortName.NAME,
    sortDirection: SortDirection.ASC,
  } as ProductListParameters,
  fallbackCurrency: CurrencyCode.EUR,
};
