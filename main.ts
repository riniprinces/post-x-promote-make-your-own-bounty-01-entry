// Entry program for the make.fun X-promote bounty (Node 22, stdlib only).
//
// The entry itself is the X post: a quote of make.fun's make-your-own-bounty
// announcement, with a photo attached and the entrant's play code in its text.
// This script's only job is to hand the grader that post's address, which
// lives in POST.json at the repo root.
//
// POST.json is located relative to this script file (import.meta.url), never
// relative to the process working directory, so the grader can run it from
// any cwd. The copy lands in MAKEFUN_OUTPUT_DIR, or /output by default.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
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
  try {
    const data = JSON.parse(readFileSync(target, 'utf8')) as unknown;
    if (typeof data !== 'object' || data === null || typeof (data as { url?: unknown }).url !== 'string' || !(data as { url: string }).url.startsWith('https://x.com/')) {
      throw new Error('POST.json must be an object with a url string starting with https://x.com/');
    }
    console.log(`copied post URL: ${(data as { url: string }).url}`);
  } catch (err) {
    console.error(`invalid POST.json in ${target}: ${(err as Error).message}`);
    process.exit(1);
  }
}
main();
