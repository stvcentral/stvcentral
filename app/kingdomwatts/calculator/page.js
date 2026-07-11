
"use client";

import { useEffect, useMemo, useState } from "react";

const HUMAN_PRESETS = {
  "Resting": 0.11,
  "Office work": 0.30,
  "Creative work": 0.60,
  "Active physical work": 0.80,
  "Heavy labour": 1.00,
};

const JOB_PRESETS = {
  "Custom": ["Creative work", 0.5, 0, 0, 0],
  "Music production": ["Creative work", 1, 0.30, 15, 0],
  "Vocal recording": ["Creative work", 1, 0.22, 10, 0],
  "Guitar lesson": ["Creative work", 0.8, 0.05, 0, 0],
  "Programming": ["Office work", 0.9, 0.25, 0, 0],
  "Graphic design": ["Creative work", 0.9, 0.28, 0, 0],
  "Teaching": ["Creative work", 0.8, 0.10, 0, 0],
  "Gardening": ["Active physical work", 0.6, 0.05, 0, 3],
  "Lawn care": ["Active physical work", 0.7, 1.20, 0, 4],
  "Cooking": ["Active physical work", 0.7, 1.00, 0, 10],
  "Carpentry": ["Heavy labour", 0.8, 1.50, 0, 20],
  "Mechanic work": ["Active physical work", 0.8, 1.00, 20, 25],
  "Medical consultation": ["Office work", 0.9, 0.15, 30, 2],
  "Firefighting — active": ["Heavy labour", 1, 5.00, 0, 0],
};

const MACHINE_LIBRARY = [
  ["desktop", "Desktop computer", 0.25],
  ["laptop", "Laptop", 0.08],
  ["monitor", "Computer monitor", 0.03],
  ["audio", "Audio interface", 0.01],
  ["speakers", "Studio monitors / speakers", 0.04],
  ["camera", "Camera", 0.02],
  ["lighting", "Lighting", 0.10],
  ["3dprinter", "3D printer", 0.15],
  ["lawnmower", "Electric lawn mower", 1.20],
  ["powertools", "Power tools", 1.00],
  ["hvac", "Heating / cooling share", 0.50],
];

function InfoTip({ children }) {
  return (
    <span className="kwk-info-tip" tabIndex="0">
      ?
      <span className="kwk-info-popover">{children}</span>
    </span>
  );
}

function NumberField({ label, value, onChange, step="any", min=0, help, disabled=false, info }) {
  return (
    <label className={`kwk-field ${disabled ? "is-disabled" : ""}`}>
      <span className="kwk-field-label">
        {label}
        {info ? <InfoTip>{info}</InfoTip> : null}
      </span>
      <input type="number" value={value} min={min} step={step} disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))} />
      {help && <small>{help}</small>}
    </label>
  );
}

export default function KingdomWattCalculator() {
  const [jobPreset, setJobPreset] = useState("Music production");
  const [humanPreset, setHumanPreset] = useState("Creative work");
  const [humanEnergy, setHumanEnergy] = useState(0.6);
  const [presence, setPresence] = useState(1);
  const coefficient = 625;
  const [hours, setHours] = useState(1);
  const [machinePerHour, setMachinePerHour] = useState(0.30);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [locationPerHour, setLocationPerHour] = useState(15);
  const [materials, setMaterials] = useState(0);
  const [rate, setRate] = useState(0.06483);
  const [currency, setCurrency] = useState("CAD");
  const [creatorAdjustment, setCreatorAdjustment] = useState(0);

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

  const machineLibraryTotal = useMemo(() =>
    selectedMachines.reduce((sum, id) => {
      const item = MACHINE_LIBRARY.find(([machineId]) => machineId === id);
      return sum + (item?.[2] || 0);
    }, 0), [selectedMachines]);

  const values = useMemo(() => {
    const safeRate = rate > 0 ? rate : 0.00001;
    const effectiveMachineRate = machinePerHour + machineLibraryTotal;
    const human = humanEnergy * presence * coefficient * hours;
    const machines = effectiveMachineRate * hours;
    const location = (locationPerHour / safeRate) * hours;
    const materialEnergy = materials / safeRate;
    const estimated = human + machines + location + materialEnergy;
    const finalValue = Math.max(0, estimated + creatorAdjustment);
    return { human, machines, location, materialEnergy, estimated, finalValue, effectiveMachineRate, localEquivalent: finalValue * safeRate };
  }, [humanEnergy, presence, hours, machinePerHour, machineLibraryTotal, locationPerHour, materials, rate, creatorAdjustment]);

  function applyJobPreset(name) {
    setJobPreset(name);
    const [humanName, p, machine, location, material] = JOB_PRESETS[name];
    setHumanPreset(humanName);
    setHumanEnergy(HUMAN_PRESETS[humanName]);
    setPresence(p);
    setMachinePerHour(machine);
    setLocationPerHour(location);
    setMaterials(material);
    setSelectedMachines([]);
  }

  function toggleMachine(id) {
    setSelectedMachines((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
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
            <select value={jobPreset} onChange={(e) => applyJobPreset(e.target.value)}>
              {Object.keys(JOB_PRESETS).map((name) => <option key={name}>{name}</option>)}
            </select>
            <small>Presets provide a starting point. Every visible value can still be adjusted.</small>
          </label>

          <h2>2. Human energy</h2>
          <label className="kwk-field">
            <span>Human activity level</span>
            <select value={humanPreset} onChange={(e) => {
              setHumanPreset(e.target.value);
              setHumanEnergy(HUMAN_PRESETS[e.target.value]);
            }}>
              {Object.entries(HUMAN_PRESETS).map(([name, value]) => (
                <option key={name} value={name}>{name} — {value.toFixed(2)} kWh/h</option>
              ))}
            </select>
            <small>Choose a starting point, then edit the number below if needed.</small>
          </label>

          <div className="kwk-two-columns">
            <NumberField label="Average human energy per hour" value={humanEnergy}
              onChange={(value) => { setHumanEnergy(value); setHumanPreset("Custom"); }} step="0.01"
              help="Editable. Default creative-work value: 0.6 kWh/hour."
              info={<>
                <strong>Average Human Energy per Hour</strong>
                <span>Represents the average biological energy deployed each hour.</span>
                <span>An average adult at rest uses approximately 0.10–0.12 kWh/hour.</span>
                <span>Creative work, physical activity, concentration, and skilled labour generally require more. The Kingdom default for active productive work is 0.6 kWh/hour.</span>
              </>} />

            <NumberField label="Presence" value={presence} onChange={setPresence} step="0.1"
              help="0 = absent • 1 = full focus or flow."
              info={<>
                <strong>Presence</strong>
                <span>How mentally engaged were you during the work?</span>
                <span>0 = absent or fully distracted. 1 = full focus or flow.</span>
              </>} />

            <NumberField label="Human–Industrial Coefficient" value={coefficient} onChange={() => {}}
              disabled help="625 is a locked Kingdom constant."
              info={<>
                <strong>Kingdom Constant</strong>
                <span>This translates biological human energy into the Kingdom ledger. It is part of the Kingdom standard and cannot be changed.</span>
              </>} />

            <NumberField label="Hours deployed" value={hours} onChange={setHours} step="0.25"
              help="Actively working on, reviewing, practicing, or otherwise deploying effort."
              info={<>
                <strong>Hours Deployed</strong>
                <span>Hours actively creating, reviewing, practicing, or otherwise deploying effort.</span>
              </>} />
          </div>

          <h2>3. Machines, place, and materials</h2>
          <div className="kwk-two-columns">
            <NumberField label="Machine energy per hour" value={machinePerHour} onChange={setMachinePerHour} step="0.01"
              help="Calculator automatically multiplies this value by Hours Deployed."
              info={<>
                <strong>Machine Energy per Hour</strong>
                <span>Standard desktop computer: approximately 0.15–0.30 kWh/hour.</span>
                <span>Include computers, cameras, lighting, audio equipment, power tools, and other machines.</span>
              </>} />

            <NumberField label={`Location cost per hour (${currency})`} value={locationPerHour} onChange={setLocationPerHour} step="0.5" />
            <NumberField label={`Material cost (${currency})`} value={materials} onChange={setMaterials} step="0.5" />
            <NumberField label="King's / creator's adjustment (KWK)" value={creatorAdjustment}
              onChange={setCreatorAdjustment} min="-999999" step="1"
              help="The calculator estimates. The King or creator records the official value." />
          </div>

          <details className="kwk-machine-library">
            <summary>Machine library</summary>
            <p>Select standard machines to add their hourly use to the manual machine value.</p>
            <div className="kwk-machine-grid">
              {MACHINE_LIBRARY.map(([id, label, machineRate]) => (
                <label key={id}>
                  <input type="checkbox" checked={selectedMachines.includes(id)} onChange={() => toggleMachine(id)} />
                  <span>{label}</span><strong>{machineRate.toFixed(2)} kWh/h</strong>
                </label>
              ))}
            </div>
            <div className="kwk-machine-total"><span>Machine library total</span><strong>{machineLibraryTotal.toFixed(2)} kWh/h</strong></div>
            <div className="kwk-machine-total"><span>Effective machine energy per hour</span><strong>{values.effectiveMachineRate.toFixed(2)} kWh/h</strong></div>
          </details>

          <h2>4. Your local energy market</h2>
          <div className="kwk-two-columns">
            <NumberField label={`Local electricity rate (${currency}/kWh)`} value={rate} onChange={setRate} step="0.00001"
              help="This changes only the local currency expression, never the KWK value." />
            <label className="kwk-field">
              <span>Local currency code</span>
              <input value={currency} maxLength="3" onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
              <small>Examples: CAD, USD, EUR.</small>
            </label>
          </div>
        </section>

        <aside className="kwk-result-panel">
          <p className="eyebrow">ESTIMATED CREATIVE ENERGY VALUE</p>
          <h2>⚡ {Math.round(values.finalValue).toLocaleString()} KWK</h2>
          <blockquote>“This work cost me {Math.round(values.finalValue).toLocaleString()} KWK of my life to make.”</blockquote>
          <dl className="kwk-breakdown">
            <div><dt>Human</dt><dd>{values.human.toFixed(2)} KWK</dd></div>
            <div><dt>Machines</dt><dd>{values.machines.toFixed(2)} KWK</dd></div>
            <div><dt>Location</dt><dd>{values.location.toFixed(2)} KWK</dd></div>
            <div><dt>Materials</dt><dd>{values.materialEnergy.toFixed(2)} KWK</dd></div>
            <div><dt>Estimated subtotal</dt><dd>{values.estimated.toFixed(2)} KWK</dd></div>
            <div><dt>King's / creator's adjustment</dt><dd>{creatorAdjustment.toFixed(2)} KWK</dd></div>
          </dl>
          <div className="kwk-local-result">
            <span>Estimated value in your local energy market</span>
            <strong>{values.localEquivalent.toFixed(2)} {currency}</strong>
            <small>{rate.toFixed(5)} {currency} per kWh</small>
          </div>
          <p className="kwk-note">KWK remains the unit of account. Local currency is only the visitor’s local expression of that energy.</p>
        </aside>
      </div>
    </main>
  );
}
