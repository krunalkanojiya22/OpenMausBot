const DEFAULT_BRAND = { name: "OpenMausBot" };
export const PRODUCT_NAME = "MausBot";

export function loadBrand() {
  return { brand: DEFAULT_BRAND, source: "default", file: "" } as const;
}

export function productName(): string {
  return PRODUCT_NAME;
}
