# Pre-launch shortcut bar

The site now displays a small shortcut bar on every page with direct links to:

- `/admin`
- `/kingdomwatts/calculator`
- `/fair-deal`

The bar is visible by default, including on Vercel Production deployments, so the current working deployment can be navigated without typing routes manually.

## Hide the bar at public launch

In Vercel:

1. Open the project.
2. Go to **Settings → Environment Variables**.
3. Add `NEXT_PUBLIC_SITE_LIVE` with the value `true`.
4. Apply it to **Production**.
5. Redeploy the Production deployment.

The shortcut bar will disappear after the new build.

Setting this flag only hides the navigation bar. It does not delete or secure the underlying routes. The Admin area should eventually use proper authentication before a broad public launch.
