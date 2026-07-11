
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN;

export function authorize(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");
  return Boolean(expected && provided && provided === expected);
}

function ensureConfig() {
  if (!owner || !repo || !token) throw new Error("Missing GitHub environment variables.");
}

export async function getGithubFile(path) {
  ensureConfig();
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURI(path)}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    }
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed: ${response.status}`);
  return response.json();
}

export async function putGithubFile({ path, message, contentBase64, sha }) {
  ensureConfig();
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURI(path)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message, content: contentBase64, branch, ...(sha ? { sha } : {}),
      }),
    }
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || `GitHub write failed: ${response.status}`);
  return result;
}

export function decodeBase64(value) {
  return Buffer.from(value.replace(/\n/g, ""), "base64").toString("utf8");
}
export function encodeBase64(value) {
  return Buffer.from(value, "utf8").toString("base64");
}
