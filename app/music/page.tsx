import Link from "next/link";
import { songs } from "@/data/songs";

export const metadata = {
  title: "Music"
};

export default function MusicPage() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">DISCOGRAPHY</p>
        <h1>Music</h1>
        <p>Each card is the physical edition of a song.</p>
      </header>

      <section className="song-grid">
        {songs.map((song) => (
          <Link href={`/song/${song.slug}`} className="song-tile" key={song.id}>
            <img src={song.artwork} alt={`${song.title} artwork`} />
            <div>
              <h2>{song.title}</h2>
              <p>{song.cardNumber} of {song.suit} · {song.musicalKey} · {song.bpm} BPM</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
