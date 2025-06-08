import {
  ADDRESS_CHILDRENS_NUMBER,
  mockCountryOptions,
  mockSettingsLabelAddress,
} from "../__mocks__/address.mock";

import AddressElement from "@/components/address/address";
import { AddressType } from "@/types/enum";
import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { createLabel } from "@/components/label/label";
import { getCountriesOptions } from "@/utils/helpers";

const mockSelectElement = document.createElement("select");
const mockCreateSelectResult = document.createElement("div");
mockCreateSelectResult.className = "mock-select-wrapper";
mockCreateSelectResult.append(mockSelectElement);

jest.mock("@/components/select/select", () => ({
  __esModule: true,
  default: jest.fn(() => {
    const selectElement = document.createElement("select");
    const wrapper = document.createElement("div");
    wrapper.className = "mock-select-wrapper";
    wrapper.append(selectElement);
    wrapper.querySelector = jest.fn((selector: string) => {
      if (selector === "select") return selectElement;
      return;
    });
    return wrapper;
  }),
}));

jest.mock("@/components/input/input", () => ({
  __esModule: true,
  default: jest.fn(() => {
    const element = document.createElement("div");
    element.className = "mock-input-wrapper";
    return element;
  }),
}));

jest.mock("@/components/label/label", () => ({
  __esModule: true,
  createLabel: jest.fn(() => {
    const element = document.createElement("label");
    element.className = "mock-label";
    return element;
  }),
}));

jest.mock("@/utils/helpers", () => ({
  __esModule: true,
  getCountriesOptions: jest.fn(() => mockCountryOptions),
  getLocalState: jest.fn(),
  saveLocalState: jest.fn(),
  classesToArray: jest.fn((classObject) => {
    if (Array.isArray(classObject)) {
      return classObject.filter((cls) => typeof cls === "string");
    } else if (typeof classObject === "string") {
      return classObject.trim().split(/\s+/);
    }
    return [];
  }),
  getState: jest.fn(() => {}),
}));

jest.mock("@/types/enum", () => {
  const actualEnumModule = jest.requireActual("@/types/enum");
  return {
    __esModule: true,
    AddressType: actualEnumModule.AddressType,
    LabelPosition: {
      Right: "right",
      Left: "left",
    },
  };
});

jest.mock("@/config/settings", () => ({
  __esModule: true,
  SETTINGS: {
    currentLang: "en",
    get label() {
      return {
        address: mockSettingsLabelAddress,
      };
    },
    setLang: jest.fn(),
    availableLanguages: ["en", "pl"],
  },
}));

describe("AddressElement", () => {
  let addressElement: AddressElement;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Constructor and Getters", () => {
    it("should correctly initialize with Billing type", () => {
      addressElement = new AddressElement(AddressType.Billing);
      const element = addressElement.element;

      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toBe("address-block");
      expect(element.id).toBe(`address-${AddressType.Billing}`);
      expect(addressElement.name).toBe(AddressType.Billing);
    });

    it("should correctly initialize with Shipping type", () => {
      addressElement = new AddressElement(AddressType.Shipping);
      const element = addressElement.element;

      expect(element.className).toBe("address-block");
      expect(element.id).toBe(`address-${AddressType.Shipping}`);
      expect(addressElement.name).toBe(AddressType.Shipping);
    });
  });

  describe("createHeader (private method tested via render or direct call if exposed)", () => {
    it("should create a header with correct class and text for Billing type", () => {
      addressElement = new AddressElement(AddressType.Billing);
      addressElement.render();
      const header = addressElement.element.querySelector(".address-header");

      expect(header).toBeInstanceOf(HTMLHeadingElement);
      expect(header?.tagName).toBe("H3");
      expect(header?.className).toBe("address-header");
      expect(header?.textContent).toBe(
        mockSettingsLabelAddress.headers[AddressType.Billing],
      );
    });

    it("should create a header with correct class and text for Shipping type", () => {
      addressElement = new AddressElement(AddressType.Shipping);
      addressElement.render();
      const header = addressElement.element.querySelector(".address-header");

      expect(header).toBeInstanceOf(HTMLHeadingElement);
      expect(header?.tagName).toBe("H3");
      expect(header?.className).toBe("address-header");
      expect(header?.textContent).toBe(
        mockSettingsLabelAddress.headers[AddressType.Shipping],
      );
    });
  });

  describe("createDefaultAddress (private method tested via render or direct call)", () => {
    it("should create a default address checkbox wrapper for Billing type", () => {
      addressElement = new AddressElement(AddressType.Billing);
      addressElement.render();
      const checkboxWrapper = addressElement.element.querySelector(
        ".checkbox-wrapper.custom-checkbox",
      ) as HTMLDivElement;

      expect(checkboxWrapper).toBeInstanceOf(HTMLDivElement);
      expect(checkboxWrapper.classList.contains("checkbox-wrapper")).toBe(true);
      expect(checkboxWrapper.classList.contains("custom-checkbox")).toBe(true);

      const checkbox = checkboxWrapper.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInstanceOf(HTMLInputElement);
      expect((checkbox as HTMLInputElement).name).toBe(
        `default-shipping-address-${AddressType.Billing}`,
      );
      expect((checkbox as HTMLInputElement).id).toBe(
        `default-shipping-address-${AddressType.Billing}`,
      );

      expect(createLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          label: mockSettingsLabelAddress.default[AddressType.Billing],
          id: `default-billing-address-${AddressType.Billing}`,
        }),
      );
      expect(checkboxWrapper.querySelector(".mock-label")).not.toBeNull();
    });

    it("should create a default address checkbox wrapper for Shipping type", () => {
      addressElement = new AddressElement(AddressType.Shipping);
      addressElement.render();
      const checkboxWrapper = addressElement.element.querySelector(
        ".checkbox-wrapper.custom-checkbox",
      ) as HTMLDivElement;

      expect(checkboxWrapper).toBeInstanceOf(HTMLDivElement);
      expect(checkboxWrapper.classList.contains("checkbox-wrapper")).toBe(true);
      expect(checkboxWrapper.classList.contains("custom-checkbox")).toBe(true);

      const checkbox = checkboxWrapper.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInstanceOf(HTMLInputElement);
      expect((checkbox as HTMLInputElement).name).toBe(
        `default-shipping-address-${AddressType.Shipping}`,
      );
      expect((checkbox as HTMLInputElement).id).toBe(
        `default-shipping-address-${AddressType.Shipping}`,
      );

      expect(createLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          label: mockSettingsLabelAddress.default[AddressType.Shipping],
          id: `default-shipping-address-${AddressType.Shipping}`,
        }),
      );
      expect(checkboxWrapper.querySelector(".mock-label")).not.toBeNull();
    });
  });

  describe("render", () => {
    it("should clear existing children before appending new ones", () => {
      addressElement = new AddressElement(AddressType.Billing);
      const oldChild = document.createElement("div");
      oldChild.id = "old-child";
      addressElement.element.append(oldChild);

      expect(addressElement.element.querySelector("#old-child")).not.toBeNull();
      addressElement.render();
      expect(addressElement.element.querySelector("#old-child")).toBeNull();
    });

    it("should append all created elements in order", () => {
      addressElement = new AddressElement(AddressType.Billing);
      addressElement.render();

      const children = [...addressElement.element.childNodes];
      expect(children.length).toBe(ADDRESS_CHILDRENS_NUMBER);

      expect(
        (children[0] as HTMLElement).classList.contains("address-header"),
      ).toBe(true);
      expect(
        (children[1] as HTMLElement).classList.contains("mock-select-wrapper"),
      ).toBe(true);
      expect(
        (children[2] as HTMLElement).classList.contains("mock-input-wrapper"),
      ).toBe(true);
      expect(
        (children[5] as HTMLElement).classList.contains("checkbox-wrapper"),
      ).toBe(true);
    });

    it("should call all create methods during render", () => {
      addressElement = new AddressElement(AddressType.Billing);

      addressElement.render();

      expect(createSelect).toHaveBeenCalled();
      expect(getCountriesOptions).toHaveBeenCalledWith(
        mockSettingsLabelAddress.countryNames,
      );

      expect(createInput).toHaveBeenCalledTimes(3);
      expect(createInput).toHaveBeenCalledWith(
        expect.objectContaining({ name: `city-${AddressType.Billing}` }),
      );
      expect(createInput).toHaveBeenCalledWith(
        expect.objectContaining({ name: `street-${AddressType.Billing}` }),
      );
      expect(createInput).toHaveBeenCalledWith(
        expect.objectContaining({ name: `postalcode-${AddressType.Billing}` }),
      );

      expect(createLabel).toHaveBeenCalled();
    });

    it("should attach change listener to country select and dispatch input event on input", () => {
      addressElement = new AddressElement(AddressType.Billing);
      addressElement.render();

      const countrySelectWrapper = addressElement.element.querySelector(
        ".mock-select-wrapper",
      );
      const countrySelectInput = countrySelectWrapper?.querySelector("select");

      expect(countrySelectInput).not.toBeNull();
      if (!countrySelectInput) return;

      countrySelectInput.dispatchEvent(new Event("change"));

      addressElement = new AddressElement(AddressType.Billing);
      addressElement.render();
      const newCountrySelectInput = addressElement.element.querySelector(
        ".mock-select-wrapper select",
      );
      if (newCountrySelectInput) {
        const postalInputQuerySelectorSpy = jest.spyOn(
          addressElement.element,
          "querySelector",
        );
        newCountrySelectInput.dispatchEvent(new Event("change"));
        expect(postalInputQuerySelectorSpy).toHaveBeenCalledWith(
          `#postalcode-${AddressType.Billing}`,
        );
      }
    });
  });
});
