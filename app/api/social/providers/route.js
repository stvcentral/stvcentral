import {availableSocialProviders} from '../../../../lib/socialConfig.mjs';
export const dynamic='force-dynamic';
export async function GET(){return Response.json({providers:availableSocialProviders()},{headers:{'Cache-Control':'no-store'}});}
