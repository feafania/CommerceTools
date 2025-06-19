/**
 * @jest-environment jsdom
 */
import { mockSETTINGS } from "../../common.mock";
import {
  mockCategories,
  productRepositoryResponse,
} from "../__mocks__/product.mock";

import productService from "@/api/services/product-service";
import { SETTINGS } from "@/config/settings";
import { CurrencyCode, PageType } from "@/types/enum";
import CatalogView from "@/pages/catalog/catalog";
import PageRouter from "@/router/page-router";

jest.mock("@/config/settings", () => ({
  SETTINGS: mockSETTINGS,
}));

jest.mock("@/router/page-router", () => ({
  __esModule: true,
  default: { renderPage: jest.fn() },
}));

jest.mock("@/api/services/product-service", () => ({
  getCategories: jest.fn(),
  getCategoryByKey: jest.fn(),
  getProductList: jest.fn(),
  getProductsByCategoryKey: jest.fn(),
  getProductTypes: jest.fn().mockResolvedValue([]),
  mapFilters: jest.fn().mockReturnValue([]),
}));
jest.mock("@/utils/helpers", () => ({
  ...jest.requireActual("@/utils/helpers"),
  isMobile: jest.fn(() => false),
}));

jest.mock("@/assets/svg/eye-password-hide.inline.svg", () => "mocked-svg");
jest.mock("@/assets/svg/eye-password-show.inline.svg", () => "mocked-svg");

describe("CatalogView", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    CatalogView.container = document.createElement("div");
    CatalogView.selectedCategoryKey = undefined;
    CatalogView.sortOption = undefined;
    CatalogView.offset = 0;
    CatalogView.limit = 9;
    CatalogView.total = 0;
    CatalogView.currentQuery = "";
    CatalogView.isSamePage = false;
    CatalogView.title = document.createElement("h1");
    CatalogView.paginationWrapper = document.createElement("div");
    CatalogView.productList = document.createElement("div");
    CatalogView.sortOption = undefined;
    CatalogView.categories = [];
    CatalogView.wasMobile = false;
    CatalogView.lazyObserver = undefined;
    CatalogView.lazyLoaderElement = document.createElement("div");
    (productService.getCategories as jest.Mock).mockResolvedValue(
      mockCategories,
    );
    (productService.getProductList as jest.Mock).mockResolvedValue(
      productRepositoryResponse,
    );
    (productService.getProductsByCategoryKey as jest.Mock).mockResolvedValue(
      productRepositoryResponse,
    );
    (productService.getCategoryByKey as jest.Mock).mockResolvedValue(
      mockCategories[0],
    );
    SETTINGS.currentLang = "en";
    SETTINGS.currentCurrency = "EUR" as CurrencyCode;
    CatalogView.title = document.createElement("h1");
  });

  it("renders full catalog page with no category", async () => {
    (productService.getProductList as jest.Mock).mockResolvedValue({
      results: productRepositoryResponse.results,
      total: productRepositoryResponse.total,
    });
    await CatalogView.render();

    expect(CatalogView.container).toBeInstanceOf(HTMLElement);
    expect(CatalogView.title.textContent).toBe(SETTINGS.label.catalog.title);
    expect(productService.getProductList).toHaveBeenCalled();
    expect(CatalogView.productList.children.length).toBe(2);
  });

  it("renders catalog with selected category", async () => {
    (productService.getCategoryByKey as jest.Mock).mockResolvedValue({
      id: "1",
      key: "electronics",
      name: { en: "Electronics" },
      assets: [],
    });

    (productService.getProductsByCategoryKey as jest.Mock).mockResolvedValue({
      results: productRepositoryResponse.results,
      total: productRepositoryResponse.total,
    });
    CatalogView.setSelectedCategoryKey("electronics");
    await CatalogView.render();

    expect(productService.getCategoryByKey).toHaveBeenCalledWith("electronics");
    expect(CatalogView.title.textContent).toContain("Electronics");
    expect(CatalogView.productList.children.length).toBe(2);
  });

  it("updates products on sort change", async () => {
    await CatalogView.render();
    const sortSelect = CatalogView.container.querySelector(
      ".sort-dropdown",
    ) as HTMLSelectElement;

    sortSelect.value = "price-desc";
    sortSelect.dispatchEvent(new Event("change"));

    expect(CatalogView.sortOption).toBe("price-desc");
    expect(productService.getProductList).toHaveBeenCalledTimes(1);
  });

  it("paginates correctly", async () => {
    CatalogView.total = 18;
    CatalogView.limit = 9;
    (productService.getProductList as jest.Mock).mockResolvedValue({
      results: Array.from({ length: 9 }).fill(
        productRepositoryResponse.results[0],
      ),
      total: 18,
    });

    await CatalogView.render();

    const buttons =
      CatalogView.paginationWrapper.querySelectorAll<HTMLButtonElement>(
        ".page-button",
      );
    expect(buttons.length).toBe(2);

    buttons[1].click();
    expect(CatalogView.offset).toBe(9);
  });

  it("searches with debounce", async () => {
    jest.useFakeTimers();
    (productService.getProductList as jest.Mock).mockResolvedValue(
      productRepositoryResponse,
    );
    await CatalogView.render();
    // console.log("Container HTML:", CatalogView.container.innerHTML);
    const input = CatalogView.container.querySelector(
      "#search-input",
    ) as HTMLInputElement;
    input.value = "test";
    input.dispatchEvent(new Event("input"));

    jest.advanceTimersByTime(400);

    expect(CatalogView.currentQuery).toBe("test");
    expect(productService.getProductList).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it("handles category change and updates hash", async () => {
    const category = mockCategories[0];
    await CatalogView.render();
    await CatalogView.onCategoryChange(category);

    expect(location.hash).toBe(`#catalog/${category.key}?sort=price-desc`);
  });

  it("falls back to notfound if category not found", async () => {
    (productService.getCategoryByKey as jest.Mock).mockResolvedValue(
      JSON.parse("null"),
    );
    CatalogView.setSelectedCategoryKey("invalid");

    const element = await CatalogView.render();

    expect(element).toBeUndefined();
    expect(PageRouter.renderPage).toHaveBeenCalledWith(PageType.notfound);
  });
});
