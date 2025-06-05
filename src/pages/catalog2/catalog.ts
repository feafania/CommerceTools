import "./catalog.css";
import productService from "@/api/services/product-service";
import ProductSlider from "@/components/product-slider/product-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import searchBar from "@/components/search-button/search-button";
import { removeAllChildren } from "@/utils/helpers";
import { InProduct } from "@/types/interfaces";
import { GetProductListParameters } from "@/types/types";

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
  sliderWrapper: document.createElement("div"),

  async render(
    parameters: GetProductListParameters = {},
  ): Promise<HTMLElement> {
    removeAllChildren(this.container);
    this.container.className = "view catalog-view";

    const title = document.createElement("h1");
    title.textContent = SETTINGS.label.catalog.title;

    const searchComponent = searchBar.render();

    searchBar.searchInput.addEventListener("input", () => {
      searchBar.setDebounce(() => {
        this.currentQuery = searchBar.searchInput.value.trim();
        this.offset = 0; // Reset offset when searching
        this.renderProducts(parameters, this.currentQuery);
      }, 400);
    });

    this.sliderWrapper.className = "product-slider";
    this.productList = document.createElement("div");
    this.productList.className = "product-list";

    this.paginationWrapper.className = "pagination";

    this.container.append(
      title,
      searchComponent,
      this.sliderWrapper,
      this.paginationWrapper,
      this.productList,
    );
    await this.renderProducts(parameters, "");

    return this.container;
  },

  setSelectedCategoryKey(key: string) {
    this.selectedCategoryKey = key;
  },

  async renderProducts(
    parameters: GetProductListParameters = {},
    query: string = "",
  ) {
    if (!this.productList) {
      this.productList = document.createElement("div");
      this.productList.className = "product-list";
      this.container.append(this.productList);
    }

    removeAllChildren(this.productList);

    const requestParameters = {
      ...parameters,
      searchText: query || undefined,
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

    removeAllChildren(this.sliderWrapper);
    const newSlider = new ProductSlider(this.products);
    newSlider.create();
    this.sliderWrapper.append(newSlider.container);
    this.renderPagination();
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
        this.renderProducts({}, this.currentQuery);
      });

      this.paginationWrapper.append(pageButton);
    }
  },
};

export default CatalogView2;
