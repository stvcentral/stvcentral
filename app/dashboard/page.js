import PrivateNav from "../../components/PrivateNav";
import Link from "next/link";
import { projects } from "../../data/projects";

export const metadata = { title: "Dashboard" };

const royal = {"songs": 54, "artwork": 1, "lyrics": 1, "stories": 1, "audio": 1};

function ProgressRow({ label, value, total }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="dashboard-progress-row">
      <div><span>{label}</span><strong>{value} / {total}</strong></div>
      <div className="dashboard-progress-track">
        <span style={{ width: `${percent}%` }}></span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <><PrivateNav /><main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">PRIVATE OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>What is ready, what is missing, and where to go next.</p>
        </div>
        <Link className="dashboard-workspace-link" href="/workspace">Open Workspace →</Link>
      </header>

      <section className="dashboard-metrics">
        <article><span>Royal Chaos songs</span><strong>{royal.songs}</strong></article>
        <article><span>Previous-project songs</span><strong>14</strong></article>
        <article><span>Projects</span><strong>{projects.length}</strong></article>
        <article><span>Cards with artwork</span><strong>{royal.artwork}</strong></article>
      </section>

      <section className="dashboard-layout">
        <article className="dashboard-panel">
          <p className="eyebrow">ROYAL CHAOS</p>
          <h2>Completion</h2>
          <ProgressRow label="Artwork" value={royal.artwork} total={royal.songs} />
          <ProgressRow label="Lyrics" value={royal.lyrics} total={royal.songs} />
          <ProgressRow label="Why I wrote it" value={royal.stories} total={royal.songs} />
          <ProgressRow label="Audio" value={royal.audio} total={royal.songs} />
        </article>

        <article className="dashboard-panel">
          <p className="eyebrow">QUICK ACCESS</p>
          <h2>Projects</h2>
          <div className="dashboard-project-links">
            <Link href="/workspace">Royal Chaos <span>{royal.songs} songs</span></Link>
            {projects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.slug}>
                {project.name} <span>{project.songs.length} songs</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-panel">
        <p className="eyebrow">NEXT USEFUL ACTIONS</p>
        <h2>Missing content</h2>
        <div className="dashboard-tasks">
          <Link href="/workspace">Add {royal.songs - royal.artwork} missing card images</Link>
          <Link href="/workspace">Add {royal.songs - royal.lyrics} missing lyric sets</Link>
          <Link href="/workspace">Add {royal.songs - royal.stories} “Why I wrote it” entries</Link>
          <Link href="/workspace">Add {royal.songs - royal.audio} missing audio files</Link>
        </div>
      </section>
    </main></>
  );
}
