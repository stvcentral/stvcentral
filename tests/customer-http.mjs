import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import {songs} from '../data/songs.js';
import {qrRedirectEntries} from '../lib/qrRedirects.js';
const temp=mkdtempSync(join(tmpdir(),'rc-http-')),port=3101,origin=`http://127.0.0.1:${port}`,key=randomBytes(32).toString('hex');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:process.cwd(),env:{...process.env,NODE_ENV:'production',SOCIAL_LOGIN_ENABLED:'0',CUSTOMER_STORAGE_READY:'0',APP_ORIGIN:origin,OWNER_KEY:key,CUSTOMER_DB_PATH:join(temp,'test.sqlite'),MUSIC_DIR:resolve('private/music')},stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
const exit=new Promise(r=>server.once('exit',r));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function req(path,{method='GET',data,cookie,owner,extra={}}={}){
 return fetch(origin+path,{method,redirect:'manual',headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...(owner?{'x-owner-key':key}:{}),...(data?{'Content-Type':'application/json'}:{}),...extra},...(data?{body:JSON.stringify(data)}:{})});
}
try{
 let ready=false;for(let i=0;i<80;i++){if(server.exitCode!==null)throw Error(logs);try{const r=await fetch(origin+'/api/health');if(r.ok){ready=true;break;}}catch{}await delay(250);}assert.ok(ready,'server starts');
 for(const path of ['/','/music','/collection','/account','/redeem','/help','/privacy','/owner','/playlist']){const r=await req(path);assert.equal(r.status,200,path);assert.match(await r.text(),/STV/);}
 assert.equal((await req('/playlist')).headers.get('permissions-policy'),'camera=(self), microphone=()');
 assert.equal((await req('/')).headers.get('permissions-policy'),'camera=(), microphone=()');
 assert.deepEqual(await (await req('/api/social/providers')).json(),{providers:[]});
 assert.equal((await req('/api/social/google/start',{method:'POST'})).status,503);
 assert.match((await req('/account')).headers.get('content-security-policy'),/https:\/\/accounts.google.com/);
 const first=songs[0].slug,second=songs[1].slug;
 assert.equal((await req('/api/music/'+first)).status,401);
 assert.equal((await req('/media/royal-chaos/'+first+'.mp3')).status,404);
 const preview=await req('/previews/'+first+'.mp3');assert.equal(preview.status,200);await preview.arrayBuffer();
 const forged=await req('/api/customer/register',{method:'POST',data:{username:'forged_user',password:'forged-password-long'},extra:{Origin:'https://other.example'}});assert.equal(forged.status,403);
 const register=await req('/api/customer/register',{method:'POST',data:{username:'http_collector',password:'correct-password-long'}});assert.equal(register.status,200,await register.clone().text());
 const account=await register.json(),cookie=register.headers.get('set-cookie').split(';')[0];assert.ok(account.recovery);assert.match(register.headers.get('set-cookie'),/HttpOnly/i);
 assert.equal((await req('/api/music/'+first,{cookie})).status,403);
 assert.equal((await req('/api/owner/claims')).status,403);
 const generated=await req('/api/owner/claims',{method:'POST',owner:true,data:{kind:'booster',label:'HTTP test',slugs:[first,second],count:1}});assert.equal(generated.status,200);const code=(await generated.json()).claims[0].code;
 const claim=await req('/api/customer/redeem',{method:'POST',cookie,data:{code}});assert.equal(claim.status,200);assert.equal((await claim.json()).added,2);
 const again=await req('/api/customer/redeem',{method:'POST',cookie,data:{code}});assert.equal((await again.json()).added,0);
 const other=await req('/api/customer/register',{method:'POST',data:{username:'http_other',password:'another-password-long'}});const otherCookie=other.headers.get('set-cookie').split(';')[0];
 assert.equal((await req('/api/customer/redeem',{method:'POST',cookie:otherCookie,data:{code}})).status,409);
 assert.equal((await req('/api/music/'+first,{cookie:otherCookie})).status,403);
 const reveal=await req('/api/customer/reveal',{method:'POST',cookie,data:{slug:first}});assert.equal(reveal.status,200);
 const me=await (await req('/api/customer/me',{cookie})).json();assert.equal(me.collection.length,2);assert.ok(me.collection.find(s=>s.slug===first).revealed);
 const range=await req('/api/music/'+first,{cookie,extra:{Range:'bytes=0-999'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,1000);
 const suffix=await req('/api/music/'+first,{cookie,extra:{Range:'bytes=-100'}});assert.equal(suffix.status,206);assert.equal((await suffix.arrayBuffer()).byteLength,100);
 const invalid=await req('/api/music/'+first,{cookie,extra:{Range:'bytes=9999999999-'}});assert.equal(invalid.status,416);
 const download=await req('/api/music/'+first+'?download=1',{cookie});assert.equal(download.status,200);assert.match(download.headers.get('content-disposition'),/attachment/);assert.ok((await download.arrayBuffer()).byteLength>10000);
 for(const entry of qrRedirectEntries){const r=await req('/q/'+encodeURIComponent(entry.cardCode));assert.equal(r.status,307,entry.cardCode);assert.ok(r.headers.get('location').endsWith(entry.destination),entry.cardCode);}
 const reset=await req('/api/customer/recover',{method:'POST',data:{username:'http_collector',recovery:account.recovery,password:'new-correct-password-long'}});assert.equal(reset.status,200);
 assert.equal((await req('/api/music/'+first,{cookie})).status,401);
 const login=await req('/api/customer/login',{method:'POST',data:{username:'http_collector',password:'new-correct-password-long'}});assert.equal(login.status,200);
 const newCookie=login.headers.get('set-cookie').split(';')[0];assert.equal((await (await req('/api/customer/me',{cookie:newCookie})).json()).collection.length,2);
 await req('/api/customer/logout',{method:'POST',cookie:newCookie,data:{}});assert.equal((await req('/api/music/'+first,{cookie:newCookie})).status,401);
 console.log('PASS: customer pages, CSRF, account lifecycle, code ownership, persistent reveals, protected downloads, audio ranges, previews, and all 54 printed QR redirects.');
}catch(e){console.error(logs);throw e;}finally{server.kill();await exit;if(resolve(temp)!==temp||!temp.startsWith(join(tmpdir(),'rc-http-')))throw Error('Unexpected test directory');rmSync(temp,{recursive:true,force:true});}
