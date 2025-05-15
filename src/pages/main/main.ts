import "./main.css";
import Header from "@/components/layout/header/header";

const MainView = {
  render() {
    const container = document.createElement("section");

    container.className = "view main-view";

    const aside = document.createElement("aside");
    aside.className = "sidebar";

    const navClone = Header.nav.cloneNode(true) as HTMLElement;
    aside.append(navClone);

    const title = document.createElement("h1");
    title.textContent = "Welcome to Gifts Shop";

    container.append(aside, title);

    return container;
  },
};

export default MainView;
