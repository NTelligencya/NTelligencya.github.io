#!/usr/bin/env node
'use strict';

/**
 * add-artwork.js
 * ---------------------------------------------------------------------------
 * Applies the artwork plates in /assets/artwork/ across the site, following
 * the design handoff of 10 August 2026 (design_handoff_site_artwork/).
 *
 * Three edits per page, all idempotent:
 *   1. a plate behind the page masthead, or an uncropped plate band above it
 *   2. a plate band across the top of the footer
 *   3. nothing else; body text stays on flat --bg
 *
 * The treatment and the plate come from PLATES below, matched on the longest
 * path prefix. Re-running after changing that table swaps the plates in place
 * rather than nesting a second wrapper.
 *
 * Pages with no <header class="site"> are skipped by design: the slide decks
 * under /workshops/, /presentations/ and /simulations/ run their own
 * full-screen chrome. /simulations/ is skipped outright at SD's decision
 * (10 August 2026): the catalogue keeps its current look and CSS.
 *
 *   node tools/add-artwork.js            apply
 *   node tools/add-artwork.js --dry-run  report only
 * ---------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set([
  '.git', '_to_delete', 'node_modules', 'assets',
  'digitalliteracy',              // gitignored source archive
  'design_handoff_site_artwork',  // the handoff bundle itself
  'simulations',                  // untouched at SD's decision
  'workshops', 'presentations/decks',
]);

/* Plate assignments. Fixed by the client during design for the nine mocked
   page types; extended here to the sections the mock did not cover, keeping
   two rules: one wordmark plate per page, and footer plates 3.5:1 or wider.

     type    'masthead' puts the plate behind the masthead at 0.42 opacity;
             'band' runs it uncropped above the masthead at its own ratio.
     band    depth cap for a band: 'sm' 240px, 'md' 300px, 'lg' 360px,
             omitted for the 420px default.
     session plate for the session pages inside a course folder, which take
             the masthead treatment even where the course home takes a band.
     pos     'high' shifts a masthead crop to 78% 42%.
     foot    the footer plate, shown whole.                                */
const PLATES = {
  'presentations':    { type: 'masthead', plate: 'hero-motherboard-chip',        foot: 'banner-mouse-lightbulb-keyboard' },
  'flashcards':       { type: 'masthead', plate: 'hero-keyboard-closeup', pos: 'high', foot: 'footer-keyboard-data-monogram' },
  'resources':        { type: 'band', plate: 'banner-mouse-lightbulb-keyboard', band: 'md', foot: 'footer-mouse-lightbulb-monogram' },
  'references':       { type: 'masthead', plate: 'hero-motherboard-chip1',       foot: 'footer-data-table-monogram' },
  'index':            { type: 'band', plate: 'banner-wordmark-usb', band: 'sm',   foot: 'footer-data-table-monogram' },

  'excel':            { type: 'band', plate: 'banner-laptop-spreadsheet', band: 'lg', session: 'hero-square-laptop-spreadsheet', foot: 'footer-keyboard-data-monogram' },
  'powerbi-siem':     { type: 'band', plate: 'banner-laptop-spreadsheet', band: 'lg', foot: 'footer-keyboard-data-monogram' },
  'pandanus-reach':   { type: 'band', plate: 'banner-laptop-spreadsheet', band: 'lg', foot: 'footer-keyboard-data-monogram' },

  'cybersecurity':    { type: 'masthead', plate: 'hero-padlock-circuit', session: 'hero-padlock-wordmark', foot: 'footer-data-table-monogram' },
  'ai-literacy':      { type: 'masthead', plate: 'hero-motherboard-chip1',       foot: 'footer-mouse-lightbulb-monogram' },
  'ai-for-research':  { type: 'masthead', plate: 'hero-portrait-chip-wordmark',  foot: 'footer-mouse-lightbulb-monogram' },
  'digital-literacy': { type: 'masthead', plate: 'hero-wordmark-keyboard-usb',   foot: 'footer-mouse-lightbulb-monogram' },
  'word':             { type: 'masthead', plate: 'hero-keyboard-closeup',        foot: 'footer-data-table-monogram' },
  'powerpoint':       { type: 'masthead', plate: 'hero-square-laptop-spreadsheet', foot: 'footer-data-table-monogram' },
  'visio':            { type: 'masthead', plate: 'hero-motherboard-chip',        foot: 'footer-keyboard-data-monogram' },
  'cdu-ai-staff':     { type: 'masthead', plate: 'hero-motherboard-chip',        foot: 'footer-wordmark-url' },

  // The manual runs its own .manual-masthead, so it takes the footer plate only.
  'shadow-ai-manual': { type: 'none', foot: 'footer-wordmark-url' },

  // Client areas. Artwork deliberately minimal: a plate behind the masthead
  // and a footer plate, nothing else. A page carrying an Acknowledgement of
  // Country should not have artwork competing with it.
  'roper-gulf':       { type: 'masthead', plate: 'hero-portrait-keyboard',       foot: 'footer-mouse-lightbulb-monogram' },
  'alice-springs-arn':{ type: 'masthead', plate: 'hero-portrait-keyboard',       foot: 'footer-mouse-lightbulb-monogram' },

  // Home. The band and the divider are hand-authored in index.html, since the
  // page has no masthead; the script only maintains its footer plate.
  '':                 { type: 'none', foot: 'footer-mouse-lightbulb-monogram' },
};

/* Alt text for the plates shown whole. Plates behind a masthead are decorative
   and carry alt="", because the headline over them says the same thing. */
const ALT = {
  'banner-wordmark-keyboard':        'The Ntell World Ink wordmark across a backlit keyboard',
  'banner-wordmark-usb':             'The Ntell World Ink wordmark with a USB drive',
  'banner-mouse-lightbulb-keyboard': 'Circuitry, a keyboard and a mouse holding a lit bulb',
  'banner-laptop-spreadsheet':       'A laptop showing a spreadsheet, with circuitry and the NT monogram',
  'banner-laptop-monogram':          'A laptop beside the NT monogram',
  'footer-mouse-lightbulb-monogram': 'A mouse holding a lit bulb, with the NT monogram',
  'footer-keyboard-data-monogram':   'A keyboard, a data table and the NT monogram',
  'footer-data-table-monogram':      'A data table beside the NT monogram',
  'footer-wordmark-url':             'The Ntell World Ink wordmark with the site address',
  'footer-monogram-chip':            'The NT monogram beside a processor chip',
};

const OPEN = '<!-- artwork: generated by tools/add-artwork.js; edit the script, not this -->';
const CLOSE = '<!-- /artwork -->';

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

function picture(plate, alt, lazy) {
  const a = alt ? ` alt="${alt}"` : ' alt=""';
  const l = lazy ? ' loading="lazy"' : '';
  return '<picture>'
    + `<source srcset="/assets/artwork/${plate}.webp" type="image/webp">`
    + `<img src="/assets/artwork/${plate}.jpg"${a}${l}>`
    + '</picture>';
}

/* Finds the close tag matching an open tag at `from`, counting nested tags of
   the same name. Returns the index just past the close tag. */
function matchClose(html, from, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi');
  re.lastIndex = from;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') { depth--; if (depth === 0) return m.index + m[0].length; }
    else if (!m[0].endsWith('/>')) depth++;
  }
  return -1;
}

/* The masthead element, whichever tag carries the class. */
function findMasthead(html) {
  const m = html.match(/<(section|div)\b[^>]*class="[^"]*\bpage-masthead\b[^"]*"[^>]*>/i);
  if (!m) return null;
  const start = m.index;
  const end = matchClose(html, start, m[1]);
  return end === -1 ? null : { start, end };
}

/* The end of the outermost block element still open at `minEnd`. The masthead
   is sometimes wrapped in its own <div class="container">, which starts after
   the breadcrumb block; ending the wrap at the masthead's own close tag would
   cut that container in half. */
function balancedEnd(html, start, minEnd) {
  const re = /<(div|section)\b[^>]*>|<\/(div|section)>/gi;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') {
      depth--;
      const end = m.index + m[0].length;
      if (depth <= 0 && end >= minEnd) return end;
      if (depth < 0) return -1;
    } else if (!m[0].endsWith('/>')) {
      depth++;
    }
  }
  return -1;
}

/* The container that holds the breadcrumb, if it sits above the masthead. */
function findBreadcrumbBlock(html, before) {
  const re = /<div\b[^>]*class="[^"]*\bcontainer(?:-course|-content)?\b[^"]*"[^>]*>\s*(?:<!--[\s\S]*?-->\s*)?<nav class="breadcrumb">/gi;
  let m, best = null;
  while ((m = re.exec(html))) { if (m.index < before) best = m.index; else break; }
  if (best === null) return null;
  const end = matchClose(html, best, 'div');
  return end === -1 || end > before ? null : { start: best, end };
}

function applyMasthead(html, cfg, plate) {
  const art = '<div class="masthead-art' + (cfg.pos === 'high' ? ' masthead-art-high' : '') + '">'
    + picture(plate, '', false) + '</div>';

  // Already wrapped: swap the plate in place.
  if (/class="masthead-plate"/.test(html)) {
    const swapped = html.replace(/<div class="masthead-art[^"]*">[\s\S]*?<\/div>\n/, art + '\n');
    return { html: swapped, action: swapped === html ? 'unchanged' : 'plate swapped' };
  }

  const mast = findMasthead(html);
  if (!mast) return { html, action: 'no masthead' };
  const crumb = findBreadcrumbBlock(html, mast.start);
  const start = crumb ? crumb.start : mast.start;

  const end = balancedEnd(html, start, mast.end);
  if (end === -1) return { html, action: 'unbalanced markup, skipped' };

  const inner = html.slice(start, end);
  const wrapped = OPEN + '\n<div class="masthead-plate">\n' + art + '\n'
    + inner + '\n</div>\n' + CLOSE;

  return { html: html.slice(0, start) + wrapped + html.slice(end), action: 'masthead wrapped' };
}

function applyBand(html, cfg, plate) {
  const depth = cfg.band ? ' plate-band-' + cfg.band : '';
  const block = OPEN + '\n<section class="plate-band r-' + plate + depth + '">\n'
    + picture(plate, ALT[plate] || '', false) + '\n'
    + '<div class="plate-band-fade"></div>\n'
    + '</section>\n' + CLOSE;

  if (/class="plate-band /.test(html) || /class="plate-band"/.test(html)) {
    const re = new RegExp(OPEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      + '\\n<section class="plate-band[\\s\\S]*?</section>\\n' + CLOSE);
    const swapped = html.replace(re, block);
    return { html: swapped, action: swapped === html ? 'unchanged' : 'band swapped' };
  }

  const mast = findMasthead(html);
  if (!mast) return { html, action: 'no masthead' };
  const crumb = findBreadcrumbBlock(html, mast.start);
  const at = crumb ? crumb.start : mast.start;
  return { html: html.slice(0, at) + block + '\n\n' + html.slice(at), action: 'band added' };
}

function applyFooter(html, plate) {
  const foot = '<div class="plate-foot">' + picture(plate, ALT[plate] || '', true) + '</div>';

  if (/class="plate-foot"/.test(html)) {
    const swapped = html.replace(/<div class="plate-foot">[\s\S]*?<\/div>/, foot);
    return { html: swapped, action: swapped === html ? 'unchanged' : 'footer swapped' };
  }

  const m = html.match(/<footer\b[^>]*class="([^"]*\bsite\b[^"]*)"[^>]*>/i);
  if (!m) return { html, action: 'no footer' };

  let tag = m[0];
  if (!/\bfooter-plate\b/.test(m[1])) {
    tag = tag.replace('class="' + m[1] + '"', 'class="' + m[1] + ' footer-plate"');
  }
  const at = m.index + m[0].length;
  return {
    html: html.slice(0, m.index) + tag + '\n' + foot + html.slice(at),
    action: 'footer added',
  };
}

/* Longest matching path prefix wins. */
function configFor(rel) {
  const parts = rel.split('/');
  const section = parts.length > 1 ? parts[0] : '';
  return PLATES[section] || null;
}

const dryRun = process.argv.includes('--dry-run');
let touched = 0, skipped = 0, noConfig = 0;
const report = [];

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (/-original\.html$/.test(rel)) { skipped++; continue; }

  const original = fs.readFileSync(file, 'utf8');
  if (!/<header class="site">/.test(original)) { skipped++; continue; }

  const cfg = configFor(rel);
  if (!cfg) { noConfig++; report.push('  no plate assignment  ' + rel); continue; }

  // A session page inside a course folder takes the masthead treatment even
  // where the course home takes a band.
  const isHome = /(^|\/)index\.html$/.test(rel);
  const useSession = !isHome && cfg.session;
  const type = useSession ? 'masthead' : cfg.type;
  const plate = useSession ? cfg.session : cfg.plate;

  let html = original;
  const actions = [];

  if (type === 'masthead' && plate) {
    const r = applyMasthead(html, cfg, plate); html = r.html; actions.push(r.action);
  } else if (type === 'band' && plate) {
    const r = applyBand(html, cfg, plate); html = r.html; actions.push(r.action);
  }

  if (cfg.foot) {
    const r = applyFooter(html, cfg.foot); html = r.html; actions.push(r.action);
  }

  if (html !== original) {
    touched++;
    report.push('  ' + rel + '  [' + actions.join(', ') + ']');
    if (!dryRun) fs.writeFileSync(file, html);
  }
}

console.log(report.join('\n'));
console.log('\n' + (dryRun ? 'would change' : 'changed') + ': ' + touched
  + '   skipped (no site header or -original): ' + skipped
  + '   no plate assignment: ' + noConfig);
