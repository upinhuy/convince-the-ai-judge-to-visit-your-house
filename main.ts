// Convince the AI Judge to Visit Your House — entrypoint.
//
// The invitation image (entry.png) is authored ahead of time and shipped
// in this repository. This program does no rendering at runtime: it only
// copies the committed image to /output/entry.png, using pure Node.js
// (node:fs / node:path / node:url only — no child processes, no network,
// no environment secrets).
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const target = join("/output", "entry.png");

// Sanity check: the committed file must be a real PNG (8-byte signature)
// before we copy it anywhere.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const head = readFileSync(source).subarray(0, 8);
if (!head.equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a valid PNG file");
}

mkdirSync("/output", { recursive: true });
copyFileSync(source, target);
const bytes = statSync(target).size;
console.log(`Wrote ${target} (${bytes} bytes)`);
