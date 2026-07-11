
"use client";

import { useEffect, useMemo, useState } from "react";

const PRESETS = {
  "Custom": { presence: 0.5, machine: 0, location: 0, materials: 0 },
  "Clerk / retail": { presence: 0.5, machine: 0.1, location: 0, materials: 0 },
  "Teacher / instructor": { presence: 0.8, machine: 0.2, location: 0, materials: 0 },
  "Gardener / lawn care": { presence: 0.6, machine: 0.5, location: 0, materials: 2 },
  "Chef / prepared meal": { presence: 0.7, machine: 0.6, location: 0, materials: 4 },
  "Musician / studio": { presence: 1, machine: 1, location: 15, materials: 0 },
  "Doctor / consultation": { presence: 0.9, machine: 0.3, location: 0, materials: 0 },
  "Security guard": { presence: 0.4, machine: 0.1, location: 0, materials: 0 },
  "Firefighter / active": { presence: 1, machine: 5, location: 0, materials: 0 },
  "Farmer / field work": { presence: 0.7, machine: 1.5, location: 0, materials: 1 },
};

function NumberField({ label, value, onChange, step = "any", min = 0, help }) {
  return (
    <label className="kwk-field">
      <span>{label}</span>
      <input type="number" value={value} min={min} step={step}
        onChange={(event) => onChange(Number(event.target.value))} />
      {help && <small>{help}</small>}
    </label>
  );
}

export default function KingdomWattCalculator() {
  const [service, setService] = useState("Musician / studio");
  const [humanEnergy, setHumanEnergy] = useState(0.6);
  const [presence, setPresence] = useState(1);
  const [coefficient, setCoefficient] = useState(625);
  const [hours, setHours] = useState(1);
  const [machine, setMachine] = useState(1);
  const [locationPerHour, setLocationPerHour] = useState(15);
  const [materials, setMaterials] = useState(0);
  const [rate, setRate] = useState(0.06483);
  const [currency, setCurrency] = useState("CAD");
  const [artistAdjustment, setArtistAdjustment] = useState(0);

  useEffect(() => {
    const savedRate = Number(localStorage.getItem("kwk-local-rate"));
    const savedCurrency = localStorage.getItem("kwk-local-currency");
    if (Number.isFinite(savedRate) && savedRate > 0) setRate(savedRate);
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    if (rate > 0) localStorage.setItem("kwk-local-rate", String(rate));
    localStorage.setItem("kwk-local-currency", currency);
  }, [rate, currency]);

  const values = useMemo(() => {
    const safeRate = rate > 0 ? rate : 0.00001;
    const human = humanEnergy * presence * coefficient * hours;
    const location = (locationPerHour / safeRate) * hours;
    const materialEnergy = materials / safeRate;
    const calculated = human + machine + location + materialEnergy;
    const finalValue = Math.max(0, calculated + artistAdjustment);
    return {
      human, machine, location, materials: materialEnergy,
      calculated, finalValue,
      localEquivalent: finalValue * safeRate,
    };
  }, [humanEnergy, presence, coefficient, hours, machine, locationPerHour, materials, rate, artistAdjustment]);

  function applyPreset(name) {
    setService(name);
    const preset = PRESETS[name];
    setPresence(preset.presence);
    setMachine(preset.machine);
    setLocationPerHour(preset.location);
    setMaterials(preset.materials);
  }

  return (
    <main className="kwk-calculator-shell">
      <header className="kwk-calculator-hero">
        <p className="eyebrow">KINGDOMWATT</p>
        <h1>Creative Energetic Value Calculator</h1>
        <p>Estimate the human, machine, location, and material energy deployed to create a song, service, or physical result.</p>
      </header>

      <div className="kwk-calculator-layout">
        <section className="kwk-calculator-panel">
          <h2>1. What are you valuing?</h2>
          <label className="kwk-field">
            <span>Job or activity preset</span>
            <select value={service} onChange={(e) => applyPreset(e.target.value)}>
              {Object.keys(PRESETS).map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>

          <h2>2. Human energy</h2>
          <div className="kwk-two-columns">
            <NumberField label="Human energy per hour" value={humanEnergy} onChange={setHumanEnergy}
              step="0.1" help="Default: 0.6 kWh/h for active creative work." />
            <NumberField label="Presence" value={presence} onChange={setPresence}
              step="0.1" help="0 = absent, 1 = full focus or flow." />
            <NumberField label="Human–industrial coefficient" value={coefficient} onChange={setCoefficient}
              step="1" help="Editable bridge between biological effort and ledger energy." />
            <NumberField label="Hours deployed" value={hours} onChange={setHours}
              step="0.25" />
          </div>

          <h2>3. Tools, place, and materials</h2>
          <div className="kwk-two-columns">
            <NumberField label="Machine energy used (kWh)" value={machine} onChange={setMachine} step="0.1" />
            <NumberField label={`Location cost per hour (${currency})`} value={locationPerHour} onChange={setLocationPerHour} step="0.5" />
            <NumberField label={`Material cost (${currency})`} value={materials} onChange={setMaterials} step="0.5" />
            <NumberField label="King's / creator's adjustment (KWK)" value={artistAdjustment} onChange={setArtistAdjustment}
              min="-999999" step="1" help="The calculator advises. The creator declares the final value." />
          </div>

          <h2>4. Your local energy market</h2>
          <div className="kwk-two-columns">
            <NumberField label={`Local electricity rate (${currency}/kWh)`} value={rate} onChange={setRate}
              step="0.00001" help="This only changes the local currency expression, not the KWK value." />
            <label className="kwk-field">
              <span>Local currency code</span>
              <input value={currency} maxLength="3" onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
              <small>Examples: CAD, USD, EUR.</small>
            </label>
          </div>
        </section>

        <aside className="kwk-result-panel">
          <p className="eyebrow">CALCULATED LEDGER</p>
          <h2>⚡ {Math.round(values.finalValue).toLocaleString()} KWK</h2>
          <blockquote>“This work cost me {Math.round(values.finalValue).toLocaleString()} KWK of my life to make.”</blockquote>

          <dl className="kwk-breakdown">
            <div><dt>Human</dt><dd>{values.human.toFixed(2)} KWK</dd></div>
            <div><dt>Machines</dt><dd>{values.machine.toFixed(2)} KWK</dd></div>
            <div><dt>Location</dt><dd>{values.location.toFixed(2)} KWK</dd></div>
            <div><dt>Materials</dt><dd>{values.materials.toFixed(2)} KWK</dd></div>
            <div><dt>Calculated subtotal</dt><dd>{values.calculated.toFixed(2)} KWK</dd></div>
            <div><dt>Creator adjustment</dt><dd>{artistAdjustment.toFixed(2)} KWK</dd></div>
          </dl>

          <div className="kwk-local-result">
            <span>Estimated value in your local energy market</span>
            <strong>{values.localEquivalent.toFixed(2)} {currency}</strong>
            <small>{rate.toFixed(5)} {currency} per kWh</small>
          </div>

          <p className="kwk-note">KWK is the unit of account. Your local currency is only the visitor’s local expression of that energy.</p>
        </aside>
      </div>
    </main>
  );
}
