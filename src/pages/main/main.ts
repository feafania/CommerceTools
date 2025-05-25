import "./main.css";

import { SETTINGS } from "@/config/settings";
import Header from "@/components/layout/header/header";
import productService from "@/api/services/product-service";

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

        const liTitle = document.createElement("div");
        liTitle.className = "category-title";
        liTitle.textContent = cat.name;

        const liPicture = document.createElement("div");
        liPicture.className = "category-pic";

        const picture = document.createElement("img");
        picture.src = "assets/img/categories/" + cat.key + ".png";
        picture.alt = cat.name;

        liPicture.append(picture);
        li.append(liPicture, liTitle);
        categoryList.append(li);
        console.log(cat);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = SETTINGS.label.errors.categories;
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
