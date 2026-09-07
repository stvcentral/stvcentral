import { createClaims,claimInventory,revokeClaim } from '../../../../lib/customerStore.mjs';
import { requireOwner,body,json,failure } from '../../../../lib/customerHttp.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request){try{requireOwner(request);return json({claims:claimInventory()});}catch(e){return failure(e);}}
export async function POST(request){try{const data=await body(request);requireOwner(request);if(data.revoke){revokeClaim(data.revoke);return json({ok:true});}return json({claims:createClaims(data)});}catch(e){return failure(e);}}
