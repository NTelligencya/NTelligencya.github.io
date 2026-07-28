# CLAUDE.md — NT World Ink: Workshops and Resources build plan

Master plan for two builds on ntworldink.com (repo NTelligencya.github.io), agreed with SD on 25 July 2026: the AI Special Topic Workshops catalogue (eleven 1-hour topics) and the Resources section (five category pages plus hub). Work happens over multiple sessions; update the status checkboxes here as pages are completed.

## House rules (apply to every page)

- Link the shared `styles.css`; never inline page-level style overrides.
- Australian English. No em-dashes anywhere, including ported text; replace with semicolon, comma or full stop.
- No invented citations, statistics or links. Only links from the source pages, links SD has vetted, or links verified in the research notes (see Reference material below). Keep full citations with statistics.
- Every image carries over from source pages; rewrite remote `https://shortcourses.brambling.cdu.edu.au/uploads/<file>` srcs to the local assets folder; match filenames case-insensitively and URL-decode.
- No topic-to-topic cross links. Brand link home, nav and footer are fine.
- Last-updated line at the foot of every page, above the footer.
- Footer credit on migrated course pages: "Course materials © Charles Darwin University".
- No sequential numbering of topics or resources in page markup or headings; SD reorders items freely.
- Workshop and resources pages are INDEXABLE (SD confirmed 25 July 2026): no noindex meta. They carry the small CDU copyright footer line (as on index.html footer-bottom: "Copyright © Charles Darwin University | TAFE ICT, Cyber Security & Digital | RTO Provider No: 0373 ..."), but nothing in the content restricting delivery to internal CDU settings; frame them as NT-centric special interest topics for a general audience. The existing /cdu-ai-staff/ pages keep their noindex as is.
- Old Part 1 / Part 2 splits existed only for the old host's size cap; recombine into single pages.

## Reference material

- Source pages: /Users/sallydavis/Desktop/Websites/CDU Training/ (downloaded from iCloud 25 July 2026; if reads fail with placeholder errors, ask SD to re-download in Finder).
- Research notes (agent-verified 25 July 2026): /Users/sallydavis/Desktop/Websites/CDU Training/migration-notes/
  - research-nt-ai-data.md; sources and verdict for the AI in the NT rebuild
  - research-global-ai-readiness-links.md; verified UNESCO RAM, Oxford Insights and OECD.AI links for the world tour topic
  - research-ai-benchmarks-landscape.md; full benchmark catalogue with statuses, links and papers
  - source-ai-literacy-scale-research.md; SD-commissioned report on the AILS scale (for the AI literacy topic)
  - source-12-levels-video-sources.md; SD's source list for the "12 Levels" video (for the philosophical futures topic)
  - how-australia-uses-claude-cleaned.md; SD's essay on the Anthropic Economic Index Australia report of 31 March 2026 (for the first half of the AI in the NT workshop)

## Front page changes (index.html)

- New section "AI Special Topic Workshops" at the top of the page content, above the existing course library; SD wants her quality AI material most prominent. Card or accordion per topic linking to /workshops/<slug>.html.
- Demote Power Query: it currently sits first in the library (course 01, open by default). Move it down the library order and move the `open` attribute to whichever course ends up first.
- Nav: add "Workshops" and "Resources" links. Footer library column: add the same. ("Resources" added to nav and footer on index.html and presentations/index.html, 25 July 2026; "Workshops" still pending.)
- The existing /cdu-ai-staff/ section (eight migrated pages) stays as is; where a workshop topic overlaps (Agentic AI), the workshop page is the new build and /cdu-ai-staff/ is untouched.

## The eleven workshop topics

Each gets a page in /workshops/. Hook titles are for marketing (CDU social media, Darwin business hub); SD to approve or amend. Status: [ ] not started, [x] done.

### Global AI World Tour
- [ ] Hook title: "Growing Up Digital: An AI World Tour"
- Sources: 7a/7b-ai-CDU-Global-Workshop Parts 1-2 AND 7a/7b-ai-Lunch-and-Learn-International-Students Parts 1-2 (two variants of "Understanding Digital Contexts"; merge into one page, best of both).
- Reframe as a world tour of how technology grows up in other cultures, aimed at opening eyes about the digital worlds NT migrant communities come from.
- Add vetted links (see research-global-ai-readiness-links.md): UNESCO AI Readiness Assessment (RAM) reports exist for all six countries (India Feb 2026, Bangladesh Nov 2025 draft-labelled PDF, Indonesia 2024, Vietnam Oct 2025, Philippines Nov 2025, Thailand June 2025). IMPORTANT: label them UNESCO reports, not OECD; the OECD has only reviewed Germany and Egypt. Optionally add Oxford Insights Government AI Readiness Index 2025 and OECD.AI country dashboards (five of six; none for Bangladesh).

### Defining AI Literacy
- [ ] Hook title: "Beyond the Buzzword: What Does AI-Literate Actually Mean?"
- Source: 1h-ai-post-defining-ai-literacy-curriculum-beyond-buzzword.html
- Incorporate SD's commissioned research on the AI Literacy Scale (source-ai-literacy-scale-research.md): AILS still the most-cited generic scale, no v2, correct alpha is 0.83 not 0.92, successor scales (MAILS, SNAIL, GLAT etc.), self-report vs performance critique.

### AI in the Northern Territory
- [ ] Hook title: "AI North of the Berrimah Line: What's Really Happening in the Territory"
- Sources: 1f-ai-training-nt-industry.html PLUS SD's essay how-australia-uses-claude-cleaned.md (migration-notes).
- Two-half structure (SD, 25 July 2026): first 30 minutes Australia-wide, built from the Anthropic Economic Index report (31 Mar 2026) via SD's essay (AUI 4.1, seventh per capita globally; NSW+VIC = 68% of national usage; adoption follows knowledge work, not wealth); second 30 minutes NT on its own.
- NT half, data assessment done (research-nt-ai-data.md): verdict is viable. Spine: NT Gov AI Policy and Assurance Framework (Feb/June 2026) plus the fuel-price AI Australian first (June 2026); the Darwin AI infrastructure arc (DJSC cable 2023, NEXTDC D1 2024, Beetaloo Digital $40bn announcement 22 July 2026); Drumbeat AI ear health award winner (Aug 2025) paired with Mapping the Digital Gap 2025. Honest framing: big infrastructure and government moves, low measured adoption (NT AUI 0.12, lowest in Australia; the essay's paradox is the hinge between the two halves). Gaps: no NT mining/tourism AI stories; use national data where needed and say so.

### Digital Watermarking and Content Provenance
- [ ] Hook title: "Real or AI? How Watermarks and Detectors Actually Work"
- Source: 3-ai-post-image-digital-watermarking-content-provenance.html
- Content needs updating: add Google SynthID, Meta provenance initiatives (Stable Signature, C2PA involvement), and extend beyond images to text detection: Pangram.ai and how AI text detection works. Research current state before writing; SD to vet any new links.

### Philosophical Futures
- [ ] Hook title: "Twelve Endings: The Possible Futures of AI"
- Source: 3-ai-post-philosophy-speculative-futures.html
- Embed the video "MIT Explains the 12 Possible Endings for AI" (30 March 2026): https://www.youtube.com/watch?v=FLcrvMfHUJM (SD-vetted). Source list for its claims is in source-12-levels-video-sources.md; use for any cited claims on the page (Tegmark's Life 3.0 twelve scenarios framing).

### The AI Bubble
- [ ] Hook title: "Bubble Trouble: Making Sense of the AI Economy"
- Source: 3-ai-post-bubble-panic-wicked-problem.html (the public version; the internal NT Brambling variant stays behind).

### Digital Equity and AI Subscription Costs
- [ ] Hook title: "The Price of Thinking: AI Subscriptions and the New Digital Divide"
- Source: 3-ai-post-digital-equity-costs.html

### The Cognitive Cost of AI
- [ ] Hook title: "Your Brain on Autocomplete: Why Writing Still Matters"
- Source: 3-ai-post-cognitive-cost-ai-writing.html

### Caring for Your Data in AI Tools
- [ ] Hook title: "Where Does Your Chat Go? Taking Care of Your Data in AI Tools"
- Source: 3-ai-post-data-privacy-settings-guide.html (large page, 106kb; settings screenshots may need currency check).

### Agentic AI and Context Engineering (intermediate)
- [ ] Hook title: "Handing AI the Keys: Agents, Your Files, and What Really Leaves Your Computer"
- Sources: 1d-ai-training-agentic-ai.html integrated with 3-ai-post-context-engineering.html; draw on 1d-ai-training-vibe-coding.html for the vibe-coding angle.
- One-hour intermediate intro. Focus: bringing the AI to your files rather than the files to the AI; security risks; vibe coding; and demystifying "your data stays on your computer", which is only partially true because whatever the AI reads leaves your computer to be processed.
- Also produce an explainer version under /presentations/ (SD flagged this as a terrific presentations-tab candidate).

### AI Benchmarks (the "Which AI is best?" topic)
- [ ] Hook title: "Which AI Is Best? Reading the Scoreboard Like a Pro"
- New build, no single source page. Full landscape in research-ai-benchmarks-landscape.md; the ~22-benchmark shortlist (that file's final section) is APPROVED by SD (25 July 2026). Leave out IMO 2026 AI results (unconfirmed at time of research).
- Two outputs: the workshop page in /workshops/ AND the AI Benchmarks resource page in /resources/ (below). Workshop unpacks: why "which AI is best" has no static answer; jagged capability; benchmark saturation (months, not years); vendor-reported vs independent scores; and how to spot wrapper apps that repackage non-premium models under the hood versus frontier proprietary AI; a wrapper never publishes independent benchmark results.
- Verified corrections to fold in: "Exploit bench" is ExploitBench (Carnegie Mellon, May 2026, Chrome V8 exploitation ladder; real but only ~10 weeks old); LMArena rebranded to Arena at arena.ai (28 Jan 2026); Artificial Analysis is on Intelligence Index v4.1.

## Resources section

Structure: /resources/index.html hub with a card per category, plus one page per category. Nav tab "Resources". Plain commented HTML resource cards with a copy-paste template block at the top of each category file; no JSON or JS rendering. Every resource card: title, source or author, date (or "date unavailable"), one-to-two sentence annotation, link. Categories are unnumbered so SD can reorder.

- [x] /resources/index.html (hub) (built 25 July 2026; includes a non-linked "In planning" card for AI Benchmarks)
- [x] Videos and Podcasts; source: 1-ai-resources-videos.html (built 25 July 2026; embeds converted to YouTube watch links in the standard card format)
- [ ] Articles and Papers; source: 1-ai-resources-articles.html (built 25 July 2026). REMOVED 27 July 2026 as outdated, to be rebuilt another day. The page is now a redirect stub to /resources/ and its hub card is gone; the original is preserved in git commit 48a33e6. WildChat Visualiser and the Content Authenticity Initiative were carried into the References library before removal.
- [x] Websites and Tools; source: 1-ai-resources-websites.html (built 25 July 2026). SUPERSEDED 27 July 2026 by the filterable References library at /references/ (see its own section below). Its ~50 curated resources were merged into the tool; /resources/websites-and-tools.html now redirects to /references/, reached from the unchanged "Websites & Tools" card on the hub.
- [x] Legislation and Guidelines; source: 1-ai-resources-legislation.html. MUST link to the Australian AI legislation presentation at /presentations/australias-ai-laws-explained/. (built 25 July 2026; links via a "Start here" callout)
- [x] AI Benchmarks; new build from research-ai-benchmarks-landscape.md (shortlist approved 25 July 2026). Each entry: benchmark link, release paper link, abstract-style description, status flag (watch / nearing saturation / retired-historical). (built 28 July 2026 at /resources/ai-benchmarks.html; hub card now links to it; combined cards used for ARC-AGI 2+3, MMLU+MMLU-Pro, AIME+MATH; NIAH card unlinked, no vetted link)
- [x] CLAUDE.md inside /resources/ documenting the card format and house rules for adding a resource (SD adds roughly one per week and is picky; no unvetted links). (written 25 July 2026)
- [x] "add-resource" skill for SD: takes a URL, drafts the annotation, inserts the card in the right category for approval. Delivered as a .skill file for SD to save. (delivered 25 July 2026)

## References library (/references/)

Added 27 July 2026. A filterable, searchable reference index that replaces the old Websites and Tools resource page. It is reached from the "Websites & Tools" card on the /resources/ hub; there is no separate top-nav item. It is indexable.

This is a DELIBERATE EXCEPTION to the /resources/ house rules above (approved by SD, 27 July 2026): it is JavaScript-rendered and carries its own page CSS, because it needs live search, category filtering, A-to-Z sorting and copy-to-clipboard for grab-and-email use in workshops, which the static card format cannot provide. Do not "fix" it to match the card rules.

Files:
- `/references/index.html`; site chrome (shared `styles.css`, header, breadcrumb, masthead, CDU footer) plus the tool markup.
- `/references/references.css`; page-specific styles, built on the `styles.css` design tokens.
- `/references/references.js`; the data and the render/filter/sort/copy logic.

Single source of truth: the `DATA` array at the top of `/references/references.js`. Each entry is one object:

```js
{t: "Resource title", d: "One-line note.", u: "https://clean-url", c: "Category"}
```

Category `c` must be exactly one of the seven strings in the `CATS` array: "AI info", "AI tools", "AI Security", "Basic Digital Literacy", "Cyber Security", "Datasets & repos", "Other". The entry total, the per-category counts and the filter chips are all derived from `DATA` at page load; nothing else needs editing.

To add a resource: add one object to the `DATA` array. Order does not matter (the page sorts by title), so paste it anywhere. Australian English, no em-dashes, no emoji, as everywhere on the site. NOTE: the "add-resource" skill is for the /resources/ card pages, not this tool; References entries are added by hand in `references.js`.

History: the merged content from the old Websites and Tools page, and the retired Articles and Papers page, are preserved in git commit 48a33e6. The old URLs `/resources/websites-and-tools.html` and `/resources/articles-and-papers.html` now serve redirect stubs.

## Build order (suggested; SD may reshuffle)

- DONE 25 July 2026: Session A, resources scaffolding (hub, four migrated category pages, resources CLAUDE.md, nav "Resources" links, add-resource skill delivered).
- DONE 28 July 2026: Session B part one, AI Benchmarks resource page (/resources/ai-benchmarks.html) built and linked from the hub.
- NEXT: Session B part two, the benchmarks workshop page ("Which AI Is Best? Reading the Scoreboard Like a Pro") in /workshops/.
- Session C onwards: workshop pages roughly two or three per session, starting with the ones needing no new research (AI Bubble, Digital Equity, Cognitive Cost, Caring for Your Data), then the research-heavy rebuilds (World Tour, NT, Watermarking, Agentic AI), then front page changes once enough pages exist to populate the catalogue.
- Front page section and Power Query demotion go live only when at least a handful of workshop pages are ready to link.

## Approvals log

All approved by SD on 25 July 2026: the eleven hook titles; the benchmark shortlist (with IMO 2026 AI results left out); workshop pages indexable with the small CDU copyright footer and no internal-CDU framing; UNESCO (not OECD) labelling for the world tour readiness reports. Nothing currently awaiting SD.
