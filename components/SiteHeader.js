import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">STV CENTRAL</Link>
      <nav aria-label="Main navigation">
        <Link href="/music">Royal Chaos</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/fair-deal">Fair Deal</Link>
      </nav>
    </header>
  );
}
