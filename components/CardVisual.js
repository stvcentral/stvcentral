export const suitSymbols = {
  Hearts: "♥",
  Diamonds: "♦",
  Spades: "♠",
  Clubs: "♣",
  Jokers: "★"
};

export function CardVisual({ song, compact = false }) {
  const symbol = suitSymbols[song.suit] || "★";
  return (
    <div className={`playing-card-placeholder suit-${song.suit.toLowerCase()} ${compact ? "compact" : ""}`}>
      <div className="card-corner top">
        <span className="card-rank">{song.rank}</span>
        <span className="card-suit-small">{symbol}</span>
      </div>

      <div className="card-center">
        <span className="card-suit-large">{symbol}</span>
        <span className="card-rank-center">{song.rank}</span>
      </div>

      <div className="card-corner bottom">
        <span className="card-rank">{song.rank}</span>
        <span className="card-suit-small">{symbol}</span>
      </div>
    </div>
  );
}
