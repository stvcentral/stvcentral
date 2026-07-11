
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

export async function POST(request) {
  if (!authorize(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { slug, patch } = await request.json();
    const file = await getGithubFile(DATA_PATH);
    if (!file) throw new Error("data/songs.js was not found.");
    const songs = parseSongs(decodeBase64(file.content));
    const index = songs.findIndex((song) => song.slug === slug);
    if (index < 0) throw new Error("Song was not found.");
    songs[index] = {
      ...songs[index],
      title: patch.title,
      bpm: Number(patch.bpm),
      musicalKey: patch.musicalKey,
      duration: patch.duration,
      energeticValue: patch.energeticValue ? Number(patch.energeticValue) : null,
      why: patch.why || "",
      lyrics: Array.isArray(patch.lyrics) ? patch.lyrics : [],
    };
    await putGithubFile({
      path: DATA_PATH,
      message: `Edit ${songs[index].title} from STV Editor`,
      contentBase64: encodeBase64(serializeSongs(songs)),
      sha: file.sha,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
