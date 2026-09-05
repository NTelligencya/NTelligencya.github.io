#!/usr/bin/env node
'use strict';

/**
 * build-index.js
 * ---------------------------------------------------------------------------
 * Generates search-index.json and sitemap.xml for ntworldink.com.
 *
 * GitHub Pages has no build step, so both outputs are checked-in artefacts.
 * Run this by hand whenever pages are added, moved or renamed, then commit
 * the regenerated files alongside the page changes.
 *
 *   node tools/build-index.js              build both files
 *   node tools/build-index.js --sync       also add stubs for new pages to
 *                                          tools/index-meta.json
 *   node tools/build-index.js --dry-run    report only, write nothing
 *   node tools/build-index.js --no-git-dates
 *                                          skip the git lookup for published
 *                                          dates (only useful outside a repo)
 *
 * Any published date not set by hand in tools/index-meta.json is filled from
 * the file's first commit. That happens by default; --no-git-dates turns it
 * off, which leaves most pages undated and empties any recently-published
 * list, so reach for it only when git is unavailable.
 *
 * Hand-maintained values (topic, published, and any title or type override)
 * live in tools/index-meta.json, keyed by URL. They survive regeneration;
 * this script never overwrites them.
 * ---------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/* ===========================================================================
   CONFIGURATION
   =========================================================================== */

const ROOT = path.resolve(__dirname, '..');
const META_FILE = path.join(__dirname, 'index-meta.json');
const INDEX_OUT = path.join(ROOT, 'search-index.json');
const SITEMAP_OUT = path.join(ROOT, 'sitemap.xml');

// Read the live domain from CNAME so the sitemap never carries a guessed host.
const ORIGIN = (function () {
  try {
    return 'https://' + fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim();
  } catch (e) {
    return null; // no CNAME; sitemap generation is skipped
  }
})();

// Include the hub page of each section (/simulations/, /presentations/ and so on).
const INCLUDE_SECTION_HUBS = true;

// Include the site's own front page as an index entry. Off by default; the
// banner logo already goes home, and it groups awkwardly under Resources.
const INCLUDE_HOMEPAGE = false;

// Add the meta description to each entry. Off by default so the output matches
// the handoff spec exactly. Turning it on also needs one line changed in the
// search code, which concatenates title, section, topic and url when matching.
const INCLUDE_DESCRIPTION = false;

// Directories never walked.
const SKIP_DIRS = new Set([
  '.git',
  '_to_delete',        // duplicate copy of the site kept for screenshot rendering
  'digitalliteracy',   // legacy Tennant Creek path; duplicates /digital-literacy/
  'node_modules',
  'assets',
  'tools',              // build utilities and social-card source, not public content
  'review-screenshots-v3', // branch-only responsive review evidence
  'simulations_downloads',
  'downloads_RGRC',
  'image_gen_assets',
]);

// Individual files excluded by URL.
const SKIP_URLS = new Set([
  '/resources/websites-and-tools.html',   // redirect stub to /references/
  '/resources/articles-and-papers.html',  // redirect stub to /resources/
  '/client-access/',                      // discreet noindex hub, reached from homepage artwork
]);

// Filename patterns excluded.
const SKIP_PATTERNS = [
  /-original\.html$/,   // superseded Roper Gulf drafts sitting beside live sessions
];

// Paths whose pages are client-only. Marked hidden in the index and kept out
// of sitemap.xml, whether or not the page carries a noindex meta tag.
// Keep this explicit even though the current client pages also carry noindex,
// so a missing page-level tag cannot expose a client area in the sitemap.
const HIDDEN_PREFIXES = [
  '/cdu-ai-staff/',
  '/cdu-teaching-staff/',
  '/roper-gulf/',
  '/alice-springs-arn/',
];

// The sixteen approved topics. Anything outside this list is reported.
const TOPICS = [
  'AI basics & literacy',
  'How AI works',
  'Images, video & deepfakes',
  'Scams, phishing & fraud',
  'Passwords, MFA & accounts',
  'Privacy & your data',
  'Prompting & Copilot',
  'Excel',
  'Word & PowerPoint',
  'Teams, Outlook & files',
  'Data & dashboards',
  'Networking & IT',
  'Diagrams & websites',
  'AI policy, law & economics',
  'Research practice & ethics',
  'Cyber security',
];

const TYPES = ['Course', 'Lesson', 'Workshop', 'Presentation', 'Simulation', 'Resource', 'Flashcards', 'Game', 'Client'];

/**
 * Section and type rules, matched in order by URL prefix.
 *   section / type   apply to pages inside the prefix
 *   hub              overrides both for the prefix's own index page
 *   topic            fallback topic, used only when index-meta.json is silent
 */
const RULES = [
  // New visual landing pages.
  { prefix: '/library/', section: 'Library', type: 'Resource', topic: 'AI basics & literacy' },
  { prefix: '/courses/', section: 'Course library', type: 'Resource', topic: 'AI basics & literacy' },

  // Simulations; the subfolder decides the section label.
  { prefix: '/simulations/MS_excel/',         section: 'Simulations, Excel tutorials',  type: 'Simulation', topic: 'Excel' },
  { prefix: '/simulations/MS_word/',          section: 'Simulations, Word tutorials',   type: 'Simulation', topic: 'Word & PowerPoint' },
  { prefix: '/simulations/digital-workplace/', section: 'Simulations, Digital Workplace', type: 'Simulation', topic: 'Teams, Outlook & files' },
  { prefix: '/simulations/it-cyber/',         section: 'Simulations, IT & Cyber',       type: 'Simulation', topic: 'Cyber security' },
  { prefix: '/simulations/networking/',       section: 'Simulations, Networking',       type: 'Simulation', topic: 'Networking & IT' },
  { prefix: '/simulations/syntax-crammers/',  section: 'Simulations, Syntax Crammers',  type: 'Simulation', topic: 'Networking & IT' },
  { prefix: '/simulations/',                  section: 'Simulations, How AI works',     type: 'Simulation', topic: 'How AI works',
    hub: { section: 'Simulations', type: 'Simulation' } },

  // Courses; the hub page is the course itself, inner pages are lessons.
  { prefix: '/excel/',            section: 'Excel Fundamentals',     type: 'Lesson', topic: 'Excel',
    hub: { section: 'Excel Fundamentals', type: 'Course' } },
  { prefix: '/word/',             section: 'Microsoft Word',         type: 'Lesson', topic: 'Word & PowerPoint',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/powerpoint/',       section: 'Microsoft PowerPoint',   type: 'Lesson', topic: 'Word & PowerPoint',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/visio/',            section: 'Visio',                  type: 'Lesson', topic: 'Diagrams & websites',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/powerbi-siem/',     section: 'Power BI SIEM',          type: 'Lesson', topic: 'Data & dashboards',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/pandanus-reach/',   section: 'Power Query',            type: 'Lesson', topic: 'Data & dashboards',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/digital-literacy/', section: 'Digital Literacy',       type: 'Lesson', topic: 'Teams, Outlook & files',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/cybersecurity/',    section: 'Cyber Security Awareness', type: 'Lesson', topic: 'Cyber security',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/ai-literacy/',      section: 'AI Literacy',            type: 'Lesson', topic: 'AI basics & literacy',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/ai-for-research/',  section: 'AI for Research',        type: 'Lesson', topic: 'Research practice & ethics',
    hub: { section: 'Course library', type: 'Course' } },
  { prefix: '/agentic-web-dev/', section: 'Agentic AI Web Dev',      type: 'Lesson', topic: 'Diagrams & websites',
    hub: { section: 'Course library', type: 'Course' } },

  { prefix: '/shadow-ai-manual/', section: 'Shadow AI Manual',   type: 'Lesson', topic: 'Cyber security',
    hub: { section: 'Course library', type: 'Course' } },

  // Standalone sections.
  { prefix: '/index/',         section: 'Site index',    type: 'Resource',     topic: 'AI basics & literacy' },
  { prefix: '/workshops/',     section: 'Workshops',     type: 'Workshop',     topic: 'AI policy, law & economics' },
  { prefix: '/presentations/', section: 'Presentations', type: 'Presentation', topic: 'AI basics & literacy' },
  { prefix: '/resources/',     section: 'Resources',     type: 'Resource',     topic: 'AI basics & literacy' },
  { prefix: '/references/',    section: 'Resources',     type: 'Resource',     topic: 'AI basics & literacy' },
  { prefix: '/flashcards/',    section: 'Flashcards',    type: 'Flashcards',   topic: 'Cyber security' },
  { prefix: '/training-games/', section: 'Training Games', type: 'Game',        topic: 'AI basics & literacy' },

  // Client areas.
  { prefix: '/cdu-ai-staff/',      section: 'CDU AI Staff Training',      type: 'Client', topic: 'How AI works' },
  { prefix: '/cdu-teaching-staff/', section: 'CDU Teaching Staff',        type: 'Client', topic: 'AI basics & literacy' },
  { prefix: '/roper-gulf/',        section: 'Roper Gulf Regional Council', type: 'Client', topic: 'AI basics & literacy' },
  { prefix: '/alice-springs-arn/', section: 'Alice Springs ARN',          type: 'Client', topic: 'Research practice & ethics' },

  // Fallback.
  { prefix: '/', section: 'Home', type: 'Resource', topic: 'AI basics & literacy' },
];

// Trailing title segments dropped when cleaning a <title>. Case-insensitive.
const TITLE_SUFFIXES = [
  'NTell World Ink', 'NT World Ink', 'NTellWorldInk',
  'Simulations', 'Simulation Tools', 'Network Simulation Tools',
  'IT Vocational Training',
  'Workshops', 'Presentations', 'Resources', 'References',
  'Excel Fundamentals', 'Digital Literacy', 'Cyber Security Awareness',
  'AI Literacy', 'AI for Research', 'Course library',
  'Shadow AI Blue Team Manual',
  'CDU AI Staff Training', 'CDU AI Staff', 'Roper Gulf', 'Roper Gulf Regional Council',
  'Alice Springs ARN', 'Power BI SIEM', 'Visio', 'Power Query',
  'Agentic AI Web Dev',
];

/* ===========================================================================
   HELPERS
   =========================================================================== */

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', mdash: '—', ndash: '–', hellip: '…',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
};

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => {
      const key = name.toLowerCase();
      return Object.prototype.hasOwnProperty.call(ENTITIES, key) ? ENTITIES[key] : m;
    });
}

function walk(dir, out) {
  out = out || [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const entry of entries) {
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

/** Turn a repo-relative file path into the URL the site serves it at. */
function toUrl(relPath) {
  const p = relPath.split(path.sep).join('/');
  if (p === 'index.html') return '/';
  if (p.endsWith('/index.html')) return '/' + p.slice(0, -'index.html'.length);
  return '/' + p;
}

/** Pull the few head values we need without a DOM parser. */
function parseHead(html) {
  const head = html.slice(0, 12000);

  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).replace(/\s+/g, ' ').trim() : '';

  let description = '';
  const metaTags = head.match(/<meta\b[^>]*>/gi) || [];
  let noindex = false;
  for (const tag of metaTags) {
    const nameMatch = tag.match(/\bname\s*=\s*["']?([^"'\s>]+)/i);
    if (!nameMatch) continue;
    const name = nameMatch[1].toLowerCase();
    const contentMatch = tag.match(/\bcontent\s*=\s*["']([\s\S]*?)["']/i);
    const content = contentMatch ? decodeEntities(contentMatch[1]).replace(/\s+/g, ' ').trim() : '';
    if (name === 'description' && !description) description = content;
    if (name === 'robots' && /noindex/i.test(content)) noindex = true;
  }

  return { title, description, noindex };
}

/**
 * Strip the site and section furniture off a <title>.
 * "Session 5 · Wrap Up and AI Image Generation · Roper Gulf · NTell World Ink"
 *   becomes "Session 5, Wrap Up and AI Image Generation".
 *
 * Segments are split on the separators the site uses, then any trailing
 * segment listed in TITLE_SUFFIXES is dropped and the rest joined with a
 * comma. Joining on a comma also removes em-dashes and en-dashes from titles,
 * which the house rules ban. A title needing a different shape gets a `title`
 * override in index-meta.json rather than a special case here.
 */
function cleanTitle(raw) {
  if (!raw) return '';
  const parts = raw.split(/\s*[·—–]\s*|\s+-\s+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 1) return parts[0];
  const suffixes = new Set(TITLE_SUFFIXES.map((s) => s.toLowerCase()));
  while (parts.length > 1 && suffixes.has(parts[parts.length - 1].toLowerCase())) parts.pop();
  return parts.join(', ');
}

function ruleFor(url) {
  for (const rule of RULES) {
    if (url.startsWith(rule.prefix)) return rule;
  }
  return RULES[RULES.length - 1];
}

function isHidden(url, noindex) {
  if (noindex) return true;
  return HIDDEN_PREFIXES.some((prefix) => url.startsWith(prefix));
}

/**
 * First-commit date for a file, as an ISO day. Returns null if git is unusable
 * or the file has never been committed.
 *
 * Deliberately no --follow. Rename detection sounds useful, but these pages
 * share a header and footer, so a brand-new page reads as a rename of an older
 * one and inherits its date. An uncommitted page is better left undated.
 */
function gitAddedDate(relPath) {
  try {
    const out = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--format=%aI', '-1', '--', relPath],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return out ? out.slice(0, 10) : null;
  } catch (e) {
    return null;
  }
}

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/* ===========================================================================
   BUILD
   =========================================================================== */

function build(options) {
  const meta = readMeta();
  const files = walk(ROOT);
  const entries = [];
  const warnings = [];
  const skipped = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const url = toUrl(rel);

    if (SKIP_URLS.has(url)) { skipped.push([url, 'redirect stub']); continue; }
    if (SKIP_PATTERNS.some((re) => re.test(rel))) { skipped.push([url, 'superseded draft']); continue; }
    if (url === '/' && !INCLUDE_HOMEPAGE) { skipped.push([url, 'homepage, by configuration']); continue; }

    const rule = ruleFor(url);
    const isHub = url === rule.prefix;
    if (isHub && url !== '/' && !INCLUDE_SECTION_HUBS) {
      skipped.push([url, 'section hub, by configuration']);
      continue;
    }

    let html;
    try {
      html = fs.readFileSync(file, 'utf8');
    } catch (e) {
      warnings.push('could not read ' + rel);
      continue;
    }

    const head = parseHead(html);
    if (!head.title) warnings.push('no <title>: ' + url);

    const override = meta[url] || {};
    const shape = isHub && rule.hub ? rule.hub : rule;

    const entry = {
      title: override.title || cleanTitle(head.title) || url,
      section: override.section || shape.section,
      type: override.type || shape.type,
      url,
      topic: override.topic || rule.topic,
      published: Object.prototype.hasOwnProperty.call(override, 'published') ? override.published : null,
      hidden: typeof override.hidden === 'boolean' ? override.hidden : isHidden(url, head.noindex),
    };

    if (INCLUDE_DESCRIPTION) entry.description = override.description || head.description || '';

    if (!TYPES.includes(entry.type)) warnings.push('unknown type "' + entry.type + '": ' + url);
    if (entry.topic && !TOPICS.includes(entry.topic)) warnings.push('unknown topic "' + entry.topic + '": ' + url);

    entries.push(entry);
  }

  // Backfill published dates from git history where nothing is hand-set.
  if (options.datesFromGit) {
    let filled = 0;
    for (const entry of entries) {
      if (entry.published) continue;
      const rel = entry.url === '/'
        ? 'index.html'
        : (entry.url.endsWith('/') ? entry.url.slice(1) + 'index.html' : entry.url.slice(1));
      const date = gitAddedDate(rel);
      if (date) { entry.published = date; filled++; }
    }
    console.log('published dates backfilled from git: ' + filled);
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return { entries, warnings, skipped, meta };
}

function writeSitemap(entries) {
  if (!ORIGIN) {
    console.log('sitemap.xml skipped: no CNAME file, so the origin is unknown');
    return 0;
  }
  const visible = entries.filter((e) => !e.hidden);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of visible) {
    lines.push('  <url>');
    lines.push('    <loc>' + xmlEscape(ORIGIN + e.url) + '</loc>');
    if (e.published) lines.push('    <lastmod>' + e.published + '</lastmod>');
    lines.push('  </url>');
  }
  lines.push('</urlset>', '');
  fs.writeFileSync(SITEMAP_OUT, lines.join('\n'));
  return visible.length;
}

function syncMeta(entries, meta) {
  let added = 0;
  const next = Object.assign({}, meta);
  for (const e of entries) {
    if (next[e.url]) continue;
    next[e.url] = { topic: e.topic, published: e.published };
    added++;
  }
  const ordered = {};
  for (const key of Object.keys(next).sort()) ordered[key] = next[key];
  fs.writeFileSync(META_FILE, JSON.stringify(ordered, null, 2) + '\n');
  return added;
}

function report(entries, warnings, skipped) {
  const byType = {};
  for (const e of entries) byType[e.type] = (byType[e.type] || 0) + 1;

  console.log('');
  console.log('pages indexed      ' + entries.length);
  console.log('marked hidden      ' + entries.filter((e) => e.hidden).length);
  console.log('with a date        ' + entries.filter((e) => e.published).length);
  console.log('by type            ' + Object.keys(byType).sort().map((t) => t + ' ' + byType[t]).join(', '));
  console.log('skipped            ' + skipped.length);

  const undated = entries.filter((e) => !e.published);
  if (undated.length) {
    console.log('');
    console.log('No published date, so absent from the homepage rail (' + undated.length + '):');
    for (const e of undated) console.log('  ' + e.url);
  }

  if (warnings.length) {
    console.log('');
    console.log('Warnings (' + warnings.length + '):');
    for (const w of warnings) console.log('  ' + w);
  }
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    sync: args.includes('--sync'),
    // On by default. Leaving it off silently drops the date from every page
    // that has not been given one by hand, which is most of them.
    datesFromGit: !args.includes('--no-git-dates'),
    dryRun: args.includes('--dry-run'),
  };

  const { entries, warnings, skipped, meta } = build(options);

  if (!options.dryRun) {
    fs.writeFileSync(INDEX_OUT, JSON.stringify(entries, null, 2) + '\n');
    console.log('wrote ' + path.relative(ROOT, INDEX_OUT) + ' (' + entries.length + ' entries)');
    const count = writeSitemap(entries);
    if (count) console.log('wrote ' + path.relative(ROOT, SITEMAP_OUT) + ' (' + count + ' visible pages)');
    if (options.sync) {
      const added = syncMeta(entries, meta);
      console.log('index-meta.json: ' + added + ' new stub' + (added === 1 ? '' : 's') + ' added');
    }
  } else {
    console.log('dry run; nothing written');
  }

  report(entries, warnings, skipped);
}

main();
