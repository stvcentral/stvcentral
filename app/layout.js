import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import PrelaunchShortcuts from "../components/PrelaunchShortcuts";
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
        <PrelaunchShortcuts />
        {children}
      </body>
    </html>
  );
}
