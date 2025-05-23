import { LanguageCode } from "@/types/types";
import translations from "@/config/interfaces";
import { getLocalState } from "@/utils/helpers";

const defaultLang: LanguageCode =
  (getLocalState("lang") as LanguageCode) || "en";

export const SETTINGS = {
  currentLang: defaultLang,
  availableLanguages: Object.keys(translations),
  get label() {
    return translations[this.currentLang];
  },
  setLang(lang: LanguageCode) {
    this.currentLang = lang;
    localStorage.setItem("lang", lang);
  },
};
