import { cookies } from 'next/headers';
import { register,login,recover,newSession,logout,collection,redeem,reveal,CustomerError } from '../../../../lib/customerStore.mjs';
import { currentUser,requireUser,body,authLimit,setSession,SESSION_COOKIE,json,failure } from '../../../../lib/customerHttp.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request,{params}){try{const {action}=await params;if(action!=='me')return json({error:'Not found'},404);const user=await currentUser();return json({user,collection:user?collection(user):[]});}catch(e){return failure(e);}}
export async function POST(request,{params}){try{
  const {action}=await params,data=await body(request);
  if(['register','login','recover'].includes(action)){
    authLimit(request);let result;
    if(action==='register')result=await register(data.username,data.password);
    if(action==='login')result={user:await login(data.username,data.password)};
    if(action==='recover')result=await recover(data.username,data.recovery,data.password);
    await setSession(newSession(result.user));return json(result);
  }
  if(action==='logout'){logout((await cookies()).get(SESSION_COOKIE)?.value);(await cookies()).delete(SESSION_COOKIE);return json({ok:true});}
  const user=await requireUser();
  if(action==='redeem')return json(redeem(user,data.code));
  if(action==='reveal'){reveal(user,data.slug);return json({ok:true});}
  throw new CustomerError('Not found',404);
}catch(e){return failure(e);}}
