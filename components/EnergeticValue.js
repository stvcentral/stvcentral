
"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_RATE = 0.06483;
const DEFAULT_CURRENCY = "CAD";

function formatMoney(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export default function EnergeticValue({ value, compact = false }) {
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    const savedRate = Number(localStorage.getItem("kwk-local-rate"));
    const savedCurrency = localStorage.getItem("kwk-local-currency");
    if (Number.isFinite(savedRate) && savedRate > 0) setRate(savedRate);
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  const localEquivalent = useMemo(() => Number(value || 0) * rate, [value, rate]);

  if (!value) return null;

  return (
    <span className={`kwk-value ${compact ? "compact" : ""}`} tabIndex="0">
      <span className="kwk-bolt" aria-hidden="true">⚡</span>
      <strong>{Number(value).toLocaleString()} KWK</strong>

      <span className="kwk-popover" role="tooltip">
        <span className="eyebrow">CREATIVE ENERGETIC VALUE</span>
        <b>This song required {Number(value).toLocaleString()} KWK of my life to bring into existence.</b>
        <span>Estimated value in your local energy market:</span>
        <strong>{formatMoney(localEquivalent, currency)}</strong>
        <small>Using {rate.toFixed(5)} {currency}/kWh. Set your own local rate in the KingdomWatt calculator.</small>
        <a href="/kingdomwatts/calculator">Open calculator →</a>
      </span>
    </span>
  );
}
