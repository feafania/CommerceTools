import "./address.css";
import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { VALIDATION } from "@/config/constants";
import { SETTINGS } from "@/config/settings";
import { COUNTRY_OPTIONS } from "@/config/constants";

function createAddressHeader(title: string): HTMLHeadingElement {
  const currentLang = SETTINGS.label.address;
  const titleElement = document.createElement("h3");
  titleElement.className = `address-header`;
  const titleKey =
    title.toLowerCase() === "billing" ? "billingHeader" : "shippingHeader";
  titleElement.textContent = currentLang[titleKey as keyof typeof currentLang];
  return titleElement;
}

function createAddressInputs(currentLang: typeof SETTINGS.label.address): {
  cityInput: HTMLDivElement;
  streetInput: HTMLDivElement;
  postalCodeInputWrapper: HTMLDivElement;
} {
  const cityInput = createInput({
    type: "text",
    label: currentLang.city,
    name: "city",
    id: "city",
    placeholder: `${currentLang.city}...`,
    class: "city-input",
    validation: VALIDATION.city,
  });

  const streetInput = createInput({
    type: "text",
    label: currentLang.street,
    name: "street",
    id: "street",
    placeholder: `${currentLang.street}...`,
    class: "street-input",
    validation: VALIDATION.street,
  });

  const postalCodeInputWrapper = createInput({
    type: "text",
    label: currentLang.postalCode,
    name: "postalcode",
    id: "postalcode",
    placeholder: `${currentLang.postalCode}...`,
    class: "postal-code-input",
    validation: {
      message: VALIDATION.postalCode.message,
      isValid: (value: string) => {
        const country = (
          document.querySelector("#country") as HTMLSelectElement
        )?.value;
        return VALIDATION.postalCode.isValid(value, { country });
      },
    },
  });

  return { cityInput, streetInput, postalCodeInputWrapper };
}

export function createAddressFields(title: string): HTMLDivElement {
  const addressBlock = document.createElement("div");
  addressBlock.classList.add("address-block");
  const currentLang = SETTINGS.label.address;

  const header = createAddressHeader(title);
  addressBlock.append(header);
  const countryOptions = COUNTRY_OPTIONS(SETTINGS.label.address);

  const countrySelectWrapper = createSelect({
    label: currentLang.country,
    name: "country",
    id: "country",
    class: "country-input",
    options: countryOptions,
  });
  const countrySelect = countrySelectWrapper.querySelector("select")!;
  addressBlock.append(countrySelectWrapper);

  const { cityInput, streetInput, postalCodeInputWrapper } =
    createAddressInputs(currentLang);
  addressBlock.append(cityInput, streetInput, postalCodeInputWrapper);

  const defaultCheckbox = createDefaultAddressCheckbox(
    title.toLowerCase(),
    currentLang,
  );
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
  addressType: string,
  translations: typeof SETTINGS.label.address,
): HTMLDivElement {
  const checkboxWrapper = document.createElement("div");
  checkboxWrapper.className = "checkbox-wrapper";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = `default-${addressType.toLowerCase()}-address`;
  checkbox.id = `default-${addressType.toLowerCase()}-address`;
  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  const labelKey =
    addressType.toLowerCase() === "billing"
      ? "defaultBilling"
      : "defaultShipping";
  label.textContent = translations[labelKey as keyof typeof translations];

  checkboxWrapper.append(checkbox);
  checkboxWrapper.append(label);

  return checkboxWrapper;
}
