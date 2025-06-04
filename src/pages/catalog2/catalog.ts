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
        const query = searchBar.searchInput.value.trim();
        this.renderProducts(parameters, query);
      }, 400);
    });

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "product-slider";

    const productList = document.createElement("div");
    productList.className = "product-list";

    this.container.append(title, searchComponent, sliderWrapper, productList);
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
    let productList = this.container.querySelector(".product-list");
    if (!productList) {
      productList = document.createElement("div");
      productList.className = "product-list";
      this.container.append(productList);
    }
    productList.className = "product-list";

    removeAllChildren(productList);

    this.products = this.selectedCategoryKey
      ? await productService.getProductsByCategoryKey(
          this.selectedCategoryKey,
          {
            ...parameters,
            searchText: query || undefined,
          },
        )
      : await productService.getProductList({
          ...parameters,
          searchText: query || undefined,
        });

    for (const product of this.products) {
      const card = ProductCard.create(product);
      productList.append(card);
    }

    const newSlider = await ProductSlider.create(this.products);

    const existingSlider = this.container.querySelector(".product-slider");

    if (existingSlider) {
      existingSlider.replaceWith(newSlider);
    } else {
      productList.before(newSlider);
    }
  },
};

export default CatalogView2;
