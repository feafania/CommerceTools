import { SETTINGS } from "@/config/settings";
import "./main.css";
import Header from "@/components/layout/header/header";

const MainView = {
  render() {
    const container = document.createElement("section");

    container.className = "view main-view";

    const aside = document.createElement("aside");
    aside.className = "sidebar";

    const nav = Header.createNav();
    aside.append(nav);

    const title = document.createElement("h1");
    title.textContent = SETTINGS.label.main.title;

    container.append(aside, title);

    return container;
  },
};

export default MainView;
