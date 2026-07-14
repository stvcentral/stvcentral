import { NextResponse } from "next/server";
import {
  authorize,
  decodeBase64,
  encodeBase64,
  getGithubFile,
  putGithubFile,
} from "../../../../../lib/githubAdmin";
import {
  applyShopProductPatch,
  parseShopData,
  serializeShopData,
} from "../../../../../lib/shopAdmin.mjs";

const DATA_PATH = "data/shopProducts.js";

export async function POST(request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id, patch } = await request.json();
    if (!id || typeof id !== "string") throw new Error("A product ID is required.");

    const file = await getGithubFile(DATA_PATH);
    if (!file) throw new Error("data/shopProducts.js was not found.");

    const { products, principles } = parseShopData(decodeBase64(file.content));
    const index = products.findIndex((product) => product.id === id);
    if (index < 0) throw new Error("Shop product was not found.");

    products[index] = applyShopProductPatch(products[index], patch);

    await putGithubFile({
      path: DATA_PATH,
      message: `Edit ${products[index].name} from STV Shop Editor`,
      contentBase64: encodeBase64(serializeShopData(products, principles)),
      sha: file.sha,
    });

    return NextResponse.json({ ok: true, product: products[index] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
