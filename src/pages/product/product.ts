import "./product.css";
import { localizeName, removeAllChildren } from "@/utils/helpers";
import { InProduct } from "@/types/interfaces";
import productService from "@/api/services/product-service";
import PageRouter from "@/router/page-router";
import { PageType } from "@/types/enum";
import ProductCard from "@/components/product-card/product-card";

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
        throw new Error("No productKey found");
      }

      this.product = await productService.getProductByKey(this.productKey);
      if (!this.product) {
        throw new Error("No productKey found");
      }

      const sliderWrapper = document.createElement("div");
      sliderWrapper.className = "image-slider";
      await this.renderProduct();
      this.container.append(sliderWrapper, this.productSection);
      return this.container;
    } catch {
      await PageRouter.renderPage(PageType.notfound);
    }
  },

  setProductKey(key: string) {
    this.productKey = key;
  },

  async renderProduct() {
    removeAllChildren(this.productSection);
    if (this.product) {
      const title = document.createElement("h1");
      title.textContent = localizeName(this.product.name);

      const productInformation = ProductCard.renderProductInformation(
        this.product,
      );
      const productTitle = productInformation.querySelector("h3");
      productTitle?.replaceWith(title);

      this.productSection.append(productInformation);
    }
  },
};

export default ProductView;
