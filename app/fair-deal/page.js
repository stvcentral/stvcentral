"use client";

import { useMemo, useState } from "react";
import {
  calculateFairDeal,
  calculateHumanContribution,
  HUMAN_CONTRIBUTION_COEFFICIENT,
} from "../../lib/fairDeal.mjs";

const BAND_EXAMPLE = {
  title: "Five-person band — one-hour show",
  description: "A five-person band performs for one hour and brings its own equipment.",
  contributors: 5,
  hoursPerContributor: 2,
  humanEnergyKwhPerHour: 0.8,
  presence: 0.95,
  transactionExpenses: 1875,
  equipmentDeployment: 600,
  reusablePreparationActivated: 2000,
  reusablePreparationInvoiceShare: 0.25,
  embeddedCapacity: 750,
  riskAndConstraints: 250,
  agreedSettlement: 2500,
  deliveredSettlement: 2500,
};

function NumberInput({ label, value, onChange, step = "any", min = 0, max, help }) {
  return (
    <label className="fair-field">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {help ? <small>{help}</small> : null}
    </label>
  );
}

function Metric({ label, value, emphasis = false, note }) {
  return (
    <article className={`fair-metric ${emphasis ? "is-emphasis" : ""}`}>
      <span>{label}</span>
      <strong>{Math.round(value).toLocaleString()} KW₭</strong>
      {note ? <small>{note}</small> : null}
    </article>
  );
}

export default function FairDealPage() {
  const [form, setForm] = useState(BAND_EXAMPLE);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const human = useMemo(() => calculateHumanContribution({
    contributors: form.contributors,
    hoursPerContributor: form.hoursPerContributor,
    humanEnergyKwhPerHour: form.humanEnergyKwhPerHour,
    presence: form.presence,
  }), [form.contributors, form.hoursPerContributor, form.humanEnergyKwhPerHour, form.presence]);

  const result = useMemo(() => calculateFairDeal({
    directDelivered: human.kwk,
    transactionExpenses: form.transactionExpenses,
    equipmentDeployment: form.equipmentDeployment,
    reusablePreparationActivated: form.reusablePreparationActivated,
    reusablePreparationInvoiceShare: form.reusablePreparationInvoiceShare,
    embeddedCapacity: form.embeddedCapacity,
    riskAndConstraints: form.riskAndConstraints,
    agreedSettlement: form.agreedSettlement,
    deliveredSettlement: form.deliveredSettlement,
  }), [form, human.kwk]);

  const v = result.values;

  return (
    <main className="fair-shell">
      <section className="fair-hero">
        <p className="eyebrow">KINGDOM INFRASTRUCTURE · FAIR DEAL PROTOCOL v0.1</p>
        <h1>See the whole exchange before agreeing on the price.</h1>
        <p>
          This prototype keeps value in KingdomWatts, separates invoice value from full value,
          records agreed benevolence, and never turns a broken promise into generosity.
        </p>
        <div className="fair-principle">
          <strong>Deeper principle</strong>
          <span>Not everything valuable must be charged, but everything valuable should be visible.</span>
        </div>
      </section>

      <section className="fair-layout">
        <div className="fair-panel">
          <div className="fair-panel-heading">
            <div>
              <p className="eyebrow">SINGLE-PARTY INTERVIEW PROTOTYPE</p>
              <h2>Describe the energy in the deal</h2>
            </div>
            <button type="button" className="fair-example-button" onClick={() => setForm(BAND_EXAMPLE)}>
              Load band example
            </button>
          </div>

          <label className="fair-field fair-field-wide">
            <span>Deal title</span>
            <input value={form.title} onChange={(event) => setField("title", event.target.value)} />
          </label>
          <label className="fair-field fair-field-wide">
            <span>Plain-language description</span>
            <textarea rows="3" value={form.description} onChange={(event) => setField("description", event.target.value)} />
          </label>

          <h3>Direct human contribution</h3>
          <div className="fair-grid">
            <NumberInput label="Contributors" value={form.contributors} onChange={(value) => setField("contributors", value)} step="1" />
            <NumberInput label="Hours per contributor" value={form.hoursPerContributor} onChange={(value) => setField("hoursPerContributor", value)} step="0.25" />
            <NumberInput label="Human energy (kWh/h)" value={form.humanEnergyKwhPerHour} onChange={(value) => setField("humanEnergyKwhPerHour", value)} step="0.01" />
            <NumberInput label="Presence" value={form.presence} onChange={(value) => setField("presence", value)} step="0.01" max="1" help="0 to 1" />
          </div>
          <div className="fair-kernel-readout">
            <span>{human.physicalKwh.toFixed(3)} physical kWh × Hᵢ {HUMAN_CONTRIBUTION_COEFFICIENT}</span>
            <strong>{Math.round(human.kwk).toLocaleString()} KW₭ direct human value</strong>
          </div>

          <h3>Visible and unseen components</h3>
          <div className="fair-grid">
            <NumberInput label="Transaction expenses" value={form.transactionExpenses} onChange={(value) => setField("transactionExpenses", value)} help="Fuel, parking, materials—already translated into KW₭." />
            <NumberInput label="Equipment deployment" value={form.equipmentDeployment} onChange={(value) => setField("equipmentDeployment", value)} help="Use, transport, wear, energy, and risk." />
            <NumberInput label="Reusable preparation activated" value={form.reusablePreparationActivated} onChange={(value) => setField("reusablePreparationActivated", value)} help="Rehearsals, arrangements, templates, or prior development." />
            <NumberInput label="Preparation share charged now" value={form.reusablePreparationInvoiceShare} onChange={(value) => setField("reusablePreparationInvoiceShare", value)} step="0.05" max="1" help="0 to 1. Full value remains visible either way." />
            <NumberInput label="Embedded capacity" value={form.embeddedCapacity} onChange={(value) => setField("embeddedCapacity", value)} help="Skill, repertoire, trust, systems, and audience." />
            <NumberInput label="Risk and constraints" value={form.riskAndConstraints} onChange={(value) => setField("riskAndConstraints", value)} help="Cancellation exposure, exclusivity, scarcity, or damage risk." />
          </div>

          <h3>Agreement and outcome</h3>
          <div className="fair-grid">
            <NumberInput label="Agreed settlement" value={form.agreedSettlement} onChange={(value) => setField("agreedSettlement", value)} help="All promised cash, goods, access, services, or revenue share translated into KW₭." />
            <NumberInput label="Delivered settlement" value={form.deliveredSettlement} onChange={(value) => setField("deliveredSettlement", value)} help="What was actually delivered after the agreement." />
          </div>
        </div>

        <aside className="fair-results">
          <p className="eyebrow">ENERGY-FIRST RESULT</p>
          <h2>{form.title || "Untitled deal"}</h2>
          <p>{form.description}</p>

          <div className="fair-metrics">
            <Metric label="Invoice-mode estimate" value={v.invoiceValue} note="Immediate settlement logic, including only the selected share of reusable preparation." />
            <Metric label="Full value activated" value={v.fullValue} emphasis note="Everything valuable made visible, whether charged or not." />
            <Metric label="Agreed settlement" value={v.agreedSettlement} />
            <Metric label="Benevolent contribution" value={v.benevolentContribution} note="Agreed full value minus agreed settlement. Non-spendable recognition." />
            <Metric label="Unfulfilled obligation" value={v.unfulfilledObligation} note="Agreed settlement minus delivered settlement. Never reclassified as benevolence." />
          </div>

          <div className="fair-equations">
            <p><strong>Benevolence</strong><span>{Math.round(v.fullValue).toLocaleString()} − {Math.round(v.agreedSettlement).toLocaleString()} = {Math.round(v.benevolentContribution).toLocaleString()} KW₭</span></p>
            <p><strong>Non-fulfilment</strong><span>{Math.round(v.agreedSettlement).toLocaleString()} − {Math.round(v.deliveredSettlement).toLocaleString()} = {Math.round(v.unfulfilledObligation).toLocaleString()} KW₭</span></p>
          </div>

          <div className="fair-boundary">
            <strong>What the platform does</strong>
            <p>It helps describe, measure, negotiate, record, and remember the deal.</p>
            <strong>What it does not do</strong>
            <p>It does not enforce the agreement, decide guilt, mint currency from the gap, or let outsiders affect transaction reputation.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
