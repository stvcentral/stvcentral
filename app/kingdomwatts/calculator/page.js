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

const REGIONAL_RATE_REFERENCES = {
  "Quebec, Canada": { rate: 0.06483, currency: "CAD", source: "Hydro-Québec reference", confidence: "Regional reference" },
  "Ontario, Canada": { rate: 0.12, currency: "CAD", source: "Ontario Energy Board tiered reference", confidence: "Regional reference" },
  "British Columbia, Canada": { rate: 0.1187, currency: "CAD", source: "BC residential Step 1 reference", confidence: "Regional reference" },
};

function detectSupportedRegion(latitude, longitude) {
  if (latitude >= 44 && latitude <= 63 && longitude >= -80 && longitude <= -57) return "Quebec, Canada";
  if (latitude >= 41 && latitude <= 57 && longitude >= -96 && longitude < -74) return "Ontario, Canada";
  if (latitude >= 48 && latitude <= 60 && longitude >= -139 && longitude <= -114) return "British Columbia, Canada";
  return null;
}

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

function AbacusRow({ label, value, max, display, tone="gold", animationKey }) {
  const normalized = max <= 0 ? 0 : Math.min(1, Math.abs(value) / max);
  const moved = Math.max(0, Math.min(10, Math.round(normalized * 10)));
  return (
    <div className={`abacus-row tone-${tone}`} key={`${label}-${animationKey}`}>
      <div className="abacus-label">
        <span>{label}</span>
        <strong>{display}</strong>
      </div>
      <div className="abacus-rail" aria-label={`${label}: ${display}`}>
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className={`abacus-bead ${index < moved ? "is-counted" : ""}`}
            style={{ "--delay": `${index * 34}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function MedievalAbacus({ values, humanEnergy, presence, hours, coefficient, creatorAdjustment, currency, rate }) {
  const animationKey = [humanEnergy, presence, hours, values.finalValue, creatorAdjustment].join("-");
  const max = Math.max(values.human, values.location, values.materialEnergy, values.machines, Math.abs(creatorAdjustment), 1);
  return (
    <div className="royal-abacus" key={animationKey}>
      <div className="abacus-crown" aria-hidden="true">♔</div>
      <div className="abacus-title">
        <span>ROYAL COUNTING FRAME</span>
        <small>Every bead follows the same calculator engine.</small>
      </div>
      <div className="abacus-frame">
        <AbacusRow label="Human energy" value={values.human} max={max} display={`${values.human.toFixed(2)} KWK`} tone="ruby" animationKey={animationKey} />
        <AbacusRow label="Machines" value={values.machines} max={max} display={`${values.machines.toFixed(2)} KWK`} tone="steel" animationKey={animationKey} />
        <AbacusRow label="Location" value={values.location} max={max} display={`${values.location.toFixed(2)} KWK`} tone="emerald" animationKey={animationKey} />
        <AbacusRow label="Materials" value={values.materialEnergy} max={max} display={`${values.materialEnergy.toFixed(2)} KWK`} tone="amber" animationKey={animationKey} />
        <AbacusRow label="External investment" value={values.externalInvestmentEnergy} max={max} display={`${values.externalInvestmentEnergy.toFixed(2)} KWK`} tone="emerald" animationKey={animationKey} />
        <AbacusRow label="Creator adjustment" value={creatorAdjustment} max={max} display={`${creatorAdjustment >= 0 ? "+" : ""}${creatorAdjustment.toFixed(2)} KWK`} tone="violet" animationKey={animationKey} />
        <AbacusRow label="Final value" value={values.finalValue} max={values.finalValue || 1} display={`${Math.round(values.finalValue).toLocaleString()} KWK`} tone="final" animationKey={animationKey} />
      </div>
      <div className="royal-seal">
        <span>ESTIMATED</span>
        <strong>⚡ {Math.round(values.finalValue).toLocaleString()} KWK</strong>
        <small>{values.localEquivalent.toFixed(2)} {currency} at {rate.toFixed(5)} {currency}/kWh</small>
      </div>
      <p className="abacus-equation">
        {humanEnergy.toFixed(2)} kWh/h × {presence.toFixed(2)} presence × {hours.toFixed(2)} h × {coefficient}
        <br />
        + machines + location + materials + external investment + adjustment
      </p>
    </div>
  );
}

function EnergyFoundation({ jobPreset, values, humanEnergy, presence, hours, coefficient }) {
  return (
    <details className="energy-foundation">
      <summary>🔬 Foundation — follow the energy</summary>
      <p className="foundation-intro">
        <strong>KingdomWatt (KWK) is a unit of creative accounting built on the constant laws of physics.</strong>
        The amount of energy required to create something can always be expressed as physical energy (Joules or kilowatt-hours).
        Those units never change. One kilowatt-hour today is the same physical quantity as one kilowatt-hour a thousand years from now or across all regions.
        What changes is the human value assigned to that energy and the local cost of producing or purchasing it.
      </p>
      <div className="foundation-table" role="table" aria-label="Live KingdomWatt energy chain">
        <div className="foundation-head" role="row">
          <span>Stage</span><span>Live value</span><span>Equation</span>
        </div>
        <div role="row"><strong>Creative work</strong><span>{jobPreset}</span><code>Selected preset</code></div>
        <div role="row"><strong>Human energy rate</strong><span>{humanEnergy.toFixed(3)} kWh/h</span><code>Editable biological estimate</code></div>
        <div role="row"><strong>Presence-adjusted energy</strong><span>{values.humanPhysicalKWh.toFixed(4)} kWh</span><code>{humanEnergy.toFixed(3)} × {presence.toFixed(2)} × {hours.toFixed(2)}</code></div>
        <div role="row"><strong>Joules</strong><span>{Math.round(values.humanJoules).toLocaleString()} J</span><code>{values.humanPhysicalKWh.toFixed(4)} × 3,600,000</code></div>
        <div role="row"><strong>Watt-hours</strong><span>{values.humanWh.toLocaleString(undefined, { maximumFractionDigits: 2 })} Wh</span><code>{values.humanPhysicalKWh.toFixed(4)} × 1,000</code></div>
        <div role="row"><strong>Kilowatt-hours</strong><span>{values.humanPhysicalKWh.toFixed(4)} kWh</span><code>Physical energy foundation</code></div>
        <div role="row"><strong>Kingdom accounting</strong><span>× {coefficient}</span><code>Locked Human Contribution Coefficient</code></div>
        <div className="foundation-total" role="row"><strong>Human KWK</strong><span>{values.human.toFixed(2)} KWK</span><code>{values.humanPhysicalKWh.toFixed(4)} × {coefficient}</code></div>
      </div>
      <small className="foundation-note">Calculator automatically multiplies the hourly human and machine values by Hours Deployed.</small>
    </details>
  );
}

function BuddyReaction({ enabled, values, hours }) {
  if (!enabled) return null;
  let line = "Watching the beads...";
  if (hours >= 12) line = "That is a heroic number of hours.";
  if (values.finalValue >= 5000) line = "That ledger is getting heavy.";
  if (values.finalValue >= 10000) line = "This one deserves a dramatic reveal.";
  return (
    <div className="buddy-reaction" aria-live="polite">
      <div className="buddy-placeholder" aria-hidden="true">⚡</div>
      <div>
        <strong>Buddy reaction layer</strong>
        <p>{line}</p>
        <small>Replace this placeholder with a finished Mic Buddy asset later.</small>
      </div>
    </div>
  );
}

export default function KingdomWattCalculator() {
  const [jobPreset, setJobPreset] = useState("Music production");
  const [humanPreset, setHumanPreset] = useState("Creative work");
  const [humanEnergy, setHumanEnergy] = useState(0.6);
  const [presence, setPresence] = useState(1);
  const coefficient = 625;
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("Creative project");
  const [projectDescription, setProjectDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [hours, setHours] = useState(1);
  const [machineMode, setMachineMode] = useState("library");
  const [machinePerHour, setMachinePerHour] = useState(0.30);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [locationPerHour, setLocationPerHour] = useState(15);
  const [materials, setMaterials] = useState(0);
  const [externalInvestment, setExternalInvestment] = useState(0);
  const [rate, setRate] = useState(0.06483);
  const [currency, setCurrency] = useState("CAD");
  const [region, setRegion] = useState("Quebec, Canada");
  const [rateSource, setRateSource] = useState("Hydro-Québec reference");
  const [rateConfidence, setRateConfidence] = useState("Regional reference");
  const [rateStatus, setRateStatus] = useState("");
  const [creatorAdjustment, setCreatorAdjustment] = useState(0);
  const [skin, setSkin] = useState("digital");
  const [buddyEnabled, setBuddyEnabled] = useState(false);
  const [finalizedProject, setFinalizedProject] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const savedRate = Number(localStorage.getItem("kwk-local-rate"));
    const savedCurrency = localStorage.getItem("kwk-local-currency");
    const savedSkin = localStorage.getItem("kwk-calculator-skin");
    if (Number.isFinite(savedRate) && savedRate > 0) setRate(savedRate);
    if (savedCurrency) setCurrency(savedCurrency);
    if (["digital", "medieval"].includes(savedSkin)) setSkin(savedSkin);
  }, []);

  useEffect(() => {
    if (rate > 0) localStorage.setItem("kwk-local-rate", String(rate));
    localStorage.setItem("kwk-local-currency", currency);
    localStorage.setItem("kwk-calculator-skin", skin);
  }, [rate, currency, skin]);

  const machineLibraryTotal = useMemo(() =>
    selectedMachines.reduce((sum, id) => {
      const item = MACHINE_LIBRARY.find(([machineId]) => machineId === id);
      return sum + (item?.[2] || 0);
    }, 0), [selectedMachines]);

  const values = useMemo(() => {
    const safeRate = rate > 0 ? rate : 0.00001;
    const effectiveMachineRate = machineMode === "library" ? machineLibraryTotal : machinePerHour;
    const humanPhysicalKWh = humanEnergy * presence * hours;
    const humanJoules = humanPhysicalKWh * 3600000;
    const humanWh = humanPhysicalKWh * 1000;
    const human = humanPhysicalKWh * coefficient;
    const machines = effectiveMachineRate * hours;
    const location = (locationPerHour / safeRate) * hours;
    const materialEnergy = materials / safeRate;
    const externalInvestmentEnergy = externalInvestment / safeRate;
    const estimated = human + machines + location + materialEnergy + externalInvestmentEnergy;
    const finalValue = Math.max(0, estimated + creatorAdjustment);
    return { humanPhysicalKWh, humanJoules, humanWh, human, machines, location, materialEnergy, externalInvestmentEnergy, estimated, finalValue, effectiveMachineRate, localEquivalent: finalValue * safeRate };
  }, [humanEnergy, presence, hours, machineMode, machinePerHour, machineLibraryTotal, locationPerHour, materials, externalInvestment, rate, creatorAdjustment]);

  function applyJobPreset(name) {
    setJobPreset(name);
    const [humanName, p, machine, location, material] = JOB_PRESETS[name];
    setHumanPreset(humanName);
    setHumanEnergy(HUMAN_PRESETS[humanName]);
    setPresence(p);
    setMachineMode("custom");
    setMachinePerHour(machine);
    setLocationPerHour(location);
    setMaterials(material);
    setSelectedMachines([]);
  }

  function toggleMachine(id) {
    setSelectedMachines((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }

  function useMyLocation() {
    setRateStatus("Requesting location permission…");
    if (!navigator.geolocation) {
      setRateStatus("Location is not supported by this browser. Use a custom rate.");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const matchedRegion = detectSupportedRegion(position.coords.latitude, position.coords.longitude);
      if (!matchedRegion) {
        setRateStatus("Location detected, but no verified regional reference is configured yet. Use a custom rate.");
        return;
      }
      const reference = REGIONAL_RATE_REFERENCES[matchedRegion];
      setRegion(matchedRegion);
      setRate(reference.rate);
      setCurrency(reference.currency);
      setRateSource(reference.source);
      setRateConfidence(reference.confidence);
      setRateStatus(`Detected ${matchedRegion}. Reference applied.`);
    }, () => setRateStatus("Location permission was declined or unavailable. Use a custom rate."), { enableHighAccuracy: false, timeout: 10000 });
  }

  function finalizeProject() {
    const snapshot = {
      id: `KWK-${Date.now()}`,
      projectName: projectName.trim() || "Untitled project",
      projectType,
      projectDescription: projectDescription.trim(),
      creatorName: creatorName.trim(),
      evidenceLinks: evidenceLinks.trim(),
      createdAt: new Date().toISOString(),
      inputs: { humanEnergy, presence, hours, coefficient, machineMode, machinePerHour, selectedMachines, locationPerHour, materials, externalInvestment, rate, currency, region, rateSource, rateConfidence, creatorAdjustment },
      values: { ...values },
    };
    setFinalizedProject(snapshot);
    setReview(null);
  }

  function runPlausibilityReview() {
    if (!finalizedProject) return;
    const warnings = [];
    const notes = [];
    if (!finalizedProject.projectDescription) warnings.push("Add a project description so the calculation can be judged against the work performed.");
    if (finalizedProject.inputs.presence > 0.9 && finalizedProject.inputs.hours > 8) warnings.push("Sustained Presence above 0.9 for more than 8 hours deserves supporting notes or segmentation.");
    if (finalizedProject.inputs.machineMode === "library" && finalizedProject.inputs.selectedMachines.length === 0) notes.push("No machine energy was selected from the library.");
    if (finalizedProject.inputs.rateConfidence === "Custom value") notes.push("A custom energy exchange reference was used; preserve the source or bill with the ledger entry.");
    if (finalizedProject.inputs.externalInvestment > 0 && finalizedProject.inputs.materials > 0) notes.push("Confirm that external investment and material cost are separate amounts and not the same money counted twice.");
    if (finalizedProject.values.finalValue < 0 || !Number.isFinite(finalizedProject.values.finalValue)) warnings.push("The final value is mathematically invalid.");
    setReview({
      arithmetic: Number.isFinite(finalizedProject.values.finalValue) ? "PASS" : "FAIL",
      duplicateRisk: warnings.some((item) => item.includes("counted twice")) ? "REVIEW" : "PASS",
      plausibility: warnings.length ? "REVIEW" : "PASS",
      warnings, notes,
    });
  }

  return (
    <main className={`kwk-calculator-shell skin-${skin}`}>
      <header className="kwk-calculator-hero">
        <p className="eyebrow">KINGDOMWATT</p>
        <h1>KingdomWatt Project Calculator</h1>
        <p>Describe a project, calculate the energy and recognized contribution invested in it, then prepare a reviewable ledger draft.</p>
        <div className="calculator-skin-switch" role="group" aria-label="Calculator skin">
          <span>Calculator skin</span>
          <button className={skin === "digital" ? "active" : ""} onClick={() => setSkin("digital")}>Digital</button>
          <button className={skin === "medieval" ? "active" : ""} onClick={() => setSkin("medieval")}>Medieval Abacus</button>
          <label className="buddy-toggle"><input type="checkbox" checked={buddyEnabled} onChange={(e) => setBuddyEnabled(e.target.checked)} /> Buddy reactions</label>
        </div>
      </header>

      <div className="kwk-calculator-layout">
        <section className="kwk-calculator-panel">
          <div className="kwk-project-card">
            <p className="eyebrow">PROJECT</p>
            <div className="kwk-two-columns">
              <label className="kwk-field"><span>Project name</span><input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="KingdomWatt calculator update" /></label>
              <label className="kwk-field"><span>Project type</span><input value={projectType} onChange={(e) => setProjectType(e.target.value)} /></label>
              <label className="kwk-field"><span>Creator / team</span><input value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="Name or team" /></label>
              <label className="kwk-field"><span>Evidence or links</span><input value={evidenceLinks} onChange={(e) => setEvidenceLinks(e.target.value)} placeholder="Optional URLs, files, receipts" /></label>
            </div>
            <label className="kwk-field"><span>Short project description</span><textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows="4" placeholder="What was created, changed, repaired, researched, or delivered?" /></label>
          </div>

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
                <strong>Why is the coefficient 625?</strong>
                <span>The Kingdom believes that one hour of routine, honest contribution should be worth enough to feed one adult for one day.</span>
                <span>At normal Presence (P = 0.5):</span>
                <code>0.6 × 0.5 × 625 = 187.5 KW₭</code>
                <span>Using the calculator’s rounded Québec launch reference of about $0.08 CAD per kWh:</span>
                <code>187.5 KW₭ ≈ $15 CAD</code>
                <span>That is close to one adult day of basic home-prepared food and almost the price of two Canadian Big Macs.</span>
                <span>Historical studies also show that, in some places and periods, about one gram of silver could represent one day of basic subsistence.</span>
                <span>These comparisons do not make 625 a law of nature. They show why the Kingdom chose it as a human-dignity standard: one normal hour of contribution should renew one person’s basic nourishment for one day.</span>
                <span>625 is not random. It connects routine contribution to one day of nourishment.</span>
                <small>The dollar amount is a comparison only—not a wage promise, cash value, silver peg, or redemption guarantee.</small>
              </>} />

            <NumberField label="Hours deployed" value={hours} onChange={setHours} step="0.25"
              help="Actively working on, reviewing, practicing, or otherwise deploying effort."
              info={<>
                <strong>Hours Deployed</strong>
                <span>Hours actively creating, reviewing, practicing, or otherwise deploying effort.</span>
              </>} />
          </div>

          <h2>3. Machines, place, and materials</h2>
          <div className="kwk-machine-mode" role="group" aria-label="Machine input mode">
            <button className={machineMode === "library" ? "active" : ""} onClick={() => setMachineMode("library")}>Use Machine Library</button>
            <button className={machineMode === "custom" ? "active" : ""} onClick={() => setMachineMode("custom")}>Enter Custom Total</button>
          </div>

          {machineMode === "custom" ? (
            <NumberField label="Custom machine energy per hour" value={machinePerHour} onChange={setMachinePerHour} step="0.01"
              help="Custom mode replaces the Machine Library. The two values are never added together."
              info={<><strong>Custom Machine Energy</strong><span>Use one combined hourly estimate only when the library does not fit the project.</span><span>Choosing custom mode prevents library machines from being counted again.</span></>} />
          ) : (
            <div className="kwk-machine-library">
              <p>Select every machine used. The library replaces the custom machine total, preventing double-counting.</p>
              <div className="kwk-machine-grid">
                {MACHINE_LIBRARY.map(([id, label, machineRate]) => (
                  <label key={id}>
                    <input type="checkbox" checked={selectedMachines.includes(id)} onChange={() => toggleMachine(id)} />
                    <span>{label}</span><strong>{machineRate.toFixed(2)} kWh/h</strong>
                  </label>
                ))}
              </div>
              <div className="kwk-machine-total"><span>Machine library total</span><strong>{machineLibraryTotal.toFixed(2)} kWh/h</strong></div>
            </div>
          )}

          <div className="kwk-two-columns">
            <NumberField label={`Location cost per hour (${currency})`} value={locationPerHour} onChange={setLocationPerHour} step="0.5" />
            <NumberField label={`Material cost (${currency})`} value={materials} onChange={setMaterials} step="0.5" />
            <NumberField label={`External investment (${currency})`} value={externalInvestment} onChange={setExternalInvestment} step="0.5"
              help="Donations, Ko-fi, Patreon, grants, sponsorships, crowdfunding, or gifts entering this project."
              info={<><strong>External Investment</strong><span>Financial support is normalized through the selected Energy Exchange Reference.</span><code>External investment ÷ local rate = energy-equivalent KW₭</code><span>The Human Contribution Coefficient does not apply to purchased or donated resources.</span></>} />
            <NumberField label="King's / creator's adjustment (KWK)" value={creatorAdjustment}
              onChange={setCreatorAdjustment} min="-999999" step="1"
              help="The calculator estimates. The King or creator records the official value." />
          </div>

          <h2>4. Energy Exchange Reference</h2>
          <div className="kwk-rate-card">
            <div>
              <strong>{region}</strong>
              <span>{rateSource}</span>
              <small>{rateConfidence}</small>
            </div>
            <button onClick={useMyLocation}>Use my location</button>
          </div>
          {rateStatus ? <p className="kwk-rate-status">{rateStatus}</p> : null}
          <div className="kwk-two-columns">
            <NumberField label={`Electricity reference (${currency}/kWh)`} value={rate} onChange={(value) => { setRate(value); setRateSource("Visitor-entered reference"); setRateConfidence("Custom value"); }} step="0.00001"
              help="A custom value is allowed and is marked in the ledger for reproducibility." />
            <label className="kwk-field">
              <span>Local currency code</span>
              <input value={currency} maxLength="3" onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
              <small>Examples: CAD, USD, EUR.</small>
            </label>
          </div>

          <EnergyFoundation jobPreset={jobPreset} values={values} humanEnergy={humanEnergy} presence={presence} hours={hours} coefficient={coefficient} />
        </section>

        <aside className="kwk-result-panel">
          {skin === "medieval" ? (
            <MedievalAbacus values={values} humanEnergy={humanEnergy} presence={presence} hours={hours} coefficient={coefficient} creatorAdjustment={creatorAdjustment} currency={currency} rate={rate} />
          ) : (
            <>
              <p className="eyebrow">ESTIMATED CREATIVE ENERGY VALUE</p>
              <h2>⚡ {Math.round(values.finalValue).toLocaleString()} KWK</h2>
              <blockquote>“This work cost me {Math.round(values.finalValue).toLocaleString()} KWK of my life to make.”</blockquote>
              <dl className="kwk-breakdown">
                <div><dt>Human physical energy</dt><dd>{values.humanPhysicalKWh.toFixed(4)} kWh</dd></div>
                <div><dt>Human creative accounting</dt><dd>{values.human.toFixed(2)} KWK</dd></div>
                <div><dt>Machines</dt><dd>{values.machines.toFixed(2)} KWK</dd></div>
                <div><dt>Location</dt><dd>{values.location.toFixed(2)} KWK</dd></div>
                <div><dt>Materials</dt><dd>{values.materialEnergy.toFixed(2)} KWK</dd></div>
                <div><dt>External investment</dt><dd>{values.externalInvestmentEnergy.toFixed(2)} KWK</dd></div>
                <div><dt>Estimated subtotal</dt><dd>{values.estimated.toFixed(2)} KWK</dd></div>
                <div><dt>King's / creator's adjustment</dt><dd>{creatorAdjustment.toFixed(2)} KWK</dd></div>
              </dl>
              <div className="kwk-local-result">
                <span>Estimated value in your local energy market</span>
                <strong>{values.localEquivalent.toFixed(2)} {currency}</strong>
                <small>{rate.toFixed(5)} {currency} per kWh</small>
              </div>
              <p className="kwk-note">KWK remains the unit of account. Local currency is an energy-exchange reference, not the intrinsic worth of the creation.</p>
              <div className="kwk-ledger-actions">
                <button className="kwk-primary-action" onClick={finalizeProject}>Finalize Project</button>
                <small>Freezes this calculation into a reviewable project draft. It does not yet add anything to the official ledger.</small>
              </div>
              {finalizedProject ? (
                <div className="kwk-finalized-card">
                  <p className="eyebrow">DRAFT LEDGER PROJECT</p>
                  <strong>{finalizedProject.projectName}</strong>
                  <span>{Math.round(finalizedProject.values.finalValue).toLocaleString()} KWK</span>
                  <small>{new Date(finalizedProject.createdAt).toLocaleString()}</small>
                  <button onClick={runPlausibilityReview}>Run plausibility review</button>
                  {review ? (
                    <div className="kwk-review">
                      <div><span>Arithmetic</span><strong>{review.arithmetic}</strong></div>
                      <div><span>Double-counting</span><strong>{review.duplicateRisk}</strong></div>
                      <div><span>Plausibility</span><strong>{review.plausibility}</strong></div>
                      {review.warnings.map((item) => <p key={item}>⚠ {item}</p>)}
                      {review.notes.map((item) => <p key={item}>• {item}</p>)}
                      <small>This is an automated pre-check. A future Kingdom Auditor service can replace it with a fuller AI review before official ledger submission.</small>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
          <BuddyReaction enabled={buddyEnabled} values={values} hours={hours} />
        </aside>
      </div>
    </main>
  );
}
