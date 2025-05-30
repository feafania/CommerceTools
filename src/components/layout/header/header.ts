import "./header.css";
import PageRouter from "@/router/page-router";
import { NavType } from "@/types/interfaces";
import authService from "@/api/services/auth-service";
import authStore from "@/stores/auth-store";
import { PageType } from "@/types/enum";
import { SETTINGS } from "@/config/settings";
import { LanguageCode, NavMenu } from "@/types/types";
import showModalMessage from "@/components/modal-window/modal-window";
import { renderPage } from "@/utils/page-render";

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

  createNavList(type: NavMenu = "header"): HTMLElement {
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    for (const { label, page, visible, disabled } of this.getNavLinks(type)) {
      if (!visible) continue;

      const li = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = label;
      link.href = "javascript:void(0)";
      link.className = "nav-link";
      if (disabled) {
        link.classList.add("disabled");
      }

      const isCurrent = PageRouter.currentPage === page;
      if (isCurrent) {
        link.classList.add("active");
      } else {
        if (!disabled) {
          link.addEventListener("click", this.onClick(label, page));
        }
      }

      li.append(link);
      ul.append(li);
    }

    return ul;
  },

  renderNav() {
    this.nav.replaceChildren(this.createNavList());
  },

  getNavLinks(type: NavMenu = "header"): NavType[] {
    const isLoggedIn = Boolean(authStore.user);
    const t = SETTINGS.label.nav;

    return [
      { label: t.main, page: PageType.main, visible: true, disabled: false },
      {
        label: t.signIn,
        page: PageType.login,
        visible: !isLoggedIn || type === "main",
        disabled: isLoggedIn,
      },
      {
        label: t.registration,
        page: PageType.registration,
        visible: !isLoggedIn || type === "main",
        disabled: isLoggedIn,
      },
      { label: t.about, page: PageType.about, visible: false, disabled: true },
      {
        label: t.signOut,
        page: PageType.notfound,
        visible: isLoggedIn,
        disabled: !isLoggedIn,
      },

      { label: t.about, page: PageType.about, visible: false },
      { label: t.signOut, page: PageType.notfound, visible: isLoggedIn },
      { label: t.userProfile, page: PageType.profile, visible: isLoggedIn },
    ];
  },

  onClick(label: string, page: PageType) {
    return async () => {
      const isLoggedIn = Boolean(authStore.user);

      if (label === SETTINGS.label.nav.signOut) {
        if (isLoggedIn) {
          try {
            const logoutResponse = await authService.logout();
            if (logoutResponse) {
              this.setUsername();
              showModalMessage(SETTINGS.label.messages.onSignOut);
              if (PageRouter.getPathFromUrl() === PageType.main) {
                await renderPage(PageType.main);
              }
              PageRouter.navigateTo(PageType.main);
            }
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
      } else {
        PageRouter.navigateTo(page);
      }
    };
  },

  renderLogo() {
    this.logo.className = "header-logo logo";
    this.logo.src = "assets/img/logo.png";
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
