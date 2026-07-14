# Copy-over instructions

## Complete replacement

Use `stvcentral-main-fair-deal-v0.1.zip` when you want the whole revised repository. Extract it, then upload/commit the contents of its `stvcentral-main` folder to GitHub.

## Overlay existing repository

Use `stvcentral-fair-deal-overlay-v0.1.zip` when you want only the Fair Deal revision. Extract it directly into the root of your existing `stvcentral-main` repository and allow matching files to be replaced.

Files intentionally replaced by the overlay:

- `README.md`
- `package.json`
- `components/SiteHeader.js`
- `app/globals.css`

Everything else in the overlay is new.

## Verify after copying

```bash
npm install
npm run test:fair-deal
npm run build
```

Then run the site and open `/fair-deal`.
