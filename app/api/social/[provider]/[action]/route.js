import {cookies} from 'next/headers';
import {socialConfig,socialOrigin} from '../../../../../lib/socialConfig.mjs';
import {createSocialAttempt,consumeSocialAttempt,socialCustomer,stageAppleCompletion,consumeAppleCompletion} from '../../../../../lib/socialStore.mjs';
import {authorizationUrl,exchangeIdentity} from '../../../../../lib/socialOAuth.mjs';
import {checkOrigin,authLimit,SESSION_COOKIE,setSession} from '../../../../../lib/customerHttp.js';
import {newSession,sessionUser,logout} from '../../../../../lib/customerStore.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const browserCookie=provider=>`__Host-rc_oauth_${provider}`;
function redirect(url){return new Response(null,{status:303,headers:{Location:String(url),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});}
async function handle(request,{params}) {
  const {provider,action}=await params,config=socialConfig(provider);
  if(!config||!['start','callback','finish'].includes(action))return Response.json({error:'This sign-in option is not available.'},{status:503,headers:{'Cache-Control':'no-store'}});
  const jar=await cookies(),cookie=browserCookie(provider),current=jar.get(SESSION_COOKIE)?.value;
  try {
    if(action==='finish') {
      if(provider!=='apple'||request.method!=='GET')return new Response(null,{status:405});
      const completion=consumeAppleCompletion(new URL(request.url).searchParams.get('ticket'),jar.get(cookie)?.value);
      const user=socialCustomer(provider,completion.subject,completion,current);
      jar.set(cookie,'',{httpOnly:true,secure:true,sameSite:'none',path:'/',maxAge:0});
      if(current)logout(current);await setSession(newSession(user));
      return redirect(new URL(completion.next,config.origin));
    }
    if(action==='start') {
      if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST'}});
      checkOrigin(request);authLimit(request);
      const text=await request.text();if(text.length>4096)throw Error('Request too large');
      const form=new URLSearchParams(text);
      // Linking is only offered from an authenticated account screen.
      if(form.get('link')==='1'&&!sessionUser(current))throw Error('Missing session');
      if(form.get('link')!=='1'&&sessionUser(current))throw Error('Already signed in');
      const attempt=createSocialAttempt(provider,form.get('next'),form.get('link')==='1'?current:null);
      jar.set(cookie,attempt.browser,{httpOnly:true,secure:true,sameSite:provider==='apple'?'none':'lax',path:'/',maxAge:600});
      return redirect(authorizationUrl(provider,attempt));
    }
    if(request.method!==(provider==='apple'?'POST':'GET'))return new Response(null,{status:405});
    const text=request.method==='POST'?await request.text():new URL(request.url).search.slice(1);
    if(text.length>20000)throw Error('Request too large');
    const form=new URLSearchParams(text);
    if(form.getAll('state').length!==1||form.getAll('code').length>1)throw Error('Invalid parameters');
    const attempt=consumeSocialAttempt(provider,form.get('state'),jar.get(cookie)?.value);
    if(form.has('error'))throw Error('Authorization declined');
    const subject=await exchangeIdentity(provider,form.get('code'),attempt);
    // The same-origin GET restores the Lax session after Apple's cross-site POST.
    if(provider==='apple')return redirect(new URL(`/api/social/apple/finish?ticket=${stageAppleCompletion(subject,attempt)}`,config.origin));
    jar.set(cookie,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
    const user=socialCustomer(provider,subject,attempt,current);
    if(current)logout(current);
    await setSession(newSession(user));
    return redirect(new URL(attempt.next,config.origin));
  } catch {
    // Do not log provider codes, tokens, secrets, or arbitrary provider error descriptions.
    return redirect(new URL('/account?social_error=signin',socialOrigin()));
  }
}
export const GET=handle;
export const POST=handle;
