# KingdomWatt Project Calculator — v6

## Added
- Project name, type, creator/team, description, and evidence fields.
- External Investment input for donations, Ko-fi, Patreon, grants, sponsorships, crowdfunding, and gifts.
- External Investment normalized through the selected Energy Exchange Reference.
- Mutually exclusive Machine Library and Custom Total modes to prevent double-counting.
- Energy Exchange Reference section with browser geolocation permission and supported regional references.
- Finalize Project action that freezes a reviewable draft.
- Rule-based arithmetic, plausibility, and double-counting pre-check.

## Preserved
- Human Contribution Coefficient remains 625.
- Existing 625 tooltip wording remains unchanged.
- Existing human, machine, location, material, adjustment, digital, and medieval calculations remain intact except for the approved machine double-count safeguard.

## Current regional references
- Québec, Canada
- Ontario, Canada
- British Columbia, Canada

Unsupported regions fall back to a custom reference. A global live tariff service is not included in this release.

## Validation
- `npm ci` completed.
- `npm run build` completed successfully.
- 90 static pages generated.
