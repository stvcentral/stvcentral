import Link from "next/link";
import { songs } from "../../data/songs";
import { CardVisual } from "../../components/CardVisual";

export const metadata = { title: "The Collection" };

export default function MusicPage() {
  return (
    <main className="page-shell collection-page">
      <header className="collection-heading">
        <div>
          <p className="eyebrow">ROYAL CHAOS</p>
          <h1>The Music Library</h1>
          <p>54 songs · 54 cards · one living album</p>
        </div>
      </header>

      <section className="song-grid refined-grid">
        {songs.map((song) => (
          <Link href={`/song/${song.slug}`} className="song-tile refined-tile" key={song.id}>
            {song.artwork ? (
              <img className="tile-artwork" src={song.artwork} alt={`${song.title} artwork`} />
            ) : (
              <CardVisual song={song} compact />
            )}

            <div className="tile-copy">
              <h2>{song.title}</h2>
              <p className="tile-card-name">{song.cardName}</p>
              <p className="tile-meta">{song.musicalKey} · {song.bpm} BPM · {song.duration}</p>
              <span className="view-song">View song <b>›</b></span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
