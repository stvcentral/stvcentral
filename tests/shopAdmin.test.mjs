import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  applyShopProductPatch,
  parseShopData,
  serializeShopData,
} from "../lib/shopAdmin.mjs";

const source = fs.readFileSync(new URL("../data/shopProducts.js", import.meta.url), "utf8");

test("parses and serializes the shop catalogue without losing products", () => {
  const parsed = parseShopData(source);
  assert.equal(parsed.products.length, 8);
  assert.equal(parsed.principles.length, 5);

  const roundTrip = parseShopData(serializeShopData(parsed.products, parsed.principles));
  assert.deepEqual(roundTrip, parsed);
});

test("updates editable product fields while preserving the image", () => {
  const product = {
    id: "test-product",
    name: "Old name",
    priceCad: 2,
    priceLabel: "CAD $2",
    image: "/media/shop/test-product.webp",
  };

  const updated = applyShopProductPatch(product, {
    name: "New name",
    priceCad: "12.99",
    priceLabel: "CAD $12.99 + postage",
  });

  assert.equal(updated.name, "New name");
  assert.equal(updated.priceCad, 12.99);
  assert.equal(updated.image, product.image);
});

test("rejects negative shop prices", () => {
  assert.throws(
    () => applyShopProductPatch({ priceCad: 2 }, { priceCad: -1 }),
    /non-negative/,
  );
});
