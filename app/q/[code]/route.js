import { NextResponse } from "next/server";
import { getQrDestination } from "../../../lib/qrRedirects.js";

// Keep these redirects dynamic so a future song-slug change can be updated
// centrally without changing the short URL printed on a physical card.
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const { code } = await context.params;
  const destination = getQrDestination(code);

  if (!destination) {
    return new Response("Unknown Royal Chaos card code.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // 307 intentionally avoids permanent browser caching. The printed /q/ path
  // remains permanent while its destination stays editable in data/songs.js.
  return NextResponse.redirect(new URL(destination, request.url), 307);
}
