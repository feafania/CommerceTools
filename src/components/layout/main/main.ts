import "./main.css";
// import Header from "@/components/layout/header/header";
import { VIEW_CONTAINER_NAME } from "@/config/constants";

export default function createMain(): HTMLElement {
  // left side bar for design
  // const layout = document.createElement("div");
  // layout.className = "layout";

  // const aside = document.createElement("aside");
  // aside.className = "sidebar";

  // const navClone = Header.nav.cloneNode(true) as HTMLElement;
  // aside.append(navClone);

  const main = document.createElement("main");
  main.className = "main";

  const viewContainer = document.createElement("div");
  viewContainer.className = VIEW_CONTAINER_NAME;
  viewContainer.id = VIEW_CONTAINER_NAME;

  main.append(viewContainer);
  // layout.append(aside, main);
  return main;
}
