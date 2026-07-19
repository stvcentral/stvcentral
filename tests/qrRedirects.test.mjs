import test from "node:test";
import assert from "node:assert/strict";

import { songs } from "../data/songs.js";
import {
  getQrDestination,
  normalizeQrCode,
  qrRedirectEntries,
} from "../lib/qrRedirects.js";

test("all 54 Royal Chaos songs have a unique short QR redirect", () => {
  assert.equal(songs.length, 54);
  assert.equal(qrRedirectEntries.length, 54);

  const uniqueCodes = new Set(qrRedirectEntries.map((entry) => entry.normalizedCode));
  const uniqueDestinations = new Set(qrRedirectEntries.map((entry) => entry.destination));

  assert.equal(uniqueCodes.size, 54);
  assert.equal(uniqueDestinations.size, 54);
});

test("3h redirects to 2 Voices, 1 Fire", () => {
  assert.equal(getQrDestination("3h"), "/song/2voices1fire");
});

test("card-code lookup is case insensitive", () => {
  assert.equal(getQrDestination("JH"), "/song/thesunandthethunder");
  assert.equal(getQrDestination("jh"), "/song/thesunandthethunder");
});

test("legacy and clean Joker URLs both remain compatible", () => {
  assert.equal(normalizeQrCode("Joker 1"), "joker1");
  assert.equal(getQrDestination("joker%201"), "/song/flowstate");
  assert.equal(getQrDestination("joker-1"), "/song/flowstate");
  assert.equal(getQrDestination("joker1"), "/song/flowstate");
  assert.equal(getQrDestination("joker2"), "/song/thefuturelovesvincent");
});

test("unknown codes do not redirect", () => {
  assert.equal(getQrDestination("not-a-card"), null);
});
