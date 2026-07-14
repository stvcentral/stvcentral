# Copy-over instructions — Shop Editor v0.4

1. Extract `stvcentral-shop-admin-overlay-v0.4.zip`.
2. Copy everything inside it into the root of the existing GitHub repository.
3. Allow matching files to be replaced.
4. Commit the changes to `main`.
5. Wait for Vercel to redeploy.
6. Open `/admin/shop`.

Suggested commit title:

`Add GitHub-backed Royal Chaos shop editor`

The shop editor uses the same Vercel variables as the existing song workspace. No new secret is required when these are already configured:

- `ADMIN_PASSWORD`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
