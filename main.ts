// post-x-promote-make-your-own-bounty-01 entry — Node 22, standard library only.
//
// What this program does, and nothing else: it hands the grader the address
// of the X post that IS the entry. The post (a quote of make.fun's
// make-your-own-bounty announcement at
// https://x.com/makefunai/status/2124915864336236646, with a promo image and
// the entrant's play code in its text) lives on X; POST.json at the repo root
// names it, and this script copies that file into the output directory where
// the gate picks it up. The house then reads the post's replies, reposts and
// quotes and ranks it by their sum.
//
// Where the file comes from matters. The grader launches this script as
// `node /bot/main.ts` while its own working directory is somewhere else, so
// resolving POST.json from process.cwd() would look in the wrong place and
// the entry would fail. The path is therefore built from this module's own
// URL — the file sitting next to this script — which is true no matter
// where the process was started from.
//
// The output directory honours MAKEFUN_OUTPUT_DIR when the harness sets it
// (local runs use a scratch folder); otherwise it is /output.

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

function postJsonPath(): string {
  // import.meta.url is the URL of this very file; './POST.json' next to it
  // is the repo-root POST.json, regardless of the process cwd.
  return new URL('./POST.json', import.meta.url).pathname;
}

function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const source = postJsonPath();
  const target = join(outputDir, 'POST.json');

  mkdirSync(outputDir, { recursive: true });

  try {
    copyFileSync(source, target);
  } catch (err) {
    console.error(`could not copy ${source} to ${target}: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
