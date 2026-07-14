const PRODUCTS_PATTERN = /export const shopProducts = (\[[\s\S]*?\]);\s*export const shopPrinciples =/;
const PRINCIPLES_PATTERN = /export const shopPrinciples = (\[[\s\S]*?\]);\s*$/;

export function parseShopData(source) {
  const productsMatch = source.match(PRODUCTS_PATTERN);
  const principlesMatch = source.match(PRINCIPLES_PATTERN);
  if (!productsMatch || !principlesMatch) {
    throw new Error("Could not parse data/shopProducts.js");
  }
  return {
    products: JSON.parse(productsMatch[1]),
    principles: JSON.parse(principlesMatch[1]),
  };
}

export function serializeShopData(products, principles) {
  return [
    `export const shopProducts = ${JSON.stringify(products, null, 2)};`,
    "",
    `export const shopPrinciples = ${JSON.stringify(principles, null, 2)};`,
    "",
  ].join("\n");
}

export function applyShopProductPatch(product, patch = {}) {
  const nextPrice = Number(patch.priceCad);
  if (!Number.isFinite(nextPrice) || nextPrice < 0) {
    throw new Error("Price must be a non-negative number.");
  }

  const text = (key, fallback = "") => {
    const value = patch[key];
    return typeof value === "string" ? value.trim() : fallback;
  };

  return {
    ...product,
    category: text("category", product.category),
    name: text("name", product.name),
    priceCad: nextPrice,
    priceLabel: text("priceLabel", product.priceLabel),
    format: text("format", product.format),
    description: text("description", product.description),
    availability: text("availability", product.availability),
    note: text("note", product.note),
    imageAlt: text("imageAlt", product.imageAlt || `${product.name} preview`),
  };
}
