import productService from "@/api/services/product-service";
import { SETTINGS } from "@/config/settings";
import CatalogView from "@/pages/catalog/catalog";
import { AttributeMap, InAttributes, SortOptions } from "@/types/types";
import { InAttributeTypeValues, LabelPosition, PageType } from "@/types/enum";
import { localizeName } from "@/utils/helpers";
import createSelect from "@/components/select/select";
import createCheckbox from "@/components/checkbox/checkbox";

const CatalogViewFiltering = {
  tempFilters: {} as InAttributes,
  tempMinPrice: undefined as number | undefined,
  tempMaxPrice: undefined as number | undefined,

  renderFilters(): HTMLDivElement {
    const filtersSection = document.createElement("div");
    filtersSection.className = "filters-section";

    // Title
    const priceTitle = document.createElement("div");
    priceTitle.textContent = SETTINGS.label.catalog.filters.priceRange;
    priceTitle.className = "filter-title";
    filtersSection.append(priceTitle);
    const priceFilter = this.renderPriceFilter();
    const minPriceInput =
      priceFilter.querySelector<HTMLInputElement>("#min-price-input");
    const maxPriceInput =
      priceFilter.querySelector<HTMLInputElement>("#max-price-input");
    filtersSection.append(priceFilter);

    const attributesWrapper = document.createElement("div");
    attributesWrapper.className = "attribute-filters";
    filtersSection.append(attributesWrapper);
    this.renderAttributeFilters(attributesWrapper);

    // Apply button
    const applyFiltersButton = document.createElement("button");
    applyFiltersButton.textContent =
      SETTINGS.label.catalog.filters.applyFilters;
    applyFiltersButton.className = "apply-filters-btn custom-filter-button";

    applyFiltersButton.addEventListener("click", async () => {
      CatalogView.minPrice = CatalogViewFiltering.tempMinPrice;
      CatalogView.maxPrice = CatalogViewFiltering.tempMaxPrice;
      CatalogView.attributeFilters = { ...CatalogViewFiltering.tempFilters };
      CatalogView.offset = 0;
      CatalogViewFiltering.tempFilters = { ...CatalogView.attributeFilters };

      await this.filterInform();
      CatalogView.isSamePage = true;
      this.buildPath();
    });

    // Reset button
    const resetFiltersButton = document.createElement("button");
    resetFiltersButton.textContent =
      SETTINGS.label.catalog.filters.resetFilters;
    resetFiltersButton.className = "reset-filters-btn custom-filter-button";

    resetFiltersButton.addEventListener("click", async () => {
      if (minPriceInput && maxPriceInput) {
        minPriceInput.value = "";
        maxPriceInput.value = "";
      }

      CatalogViewFiltering.tempMinPrice = undefined;
      CatalogViewFiltering.tempMaxPrice = undefined;
      CatalogViewFiltering.tempFilters = {};

      CatalogView.minPrice = undefined;
      CatalogView.maxPrice = undefined;
      CatalogView.attributeFilters = {};
      this.clearInputs();
      await this.filterInform();
      CatalogView.isSamePage = true;
      this.buildPath();
    });

    this.setActiveFiltering();

    filtersSection.append(applyFiltersButton, resetFiltersButton);
    return filtersSection;
  },

  clearInputs() {
    const selects = document.querySelectorAll<HTMLSelectElement>(
      "select.select-filter",
    );
    for (const sel of selects) {
      sel.value = "";
      sel.dispatchEvent(new Event("change"));
    }

    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      "input[type='checkbox']",
    );
    for (const check of checkboxes) {
      check.checked = false;
      check.dispatchEvent(new Event("change"));
    }
  },

  setActiveFiltering() {
    //   if (
    //     CatalogView.minPrice ||
    //     CatalogView.maxPrice ||
    //     Object.keys(CatalogView.attributeFilters).length > 0
    //   ) {
    //     applyFiltersButton.classList.add("active");
    //   } else {
    //     applyFiltersButton.classList.remove("active");
    //   }
  },

  renderPriceFilter() {
    const priceFilter = document.createElement("div");

    priceFilter.className = "filter price-filter";

    // "From"
    const fromLabel = document.createElement("label");
    fromLabel.textContent = SETTINGS.label.catalog.filters.priceFrom;
    fromLabel.className = "filter-label";
    const minPriceInput = document.createElement("input");
    minPriceInput.placeholder =
      SETTINGS.label.catalog.filters.priceFromPlaceholder;
    minPriceInput.id = "min-price-input";
    minPriceInput.className = "filter-input";
    minPriceInput.min = "0";

    // "To"
    const toLabel = document.createElement("label");
    toLabel.textContent = SETTINGS.label.catalog.filters.priceTo;
    toLabel.className = "filter-label";
    const maxPriceInput = document.createElement("input");
    maxPriceInput.placeholder =
      SETTINGS.label.catalog.filters.priceToPlaceholder;
    maxPriceInput.id = "max-price-input";
    maxPriceInput.className = "filter-input";
    maxPriceInput.min = "0";

    for (const input of [minPriceInput, maxPriceInput]) {
      input.type = "text";
      input.inputMode = "decimal";
      input.addEventListener("input", () => {
        input.value = input.value.replaceAll(/[^0-9.]/g, "");
        const min = minPriceInput?.value
          ? Number(minPriceInput.value)
          : undefined;
        const max = maxPriceInput?.value
          ? Number(maxPriceInput.value)
          : undefined;

        CatalogViewFiltering.tempMinPrice = min;
        CatalogViewFiltering.tempMaxPrice = max;
      });
    }

    priceFilter.append(fromLabel, minPriceInput, toLabel, maxPriceInput);
    return priceFilter;
  },

  async renderAttributeFilters(wrapper: HTMLElement) {
    const productTypes = await productService.getProductTypes();

    const attributeFields: AttributeMap = new Map();

    for (const pt of productTypes) {
      for (const attribute of pt.attributes) {
        if (
          attribute.isSearchable &&
          attribute.type &&
          [InAttributeTypeValues.Enum, InAttributeTypeValues.Lenum].includes(
            attribute.type.name,
          )
        ) {
          attributeFields.set(attribute.name, attribute);
        }
      }
    }
    CatalogView.availableAttributes = attributeFields;

    const newFilterContainers: HTMLElement[] =
      this.createAttributeContainer(attributeFields);

    const currentFilters =
      wrapper.querySelectorAll<HTMLElement>(".attribute-filter");
    for (const oldFilter of currentFilters) {
      const name = oldFilter.dataset.attrName;
      if (!attributeFields.has(name!)) {
        oldFilter.remove();
      }
    }

    for (const newContainer of newFilterContainers) {
      const attributeName = newContainer.dataset.attrName!;
      const existing = wrapper.querySelector(
        `.attribute-filter[data-attr-name="${attributeName}"]`,
      );
      if (existing) {
        existing.replaceWith(newContainer);
      } else {
        wrapper.append(newContainer);
      }
    }
  },

  createAttributeContainer(attributeFields: AttributeMap): HTMLElement[] {
    const newFilterContainers: HTMLElement[] = [];

    for (const [name, attribute] of attributeFields) {
      const type = attribute.type!;
      const options = type.values.map((value) => ({
        label: localizeName(value.label),
        code: value.key,
      }));

      const id = `filter-${name}`;

      let filterElement: HTMLElement;

      if (options.length <= 1) {
        // Checkbox group
        const groupWrapper = this.createAttributeCheckbox(
          name,
          id,
          options,
          localizeName(attribute.label),
        );

        filterElement = groupWrapper;
      } else {
        // Select

        filterElement = this.createAttributeSelect(
          name,
          id,
          options,
          localizeName(attribute.label),
        );
      }

      const container = document.createElement("div");
      container.className = "attribute-filter";
      container.dataset.attrName = name;
      container.append(filterElement);

      newFilterContainers.push(container);
    }
    return newFilterContainers;
  },

  createAttributeCheckbox(
    name: string,
    id: string,
    options: { label: string; code: string }[],
    label?: string,
  ): HTMLElement {
    const groupWrapper = document.createElement("div");
    groupWrapper.className = "checkbox-group";

    if (label) {
      const title = document.createElement("div");
      title.className = "checkbox-group-title";
      title.textContent = label;
      groupWrapper.append(title);
    }
    const selectedValues = this.getSelectedValues(name);

    for (const opt of options) {
      const checkbox = createCheckbox(
        {
          id: `${id}-${opt.code}`,
          name: `${opt.code}`,
          label: opt.label,
          value: selectedValues.includes(opt.code) ? "on" : "off",
          class: "checkbox-option",
          forbidValueFromState: true,
        },
        LabelPosition.Right,
      );

      const input = checkbox.querySelector<HTMLInputElement>("input");
      if (input) {
        input.checked = selectedValues.includes(opt.code);
        input.addEventListener("change", () => {
          const current = Array.isArray(CatalogViewFiltering.tempFilters[name])
            ? (CatalogViewFiltering.tempFilters[name] as string[])
            : [];

          if (input.checked) {
            CatalogViewFiltering.tempFilters[name] = [...current, opt.code];
          } else {
            const filtered = current.filter((v) => v !== opt.code);
            if (filtered.length === 0) {
              delete CatalogViewFiltering.tempFilters[name];
            } else {
              CatalogViewFiltering.tempFilters[name] = filtered;
            }
          }
        });
      }

      groupWrapper.append(checkbox);
    }
    return groupWrapper;
  },

  getSelectedValues(name: string): string[] {
    const raw = CatalogView.attributeFilters[name];
    if (Array.isArray(raw)) {
      return raw as string[];
    } else if (typeof raw === "string") {
      return raw.split(",");
    } else {
      return [];
    }
  },

  createAttributeSelect(
    name: string,
    id: string,
    options: { label: string; code: string }[],
    label?: string,
  ): HTMLElement {
    const select = createSelect({
      id,
      name,
      label,
      class: "select-filter",
      options,
      placeholder: `${SETTINGS.label.catalog.filters.filterBy} ${label}`,
      value:
        typeof CatalogView.attributeFilters[name] === "string"
          ? (CatalogView.attributeFilters[name] as string)
          : "",
      forbidValueFromState: true,
    });

    const selectElement = select.querySelector("select");
    if (selectElement) {
      selectElement.addEventListener("change", () => {
        if (selectElement.value) {
          CatalogViewFiltering.tempFilters[name] = selectElement.value;
        } else {
          delete CatalogViewFiltering.tempFilters[name];
        }
      });
      const clearButton = document.createElement("button");
      clearButton.type = "button";
      clearButton.textContent = "✕";
      clearButton.className = "select-clear-button";
      clearButton.addEventListener("click", () => {
        selectElement.value = "";
        selectElement.dispatchEvent(new Event("change"));
      });

      const selectWrapper = document.createElement("div");
      selectWrapper.className = "select-wrapper";
      selectWrapper.append(selectElement, clearButton);

      const labelElement = select.querySelector("label");
      const selectLabelWrapper = document.createElement("div");
      selectLabelWrapper.append(labelElement ?? "", selectWrapper);

      return selectLabelWrapper;
    }
    return select;
  },

  async applyFiltering() {
    const hashParts = globalThis.location.hash.split("?");
    const queryParameters = new URLSearchParams(hashParts[1]);
    await this.applyQueryParams(queryParameters);
    CatalogView.updateSidebarActiveClass();
    const attributesWrapper =
      document.querySelector<HTMLDivElement>(".attribute-filters");
    if (attributesWrapper) {
      await this.renderAttributeFilters(attributesWrapper);
    }
    await CatalogView.setTitle();
    await this.filterInform();
  },

  async filterInform() {
    const { minPrice, maxPrice, attributeFilters } = CatalogView;

    const filtersTextParts: string[] = [];

    if (minPrice !== undefined) {
      filtersTextParts.push(
        `${SETTINGS.label.catalog.filters.priceFrom}: ${minPrice}`,
      );
    }

    if (maxPrice !== undefined) {
      filtersTextParts.push(
        `${SETTINGS.label.catalog.filters.priceTo}: ${maxPrice}`,
      );
    }

    for (const [key, value] of Object.entries(attributeFilters)) {
      const attribute = CatalogView.availableAttributes.get(key);
      if (!attribute) continue;

      const localizedLabel = localizeName(attribute.label) || key;

      let valueText: string;

      if (Array.isArray(value)) {
        valueText = value
          .map((value_) => {
            const found = attribute.type?.values.find((v) => v.key === value_);
            return found ? localizeName(found.label) : value_;
          })
          .join(", ");
      } else {
        const found = attribute.type?.values.find((v) => v.key === value);
        valueText = found ? localizeName(found.label) : String(value);
      }

      filtersTextParts.push(`${localizedLabel}: ${valueText}`);
    }

    const hasFilters = filtersTextParts.length > 0;

    if (hasFilters) {
      CatalogView.filterInfo.classList.remove("hidden");
      CatalogView.filterInfo.textContent = `${SETTINGS.label.catalog.filters.filtersApplied}:
       ${filtersTextParts.join(", ")}`;
    } else {
      CatalogView.filterInfo.classList.add("hidden");
      CatalogView.filterInfo.textContent = "";
    }

    this.setActiveFiltering();
  },

  buildQueryParams(): string {
    const parameters = new URLSearchParams();

    if (CatalogView.minPrice !== undefined)
      parameters.set("min", CatalogView.minPrice.toString());
    if (CatalogView.maxPrice !== undefined)
      parameters.set("max", CatalogView.maxPrice.toString());
    if (CatalogView.currentQuery) parameters.set("q", CatalogView.currentQuery);
    if (CatalogView.sortOption) parameters.set("sort", CatalogView.sortOption);
    if (CatalogView.offset)
      parameters.set("offset", CatalogView.offset.toString());

    for (const [key, value] of Object.entries(CatalogView.attributeFilters)) {
      if (Array.isArray(value)) {
        parameters.set(`attr_${key}`, value.join(","));
      } else if (typeof value === "string") {
        parameters.set(`attr_${key}`, value);
      }
    }
    return parameters.toString();
  },

  async applyQueryParams(parameters: URLSearchParams) {
    CatalogView.minPrice = parameters.has("min")
      ? Number(parameters.get("min"))
      : undefined;
    CatalogView.maxPrice = parameters.has("max")
      ? Number(parameters.get("max"))
      : undefined;

    const minPriceInput =
      CatalogView.container.querySelector<HTMLInputElement>("#min-price-input");
    const maxPriceInput =
      CatalogView.container.querySelector<HTMLInputElement>("#max-price-input");

    if (minPriceInput) {
      minPriceInput.value = CatalogView.minPrice?.toString() ?? "";
    }
    if (maxPriceInput) {
      maxPriceInput.value = CatalogView.maxPrice?.toString() ?? "";
    }

    CatalogView.currentQuery = parameters.get("q") || "";
    CatalogView.sortOption = parameters.get("sort") as SortOptions;
    CatalogView.offset = parameters.has("offset")
      ? Number(parameters.get("offset"))
      : 0;

    const attributeFilters: InAttributes = {};
    for (const [key, value] of parameters.entries()) {
      if (key.startsWith("attr_")) {
        const attributeName = key.slice(5);
        attributeFilters[attributeName] = value;

        const input = CatalogView.container.querySelector<HTMLInputElement>(
          `#filter-input-${attributeName} input`,
        );
        if (input) {
          input.value = value;
        }
      }
    }
    CatalogView.attributeFilters = attributeFilters;
    CatalogViewFiltering.tempMinPrice = CatalogView.minPrice;
    CatalogViewFiltering.tempMaxPrice = CatalogView.maxPrice;
    CatalogViewFiltering.tempFilters = { ...CatalogView.attributeFilters };
    const attributesWrapper =
      document.querySelector<HTMLDivElement>(".attribute-filters");
    if (attributesWrapper) {
      await CatalogViewFiltering.renderAttributeFilters(attributesWrapper);
    }
  },

  buildPath(): void {
    const query = this.buildQueryParams();
    const base = CatalogView.selectedCategoryKey
      ? `${PageType.catalog}/${CatalogView.selectedCategoryKey}`
      : PageType.catalog;

    const fullPath = query ? `${base}?${query}` : base;
    globalThis.location.hash = fullPath;
  },
};

export default CatalogViewFiltering;
