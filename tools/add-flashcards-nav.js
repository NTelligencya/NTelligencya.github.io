#!/usr/bin/env node
'use strict';
/**
 * add-flashcards-nav.js
 * ---------------------------------------------------------------------------
 * Adds a "Flashcards" link to nav.site-nav, directly after the "Resources"
 * link, on every page that carries one. Idempotent.
 *
 * Pages whose nav has no Resources link are left alone, matching how the
 * Workshops and Resources links were rolled out: the short course-page nav
 * stays short.
 *
 *   node tools/add-flashcards-nav.js            apply
 *   node tools/add-flashcards-nav.js --dry-run  report only
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', '_to_delete', 'node_modules', 'assets']);
const LINK = '<a href="/flashcards/">Flashcards</a>';

function walk(dir, out) {
  out = out || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(full, out); }
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

const dryRun = process.argv.includes('--dry-run');
let changed = 0, already = 0, noNav = 0, noResources = 0;

for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8');
  const nav = html.match(/<nav class="site-nav">([\s\S]*?)<\/nav>/);
  if (!nav) { noNav++; continue; }
  if (nav[1].includes('href="/flashcards/"')) { already++; continue; }
  const res = nav[0].match(/\n(\s*)<a href="[^"]*\/resources\/"[^>]*>Resources<\/a>/);
  if (!res) { noResources++; continue; }
  const updated = nav[0].replace(res[0], res[0] + '\n' + res[1] + LINK);
  if (!dryRun) fs.writeFileSync(file, html.replace(nav[0], updated));
  changed++;
  console.log('  + ' + path.relative(ROOT, file));
}

console.log('\n' + (dryRun ? 'would change ' : 'changed ') + changed +
  ' page(s); ' + already + ' already had it; ' + noResources +
  ' with a nav but no Resources link; ' + noNav + ' with no site nav.');
