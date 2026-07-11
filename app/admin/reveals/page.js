
"use client";

import { useState } from "react";
import PrivateNav from "../../../components/PrivateNav";

const demoCards = ["3♥", "5♠", "J♦", "7♣", "Q♥", "9♠", "A♦", "4♣", "K♥", "2♠"];

export default function RevealLab() {
  const [mode, setMode] = useState("single");
  const [run, setRun] = useState(0);

  return (
    <>
      <PrivateNav />
      <main className="reveal-lab-shell">
        <header>
          <p className="eyebrow">PRIVATE PROTOTYPE</p>
          <h1>Reveal Lab</h1>
          <p>Animation sketches. Restart them, compare them, then we refine the winner.</p>
        </header>

        <div className="reveal-lab-tabs">
          {["single", "booster", "deck"].map((item) => (
            <button key={item} className={mode === item ? "active" : ""} onClick={() => { setMode(item); setRun(run + 1); }}>
              {item === "single" ? "Single — Slammer" : item === "booster" ? "Booster — Meteors" : "Full deck — Earthquake"}
            </button>
          ))}
          <button onClick={() => setRun(run + 1)}>Restart animation</button>
        </div>

        <section className={`reveal-lab-stage reveal-${mode}`} key={`${mode}-${run}`}>
          {mode === "single" && (
            <>
              <div className="lab-slammer">STV</div>
              <div className="lab-single-card"><img src="/media/card-back.png" alt="" /></div>
              <h2>SLAM!</h2>
            </>
          )}

          {mode === "booster" && (
            <>
              <div className="meteor-sky">
                {demoCards.slice(0, 7).map((card, i) => (
                  <div className="meteor-card" style={{ "--i": i }} key={card}>
                    <span>{card}</span>
                  </div>
                ))}
              </div>
              <h2>Seven impacts. Seven reveals.</h2>
            </>
          )}

          {mode === "deck" && (
            <>
              <div className="deck-rumble">
                {Array.from({ length: 54 }, (_, i) => (
                  <div className="mini-deck-card" style={{ "--i": i }} key={i}>
                    <span>{i + 1}</span>
                  </div>
                ))}
              </div>
              <h2>YEEEEAAAAAAAH! — 54 cards flip.</h2>
            </>
          )}
        </section>
      </main>
    </>
  );
}
