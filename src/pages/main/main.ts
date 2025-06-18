import "./main.css";

import { SETTINGS } from "@/config/settings";
import Header from "@/components/layout/header/header";
import productService from "@/api/services/product-service";
import { localizeName } from "@/utils/helpers";
import { PageType } from "@/types/enum";
import CatalogView from "@/pages/catalog/catalog";
import basketService from "@/api/services/basket-service";

const MainView = {
  async render() {
    const container = document.createElement("section");
    container.className = "view main-view";

    const aside = document.createElement("aside");
    aside.className = "sidebar";

    const nav = Header.createNavList("main");
    aside.append(nav);

    const title = document.createElement("h1");
    title.textContent = SETTINGS.label.main.title;

    const categoryList = await this.renderCategories();
    const promoContainer = await this.renderPromoContainer();

    const content = document.createElement("div");
    content.className = "main-page-content";
    content.append(title, categoryList, promoContainer);

    container.append(aside, content);

    return container;
  },
  handleCategoryImageClick(categoryKey: string | undefined) {
    if (categoryKey) {
      CatalogView.isSamePage = false;
      globalThis.location.hash = `${PageType.catalog}/${categoryKey}`;
    }
  },

  async renderPromoContainer(): Promise<HTMLElement> {
    const promoContainer = document.createElement("div");
    promoContainer.className = "promo-codes";
    const discountCodes = await basketService.getActiveDiscountCodes();
    if (!discountCodes) {
      return promoContainer;
    }
    const promoTitle = document.createElement("h2");
    promoTitle.textContent = SETTINGS.label.main.promocodes || "Прамакоды";

    const promoList = document.createElement("ul");
    promoList.className = "promo-list";

    if (discountCodes.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Няма даступных прамакодаў.";
      promoContainer.append(promoTitle, empty);
    } else {
      for (const code of discountCodes) {
        const promoItem = document.createElement("li");
        promoItem.className = "promo-item";

        const codeElement = document.createElement("div");
        codeElement.className = "promo-code";
        codeElement.textContent = code.code;

        const descriptionElement = document.createElement("div");
        descriptionElement.className = "promo-description";
        descriptionElement.textContent = localizeName(
          code.description ?? code.name ?? "",
        );

        promoItem.append(codeElement, descriptionElement);
        promoList.append(promoItem);
      }
      promoContainer.append(promoTitle, promoList);
    }
    return promoContainer;
  },

  async renderCategories(): Promise<HTMLUListElement> {
    const categoryList = document.createElement("ul");
    categoryList.className = "categories";

    const categories = await productService.getCategories();

    for (const cat of categories) {
      const li = document.createElement("div");
      li.className = "category-item";

      const liTitle = document.createElement("div");
      liTitle.className = "category-title";
      liTitle.textContent = localizeName(cat.name);

      const liPicture = document.createElement("div");
      liPicture.className = "category-pic";

      const picture = document.createElement("img");
      picture.src = cat.assets[0].sources[0].uri;
      picture.alt = localizeName(cat.name);
      li.addEventListener("click", () =>
        this.handleCategoryImageClick(cat.key),
      );

      liPicture.append(picture);
      li.append(liPicture, liTitle);
      categoryList.append(li);
    }
    return categoryList;
  },
};

export default MainView;
