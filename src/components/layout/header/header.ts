import "./header.css";
import PageRouter from "@/router/page-router";
import { NavType } from "@/types/interfaces";
import authStore from "@/stores/auth-store";
import { PageType } from "@/types/enum";
import { SETTINGS } from "@/config/settings";

const Header = {
  nav: document.createElement("nav") as HTMLElement,

  create(): HTMLElement {
    const header = document.createElement("header");
    header.className = "header";

    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = "Gifts shop";

    const username = document.createElement("h1");
    username.className = "header-username";
    this.nav.className = "nav";

    header.append(title, username, this.nav);
    this.renderNav();

    return header;
  },

  // devided to createNav and renderNav to hangle eventListeners in left menu main
  createNav(): HTMLElement {
    const nav = document.createElement("nav");
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
    nav.append(ul);
    return nav;
  },

  renderNav() {
    this.nav.innerHTML = ""; // clear old
    this.nav.append(this.createNav()); // insert fresh nav
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

  // TODO
  // renderLangSwitcher() {
  //   // Дадаем пераключальнік мовы
  //   const langSwitcher = document.createElement("select");
  //   langSwitcher.className = "language-switcher";
  //
  //   ["en", "pl"].forEach((lang) => {
  //     const option = document.createElement("option");
  //     option.value = lang;
  //     option.textContent = lang.toUpperCase();
  //     if (lang === SETTINGS.currentLang) {
  //       option.selected = true;
  //     }
  //     langSwitcher.append(option);
  //   });
  //
  //   langSwitcher.addEventListener("change", (e) => {
  //     const selectedLang = (e.target as HTMLSelectElement)
  //       .value as LanguageCode;
  //     SETTINGS.setLang(selectedLang);
  //     globalThis.dispatchEvent(
  //       new CustomEvent("languageChanged", { detail: selectedLang });
  //     );
  //   });
  //
  //   this.nav.append(ul, langSwitcher);
};

export default Header;
