#!/usr/bin/env node
// Generates the /flashcards/ pages: catalogue, one player and one list per
// ready set. Run by hand after adding a set; the pages are plain static HTML
// and are committed, because GitHub Pages has no build step.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'sets/sets.json'), 'utf8'));
const UPDATED = '8 August 2026';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const head = (title, desc, depth) => `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/flashcards/flashcards.css">
</head>`;

const header = `<div class="noise-overlay"></div>

<!-- =============== HEADER =============== -->
<header class="site">
  <div class="container site-inner">
    <a class="brand" href="/">
      <div class="brand-mark"></div>
      <span class="brand-name">ntworld<span class="dot">.</span>ink</span>
    </a>
    <nav class="site-nav">
      <a href="/#library">Library</a>
      <a href="/#workshops">Workshops</a>
      <a href="/simulations/">Tools</a>
      <a href="/presentations/">Presentations</a>
      <a href="/resources/">Resources</a>
      <a href="/flashcards/">Flashcards</a>
      <a href="/index/">Index</a>
      <a href="/#about">About</a>
      <a href="/#contact">Contact</a>
    </nav>
  </div>
</header>`;

const footer = `<!-- =============== FOOTER =============== -->
<footer class="site" id="contact">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">
          <div class="brand-mark"></div>
          <span class="brand-name">ntworld<span class="dot">.</span>ink</span>
        </a>
        <p>Practical learning materials in cybersecurity, AI literacy, Microsoft Office, and workplace digital skills.</p>
      </div>
      <div class="footer-col">
        <h4>// library</h4>
        <ul>
          <li><a href="/#library">All courses</a></li>
          <li><a href="/simulations/">Simulation Tools Catalogue</a></li>
          <li><a href="/presentations/">Presentations</a></li>
          <li><a href="/resources/">Resources</a></li>
          <li><a href="/flashcards/">Flashcards</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>// elsewhere</h4>
        <ul>
          <li><a href="/#about">About this site</a></li>
          <li><a href="mailto:hello@ntworldink.com">Get in touch</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span style="line-height:1.8">NT World Ink is an online learning resource project: practical learning materials in cybersecurity, AI literacy, Microsoft Office and workplace digital skills.<br>
      Copyright &copy; Charles Darwin University | TAFE ICT, Cyber Security &amp; Digital | RTO Provider No: 0373 | ABN 54 093 513 649 | <a href="https://www.cdu.edu.au/about-cdu/leadership-structure/strategic-services-governance/legal/privacy-notice" target="_blank" rel="noopener">Privacy</a> | <a href="https://www.cdu.edu.au/about-cdu/leadership-structure/strategic-services-governance/copyright-and-disclaimer" target="_blank" rel="noopener">Copyright and Disclaimer</a> | <a href="https://www.cdu.edu.au/about-cdu/leadership-structure/strategic-services-governance/legal/cookie-notice" target="_blank" rel="noopener">Cookies</a> | <a href="mailto:webservices@cdu.edu.au">Feedback</a></span>
      <span style="font-family: 'JetBrains Mono', monospace;">v1.0 &middot; 2026</span>
    </div>
  </div>
</footer>

<script src="/flashcards/flashcards.js"></script>
<script src="/search.js" defer></script>
</body>
</html>
`;

const lastUpdated = `    <div class="last-updated">Last updated: ${UPDATED}</div>`;

/* --- Catalogue ---------------------------------------------- */

const catalogue = `${head('Flashcards · NT World Ink',
  'Glossaries and technical terminology you can drill as flashcards or read as a searchable glossary. Cyber security, digital literacy and Microsoft Office terms, in the browser.')}
<body data-fc="catalogue">
${header}

<!-- =============== BREADCRUMB =============== -->
<div class="container">
  <nav class="breadcrumb">
    <a href="/">home</a>
    <span class="sep">/</span>
    <span>flashcards</span>
  </nav>
</div>

<!-- =============== PAGE MASTHEAD =============== -->
<div class="container">
  <div class="page-masthead">
    <div class="series-label">Library · Terminology</div>
    <h1>Glossaries and technical terminology</h1>
    <p class="fc-standfirst">Terminology you can drill in five minutes, or read straight through as a glossary. Each set runs in the browser and remembers where you left off.</p>
  </div>
</div>

<!-- =============== SET CATALOGUE (interactive; documented exception to the no-JS house rule) =============== -->
<div class="content-body">
  <div class="container">
    <div class="fc-chips" id="fc-subjects" role="group" aria-label="Filter sets by subject"></div>
    <div class="fc-grid" id="fc-grid"></div>
${lastUpdated}
  </div>
</div>

${footer}`;

fs.writeFileSync(path.join(ROOT, 'index.html'), catalogue);
console.log('write flashcards/index.html');

/* --- Player and list, one pair per ready set ----------------- */

for (const s of manifest.sets.filter(x => x.ready)) {
  const dir = path.join(ROOT, s.slug);
  fs.mkdirSync(path.join(dir, 'list'), { recursive: true });

  const player = `${head(s.title + ' flashcards · NT World Ink',
    'Drill the ' + s.title + ' set as flashcards. ' + s.count + ' cards, in the browser, with your progress kept on your own device.')}
<body data-fc="player" data-slug="${esc(s.slug)}">
${header}

<!-- =============== STUDY BAR =============== -->
<div class="fc-studybar">
  <div class="container fc-studybar-inner">
    <div class="fc-studybar-left">
      <a class="fc-back" href="/flashcards/">&larr; All sets</a>
      <span class="fc-divider"></span>
      <h1 class="fc-studybar-title">${esc(s.title)}</h1>
    </div>
    <div class="fc-controls">
      <button class="fc-chip" id="fc-dir" type="button">Term first</button>
      <button class="fc-chip" id="fc-shuffle" type="button">Shuffle</button>
      <button class="fc-chip" id="fc-restart" type="button">Restart</button>
    </div>
  </div>
</div>

<!-- =============== PROGRESS =============== -->
<div class="container fc-progress">
  <div class="fc-progress-row">
    <span class="fc-label" id="fc-remaining">${s.count} of ${s.count} remaining</span>
    <span class="fc-progress-right fc-label">
      <span class="fc-got" id="fc-got">0 got it</span>
      <span class="fc-repeat" id="fc-repeat">0 to repeat</span>
    </span>
  </div>
  <div class="fc-bar"><div class="fc-bar-fill" id="fc-bar-fill"></div></div>
</div>

<!-- =============== CARD =============== -->
<div class="container fc-stage">
  <div class="fc-card" id="fc-card" role="button" tabindex="0" aria-label="Flashcard. Press space or Enter to reveal the other side.">
    <div class="fc-face-label" id="fc-face-label">Question</div>
    <div class="fc-face-text is-medium" id="fc-face-text" aria-live="polite">Loading the set&hellip;</div>
    <div class="fc-hint" id="fc-hint">Click, or press space, to reveal</div>
  </div>
  <div class="fc-answers" id="fc-answers"></div>
  <div class="fc-keys fc-label" id="fc-keys">
    <span>space &middot; flip</span>
    <span>1 &middot; again later</span>
    <span>2 &middot; got it</span>
    <span>r &middot; restart</span>
  </div>
${lastUpdated}
</div>

${footer}`;

  fs.writeFileSync(path.join(dir, 'index.html'), player);
  console.log('write flashcards/' + s.slug + '/index.html');

  const crumb = s.slug.replace(/-/g, ' ');
  const list = `${head(s.title + ', a searchable glossary · NT World Ink',
    (s.blurb || s.title) + ' Searchable, with A to Z jumps.')}
<body data-fc="list" data-slug="${esc(s.slug)}">
${header}

<!-- =============== BREADCRUMB =============== -->
<div class="container">
  <nav class="breadcrumb">
    <a href="/">home</a>
    <span class="sep">/</span>
    <a href="/flashcards/">flashcards</a>
    <span class="sep">/</span>
    <span>${esc(crumb)}</span>
  </nav>
</div>

<!-- =============== PAGE MASTHEAD =============== -->
<div class="container">
  <div class="page-masthead">
    <div class="series-label">Flashcards · Glossary view</div>
    <h1>${esc(s.title)}</h1>
    <p class="fc-standfirst">${esc(s.blurb || '')}</p>
    <p class="fc-attrib" id="fc-attrib"></p>
  </div>
</div>

<!-- =============== GLOSSARY (interactive; documented exception to the no-JS house rule) =============== -->
<div class="content-body">
  <div class="container">
    <div class="fc-searchwrap">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input class="fc-search" id="fc-search" type="search" placeholder="Search terms and definitions" autocomplete="off" aria-label="Search terms and definitions">
    </div>
    <div class="fc-az" id="fc-az" role="group" aria-label="Jump to a letter"></div>
    <p class="fc-listcount fc-label" id="fc-listcount"></p>
    <div id="fc-entries"></div>
${lastUpdated}
  </div>
</div>

${footer}`;

  fs.writeFileSync(path.join(dir, 'list/index.html'), list);
  console.log('write flashcards/' + s.slug + '/list/index.html');
}
