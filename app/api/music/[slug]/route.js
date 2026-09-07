import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { currentUser,json,failure } from '../../../../lib/customerHttp.js';
import { owns } from '../../../../lib/customerStore.mjs';
import { getSong } from '../../../../data/songs.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request,{params}){try{
 const {slug}=await params,song=getSong(slug);if(!song)return json({error:'Song not found'},404);
 const user=await currentUser();if(!user)return json({error:'Sign in to play this song.'},401);if(!owns(user,slug))return json({error:'Claim this card to play or download the full song.'},403);
 const path=resolve(process.env.MUSIC_DIR||'private/music',song.slug+'.mp3');
 let info;try{info=await stat(path);}catch{return json({error:'This recording is temporarily unavailable.'},503);}
 const headers={'Content-Type':'audio/mpeg','Accept-Ranges':'bytes','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
 if(new URL(request.url).searchParams.get('download')==='1')headers['Content-Disposition']=`attachment; filename="${song.slug}.mp3"`;
 let start=0,end=info.size-1,status=200;
 const range=request.headers.get('range');
 if(range){const match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${info.size}`}});
   if(!match[1]){const count=Number(match[2]);start=Math.max(0,info.size-count);if(count<=0)start=info.size;}else{start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),info.size-1);}
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=info.size)return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${info.size}`}});
   status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
 }
 headers['Content-Length']=String(end-start+1);
 return new Response(Readable.toWeb(createReadStream(path,{start,end})),{status,headers});
}catch(e){return failure(e);}}
