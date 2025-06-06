import "./main.css";

import { SETTINGS } from "@/config/settings";
import Header from "@/components/layout/header/header";
import productService from "@/api/services/product-service";
import { localizeName } from "@/utils/helpers";
import { PageType } from "@/types/enum";

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

    const content = document.createElement("div");
    content.className = "main-page-content";
    content.append(title, categoryList);

    container.append(aside, content);

    return container;
  },
  handleCategoryImageClick(categoryKey: string | undefined) {
    if (categoryKey) {
      globalThis.location.hash = `${PageType.catalog}/${categoryKey}`;
    }
  },
};

export default MainView;
