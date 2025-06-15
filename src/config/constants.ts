import { CurrencyCode, PageType } from "@/types/enum";

export const VIEW_CONTAINER_NAME = "view-container";

export const DEFAULT_PAGE = PageType.main;
export const NOT_FOUND_PAGE = PageType.notfound;

export const CARD_SETTINGS = {
  cardWidth: 250,
  cardHeight: 350,
  slideStep: 1,
  cardGap: 16,
  sliderPadding: 16,
};

export const CurrencySymbolMap: Record<CurrencyCode, string> = {
  [CurrencyCode.EUR]: "€",
  [CurrencyCode.GBP]: "£",
  [CurrencyCode.PLN]: "zł",
};

export const COOCKIE_LIFE: number = 7;
export const SCROLL_HEIGHT: number = 300;
export const MOBILE_WIDTH: number = 1000;
