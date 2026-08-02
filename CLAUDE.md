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

- DONE 29 July 2026: "AI Special Topic Workshops" section built at the top of index.html (id="workshops", directly after the hero banner, above About and the library). Unnumbered app-card grid: one linked card per built workshop deck plus an unlinked "More topics on the way" wide card listing coming hook titles. When a new deck ships, add its card here and trim its topic from the coming-soon card.
- DONE 29 July 2026: Power Query demoted to second-last in the library (before "More to come"); course-num spans renumbered 01-08 in the new order (Excel Fundamentals now 01 and open-by-default).
- DONE 29 July 2026: "Workshops" nav link added (index.html "#workshops"; "/#workshops" on presentations/index.html, references/index.html and all live /resources/ pages) and to the index.html footer library column. The two workshop decks themselves have no site nav (deck chrome only), as designed.
- The existing /cdu-ai-staff/ section (eight migrated pages) stays as is; where a workshop topic overlaps (Agentic AI), the workshop page is the new build and /cdu-ai-staff/ is untouched.
- DONE 2 August 2026: four workshop cards added to the front-page workshops section (AI Bubble, Digital Equity, Cognitive Cost, Caring for Your Data) and their four topics trimmed from the "More topics on the way" card, which now lists: defining AI literacy, AI in the NT, watermarking, philosophical futures, agentic AI.
- DONE 30 July 2026: Course 08 "Power BI for Cyber Security: Build Your First SIEM Dashboard" added to the library accordion, built at /powerbi-siem/index.html as a single-page learner-facing course (SOC-flavoured, Parts A to K, stumbling-block callouts, DAX code blocks, facilitator notes section at the end) with the two synthetic datasets (soc_dataset1.xlsx, synthetic-windows-event-data.xlsx) as downloads in the same folder. "More to come" moved from 08 to 09; footer library column links the course. Source document: course-08-powerbi-siem-dashboard.md in SD's PowerBI Obsidian folder. Power BI Desktop download deliberately mentioned as text, not linked, pending an SD-vetted link.

## The eleven workshop topics

Each gets a page in /workshops/. Hook titles are for marketing (CDU social media, Darwin business hub); SD to approve or amend. Status: [ ] not started, [x] done.

### Global AI World Tour
- [x] Hook title: "Growing Up Digital: An AI World Tour" (built 29 July 2026 as a 20-slide AFTER DARK deck at /workshops/global-ai-world-tour/index.html, second of the eleven. Structure: readiness-vs-sentiment as the spine distinction (SD, 29 July 2026); UNESCO RAM explained with the Observatory hub link (unesco.org/ethics-ai/en/ram) instead of six separate country links (migration-notes research file was iCloud-evicted; hub covers all reports); six-country tour India/Bangladesh/Indonesia/Vietnam/Philippines/Thailand with RAM dates from this file; cultural slides (platforms, privacy-as-cultural-concept, rapid adoption without habits) adapted from the 7a/7b source pages; sentiment slides from Stanford AI Index 2026 ch9 (SD-supplied PDF) and Pew Oct 2025; Australian finale with three Anthropic "How Australia uses Claude" data slides (state-share bars, rebuilt diverging request-mix chart, sophistication stats 11.9yrs/3.38 autonomy/2.7hrs) plus the metadata-awareness lesson, NT kept low-key per SD; TPDi AI Agency Tool slide (techpolicy.au/aiagency, June 2026, 103 capabilities). The Gem-building halves of the source pages were deliberately left out; CDU-internal tooling. Linked from the front-page workshops section since 29 July 2026.)
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
- [x] Hook title: "Bubble Trouble: Making Sense of the AI Economy" (built 2 August 2026 as a 17-slide AFTER DARK deck at /workshops/ai-bubble/index.html. Structure: wicked-problem frame; scale stats ($400B capex, ~80% of US market gains, Apollo-every-ten-months) and OpenAI's books ($13B projected revenue vs $13.5B H1 2025 loss, 498 unicorns); circular financing with the Goldman Sachs 2025 quote; the four dimensions (economic, geopolitical with TSMC/NVIDIA/ASML choke points and DeepSeek, information with the Three Ps, military with the RAND and Beyond the Horizon material); competing-incentives slide (who benefits from inflating/deflating); feedback loops; insider quotes slide (Altman, Pichai, Dimon, AFR September 2025); dot-com parallel; five NT implications from the 2024 Copilot trial and critical minerals. Source page has no external links, so the Sources slide names sources without URLs; figures labelled as a late-2025 snapshot.)
- Source: 3-ai-post-bubble-panic-wicked-problem.html (the public version; the internal NT Brambling variant stays behind).

### Digital Equity and AI Subscription Costs
- [x] Hook title: "The Price of Thinking: AI Subscriptions and the New Digital Divide" (built 2 August 2026 as a 14-slide AFTER DARK deck at /workshops/digital-equity/index.html. Structure: three-divides framing; access gap stats (27% of US colleges, cost the #1 barrier per Inside Higher Ed 2025); enterprise cost stats ($60 ChatGPT Enterprise, $42.50-$87 Copilot, $255K-$522K for 500 users); pooling strategies (Internet2 NET+, means-tested access); the COVID human-support lesson; learning modes (Study Mode, Guided Learning, Claude for Education) plus their catches; SOLAx story slide and an NT-lessons slide; four equity dimensions; discussion slide on AI as a basic academic resource. All source-page links carried to the Sources slide; prices flagged as 2025-current.)
- Source: 3-ai-post-digital-equity-costs.html

### The Cognitive Cost of AI
- [x] Hook title: "Your Brain on Autocomplete: Why Writing Still Matters" (built 2 August 2026 as a 15-slide AFTER DARK deck at /workshops/cognitive-cost/index.html. Structure: 86-92% adoption and "cognitive debt"; the debate stated fairly (evolution vs erosion cards); writing-as-brain-gym and the 18-25 window; MIT study stats (83.3% recall, 68.9% lazier, 27.7% decisions) with homogenisation; then the history arc: pragmatic origins (grain, Assyrian trade), Hammurabi + ostraca, scribal elite stats (<5%/<7%/years), Maya-books warning story, Sin-eribam complaint as a msgbox story slide; traffic-light system + assessment alternatives; personal strategies. NOTE: the source page's four academic links looked unreliable (one sagepub DOI is a visibly fake placeholder), so the Sources slide names the MIT study and other material WITHOUT URLs; if SD vets real links, add them.)
- Source: 3-ai-post-cognitive-cost-ai-writing.html

### Caring for Your Data in AI Tools
- [x] Hook title: "Where Does Your Chat Go? Taking Care of Your Data in AI Tools" (built 2 August 2026 as a 16-slide AFTER DARK deck at /workshops/caring-for-your-data/index.html. Structure: the knowledge gap; surveillance capitalism (Zuboff's three steps, Chopra quote); Cambridge Analytica story slide + reckoning stats ($5B FTC, $725M settlement, May 2018 bankruptcy/GDPR); the intimacy problem and cross-border flows; context vs memory vs training; what "train our models" means; the four-step settings audit; platform-by-platform across two slides (ChatGPT, Claude, Gemini / Copilot, Perplexity, Grok) with an explicit "as checked late 2025, verify against current interface" caveat on-slide; before-you-type checklist; never-enter list; APPs 1/6/8/11 + NT Information Act slide. The source page's Claude Project (AI Privacy & Terms Evaluator, with full project instructions and example output) was deliberately LEFT OUT of the deck; too long for slides. SD to decide whether it becomes a /resources/ page or downloadable later. CURRENCY FLAG: platform settings are as at late 2025 and Claude's five-year retention line reflects Sept 2025 policy; worth an SD review before first delivery.)
- Source: 3-ai-post-data-privacy-settings-guide.html (large page, 106kb; settings screenshots may need currency check).

### Agentic AI and Context Engineering (intermediate)
- [ ] Hook title: "Handing AI the Keys: Agents, Your Files, and What Really Leaves Your Computer"
- Sources: 1d-ai-training-agentic-ai.html integrated with 3-ai-post-context-engineering.html; draw on 1d-ai-training-vibe-coding.html for the vibe-coding angle.
- One-hour intermediate intro. Focus: bringing the AI to your files rather than the files to the AI; security risks; vibe coding; and demystifying "your data stays on your computer", which is only partially true because whatever the AI reads leaves your computer to be processed.
- Also produce an explainer version under /presentations/ (SD flagged this as a terrific presentations-tab candidate).

### AI Benchmarks (the "Which AI is best?" topic)
- [x] Hook title: "Which AI Is Best? Reading the Scoreboard Like a Pro" (workshop built 28 July 2026 as a browser slide deck at /workshops/which-ai-is-best/index.html, AFTER DARK scaffold shared with the presentations decks; the /resources/ai-benchmarks.html page links it via a "Start here" callout. First workshop page of the eleven; not yet linked from the front page, which waits per build order. Revised same day to 23 slides at SD's request: deck foot now carries the site logo mark; two everyday-user slides up front (illustrative neck-and-neck chart of Claude/ChatGPT/Gemini/Grok/DeepSeek/Kimi/Copilot with the Arena top-ten ~22-point spread cited, and a three-myths slide: ChatGPT-is-best, free-tier-is-flagship, rankings-are-settled); a case-study slide after wrapper apps summarising Christophe's May 2026 fake-ChatGPT sponsored-ads investigation; and a click-to-play finale slide embedding that video, youtube.com/watch?v=uuNCPmd6yU0, SD-vetted. Also added at SD's request: a Turing test slide for non-computer-scientists (imitation game; quietly broken by 2023: 1.5M-player game picked bots only 60% of the time while GPT-4 scored as little as 3% on ConceptARC puzzles humans solve at ~91%) linking the SD-vetted Nature feature of 27 July 2023, nature.com/articles/d41586-023-02361-7, plus a six-term jargon slide (AGI contested, Elo not an acronym, HLE, spatial reasoning, chain of thought, context window); both sit between "the question" and "what a benchmark is".)
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
- DONE 28 July 2026: Session B, AI Benchmarks resource page (/resources/ai-benchmarks.html) built and linked from the hub, plus the benchmarks workshop as a browser slide deck at /workshops/which-ai-is-best/ (SD's call, 28 July 2026: workshop pages use the presentations deck format, AFTER DARK scaffold, not static content pages). The resource page's "Start here" callout is currently the deck's only inbound link.
- DONE 29 July 2026: Global AI World Tour workshop deck (/workshops/global-ai-world-tour/), built ahead of order at SD's request.
- DONE 2 August 2026: Session D, all four no-new-research workshop decks (AI Bubble at /workshops/ai-bubble/, Digital Equity at /workshops/digital-equity/, Cognitive Cost at /workshops/cognitive-cost/, Caring for Your Data at /workshops/caring-for-your-data/), plus their four front-page cards and the coming-soon trim. Six of eleven workshops now built.
- NEXT: the research-heavy builds: Defining AI Literacy (AILS research ready in migration-notes), AI in the NT (research ready), Watermarking (needs new research: SynthID, Meta provenance, Pangram), Philosophical Futures (video embed + source list ready), Agentic AI (plus its /presentations/ explainer version).

## Approvals log

All approved by SD on 25 July 2026: the eleven hook titles; the benchmark shortlist (with IMO 2026 AI results left out); workshop pages indexable with the small CDU copyright footer and no internal-CDU framing; UNESCO (not OECD) labelling for the world tour readiness reports.

Awaiting SD (from 2 August 2026): review the Caring for Your Data platform-settings slides for currency (source data is late 2025); optionally supply vetted links for the MIT "Your Brain on ChatGPT" study and related research on the Cognitive Cost sources slide (source page's academic links looked unreliable, so none were carried over); decide whether the AI Privacy & Terms Evaluator Claude Project from the data-privacy source page should become a resource somewhere.
