import { NextResponse } from "next/server";
import {
  authorize,
  decodeBase64,
  encodeBase64,
  getGithubFile,
  putGithubFile,
} from "../../../../../lib/githubAdmin";
import { parseShopData, serializeShopData } from "../../../../../lib/shopAdmin.mjs";

const DATA_PATH = "data/shopProducts.js";
const allowedExtensions = new Set(["png", "jpg", "jpeg", "webp"]);
const MAX_BASE64_LENGTH = 11_000_000;

export async function POST(request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id, extension, contentBase64, imageAlt } = await request.json();
    const ext = String(extension || "").toLowerCase();

    if (!id || !/^[a-z0-9-]+$/.test(id)) throw new Error("Invalid product ID.");
    if (!allowedExtensions.has(ext)) throw new Error("Use PNG, JPG, JPEG, or WEBP.");
    if (!contentBase64) throw new Error("No image was received.");
    if (contentBase64.length > MAX_BASE64_LENGTH) {
      throw new Error("Image is too large. Keep it under about 8 MB.");
    }

    const dataFile = await getGithubFile(DATA_PATH);
    if (!dataFile) throw new Error("data/shopProducts.js was not found.");

    const { products, principles } = parseShopData(decodeBase64(dataFile.content));
    const index = products.findIndex((product) => product.id === id);
    if (index < 0) throw new Error("Shop product was not found.");

    const imagePath = `public/media/shop/${id}.${ext}`;
    const existingImage = await getGithubFile(imagePath);

    await putGithubFile({
      path: imagePath,
      message: `Upload ${products[index].name} shop image from STV Shop Editor`,
      contentBase64,
      sha: existingImage?.sha,
    });

    const publicPath = `/media/shop/${id}.${ext}`;
    products[index] = {
      ...products[index],
      image: publicPath,
      imageAlt:
        typeof imageAlt === "string" && imageAlt.trim()
          ? imageAlt.trim()
          : products[index].imageAlt || `${products[index].name} product preview`,
    };

    await putGithubFile({
      path: DATA_PATH,
      message: `Connect ${products[index].name} shop image from STV Shop Editor`,
      contentBase64: encodeBase64(serializeShopData(products, principles)),
      sha: dataFile.sha,
    });

    return NextResponse.json({ ok: true, imagePath: publicPath });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
