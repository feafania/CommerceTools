import "./main.css";
// import Header from "@/components/layout/header/header";
import { VIEW_CONTAINER_NAME } from "@/config/constants";

export default function createMain(): HTMLElement {
  const main = document.createElement("main");
  main.className = "main";

  const container = document.createElement("div");
  container.className = "container";

  const viewContainer = document.createElement("div");
  viewContainer.className = VIEW_CONTAINER_NAME;
  viewContainer.id = VIEW_CONTAINER_NAME;

  container.append(viewContainer);
  main.append(container);
  // layout.append(aside, main);
  return main;
}
