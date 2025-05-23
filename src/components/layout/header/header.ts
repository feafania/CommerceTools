import "./header.css";

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
  username: document.createElement("span"),

  create(): HTMLElement {
    const header = document.createElement("header");
    header.className = "header";

    this.title.className = "title";
    this.title.textContent = SETTINGS.label.header.appTitle;

    header.append(this.title);
    this.renderNav();

    this.username.className = "header-username";
    header.append(this.username);
    this.setUsername();

    const navWrapper = document.createElement("div");
    navWrapper.className = "nav-wrapper";
    navWrapper.append(this.nav, this.renderLangSwitcher());
    header.append(navWrapper);

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
