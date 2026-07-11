
import { songs } from "../../data/songs";
import CollectionGrid from "../../components/CollectionGrid";

export const metadata = { title: "The Collection" };

export default function MusicPage() {
  return (
    <main className="page-shell collection-page">
      <header className="collection-heading">
        <div>
          <p className="eyebrow">ROYAL CHAOS</p>
          <h1>The Music Library</h1>
          <p>54 songs · 54 cards · one collection</p>
        </div>
      </header>

      <CollectionGrid songs={songs} />
    </main>
  );
}
