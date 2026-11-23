import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveCardInput,readPlaylist,moveEntry,PLAYLIST_LIMIT} from '../lib/cardPlaylist.mjs';
import {songs} from '../data/songs.js';
import {qrRedirectEntries} from '../lib/qrRedirects.js';

test('all 54 printed codes and frozen URLs resolve to the correct playlist song',()=>{
  for(const row of qrRedirectEntries) {
    for(const input of [row.cardCode,row.cardCode.toUpperCase(),row.shortPath,`https://stvcentral.com${row.shortPath}`,`https://www.stvcentral.com${row.destination}?utm_source=card`,row.destination,`stvcentral.com${row.shortPath}`]) assert.equal(resolveCardInput(input),row.slug,input);
  }
  assert.equal(resolveCardInput(' JOKER 1 '),resolveCardInput('joker-1'));
});
test('scanner rejects unrelated QR payloads, purchase codes and lookalike sites',()=>{
  for(const input of ['https://evil.example/q/4h','https://stvcentral.com.evil.example/q/4h','https://user@stvcentral.com/q/4h','https://stvcentral.com:444/q/4h','//evil.example/q/4h','javascript:alert(1)','/song/unknown','/q/%ZZ','/redeem','RC-12345678-12345678','x'.repeat(3000),null]) assert.equal(resolveCardInput(input),null,String(input));
});
test('playlist import preserves order and intentional repeats but validates every song',()=>{
  const a=songs[0].slug,b=songs[1].slug;
  assert.deepEqual(readPlaylist({version:1,name:'Mon ordre',songs:[a,b,a]}).songs,[a,b,a]);
  assert.throws(()=>readPlaylist({version:1,songs:['../../secret']}));
  assert.throws(()=>readPlaylist({version:1,songs:Array(PLAYLIST_LIMIT+1).fill(a)}));
  assert.throws(()=>readPlaylist({version:2,songs:[]}));
  assert.throws(()=>readPlaylist(null));
});
test('reordering retains entry identities including repeated songs',()=>{
  const list=[{id:'1',slug:'a'},{id:'2',slug:'a'},{id:'3',slug:'b'}];
  assert.deepEqual(moveEntry(list,0,2).map(e=>e.id),['2','3','1']);
  assert.deepEqual(moveEntry(list,2,0).map(e=>e.id),['3','1','2']);
  assert.deepEqual(moveEntry(list,0,-1),list);
  assert.deepEqual(list.map(e=>e.id),['1','2','3']);
});
