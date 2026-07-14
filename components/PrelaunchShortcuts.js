import Link from "next/link";

export default function PrelaunchShortcuts() {
  // Shortcuts remain visible by default during development and pre-launch.
  // Set NEXT_PUBLIC_SITE_LIVE=true in Vercel and redeploy to hide this bar.
  const siteIsLive = process.env.NEXT_PUBLIC_SITE_LIVE === "true";

  if (siteIsLive) return null;

  return (
    <nav className="prelaunch-shortcuts" aria-label="Pre-launch shortcuts">
      <span className="prelaunch-shortcuts-label">PRE-LAUNCH</span>
      <Link href="/admin">Admin</Link>
      <Link href="/kingdomwatts/calculator">Calculator</Link>
      <Link href="/fair-deal">Fair Deal</Link>
    </nav>
  );
}
