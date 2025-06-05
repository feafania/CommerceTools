import { PageType } from "@/types/enum";
import { DEFAULT_PAGE, NOT_FOUND_PAGE } from "@/config/constants";
import { isValidPageType } from "@/utils/validation";
import { renderPage } from "@/utils/page-render";
import routes from "@/config/routes";

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

    if (!routes[page]?.canActivate()) {
      page = PageType.main;
      PageRouter.navigateTo(PageType.main);
    }
    await renderPage(page);
  },

  navigateTo(path: PageType) {
    if (location.hash.slice(1) === path) return;
    location.hash = `#${path}`;
  },
};

export default PageRouter;
