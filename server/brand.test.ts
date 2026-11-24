import { expect, it } from "vitest";
import { loadBrand, productName } from "./brand.ts";

it("keeps the default brand response and product name", () => {
  expect(loadBrand()).toEqual({ brand: { name: "OpenMausBot" }, source: "default", file: "" });
  expect(productName()).toBe("MausBot");
});
