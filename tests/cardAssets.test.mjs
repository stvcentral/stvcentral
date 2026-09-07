import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { songs } from '../data/songs.js';
import { getQrDestination } from '../lib/qrRedirects.js';

const manifest = JSON.parse(readFileSync(new URL('../data/cardAssetManifest.json', import.meta.url), 'utf8'));

test('every printed song QR reaches its matching card and recording', () => {
  assert.equal(manifest.length, 54);
  assert.equal(new Set(manifest.map(row => row.sourceCard)).size, 54);
  assert.equal(new Set(manifest.map(row => row.sourceAudio)).size, 54);
  for (const row of manifest) {
    const song = songs.find(song => song.slug === row.slug);
    assert.ok(song, row.slug);
    const printedCode = new URL(row.printedQr).pathname.split('/q/')[1];
    assert.equal(getQrDestination(printedCode), `/song/${song.slug}`);
    for (const field of ['cardCode', 'suit', 'rank', 'artwork', 'audio']) {
      assert.equal(song[field], row[field], `${row.slug}: ${field}`);
    }
    for (const asset of [song.artwork, `/previews/${song.slug}.mp3`]) {
      assert.ok(statSync(new URL(`../public${asset}`, import.meta.url)).size > 0, asset);
    }
    assert.ok(statSync(new URL(`../${row.privateAudio}`, import.meta.url)).size > 0);
  }
});

test('deck has all thirteen distinct ranks in each suit and two jokers', () => {
  const expected = ['2','3','4','5','6','7','8','9','10','Jack','Queen','King','Ace'].sort();
  for (const suit of ['Hearts','Diamonds','Spades','Clubs']) {
    assert.deepEqual(songs.filter(song => song.suit === suit).map(song => song.rank).sort(), expected);
  }
  assert.equal(songs.filter(song => song.suit === 'Jokers').length, 2);
});
