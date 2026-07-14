import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateFairDeal,
  calculateHumanContribution,
  createTransactionRecord,
  HUMAN_CONTRIBUTION_COEFFICIENT,
} from "../lib/fairDeal.mjs";

test("keeps the current human coefficient at 625", () => {
  assert.equal(HUMAN_CONTRIBUTION_COEFFICIENT, 625);
});

test("calculates direct human contribution from energy and presence", () => {
  const result = calculateHumanContribution({
    contributors: 5,
    hoursPerContributor: 2,
    humanEnergyKwhPerHour: 0.8,
    presence: 0.95,
  });
  assert.equal(result.physicalKwh, 7.6);
  assert.equal(result.kwk, 4750);
});

test("separates invoice value from full value", () => {
  const result = calculateFairDeal({
    directDelivered: 4750,
    transactionExpenses: 1875,
    equipmentDeployment: 600,
    reusablePreparationActivated: 2000,
    reusablePreparationInvoiceShare: 0.25,
    embeddedCapacity: 250,
    riskAndConstraints: 250,
    agreedSettlement: 2500,
    deliveredSettlement: 2500,
  });
  assert.equal(result.values.invoiceValue, 7975);
  assert.equal(result.values.fullValue, 9725);
  assert.equal(result.values.benevolentContribution, 7225);
  assert.equal(result.values.unfulfilledObligation, 0);
});

test("never reclassifies missed settlement as benevolence", () => {
  const result = calculateFairDeal({
    directDelivered: 8000,
    reusablePreparationActivated: 2000,
    agreedSettlement: 4000,
    deliveredSettlement: 2500,
  });
  assert.equal(result.values.benevolentContribution, 6000);
  assert.equal(result.values.unfulfilledObligation, 1500);
});

test("creates a record that preserves non-enforcement and transaction-gated reputation", () => {
  const calculation = calculateFairDeal({ directDelivered: 1000, agreedSettlement: 500, deliveredSettlement: 500 });
  const record = createTransactionRecord({
    id: "tx-1",
    title: "Example",
    purpose: "Test the protocol",
    parties: [{ id: "a", displayName: "A" }, { id: "b", displayName: "B" }],
    calculation,
  });
  assert.equal(record.enforcement, "outside_platform");
  assert.equal(record.reputationEligibility, "verified_transaction_parties_only");
  assert.equal(record.agreement.benevolentContributionKwk, 500);
});

test("rejects invalid negative values", () => {
  assert.throws(() => calculateFairDeal({ directDelivered: -1 }), /greater than or equal to zero/);
});
