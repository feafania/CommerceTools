import { PageType } from "@/types/enum";
import authStore from "@/stores/auth-store";
import LoginView from "@/pages/login/login";
import { renderAboutView } from "@/pages/about/about";
import Header from "@/components/layout/header/header";
import MainView from "@/pages/main/main";
import RegistrationView from "@/pages/registration/registration";

const PageRouter = {
  currentPage: PageType.login as PageType,
  init() {
    globalThis.addEventListener("popstate", () => this.handleRoute());
    globalThis.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  },

  getPathFromUrl(): string {
    const hash = location.hash.slice(1);
    return hash || PageType.login;
  },

  async handleRoute() {
    const rawPath = this.getPathFromUrl();

    const isValidPage = (Object.values(PageType) as string[]).includes(rawPath);
    const path = isValidPage ? (rawPath as PageType) : undefined;

    let page: PageType;

    // if (path === PageType.about) {
    //   page = path;
    // } else {
    //   const isLoggedIn = Boolean(authStore.user);
    //   page = isLoggedIn ? PageType.main : PageType.login;
    //   if (!path || path !== page) {
    //     location.replace(`/#${page}`);
    //     return;
    //   }
    // }
    const isLoggedIn = Boolean(authStore.user);

    if (path) {
      page = path as PageType;
    } else {
      page = PageType.main;
      location.replace(`/#${page}`);
      return;
    }

    if (
      isLoggedIn &&
      (path === PageType.login || path === PageType.registration)
    ) {
      location.replace(`/#${PageType.main}`);
      return;
    }

    this.currentPage = page;

    const renderMap = {
      [PageType.login]: LoginView.render.bind(LoginView),
      [PageType.main]: MainView.renderChat.bind(MainView),
      [PageType.registration]: RegistrationView.render.bind(RegistrationView),
      [PageType.about]: renderAboutView,
    };

    const render = renderMap[page as keyof typeof renderMap];

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
