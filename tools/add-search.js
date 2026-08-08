#!/usr/bin/env node
'use strict';

/**
 * add-search.js
 * ---------------------------------------------------------------------------
 * Adds the shared site search to every page that carries the site header.
 *
 * Two edits per page, both idempotent:
 *   1. an "Index" link in nav.site-nav, placed before About
 *   2. <script src="/search.js" defer></script> before </body>
 *
 * Pages without <header class="site"> are left alone. That is the slide decks
 * under /workshops/, /presentations/ and /simulations/, which run their own
 * full-screen chrome and have no site nav to put a search field in.
 *
 *   node tools/add-search.js            apply
 *   node tools/add-search.js --dry-run  report only
 * ---------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', '_to_delete', 'node_modules', 'assets']);

const SCRIPT_TAG = '<script src="/search.js" defer></script>';
const NAV_LINK = '<a href="/index/">Index</a>';

function walk(dir, out) {
  out = out || [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function addNavLink(html) {
  const navMatch = html.match(/<nav class="site-nav">([\s\S]*?)<\/nav>/);
  if (!navMatch) return { html, changed: false };
  if (navMatch[1].includes('href="/index/"')) return { html, changed: false };

  let nav = navMatch[0];
  // Match the indentation of the links already in the nav.
  const indentMatch = navMatch[1].match(/\n(\s*)<a /);
  const indent = indentMatch ? indentMatch[1] : '      ';

  const aboutMatch = nav.match(/\n\s*<a href="[^"]*#about"[^>]*>/);
  if (aboutMatch) {
    nav = nav.replace(aboutMatch[0], '\n' + indent + NAV_LINK + aboutMatch[0]);
  } else {
    nav = nav.replace(/\n?(\s*)<\/nav>/, '\n' + indent + NAV_LINK + '\n$1</nav>');
  }
  return { html: html.replace(navMatch[0], nav), changed: true };
}

function addScript(html) {
  if (html.includes('src="/search.js"')) return { html, changed: false };
  if (!html.includes('</body>')) return { html, changed: false };
  return { html: html.replace(/([^\S\n]*)<\/body>/, '$1' + SCRIPT_TAG + '\n$1</body>'), changed: true };
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const files = walk(ROOT);

  let touched = 0;
  let navAdded = 0;
  let scriptAdded = 0;
  const skipped = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    let html = fs.readFileSync(file, 'utf8');

    if (!html.includes('<header class="site"')) {
      skipped.push(rel);
      continue;
    }

    const nav = addNavLink(html);
    html = nav.html;
    const script = addScript(html);
    html = script.html;

    if (nav.changed) navAdded++;
    if (script.changed) scriptAdded++;
    if (nav.changed || script.changed) {
      touched++;
      if (!dryRun) fs.writeFileSync(file, html);
    }
  }

  console.log((dryRun ? 'would edit ' : 'edited ') + touched + ' page' + (touched === 1 ? '' : 's'));
  console.log('  nav "Index" links added   ' + navAdded);
  console.log('  script tags added         ' + scriptAdded);
  console.log('  no site header, skipped   ' + skipped.length);
}

main();
