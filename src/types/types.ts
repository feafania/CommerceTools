import translations from "@/config/interfaces";

export type ValidationType = {
  pattern?: RegExp;
  isValid?: (value: string) => boolean;
  message: string;
};

export type Listener = () => void;

export type LanguageCode = keyof typeof translations;
