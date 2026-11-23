// Accept provider links, never arbitrary iframe markup or destinations.
export function streamingLink(provider, value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  let url;
  try { url = new URL(value.trim()); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  if (provider === 'spotify' && url.hostname === 'open.spotify.com') {
    const id = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]{22})\/?$/)?.[1];
    return id ? { provider, label: 'Spotify', url: `https://open.spotify.com/track/${id}`, embed: `https://open.spotify.com/embed/track/${id}` } : null;
  }
  if (provider === 'youtube') {
    let id;
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else id = url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)\/?$/)?.[1];
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? { provider, label: 'YouTube', url: `https://www.youtube.com/watch?v=${id}`, embed: `https://www.youtube-nocookie.com/embed/${id}` } : null;
  }
  return null;
}

export function songStreamingLinks(entry = {}) {
  return ['youtube', 'spotify'].map(provider => streamingLink(provider, entry?.[provider])).filter(Boolean);
}
