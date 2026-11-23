import { songs } from '../data/songs.js';
import { getQrRedirectEntry } from './qrRedirects.js';

export const PLAYLIST_LIMIT = 100;
const slugs = new Set(songs.map(song => song.slug));
export function resolveCardInput(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  const input = value.trim();
  const card = getQrRedirectEntry(input);
  if (card) return card.slug;
  let path = input;
  if (!input.startsWith('/') || input.startsWith('//')) {
    try {
      const url = new URL(input.match(/^www\.|^stvcentral\.com\//i) ? `https://${input}` : input);
      if (!['http:', 'https:'].includes(url.protocol) || !['stvcentral.com','www.stvcentral.com'].includes(url.hostname) || url.username || url.password || url.port) return null;
      path = url.pathname;
    } catch { return null; }
  } else path = input.split(/[?#]/)[0];
  const match = /^\/(q|song)\/([^/]+)\/?$/.exec(path);
  if (!match) return null;
  let code;
  try { code = decodeURIComponent(match[2]); } catch { return null; }
  return match[1] === 'q' ? getQrRedirectEntry(code)?.slug || null : slugs.has(code) ? code : null;
}

export function readPlaylist(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.songs) || value.songs.length > PLAYLIST_LIMIT || value.songs.some(slug => !slugs.has(slug))) throw Error('Playlist invalide ou incompatible.');
  return {version:1, name:typeof value.name === 'string' ? value.name.slice(0,80) : 'Ma playlist de cartes', songs:[...value.songs]};
}

export function moveEntry(entries, from, to) {
  if (from < 0 || from >= entries.length || to < 0 || to >= entries.length) return entries;
  const next = [...entries];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}
