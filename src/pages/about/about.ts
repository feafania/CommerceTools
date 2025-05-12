import "./about.css";

export async function renderAboutView(): Promise<HTMLElement> {
  const container = document.createElement("section");
  container.id = "about";
  container.className = "view about-view";

  const h2 = document.createElement("h2");
  h2.className = "about-title";
  h2.textContent = "About";

  const text = document.createElement("p");
  text.className = "about-text";
  text.textContent =
    "This application was developed as part of the RSSchool EN JS/FE 2024Q4 course.";

  const link = document.createElement("a");
  link.className = "about-link";
  link.target = "_blank";
  link.href = "https://github.com/feafania";
  link.rel = "noopener noreferrer";
  link.textContent = "Author: Tatsiana Kashko";

  container.append(h2, text, link);

  return container;
}
