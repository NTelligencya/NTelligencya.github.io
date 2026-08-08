#!/usr/bin/env node
// flashcards/convert.js
// Converts flashcards/sets/<slug>.csv into flashcards/sets/<slug>.json.
// Metadata (title, subject, level, source, licence) is read from sets.json,
// so regenerating a set never loses it. Run by hand: node flashcards/convert.js

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'sets');
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'sets.json'), 'utf8'));

// RFC 4180: quoted fields may contain commas, newlines and doubled quotes.
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length > 1 && r.some(x => x.trim()));
}

// House rule: Australian English, and no em-dashes anywhere on the site.
const SPELLING = [
  [/\bmaximize\b/g, 'maximise'], [/\bMaximize\b/g, 'Maximise'],
  [/\bcentralized\b/g, 'centralised'], [/\bCentralized\b/g, 'Centralised'],
  [/\bunauthorized\b/g, 'unauthorised'], [/\bUnauthorized\b/g, 'Unauthorised'],
  [/\borganizational\b/g, 'organisational'], [/\borganization\b/g, 'organisation'],
  [/\bprioritize\b/g, 'prioritise'], [/\bminimize\b/g, 'minimise'],
  [/\brecognize\b/g, 'recognise'], [/\bsummarize\b/g, 'summarise'],
  [/\banalyze\b/g, 'analyse'], [/\blabeled\b/g, 'labelled'],
  [/\borganizations\b/g, 'organisations'],
  [/\bbehavior\b/g, 'behaviour'], [/\bbehaviors\b/g, 'behaviours'],
  [/\bspecialized\b/g, 'specialised'], [/\bspecialize\b/g, 'specialise'],
  [/\bsynchronization\b/g, 'synchronisation'], [/\bsynchronize\b/g, 'synchronise'],
  [/\bauthorization\b/g, 'authorisation'], [/\bauthorize\b/g, 'authorise'],
  [/\bauthorized\b/g, 'authorised'], [/\bcategorize\b/g, 'categorise'],
  [/\bcustomize\b/g, 'customise'], [/\boptimize\b/g, 'optimise'],
  [/\butilize\b/g, 'utilise'], [/\bnormalize\b/g, 'normalise'],
  [/\bvirtualization\b/g, 'virtualisation'], [/\bmodeling\b/g, 'modelling'],
  [/\bcatalog\b/g, 'catalogue'], [/\bdefense\b/g, 'defence'],
  // Capitalised -ization forms are deliberately NOT in this table: the ISM's own
  // proper nouns ("International Organization for Standardization", "Route Origin
  // Authorization") must be reproduced exactly as the source publishes them.
  [/\u2014/g, ';'], [/\u2013/g, ',']
];
const auEnglish = s => SPELLING.reduce((t, [re, to]) => t.replace(re, to), s);

let warnings = 0;
for (const meta of manifest.sets) {
  const csvPath = path.join(DIR, meta.slug + '.csv');
  if (!fs.existsSync(csvPath)) { console.log('skip  ' + meta.slug + ' (no csv yet)'); continue; }

  const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
  const header = rows[0].map(h => h.trim().toLowerCase());
  if (header[0] !== 'front' || header[1] !== 'back') {
    throw new Error(meta.slug + ': expected a "Front,Back" header row, got "' + rows[0].join(',') + '"');
  }

  const seen = new Set();
  const cards = [];
  rows.slice(1).forEach((r, i) => {
    const f = auEnglish(r[0].trim());
    const b = auEnglish(r[1].trim());
    if (!f || !b) { console.warn('  ! ' + meta.slug + ' row ' + (i + 2) + ': empty side, skipped'); warnings++; return; }
    if (seen.has(f)) { console.warn('  ! ' + meta.slug + ' row ' + (i + 2) + ': duplicate front "' + f + '", skipped'); warnings++; return; }
    seen.add(f);
    cards.push({ f, b });
  });

  const out = {
    slug: meta.slug,
    title: meta.title,
    subject: meta.subject,
    level: meta.level,
    source: meta.source || null,
    licence: meta.licence || null,
    entryKind: meta.entryKind || null,
    blurb: meta.blurb || null,
    updated: new Date().toISOString().slice(0, 10),
    cards
  };
  fs.writeFileSync(path.join(DIR, meta.slug + '.json'), JSON.stringify(out, null, 2) + '\n');
  meta.count = cards.length;
  // A set only appears in the catalogue once its JSON exists.
  meta.ready = true;
  console.log('write ' + meta.slug + '.json  ' + cards.length + ' cards');
}

fs.writeFileSync(path.join(DIR, 'sets.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(warnings ? '\nDone, with ' + warnings + ' warning(s) above.' : '\nDone.');
