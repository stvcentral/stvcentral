'use client';
import { useEffect, useState } from 'react';

export default function SongStreaming({ title, links }) {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const stopEmbed = event => {
      if (event.target instanceof HTMLMediaElement) setSelected(null);
    };
    document.addEventListener('play', stopEmbed, true);
    return () => document.removeEventListener('play', stopEmbed, true);
  }, []);
  if (!links.length) return null;
  function select(provider) {
    document.querySelectorAll('audio, video').forEach(player => player.pause());
    setSelected(provider);
  }
  const active = links.find(link => link.provider === selected);
  return <section className="song-streaming" aria-label={`Stream ${title}`}>
    <p className="eyebrow">LISTEN & WATCH</p>
    <div className="actions">
      {links.map(link => <button key={link.provider} type="button" className="button secondary" aria-pressed={selected === link.provider} onClick={() => select(link.provider)}>
        {link.provider === 'youtube' ? 'Watch lyric video' : 'Listen on Spotify'}
      </button>)}
    </div>
    {!active && <p>Choose a player to load it. Playback is provided by YouTube or Spotify under their own privacy policies.</p>}
    {active && <>
      <iframe key={active.embed} className={`streaming-frame streaming-${active.provider}`} src={active.embed} title={`${title} on ${active.label}`} width="100%" height={active.provider === 'spotify' ? 352 : 315} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      <button type="button" className="text-link" onClick={() => setSelected(null)}>Close player</button>
    </>}
    <div className="actions">{links.map(link => <a key={link.provider} className="text-link" href={link.url} target="_blank" rel="noopener noreferrer">Open in {link.label}<span className="streaming-new-tab"> (new tab)</span></a>)}</div>
    {links.some(link => link.provider === 'spotify') && <p>Spotify controls playback availability. Open the song in Spotify to save it to your library.</p>}
  </section>;
}
