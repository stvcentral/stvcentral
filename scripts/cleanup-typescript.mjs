import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

for (const name of ["tsconfig.json", "next-env.d.ts"]) {
  const target = path.join(root, name);
  if (fs.existsSync(target)) fs.rmSync(target);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (full.endsWith(".ts") || full.endsWith(".tsx")) {
      fs.rmSync(full);
    }
  }
}

walk(root);
console.log("Removed legacy TypeScript files before build.");
