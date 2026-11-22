'use client';
import { useEffect, useRef, useState } from 'react';

export default function CardScanner({ onCode }) {
  const video = useRef(null), stream = useRef(null), timer = useRef(null), generation = useRef(0), callback = useRef(onCode);
  const [state,setState] = useState('off'), [error,setError] = useState('');
  callback.current = onCode;
  function release() {
    generation.current++;
    clearTimeout(timer.current);
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    if(video.current) video.current.srcObject = null;
  }
  function stop() { release(); setState('off'); }
  useEffect(() => {
    const hide = () => { if(document.hidden) stop(); };
    document.addEventListener('visibilitychange',hide);
    return () => { release(); document.removeEventListener('visibilitychange',hide); };
  },[]);
  async function start() {
    release(); const run = generation.current;
    setError(''); setState('starting');
    try {
      if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw Error('La caméra nécessite HTTPS et un navigateur compatible. Utilise la saisie ou une photo du QR.');
      const {default:decode} = await import('jsqr');
      if(run !== generation.current) return;
      const feed = await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});
      if(run !== generation.current) { feed.getTracks().forEach(track=>track.stop()); return; }
      stream.current = feed; video.current.srcObject = feed; await video.current.play();
      if(run !== generation.current) return;
      setState('on');
      const canvas = document.createElement('canvas'), context = canvas.getContext('2d',{willReadFrequently:true});
      let last = '', absent = 0;
      const scan = () => {
        if(run !== generation.current) return;
        try {
          const frame = video.current;
          if(frame?.readyState >= 2 && frame.videoWidth) {
            const scale = Math.min(1, 800/frame.videoWidth);
            canvas.width = Math.round(frame.videoWidth*scale); canvas.height = Math.round(frame.videoHeight*scale);
            context.drawImage(frame,0,0,canvas.width,canvas.height);
            const pixels = context.getImageData(0,0,canvas.width,canvas.height);
            const result = decode(pixels.data,pixels.width,pixels.height);
            if(result?.data) {
              absent = 0;
              if(result.data !== last) { last = result.data; callback.current(result.data); }
            } else if(++absent >= 6) last = '';
          }
          timer.current = setTimeout(scan,160);
        } catch { stop(); setError('Lecture caméra interrompue. Réessaie ou saisis le code.'); }
      };
      scan();
    } catch(e) {
      if(run !== generation.current) return;
      stop();
      setError(e.name === 'NotAllowedError' ? 'Accès caméra refusé. Tu peux autoriser la caméra dans ton navigateur ou saisir le code.' : e.name === 'NotFoundError' ? 'Aucune caméra trouvée. Utilise la saisie ou une photo du QR.' : e.name === 'NotReadableError' ? 'La caméra est déjà utilisée ou indisponible.' : e.message);
    }
  }
  async function photo(event) {
    const file = event.target.files?.[0]; event.target.value = '';
    if(!file) return;
    stop(); setError('');
    if(file.size > 15*1024*1024) { setError('Choisis une image de moins de 15 Mo.'); return; }
    const url = URL.createObjectURL(file);
    try {
      const {default:decode} = await import('jsqr');
      const image = new Image(); image.src = url; await image.decode();
      const canvas = document.createElement('canvas'), scale = Math.min(1,1600/Math.max(image.width,image.height));
      canvas.width = Math.round(image.width*scale); canvas.height = Math.round(image.height*scale);
      const context = canvas.getContext('2d',{willReadFrequently:true}); context.drawImage(image,0,0,canvas.width,canvas.height);
      const pixels = context.getImageData(0,0,canvas.width,canvas.height), result = decode(pixels.data,pixels.width,pixels.height);
      if(!result?.data) throw Error('Aucun QR lisible. Essaie une photo nette et rapprochée.');
      callback.current(result.data);
    } catch(e) { setError(e.message || 'Image illisible.'); }
    finally { URL.revokeObjectURL(url); }
  }
  return <section className="qr-scanner" aria-label="Scanner les cartes">
    <div className="actions"><button type="button" className="button primary" onClick={state === 'off' ? start : stop}>{state === 'off' ? 'Ouvrir la caméra' : 'Fermer la caméra'}</button><label className="button secondary">Lire une photo du QR<input className="qr-photo" type="file" accept="image/*" onChange={photo}/></label></div>
    {state === 'starting' && <p role="status">En attente de la caméra…</p>}
    <video className="qr-camera" hidden={state === 'off'} ref={video} muted playsInline aria-label="Aperçu de la caméra pour scanner les QR" />
    {state === 'on' && <p>Présente les cartes une à une. Retire une carte du cadre avant de la scanner de nouveau.</p>}
    <p className="muted">Les images sont analysées sur cet appareil, sans être envoyées au serveur. Aucun microphone utilisé.</p>
    {error && <p role="alert" className="error-message">{error}</p>}
  </section>;
}
