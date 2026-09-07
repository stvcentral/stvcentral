import "./globals.css";
import "./customer.css";
import SiteHeader from "../components/SiteHeader";

import AudioCoordinator from "../components/AudioCoordinator";

export const metadata = {
  title: { default: "STV Central", template: "%s | STV Central" },
  description: "The permanent home of STV Central music and physical song-card albums."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AudioCoordinator />
        <SiteHeader />
        <a className="skip-link" href="#main-content">Skip to content</a><div id="main-content" />
        {children}<footer className="customer-footer"><span>STV CENTRAL · ROYAL CHAOS</span><nav aria-label="Footer"><a href="/help">Help & collection guide</a><a href="/privacy">Privacy</a><a href="/collection">My collection</a></nav></footer>
      </body>
    </html>
  );
}
