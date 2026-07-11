import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: {
    default: "STV Central",
    template: "%s | STV Central"
  },
  description: "The permanent home of STV Central music and physical song-card albums."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
