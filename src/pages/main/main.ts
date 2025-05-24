import "./main.css";

import { SETTINGS } from "@/config/settings";
import Header from "@/components/layout/header/header";
import productService from "@/api/services/product-service";
import categorydsh from "@/assets/img/categories/dsh.png";
import categorydso from "@/assets/img/categories/dso.png";
import categorygc from "@/assets/img/categories/gc.png";
import categoryrwd from "@/assets/img/categories/rwd.png";

const categoryImages: Record<string, string> = {
  dsh: categorydsh,
  dso: categorydso,
  gc: categorygc,
  rwd: categoryrwd,
};

const MainView = {
  async render() {
    const container = document.createElement("section");

    container.className = "view main-view";

    const aside = document.createElement("aside");
    aside.className = "sidebar";

    const nav = Header.createNavList();
    aside.append(nav);

    const title = document.createElement("h1");
    title.textContent = SETTINGS.label.main.title;

    const categoryList = document.createElement("ul");
    categoryList.className = "categories";

    try {
      const categories = await productService.getCategories();
      for (const cat of categories) {
        const li = document.createElement("div");
        li.className = "category-item";

        const liTtile = document.createElement("div");
        liTtile.className = "category-title";
        liTtile.textContent = cat.name;

        const liPicture = document.createElement("div");
        liPicture.className = "category-pic";

        const picture = document.createElement("img");
        if (cat.key && categoryImages[cat.key]) {
          picture.src = categoryImages[cat.key];
        }

        liPicture.append(picture);
        li.append(liPicture, liTtile);
        categoryList.append(li);
        console.log(cat);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Failed to load categories.";
      categoryList.append(errorMessage);
    }

    const content = document.createElement("div");
    content.className = "main-page-content";
    content.append(title, categoryList);

    container.append(aside, content);

    return container;
  },
};

export default MainView;
