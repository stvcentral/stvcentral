import Link from "next/link";
import { songs } from "../data/songs";
export default function Home() {
  const featured = songs.find(song => song.slug === "2voices1fire") || songs[0];
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ROYAL CHAOS · 54 SONG-CARD ALBUM</p>
          <h1>Music with a permanent home.</h1>
          <p>Each physical card points directly to its song inside the album playlist.</p>
          <div className="actions">
            <Link className="button primary" href={`/song/${featured.slug}`}>Play featured song</Link>
            <Link className="button secondary" href="/music">View all 54 songs</Link>
          </div>
        </div>
        <Link href={`/song/${featured.slug}`} className="featured-card">
          <img src={featured.artwork} alt={`${featured.title} artwork`} />
          <div><span>Featured release</span><strong>{featured.title}</strong></div>
        </Link>
      </section>
    </main>
  );
}
