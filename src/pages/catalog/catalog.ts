import "./catalog.css";

import mobileFilterToggle from "./resize-filter";

import productService from "@/api/services/product-service";
// import ProductSlider from "@/components/product-slider/product-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import searchBar from "@/components/search-button/search-button";
import { isMobile, removeAllChildren, saveLocalState } from "@/utils/helpers";
import { InCategory, ProductListParameters } from "@/types/interfaces";
import PageRouter from "@/router/page-router";
import {
  AttributeKeys,
  CurrencyCode,
  PageType,
  SortDirection,
  SortName,
} from "@/types/enum";
import { AttributeMap, InAttributes, SortOptions } from "@/types/types";
import CatalogViewFiltering from "@/pages/catalog/filtering";
import Filtering from "@/pages/catalog/filtering";
import { SCROLL_HEIGHT } from "@/config/constants";
import globalOverlay from "@/components/global-overlay/global-overlay";
import basketService from "@/api/services/basket-service";

const CatalogView = {
  container: document.createElement("section"),
  title: document.createElement("h1"),
  paginationWrapper: document.createElement("div"),
  productList: document.createElement("div"),
  productWrapper: document.createElement("div"),
  filterInfo: document.createElement("div"),
  selectedCategoryKey: undefined as string | undefined,
  categories: [] as InCategory[],
  isSamePage: false,
  total: 0,
  limit: 6,
  offset: 0,
  currentQuery: "",
  sortOption: undefined as SortOptions,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  attributeFilters: {} as InAttributes,
  availableAttributes: new Map() as AttributeMap,
  scrollToTopButton: document.createElement("button"),
  lazyLoaderElement: document.createElement("div"),
  lazyObserver: undefined as IntersectionObserver | undefined,
  wasMobile: false as boolean,
  // sliderWrapper: document.createElement("div"),

  async render(): Promise<HTMLElement | undefined> {
    this.removeLazyLoadingElement();
    this.wasMobile = isMobile();
    if (this.wasMobile) {
      this.offset = 0;
    }
    if (this.isSamePage) {
      this.isSamePage = false;
      await CatalogViewFiltering.applyFiltering();
      await this.renderProducts();
      if (this.wasMobile) {
        this.appendLazyLoadingElement();
        this.setupLazyLoading();
      }
      mobileFilterToggle.refresh();
      return;
    }
    removeAllChildren(this.container);
    this.container.className = "view catalog-view";

    try {
      let selectedCategory;
      if (this.selectedCategoryKey) {
        selectedCategory = await productService.getCategoryByKey(
          this.selectedCategoryKey,
        );
        if (!selectedCategory) {
          throw new Error("Category not found");
        }
      }

      const sidebar = await this.renderSideBar();

      // this.sliderWrapper.className = "product-slider";
      this.productWrapper = document.createElement("div");
      this.productList.className = "product-wrapper";
      this.productList = document.createElement("div");
      this.productList.className = "product-list";
      this.productWrapper.append(this.productList);

      this.paginationWrapper.className = "pagination";
      const contentWrapper = this.createContentWrapper();
      this.container.append(sidebar, contentWrapper);
      if (this.wasMobile) {
        this.appendLazyLoadingElement();
        this.setupLazyLoading();
      }

      await CatalogViewFiltering.applyFiltering();
      await this.renderProducts();
      this.setupResizeHandler();
      this.setupScrollToTopButton();

      setTimeout(() => {
        mobileFilterToggle.refresh();
      }, 0);

      return this.container;
    } catch {
      this.setSelectedCategoryKey(undefined);
      await PageRouter.renderPage(PageType.notfound);
    }
  },

  createContentWrapper(): HTMLDivElement {
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "catalog-content";

    const headerWrapper = document.createElement("div");
    headerWrapper.className = "catalog-header";
    this.filterInfo.className = "filter-info";

    const currencySelect = this.createCurrencyDropdown();

    headerWrapper.append(this.title, currencySelect);

    contentWrapper.append(
      headerWrapper,
      this.filterInfo,
      this.renderSearchSort(),
      this.paginationWrapper,
      this.productWrapper,
    ); // this.sliderWrapper,

    return contentWrapper;
  },

  renderSearchSort(): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "search-sort-wrapper";
    const searchComponent = searchBar.render();

    searchBar.searchInput.addEventListener("input", () => {
      searchBar.setDebounce(async () => {
        const newQuery = searchBar.searchInput.value.trim();
        if (newQuery !== this.currentQuery) {
          this.currentQuery = newQuery;
          this.offset = 0;
          await this.handleRenderProducts();
        }
      }, 400);
    });

    const sortDropdown = this.createSortDropdown();
    wrapper.append(searchComponent, sortDropdown);
    return wrapper;
  },

  async renderProducts(append = false) {
    globalOverlay.show();
    try {
      if (!this.productList) {
        this.productList = document.createElement("div");
        this.productList.className = "product-list";
        this.container.append(this.productList);
      }

      if (!append || this.offset === 0) {
        removeAllChildren(this.productList);
        if (this.offset > this.total) {
          this.offset = 0;
        }
      }
      const requestParameters: ProductListParameters = this.createParameters();

      const response = this.selectedCategoryKey
        ? await productService.getProductsByCategoryKey(
            this.selectedCategoryKey,
            requestParameters,
          )
        : await productService.getProductList(requestParameters);

      const products = response.results;
      this.total = response.total ?? 0;

      for (const product of products) {
        const card = new ProductCard(product);
        this.productList.append(card.create());
      }

      // removeAllChildren(this.sliderWrapper);
      // const newSlider = new ProductSlider(products);
      // newSlider.create();
      // this.sliderWrapper.append(newSlider.container);
      if (!isMobile()) {
        this.renderPagination();
      }
    } finally {
      globalOverlay.hide();
    }
  },

  async renderSideBar() {
    const sidebar = document.createElement("aside");
    sidebar.className = "catalog-sidebar";
    const undefinedConst = undefined;

    const groupAll = document.createElement("div");
    groupAll.className = "category-group";
    const allButton = this.createCategoryButton(
      SETTINGS.label.catalog.allProducts,
      "",
      !this.selectedCategoryKey,
      () => this.onCategoryChange(undefinedConst),
      "all-category-button",
    );
    groupAll.append(allButton);
    sidebar.append(groupAll);

    this.categories = await productService.getCategories();

    for (const category of this.categories) {
      const group = document.createElement("div");
      group.className = "category-group";

      const mainButton = this.createCategoryButton(
        category.name[SETTINGS.currentLang] || category.key || "",
        category.key,
        category.key === this.selectedCategoryKey,
        () => this.onCategoryChange(category),
        "category-button",
      );

      group.append(mainButton);

      if (category.children && category.children.length > 0) {
        for (const sub of category.children) {
          const subButton = this.createCategoryButton(
            "— " + (sub.name?.[SETTINGS.currentLang] || sub.key || ""),
            sub.key,
            sub.key === this.selectedCategoryKey,
            () => this.onCategoryChange(sub),
            "subcategory-button",
          );

          group.append(subButton);
        }
      }

      sidebar.append(group);
    }
    sidebar.append(CatalogViewFiltering.renderFilters());
    return sidebar;
  },

  renderPagination() {
    removeAllChildren(this.paginationWrapper);

    const totalPages = Math.ceil(this.total / this.limit);
    if (totalPages <= 1) return;

    for (let page = 0; page < totalPages; page++) {
      const pageButton = document.createElement("button");
      pageButton.className = "page-button";
      pageButton.textContent = (page + 1).toString();
      if (page * this.limit === this.offset) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        this.offset = page * this.limit;
        this.renderProducts();
      });

      this.paginationWrapper.append(pageButton);
    }
  },

  async onCategoryChange(category: InCategory | undefined) {
    this.setSelectedCategoryKey(category?.key);
    this.offset = 0;
    this.isSamePage = true;
    CatalogViewFiltering.buildPath();
    setTimeout(() => {
      mobileFilterToggle.refresh();
    }, 0);
  },

  updateSidebarActiveClass() {
    const allButtons = this.container.querySelectorAll<HTMLButtonElement>(
      ".catalog-sidebar-button",
    );

    for (const button of allButtons) {
      button.classList.remove("active");
    }

    if (!this.selectedCategoryKey) {
      const allCategoryButton = this.container.querySelector<HTMLButtonElement>(
        ".all-category-button",
      );
      allCategoryButton?.classList.add("active");
      return;
    }

    const matchingButton = [...allButtons].find(
      (button) => button.dataset.categoryKey === this.selectedCategoryKey,
    );

    matchingButton?.classList.add("active");
  },

  createCategoryButton(
    label: string,
    key: string | undefined,
    isActive: boolean,
    onClick: () => void,
    extraClass?: string,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = label;
    button.className = `catalog-sidebar-button ${extraClass ?? ""}`;
    if (isActive) {
      button.classList.add("active");
    }
    button.dataset.categoryKey = key ?? "";
    button.addEventListener("click", onClick);
    return button;
  },

  createSortDropdown(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "sort-dropdown-wrapper";

    const select = document.createElement("select");
    select.className = "sort-dropdown";

    const options: { value: string; label: string }[] = [
      { value: "", label: SETTINGS.label.catalog.sort.default },
      {
        value: `${SortName.PRICE}-${SortDirection.ASC}`,
        label: SETTINGS.label.catalog.sort.priceAsc,
      },
      {
        value: `${SortName.PRICE}-${SortDirection.DESC}`,
        label: SETTINGS.label.catalog.sort.priceDesc,
      },
      {
        value: `${SortName.NAME}-${SortDirection.ASC}`,
        label: SETTINGS.label.catalog.sort.nameAsc,
      },
      {
        value: `${SortName.NAME}-${SortDirection.DESC}`,
        label: SETTINGS.label.catalog.sort.nameDesc,
      },
    ];

    for (const opt of options) {
      const optionElement = document.createElement("option");
      optionElement.value = opt.value;
      optionElement.textContent = opt.label;
      select.append(optionElement);
    }

    select.value = this.sortOption || "";

    select.addEventListener("change", () => {
      this.sortOption = select.value as SortOptions;
      this.offset = 0;
      CatalogView.isSamePage = true;
      Filtering.buildPath();
    });

    wrapper.append(select);
    return wrapper;
  },

  createCurrencyDropdown(): HTMLElement {
    const select = document.createElement("select");
    select.className = "currency-dropdown";

    for (const currency of Object.values(CurrencyCode)) {
      const option = document.createElement("option");
      option.value = currency;
      option.textContent = currency;
      if (currency === SETTINGS.currentCurrency) {
        option.selected = true;
      }
      select.append(option);
    }

    select.addEventListener("change", async () => {
      SETTINGS.currentCurrency = select.value as CurrencyCode;
      saveLocalState({ key: "curr", value: SETTINGS.currentCurrency });
      this.offset = 0;
      globalOverlay.show();
      await basketService.getCart();
      globalOverlay.hide();
      await this.handleRenderProducts();
    });

    return select;
  },

  async setTitle() {
    if (!this.title) return;

    if (!this.selectedCategoryKey) {
      this.title.textContent = SETTINGS.label.catalog.title;
      return;
    }

    const buildCategoryPath = (
      categoryKey: string,
      categories: InCategory[],
    ): string[] => {
      const findCategoryPath = (
        key: string,
        cats: InCategory[],
        path: string[] = [],
      ): string[] | undefined => {
        for (const cat of cats) {
          const name = cat.name[SETTINGS.currentLang] || cat.key;
          if (cat.key === key) {
            return [...path, name || ""];
          }
          if (cat.children?.length) {
            const found = findCategoryPath(key, cat.children, [
              ...path,
              name || "",
            ]);
            if (found) return found;
          }
        }
        return undefined;
      };

      return findCategoryPath(categoryKey, categories) || [];
    };

    if (this.categories.length === 0) {
      this.categories = await productService.getCategories();
    }

    const pathNames = buildCategoryPath(
      this.selectedCategoryKey,
      this.categories,
    );

    this.title.textContent =
      pathNames.length > 0
        ? `${pathNames.join(" > ")}`
        : SETTINGS.label.catalog.title;
  },

  createParameters(): ProductListParameters {
    const filters: string[] = [];

    if (this.minPrice !== undefined) {
      filters.push(
        ...productService.mapFilters({
          [AttributeKeys.MinPrice]: this.minPrice,
        }),
      );
    }
    if (this.maxPrice !== undefined) {
      filters.push(
        ...productService.mapFilters({
          [AttributeKeys.MaxPrice]: this.maxPrice,
        }),
      );
    }
    filters.push(
      ...productService.mapFilters({
        attributes: this.attributeFilters,
      }),
    );

    const { sortName, sortDirection } = this.getSortParameters();
    const requestParameters: ProductListParameters = {
      searchText: this.currentQuery || undefined,
      offset: this.offset,
      limit: this.limit,
      sortName,
      sortDirection,
      filters,
    };
    return requestParameters;
  },

  getSortParameters(): { sortName: SortName; sortDirection: SortDirection } {
    const defaultSort = {
      sortName: SortName.PRICE,
      sortDirection: SortDirection.ASC,
    };

    if (!this.sortOption || typeof this.sortOption !== "string") {
      return defaultSort;
    }

    const parts = this.sortOption.split("-");
    if (parts.length !== 2) {
      return defaultSort;
    }

    const [sortName, sortDirection] = parts as [SortName, SortDirection];

    return {
      sortName: Object.values(SortName).includes(sortName)
        ? sortName
        : defaultSort.sortName,
      sortDirection: Object.values(SortDirection).includes(sortDirection)
        ? sortDirection
        : defaultSort.sortDirection,
    };
  },

  setSelectedCategoryKey(key: string | undefined): void {
    this.selectedCategoryKey = key;
  },

  setupResizeHandler() {
    window.addEventListener("resize", async () => {
      const isCurrentlyMobile = isMobile();
      if (this.wasMobile !== isCurrentlyMobile) {
        this.wasMobile = isCurrentlyMobile;
        this.handleRenderProducts();
      }
    });
  },

  async handleRenderProducts() {
    await this.removeLazyLoadingElement();
    removeAllChildren(this.productList);
    removeAllChildren(this.paginationWrapper);
    this.offset = 0;

    await this.renderProducts();
    if (isMobile() && this.offset + this.limit < this.total) {
      this.appendLazyLoadingElement();
    } else {
      this.renderPagination();
    }
  },

  async removeLazyLoadingElement() {
    if (this.lazyObserver) {
      this.lazyObserver.disconnect();
      this.lazyObserver = undefined;
    }
    if (this.productWrapper.contains(this.lazyLoaderElement)) {
      this.lazyLoaderElement.remove();
    }
  },

  appendLazyLoadingElement() {
    this.lazyLoaderElement = document.createElement("div");
    this.lazyLoaderElement.className = "lazy-loader";
    if (!this.productWrapper.contains(this.lazyLoaderElement)) {
      this.productWrapper.append(this.lazyLoaderElement);
    }
    this.setupLazyLoading();
  },

  setupLazyLoading() {
    if (this.lazyObserver) {
      this.lazyObserver.disconnect();
      this.lazyObserver = undefined;
    }
    this.lazyObserver = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && isMobile()) {
          await new Promise((resolve) => setTimeout(resolve, 200));

          if (this.offset + this.limit >= this.total) {
            this.lazyLoaderElement.remove();
            return;
          }

          this.offset += this.limit;
          await this.renderProducts(true);

          if (this.offset + this.limit >= this.total) {
            this.lazyLoaderElement.remove();
            if (this.lazyObserver) {
              this.lazyObserver.disconnect();
            }
          }
        }
      },
      {
        root: undefined,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    this.lazyObserver.observe(this.lazyLoaderElement);
  },

  setupScrollToTopButton() {
    this.scrollToTopButton.className = "scroll-to-top";
    this.scrollToTopButton.textContent = "↑";

    this.scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      this.updateScrollToTopButtonVisibility();
    });

    window.addEventListener("resize", () => {
      this.updateScrollToTopButtonVisibility();
    });

    this.updateScrollToTopButtonVisibility();

    this.container.append(this.scrollToTopButton);
  },

  updateScrollToTopButtonVisibility() {
    if (!isMobile()) {
      this.scrollToTopButton.style.display = "none";
      return;
    }

    this.scrollToTopButton.style.display =
      window.scrollY > SCROLL_HEIGHT ? "block" : "none";
  },
};

export default CatalogView;
