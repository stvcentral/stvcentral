import PrivateNav from "../../components/PrivateNav";
import Link from "next/link";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <><PrivateNav /><main className="private-hub">
      <header className="private-hub-hero">
        <p className="eyebrow">PRIVATE AREA</p>
        <h1>STV Admin</h1>
        <p>Choose where you want to work.</p>
      </header>

      <section className="private-hub-grid">
        <Link href="/dashboard" className="private-hub-card">
          <span className="private-hub-icon">⌂</span>
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h2>Dashboard</h2>
            <p>Progress, missing content, and quick project access.</p>
          </div>
        </Link>

        <Link href="/workspace" className="private-hub-card">
          <span className="private-hub-icon">✎</span>
          <div>
            <p className="eyebrow">CONTENT</p>
            <h2>Workspace</h2>
            <p>Edit songs, lyrics, metadata, stories, and card artwork.</p>
          </div>
        </Link>

        <Link href="/admin/shop" className="private-hub-card">
          <span className="private-hub-icon">▣</span>
          <div>
            <p className="eyebrow">COMMERCE</p>
            <h2>Shop Editor</h2>
            <p>Edit product descriptions, planned prices, and product or mockup images.</p>
          </div>
        </Link>


        <Link href="/admin/reveals" className="private-hub-card">
          <span className="private-hub-icon">⚡</span>
          <div>
            <p className="eyebrow">PROTOTYPES</p>
            <h2>Reveal Lab</h2>
            <p>Preview the slammer, meteor booster, and 54-card earthquake.</p>
          </div>
        </Link>

        <div className="private-hub-card disabled">
          <span className="private-hub-icon">◉</span>
          <div>
            <p className="eyebrow">COMING LATER</p>
            <h2>Analytics</h2>
            <p>Visitors, QR scans, listens, downloads, and returning users.</p>
          </div>
        </div>

        <div className="private-hub-card disabled">
          <span className="private-hub-icon">⚙</span>
          <div>
            <p className="eyebrow">COMING LATER</p>
            <h2>Settings</h2>
            <p>Website, storage, integrations, and permissions.</p>
          </div>
        </div>
      </section>
    </main></>
  );
}
