import { PageType } from "@/types/enum";
import { DEFAULT_PAGE, NOT_FOUND_PAGE } from "@/config/constants";
import { isValidPageType } from "@/utils/validation";
import { renderPage } from "@/utils/page-render";
import routes from "@/config/routes";
import ProductView from "@/pages/product/product";
import CatalogView from "@/pages/catalog/catalog";

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
    ProductView.setProductKey(undefined);

    if (path.startsWith(`${PageType.product}/`)) {
      const productId = path.split("/")[1];

      if (productId) {
        page = PageType.product;
        this.currentPage = page;
        ProductView.setProductKey(productId);
      } else {
        page = NOT_FOUND_PAGE;
      }
    } else if (path.startsWith(PageType.catalog)) {
      const categoryId = path.split("/")[1];
      page = PageType.catalog;
      this.currentPage = page;

      if (categoryId) {
        CatalogView.setSelectedCategoryKey(categoryId);
      } else {
        CatalogView.setSelectedCategoryKey(undefined);
      }
    } else if (isValidPageType(path)) {
      page = path;
    } else if (path) {
      page = NOT_FOUND_PAGE;
    } else {
      page = DEFAULT_PAGE;
      location.replace(`/#${page}`);
      return;
    }
    await this.renderPage(page);
  },

  navigateTo(path: PageType) {
    if (location.hash.slice(1) === path) return;
    location.hash = `#${path}`;
  },

  async renderPage(page: PageType) {
    this.currentPage = page;

    let newPage = page;

    if (!routes[page]?.canActivate()) {
      newPage = PageType.main;
      PageRouter.navigateTo(PageType.main);
    }
    await renderPage(newPage);
  },
};

export default PageRouter;
