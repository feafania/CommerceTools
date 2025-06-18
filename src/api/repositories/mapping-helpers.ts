import {
  Asset,
  Attribute,
  AttributeDefinition,
  Cart,
  Category,
  CategoryReference,
  Customer,
  DiscountCode,
  MyCustomerDraft,
  Price,
  ProductProjection,
  ProductType,
} from "@commercetools/platform-sdk";

import {
  InAddress,
  InAttributeDefinition,
  InCart,
  InCartDiscount,
  InCategory,
  InCustomer,
  InDiscountCode,
  InLineItem,
  InProduct,
  InProductType,
  InVariant,
} from "@/types/interfaces";
import {
  GetProductListParameters,
  InAttributes,
  LanguageCode,
  LanguageVariants,
  SimpleAttributes,
  StringRecords,
} from "@/types/types";
import { SETTINGS } from "@/config/settings";
import {
  AddressType,
  AttributeKeys,
  CountryCode,
  CurrencyCode,
  InAttributeTypeValues,
  SortName,
} from "@/types/enum";
import { findDefaultAddressIndex, localizeName } from "@/utils/helpers";

const MappingHelpers = {
  mapProductToInternal(
    product: ProductProjection,
    currency: CurrencyCode = SETTINGS.currentCurrency,
  ): InProduct {
    const masterPrices = product.masterVariant?.prices ?? [];
    const { price, discountedPrice, currencyCode, isDiscounted } =
      this.getPriceByCurrency(masterPrices, currency);

    return {
      id: product.id,
      key: product.key,
      name: this.mapLocalizedField(product.name),
      description: this.mapLocalizedField(product.description),
      images: product.masterVariant?.images ?? [],
      price,
      discountedPrice,
      isDiscounted,
      discountPercent: this.calculateDiscountPercent(price, discountedPrice),
      currencyCode,
      variantId: product.masterVariant?.id,
      available: product.masterVariant?.availability?.isOnStock ?? false,
      attributes:
        this.mapAttributesArray(product.masterVariant?.attributes) ?? {},
      sku: product.masterVariant?.sku,
      categories:
        product.categories?.map((cat: CategoryReference) => cat.id) ?? [],
      variants:
        product.variants?.map((variant) => {
          const variantPrices = variant.prices ?? [];
          const {
            price: vPrice,
            discountedPrice: vDiscountedPrice,
            currencyCode: vCurrencyCode,
            isDiscounted: vIsDiscounted,
          } = this.getPriceByCurrency(variantPrices, currency);

          return {
            id: variant.id,
            sku: variant.sku,
            images:
              (variant.images && variant.images.length > 0
                ? variant.images
                : product.masterVariant?.images) ?? [],
            price: vPrice,
            discountedPrice: vDiscountedPrice,
            isDiscounted: vIsDiscounted,
            discountPercent: this.calculateDiscountPercent(
              vPrice,
              vDiscountedPrice,
            ),
            currencyCode: vCurrencyCode,
            available: variant.availability?.isOnStock ?? false,
            attributes: this.mapAttributesArray(variant.attributes ?? []),
          };
        }) ?? [],
      productTypeKey: product.productType?.obj?.key,
    };
  },

  mapAsset(asset: Asset): InCategory["assets"][number] {
    return {
      id: asset.id,
      key: asset.key,
      name: this.mapLocalizedField(asset.name),
      description: this.mapLocalizedField(asset.description),
      sources: asset.sources.map((source) => ({
        key: source.key,
        uri: source.uri,
        dimensions: source.dimensions,
        contentType: source.contentType,
      })),
    };
  },

  mapCategoryToInternal(category: Category): InCategory {
    const localAsset = {
      id: `${category.id}-local`,
      key: `${category.key}-local`,
      sources: [
        {
          uri: `assets/img/categories/${category.key}.png`,
          contentType: "image/png",
        },
      ],
      name: category.name,
      description: category.description,
    };

    const mappedAssets = category.assets?.length
      ? category.assets.map((asset) => this.mapAsset(asset))
      : [];

    return {
      id: category.id,
      key: category.key,
      name: this.mapLocalizedField(category.name),
      description: this.mapLocalizedField(category.description),
      assets: [localAsset, ...mappedAssets],
      parentId: category.parent?.id,
      children: [],
    };
  },

  mapAttributesArray(attributes: Attribute[] = []): InAttributes {
    return attributes.reduce((accumulator, attribute) => {
      accumulator[attribute.name] = attribute.value;
      return accumulator;
    }, {} as InAttributes);
  },

  mapProductTypeToInternal(productType: ProductType): InProductType {
    return {
      id: productType.id,
      key: productType.key,
      name: productType.name,
      description: productType.description,
      attributes: productType.attributes
        ? productType.attributes.map((attribute) =>
            this.mapAttributeDefinitionToInternal(attribute),
          )
        : [],
    };
  },

  mapAttributeDefinitionToInternal(
    attributeDefinition: AttributeDefinition,
  ): InAttributeDefinition {
    const isEnumType =
      attributeDefinition.type.name === InAttributeTypeValues.Enum ||
      attributeDefinition.type.name === InAttributeTypeValues.Lenum;

    const type = isEnumType
      ? {
          name: attributeDefinition.type.name as InAttributeTypeValues,
          values: attributeDefinition.type.values.map((v) => ({
            key: v.key,
            label: v.label,
          })),
        }
      : undefined;

    return {
      name: attributeDefinition.name,
      label: attributeDefinition.label,
      type,
      required: attributeDefinition.isRequired,
      isSearchable: attributeDefinition.isSearchable,
    };
  },

  mapLocalizedField(field?: StringRecords): LanguageVariants {
    return (field ?? {}) as unknown as Record<LanguageCode, string>;
  },

  calculateDiscountPercent(
    price?: number,
    discounted?: number | undefined,
  ): number | undefined {
    if (price && discounted !== undefined && price > 0) {
      return Math.round(((price - discounted) / price) * 100);
    }
    return undefined;
  },

  getPriceByCurrency(prices: Price[] = [], currency: string) {
    const priceObject = prices.find((p) => p.value?.currencyCode === currency);

    if (!priceObject?.value)
      return {
        price: 0,
        discountedPrice: undefined,
        currencyCode: currency,
        isDiscounted: false,
      };

    const centAmount = priceObject.value.centAmount ?? 0;
    const discounted = priceObject.discounted?.value?.centAmount;
    const isDiscounted = !!priceObject.discounted;

    return {
      price: centAmount,
      discountedPrice: discounted,
      currencyCode: priceObject.value.currencyCode,
      isDiscounted,
    };
  },
  updateCustomer(oldCustomer: InCustomer, newCustomer: Customer): InCustomer {
    return {
      version: newCustomer.version,
      id: newCustomer.id,
      email: newCustomer.email,
      password: oldCustomer.password,
      firstName: newCustomer.firstName ?? "",
      lastName: newCustomer.lastName ?? "",
      dateOfBirth: newCustomer.dateOfBirth ?? "",

      addresses: newCustomer.addresses.map(
        (address): InAddress => ({
          id: address.id,
          key: address.key ?? "",
          streetName: address.streetName ?? "",
          streetNumber: address.streetNumber ?? "",
          postalCode: address.postalCode ?? "",
          city: address.city ?? "",
          country: address.country ?? "",
          isDefaultShipping:
            newCustomer.defaultShippingAddressId === address.id,
          isDefaultBilling: newCustomer.defaultBillingAddressId === address.id,
        }),
      ),
    };
  },

  toMyCustomerDraft(input: InCustomer): MyCustomerDraft {
    const addresses = input.addresses ?? [];

    const defaultBillingIndex = findDefaultAddressIndex(
      input,
      AddressType.Billing,
    );
    const defaultShippingIndex = findDefaultAddressIndex(
      input,
      AddressType.Shipping,
    );

    return {
      email: input.email,
      password: input.password || "",
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth,
      addresses:
        addresses.length > 0
          ? addresses.map((address) => ({
              key: address.key,
              streetName: address.streetName,
              streetNumber: address.streetNumber ?? "",
              postalCode: address.postalCode,
              city: address.city,
              country: address.country ?? "",
            }))
          : undefined,
      defaultBillingAddress:
        addresses.length > 0 && defaultBillingIndex !== -1
          ? defaultBillingIndex
          : undefined,
      defaultShippingAddress:
        addresses.length > 0 && defaultShippingIndex !== -1
          ? defaultShippingIndex
          : undefined,
    };
  },

  toInternalCustomer(
    customer: Customer,
    password: string | undefined,
  ): InCustomer {
    const addresses = customer.addresses.map((addr) => {
      const isDefaultBilling = addr.id === customer.defaultBillingAddressId;
      const isDefaultShipping = addr.id === customer.defaultShippingAddressId;

      return {
        id: addr.id,
        key: addr.key,
        streetName: addr.streetName,
        streetNumber: addr.streetNumber,
        postalCode: addr.postalCode,
        city: addr.city,
        country: addr.country,
        isDefaultBilling,
        isDefaultShipping,
      };
    }) as InAddress[];

    return {
      version: customer.version,
      id: customer.id,
      email: customer.email,
      password,
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      dateOfBirth: customer.dateOfBirth ?? "",
      addresses,
    };
  },
  mapToProductListParameters(
    parameters: GetProductListParameters,
  ): GetProductListParameters {
    const {
      limit = SETTINGS.productListParameters.limit,
      offset = SETTINGS.productListParameters.offset,
      sortName = SETTINGS.productListParameters.sortName,
      sortDirection = SETTINGS.productListParameters.sortDirection,
      searchText,
      filters,
    } = parameters;

    let sortField: string;

    switch (sortName) {
      case SortName.NAME: {
        sortField = `name.${SETTINGS.currentLang}`;
        break;
      }
      default: {
        sortField = SortName.PRICE;
        break;
      }
    }

    return {
      limit,
      offset,
      sortName: sortField,
      sortDirection,
      searchText,
      filters,
    };
  },

  toInternalCart(cart: Cart): InCart {
    return {
      id: cart.id,
      version: cart.version,
      currency: cart.totalPrice.currencyCode as CurrencyCode,
      lineItems: cart.lineItems.map(
        (item): InLineItem => ({
          id: item.id,
          productId: item.productId,
          name: item.name as LanguageVariants,
          quantity: item.quantity,
          price: item.price.value.centAmount,
          totalPrice: item.totalPrice.centAmount,
          variantId: item.variant.id,
          sku: item.variant.sku,
          image: item.variant.images?.[0]?.url,
        }),
      ),
      totalPrice: cart.totalPrice.centAmount,
      subtotalPrice: cart.lineItems.reduce(
        (sum, item) => sum + item.price.value.centAmount * item.quantity,
        0,
      ),
      createdAt: cart.createdAt,
      customerId: cart.customerId,
      anonymousId: cart.anonymousId,
      country: cart.country as CountryCode,
    };
  },

  toInternalDiscountCode(code: DiscountCode): InDiscountCode {
    return {
      id: code.id,
      code: code.code,
      key: code.key,
      name: code.name,
      description: code.description,
      isActive: code.isActive,
      maxApplications: code.maxApplications,
      maxApplicationsPerCustomer: code.maxApplicationsPerCustomer,
      cartPredicate: code.cartPredicate,
      groups: code.groups,
      cartDiscounts: code.cartDiscounts
        ?.map((cd) => {
          const object = cd.obj;
          return object
            ? {
                id: object.id,
                name: object.name,
                description: object.description,
                validFrom: object.validFrom,
                validUntil: object.validUntil,
                isActive: object.isActive,
              }
            : undefined;
        })
        .filter(Boolean) as InCartDiscount[],
    };
  },

  mapFilters(filter: SimpleAttributes): string[] {
    const filterKey = Object.keys(filter)[0];
    if (!filterKey) return [""];

    const filterValue = filter[filterKey];
    if (typeof filterValue === "number") {
      switch (filterKey) {
        case AttributeKeys.MinPrice: {
          return [`variants.price.centAmount:range(${filterValue * 100} to*)`];
        }
        case AttributeKeys.MaxPrice: {
          return [`variants.price.centAmount:range(* to ${filterValue * 100})`];
        }
      }
    }

    if (typeof filterValue === "object" && filterValue !== null) {
      if (Array.isArray(filterValue)) {
        const joined = filterValue.map((v) => `"${v}"`).join(",");
        return [`variants.attributes.${filterKey}.key:${joined}`];
      } else {
        const result = [];
        for (const [key, value] of Object.entries(filterValue)) {
          if (Array.isArray(value)) {
            const joined = value.map((v) => `"${v}"`).join(",");
            result.push(`variants.attributes.${key}.key:${joined}`);
          } else if (value !== null) {
            result.push(`variants.attributes.${key}.key:"${value}"`);
          }
        }
        return result;
      }
    }
    if (typeof filterValue === "string" || typeof filterValue === "boolean") {
      return [`variants.attributes.${filterKey}.key:"${filterValue}"`];
    }

    return [""];
  },

  getVariantDescription(
    variant: InVariant | InProduct,
    productType: InProductType | undefined,
  ): string {
    if (!variant.attributes) return SETTINGS.label.product.defaultVariant;

    try {
      const attributes: string[] = [];

      for (const [key, value] of Object.entries(variant.attributes)) {
        const attributeDefinition: InAttributeDefinition | undefined =
          productType?.attributes.find((attribute) => attribute.name === key);

        const attributeLabel =
          attributeDefinition?.label?.[SETTINGS.currentLang] ?? key;

        if (typeof value === "object" && value !== null && "label" in value) {
          const labelValue = value.label;

          if (typeof labelValue === "object" && labelValue !== null) {
            const localized = localizeName(labelValue);
            if (localized) attributes.push(`${attributeLabel}: ${localized}`);
          } else if (typeof labelValue === "string") {
            attributes.push(`${attributeLabel}: ${labelValue}`);
          }
        }
      }
      return attributes.join(", ") || SETTINGS.label.product.defaultVariant;
    } catch {
      return SETTINGS.label.product.defaultVariant;
    }
  },
};

export default MappingHelpers;
// `masterVariant.prices.value.centAmount`
