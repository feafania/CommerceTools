import "./product.css";
import { removeAllChildren } from "@/utils/helpers";
import { InProduct } from "@/types/interfaces";
import productService from "@/api/services/product-service";
import PageRouter from "@/router/page-router";
import { PageType } from "@/types/enum";
import ProductImageSlider from "@/components/product-image-slider/product-image-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import CatalogView from "@/pages/catalog/catalog";

const ProductView = {
  productKey: undefined as string | undefined,
  product: undefined as InProduct | undefined,
  container: document.createElement("section"),
  productSection: document.createElement("div"),

  async render(): Promise<HTMLElement | undefined> {
    removeAllChildren(this.container);
    this.container.className = "view product-view";

    try {
      if (!this.productKey) {
        throw new Error("No product key found");
      }

      this.product = await productService.getProductByKey(this.productKey);
      if (!this.product) {
        throw new Error("Product not found");
      }

      const layoutWrapper = document.createElement("div");
      layoutWrapper.className = "product-detail-wrapper";

      await this.renderProduct();
      layoutWrapper.append(this.productSection);

      const slider = new ProductImageSlider(this.product.images);
      layoutWrapper.append(slider.create("small"));

      this.container.append(layoutWrapper);
      return this.container;
    } catch {
      await PageRouter.renderPage(PageType.notfound);
    }
  },

  setProductKey(key: string | undefined): void {
    this.productKey = key;
  },

  async renderProduct() {
    removeAllChildren(this.productSection);
    this.productSection.className = "product-details";

    if (this.product) {
      const headerRow = document.createElement("div");
      headerRow.className = "product-header-row";

      const title = document.createElement("h1");
      title.textContent = SETTINGS.label.product.title;

      const backButton = document.createElement("button");
      backButton.textContent = `← ${SETTINGS.label.product.backButton}`;
      backButton.className = "back-to-catalog-btn";
      backButton.addEventListener("click", () => {
        const categoryRoute = CatalogView.selectedCategoryKey
          ? "/" + CatalogView.selectedCategoryKey
          : "";
        globalThis.location.hash = `${PageType.catalog}${categoryRoute}`;
      });

      headerRow.append(title, backButton);
      this.productSection.append(headerRow);

      const productInformation = ProductCard.renderProductInformation(
        this.product,
      );

      this.productSection.append(productInformation);
    }
  },
};

export default ProductView;
