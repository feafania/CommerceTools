import "./header.css";
import "@/pages/pages.css";
import PageRouter from "@/router/page-router";
import { NavType } from "@/types/interfaces";
import authService from "@/api/services/auth-service";
import authStore from "@/stores/auth-store";
import { PageType } from "@/types/enum";
import { SETTINGS } from "@/config/settings";
import { LanguageCode } from "@/types/types";
import burgerIcon from "@/assets/img/burger-menu.png";
import burgerCloseIcon from "@/assets/img/burger-menu-close.png";
import logo from "@/assets/img/logo.png";
import showModalMessage from "@/components/modal-window/modal-window";

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

    this.renderLogo();

    const headerActions = document.createElement("div");
    headerActions.className = "header-actions";

    const menuBurgerButton = document.createElement("div");
    menuBurgerButton.className = "burger burger-menu";
    menuBurgerButton.style.setProperty("--burger-icon", `url(${burgerIcon})`);
    menuBurgerButton.addEventListener("click", () => {
      headerActions.classList.add("active");
      document.body.classList.add("no-scroll");
    });

    const menuBurgerButtonClose = document.createElement("div");
    menuBurgerButtonClose.className = "burger burger-menu-close";
    menuBurgerButtonClose.style.setProperty(
      "--burger-icon-close",
      `url(${burgerCloseIcon})`,
    );
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

    this.renderNav();
    headerActions.append(
      this.nav,
      this.renderLangSwitcher(),
      menuBurgerButtonClose,
    );

    container.append(this.logo, menuBurgerButton, headerActions);
    header.append(container);

    const containerTitle = document.createElement("div");
    containerTitle.className = "container";
    this.title.className = "title";
    this.title.textContent = SETTINGS.label.header.appTitle;

    this.username.className = "header-username";
    containerTitle.append(this.title, this.username);
    this.setUsername();
    header.append(containerTitle);
    this.renderNav();

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
    const isLoggedIn = Boolean(authStore.user);
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
      { label: t.signOut, page: PageType.notfound, visible: isLoggedIn },
    ];
  },

  onClick(label: string, page: PageType) {
    return async () => {
      const isLoggedIn = Boolean(authStore.user);
      // const { signOut, signIn, registration } = SETTINGS.label.nav;

      if (label === SETTINGS.label.nav.signOut) {
        if (isLoggedIn) {
          try {
            await authService.logout();
            this.setUsername();
            showModalMessage(SETTINGS.label.messages.onSignOut);
            this.renderNav();
            PageRouter.navigateTo(PageType.main);
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
        // } else if ((label === signIn || label === registration) && isLoggedIn) {
        //   PageRouter.navigateTo(PageType.main);
      } else {
        PageRouter.navigateTo(page);
      }
    };
  },

  renderLogo() {
    this.logo.className = "header-logo logo";
    this.logo.src = logo;
    this.logo.alt = SETTINGS.label.header.appTitle;
    this.logo.title = SETTINGS.label.header.appTitle;

    this.logo.style.cursor = "pointer";
    this.logo.addEventListener("click", () => {
      PageRouter.navigateTo(PageType.main);
    });
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
