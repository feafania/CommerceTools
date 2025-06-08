import "./address.css";
import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { SETTINGS } from "@/config/settings";
import { AddressType } from "@/types/enum";
import { getCountriesOptions } from "@/utils/helpers";
import createCheckbox from "@/components/checkbox/checkbox";
import { InAddress } from "@/types/interfaces";

export default class AddressElement {
  #addressBlock: HTMLDivElement;
  #name: string;
  #forbidValueFromState: boolean;

  constructor(name: string, forbidValueFromState: boolean = false) {
    this.#name = name;
    this.#addressBlock = document.createElement("div");
    this.#addressBlock.className = "address-block";
    this.#addressBlock.id = `address-${name}`;
    this.#forbidValueFromState = forbidValueFromState;
  }

  get element(): HTMLDivElement {
    return this.#addressBlock;
  }

  get name(): string {
    return this.#name;
  }

  render() {
    for (const element of this.#addressBlock.childNodes) {
      element.remove();
    }
    if (this.#name in SETTINGS.label.address.headers) {
      this.#addressBlock.append(this.createHeader(this.#name as AddressType));
    }
    this.#addressBlock.append(this.createCountry());
    this.#addressBlock.append(this.createCity());
    this.#addressBlock.append(this.createStreet());
    this.#addressBlock.append(this.createPostalCode());
    this.#addressBlock.append(this.createDefaultAddress(AddressType.Shipping));
    this.#addressBlock.append(this.createDefaultAddress(AddressType.Billing));
  }

  private createHeader(type: AddressType): HTMLHeadingElement {
    const titleElement = document.createElement("h3");
    titleElement.className = `address-header`;
    titleElement.textContent = SETTINGS.label.address.headers[type];
    return titleElement;
  }

  private createCity(): HTMLDivElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.address.city,
      name: `city-${this.#name}`,
      id: `city-${this.#name}`,
      placeholder: `${SETTINGS.label.address.city}...`,
      class: "city-input",
      validationName: "city",
      forbidValueFromState: this.#forbidValueFromState,
    });
  }

  private createStreet(): HTMLDivElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.address.street,
      name: `street-${this.#name}`,
      id: `street-${this.#name}`,
      placeholder: `${SETTINGS.label.address.street}...`,
      class: "street-input",
      validationName: "street",
      forbidValueFromState: this.#forbidValueFromState,
    });
  }

  private createPostalCode(): HTMLDivElement {
    return createInput({
      type: "text",
      label: SETTINGS.label.address.postalCode,
      name: `postalcode-${this.#name}`,
      id: `postalcode-${this.#name}`,
      placeholder: `${SETTINGS.label.address.postalCode}...`,
      class: "postal-code-input",
      validationName: "postalcode",
      relatedCountryField: `country-${this.#name}`,
      forbidValueFromState: this.#forbidValueFromState,
    });
  }

  private createCountry(): HTMLDivElement {
    const countryOptions = SETTINGS.label.address.countryNames;
    const countrySelectWrapper = createSelect({
      label: SETTINGS.label.address.country,
      name: `country-${this.#name}`,
      id: `country-${this.#name}`,
      class: "country-input",
      placeholder: `${SETTINGS.label.address.placeholders.country}...`,
      options: getCountriesOptions(countryOptions),
      validationName: "country",
      relatedCountryField: `country-${this.#name}`,
      forbidValueFromState: this.#forbidValueFromState,
    });
    const countrySelect = countrySelectWrapper.querySelector("select")!;

    countrySelect.addEventListener("change", () => {
      const postalInput = this.#addressBlock.querySelector(
        `#postalcode-${this.#name}`,
      );
      if (postalInput) {
        postalInput.dispatchEvent(new Event("input"));
      }
    });

    return countrySelectWrapper;
  }

  private createDefaultAddress(type: AddressType): HTMLDivElement {
    return createCheckbox({
      label: SETTINGS.label.address.default[type],
      name: `default-${type}-address-${this.#name}`,
      id: `default-${type}-address-${this.#name}`,
      relatedCountryField: `country-${this.#name}`,
      forbidValueFromState: this.#forbidValueFromState,
    });
  }
  setData(data: InAddress): void {
    const cityInput = this.#addressBlock.querySelector<HTMLInputElement>(
      `#city-${this.#name}`,
    );
    const streetInput = this.#addressBlock.querySelector<HTMLInputElement>(
      `#street-${this.#name}`,
    );
    const postalCodeInput = this.#addressBlock.querySelector<HTMLInputElement>(
      `#postalcode-${this.#name}`,
    );
    const countrySelect = this.#addressBlock.querySelector<HTMLSelectElement>(
      `#country-${this.#name}`,
    );
    const defaultBilling = this.#addressBlock.querySelector<HTMLInputElement>(
      `#default-billing-address-${this.#name}`,
    );
    const defaultShipping = this.#addressBlock.querySelector<HTMLInputElement>(
      `#default-shipping-address-${this.#name}`,
    );

    if (cityInput && data.city) cityInput.value = data.city;
    if (streetInput && data.streetName) streetInput.value = data.streetName;
    if (postalCodeInput && data.postalCode)
      postalCodeInput.value = data.postalCode;
    if (countrySelect && data.country) countrySelect.value = data.country;

    if (defaultBilling && data.isDefaultBilling !== undefined) {
      defaultBilling.checked = data.isDefaultBilling;
    }
    if (defaultShipping && data.isDefaultShipping !== undefined) {
      defaultShipping.checked = data.isDefaultShipping;
    }
  }
}
