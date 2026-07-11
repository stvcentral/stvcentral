"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "@/data/songs";

export default function Player({ song }: { song: Song }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
  }, [song.audio]);

  return (
    <aside className={`player ${open ? "player-open" : "player-closed"}`}>
      <button
        className="player-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Collapse player" : "Open player"}
      >
        {open ? "›" : "♫"}
      </button>

      {open && (
        <div className="player-content">
          <img src={song.artwork} alt="" className="player-art" />
          <div className="player-info">
            <strong>{song.title}</strong>
            <span>{song.musicalKey} · {song.bpm} BPM</span>
          </div>
          <audio ref={audioRef} controls preload="metadata" src={song.audio} />
        </div>
      )}
    </aside>
  );
}
