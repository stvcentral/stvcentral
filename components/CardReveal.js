
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "stv-unlocked-cards";

function getUnlocked() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CardReveal({ song }) {
  const [visible, setVisible] = useState(false);
  const [slamming, setSlamming] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const unlocked = getUnlocked();
    if (!unlocked.includes(song.slug)) setVisible(true);
  }, [song.slug]);

  function reveal() {
    if (slamming) return;
    setSlamming(true);

    setTimeout(() => {
      setRevealed(true);
      const unlocked = getUnlocked();
      if (!unlocked.includes(song.slug)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked, song.slug]));
      }
    }, 520);

    setTimeout(() => setVisible(false), 1800);
  }

  if (!visible) return null;

  return (
    <div className={`card-reveal-overlay ${slamming ? "is-slamming" : ""} ${revealed ? "is-revealed" : ""}`}>
      <div className="card-reveal-stage">
        <div className="slammer" aria-hidden="true">STV</div>
        <div className="reveal-card">
          <div className="reveal-card-inner">
            <div className="reveal-card-back">
              <img src="/media/card-back.png" alt="Royal Chaos card back" />
            </div>
            <div className="reveal-card-front">
              {song.artwork ? (
                <img src={song.artwork} alt={`${song.title} card`} />
              ) : (
                <div className="reveal-placeholder">
                  <strong>{song.cardCode}</strong>
                  <span>{song.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reveal-copy">
          <p className="eyebrow">{revealed ? "CARD REVEALED" : "ROYAL CHAOS"}</p>
          <h1>{revealed ? song.title : "A card is waiting."}</h1>
          {!revealed && <button onClick={reveal}>SLAM TO REVEAL</button>}
        </div>
      </div>
    </div>
  );
}
