import "./address.css";
import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { SETTINGS } from "@/config/settings";
import { AddressType } from "@/types/enum";
import { getCountriesOptions } from "@/utils/helpers";
import createCheckbox from "@/components/checkbox/checkbox";

export default class AddressElement {
  #addressBlock: HTMLDivElement;
  #type: AddressType;

  constructor(type: AddressType) {
    this.#type = type;
    this.#addressBlock = document.createElement("div");
    this.#addressBlock.className = "address-block";
    this.#addressBlock.id = `${type}-address`;
  }

  get element(): HTMLDivElement {
    return this.#addressBlock;
  }

  get type(): AddressType {
    return this.#type;
  }

  render() {
    for (const element of this.#addressBlock.childNodes) {
      element.remove();
    }
    this.#addressBlock.append(this.createHeader());
    this.#addressBlock.append(this.createCountry());
    this.#addressBlock.append(this.createCity());
    this.#addressBlock.append(this.createStreet());
    this.#addressBlock.append(this.createPostalCode());
    this.#addressBlock.append(this.createDefaultAddress());
  }

  private createHeader(): HTMLHeadingElement {
    const titleElement = document.createElement("h3");
    titleElement.className = `address-header`;
    titleElement.textContent = SETTINGS.label.address.headers[this.#type];
    return titleElement;
  }

  private createCity(): HTMLDivElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.address.city,
      name: `${this.#type}-city`,
      id: `${this.#type}-city`,
      placeholder: `${SETTINGS.label.address.city}...`,
      class: "city-input",
      validationName: "city",
    });
  }

  private createStreet(): HTMLDivElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.address.street,
      name: `${this.#type}-street`,
      id: `${this.#type}-street`,
      placeholder: `${SETTINGS.label.address.street}...`,
      class: "street-input",
      validationName: "street",
    });
  }

  private createPostalCode(): HTMLDivElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.address.postalCode,
      name: `${this.#type}-postalcode`,
      id: `${this.#type}-postalcode`,
      placeholder: `${SETTINGS.label.address.postalCode}...`,
      class: "postal-code-input",
      validationName: "postalCode",
      relatedCountryField: `${this.#type}-country`,
    });
  }

  private createCountry(): HTMLDivElement {
    const countryOptions = SETTINGS.label.address.countryNames;
    const countrySelectWrapper = createSelect({
      label: SETTINGS.label.address.country,
      name: `${this.#type}-country`,
      id: `${this.#type}-country`,
      class: "country-input",
      placeholder: `${SETTINGS.label.address.placeholders.country}...`,
      options: getCountriesOptions(countryOptions),
      validationName: "country",
    });
    const countrySelect = countrySelectWrapper.querySelector("select")!;

    countrySelect.addEventListener("change", () => {
      const postalInput = this.#addressBlock.querySelector(
        `#${this.#type}-postalcode`,
      );
      if (postalInput) {
        postalInput.dispatchEvent(new Event("input"));
      }
    });

    return countrySelectWrapper;
  }

  private createDefaultAddress(): HTMLDivElement {
    return createCheckbox({
      label: SETTINGS.label.address.default[this.#type],
      name: `default-${this.#type}-address`,
      id: `default-${this.#type}-address`,
      relatedCountryField: `${this.#type}-country`,
    });
  }
}
