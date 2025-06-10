import "./catalog.css";

import mobileFilterToggle from "./resize-filter";

import productService from "@/api/services/product-service";
// import ProductSlider from "@/components/product-slider/product-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import searchBar from "@/components/search-button/search-button";
import { removeAllChildren } from "@/utils/helpers";
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

const CatalogView = {
  container: document.createElement("section"),
  title: document.createElement("h1"),
  paginationWrapper: document.createElement("div"),
  productList: document.createElement("div"),
  filterInfo: document.createElement("div"),
  selectedCategoryKey: undefined as string | undefined,
  categories: [] as InCategory[],
  isSamePage: false,
  total: 0,
  limit: 9,
  offset: 0,
  currentQuery: "",
  sortOption: undefined as SortOptions,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  attributeFilters: {} as InAttributes,
  availableAttributes: new Map() as AttributeMap,
  // sliderWrapper: document.createElement("div"),

  async render(): Promise<HTMLElement | undefined> {
    if (this.isSamePage) {
      this.isSamePage = false;
      await CatalogViewFiltering.applyFiltering();
      await this.renderProducts();
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

      const contentWrapper = document.createElement("div");
      contentWrapper.className = "catalog-content";

      const headerWrapper = document.createElement("div");
      headerWrapper.className = "catalog-header";
      this.filterInfo.className = "filter-info";
      this.filterInfo.textContent =
        SETTINGS.label.catalog.filters.filtersApplied;

      const currencySelect = this.createCurrencyDropdown();

      headerWrapper.append(this.title, currencySelect);

      // this.sliderWrapper.className = "product-slider";
      this.productList = document.createElement("div");
      this.productList.className = "product-list";

      this.paginationWrapper.className = "pagination";

      contentWrapper.append(
        headerWrapper,
        this.filterInfo,
        this.renderSearchSort(),
        this.paginationWrapper,
        this.productList,
      ); // this.sliderWrapper,
      this.container.append(sidebar, contentWrapper);

      await CatalogViewFiltering.applyFiltering();
      await this.renderProducts();

      setTimeout(() => {
        mobileFilterToggle.refresh();
      }, 0);

      return this.container;
    } catch {
      this.setSelectedCategoryKey(undefined);
      await PageRouter.renderPage(PageType.notfound);
    }
  },

  setSelectedCategoryKey(key: string | undefined): void {
    this.selectedCategoryKey = key;
  },

  renderSearchSort(): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "search-sort-wrapper";
    const searchComponent = searchBar.render();

    searchBar.searchInput.addEventListener("input", () => {
      searchBar.setDebounce(() => {
        this.currentQuery = searchBar.searchInput.value.trim();
        this.offset = 0; // Reset offset when searching
        this.renderProducts();
      }, 400);
    });

    const sortDropdown = this.createSortDropdown();
    wrapper.append(searchComponent, sortDropdown);
    return wrapper;
  },

  async renderProducts() {
    if (!this.productList) {
      this.productList = document.createElement("div");
      this.productList.className = "product-list";
      this.container.append(this.productList);
    }

    removeAllChildren(this.productList);

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
    this.renderPagination();
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
      { value: "price-asc", label: SETTINGS.label.catalog.sort.priceAsc },
      { value: "price-desc", label: SETTINGS.label.catalog.sort.priceDesc },
      { value: "name-asc", label: SETTINGS.label.catalog.sort.nameAsc },
      { value: "name-desc", label: SETTINGS.label.catalog.sort.nameDesc },
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
      this.renderProducts();
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

    select.addEventListener("change", () => {
      SETTINGS.currentCurrency = select.value as CurrencyCode;
      this.offset = 0;
      this.renderProducts();
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
};

export default CatalogView;
