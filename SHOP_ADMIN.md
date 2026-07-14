# Royal Chaos Shop Editor

The private shop editor is available at:

`/admin/shop`

It uses the same credentials and GitHub connection as the existing STV Workspace.

## What Vincent can edit

- Product name
- Numeric CAD price used by the catalogue data
- Public price label, including wording such as `+ postage`
- Availability label
- Digital or physical format
- Shop section
- Product description
- Product note
- Accessibility description for the product image
- Product image or mockup

## Product images

Accepted formats:

- PNG
- JPG / JPEG
- WEBP

The editor stores product images in:

`public/media/shop/`

Images are optional. The public shop displays a styled placeholder until an image is uploaded.

Square and portrait images work best. Keep each image under approximately 8 MB.

## Publishing flow

1. Open `/admin/shop`.
2. Enter the Vercel `ADMIN_PASSWORD`.
3. Choose a product.
4. Edit its text or price and select **Save product**.
5. Drag a mockup into the image panel and select **Upload and publish image**.
6. The API commits the change to GitHub.
7. Vercel redeploys the site automatically.

Product details and image uploads are separate actions so a large image upload does not silently overwrite catalogue copy.

## Required Vercel environment variables

- `ADMIN_PASSWORD`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

The fine-grained GitHub token needs **Contents: Read and write** permission for the repository.

## Security boundary

The editor page can be opened by URL, but every GitHub-writing API request requires the admin password. Hiding the link is not the security control; the server-side password check is.
