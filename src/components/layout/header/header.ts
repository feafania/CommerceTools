import "./header.css";
import PageRouter from "@/router/page-router";
import { NavType } from "@/types/interfaces";
import authStore from "@/stores/auth-store";
import { PageType } from "@/types/enum";
import { SETTINGS } from "@/config/settings";
import { LanguageCode } from "@/types/types";
import { AVAILABLE_LANGUAGES } from "@/config/constants";

const Header = {
  nav: document.createElement("nav") as HTMLElement,

  create(): HTMLElement {
    const header = document.createElement("header");
    header.className = "header";

    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = "Gifts shop";

    header.append(title, this.nav);
    this.renderNav();

    return header;
  },

  renderNav() {
    this.nav.innerHTML = "";
    const links = this.getNavLinks();
    const ul = document.createElement("ul");
    ul.className = "nav-list";

    for (const { label, page, visible } of links) {
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
    this.nav.append(ul);
    ul.append(this.renderLangSwitcher());
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
      if (label === "Sign Out" && authStore.user) {
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
