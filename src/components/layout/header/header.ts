import "./header.css";
import "@/pages/pages.css";
import PageRouter from "@/router/page-router";
import { NavType } from "@/types/interfaces";
import authStore from "@/stores/auth-store";
import { PageType } from "@/types/enum";
import { SETTINGS } from "@/config/settings";
import { LanguageCode } from "@/types/types";
import { AVAILABLE_LANGUAGES } from "@/config/constants";

const Header = {
  nav: document.createElement("nav") as HTMLElement,
  title: document.createElement("h1"),
  logo: document.createElement("img"),

  create(): HTMLElement {
    const header = document.createElement("header");
    header.className = "header";

    const container = document.createElement("div");
    container.className = "container";

    this.logo.className = "header-logo logo";
    this.logo.src = "/public/assets/img/logo.png";
    this.logo.alt = SETTINGS.label.nav.appTitle;
    this.logo.title = SETTINGS.label.nav.appTitle;

    const headerActions = document.createElement("div");
    headerActions.className = "header-actions";

    this.renderNav();
    headerActions.append(this.nav, this.renderLangSwitcher());

    container.append(this.logo, headerActions);
    header.append(container);

    if (PageRouter.currentPage !== PageType.main) {
      const containerTitle = document.createElement("div");
      containerTitle.className = "container";
      this.title.className = "title";
      this.title.textContent = SETTINGS.label.nav.appTitle;
      containerTitle.append(this.title);
      header.append(containerTitle);
    }

    return header;
  },

  updateTitle() {
    this.title.textContent = SETTINGS.label.nav.appTitle;
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
      { label: t.signIn, page: PageType.login, visible: !isLoggedIn },
      {
        label: t.registration,
        page: PageType.registration,
        visible: !isLoggedIn,
      },
      { label: t.main, page: PageType.main, visible: true },
      { label: t.about, page: PageType.about, visible: true },
      { label: t.signOut, page: PageType.login, visible: isLoggedIn },
    ];
  },

  onClick(label: string, page: PageType) {
    return async () => {
      if (label === SETTINGS.label.nav.signOut && authStore.user) {
        try {
          // await wsClient.logout(authStore.user);
        } catch (error) {
          // wsClient.close();
          console.error("Logout error:", error);
        }
      } else {
        PageRouter.navigateTo(page);
      }
    };
  },

  renderLangSwitcher(): HTMLElement {
    const langSwitcher = document.createElement("select");
    langSwitcher.className = "language-switcher";

    for (const lang of AVAILABLE_LANGUAGES) {
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
