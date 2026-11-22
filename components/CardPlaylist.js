'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import CardScanner from './CardScanner';
import {PLAYLIST_LIMIT,resolveCardInput,readPlaylist,moveEntry} from '../lib/cardPlaylist.mjs';

const STORAGE='stvcentral-card-playlist-v1';
const entry=slug=>({id:crypto.randomUUID(),slug});
export default function CardPlaylist({songs}) {
  const [queue,setQueue]=useState([]),[name,setName]=useState('Ma playlist de cartes'),[ready,setReady]=useState(false),[input,setInput]=useState(''),[notice,setNotice]=useState(''),[error,setError]=useState(''),[storageError,setStorageError]=useState('');
  const [account,setAccount]=useState(null),[accountError,setAccountError]=useState(false),[currentId,setCurrentId]=useState(null),[playing,setPlaying]=useState(false),[undo,setUndo]=useState(null);
  const audio=useRef(null),wantPlay=useRef(false),queueRef=useRef(queue); queueRef.current=queue;
  const bySlug=new Map(songs.map(song=>[song.slug,song])), owned=new Set((account?.collection||[]).map(song=>song.slug));
  const current=queue.find(item=>item.id===currentId), song=current&&bySlug.get(current.slug), full=song&&owned.has(song.slug);
  const source=song?(full?`/api/music/${song.slug}`:`/previews/${song.slug}.mp3`):null;
  useEffect(()=>{
    try {const raw=localStorage.getItem(STORAGE);if(raw){const saved=readPlaylist(JSON.parse(raw));setQueue(saved.songs.map(entry));setName(saved.name);}}
    catch {setStorageError('La playlist enregistrée est indisponible. Tu peux créer une nouvelle liste et l’exporter.');}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try{localStorage.setItem(STORAGE,JSON.stringify({version:1,name,songs:queue.map(item=>item.slug)}));}
    catch{setStorageError('Sauvegarde locale indisponible. Exporte la playlist pour la conserver.');}
  },[ready,queue,name]);
  useEffect(()=>{
    let live=true;
    const refresh=()=>fetch('/api/customer/me',{cache:'no-store'}).then(async r=>{const result=await r.json();if(!r.ok||result.error)throw Error();if(live){setAccount(result);setAccountError(false);}}).catch(()=>{if(live){setAccount(null);setAccountError(true);}});
    const visible=()=>{if(!document.hidden)refresh();};
    refresh();window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',visible);
    return()=>{live=false;window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',visible);};
  },[]);
  useEffect(()=>{
    if(!source||!wantPlay.current||!audio.current)return;
    let live=true;
    audio.current.play().catch(()=>{if(live){wantPlay.current=false;setPlaying(false);setNotice('Appuie sur Lecture pour continuer.');}});
    return()=>{live=false;};
  },[source,currentId]);
  function add(raw) {
    setError('');
    const slug=resolveCardInput(raw);
    if(!slug){setError('Code non reconnu. Utilise le QR d’une chanson ou un code comme 4h, Jh ou joker1. Un code d’achat se réclame sur la page « Claim cards ».');return;}
    if(queueRef.current.length>=PLAYLIST_LIMIT){setError(`Maximum ${PLAYLIST_LIMIT} cartes par playlist.`);return;}
    const next=[...queueRef.current,entry(slug)];queueRef.current=next;setQueue(next);setUndo(null);setInput('');setNotice(`${bySlug.get(slug).title} ajouté en position ${next.length}.`);
  }
  function choose(item) {
    setError('');wantPlay.current=true;
    if(item.id===currentId) audio.current?.play().catch(()=>{wantPlay.current=false;setNotice('Appuie sur Lecture dans le lecteur.');});
    else setCurrentId(item.id);
  }
  function next() {
    const index=queue.findIndex(item=>item.id===currentId);
    if(index>=0&&index+1<queue.length)choose(queue[index+1]);
    else{wantPlay.current=false;setPlaying(false);setNotice('Fin de la playlist.');}
  }
  function remove(item) {
    if(item.id===currentId){audio.current?.pause();wantPlay.current=false;setCurrentId(null);setPlaying(false);}
    setQueue(queue.filter(row=>row.id!==item.id));setUndo(null);
  }
  function clear() {audio.current?.pause();wantPlay.current=false;setPlaying(false);setCurrentId(null);setUndo(queue);setQueue([]);setNotice('Playlist vidée. Tu peux annuler cette action.');}
  function shuffle() {
    const result=[...queue];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}setQueue(result);setNotice('Ordre des cartes mélangé.');
  }
  function download() {
    const blob=new Blob([JSON.stringify({version:1,name,songs:queue.map(item=>item.slug)},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='royal-chaos-playlist.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function upload(event) {
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    try{if(file.size>100000)throw Error('Fichier trop volumineux.');const saved=readPlaylist(JSON.parse(await file.text()));if(queueRef.current.length+saved.songs.length>PLAYLIST_LIMIT)throw Error(`L’import dépasse ${PLAYLIST_LIMIT} cartes. Exporte ou vide ta liste d’abord.`);const combined=[...queueRef.current,...saved.songs.map(entry)];queueRef.current=combined;setQueue(combined);setUndo(null);if(!queue.length)setName(saved.name);setError('');setNotice(`${saved.songs.length} cartes importées à la fin de la liste.`);}catch(e){setError(e.message||'Fichier invalide.');}
  }
  return <main className="customer-shell qr-playlist" lang="fr">
    <header className="qr-heading"><p className="eyebrow">ROYAL CHAOS · TES CARTES, TON ORDRE</p><h1>Mélange. Scanne. Écoute.</h1><p className="lead">Construis ta playlist avec les QR de tes cartes. Les chansons sont ajoutées dans l’ordre où tu les présentes.</p></header>
    <div className="qr-layout"><section className="qr-panel"><h2>Ajouter des cartes</h2><CardScanner onCode={add}/><form onSubmit={event=>{event.preventDefault();add(input);}}><label htmlFor="card-code">Code de carte ou adresse du QR</label><div className="qr-entry"><input id="card-code" value={input} maxLength={2048} onChange={event=>setInput(event.target.value)} placeholder="4h, Jh, joker1 ou https://stvcentral.com/q/4h" autoComplete="off"/><button className="button secondary" disabled={!ready||!input.trim()}>Ajouter</button></div></form><p className="muted">Scanner une carte l’ajoute à la liste; cela ne réclame pas son achat. Les cartes non possédées jouent un extrait. Les chansons réclamées jouent en entier après connexion.</p><Link className="text-link" href="/account?next=%2Fplaylist">Se connecter</Link>{accountError&&<p role="status">La collection est temporairement indisponible. Les extraits restent accessibles.</p>}</section>
    <section className="qr-panel qr-queue" aria-label="Playlist"><label htmlFor="playlist-name">Nom de la playlist</label><input id="playlist-name" value={name} maxLength={80} onChange={event=>setName(event.target.value)}/><p className="muted">{queue.length} / {PLAYLIST_LIMIT} cartes · sauvegardée sur cet appareil, sans synchronisation de compte.</p>
    <div className="qr-toolbar"><button type="button" className="button primary" disabled={!queue.length} onClick={()=>choose(current||queue[0])}>Lecture</button><button type="button" className="button secondary" disabled={queue.length<2} onClick={shuffle}>Mélanger</button><button type="button" className="button secondary" disabled={!queue.length} onClick={download}>Exporter</button><label className="button secondary">Importer<input className="qr-photo" type="file" accept=".json,application/json" onChange={upload}/></label><button type="button" className="text-link" disabled={!queue.length} onClick={clear}>Vider</button>{undo&&<button type="button" className="text-link" onClick={()=>{setQueue(undo);setUndo(null);}}>Annuler le vidage</button>}</div>
    {song&&<div className="qr-now"><p className="eyebrow">{playing?'EN LECTURE':'LECTEUR'} · {full?'CHANSON COMPLÈTE':'EXTRAIT'}</p><h2>{song.title}</h2><audio key={`${currentId}-${source}`} ref={audio} controls preload="none" src={source} onPlay={()=>{wantPlay.current=true;setPlaying(true);}} onPause={event=>{if(!event.currentTarget.ended)wantPlay.current=false;setPlaying(false);}} onEnded={next} onError={()=>{wantPlay.current=false;setPlaying(false);setError('Lecture indisponible. Reconnecte-toi pour une chanson complète ou passe à la suivante.');}}/><button type="button" className="text-link" onClick={next} disabled={queue.findIndex(item=>item.id===currentId)===queue.length-1}>Chanson suivante</button></div>}
    {!ready?<p role="status">Chargement de ta playlist…</p>:!queue.length?<div className="qr-empty"><span aria-hidden="true">♥ ♠ ♦ ♣</span><h2>Ta première carte donne le ton.</h2><p>Scanne un QR ou saisis son code pour commencer.</p></div>:<ol className="qr-list">{queue.map((item,index)=>{const track=bySlug.get(item.slug);return <li key={item.id} className={currentId===item.id?'is-current':''}><img src={track.artwork} alt="" width="44" height="60"/><button type="button" className="qr-track" onClick={()=>choose(item)} aria-label={`Lire ${track.title}, position ${index+1}`}><strong>{index+1}. {track.title}</strong><span>{track.cardName} · {owned.has(track.slug)?'Complète':'Extrait'}</span></button><div className="qr-row-actions"><button type="button" disabled={index===0} aria-label={`Monter ${track.title}, position ${index+1}`} onClick={()=>setQueue(moveEntry(queue,index,index-1))}>↑</button><button type="button" disabled={index===queue.length-1} aria-label={`Descendre ${track.title}, position ${index+1}`} onClick={()=>setQueue(moveEntry(queue,index,index+1))}>↓</button><button type="button" aria-label={`Retirer ${track.title}, position ${index+1}`} onClick={()=>remove(item)}>×</button></div></li>;})}</ol>}
    </section></div><p role="status" aria-live="polite" className="qr-notice">{notice}</p>{error&&<p role="alert" className="error-message">{error}</p>}{storageError&&<p role="alert">{storageError}</p>}
  </main>;
}
