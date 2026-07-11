
import { NextResponse } from "next/server";
import { authorize, decodeBase64, encodeBase64, getGithubFile, putGithubFile } from "../../../../lib/githubAdmin";
const DATA_PATH = "data/songs.js";
function parseSongs(source) {
  const match = source.match(/export const songs = (\[[\s\S]*\]);\s*export function/);
  if (!match) throw new Error("Could not parse data/songs.js");
  return JSON.parse(match[1]);
}
function serializeSongs(songs) {
  return "export const songs = " + JSON.stringify(songs, null, 2) +
    ";\n\nexport function getSong(slug) { return songs.find((song) => song.slug === slug); }\n";
}

const allowedExtensions = new Set(["png", "jpg", "jpeg", "webp"]);
export async function POST(request) {
  if (!authorize(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { slug, cardCode, extension, contentBase64 } = await request.json();
    const ext = String(extension || "").toLowerCase();
    if (!allowedExtensions.has(ext)) throw new Error("Use PNG, JPG, JPEG, or WEBP.");
    if (!contentBase64) throw new Error("No image was received.");

    const imagePath = `public/media/cards/${cardCode}.${ext}`;
    const existingImage = await getGithubFile(imagePath);
    await putGithubFile({
      path: imagePath,
      message: `Upload ${cardCode} card from STV Editor`,
      contentBase64,
      sha: existingImage?.sha,
    });

    const file = await getGithubFile(DATA_PATH);
    if (!file) throw new Error("data/songs.js was not found.");
    const songs = parseSongs(decodeBase64(file.content));
    const index = songs.findIndex((song) => song.slug === slug);
    if (index < 0) throw new Error("Song was not found.");

    const artworkPath = `/media/cards/${cardCode}.${ext}`;
    songs[index] = { ...songs[index], artwork: artworkPath };
    await putGithubFile({
      path: DATA_PATH,
      message: `Connect ${cardCode} artwork from STV Editor`,
      contentBase64: encodeBase64(serializeSongs(songs)),
      sha: file.sha,
    });
    return NextResponse.json({ ok: true, artworkPath });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
