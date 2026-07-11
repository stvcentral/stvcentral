"use client";
import { useMemo, useRef, useState } from "react";
import { songs } from "../data/songs";

export default function Player({ song }) {
  const audioRef = useRef(null);
  const playable = useMemo(() => songs.filter((item) => item.audio), []);
  const initialIndex = Math.max(0, playable.findIndex((item) => item.slug === song.slug));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [open, setOpen] = useState(true);
  const current = playable[currentIndex] || song;

  function playAt(index) {
    if (!playable.length) return;
    const safe = (index + playable.length) % playable.length;
    setCurrentIndex(safe);
    setTimeout(() => audioRef.current?.play(), 50);
  }

  return (
    <aside className={`player ${open ? "player-open" : "player-closed"}`}>
      <button className="player-toggle" type="button" onClick={() => setOpen(v => !v)}>
        {open ? "›" : "♫"}
      </button>
      {open && (
        <div className="player-content">
          {current.artwork ? <img src={current.artwork} alt="" className="player-art" /> :
            <div className="player-art placeholder-small">{current.cardCode}</div>}
          <div className="player-info">
            <strong>{current.title}</strong>
            <span>{current.cardName} · {current.musicalKey} · {current.bpm} BPM</span>
          </div>
          {current.audio ? (
            <>
              <button className="skip-button" onClick={() => playAt(currentIndex - 1)}>‹</button>
              <audio key={current.audio} ref={audioRef} controls autoPlay preload="metadata"
                src={current.audio} onEnded={() => playAt(currentIndex + 1)} />
              <button className="skip-button" onClick={() => playAt(currentIndex + 1)}>›</button>
            </>
          ) : <span className="audio-pending">Audio coming soon</span>}
        </div>
      )}
    </aside>
  );
}
