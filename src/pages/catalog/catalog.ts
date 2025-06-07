import "./catalog.css";
import productService from "@/api/services/product-service";
// import ProductSlider from "@/components/product-slider/product-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import searchBar from "@/components/search-button/search-button";
import { removeAllChildren } from "@/utils/helpers";
import {
  InCategory,
  InProduct,
  ProductListParameters,
} from "@/types/interfaces";
import PageRouter from "@/router/page-router";
import { CurrencyCode, PageType, SortDirection, SortName } from "@/types/enum";
import { InAttributes, SortOptions } from "@/types/types";
import createInput from "@/components/input/input";

const CatalogView = {
  container: document.createElement("section"),
  selectedCategoryKey: undefined as string | undefined,
  products: [] as InProduct[],
  total: 0,
  limit: 9,
  offset: 0,
  currentQuery: "",
  title: document.createElement("h1"),
  paginationWrapper: document.createElement("div"),
  productList: document.createElement("div"),
  categories: [] as InCategory[],
  isSamePage: false,
  sortOption: undefined as SortOptions,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  attributeFilters: {} as InAttributes,
  // sliderWrapper: document.createElement("div"),

  async render(): Promise<HTMLElement | undefined> {
    if (this.isSamePage) {
      this.isSamePage = false;
      this.updateSidebarActiveClass();
      await this.setTitle();
      await this.renderProducts();
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

      await this.setTitle();

      const currencySelect = this.createCurrencyDropdown();

      headerWrapper.append(this.title, currencySelect);

      // this.sliderWrapper.className = "product-slider";
      this.productList = document.createElement("div");
      this.productList.className = "product-list";

      this.paginationWrapper.className = "pagination";

      contentWrapper.append(
        headerWrapper,
        this.renderSearchSort(),
        this.paginationWrapper,
        this.productList,
      ); // this.sliderWrapper,
      this.container.append(sidebar, contentWrapper);

      await this.renderProducts();

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

    this.products = response.results;
    this.total = response.total ?? 0;

    for (const product of this.products) {
      const card = new ProductCard(product);
      this.productList.append(card.create());
    }

    // removeAllChildren(this.sliderWrapper);
    // const newSlider = new ProductSlider(this.products);
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
    sidebar.append(this.renderFilters());
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
    this.offset = 0;
    this.isSamePage = true;
    globalThis.location.hash = category
      ? `${PageType.catalog}/${category.key}`
      : `${PageType.catalog}`;
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

  renderFilters(): HTMLDivElement {
    const filtersSection = document.createElement("div");
    filtersSection.className = "filters-section";

    // Title
    const priceTitle = document.createElement("div");
    priceTitle.textContent = "Price range";
    priceTitle.className = "filter-title";
    filtersSection.append(priceTitle);
    const priceFilter = this.renderPriceFilter();
    const minPriceInput =
      priceFilter.querySelector<HTMLInputElement>("#min-price-input");
    const maxPriceInput =
      priceFilter.querySelector<HTMLInputElement>("#max-price-input");
    filtersSection.append(priceFilter);

    const attributesWrapper = document.createElement("div");
    attributesWrapper.className = "attribute-filters";
    filtersSection.append(attributesWrapper);
    this.renderAttributeFilters(attributesWrapper);

    // Apply button
    const applyFiltersButton = document.createElement("button");
    applyFiltersButton.textContent = "Apply Filters";
    applyFiltersButton.className = "apply-filters-btn custom-filter-button";

    if (minPriceInput && maxPriceInput) {
      applyFiltersButton.addEventListener("click", () => {
        const min = minPriceInput.value
          ? Number(minPriceInput.value)
          : undefined;
        const max = maxPriceInput.value
          ? Number(maxPriceInput.value)
          : undefined;
        this.minPrice = min;
        this.maxPrice = max;
        this.offset = 0;
        this.renderProducts();
      });
    }

    // Reset button
    const resetFiltersButton = document.createElement("button");
    resetFiltersButton.textContent = "Reset Filters";
    resetFiltersButton.className = "reset-filters-btn custom-filter-button";

    if (minPriceInput && maxPriceInput) {
      resetFiltersButton.addEventListener("click", () => {
        minPriceInput.value = "";
        maxPriceInput.value = "";
        this.minPrice = undefined;
        this.maxPrice = undefined;
        this.attributeFilters = {};
        this.renderProducts();
      });
    }

    filtersSection.append(applyFiltersButton, resetFiltersButton);
    return filtersSection;
  },

  renderPriceFilter() {
    const priceFilter = document.createElement("div");

    priceFilter.className = "filter price-filter";

    // "From"
    const fromLabel = document.createElement("label");
    fromLabel.textContent = "From";
    fromLabel.className = "filter-label";
    const minPriceInput = document.createElement("input");
    minPriceInput.placeholder = "0";
    minPriceInput.id = "min-price-input";
    minPriceInput.className = "filter-input";
    minPriceInput.min = "0";

    // "To"
    const toLabel = document.createElement("label");
    toLabel.textContent = "To";
    toLabel.className = "filter-label";
    const maxPriceInput = document.createElement("input");
    maxPriceInput.placeholder = "9999";
    maxPriceInput.id = "max-price-input";
    maxPriceInput.className = "filter-input";
    maxPriceInput.min = "0";

    for (const input of [minPriceInput, maxPriceInput]) {
      input.type = "text";
      input.inputMode = "decimal";
      input.addEventListener("input", () => {
        input.value = input.value.replaceAll(/[^0-9.]/g, "");
      });
    }

    priceFilter.append(fromLabel, minPriceInput, toLabel, maxPriceInput);
    return priceFilter;
  },

  createParameters(): ProductListParameters {
    const filters: string[] = [];

    if (this.minPrice !== undefined) {
      filters.push(
        `variants.price.centAmount:range(${this.minPrice * 100} to*)`,
      );
    }
    if (this.maxPrice !== undefined) {
      filters.push(
        `variants.price.centAmount:range(* to ${this.maxPrice * 100})`,
      );
    }

    for (const [key, value] of Object.entries(this.attributeFilters)) {
      filters.push(`variants.attributes.${key}.key:"${value}"`);
    }

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
    switch (this.sortOption) {
      case "price-asc": {
        return {
          sortName: SortName.PRICE,
          sortDirection: SortDirection.ASC,
        };
      }
      case "price-desc": {
        return { sortName: SortName.PRICE, sortDirection: SortDirection.DESC };
      }
      case "name-asc": {
        return {
          sortName: SortName.NAME as SortName,
          sortDirection: SortDirection.ASC,
        };
      }
      case "name-desc": {
        return {
          sortName: SortName.NAME as SortName,
          sortDirection: SortDirection.DESC,
        };
      }
      default: {
        return { sortName: SortName.PRICE, sortDirection: SortDirection.ASC };
      }
    }
  },

  async renderAttributeFilters(wrapper: HTMLElement) {
    const productTypes = await productService.getProductTypes();

    const attributeFields = new Set<string>();
    for (const pt of productTypes) {
      for (const attribute of pt.attributes) {
        if (attribute.isSearchable && attribute.type === "text") {
          attributeFields.add(attribute.name);
        }
      }
    }

    for (const name of attributeFields) {
      const inputWrapper = createInput({
        type: name,
        label: SETTINGS.label.registration.firstName,
        name: `filter-${name}`,
        placeholder: `Filter by ${name}`,
        value: this.attributeFilters[name]?.toString() ?? "",
        forbidValueChange: true,
        id: `filter-input-${name}`,
        class: "filter-input",
      });

      const input = inputWrapper.querySelector<HTMLInputElement>("input");
      if (input) {
        input.addEventListener("input", () => {
          if (input.value.trim() === "") {
            delete this.attributeFilters[name];
          } else {
            this.attributeFilters[name] = input.value;
          }
        });
      }

      const container = document.createElement("div");
      container.className = "attribute-filter";
      container.append(inputWrapper);

      wrapper.append(container);
    }
  },
};

export default CatalogView;
