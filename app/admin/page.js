
"use client";

import { useEffect, useMemo, useState } from "react";
import { songs as initialSongs } from "../../data/songs";

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

  useEffect(() => {
    const saved = sessionStorage.getItem("stv-admin-password");
    if (saved) setPassword(saved);
  }, []);

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialSongs;
    return initialSongs.filter((item) =>
      `${item.cardCode} ${item.title} ${item.slug}`.toLowerCase().includes(q)
    );
  }, [query]);

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
    if (!song) return;
    setBusy(true);
    setStatus("Saving...");
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
    if (!song || !cardFile) return;
    setBusy(true);
    setStatus("Uploading...");
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
    if (!file.type.startsWith("image/")) return setStatus("Please drop an image file.");
    setCardFile(file);
    setCardPreview(URL.createObjectURL(file));
  }

  if (!song) return null;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">PRIVATE CONTENT MANAGER</p>
          <h1>STV Editor</h1>
          <p>Edit lyrics and drop card images directly in your browser.</p>
        </div>
        <label className="admin-password">
          Admin password
          <input type="password" value={password}
            onChange={(event) => rememberPassword(event.target.value)}
            placeholder="Set in Vercel" />
        </label>
      </header>

      <div className="admin-layout">
        <aside className="admin-song-list">
          <input className="admin-search" value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or card..." />
          <div>
            {filteredSongs.map((item) => (
              <button type="button" key={item.slug}
                className={item.slug === selectedSlug ? "active" : ""}
                onClick={() => chooseSong(item.slug)}>
                <strong>{item.cardCode}</strong><span>{item.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-editor">
          <div className="admin-fields">
            <label>Title<input value={song.title} onChange={(e) => updateField("title", e.target.value)} /></label>
            <label>Card<input value={song.cardName} disabled /></label>
            <label>Key<input value={song.musicalKey} onChange={(e) => updateField("musicalKey", e.target.value)} /></label>
            <label>BPM<input type="number" value={song.bpm} onChange={(e) => updateField("bpm", e.target.value)} /></label>
            <label>Duration<input value={song.duration} onChange={(e) => updateField("duration", e.target.value)} /></label>
            <label className="admin-wide">Why this song exists
              <textarea value={song.why || ""} onChange={(e) => updateField("why", e.target.value)} />
            </label>
          </div>

          <label className="admin-lyrics">
            Lyrics <span>Use [Verse], [Chorus], [Bridge] headings.</span>
            <textarea value={lyricsText} onChange={(e) => setLyricsText(e.target.value)} />
          </label>

          <button className="admin-save" type="button" onClick={saveSong} disabled={busy || !password}>
            Save text changes
          </button>
        </section>

        <aside className="admin-card-panel">
          <h2>Card image</h2>
          <div className="admin-drop-zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}>
            {cardPreview ? <img src={cardPreview} alt="Card preview" /> : <p>Drop card image here</p>}
          </div>

          <label className="admin-file-button">
            Choose image
            <input type="file" accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setCardFile(file);
                setCardPreview(URL.createObjectURL(file));
              }} />
          </label>

          <button type="button" onClick={uploadCard} disabled={busy || !cardFile || !password}>
            Upload card
          </button>
          <p className="admin-file-name">{cardFile?.name || "No new file selected"}</p>
        </aside>
      </div>

      {status && <div className="admin-status">{status}</div>}
    </main>
  );
}
