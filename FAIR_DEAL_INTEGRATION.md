# Fair Deal integration — v0.1

## What was added

- Public prototype at `/fair-deal`.
- Deterministic energy-first calculation kernel in `lib/fairDeal.mjs`.
- Calculation API at `POST /api/fair-deal/calculate`.
- GitHub-readable protocol, original DOCX/PDF, conceptual spec, strict schema, and band example.
- Executable tests for the constitutional equations and safeguards.
- A main navigation link to the Fair Deal prototype.

## What was deliberately not changed

- The existing `/kingdomwatts/calculator` implementation.
- The current human coefficient `H_i = 625`.
- Existing music, project, reveal, admin, dashboard, or workspace behavior.
- No currency creation, advertising reward, payment enforcement, guilt judgment, or outsider rating was introduced.

## Current prototype boundary

This is a deterministic single-party interview form. It does not yet connect to an AI provider, user accounts, a database, private advocates, two-party consent, or a public reputation ledger. Those should be built only after the protocol and record semantics are accepted.
