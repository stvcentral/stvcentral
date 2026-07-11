"use client";

import PrivateNav from "../../components/PrivateNav";

import { useEffect, useMemo, useState } from "react";
import { songs as initialSongs } from "../../data/songs";

const suitOrder = ["Hearts", "Diamonds", "Spades", "Clubs", "Jokers"];
const suitSymbols = { Hearts: "♥", Diamonds: "♦", Spades: "♠", Clubs: "♣", Jokers: "★" };

function linesToText(lyrics) {
  if (!Array.isArray(lyrics) || lyrics.length === 0) return "";
  return lyrics.map((part) => {
    const heading = part.section ? `[${part.section}]` : "";
    const lines = Array.isArray(part.lines) ? part.lines.join("\n") : "";
    return [heading, lines].filter(Boolean).join("\n");
  }).join("\n\n");
}

function textToLyrics(text) {
  return text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean).map((block, index) => {
    const lines = block.split("\n");
    const heading = lines[0]?.match(/^\[(.+)\]$/);
    if (heading) return { section: heading[1], lines: lines.slice(1).filter(Boolean) };
    return { section: index === 0 ? "Lyrics" : `Part ${index + 1}`, lines: lines.filter(Boolean) };
  });
}

function CardThumb({ song }) {
  const symbol = suitSymbols[song.suit] || "★";
  return (
    <div className={`admin-card-thumb suit-${song.suit.toLowerCase()}`}>
      <span>{song.rank}</span>
      <b>{symbol}</b>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(initialSongs[0]?.slug || "");
  const [song, setSong] = useState(initialSongs[0] || null);
  const [lyricsText, setLyricsText] = useState(linesToText(initialSongs[0]?.lyrics));
  const [cardFile, setCardFile] = useState(null);
  const [cardPreview, setCardPreview] = useState(initialSongs[0]?.artwork || "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSuit, setActiveSuit] = useState("All");

  useEffect(() => {
    const saved = sessionStorage.getItem("stv-admin-password");
    if (saved) setPassword(saved);
  }, []);

  useEffect(() => {
    function handleKeyboard(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveSong();
      }
    }
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  });

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialSongs.filter((item) => {
      const matchesQuery = !q || `${item.cardCode} ${item.title} ${item.slug}`.toLowerCase().includes(q);
      const matchesSuit = activeSuit === "All" || item.suit === activeSuit;
      return matchesQuery && matchesSuit;
    });
  }, [query, activeSuit]);

  const groupedSongs = useMemo(() => {
    return suitOrder.map((suit) => ({
      suit,
      songs: filteredSongs.filter((item) => item.suit === suit),
    })).filter((group) => group.songs.length > 0);
  }, [filteredSongs]);

  function chooseSong(slug) {
    const next = initialSongs.find((item) => item.slug === slug);
    if (!next) return;
    setSelectedSlug(slug);
    setSong({ ...next });
    setLyricsText(linesToText(next.lyrics));
    setCardFile(null);
    setCardPreview(next.artwork || "");
    setStatus("");
  }

  function updateField(field, value) {
    setSong((current) => ({ ...current, [field]: value }));
  }

  function rememberPassword(value) {
    setPassword(value);
    sessionStorage.setItem("stv-admin-password", value);
  }

  async function saveSong() {
    if (!song || !password || busy) return;
    setBusy(true);
    setStatus("Saving changes...");
    try {
      const response = await fetch("/api/admin/song", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({
          slug: song.slug,
          patch: {
            title: song.title,
            bpm: Number(song.bpm),
            musicalKey: song.musicalKey,
            duration: song.duration,
            why: song.why || "",
            lyrics: textToLyrics(lyricsText),
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setStatus("Saved. Vercel will redeploy automatically.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadCard() {
    if (!song || !cardFile || !password || busy) return;
    setBusy(true);
    setStatus("Uploading card...");
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(cardFile);
      });
      const extension = cardFile.name.split(".").pop()?.toLowerCase() || "png";
      const response = await fetch("/api/admin/card", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({
          slug: song.slug,
          cardCode: song.cardCode,
          extension,
          contentBase64: base64,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setCardPreview(result.artworkPath);
      setStatus("Card uploaded. Vercel will redeploy automatically.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Please drop a PNG, JPG, JPEG, or WEBP image.");
      return;
    }
    setCardFile(file);
    setCardPreview(URL.createObjectURL(file));
  }

  function moveSelection(direction) {
    const index = initialSongs.findIndex((item) => item.slug === selectedSlug);
    const next = initialSongs[(index + direction + initialSongs.length) % initialSongs.length];
    chooseSong(next.slug);
  }

  if (!song) return null;

  const missingArtwork = !song.artwork;
  const missingLyrics = !song.lyrics?.length;
  const missingStory = !song.why;

  return (
    <><PrivateNav /><main className="studio-admin">
      <header className="studio-admin-header">
        <div>
          <p className="eyebrow">PRIVATE WORKSPACE</p>
          <h1>STV Workspace</h1>
          <p>Drag in the card. Correct the words. Save.</p>
        </div>

        <div className="studio-admin-actions">
          <label>
            Admin password
            <input
              type="password"
              value={password}
              onChange={(event) => rememberPassword(event.target.value)}
              placeholder="Set in Vercel"
            />
          </label>
          <button onClick={saveSong} disabled={!password || busy}>
            {busy ? "Working..." : "Save changes"}
          </button>
        </div>
      </header>

      <section className="studio-admin-toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, card, or slug..."
        />
        <div className="studio-suit-tabs">
          {["All", ...suitOrder].map((suit) => (
            <button
              key={suit}
              className={activeSuit === suit ? "active" : ""}
              onClick={() => setActiveSuit(suit)}
            >
              {suit === "All" ? "All" : `${suitSymbols[suit]} ${suit}`}
            </button>
          ))}
        </div>
      </section>

      <div className="studio-admin-grid">
        <aside className="studio-deck-browser">
          {groupedSongs.map((group) => (
            <section key={group.suit}>
              <h2>{suitSymbols[group.suit]} {group.suit}</h2>
              <div className="studio-card-grid">
                {group.songs.map((item) => (
                  <button
                    key={item.slug}
                    className={item.slug === selectedSlug ? "active" : ""}
                    onClick={() => chooseSong(item.slug)}
                    title={item.title}
                  >
                    <CardThumb song={item} />
                    <span>{item.title}</span>
                    <i className="studio-status-dots">
                      {!item.artwork && <b title="Missing artwork">A</b>}
                      {!item.lyrics?.length && <b title="Missing lyrics">L</b>}
                      {!item.why && <b title="Missing story">S</b>}
                    </i>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <section className="studio-editor-panel">
          <div className="studio-editor-title-row">
            <div>
              <p className="eyebrow">{song.cardName}</p>
              <h2>{song.title}</h2>
            </div>
            <div className="studio-next-controls">
              <button onClick={() => moveSelection(-1)}>← Previous</button>
              <button onClick={() => moveSelection(1)}>Next →</button>
            </div>
          </div>

          <div className="studio-fields">
            <label>
              Title
              <input value={song.title} onChange={(e) => updateField("title", e.target.value)} />
            </label>
            <label>
              Key
              <input value={song.musicalKey} onChange={(e) => updateField("musicalKey", e.target.value)} />
            </label>
            <label>
              BPM
              <input type="number" value={song.bpm} onChange={(e) => updateField("bpm", e.target.value)} />
            </label>
            <label>
              Duration
              <input value={song.duration} onChange={(e) => updateField("duration", e.target.value)} />
            </label>
            <label className="studio-wide">
              Why this song exists
              <textarea value={song.why || ""} onChange={(e) => updateField("why", e.target.value)} />
            </label>
            <label className="studio-wide studio-lyrics">
              Lyrics
              <span>Use [Verse], [Chorus], [Bridge], etc.</span>
              <textarea value={lyricsText} onChange={(e) => setLyricsText(e.target.value)} />
            </label>
          </div>
        </section>

        <aside className="studio-card-uploader">
          <div className="studio-card-uploader-head">
            <div>
              <p className="eyebrow">CARD ARTWORK</p>
              <h2>{song.cardCode}</h2>
            </div>
            <div className="studio-missing-badges">
              {missingArtwork && <span>Missing artwork</span>}
              {missingLyrics && <span>Missing lyrics</span>}
              {missingStory && <span>Missing story</span>}
            </div>
          </div>

          <div
            className="studio-drop-card"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            {cardPreview ? (
              <img src={cardPreview} alt={`${song.title} card preview`} />
            ) : (
              <div>
                <CardThumb song={song} />
                <p>Drop card image here</p>
              </div>
            )}
          </div>

          <label className="studio-file-button">
            Choose card image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setCardFile(file);
                setCardPreview(URL.createObjectURL(file));
              }}
            />
          </label>

          <button className="studio-upload-button" onClick={uploadCard} disabled={!password || !cardFile || busy}>
            Upload card
          </button>

          <p className="studio-file-name">{cardFile?.name || "No new image selected"}</p>
          <small>Ctrl+S saves text changes.</small>
        </aside>
      </div>

      {status && <div className="studio-toast">{status}</div>}
    </main></>
  );
}
