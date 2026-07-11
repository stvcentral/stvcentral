import Link from "next/link";
import { songs } from "../../data/songs";
export const metadata = { title: "The Collection" };
export default function MusicPage() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">ROYAL CHAOS</p>
        <h1>The Collection</h1>
        <p>54 permanent song homes. Each physical card points directly to its song.</p>
      </header>
      <section className="song-grid">
        {songs.map(song => (
          <Link href={`/song/${song.slug}`} className="song-tile" key={song.id}>
            {song.artwork ? <img src={song.artwork} alt={`${song.title} artwork`} /> :
              <div className="tile-placeholder"><span>{song.cardCode}</span><small>{song.cardName}</small></div>}
            <div>
              <h2>{song.title}</h2>
              <p>{song.cardName} · {song.musicalKey} · {song.bpm} BPM · {song.duration}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
