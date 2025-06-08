import { CurrencyCode, PageType } from "@/types/enum";

export const VIEW_CONTAINER_NAME = "view-container";

export const DEFAULT_PAGE = PageType.main;
export const NOT_FOUND_PAGE = PageType.notfound;

export const CARD_SETTINGS = {
  cardWidth: 320,
  cardHeight: 450,
  slideStep: 1,
  cardGap: 16,
  sliderPadding: 16,
};

export const CurrencySymbolMap: Record<CurrencyCode, string> = {
  [CurrencyCode.EUR]: "€",
  [CurrencyCode.GBP]: "£",
  [CurrencyCode.PLN]: "zł",
};
