# STV Central — JavaScript build

This version removes TypeScript entirely to avoid the Vercel dependency issue.

Permanent first-song path:

`/song/2voices1fire`

## Kingdom Fair Deal v0.1

The repository now includes an energy-first Fair Deal prototype at:

`/fair-deal`

It is intentionally separate from the existing KingdomWatt calculator at `/kingdomwatts/calculator`.

Run the constitutional calculation tests with:

```bash
npm run test:fair-deal
```

Read the integration summary in [`FAIR_DEAL_INTEGRATION.md`](./FAIR_DEAL_INTEGRATION.md) and the full protocol in [`docs/fair-deal/protocol-v0.1.md`](./docs/fair-deal/protocol-v0.1.md).

## Royal Chaos shop catalogue

The planned digital-first and physical product ladder is visible at:

`/shop`

Prices and product copy are centralized in [`data/shopProducts.js`](./data/shopProducts.js). Checkout remains disabled until payment and fulfilment are implemented. See [`SHOP_PRICING.md`](./SHOP_PRICING.md).

The private shop editor is available at `/admin/shop`. It can update catalogue copy, planned prices, and optional product or mockup images through the existing GitHub-backed admin system. See [`SHOP_ADMIN.md`](./SHOP_ADMIN.md).

## Royal Chaos short QR links

Physical cards can use compact URLs such as `/q/3h`. The dynamic redirect
layer resolves all 54 card codes to their existing song pages. See
[`QR_REDIRECTS.md`](QR_REDIRECTS.md).
