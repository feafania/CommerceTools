import AddressElement from "@/components/address/address";
import { AddressType } from "@/types/enum";
import createInput from "@/components/input/input";
import createSelect from "@/components/select/select";
import { createLabel } from "@/components/label/label";
import { getCountriesOptions } from "@/utils/helpers";
//import { SETTINGS } from "@/config/settings";

const mockSettingsLabelAddress = {
  headers: {
    [AddressType.Billing]: "Mock Billing Header Text",
    [AddressType.Shipping]: "Mock Shipping Header Text",
  },
  city: "Mock City Label",
  street: "Mock Street Label",
  postalCode: "Mock Postal Code Label",
  country: "Mock Country Label",
  countryNames: { UK: "United Kingdom", PL: "Poland" },
  placeholders: {
    country: "Mock Select Country Placeholder",
  },
  default: {
    [AddressType.Billing]: "Mock Default Billing Checkbox Label",
    [AddressType.Shipping]: "Mock Default Shipping Checkbox Label",
  },
};

const mockCountryOptions = [
  { value: "UK", label: "United Kingdom" },
  { value: "PL", label: "Poland" },
];

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
}));

jest.mock("@/types/enum", () => {
  const actualEnumModule = jest.requireActual("@/types/enum");
  return {
    __esModule: true,
    AddressType: actualEnumModule.AddressType,
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
      expect(element.id).toBe(`${AddressType.Billing}-address`);
      expect(addressElement.type).toBe(AddressType.Billing);
    });

    it("should correctly initialize with Shipping type", () => {
      addressElement = new AddressElement(AddressType.Shipping);
      const element = addressElement.element;

      expect(element.className).toBe("address-block");
      expect(element.id).toBe(`${AddressType.Shipping}-address`);
      expect(addressElement.type).toBe(AddressType.Shipping);
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
      addressElement.render(); // Render calls createDefaultAddress
      const checkboxWrapper = [...addressElement.element.childNodes].find(
        (node) => (node as HTMLElement).className === "checkbox-wrapper",
      ) as HTMLDivElement;

      expect(checkboxWrapper).toBeInstanceOf(HTMLDivElement);
      expect(checkboxWrapper.className).toBe("checkbox-wrapper");

      const checkbox = checkboxWrapper.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInstanceOf(HTMLInputElement);
      expect((checkbox as HTMLInputElement).name).toBe(
        `default-${AddressType.Billing}-address`,
      );
      expect((checkbox as HTMLInputElement).id).toBe(
        `default-${AddressType.Billing}-address`,
      );

      expect(createLabel).toHaveBeenCalledWith({
        label: mockSettingsLabelAddress.default[AddressType.Billing],
        id: `default-${AddressType.Billing}-address`,
        class: `default-${AddressType.Billing}-address`,
      });
      expect(checkboxWrapper.querySelector(".mock-label")).not.toBeNull();
    });

    it("should create a default address checkbox wrapper for Shipping type", () => {
      addressElement = new AddressElement(AddressType.Shipping);
      addressElement.render();
      const checkboxWrapper = [...addressElement.element.childNodes].find(
        (node) => (node as HTMLElement).className === "checkbox-wrapper",
      ) as HTMLDivElement;

      expect(checkboxWrapper).toBeInstanceOf(HTMLDivElement);
      expect(checkboxWrapper.className).toBe("checkbox-wrapper");

      const checkbox = checkboxWrapper.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInstanceOf(HTMLInputElement);
      expect((checkbox as HTMLInputElement).name).toBe(
        `default-${AddressType.Shipping}-address`,
      );
      expect((checkbox as HTMLInputElement).id).toBe(
        `default-${AddressType.Shipping}-address`,
      );

      expect(createLabel).toHaveBeenCalledWith({
        label: mockSettingsLabelAddress.default[AddressType.Shipping],
        id: `default-${AddressType.Shipping}-address`,
        class: `default-${AddressType.Shipping}-address`,
      });
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
      expect(children.length).toBe(6);

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
        expect.objectContaining({ name: `${AddressType.Billing}-city` }),
      );
      expect(createInput).toHaveBeenCalledWith(
        expect.objectContaining({ name: `${AddressType.Billing}-street` }),
      );
      expect(createInput).toHaveBeenCalledWith(
        expect.objectContaining({ name: `${AddressType.Billing}-postalcode` }),
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

      /* const postalInputWrapper = [...addressElement.element.childNodes].find(
        (node, index) =>
          index === 4 &&
          (node as HTMLElement).classList.contains("mock-input-wrapper"),
      ) as HTMLDivElement | undefined; */

      /* const addEventListenerSpy = jest.spyOn(
        countrySelectInput,
        "addEventListener",
      ); */
      countrySelectInput.dispatchEvent(new Event("change"));

      addressElement = new AddressElement(AddressType.Billing);
      addressElement.render();
      const newCountrySelectInput = addressElement.element.querySelector(
        ".mock-select-wrapper select",
      );
      if (newCountrySelectInput) {
        /* const eventListenerSpy = jest.spyOn(
          newCountrySelectInput,
          "addEventListener",
        ); */

        const postalInputQuerySelectorSpy = jest.spyOn(
          addressElement.element,
          "querySelector",
        );
        newCountrySelectInput.dispatchEvent(new Event("change"));
        expect(postalInputQuerySelectorSpy).toHaveBeenCalledWith(
          `#${AddressType.Billing}-postalcode`,
        );
      }
    });
  });
});
