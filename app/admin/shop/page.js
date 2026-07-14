"use client";

import { useEffect, useMemo, useState } from "react";
import PrivateNav from "../../../components/PrivateNav";
import { shopProducts as initialProducts } from "../../../data/shopProducts";

function cloneProduct(product) {
  return product ? { ...product } : null;
}

export default function ShopAdminPage() {
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id || "");
  const [product, setProduct] = useState(cloneProduct(initialProducts[0]));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialProducts[0]?.image || "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("stv-admin-password");
    if (saved) setPassword(saved);
  }, []);

  const selectedIndex = useMemo(
    () => products.findIndex((item) => item.id === selectedId),
    [products, selectedId],
  );

  function rememberPassword(value) {
    setPassword(value);
    sessionStorage.setItem("stv-admin-password", value);
  }

  function chooseProduct(id) {
    const next = products.find((item) => item.id === id);
    if (!next) return;
    setSelectedId(id);
    setProduct(cloneProduct(next));
    setImageFile(null);
    setImagePreview(next.image || "");
    setStatus("");
  }

  function updateField(field, value) {
    setProduct((current) => ({ ...current, [field]: value }));
  }

  function replaceLocalProduct(nextProduct) {
    setProducts((current) =>
      current.map((item) => (item.id === nextProduct.id ? nextProduct : item)),
    );
    setProduct(cloneProduct(nextProduct));
  }

  async function saveProduct() {
    if (!product || !password || busy) return;
    setBusy(true);
    setStatus("Saving product details...");

    try {
      const response = await fetch("/api/admin/shop/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          id: product.id,
          patch: {
            category: product.category,
            name: product.name,
            priceCad: Number(product.priceCad),
            priceLabel: product.priceLabel,
            format: product.format,
            description: product.description,
            availability: product.availability,
            note: product.note,
            imageAlt: product.imageAlt,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      replaceLocalProduct(result.product);
      setStatus("Product saved to GitHub. Vercel will redeploy automatically.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage() {
    if (!product || !imageFile || !password || busy) return;
    setBusy(true);
    setStatus("Uploading product image...");

    try {
      const contentBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const extension = imageFile.name.split(".").pop()?.toLowerCase() || "png";
      const response = await fetch("/api/admin/shop/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          id: product.id,
          extension,
          contentBase64,
          imageAlt: product.imageAlt,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");

      const nextProduct = { ...product, image: result.imagePath };
      replaceLocalProduct(nextProduct);
      setImagePreview(result.imagePath);
      setImageFile(null);
      setStatus("Image uploaded and connected. Vercel will redeploy automatically.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  function selectImage(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Please choose a PNG, JPG, JPEG, or WEBP image.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleDrop(event) {
    event.preventDefault();
    selectImage(event.dataTransfer.files?.[0]);
  }

  function moveSelection(direction) {
    if (!products.length) return;
    const index = selectedIndex < 0 ? 0 : selectedIndex;
    const next = products[(index + direction + products.length) % products.length];
    chooseProduct(next.id);
  }

  if (!product) return null;

  return (
    <>
      <PrivateNav />
      <main className="shop-admin">
        <header className="shop-admin-header">
          <div>
            <p className="eyebrow">PRIVATE SHOP WORKSPACE</p>
            <h1>Royal Chaos Shop Editor</h1>
            <p>Edit catalogue copy, planned prices, and product or mock-product images.</p>
          </div>

          <div className="shop-admin-actions">
            <label>
              Admin password
              <input
                type="password"
                value={password}
                onChange={(event) => rememberPassword(event.target.value)}
                placeholder="Set in Vercel"
              />
            </label>
            <button onClick={saveProduct} disabled={!password || busy}>
              {busy ? "Working..." : "Save product"}
            </button>
          </div>
        </header>

        <section className="shop-admin-notice">
          <strong>Changes commit directly to GitHub.</strong>
          <span>They become public after Vercel finishes the redeployment.</span>
        </section>

        <div className="shop-admin-layout">
          <aside className="shop-admin-list" aria-label="Shop products">
            <p className="eyebrow">PRODUCTS</p>
            {products.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === selectedId ? "active" : ""}
                onClick={() => chooseProduct(item.id)}
              >
                <span>{item.name}</span>
                <small>{item.priceLabel}</small>
              </button>
            ))}
          </aside>

          <section className="shop-admin-editor">
            <div className="shop-admin-title-row">
              <div>
                <p className="eyebrow">{product.format} · {product.category}</p>
                <h2>{product.name}</h2>
              </div>
              <div className="shop-admin-next-controls">
                <button type="button" onClick={() => moveSelection(-1)}>← Previous</button>
                <button type="button" onClick={() => moveSelection(1)}>Next →</button>
              </div>
            </div>

            <div className="shop-admin-fields">
              <label>
                Product name
                <input value={product.name} onChange={(event) => updateField("name", event.target.value)} />
              </label>
              <label>
                Numeric price in CAD
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.priceCad}
                  onChange={(event) => updateField("priceCad", event.target.value)}
                />
              </label>
              <label>
                Public price label
                <input
                  value={product.priceLabel}
                  onChange={(event) => updateField("priceLabel", event.target.value)}
                  placeholder="CAD $10 + postage"
                />
              </label>
              <label>
                Availability label
                <input
                  value={product.availability}
                  onChange={(event) => updateField("availability", event.target.value)}
                />
              </label>
              <label>
                Format
                <select value={product.format} onChange={(event) => updateField("format", event.target.value)}>
                  <option value="Digital">Digital</option>
                  <option value="Physical">Physical</option>
                </select>
              </label>
              <label>
                Shop section
                <select value={product.category} onChange={(event) => updateField("category", event.target.value)}>
                  <option value="Digital first">Digital first</option>
                  <option value="Physical release">Physical release</option>
                </select>
              </label>
              <label className="shop-admin-wide">
                Product description
                <textarea
                  value={product.description}
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </label>
              <label className="shop-admin-wide">
                Product note
                <textarea value={product.note} onChange={(event) => updateField("note", event.target.value)} />
              </label>
              <label className="shop-admin-wide">
                Image description for accessibility
                <input
                  value={product.imageAlt || ""}
                  onChange={(event) => updateField("imageAlt", event.target.value)}
                  placeholder="Describe the product or mockup"
                />
              </label>
            </div>
          </section>

          <aside className="shop-admin-image-panel">
            <div>
              <p className="eyebrow">PRODUCT IMAGE</p>
              <h2>Drop a product or mockup</h2>
            </div>

            <div
              className="shop-admin-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <img src={imagePreview} alt={product.imageAlt || `${product.name} preview`} />
              ) : (
                <div>
                  <span>＋</span>
                  <p>Drop an image here</p>
                  <small>PNG, JPG, JPEG, or WEBP</small>
                </div>
              )}
            </div>

            <label className="shop-admin-file-button">
              Choose image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => selectImage(event.target.files?.[0])}
              />
            </label>

            <button
              className="shop-admin-upload-button"
              type="button"
              onClick={uploadImage}
              disabled={!password || !imageFile || busy}
            >
              Upload and publish image
            </button>

            <p className="shop-admin-file-name">{imageFile?.name || "No new image selected"}</p>
            <small>Use a clean product crop. Square or portrait images work best in the shop cards.</small>
          </aside>
        </div>

        {status && <div className="studio-toast">{status}</div>}
      </main>
    </>
  );
}
