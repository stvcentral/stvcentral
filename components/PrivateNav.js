import Link from "next/link";

export default function PrivateNav() {
  return (
    <nav className="private-nav" aria-label="Private navigation">
      <Link href="/admin">Admin</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/workspace">Workspace</Link>
      <Link href="/admin/shop">Shop Editor</Link>
      <Link href="/shop">View shop</Link>
      <Link href="/">View public site</Link>
    </nav>
  );
}
