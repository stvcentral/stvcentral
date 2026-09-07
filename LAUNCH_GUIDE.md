# Royal Chaos — ready-to-host package

## What is included

- A redesigned album homepage and searchable library with suit/rank filters.
- All 54 matching card images, public 30-second song previews, and private full MP3 recordings.
- Username/password accounts, one-time recovery codes, and persistent collections.
- Full deck, booster, and single-card purchase claims. Each code is single-account; repeat claims are safe.
- Saved card reveals, authenticated playback with seeking, and downloads.
- Owner code creation, CSV export, claim status, and cancellation of unused codes at `/owner`.
- A Docker image definition, persistent database volume, health check, backup script, and setup helper.

The three disputed song-title edits have been restored to the original repository wording. Printed song QR paths have been preserved.

## Choose the host

Use a host that runs a **single Node.js 24/Docker service with a persistent disk** and provides HTTPS/custom domains. This version uses SQLite and local audio storage. It is not a static-site upload and is not configured for ephemeral/serverless hosting or multiple replicas. Start with at least 1 GB RAM for runtime, 2 GB for building, and several GB of disk for the app and backups; monitor real traffic and bandwidth. Music downloads consume bandwidth.

The source package includes the complete recordings. Keep it private.

## Launch on a Docker host

1. Upload/extract this project on the host. Install Docker with Compose if not supplied by the host.
2. Run `npm run setup -- https://stvcentral.com` on a machine with Node 24. This creates `.env` and a random owner key. Alternatively copy `.env.example` to `.env`, set the public HTTPS origin, and replace OWNER_KEY with a cryptographically random key of at least 32 characters.
3. Keep `.env` private. Put its settings into the host's environment settings if the host does not read env files. The supplied paths are for the Docker container.
4. Run `docker compose up --build -d`. The local service is bound to `127.0.0.1:3000` for an HTTPS reverse proxy. Managed hosts may use the Dockerfile directly and route to container port 3000; mount a persistent disk at `/app/runtime`.
5. Connect `stvcentral.com` to the host and enable HTTPS. Redirect `www.stvcentral.com` to the configured origin if you use it. APP_ORIGIN must match the address customers actually visit.
6. Verify `/api/health`, create your customer account, save the recovery details, and sign out/in once.
7. Open `/owner` and enter the OWNER_KEY. Create a test single-card code, redeem it, reveal the card, seek in the full track, and download it. Confirm another account cannot reuse the code.
8. Scan a physical card and the deck redemption QR on a phone using mobile data. Confirm they reach this host and the correct song/claim page.

Do not set TRUST_PROXY=1 unless the host strips incoming spoofed forwarded headers and sets a trustworthy X-Forwarded-For header. With the default 0, authentication requests share a conservative rate limit (60 requests per 15 minutes); configure trusted proxy handling for a public launch with many visitors. Configure your proxy for a small request body limit (e.g. 32 KB) and request timeouts. The application rejects oversized JSON after reading it.

No email provider is needed. Customers must save their usernames and recovery codes. There is no email-based password reset. The site does not sell or fulfill purchases online; claim codes are included with physical sales. Existing experimental shop, admin, projects, and calculators remain in source but are outside the customer navigation. GitHub-backed content editing needs its own settings if you choose to use it later.

## Prepare products

### Optional: automatic HTTPS on your own server

The package includes Caddy for a server where you control ports 80 and 443. After running setup and pointing the domain's DNS records to the server, run:

`docker compose -f compose.yaml -f compose.public.yaml up --build -d`

This starts the app and HTTPS gateway together. The gateway replaces forwarded IP headers and enables per-client authentication rate limits. Do not place another proxy/CDN in front without reviewing that configuration. Caddy obtains and renews certificates when the domain resolves to the server and the required ports are reachable. See [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https) and [proxy header handling](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).

Use the base compose file only on managed hosts that already supply an HTTPS gateway. Do not run two gateways on the same ports.

### Claim-code batches

At `/owner`, choose:

- **Deck:** one code grants all 54 song cards.
- **Booster:** choose exactly the cards inside each pack. A batch creates multiple codes with the same contents. Create separate batches for different contents.
- **Individual card:** choose exactly one card.

Download the generated CSV before leaving the page. Full codes are shown once; only fingerprints are stored on the server. Keep the CSV private and include one code per purchase. The existing deck QR opens `/redeem`; the customer signs in and enters the unique code. Individual song QR codes continue to open `/q/...` and do not prove ownership by themselves.

Claim codes grant digital access. Duplicate cards do not produce transferable digital credits. The site does not currently support account transfers or resale of digital entitlements.

## Operate and back up

- Keep the persistent volume when rebuilding or updating. Never run `docker compose down -v` on a live store.
- Back up daily: `docker compose exec web node scripts/backup-customers.mjs /app/runtime/backup.sqlite`. Copy the resulting snapshot to a secure location off the host. Schedule this with the host's backup tools.
- Retain the matching application/media package. SQLite backup contains accounts, sessions, claim history, and collections; audio is in the package, not the database.
- To restore, stop the service, preserve the existing database files, replace the database with the validated snapshot, remove stale WAL/SHM files only while the service is stopped, then restart and test. Test restoration on a separate instance first.
- Store claim CSVs and the owner key securely. Rotate OWNER_KEY if exposed; generated customer claims remain valid.
- For a verified account-deletion request, use `node scripts/delete-customer.mjs USERNAME --confirmed-owner-request` inside the container. It anonymizes the account and removes sessions/collection while leaving redeemed codes consumed. Remove expired backups under your retention policy too.
- Keep server access logs and backup retention appropriate to your operation. The privacy page describes the implemented data use; add your business contact details before public launch if available.

## Local development

Use Node 24. Run `npm ci`, then `npm run dev`. The local default database is `runtime/customers.sqlite`; private music is `private/music`. For local owner access, add a private `.env.local` with APP_ORIGIN=http://localhost:3000 and a random OWNER_KEY. The exact origin must match the browser address. Do not use the Docker-only `/app/...` paths for a Windows development session.

Run `npm test` and `npm run build` to validate. The HTTP smoke script in `tests/customer-http.mjs` starts an isolated production server and database for end-to-end API checks after the build. It does not create real customer claim codes.

## Validation limits

Local automated tests and the Next.js production build are verified in the accompanying delivery notes. Docker/HTTPS/DNS/phone playback require the chosen host and physical-device checks; the Docker image has not been executed on this computer because Docker is unavailable. No host has been purchased, no website has been published, and no real customer accounts or sale codes are preloaded.
