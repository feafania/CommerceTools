import "./address.css";
import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { VALIDATION } from "@/config/constants";
import { SETTINGS } from "@/config/settings";
import { COUNTRY_OPTIONS } from "@/config/constants";
import { AddressType } from "@/config/constants";

function createAddressHeader(type: AddressType): HTMLHeadingElement {
  const currentLang = SETTINGS.label.address;
  const titleElement = document.createElement("h3");
  titleElement.className = `address-header`;

  const titleMap = {
    [AddressType.Billing]: currentLang.billingHeader,
    [AddressType.Shipping]: currentLang.shippingHeader,
  };

  titleElement.textContent = titleMap[type];
  return titleElement;
}

function createAddressInputs(
  currentLang: typeof SETTINGS.label.address,
  type: AddressType,
): {
  cityInput: HTMLDivElement;
  streetInput: HTMLDivElement;
  postalCodeInputWrapper: HTMLDivElement;
} {
  const cityInput = createInput({
    type: "text",
    label: currentLang.city,
    name: `${type}-city`,
    id: `${type}-city`,
    placeholder: `${currentLang.city}...`,
    class: "city-input",
    validation: VALIDATION.city,
  });

  const streetInput = createInput({
    type: "text",
    label: currentLang.street,
    name: `${type}-street`,
    id: `${type}-street`,
    placeholder: `${currentLang.street}...`,
    class: "street-input",
    validation: VALIDATION.street,
  });

  const postalCodeInputWrapper = createInput({
    type: "text",
    label: currentLang.postalCode,
    name: `${type}-postalcode`,
    id: `${type}-postalcode`,
    placeholder: `${currentLang.postalCode}...`,
    class: "postal-code-input",
    validation: {
      message: (() => {
        const country = (
          document.querySelector(`#${type}-country`) as HTMLSelectElement
        )?.value;
        return VALIDATION.postalCode.getSpecificMessage({ country });
      })(),
      isValid: (value: string) => {
        const country = (
          document.querySelector(`#${type}-country`) as HTMLSelectElement
        )?.value;
        return VALIDATION.postalCode.isValid(value, { country });
      },
    },
  });

  return { cityInput, streetInput, postalCodeInputWrapper };
}

export function createAddressFields(type: AddressType): HTMLDivElement {
  const addressBlock = document.createElement("div");
  addressBlock.classList.add("address-block");
  const currentLang = SETTINGS.label.address;

  const header = createAddressHeader(type);
  addressBlock.append(header);

  const countryOptions = COUNTRY_OPTIONS(SETTINGS.label.address);

  const countrySelectWrapper = createSelect({
    label: currentLang.country,
    name: `${type}-country`,
    id: `${type}-country`,
    class: "country-input",
    options: countryOptions,
  });
  const countrySelect = countrySelectWrapper.querySelector("select")!;
  addressBlock.append(countrySelectWrapper);

  const { cityInput, streetInput, postalCodeInputWrapper } =
    createAddressInputs(currentLang, type);
  addressBlock.append(cityInput, streetInput, postalCodeInputWrapper);

  const defaultCheckbox = createDefaultAddressCheckbox(type, currentLang);
  addressBlock.append(defaultCheckbox);

  countrySelect.addEventListener("change", () => {
    const postalCodeInput = postalCodeInputWrapper.querySelector("input");
    if (postalCodeInput) {
      postalCodeInput.dispatchEvent(new Event("input"));
    }
  });

  return addressBlock;
}

function createDefaultAddressCheckbox(
  type: AddressType,
  translations: typeof SETTINGS.label.address,
): HTMLDivElement {
  const checkboxWrapper = document.createElement("div");
  checkboxWrapper.className = "checkbox-wrapper";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = `default-${type}-address`;
  checkbox.id = `default-${type}-address`;
  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  const labelKey =
    type === AddressType.Billing
      ? translations.defaultBilling
      : translations.defaultShipping;
  label.textContent = labelKey;

  checkboxWrapper.append(checkbox);
  checkboxWrapper.append(label);

  return checkboxWrapper;
}
