'use client';
import {useEffect,useState} from 'react';
import {safeAccountNext} from '../lib/socialConfig.mjs';
export default function SocialSignIn({next='/collection',link=false}) {
  const [providers,setProviders]=useState([]);
  useEffect(()=>{let active=true;fetch('/api/social/providers',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(active)setProviders(data?.providers||[]);}).catch(()=>{});return()=>{active=false;};},[]);
  if(!providers.length)return null;
  return <section className="customer-panel social-signin" aria-label={link?'Link a sign-in provider':'Social sign-in'}>
    <h2>{link?'Connect a login to this collection':'Continue with your existing account'}</h2>
    <div className="actions">{providers.map(provider=><form key={provider.id} action={`/api/social/${provider.id}/start`} method="post">
      <input type="hidden" name="next" value={safeAccountNext(next)}/>
      <input type="hidden" name="link" value={link?'1':'0'}/>
      <button className="button secondary" type="submit">{link?'Connect':'Continue with'} {provider.name}</button>
    </form>)}</div>
    <p className="muted">{link?'Your cards stay in this collection.':'Already have an STV Central collection? Sign in below first, then connect your preferred login to keep your cards together.'} We never receive your Google, Facebook or Apple password.</p>
  </section>;
}
