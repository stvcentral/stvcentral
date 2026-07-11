
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CardVisual } from "./CardVisual";
import EnergeticValue from "./EnergeticValue";

const STORAGE_KEY = "stv-unlocked-cards";

export default function CollectionGrid({ songs }) {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    try {
      setUnlocked(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      setUnlocked([]);
    }
  }, []);

  return (
    <>
      <div className="collection-progress">
        <strong>{unlocked.length} / {songs.length}</strong>
        <span>cards revealed in this browser</span>
      </div>

      <section className="song-grid refined-grid">
        {songs.map((song) => {
          const isUnlocked = unlocked.includes(song.slug);
          return (
            <Link href={`/song/${song.slug}`} className={`song-tile refined-tile ${isUnlocked ? "unlocked" : "locked"}`} key={song.id}>
              <div className="collection-card-visual">
                {isUnlocked ? (
                  song.artwork ? (
                    <img className="tile-artwork" src={song.artwork} alt={`${song.title} artwork`} />
                  ) : (
                    <CardVisual song={song} compact />
                  )
                ) : (
                  <img className="tile-artwork card-back-tile" src="/media/card-back.png" alt="Face-down Royal Chaos card" />
                )}
                {isUnlocked && song.energeticValue ? (
                  <div className="collection-energy"><EnergeticValue value={song.energeticValue} compact /></div>
                ) : null}
              </div>

              <div className="tile-copy">
                <h2>{isUnlocked ? song.title : "Unrevealed card"}</h2>
                <p className="tile-card-name">{isUnlocked ? song.cardName : "Scan or open to reveal"}</p>
                <p className="tile-meta">{isUnlocked ? `${song.musicalKey} · ${song.bpm} BPM · ${song.duration}` : "The music remains available."}</p>
                <span className="view-song">{isUnlocked ? "View song" : "Reveal card"} <b>›</b></span>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
