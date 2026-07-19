import { songs } from "../data/songs.js";

/**
 * Convert printed/typed QR card codes into one stable lookup key.
 *
 * Examples:
 *   "Jh"      -> "jh"
 *   "JOKER 1" -> "joker1"
 *   "joker-1" -> "joker1"
 */
export function normalizeQrCode(value) {
  if (value === null || value === undefined) return "";

  let decoded = String(value);
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep the original value when malformed percent-encoding is supplied.
  }

  return decoded.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export const qrRedirectEntries = songs.map((song) => ({
  cardCode: song.cardCode,
  normalizedCode: normalizeQrCode(song.cardCode),
  title: song.title,
  slug: song.slug,
  shortPath: `/q/${
    normalizeQrCode(song.cardCode).startsWith("joker")
      ? normalizeQrCode(song.cardCode)
      : song.cardCode.toLowerCase()
  }`,
  destination: `/song/${song.slug}`,
}));

const redirectMap = new Map(
  qrRedirectEntries.map((entry) => [entry.normalizedCode, entry])
);

export function getQrRedirectEntry(code) {
  return redirectMap.get(normalizeQrCode(code)) ?? null;
}

export function getQrDestination(code) {
  return getQrRedirectEntry(code)?.destination ?? null;
}
