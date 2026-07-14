export const FAIR_DEAL_PROTOCOL_VERSION = "0.1";
export const HUMAN_CONTRIBUTION_COEFFICIENT = 625;

export const VALUE_CATEGORIES = Object.freeze([
  "directDelivered",
  "transactionExpenses",
  "equipmentDeployment",
  "reusablePreparationActivated",
  "embeddedCapacity",
  "riskAndConstraints",
]);

function finiteNonNegative(value, fieldName) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0) {
    throw new TypeError(`${fieldName} must be a finite number greater than or equal to zero.`);
  }
  return number;
}

function bounded(value, minimum, maximum, fieldName) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new TypeError(`${fieldName} must be between ${minimum} and ${maximum}.`);
  }
  return number;
}

export function calculateHumanContribution({
  contributors = 1,
  hoursPerContributor = 0,
  humanEnergyKwhPerHour = 0.6,
  presence = 1,
  coefficient = HUMAN_CONTRIBUTION_COEFFICIENT,
} = {}) {
  const safeContributors = finiteNonNegative(contributors, "contributors");
  const safeHours = finiteNonNegative(hoursPerContributor, "hoursPerContributor");
  const safeEnergy = finiteNonNegative(humanEnergyKwhPerHour, "humanEnergyKwhPerHour");
  const safePresence = bounded(presence, 0, 1, "presence");
  const safeCoefficient = finiteNonNegative(coefficient, "coefficient");

  const physicalKwh = safeContributors * safeHours * safeEnergy * safePresence;
  return {
    physicalKwh,
    kwk: physicalKwh * safeCoefficient,
    coefficient: safeCoefficient,
  };
}

export function calculateFairDeal(input = {}) {
  const directDelivered = finiteNonNegative(input.directDelivered, "directDelivered");
  const transactionExpenses = finiteNonNegative(input.transactionExpenses, "transactionExpenses");
  const equipmentDeployment = finiteNonNegative(input.equipmentDeployment, "equipmentDeployment");
  const reusablePreparationActivated = finiteNonNegative(
    input.reusablePreparationActivated,
    "reusablePreparationActivated",
  );
  const embeddedCapacity = finiteNonNegative(input.embeddedCapacity, "embeddedCapacity");
  const riskAndConstraints = finiteNonNegative(input.riskAndConstraints, "riskAndConstraints");
  const reusablePreparationInvoiceShare = bounded(
    input.reusablePreparationInvoiceShare ?? 0,
    0,
    1,
    "reusablePreparationInvoiceShare",
  );
  const agreedSettlement = finiteNonNegative(input.agreedSettlement, "agreedSettlement");
  const deliveredSettlement = finiteNonNegative(input.deliveredSettlement, "deliveredSettlement");

  const allocatedReusablePreparation = reusablePreparationActivated * reusablePreparationInvoiceShare;
  const invoiceValue =
    directDelivered +
    transactionExpenses +
    equipmentDeployment +
    riskAndConstraints +
    allocatedReusablePreparation;

  const fullValue =
    directDelivered +
    transactionExpenses +
    equipmentDeployment +
    reusablePreparationActivated +
    embeddedCapacity +
    riskAndConstraints;

  const benevolentContribution = Math.max(0, fullValue - agreedSettlement);
  const unfulfilledObligation = Math.max(0, agreedSettlement - deliveredSettlement);
  const overDelivery = Math.max(0, deliveredSettlement - agreedSettlement);
  const settlementCompletionRatio = agreedSettlement === 0
    ? (deliveredSettlement === 0 ? 1 : null)
    : deliveredSettlement / agreedSettlement;

  return {
    protocolVersion: FAIR_DEAL_PROTOCOL_VERSION,
    energyUnit: "KW₭",
    values: {
      directDelivered,
      transactionExpenses,
      equipmentDeployment,
      reusablePreparationActivated,
      allocatedReusablePreparation,
      embeddedCapacity,
      riskAndConstraints,
      invoiceValue,
      fullValue,
      agreedSettlement,
      deliveredSettlement,
      benevolentContribution,
      unfulfilledObligation,
      overDelivery,
      settlementCompletionRatio,
    },
    principles: {
      energyFirst: true,
      currencyIsSettlementBridgeOnly: true,
      platformRecordsButDoesNotEnforce: true,
      reputationIsTransactionGated: true,
      benevolentContributionIsSpendable: false,
    },
  };
}

export function createTransactionRecord({
  id,
  title,
  purpose,
  parties = [],
  calculation,
  status = "draft",
  acceptedAt = null,
} = {}) {
  if (!id || typeof id !== "string") throw new TypeError("id is required.");
  if (!title || typeof title !== "string") throw new TypeError("title is required.");
  if (!purpose || typeof purpose !== "string") throw new TypeError("purpose is required.");
  if (!Array.isArray(parties) || parties.length < 1) throw new TypeError("At least one party is required.");
  if (!calculation?.values) throw new TypeError("A Fair Deal calculation is required.");

  return {
    id,
    protocolVersion: FAIR_DEAL_PROTOCOL_VERSION,
    title,
    purpose,
    parties,
    status,
    acceptedAt,
    agreement: {
      energyUnit: "KW₭",
      invoiceValueKwk: calculation.values.invoiceValue,
      fullValueKwk: calculation.values.fullValue,
      agreedSettlementKwk: calculation.values.agreedSettlement,
      benevolentContributionKwk: calculation.values.benevolentContribution,
    },
    outcome: {
      deliveredSettlementKwk: calculation.values.deliveredSettlement,
      unfulfilledObligationKwk: calculation.values.unfulfilledObligation,
      overDeliveryKwk: calculation.values.overDelivery,
    },
    enforcement: "outside_platform",
    reputationEligibility: "verified_transaction_parties_only",
  };
}
