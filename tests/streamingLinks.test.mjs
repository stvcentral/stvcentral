import test from 'node:test';
import assert from 'node:assert/strict';
import { streamingLink, songStreamingLinks } from '../lib/streamingLinks.mjs';
import { readFileSync } from 'node:fs';
import { songs } from '../data/songs.js';

test('Spotify links keep the track identity and discard tracking parameters', () => {
  const id = '0123456789ABCDEFGHIJKL';
  const link = streamingLink('spotify', `https://open.spotify.com/intl-fr/track/${id}?si=tracking`);
  assert.equal(link.url, `https://open.spotify.com/track/${id}`);
  assert.equal(link.embed, `https://open.spotify.com/embed/track/${id}`);
});
test('YouTube share and watch links map to the same non-autoplay embed', () => {
  const id = 'abcdefghijk';
  for (const url of [`https://youtu.be/${id}?si=tracking`, `https://www.youtube.com/watch?v=${id}&autoplay=1`, `https://m.youtube.com/shorts/${id}`]) {
    assert.equal(streamingLink('youtube',url).embed, `https://www.youtube-nocookie.com/embed/${id}`);
  }
});
test('untrusted hosts, protocols, credentials, and wrong content types are rejected', () => {
  for (const value of ['javascript:alert(1)', 'http://youtu.be/abcdefghijk', 'https://youtube.com.evil.test/watch?v=abcdefghijk', 'https://user@youtu.be/abcdefghijk', 'https://youtu.be:444/abcdefghijk', '<iframe src="https://youtube.com"></iframe>', null]) {
    assert.equal(streamingLink('youtube',value), null);
  }
  assert.equal(streamingLink('spotify','https://open.spotify.com/album/0123456789ABCDEFGHIJKL'),null);
  assert.deepEqual(songStreamingLinks(),[]);
  assert.deepEqual(songStreamingLinks(null),[]);
});
test('the release map covers all frozen song paths without invented platform links', () => {
  const entries=JSON.parse(readFileSync(new URL('../data/songStreaming.json',import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(entries).sort(), songs.map(s=>s.slug).sort());
  for(const entry of Object.values(entries)) for(const provider of ['spotify','youtube']) {
    assert.ok(entry[provider] === '' || streamingLink(provider,entry[provider]), provider);
  }
});
