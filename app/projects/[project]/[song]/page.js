import { notFound } from "next/navigation";
import { getProject, getProjectSong, projects } from "../../../../data/projects";

export function generateStaticParams() {
  return projects.flatMap((project) =>
    project.songs.map((song) => ({ project: project.slug, song: song.slug }))
  );
}

export default async function ProjectSongPage({ params }) {
  const { project: projectSlug, song: songSlug } = await params;
  const project = getProject(projectSlug);
  const song = getProjectSong(projectSlug, songSlug);
  if (!project || !song) notFound();

  return (
    <main className="page-shell legacy-song-page">
      <header>
        <p className="eyebrow">{project.name} · {song.release}</p>
        <h1>{song.title}</h1>
      </header>

      {song.audio ? (
        <section className="legacy-audio">
          <audio controls preload="metadata" src={song.audio} />
        </section>
      ) : (
        <section className="coming-soon">Audio can be added later without changing this page.</section>
      )}

      {song.credits.length > 0 && (
        <section className="project-section">
          <h2>Credits</h2>
          {song.credits.map((credit) => <p key={credit}>{credit}</p>)}
        </section>
      )}

      <section className="project-section lyrics">
        <h2>Lyrics</h2>
        {song.lyrics.length > 0
          ? song.lyrics.map((line, index) => <p key={index}>{line}</p>)
          : <p>Lyrics coming later.</p>}
      </section>

      <section className="project-section">
        <h2>Story, video and additional credits</h2>
        <p>These can be added later.</p>
      </section>
    </main>
  );
}
