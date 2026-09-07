import { cookies } from 'next/headers';
import { CustomerError, sessionUser, digest, limit } from './customerStore.mjs';
import { timingSafeEqual } from 'node:crypto';
export const SESSION_COOKIE='rc_session';
export async function currentUser(){return sessionUser((await cookies()).get(SESSION_COOKIE)?.value);}
export async function requireUser(){const user=await currentUser();if(!user)throw new CustomerError('Please sign in to continue.',401);return user;}
export function checkOrigin(request){
  const expected=process.env.APP_ORIGIN || (process.env.NODE_ENV!=='production'?new URL(request.url).origin:null);
  if(!expected)throw new CustomerError('The site owner must configure the public site address.',503);
  if(request.headers.get('origin')!==new URL(expected).origin)throw new CustomerError('Please reload this page and try again.',403);
}
export async function body(request){checkOrigin(request);const text=await request.text();if(text.length>20000)throw new CustomerError('Request is too large.',413);try{return JSON.parse(text);}catch{throw new CustomerError('Invalid request.');}}
export function authLimit(request){const ip=process.env.TRUST_PROXY==='1'?request.headers.get('x-forwarded-for')?.split(',')[0]?.trim():'shared';limit('auth-source:'+digest(ip||'shared'),60);}
export async function setSession(raw){(await cookies()).set(SESSION_COOKIE,raw,{httpOnly:true,secure:process.env.APP_ORIGIN?.startsWith('https://')||false,sameSite:'lax',path:'/',maxAge:30*86400});}
export function requireOwner(request){const provided=request.headers.get('x-owner-key')||'',expected=process.env.OWNER_KEY;if(!expected||expected.length<32||expected.startsWith("REPLACE_"))throw new CustomerError('Owner access has not been configured.',503);limit('owner-attempts',100);if(!timingSafeEqual(Buffer.from(digest(provided),'hex'),Buffer.from(digest(expected),'hex')))throw new CustomerError('Owner key is incorrect.',403);}
export function json(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
export function failure(error){if(error instanceof CustomerError)return json({error:error.message},error.status);console.error('Customer request failed:',error.message);return json({error:'Something went wrong. Please try again.'},500);}
