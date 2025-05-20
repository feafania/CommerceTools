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
  rsschoolImg.setAttribute("width", "100%");
  rsschoolImg.setAttribute("height", "auto");
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

  const text = document.createElement("p");
  text.textContent = "2025";
  footer.append(text);

  footer.append(createRSSchoolLink());

  return footer;
}
