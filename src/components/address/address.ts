import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { VALIDATION } from "@/config/constants";

export function createAddressFields(title: string): HTMLDivElement {
  const addressBlock = document.createElement("div");
  addressBlock.classList.add("address-block");

  const titleElement = document.createElement("h3");
  titleElement.className = "address-title";
  titleElement.textContent = `${title} Address`;
  addressBlock.append(titleElement);

  const countrySelectWrapper = createSelect({
    label: "Country",
    name: "country",
    id: "country",
    class: "country-input",
    options: ["Poland", "United Kingdom"],
  });
  const countrySelect = countrySelectWrapper.querySelector("select")!;

  const cityInput = createInput({
    type: "text",
    label: "City",
    name: "city",
    id: "city",
    placeholder: "Enter your city...",
    class: "city-input",
    validation: VALIDATION.city,
  });

  const streetInput = createInput({
    type: "text",
    label: "Street",
    name: "street",
    id: "street",
    placeholder: "Enter your street...",
    class: "street-input",
    validation: VALIDATION.street,
  });

  const postalCodeInputWrapper = createInput({
    type: "text",
    label: "Postal Code",
    name: "postalcode",
    id: "postalcode",
    placeholder: "Enter your postal code...",
    class: "postal-code-input",
    validation: {
      message: VALIDATION.postalCode.message,
      isValid: (value: string) => {
        const country = countrySelect.value;
        return VALIDATION.postalCode.isValid(value, { country });
      },
    },
  });

  handleCountryChange(countrySelect, postalCodeInputWrapper);

  addressBlock.append(
    countrySelectWrapper,
    cityInput,
    streetInput,
    postalCodeInputWrapper,
    createDefaultAddressCheckbox(title.toLowerCase()),
  );

  return addressBlock;
}

function handleCountryChange(
  countrySelect: HTMLSelectElement,
  postalCodeInputWrapper: HTMLDivElement,
) {
  countrySelect.addEventListener("change", () => {
    const inputElement = postalCodeInputWrapper.querySelector("input");
    if (inputElement) {
      const event = new Event("input");
      inputElement.dispatchEvent(event);
    }
  });
}

function createDefaultAddressCheckbox(addressType: string): HTMLDivElement {
  const checkboxWrapper = document.createElement("div");
  checkboxWrapper.className = "checkbox-wrapper";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = `default-${addressType.toLowerCase()}-address`;
  checkbox.id = `default-${addressType.toLowerCase()}-address`;
  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = `Set as default ${addressType} address`;

  checkboxWrapper.append(checkbox);
  checkboxWrapper.append(label);

  return checkboxWrapper;
}

/* function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
} */
