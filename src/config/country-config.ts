import { CountryConfig } from "@/types/types";
import { CountryCode } from "@/types/enum";

export const COUNTRY_CONFIG: Record<CountryCode, CountryConfig> = {
  PL: {
    postalCodePattern: /^\d{2}-\d{3}$/,
  },
  UK: {
    postalCodePattern: new RegExp(
      String.raw`
  ^([Gg][Ii][Rr] 0[Aa]{2})|
  ((([A-Za-z][0-9]{1,2})|
  ([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|
  ([A-Za-z][0-9][A-Za-z])|
  ([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))
  \s?[0-9][A-Za-z]{2})$
`.replaceAll(/\s+/g, ""),
      "i",
    ),
  },
  DE: {
    postalCodePattern: /^\d{5}$/,
  },
  FR: {
    postalCodePattern: /^\d{5}$/,
  },
  ES: {
    postalCodePattern: /^\d{5}$/,
  },
};
