import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../../data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ project: project.slug }));
}

export default async function ProjectPage({ params }) {
  const { project: projectSlug } = await params;
  const project = getProject(projectSlug);
  if (!project) notFound();

  return (
    <main className="page-shell">
      <header className="project-hero">
        {project.artwork ? (
          <img src={project.artwork} alt={`${project.name} artwork`} />
        ) : (
          <div className="project-placeholder large">{project.name.charAt(0)}</div>
        )}
        <div>
          <p className="eyebrow">{project.status}</p>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
        </div>
      </header>

      {project.albums.length > 0 && (
        <section className="project-section">
          <h2>Albums and releases</h2>
          <div className="release-grid">
            {project.albums.map((album) => (
              <Link href={`/projects/${project.slug}/albums/${album.slug}`} className="release-card" key={album.slug}>
                <p className="eyebrow">{album.status}</p>
                <h3>{album.title}</h3>
                <p>{album.description}</p>
                <span>Open release ›</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {project.songs.length > 0 && (
        <section className="project-section">
          <h2>Songs</h2>
          <div className="legacy-song-list">
            {project.songs.map((song) => (
              <Link href={`/projects/${project.slug}/${song.slug}`} key={song.slug}>
                <div>
                  <strong>{song.title}</strong>
                  <span>{song.release}</span>
                </div>
                <b>›</b>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
