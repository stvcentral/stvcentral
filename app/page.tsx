import Link from "next/link";
import { songs } from "@/data/songs";

export default function Home() {
  const featured = songs[0];

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE PHYSICAL ALBUM, REIMAGINED</p>
          <h1>Music with a permanent home.</h1>
          <p>
            Every STV song card opens a living page containing the song,
            its story, lyrics, and everything added to it over time.
          </p>
          <div className="actions">
            <Link className="button primary" href={`/song/${featured.slug}`}>
              Play latest song
            </Link>
            <Link className="button secondary" href="/music">
              View discography
            </Link>
          </div>
        </div>

        <Link href={`/song/${featured.slug}`} className="featured-card">
          <img src={featured.artwork} alt={`${featured.title} artwork`} />
          <div>
            <span>Featured release</span>
            <strong>{featured.title}</strong>
          </div>
        </Link>
      </section>

      <section className="home-grid">
        <article id="shop">
          <p className="eyebrow">SHOP</p>
          <h2>Physical song-card albums</h2>
          <p>The cards are the album—not an accessory to it.</p>
          <span className="status">Store opening soon</span>
        </article>
        <article id="about">
          <p className="eyebrow">ABOUT</p>
          <h2>Why STV Central exists</h2>
          <p>A permanent place where Vincent’s artistic output can live and thrive.</p>
        </article>
        <article id="contact">
          <p className="eyebrow">CONTACT</p>
          <h2>Collaborations, sponsors and shows</h2>
          <p>Contact details will be added before public release.</p>
        </article>
      </section>
    </main>
  );
}
