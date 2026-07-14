import { shopPrinciples, shopProducts } from "../../data/shopProducts";

export const metadata = {
  title: "Royal Chaos Shop",
  description: "Planned Royal Chaos digital and physical song-card products, priced in Canadian dollars."
};

function ProductCard({ product }) {
  return (
    <article className="shop-product-card">
      <div className="shop-product-topline">
        <span className="shop-format">{product.format}</span>
        <span className="shop-availability">{product.availability}</span>
      </div>
      <div className={`shop-product-image ${product.image ? "has-image" : ""}`}>
        {product.image ? (
          <img src={product.image} alt={product.imageAlt || `${product.name} preview`} />
        ) : (
          <div aria-hidden="true">
            <span>RC</span>
            <small>Product image coming soon</small>
          </div>
        )}
      </div>
      <h2>{product.name}</h2>
      <p className="shop-price">{product.priceLabel}</p>
      <p className="shop-description">{product.description}</p>
      <p className="shop-note">{product.note}</p>
      <button className="shop-coming-soon" type="button" disabled>
        Checkout coming soon
      </button>
    </article>
  );
}

export default function ShopPage() {
  const digitalProducts = shopProducts.filter(product => product.category === "Digital first");
  const physicalProducts = shopProducts.filter(product => product.category === "Physical release");

  return (
    <main className="page-shell shop-page">
      <header className="page-heading shop-heading">
        <p className="eyebrow">ROYAL CHAOS SHOP · PLANNED LAUNCH PRICES</p>
        <h1>Choose the way you want to collect the music.</h1>
        <p>
          Digital products launch first. Physical cards will follow once printing, packaging,
          postage and fulfilment have been tested. Checkout is not active yet.
        </p>
      </header>

      <section className="shop-explainer" aria-labelledby="shop-model-heading">
        <div>
          <p className="eyebrow">THE OFFER</p>
          <h2 id="shop-model-heading">The cards carry the music with them.</h2>
        </div>
        <p>
          When a physical card is purchased, its matching song and digital card are included at
          no additional charge. Random boosters offer surprise. Custom boosters and the complete
          deck offer certainty.
        </p>
      </section>

      <section className="shop-section" aria-labelledby="digital-products-heading">
        <div className="shop-section-heading">
          <div>
            <p className="eyebrow">AVAILABLE FIRST</p>
            <h2 id="digital-products-heading">Digital collection</h2>
          </div>
          <p>No postage. Final delivery details will be published before checkout opens.</p>
        </div>
        <div className="shop-grid">
          {digitalProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="shop-section" aria-labelledby="physical-products-heading">
        <div className="shop-section-heading">
          <div>
            <p className="eyebrow">COMING AFTER PRODUCTION TESTING</p>
            <h2 id="physical-products-heading">Physical collection</h2>
          </div>
          <p>Postage is separate. Physical prices remain visible while manufacturing is prepared.</p>
        </div>
        <div className="shop-grid">
          {physicalProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="shop-principles" aria-labelledby="shop-principles-heading">
        <p className="eyebrow">SHOP PRINCIPLES</p>
        <h2 id="shop-principles-heading">What these prices mean</h2>
        <ul>
          {shopPrinciples.map(principle => <li key={principle}>{principle}</li>)}
        </ul>
      </section>
    </main>
  );
}
