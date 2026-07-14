# STV Editor setup

After deployment, add these Environment Variables in Vercel:

- `ADMIN_PASSWORD`
- `GITHUB_TOKEN`
- `GITHUB_OWNER = stvcentral`
- `GITHUB_REPO = stvcentral`
- `GITHUB_BRANCH = main`

The GitHub token must be fine-grained and have:

- **Contents: Read and write**

Then redeploy and open:

- `/admin` — private administration hub
- `/workspace` — songs, lyrics, metadata, stories, and card artwork
- `/admin/shop` — shop products, prices, descriptions, and product/mockup images

The shop editor uses the same password and GitHub token as the song workspace. See [`SHOP_ADMIN.md`](./SHOP_ADMIN.md).
