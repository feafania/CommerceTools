import createInput from "@/components/input/input";
import { VALIDATION } from "@/config/constants";

export function createAddressFields(): DocumentFragment {
  const fragment = document.createDocumentFragment();

  /* const countryInput = createInput({
    type: "text",
    label: "Country",
    name: "country",
    id: "country",
    placeholder: "Enter your country...",
    class: "registration-input",
    validation: VALIDATION.country,
  }); */

  const countryWrapper = document.createElement("div");
  countryWrapper.className = "input-wrapper";

  const countryLabel = document.createElement("label");
  countryLabel.textContent = "Country";
  countryLabel.htmlFor = "country";
  countryLabel.className = "input-label";
  countryWrapper.append(countryLabel);

  const select = document.createElement("select");
  select.name = "country";
  select.id = "country";
  select.className = "input registration-input";

  const countries = ["Poland", "United Kingdom"];
  for (const country of countries) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.append(option);
  }

  countryWrapper.append(select);
  fragment.append(countryWrapper);

  const cityInput = createInput({
    type: "text",
    label: "City",
    name: "city",
    id: "city",
    placeholder: "Enter your city...",
    class: "registration-input",
    validation: VALIDATION.city,
  });

  const streetInput = createInput({
    type: "text",
    label: "Street",
    name: "street",
    id: "street",
    placeholder: "Enter your street...",
    class: "registration-input",
    validation: VALIDATION.street,
  });

  const postalCodeInput = createInput({
    type: "text",
    label: "Postal Code",
    name: "postalcode",
    id: "postalcode",
    placeholder: "Enter your postal code...",
    class: "registration-input",
    validation: VALIDATION.postalCode,
  });

  //fragment.append(countryInput, cityInput, streetInput, postalCodeInput);
  fragment.append(countryWrapper, cityInput, streetInput, postalCodeInput);
  return fragment;
}
