import "./main.css";
import { VIEW_CONTAINER_NAME } from "@/config/constants";

export default function createMain(): HTMLElement {
  const main = document.createElement("main");
  main.className = "main";

  const viewContainer = document.createElement("div");
  viewContainer.className = VIEW_CONTAINER_NAME;
  viewContainer.id = VIEW_CONTAINER_NAME;

  main.append(viewContainer);
  return main;
}
