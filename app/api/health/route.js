import {db} from '../../../lib/customerStore.mjs';
export const dynamic='force-dynamic';
export async function GET(){try{db().prepare('SELECT 1').get();return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({ok:false},{status:503});}}
