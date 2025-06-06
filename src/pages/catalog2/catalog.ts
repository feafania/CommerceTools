import "./catalog.css";
import productService from "@/api/services/product-service";
// import ProductSlider from "@/components/product-slider/product-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import searchBar from "@/components/search-button/search-button";
import { removeAllChildren } from "@/utils/helpers";
import { InProduct } from "@/types/interfaces";
import PageRouter from "@/router/page-router";
import { PageType } from "@/types/enum";

const CatalogView2 = {
  container: document.createElement("section"),
  selectedCategoryKey: undefined as string | undefined,
  products: [] as InProduct[],
  total: 0,
  limit: 9,
  offset: 0,
  currentQuery: "",
  paginationWrapper: document.createElement("div"),
  productList: document.createElement("div"),
  // sliderWrapper: document.createElement("div"),

  async render(): Promise<HTMLElement | undefined> {
    removeAllChildren(this.container);
    this.container.className = "view catalog-view";

    try {
      if (this.selectedCategoryKey) {
        const selectedCategory = await productService.getCategoryByKey(
          this.selectedCategoryKey,
        );
        if (!selectedCategory) {
          throw new Error("Category not found");
        }
      }

      const sidebar = await this.renderSideBar();

      const contentWrapper = document.createElement("div");
      contentWrapper.className = "catalog-content";

      const title = document.createElement("h1");
      title.textContent = SETTINGS.label.catalog.title;

      const searchComponent = searchBar.render();

      searchBar.searchInput.addEventListener("input", () => {
        searchBar.setDebounce(() => {
          this.currentQuery = searchBar.searchInput.value.trim();
          this.offset = 0; // Reset offset when searching
          this.renderProducts();
        }, 400);
      });

      // this.sliderWrapper.className = "product-slider";
      this.productList = document.createElement("div");
      this.productList.className = "product-list";

      this.paginationWrapper.className = "pagination";

      contentWrapper.append(
        title,
        searchComponent,
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

  async renderProducts() {
    if (!this.productList) {
      this.productList = document.createElement("div");
      this.productList.className = "product-list";
      this.container.append(this.productList);
    }

    removeAllChildren(this.productList);

    const requestParameters = {
      searchText: this.currentQuery || undefined,
      offset: this.offset,
      limit: this.limit,
    };

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

    const groupAll = document.createElement("div");
    groupAll.className = "category-group";
    const allButton = document.createElement("button");
    allButton.textContent = SETTINGS.label.catalog.allProducts;
    allButton.className = "catalog-sidebar-button all-category-button";
    if (!this.selectedCategoryKey) {
      allButton.classList.add("active");
    }
    allButton.addEventListener("click", () => {
      this.offset = 0;
      globalThis.location.hash = PageType.catalog;
    });
    groupAll.append(allButton);
    sidebar.append(groupAll);

    const categories = await productService.getCategories();

    for (const category of categories) {
      const group = document.createElement("div");
      group.className = "category-group";

      const button = document.createElement("button");
      button.textContent =
        category.name[SETTINGS.currentLang] || category.key || "";
      button.classList.add("catalog-sidebar-button", "category-button");
      if (category.key === this.selectedCategoryKey) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        this.offset = 0;
        globalThis.location.hash = `${PageType.catalog}/${category.key}`;
      });

      group.append(button);

      if (category.children && category.children.length > 0) {
        for (const sub of category.children) {
          const subButton = document.createElement("button");
          subButton.textContent =
            "— " + (sub.name?.[SETTINGS.currentLang] || sub.key || "");
          subButton.classList.add(
            "catalog-sidebar-button",
            "subcategory-button",
          );

          if (sub.key === this.selectedCategoryKey) {
            subButton.classList.add("active");
          }

          subButton.addEventListener("click", () => {
            this.offset = 0;
            globalThis.location.hash = `${PageType.catalog}/${sub.key}`;
          });

          group.append(subButton);
        }
      }

      sidebar.append(group);
    }
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
};

export default CatalogView2;
