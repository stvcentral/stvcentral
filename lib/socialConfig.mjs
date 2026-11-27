export const SOCIAL_PROVIDERS = ['google', 'facebook', 'apple'];
export const SOCIAL_LABELS = {google:'Google', facebook:'Facebook', apple:'Apple'};
export function socialOrigin(env=process.env) {
  try {
    const url=new URL(env.APP_ORIGIN);
    if(url.protocol!=='https:' || url.username || url.password || url.pathname!=='/' || url.search || url.hash) return null;
    return url.origin;
  } catch {return null;}
}
export function socialConfig(provider, env=process.env) {
  if(!SOCIAL_PROVIDERS.includes(provider) || env.SOCIAL_LOGIN_ENABLED!=='1' || env.CUSTOMER_STORAGE_READY!=='1' || !socialOrigin(env)) return null;
  const prefix=provider.toUpperCase();
  const id=env[`${prefix}_CLIENT_ID`], secret=env[`${prefix}_CLIENT_SECRET`];
  if(!id || id.startsWith('REPLACE_'))return null;
  if(provider==='apple') {
    if(!env.APPLE_TEAM_ID || !env.APPLE_KEY_ID || !env.APPLE_PRIVATE_KEY)return null;
  } else if(!secret || secret.startsWith('REPLACE_')) return null;
  if(provider==='facebook' && !/^v\d+\.0$/.test(env.FACEBOOK_GRAPH_VERSION||''))return null;
  return {id,secret,origin:socialOrigin(env),redirect:`${socialOrigin(env)}/api/social/${provider}/callback`,graphVersion:env.FACEBOOK_GRAPH_VERSION};
}
export function availableSocialProviders(env=process.env) {
  return SOCIAL_PROVIDERS.filter(p=>socialConfig(p,env)).map(id=>({id,name:SOCIAL_LABELS[id]}));
}
export function safeAccountNext(value) {
  if(typeof value!=='string')return '/collection';
  return /^\/(?:collection|redeem|playlist)$/.test(value) || /^\/song\/[a-z0-9-]+$/.test(value) ? value : '/collection';
}
