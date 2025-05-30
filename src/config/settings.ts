import { LanguageCode } from "@/types/types";
import translations from "@/config/interfaces";
import { getLocalState, saveLocalState } from "@/utils/helpers";

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
};
