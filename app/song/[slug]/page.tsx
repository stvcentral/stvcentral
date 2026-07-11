import { notFound } from "next/navigation";
import Player from "@/components/Player";
import { getSong, songs } from "@/data/songs";

export function generateStaticParams() {
  return songs.map((song) => ({ slug: song.slug }));
}

export default async function SongPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const song = getSong(slug);

  if (!song) notFound();

  return (
    <>
      <main className="song-page">
        <section className="song-hero">
          <img className="song-artwork" src={song.artwork} alt={`${song.title} artwork`} />
          <div className="song-summary">
            <p className="eyebrow">STV SONG CARD · {song.cardNumber} OF {song.suit.toUpperCase()}</p>
            <h1>{song.title}</h1>
            <dl className="metadata">
              <div><dt>Key</dt><dd>{song.musicalKey}</dd></div>
              <div><dt>BPM</dt><dd>{song.bpm}</dd></div>
              <div><dt>Length</dt><dd>{song.duration}</dd></div>
              <div><dt>URL</dt><dd>stvcentral.com/song/{song.slug}</dd></div>
            </dl>
            <audio className="main-audio" controls preload="metadata" src={song.audio} />
          </div>
        </section>

        <section className="song-sections">
          <article>
            <p className="eyebrow">WHY DOES THIS SONG EXIST?</p>
            <h2>Two singers growing through each other</h2>
            <p>{song.why}</p>
          </article>

          <article>
            <p className="eyebrow">PLAY IT</p>
            <h2>Guitar and piano</h2>
            <p>
              Key: {song.musicalKey}. Chord highlighting and instrument views
              will be added without changing this permanent page address.
            </p>
          </article>

          <article className="lyrics">
            <p className="eyebrow">LYRICS</p>
            <h2>{song.title}</h2>
            {song.lyrics.map((part) => (
              <section key={part.section}>
                <h3>{part.section}</h3>
                {part.lines.map((line) => <p key={line}>{line}</p>)}
              </section>
            ))}
          </article>
        </section>
      </main>

      <Player song={song} />
    </>
  );
}
