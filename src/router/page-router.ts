import { PageType } from "@/types/enum";
import routes from "@/config/routes";
import { DEFAULT_PAGE, NOT_FOUND_PAGE } from "@/config/constants";
import { isValidPageType } from "@/utils/validation";
import authStore from "@/stores/auth-store";
import Header from "@/components/layout/header/header";

const PageRouter = {
  currentPage: PageType.main as PageType,
  init() {
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

    if (
      (PageType.login === page || PageType.registration === page) &&
      Boolean(authStore.user)
    ) {
      setTimeout(() => PageRouter.navigateTo(PageType.main), 100);
    }
  },

  navigateTo(path: PageType) {
    if (location.hash.slice(1) === path) return;
    location.hash = `#${path}`;
  },
};

export default PageRouter;
