# Kingdom Fair Deal package

This folder preserves the human-readable constitution behind the Fair Deal system.

## Files

- `protocol-v0.1.md` — GitHub-readable working constitution.
- `attachments/Kingdom_Fair_Deal_Protocol_v0.1.docx` — editable source document.
- `attachments/Kingdom_Fair_Deal_Protocol_v0.1.pdf` — fixed-layout reading copy.
- `../../specs/kingdom-fair-deal-core-v0.1.json` — conceptual machine-readable core.
- `../../schemas/fair-deal-transaction.schema.json` — strict JSON Schema for transaction records.
- `../../examples/five-person-band-fair-deal.json` — worked example.
- `../../lib/fairDeal.mjs` — deterministic calculation kernel.
- `../../tests/fairDeal.test.mjs` — executable constitutional tests.

## Core equations

```text
benevolent contribution = max(0, agreed full value − agreed settlement)
unfulfilled obligation = max(0, agreed settlement − delivered settlement)
```

Only mutually agreed terms become official ledger terms. The first difference is agreed benevolence. The second is non-fulfilment and must never be rewritten as generosity.

## Run locally

```bash
npm install
npm run test:fair-deal
npm run dev
```

Then open `/fair-deal`.

## API

`POST /api/fair-deal/calculate`

Example body:

```json
{
  "human": {
    "contributors": 5,
    "hoursPerContributor": 2,
    "humanEnergyKwhPerHour": 0.8,
    "presence": 0.95
  },
  "values": {
    "transactionExpenses": 1875,
    "equipmentDeployment": 600,
    "reusablePreparationActivated": 2000,
    "reusablePreparationInvoiceShare": 0.25,
    "embeddedCapacity": 250,
    "riskAndConstraints": 250,
    "agreedSettlement": 2500,
    "deliveredSettlement": 2500
  }
}
```
