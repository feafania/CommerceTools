import "./footer.css";
import logoInline from "@/assets/svg/rs-school-logo.inline.svg";

function createRSSchoolLink() {
  const rsschoolElement = document.createElement("div");
  rsschoolElement.className = "rsschool";

  const rsschoolLink = document.createElement("a");
  rsschoolLink.className = "rsschool-link";
  rsschoolLink.target = "_blank";
  rsschoolLink.href = "https://rs.school/courses/javascript";
  rsschoolLink.rel = "noopener noreferrer";
  rsschoolElement.append(rsschoolLink);

  const parser = new DOMParser();
  const rsschoolDocument = parser.parseFromString(logoInline, "image/svg+xml");

  const rsschoolImg = rsschoolDocument.documentElement;
  rsschoolImg.classList.add("rsschool-logo");
  rsschoolImg.setAttribute("title", "RS School");

  const rsschoolName = document.createElement("span");
  rsschoolName.className = "rsschool-name";
  rsschoolName.textContent = "Rolling Scopes School";
  rsschoolLink.append(rsschoolImg, rsschoolName);

  return rsschoolElement;
}

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
