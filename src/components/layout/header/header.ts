import "./header.css";
import "@/pages/pages.css";
import PageRouter from "@/router/page-router";
import { NavType } from "@/types/interfaces";
import authService from "@/api/services/auth-service";
import authStore from "@/stores/auth-store";
import { PageType } from "@/types/enum";
import { SETTINGS } from "@/config/settings";
import { LanguageCode } from "@/types/types";

const Header = {
  nav: document.createElement("nav") as HTMLElement,
  title: document.createElement("h1"),
  logo: document.createElement("img"),
  username: document.createElement("span"),

  create(): HTMLElement {
    const header = document.createElement("header");
    header.className = "header";

    const container = document.createElement("div");
    container.className = "container";

    this.logo.className = "header-logo logo";
    this.logo.src = "/public/assets/img/logo.png";
    this.logo.alt = SETTINGS.label.header.appTitle;
    this.logo.title = SETTINGS.label.header.appTitle;

    const menuBurgerButton = document.createElement("div");
    menuBurgerButton.className = "burger burger-menu";
    menuBurgerButton.addEventListener("click", () => {
      headerActions.classList.add("active");
      document.body.classList.add("no-scroll");
    });

    const menuBurgerButtonClose = document.createElement("div");
    menuBurgerButtonClose.className = "burger burger-menu-close";
    menuBurgerButtonClose.addEventListener("click", () => {
      headerActions.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });

    this.nav.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("nav-link")) {
        headerActions.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });

    const headerActions = document.createElement("div");
    headerActions.className = "header-actions";

    this.renderNav();
    headerActions.append(
      this.nav,
      this.renderLangSwitcher(),
      menuBurgerButtonClose,
    );

    container.append(this.logo, menuBurgerButton, headerActions);
    header.append(container);

    if (PageRouter.currentPage !== PageType.main) {
      const containerTitle = document.createElement("div");
      containerTitle.className = "container";
      this.title.className = "title";
      this.title.textContent = SETTINGS.label.header.appTitle;
      containerTitle.append(this.title);
      header.append(containerTitle);
    }

    header.append(this.title);
    this.renderNav();

    this.username.className = "header-username";
    header.append(this.username);
    this.setUsername();

    return header;
  },

  setUsername() {
    this.username.textContent = authStore.user
      ? `👤 ${authStore.user.firstName}`
      : "";
  },

  setTitle() {
    this.title.textContent = SETTINGS.label.header.appTitle;
  },

  createNavList(): HTMLElement {
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    for (const { label, page, visible } of this.getNavLinks()) {
      if (!visible) continue;

      const li = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = label;
      link.href = "javascript:void(0)";
      link.className = "nav-link";

      const isCurrent = PageRouter.currentPage === page;
      if (isCurrent) {
        link.classList.add("active");
      } else {
        link.addEventListener("click", this.onClick(label, page));
      }

      li.append(link);
      ul.append(li);
    }

    return ul;
  },

  renderNav() {
    this.nav.replaceChildren(this.createNavList());
  },

  getNavLinks(): NavType[] {
    // const isLoggedIn = Boolean(authStore.user);
    const t = SETTINGS.label.nav;

    return [
      { label: t.main, page: PageType.main, visible: true },
      { label: t.signIn, page: PageType.login, visible: true },
      {
        label: t.registration,
        page: PageType.registration,
        visible: true,
      },
      { label: t.about, page: PageType.about, visible: false },
      { label: t.signOut, page: PageType.notfound, visible: true },
    ];
  },

  onClick(label: string, page: PageType) {
    return async () => {
      const isLoggedIn = Boolean(authStore.user);
      const { signOut, signIn, registration } = SETTINGS.label.nav;

      if (label === signOut) {
        if (isLoggedIn) {
          try {
            await authService.logout();
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
        PageRouter.navigateTo(PageType.main);
      } else if ((label === signIn || label === registration) && isLoggedIn) {
        PageRouter.navigateTo(PageType.main);
      } else {
        PageRouter.navigateTo(page);
      }
    };
  },

  renderLangSwitcher(): HTMLElement {
    const langSwitcher = document.createElement("select");
    langSwitcher.className = "language-switcher";

    for (const lang of SETTINGS.availableLanguages) {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang.toUpperCase();
      if (lang === SETTINGS.currentLang) {
        option.selected = true;
      }
      langSwitcher.append(option);
    }

    langSwitcher.addEventListener("change", (event) => {
      const selectedLang = (event.target as HTMLSelectElement)
        .value as LanguageCode;
      SETTINGS.setLang(selectedLang);
      globalThis.dispatchEvent(
        new CustomEvent("languageChanged", { detail: selectedLang }),
      );
    });

    return langSwitcher;
  },
};

export default Header;
