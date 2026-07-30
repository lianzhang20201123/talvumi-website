#!/usr/bin/env node
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
const serverEntry = path.join(dist, "server", "index.js");
copyFileSync(worker, serverEntry);
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));
cpSync(path.join(root, "lib"), path.join(dist, "server", "lib"), { recursive: true });
cpSync(path.join(root, "content"), path.join(dist, "server", "content"), { recursive: true });
writeFileSync(
  serverEntry,
  readFileSync(serverEntry, "utf8")
    .replaceAll('"../content/', '"./content/')
    .replaceAll('"../lib/', '"./lib/'),
  "utf8",
);

console.log("Prepared Sites build with worker, shared validation and content data.");
