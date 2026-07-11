import Link from "next/link";
import { projects } from "../../data/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">MUSICAL HISTORY</p>
        <h1>Projects</h1>
        <p>Pages are live now and can be enriched over time.</p>
      </header>

      <section className="project-grid">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} className="project-card" key={project.slug}>
            {project.artwork ? (
              <img src={project.artwork} alt={`${project.name} artwork`} />
            ) : (
              <div className="project-placeholder">{project.name.charAt(0)}</div>
            )}
            <div>
              <p className="eyebrow">{project.status}</p>
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
              <span>Open project ›</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
