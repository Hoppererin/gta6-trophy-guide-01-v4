// Vice Platinum — GTA VI trophy guide & tracker (gta6-trophy-guide-01).
//
// What this program hands in: the static guide in this directory's app/
// (index.html, app.js, style.css, data/trophies.json — plain files, no build
// step, nothing fetched over the network) plus the screenshots/ renders of it.
// It copies both into /output and writes /output/dossier.json, the summary the
// judge reads (your screenshots, the first load's files and bytes, and your
// source), using the vendored make.fun library.
//
// Two things matter for where this runs. First, the grader starts this file
// from a different working directory (node /bot/main.ts), so every path here
// is built from this file's own directory, never from the current directory.
// Second, vendor/makefun-frontend.ts is the kit's copy and must stay exactly
// as the kit handed it out: the scorer rebuilds the dossier with its own copy
// and requires the two to be byte for byte identical.
//
// Try it locally with any static server over app/, or build the hand-in with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in, wherever the
// grader starts it from.
const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoDir, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoDir, 'screenshots'))) {
  cpSync(join(repoDir, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the dossier's bytes; the
// others refuse an entry the scorer would refuse (more than 4 screenshots or
// one over 256 KiB; more than 993 files and directories in app/ or 48 MiB of
// app files — app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
