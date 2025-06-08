import "./search-button.css";
import createInput from "@/components/input/input";
import { SETTINGS } from "@/config/settings";
import createButton from "@/components/button/button";

class SearchBar {
  public searchInput: HTMLInputElement;
  private clearButton: HTMLButtonElement;
  private searchDebounce: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor() {
    this.searchInput = document.createElement("input");
    this.clearButton = document.createElement("button");
  }

  render(): HTMLElement {
    const searchBar = document.createElement("div");
    searchBar.className = "search-bar";

    const searchInputGroupe = this.renderInput();
    const clearButton = this.renderButton();

    searchBar.append(searchInputGroupe, clearButton);
    this.showClearButton();
    return searchBar;
  }

  private renderInput(): HTMLDivElement {
    const searchInputGroupe = createInput({
      type: "text",
      placeholder: SETTINGS.label.catalog.search,
      class: "search-input",
      id: "search-input",
    });
    const searchInput = searchInputGroupe.querySelector(
      "input",
    ) as HTMLInputElement;
    if (searchInput) {
      this.searchInput = searchInput;
    }
    this.addInputListeners();
    this.showClearButton();
    return searchInputGroupe;
  }

  private renderButton(): HTMLButtonElement {
    const clearButton = createButton({
      name: "×",
      class: "clear-search-button",
      id: "clear-search-button",
    });
    this.clearButton = clearButton;
    this.clearButton.style.display = "none";
    this.addButtonListeners();
    return clearButton;
  }

  private addInputListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => {
        this.showClearButton();
      });
    }
  }

  private addButtonListeners(): void {
    if (this.clearButton) {
      this.clearButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (this.searchInput) {
          this.searchInput.value = "";
          this.searchInput.focus();
          this.searchInput.dispatchEvent(new Event("input"));
        }
      });
    }
  }

  public setDebounce(callback: () => void, delay: number = 400): void {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
    this.searchDebounce = setTimeout(callback, delay);
  }

  private showClearButton(): void {
    this.clearButton.style.display =
      this.searchInput.value.trim() === "" ? "none" : "block";
  }
}

const searchBar = new SearchBar();
export default searchBar;
