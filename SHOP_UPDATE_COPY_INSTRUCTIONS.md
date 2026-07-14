# Royal Chaos shop update — copy instructions

Extract the overlay ZIP into the root of the existing STV Central repository and allow matching files to be replaced.

## Added

- `app/shop/page.js`
- `data/shopProducts.js`
- `SHOP_PRICING.md`
- `SHOP_UPDATE_COPY_INSTRUCTIONS.md`

## Modified

- `components/SiteHeader.js`
- `app/page.js`
- `app/globals.css`
- `README.md`

## Verify

```bash
npm install
npm run test:fair-deal
npm run build
```

Then deploy and open `/shop`.
