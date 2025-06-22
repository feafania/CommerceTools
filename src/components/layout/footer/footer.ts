import "./footer.css";
import { createRSSchoolLink } from "@/components/rsschool-link/rsschool-link";

export default function createFooter(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "footer";

  const container = document.createElement("div");
  container.className = "container";

  const teamName = document.createElement("p");
  teamName.textContent = "Dragonflies";
  container.append(teamName);

  const text = document.createElement("p");
  text.textContent = "2025";
  container.append(text);
  container.append(createRSSchoolLink());

  footer.append(container);
  return footer;
}
