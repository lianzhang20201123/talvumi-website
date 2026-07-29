#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "dist", "client", "index.html");
const serverEntry = path.join(root, "dist", "ssr", "entry-server.js");
const template = readFileSync(htmlPath, "utf8");
const { render } = await import(pathToFileURL(serverEntry).href);
const markup = render();

if (!template.includes('<div id="root"></div>')) {
  throw new Error("Unable to find the app root in the generated HTML.");
}

writeFileSync(
  htmlPath,
  template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
  "utf8",
);

console.log("Prerendered TALVUMI homepage for search and AI crawlers.");
