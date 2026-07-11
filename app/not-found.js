import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <h1>Song not found</h1>
      <p>This destination has not been built yet.</p>
      <Link className="button primary" href="/music">Return to music</Link>
    </main>
  );
}
