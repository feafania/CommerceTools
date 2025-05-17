import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { VALIDATION } from "@/config/constants";

export function createAddressFields(): DocumentFragment {
  const fragment = document.createDocumentFragment();

  const countrySelect = createSelect({
    label: "Country",
    name: "country",
    id: "country",
    class: "registration-input",
    options: ["Poland", "Great Britain"],
    //validation: VALIDATION.country,
  });

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

  fragment.append(countrySelect, cityInput, streetInput, postalCodeInput);
  return fragment;
}
