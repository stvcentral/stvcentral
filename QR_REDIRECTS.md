# Royal Chaos short QR redirects

The physical-card QR codes use permanent short paths:

```text
https://stvcentral.com/q/3h
```

The dynamic route at `app/q/[code]/route.js` looks up the card in
`data/songs.js` and redirects to its existing song page:

```text
/q/3h -> /song/2voices1fire
```

## Why redirects are used

- Printed QR codes remain short and easy to scan.
- Existing song pages do not need to be renamed.
- A future song-page slug can be changed in `data/songs.js` without reprinting
  the physical card.
- Redirects use HTTP 307 so browsers do not permanently cache an old song
  destination.

## Code compatibility

Lookup is case insensitive. Spaces, hyphens, and underscores are ignored, so
both the existing Joker QR URL and the cleaner future form work:

```text
/q/joker%201
/q/joker-1
/q/joker1
```

All three resolve to `/song/flowstate`.

The public mapping is stored in:

```text
public/royal-chaos-short-qr-manifest.csv
```

## Test

```bash
npm run test:qr
```
