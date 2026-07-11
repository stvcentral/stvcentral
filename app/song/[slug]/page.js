import { notFound } from "next/navigation";
import Player from "../../../components/Player";
import { CardVisual } from "../../../components/CardVisual";
import CardReveal from "../../../components/CardReveal";
import EnergeticValue from "../../../components/EnergeticValue";
import { getSong, songs } from "../../../data/songs";

export function generateStaticParams() {
  return songs.map(song => ({ slug: song.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const song = getSong(slug);
  return song ? { title: song.title } : {};
}
export default async function SongPage({ params }) {
  const { slug } = await params;
  const song = getSong(slug);
  if (!song) notFound();

  return (
    <>
      <CardReveal song={song} />
      <main className="song-page">
        <section className="song-hero">
          <div className="song-card-stage">
            {song.artwork ? <img className="song-artwork" src={song.artwork} alt={`${song.title} artwork`} /> : <CardVisual song={song} />}
            <div className="song-energy-hotspot"><EnergeticValue value={song.energeticValue} compact /></div>
          </div>
          <div className="song-summary">
            <p className="eyebrow">STV SONG CARD · {song.cardName.toUpperCase()}</p>
            <h1>{song.title}</h1>
            <dl className="metadata">
              <div><dt>Key</dt><dd>{song.musicalKey}</dd></div>
              <div><dt>BPM</dt><dd>{song.bpm}</dd></div>
              <div><dt>Length</dt><dd>{song.duration}</dd></div>
              <div><dt>Permanent URL</dt><dd>stvcentral.com/song/{song.slug}</dd></div>
            </dl>
            {song.audio ? <audio className="main-audio" controls preload="metadata" src={song.audio} /> :
              <div className="coming-soon">This permanent page is ready for its QR code. Audio will be added here.</div>}
          </div>
        </section>
        <section className="song-sections">
          <article>
            <p className="eyebrow">WHY DOES THIS SONG EXIST?</p>
            <h2>{song.why ? "The reason behind the song" : "Story coming soon"}</h2>
            <p>{song.why || "This section can be added later without changing the QR code."}</p>
          </article>
          <article>
            <p className="eyebrow">PLAY IT</p>
            <h2>Guitar and piano</h2>
            <p>Key: {song.musicalKey}. Chords and synchronized highlighting can be added later.</p>
          </article>
          <article className="lyrics">
            <p className="eyebrow">LYRICS</p>
            <h2>{song.title}</h2>
            {song.lyrics.length ? song.lyrics.map(part => (
              <section key={part.section}>
                <h3>{part.section}</h3>
                {part.lines.map((line, index) => <p key={`${part.section}-${index}`}>{line}</p>)}
              </section>
            )) : <p>Lyrics coming soon.</p>}
          </article>
        </section>
      </main>
      <Player song={song} />
    </>
  );
}
