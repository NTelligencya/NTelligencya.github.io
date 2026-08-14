# CLAUDE.md, NT World Ink: Workshops and Resources build plan

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
- DONE 2 August 2026 (second session): Defining AI Literacy card added to the workshops section; coming-soon card now lists only watermarking, philosophical futures and agentic AI (defining AI literacy shipped; AI in the NT dropped at SD's decision).
- DONE 30 July 2026: Course 08 "Power BI for Cyber Security: Build Your First SIEM Dashboard" added to the library accordion, built at /powerbi-siem/index.html as a single-page learner-facing course (SOC-flavoured, Parts A to K, stumbling-block callouts, DAX code blocks, facilitator notes section at the end) with the two synthetic datasets (soc_dataset1.xlsx, synthetic-windows-event-data.xlsx) as downloads in the same folder. "More to come" moved from 08 to 09; footer library column links the course. Source document: course-08-powerbi-siem-dashboard.md in SD's PowerBI Obsidian folder. Power BI Desktop download deliberately mentioned as text, not linked, pending an SD-vetted link.

## The eleven workshop topics

Each gets a page in /workshops/. Hook titles are for marketing (CDU social media, Darwin business hub); SD to approve or amend. Status: [ ] not started, [x] done.

### Global AI World Tour
- [x] Hook title: "Growing Up Digital: An AI World Tour" (built 29 July 2026 as a 20-slide AFTER DARK deck at /workshops/global-ai-world-tour/index.html, second of the eleven. Structure: readiness-vs-sentiment as the spine distinction (SD, 29 July 2026); UNESCO RAM explained with the Observatory hub link (unesco.org/ethics-ai/en/ram) instead of six separate country links (migration-notes research file was iCloud-evicted; hub covers all reports); six-country tour India/Bangladesh/Indonesia/Vietnam/Philippines/Thailand with RAM dates from this file; cultural slides (platforms, privacy-as-cultural-concept, rapid adoption without habits) adapted from the 7a/7b source pages; sentiment slides from Stanford AI Index 2026 ch9 (SD-supplied PDF) and Pew Oct 2025; Australian finale with three Anthropic "How Australia uses Claude" data slides (state-share bars, rebuilt diverging request-mix chart, sophistication stats 11.9yrs/3.38 autonomy/2.7hrs) plus the metadata-awareness lesson, NT kept low-key per SD; TPDi AI Agency Tool slide (techpolicy.au/aiagency, June 2026, 103 capabilities). The Gem-building halves of the source pages were deliberately left out; CDU-internal tooling. Linked from the front-page workshops section since 29 July 2026.)
- Sources: 7a/7b-ai-CDU-Global-Workshop Parts 1-2 AND 7a/7b-ai-Lunch-and-Learn-International-Students Parts 1-2 (two variants of "Understanding Digital Contexts"; merge into one page, best of both).
- Reframe as a world tour of how technology grows up in other cultures, aimed at opening eyes about the digital worlds NT migrant communities come from.
- Add vetted links (see research-global-ai-readiness-links.md): UNESCO AI Readiness Assessment (RAM) reports exist for all six countries (India Feb 2026, Bangladesh Nov 2025 draft-labelled PDF, Indonesia 2024, Vietnam Oct 2025, Philippines Nov 2025, Thailand June 2025). IMPORTANT: label them UNESCO reports, not OECD; the OECD has only reviewed Germany and Egypt. Optionally add Oxford Insights Government AI Readiness Index 2025 and OECD.AI country dashboards (five of six; none for Bangladesh).

### Defining AI Literacy
- [x] Hook title: "Beyond the Buzzword: What Does AI-Literate Actually Mean?" (built 2 August 2026 as a 20-slide AFTER DARK deck at /workshops/defining-ai-literacy/index.html. Structure: buzzword problem; a for-the-sceptics slide early (SD directive: no AI-promotion framing; using is a choice, understanding is the safety net, "you don't have to swim; you still want to read the signs"); digital literacy vs AI literacy distinction slide (SD directive) with the Carolus et al. critique as the scholarly anchor; four working dimensions from the source page; AILS slide (Wang, Rau & Yuan 2023, DOI linked) with four subscales; fine-print slide (no v2, alpha 0.83 not 0.92 with the Arabic-adaptation misattribution, self-report critique 3-of-16 from Lintner 2024, pre-genAI); successor-scales chips slide (MAILS to AILIS); Australian stakes stats (3% Deloitte, 84% TCA, 79% JSA, 200K jobs, 99% AIIA) and the FSO timeline + ASQA April 2025 floor-not-ceiling slide; Jordan's-letter story slide whose AI-disclosure notice pivots into the declaring-use section; then five slides from the NAIC guide "Being clear about AI-generated content" (November 2025, SD-supplied): spectrum, impact-x-involvement framework, three mechanisms, four worked examples, honest limits + 2024 deepfake offences; takeaways; keep exploring; sources. The NAIC section absorbs the ethics/declare-use angle after SD skipped the AI in the NT topic. Links used: SD-supplied ai.gov.au be-clear page, AILS DOI from the research note, FSO/ASQA/TCA roots from the source page; Lintner and Hobeika cited without URLs (no vetted links).)
- Source: 1h-ai-post-defining-ai-literacy-curriculum-beyond-buzzword.html
- Incorporate SD's commissioned research on the AI Literacy Scale (source-ai-literacy-scale-research.md): AILS still the most-cited generic scale, no v2, correct alpha is 0.83 not 0.92, successor scales (MAILS, SNAIL, GLAT etc.), self-report vs performance critique.
- NOTE 2 August 2026: the migration-notes folder on disk was found empty (only .DS_Store, last touched 27 July); SD supplied the research file and source page from her Obsidian research folder as chat uploads. If other research files are needed, ask SD rather than trusting migration-notes.

### AI in the Northern Territory
- SKIPPED (SD, 2 August 2026): SD won't deliver this one ("dry topic") and dropped it from the catalogue; its ethics-of-declaring-use angle was folded into the Defining AI Literacy deck via the NAIC transparency guide instead. Removed from the front-page coming-soon card the same day. The research below stays valid if the topic is ever revived.
- Hook title was: "AI North of the Berrimah Line: What's Really Happening in the Territory"
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

## Flashcards (/flashcards/)

Added 8 August 2026 from the `design_handoff_flashcards` bundle. Terminology sets that can be drilled as flashcards or read as a searchable glossary. Three page types: the catalogue at `/flashcards/`, a study player at `/flashcards/<slug>/`, and the same set as an A-to-Z glossary at `/flashcards/<slug>/list/`. The list view is the only one a search engine can index, since the player draws one card at a time from JSON.

This is a THIRD deliberate exception to the no-page-CSS-or-JS house rule, alongside `/references/` and `/index/`, and is built the same way: shared `styles.css` for the chrome, one page CSS file, one page JS file. Everything else applies as usual; Australian English, no em-dashes, indexable, last-updated line, CDU copyright footer.

Files: `flashcards/index.html`, `flashcards/flashcards.css`, `flashcards/flashcards.js`, `flashcards/convert.js` (CSV to JSON), `flashcards/gen-pages.js` (writes the player and list pages), `flashcards/sets/` (the manifest, the editable CSVs and the generated JSON). Full maintenance notes are in `flashcards/CLAUDE.md`. SD has a `flashcard-set` skill for adding a set from a CSV dropped in `~/Desktop/Flashcards_data/`.

Three sets are live: Microsoft Security and Copilot Governance (80 cards, from SD's NotebookLM export), ISM Abbreviations (106) and ISM Cyber Security Terms (248), both extracted from the ASD Information Security Manual terminology PDF of June 2026 and republished under CC BY 4.0 with the attribution line on each list view. One more sits in the manifest with `ready: false` and no data yet: `networking`, which needs a content decision from SD about which terms belong. A set with `ready: false` stays out of the catalogue, so nothing links to a page that does not exist. The `tech-words` and `excel-words` sets were dropped on 8 August 2026 at SD's decision, so the two plain-English glossary pages get no cross-link callout.

SD's decisions, 8 August 2026: no round splitting, so each set is one deck however long it is (progress is kept, so a long set can be left and resumed); only the three cyber security sets, with tech-words and excel-words dropped; and, after testing the live pages, the player's answer buttons relabelled "Again later" and "Got it" with forward arrows plus a post-flip hint, because the first wording did not make it obvious how to reach the next card.

Wiring: a "Flashcards" nav item after "Resources" on the eight pages whose nav carries a Resources link, added by the idempotent `tools/add-flashcards-nav.js`; a footer library link on `index.html`; and a new `Flashcards` type in `tools/build-index.js` and `index/site-index.js`, so the seven pages appear in site search, `/index/` and `sitemap.xml`. There are no cross-links from the two plain-English glossary pages, since those sets were dropped.

## Build order (suggested; SD may reshuffle)

- DONE 25 July 2026: Session A, resources scaffolding (hub, four migrated category pages, resources CLAUDE.md, nav "Resources" links, add-resource skill delivered).
- DONE 28 July 2026: Session B, AI Benchmarks resource page (/resources/ai-benchmarks.html) built and linked from the hub, plus the benchmarks workshop as a browser slide deck at /workshops/which-ai-is-best/ (SD's call, 28 July 2026: workshop pages use the presentations deck format, AFTER DARK scaffold, not static content pages). The resource page's "Start here" callout is currently the deck's only inbound link.
- DONE 29 July 2026: Global AI World Tour workshop deck (/workshops/global-ai-world-tour/), built ahead of order at SD's request.
- DONE 2 August 2026: Session D, all four no-new-research workshop decks (AI Bubble at /workshops/ai-bubble/, Digital Equity at /workshops/digital-equity/, Cognitive Cost at /workshops/cognitive-cost/, Caring for Your Data at /workshops/caring-for-your-data/), plus their four front-page cards and the coming-soon trim. Six of eleven workshops now built.
- DONE 2 August 2026 (second session): Defining AI Literacy deck (/workshops/defining-ai-literacy/, 20 slides) with the NAIC declaring-use section folded in; AI in the NT topic dropped at SD's decision. Seven of the ten remaining topics now built.
- DONE 8 August 2026 (other sessions): two presentations added, "Are you a robot? CAPTCHAs explained" at /presentations/captchas-explained/ and "How email works" at /presentations/how-email-works/, both linked from /presentations/index.html; the flashcards section at /flashcards/ (see its own section above and its own CLAUDE.md); and the brand assets under /assets/brand/ (see below).
- NEXT: Watermarking (needs new research: SynthID, Meta provenance, Pangram; SD to vet new links), Philosophical Futures (video embed + source list ready), Agentic AI (plus its /presentations/ explainer version).

## Approvals log

All approved by SD on 25 July 2026: the eleven hook titles; the benchmark shortlist (with IMO 2026 AI results left out); workshop pages indexable with the small CDU copyright footer and no internal-CDU framing; UNESCO (not OECD) labelling for the world tour readiness reports.

Awaiting SD (from 2 August 2026): review the Caring for Your Data platform-settings slides for currency (source data is late 2025); optionally supply vetted links for the MIT "Your Brain on ChatGPT" study and related research on the Cognitive Cost sources slide (source page's academic links looked unreliable, so none were carried over); decide whether the AI Privacy & Terms Evaluator Claude Project from the data-privacy source page should become a resource somewhere.


## Brand assets (/assets/brand/)

Added 8 August 2026. The ornate NT cover mark, cut into usable files, with full notes in `assets/brand/README.md`: which file to use where, minimum sizes, clear space, the resolution ceiling, and the colours.

The short version for anyone building a page: this is the **cover mark**, for the top of a printed deck, a social card or a title slide, and it needs at least 120 pixels. It is **not** the site mark. The header and the favicon keep the CSS star in `styles.css` (`.brand-mark`), which stays legible at 16 pixels. Do not swap one for the other.

### Social card and icons

Built 8 August 2026 from these files. `assets/brand/ntwi-social-card.png` is the 1200 by 630 card every page shares: a centred composition, the lockup over the tagline, then the three subjects and the domain, on the site's near-black ground with a symmetrical teal glow. The source is `tools/social-card/social-card.html`, rendered to a PNG rather than retouched, with its own README covering how to render it and what the card must keep. The first cut was left-weighted and read as dead space at thumbnail size; link previews are small, so check any change at about a fifth of full size before committing it.

The icons follow the README's rule that the site mark is the CSS star, not the ornate mark: `favicon.svg` redraws `.brand-mark` with slightly heavier strokes so it survives at 16 pixels, with `favicon-32.png` as a fallback and `apple-touch-icon.png` at 180 pixels on a solid dark ground.

`tools/add-meta.js` writes the Open Graph and Twitter tags, the canonical URL and the icon links into all 166 pages, decks included, in a marked block it rewrites on each run. Titles come from `search-index.json`, so a title shortened in `index-meta.json` is the one that shows when a link is shared.

One card serves every page. Per-section cards would need one image per section and a change to `CARD` in the script.

Platforms cache link previews, so a page shared before the tags went live keeps showing the old blank preview until it is scraped again. Adding a query string such as `?v=2` to the URL is the quick way to check the current state.

Still outstanding: 44 pages have no `<meta name="description">` and fall back to the site default, so they all share the same preview text. Most are simulation tools. `node tools/add-meta.js --dry-run` lists them.


## Findability: search, site index, and the generated index and sitemap

Built 8 August 2026. Site search in the shared header, a site index page at `/index/`, and `sitemap.xml`. All three are driven by one generated file, `search-index.json`, currently 165 entries.

### After adding, moving or renaming any page

Run both of these from the repo root, then commit the regenerated files together with the page changes:

- `node tools/build-index.js --sync` rewrites `search-index.json` and `sitemap.xml`, and adds a stub to `tools/index-meta.json` for anything it has not seen before. Published dates come from git by default; there is a `--no-git-dates` switch, and using it leaves most pages undated
- `node tools/add-search.js` adds the search field and the Index nav link to any new page carrying `<header class="site">`
- `node tools/add-meta.js` writes the social preview tags and icon links into every page's `<head>`. Run it after the index build, since it takes its titles from `search-index.json`

Both are idempotent, so running them when nothing has changed does no harm. The build prints a report: pages indexed, how many are hidden, the breakdown by type, and a list of any page with no published date. A page with no date cannot appear in a recently-published list, and an uncommitted page has no date until it is committed.

`search-index.json` and `sitemap.xml` must be committed. GitHub Pages has no build step, so they are checked-in artefacts; leave them out of a commit and the site search keeps serving the previous list.

### The pieces

`tools/build-index.js` walks the repo, reads each page's `<title>` and `noindex` state, derives section, type and a fallback topic from the path, and merges the hand-maintained values. Zero dependencies. Full notes in `tools/README.md`.

`tools/index-meta.json` holds everything the script cannot work out by reading a page, keyed by URL. Any of `title`, `section`, `type`, `topic`, `published` and `hidden` can be set; anything absent is derived. The script reads this file and never writes over it, so hand-set values survive regeneration.

`search.js` at the repo root injects the field into `header.site` and filters the index in the browser. Styles are in `styles.css` section 24, including the `.idx-pill` classes shared with the index page.

`/index/` is the human-readable site map, and a documented exception to the no-JS house rule alongside `/references/` and `/flashcards/`: shared `styles.css` for the chrome, `site-index.css` for the page, `site-index.js` for the data and filtering.

### Correcting an entry

Fix it in `tools/index-meta.json`, never by special-casing the script. Use a `title` override when a page's own `<title>` is longer than it should read in a search result, and a `type` override for pages that sit oddly in their folder, such as the plain-English glossaries inside course folders, which are Resources rather than Lessons.

Topics are a fixed list of sixteen, in `TOPICS` in `tools/build-index.js`. The per-folder topic defaults in the same file are a starting point, not a judgement; correct them per page in `index-meta.json`.

### Adding a new content type or section

Flashcards, added 8 August 2026, is the worked example. A new type needs four edits, and all four are one-liners:

- a rule in `RULES` in `tools/build-index.js`, giving the path prefix its section, type and fallback topic
- the type name in `TYPES` in the same file, or the build reports it as unknown
- the chip in `CHIPS` in `index/site-index.js`
- the group in `GROUPS` in the same file, or the pages are indexed but never drawn on `/index/`

A new section that reuses an existing type needs only the first of these.

### Client areas

Decided with SD on 8 August 2026: findable in the site's own search and index, marked with a "hidden" pill, and kept reasonably out of search engines by four measures working together. Every page under `/cdu-ai-staff/`, `/alice-springs-arn/` and `/roper-gulf/` carries `noindex,nofollow`; `/roper-gulf/` had none and was given them that day. They are excluded from `sitemap.xml`. `robots.txt` disallows `/search-index.json`, which does not affect the site's own search, because robots.txt governs crawlers and not browsers. Links to hidden pages carry `rel="nofollow"`, and the hidden rows on `/index/` are drawn in the browser rather than written into the HTML.

Say so plainly if it comes up: this is not privacy. Anyone with a URL can still read the page, and a scraper that ignores robots.txt can still read the JSON. Content that must not be readable by a stranger needs a login, which GitHub Pages cannot provide.

The `hidden` flag is set by a `noindex` tag on the page or by a path in `HIDDEN_PREFIXES` in `tools/build-index.js`. A new client area needs its prefix added there, and `noindex` on its pages.

### Traps worth knowing

Published dates come from each file's first commit. Do not add `--follow` back to that git call: these pages share a header and footer, so a brand-new page reads as a rename of an older one and inherits its date. The new `/index/` page came out dated 27 July that way before it was removed.

The slide decks under `/workshops/`, `/presentations/` and `/simulations/` carry no search field. They run their own full-screen chrome with no site nav, so there is nowhere to put one. `tools/add-search.js` skips them by design, which is why its report shows a large "no site header" count.

Directories named `assets` are skipped by both tools, along with `_to_delete/`, `digitalliteracy/`, `*-original.html` and the two redirect stubs under `/resources/`. The lists are at the top of each script.


## Artwork plates (10 August 2026)

The illustrated plates now run across the site as a system, from the
`design_handoff_site_artwork/` bundle SD brought back from the design work. Before
this the artwork was one banner image on the home page and every other page was flat
black, so all pages looked alike.

Full notes are in `assets/artwork/README.md`; the short version for anyone building a
page follows.

**Where the pieces live.** The treatments are `styles.css` section 25, six of them:
`.plate-band` (a banner plate uncropped at its own ratio, with the headline on flat
ground beneath), `.masthead-plate` (a plate behind the page masthead at 0.42 opacity
under a scrim), `.plate-divider` (a section divider carrying a mono label and a serif
heading), `.plate-strip` (the same with no type on it), `.app-card-plate` with
`.app-card-art` (a fixed 2:1 thumbnail slot on a card), `.plate-foot` (the footer
plate, shown whole), and `.plate-inset` (a 96px 1:1 marker for a list row). A seventh,
`.plate-hero`, is a full-bleed cover crop; it is available but no page uses it.

**The rollout is scripted.** `tools/add-artwork.js` puts a plate behind every page
masthead, or an uncropped band above it, and a plate across the top of every footer.
The plate per section comes from the `PLATES` table at the top of the script. It is
idempotent, takes `--dry-run`, and skips `/simulations/` outright, which SD asked to
leave exactly as it was. Run it after adding a page, the same way `add-search.js` and
`add-meta.js` are run.

**Three rules the treatments exist to enforce.** Each plate is a finished composition
whose frame runs to all four edges, so cropping one destroys it; type never lands on
the plate's own lettering, which is what the scrims are for; and long reading sits on
flat `--bg`, with artwork kept to heroes, dividers, thumbnails, footers and list
markers. Two or three plates per page is the ceiling, and one wordmark plate per page.

**Hand-authored exceptions**, which the script does not touch: the home page band and
library divider, the workshop card thumbnails, the Presentations card grid, the Excel
strip and divider, and the resource cards. The flashcards catalogue draws its markers
from a new `plate` field per set in `flashcards/sets/sets.json`.

**Image weight.** Every plate was re-sized to its display slot and written as WebP
with a JPEG fallback in a `<picture>`; the originals stay in
`assets/artwork/_originals/`, which Jekyll leaves unpublished. The 37MB of source
plates serve as about 2MB of WebP.

### Copy and colour changes made at the same time

The handoff asked for marketing register to be taken out site-wide. Removed: the
"No paywall; no email harvesting; no nonsense" footer line (26 pages), "Free, no
sign-ups" and "nothing is listed that hasn't been vetted" on the Resources page,
"Nothing to install and nothing to sign up for" on Flashcards, "nothing to install"
on two course pages, "they stay out of search engines, but not out of your own index"
on `/index/`, and "Real datasets; real exercises; everything downloadable and yours to
keep" from the shared social description in `tools/add-meta.js` (44 pages). Kept, as
factual entry requirements rather than pitches: "no experience needed" and "works
offline" on the Excel meta row.

The retired tagline "connect, create, leave a mark" came off the social card, which
was re-rendered from `tools/social-card/social-card.html`. "Intelligence inked,
legacies written" is still drawn into several artwork plates; that is part of the
illustration and stays.

The three legacy deck inks were replaced across the ten slide decks under
`/workshops/` and `/presentations/`: ochre `#E08A3C` to steel blue `#4B85A9`, red
`#E05B4A` to pale mint `#BEEBD5`, green `#4CC98A` to sage `#8DB091`, with their
washes and their ink-on-fill text colours moved to match. None of the three reads as
a warning, which is a known and accepted limitation; the words carry the meaning.
`/simulations/handwriting-and-voice/` still carries the old three, because
`/simulations/` was left alone.

### Still open

- `/workshops/` has seven subfolders and no `index.html`, so the workshops index
  screen in the mock is a new page rather than a restyle. Not built; flagged for SD.
- The Presentations page moved from an accordion to a card grid, which drops the
  duration, level and "covers" list each deck used to carry. SD's call, 10 August 2026.
- The Excel jump nav was kept. The mock replaced it with the ruled plate strip; the
  strip was added above it instead, so the page keeps its in-page navigation.
- Several plates are below 1600px and will go soft used full-bleed on a large display:
  `banner-wordmark-usb`, `footer-monogram-chip` and `footer-mouse-lightbulb-monogram`
  are the weakest. SD intends to supply higher-resolution re-exports.

## Agentic AI Web Dev course (14 August 2026)

Built from SD's five plan files in `~/Desktop/Web dev course plan/` plus the
`SEO-GEO-Research.md` brief she added the same day. Three new pages.

`/agentic-web-dev/index.html` is the course, "Agentic AI Web Dev 2026: From
Design Security to Discoverable Deployment", added to the library accordion as
course 11 and to the front-page footer library column. Single-page course in the
Visio and Power BI SIEM shape: positioning, prerequisites, two foundation
phases, then the two core streams (access gates; machine-readable sites),
a capstone, the optional marketing adaptation, and a currency section listing
what to re-verify before delivery. Phases are named, not numbered, so they can
be reordered.

Two interactive walkthrough decks under `/presentations/`, both built to the
`interactive-walkthrough-deck` skill with the refresh SD asked for in plan file
04: myth chips only where a module genuinely corrects a false belief, no
obligatory taglines, varied module openers (plain question, claim to test, flat
statement). Both match the publishing-a-website deck's palette and faces
exactly, and both carry a `<noscript>` block that degrades the deck to a
scrolling document.

- `/presentations/why-the-frontend-gate-fails/` (4 modules, 18 beats). Flagship
  is the break-the-gate widget: a simulated frontend passcode gate, an "open
  developer tools" control that reveals the passcode in the downloaded source,
  and an "edit the check" control that bypasses it entirely. Closed simulation
  throughout; no working passcode logic, no signing code, nothing that functions
  against a live site. No prices anywhere in the card by design; the dated
  figures stay in the access-gates resource.
- `/presentations/from-ranking-to-being-cited/` (4 modules, 17 beats). Flagship
  is the place-it-on-the-spectrum widget: five techniques, five bands from
  genuine standard to actively backfires. llms.txt lands in "proposed
  convention, contested" and keyword stuffing in "actively backfires".

CONTENT RULE FOLLOWED: every fact comes from the five plan files and the
research brief. Nothing was invented and no citation was fabricated; where the
reach report hedges, the deck hedges. Research-benchmark figures are framed as
benchmark results, not outcomes.

TITLE NOTE: SD's title says "Agentic AI" and "Design Security"; the plan covers
neither as its own content. Her decision, 14 August 2026, was to keep the title
and the plan as they are. If an agentic-AI phase is ever wanted, the natural
place is a foundation phase on building with AI coding agents, feeding straight
into the broken-gate demonstration.

SIDE EFFECTS of running the four maintenance scripts, all documented behaviour
rather than anything this build asked for. `build-index.js` found 37 pages that
had never been indexed (the whole `shadow-ai-manual`, several presentations,
`design_handoff_site_artwork/site-mock.html`) and added them, taking
`search-index.json` from 165 to 202 entries. `add-search.js` then added the
search script tag to 29 of those pages, and `add-meta.js` added social tags to
them. `tools/social-card/social-card.html` was restored by hand afterwards,
because it has no `<title>` and `add-meta.js` writes its path into the og:title
when that happens; worth fixing in the script if it keeps recurring.

`tools/build-index.js` gained a RULES entry and a title suffix for the new
course; `tools/add-artwork.js` gained a PLATES entry
(`hero-padlock-wordmark` masthead, `footer-data-table-monogram` footer).
Published dates for the three new pages were hand-set in `index-meta.json`,
since an uncommitted page has no git date.

Verified before delivery: both decks driven headlessly through every beat at
three viewport sizes, every widget control clicked, every interactive beat left
and re-entered to confirm the `data-onenter` reset, console clean, and
screenshots checked of the menus, both flagship widgets mid-interaction and the
densest beats. At 1280x720 a few beats scroll rather than fitting; the
publishing-a-website deck does the same at that height, so this matches house
behaviour.

### Course page rewritten, 14 August 2026 (same day)

SD read the first version and called it overly academic: abstract openers,
metaphors, and headings that did not say what a section contained. Rewritten
from scratch in the tech-strategist register. What changed:

- Headings now name their contents. "The honest baseline" became "How to check
  a claim before you act on it"; "The layered model of machine readability"
  became "What machines read, ranked by how settled it is". You can read any
  heading and know what is in the section.
- Every phase opens with a one-line summary of what it is, then a scannable
  `// covers` bullet list, then the point to take away. No "this phase exists
  because" framing.
- Metaphors removed throughout (hinges, spines, wristbands, security theatre as
  a standing frame). Where a comparison earns its place it is stated plainly.
- Facts moved out of prose into three reference tables: the three
  access-control options, the four machine-readability layers, and the GEO
  tactic results.
- Confidence labels added inline as `<span class="conf">(high)</span>` etc, per
  SD's standing preference. On this page they also fit the subject, since the
  course is about separating verified from hyped.
- A "Sources used" section added at the base with a per-source confidence label
  and an explicit "not verified" list.

New page-scoped classes: `.summary`, `.covers-label`, `ul.covers`, `.conf`,
`ul.sources`. Everything else is unchanged from the first build. Verified:
all TOC anchors resolve, no horizontal overflow at 1440px, no page errors.
The two decks were NOT rewritten; their register is the walkthrough-deck
register, which is a different job. Worth checking with SD whether they need
the same treatment.
