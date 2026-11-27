import {createHash,createHmac} from 'node:crypto';
import {createRemoteJWKSet,jwtVerify,SignJWT,importPKCS8} from 'jose';
import {socialConfig} from './socialConfig.mjs';

const keysets={
  google:createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs')),
  apple:createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'))
};
export function authorizationUrl(provider,attempt,env=process.env) {
  const config=socialConfig(provider,env);
  if(!config)throw Error('Provider unavailable');
  const base={google:'https://accounts.google.com/o/oauth2/v2/auth',apple:'https://appleid.apple.com/auth/authorize',facebook:`https://www.facebook.com/${config.graphVersion}/dialog/oauth`}[provider];
  const url=new URL(base);
  for(const [key,value] of Object.entries({client_id:config.id,redirect_uri:config.redirect,response_type:'code',state:attempt.state}))url.searchParams.set(key,value);
  if(provider==='google') {
    url.searchParams.set('scope','openid');
    url.searchParams.set('nonce',attempt.nonce);
    url.searchParams.set('code_challenge',createHash('sha256').update(attempt.verifier).digest('base64url'));
    url.searchParams.set('code_challenge_method','S256');
    url.searchParams.set('prompt','select_account');
  }
  if(provider==='apple') {
    // No email/name scopes: stable provider ID is sufficient to maintain a collection.
    url.searchParams.set('nonce',attempt.nonce);
    url.searchParams.set('response_mode','form_post');
  }
  if(provider==='facebook')url.searchParams.set('scope','public_profile');
  return url;
}
async function requestJson(url,options={}) {
  const response=await fetch(url,{...options,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Provider request failed');
  const result=await response.json();
  if(result.error)throw Error('Provider request failed');
  return result;
}
export async function verifiedOidcSubject(provider,idToken,config,nonce,keys=keysets[provider]) {
  if(!['google','apple'].includes(provider)||typeof idToken!=='string'||!nonce)throw Error('Invalid identity token');
  const {payload}=await jwtVerify(idToken,keys,{
    issuer:provider==='google'?['https://accounts.google.com','accounts.google.com']:'https://appleid.apple.com',
    audience:config.id,algorithms:['RS256'],requiredClaims:['sub','iat','exp','nonce'],maxTokenAge:'10m',clockTolerance:30
  });
  if(payload.nonce!==nonce || (payload.azp && payload.azp!==config.id) || typeof payload.sub!=='string'||!payload.sub.length||payload.sub.length>255)throw Error('Invalid identity token');
  return payload.sub;
}
export function verifiedFacebookSubject(data,config) {
  if(data?.is_valid!==true||String(data.app_id)!==config.id||data.type!=='USER'||typeof data.user_id!=='string'||!data.user_id||data.user_id.length>255||!(data.expires_at>Date.now()/1000))throw Error('Invalid Facebook identity');
  return data.user_id;
}
export async function exchangeIdentity(provider,code,attempt,env=process.env) {
  const config=socialConfig(provider,env);
  if(!config||typeof code!=='string'||!code.length||code.length>4096)throw Error('Invalid authorization response');
  let secret=config.secret;
  if(provider==='apple') {
    const key=await importPKCS8(env.APPLE_PRIVATE_KEY.replace(/\\n/g,'\n'),'ES256');
    secret=await new SignJWT({}).setProtectedHeader({alg:'ES256',kid:env.APPLE_KEY_ID}).setIssuer(env.APPLE_TEAM_ID).setSubject(config.id).setAudience('https://appleid.apple.com').setIssuedAt().setExpirationTime('5m').sign(key);
  }
  const params=new URLSearchParams({client_id:config.id,client_secret:secret,code,redirect_uri:config.redirect,grant_type:'authorization_code'});
  if(provider==='google')params.set('code_verifier',attempt.verifier);
  if(provider==='facebook') {
    const endpoint=new URL(`https://graph.facebook.com/${config.graphVersion}/oauth/access_token`);endpoint.search=params.toString();
    const tokens=await requestJson(endpoint);
    if(typeof tokens.access_token!=='string')throw Error('Missing access token');
    const inspect=new URL(`https://graph.facebook.com/${config.graphVersion}/debug_token`);
    inspect.searchParams.set('input_token',tokens.access_token);
    const result=await requestJson(inspect,{headers:{Authorization:`Bearer ${config.id}|${config.secret}`}});
    const subject=verifiedFacebookSubject(result.data,config);
    const me=new URL(`https://graph.facebook.com/${config.graphVersion}/me`);
    me.searchParams.set('fields','id');me.searchParams.set('appsecret_proof',createHmac('sha256',config.secret).update(tokens.access_token).digest('hex'));
    const profile=await requestJson(me,{headers:{Authorization:`Bearer ${tokens.access_token}`}});
    if(profile.id!==subject)throw Error('Facebook identity mismatch');
    return subject;
  }
  const endpoint=provider==='google'?'https://oauth2.googleapis.com/token':'https://appleid.apple.com/auth/token';
  const tokens=await requestJson(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:params});
  return verifiedOidcSubject(provider,tokens.id_token,config,attempt.nonce);
}
