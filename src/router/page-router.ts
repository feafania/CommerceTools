import { PageType } from "@/types/enum";
import Header from "@/components/layout/header/header";
import routes from "@/config/routes";
import { DEFAULT_PAGE, NOT_FOUND_PAGE } from "@/config/constants";
import { isValidPageType } from "@/utils/validation";

const PageRouter = {
  currentPage: PageType.login as PageType,
  init() {
    globalThis.addEventListener("popstate", () => this.handleRoute());
    globalThis.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  },

  getPathFromUrl(): string {
    return location.hash.slice(1);
  },

  async handleRoute() {
    const path = this.getPathFromUrl();

    let page: PageType;

    if (isValidPageType(path)) {
      page = path;
    } else if (path) {
      page = NOT_FOUND_PAGE;
    } else {
      page = DEFAULT_PAGE;
      location.replace(`/#${page}`);
      return;
    }

    this.currentPage = page;

    const render = routes[page]?.render;

    if (render) {
      const element = await render();
      const container = document.querySelector("#view-container");
      if (container) {
        container.innerHTML = "";
        container.append(element);
      }
    }

    Header.renderNav();
  },

  navigateTo(path: PageType) {
    location.hash = `#${path}`;
  },
};

export default PageRouter;
