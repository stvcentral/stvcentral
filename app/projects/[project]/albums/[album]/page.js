import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectAlbum, projects } from "../../../../../data/projects";

export function generateStaticParams() {
  return projects.flatMap((project) =>
    project.albums.map((album) => ({ project: project.slug, album: album.slug }))
  );
}

export default async function AlbumPage({ params }) {
  const { project: projectSlug, album: albumSlug } = await params;
  const project = getProject(projectSlug);
  const album = getProjectAlbum(projectSlug, albumSlug);
  if (!project || !album) notFound();

  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">{project.name} · {album.status}</p>
        <h1>{album.title}</h1>
        <p>{album.description}</p>
      </header>

      <section className="project-section">
        <h2>Track list</h2>
        {album.tracks.length > 0 ? (
          <div className="legacy-song-list">
            {album.tracks.map((title) => {
              const song = project.songs.find((item) => item.title === title);
              return song ? (
                <Link href={`/projects/${project.slug}/${song.slug}`} key={title}>
                  <div><strong>{title}</strong></div><b>›</b>
                </Link>
              ) : <div className="release-card" key={title}>{title}</div>;
            })}
          </div>
        ) : <p>Track list coming later.</p>}
      </section>

      <section className="project-section">
        <h2>Artwork, credits and story</h2>
        <p>These can be added later.</p>
      </section>
    </main>
  );
}
