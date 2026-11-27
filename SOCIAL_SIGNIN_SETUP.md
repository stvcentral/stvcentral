# Social sign-in: activation checklist

Implementation prepared for Google, Facebook and Apple. Disabled by default. A Facebook Page alone does not configure Facebook Login. No developer accounts, paid memberships or provider secrets were created by this change.

## Storage and deployment

The current account store is SQLite. Keep `CUSTOMER_STORAGE_READY=0` on Vercel unless the account store has been replaced with durable storage. A writable temporary serverless directory is not durable storage. Home hosting can use a persistent disk, HTTPS and backups. Do not activate social login on disposable preview storage.

Set a canonical HTTPS `APP_ORIGIN`, with no path or query. Back up the existing customer database before deployment. The change adds `social_identities`, `social_attempts` and `social_completions` tables; it does not change existing customer IDs, passwords or card ownership. Pending attempts expire after ten minutes; Apple completion tickets after one minute. Periodic backups must remain private because they include account data and short-lived authentication state.

## Provider setup

Use separate test and production applications/credentials. Store secrets only in the hosting environment, never in GitHub, chat, client code or public variables.

| Provider | Required server configuration | Production return URL |
| --- | --- | --- |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` from a Web application OAuth client; configure consent screen and authorized domain | `https://stvcentral.com/api/social/google/callback` |
| Facebook | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, supported `FACEBOOK_GRAPH_VERSION`; configure Facebook Login for the website, exact valid redirect, privacy and data-deletion instructions, and app availability for real users | `https://stvcentral.com/api/social/facebook/callback` |
| Apple | Services ID as `APPLE_CLIENT_ID`, team ID, key ID, private PKCS#8 key; associate the website with a primary App ID enabled for Sign in with Apple | `https://stvcentral.com/api/social/apple/callback` |

Apple developer eligibility/membership must be checked before any purchase. Do not assume an ordinary Apple account or an iCloud subscription provides the required web configuration. Obtain owner approval before any fee or binding agreement.

Facebook's current manual-flow documentation uses Graph API v27.0; confirm the version supported by the new application when provisioning. Complete the provider's required review, branding, domain verification and deletion requirements before public activation. Replace the provisional text buttons with provider-approved branding if required for review. No permission to publish, read contacts or obtain email is requested; Facebook's basic public profile is required by that service.

Official references:
- https://developers.google.com/identity/openid-connect/openid-connect
- https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow
- https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web

## Identity and existing collections

Login uses `(provider, verified subject)`, never an email address or display name. Tokens are verified server-side; provider tokens are not retained. A new social-only account receives a generated collector username, with no known password or recovery code. Its recovery is handled through the provider.

Existing collectors must sign in with their current method first, then explicitly connect a provider in the account screen. The original session must still be valid when linking completes. The same identity cannot be attached to two collections. Automatic email-based merging is intentionally absent. There is no disconnect button yet; do not remove a user's only login method. Account deletion must remove the customer and its identity records, and follow each provider's revocation/deletion requirements. Finish the owner deletion workflow and provider-specific compliance checks before enabling for the public.

Apple sends a cross-site POST. A Secure, HttpOnly, SameSite=None browser-binding cookie protects it, followed by a one-use same-origin completion redirect so the normal SameSite=Lax collection session can be validated. No account data or provider tokens are placed in that redirect.

## Required live acceptance test before enabling

1. Verify durable account storage survives a restart/redeployment and test backup recovery.
2. Configure each provider in its console and use exact HTTPS callback URLs for the test environment.
3. Enable `CUSTOMER_STORAGE_READY=1` and `SOCIAL_LOGIN_ENABLED=1` only on the prepared test deployment.
4. For every configured provider: create an account, sign out/in, cancel consent, exercise expired state and cookies denied, claim a test card, and confirm ownership after another login.
5. Link a provider from an existing collection, then sign in through it and confirm all existing cards remain. Confirm linking fails if the initial session has ended or the provider already belongs to another collector.
6. Test Apple on Safari and mobile, including private-email users; Facebook with a non-developer user after its production approval; Google with an external test user. Test recovery at each provider.
7. Verify the deletion/revocation process, provider button branding and privacy notice. Then enable only the verified providers in production.

Buttons appear only for providers with complete configuration and both enable flags. Existing username/password login remains available. Public activation and real provider round trips remain blocked until the owner completes the developer registrations and permanent storage is ready.
