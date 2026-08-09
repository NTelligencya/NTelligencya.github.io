# Shadow AI Blue Team Manual, site-build handoff

Purpose: let a fresh Cowork session continue building the manual on the NT World Ink site without re-deriving conventions. This covers the HTML site build only. The manual's own `Shadow AI CLAUDE.md` and `style-guide.md` in this folder remain authoritative for voice and content; this note records the site-specific decisions and the build state, current to 9 August 2026 (Part Four build).

## Where it lives

- Repo: `NTelligencya.github.io` (the ntworldink-LIVE folder). Device path root: `C:\Users\April\iCloudDrive\Desktop\Websites\ntworldink-LIVE\NTelligencya.github.io\`.
- Section: `/shadow-ai-manual/`. Landing `index.html`, `glossary.html`, `manual.css`, and `part-1/` through `part-4/` (and `part-5/` next).
- HTML is the canonical form on the site. There is no parallel Markdown repo being maintained; the Markdown notes in this Obsidian folder are the source you write from, not a synced copy.

## Build state

- Part One: seven chapters, `part-1/01-osi-tcpip.html` through `07-proxies-swg-sase.html`.
- Part Two: six chapters, `part-2/08-authn-authz.html` through `13-tenant-app-registrations.html`.
- Part Three: seven chapters, `part-3/14-os-fundamentals.html` through `20-device-join-states.html`. Chapters 14 to 17 and 19 were converted from prepared notes; 18 and 20 were drafted straight to HTML and their notes written back afterwards, each carrying a "Note on provenance" section. Chapter 20 still has no outline in `drafts/`.
- Part Four: seven chapters, `part-4/21-cloud-service-models.html`, `22-saas-api-economy.html`, `23-edr-telemetry-pipelines.html`, `24-casb-discovery.html`, `25-dlp-three-problems.html`, `26-siem-xdr-data-lake.html`, `27-dspm-for-ai.html`. Built 9 August 2026 through the full three-step workflow: outline in `drafts/21-outline.md` to `27-outline.md`, then a Markdown note in the Obsidian folder, then the page. Each note carries a "Note on provenance" recording that the note and the page were written together; revise both if a chapter changes.
- Part Four pages run 12 to 15 minutes, shorter than Part Three's 16 to 18. That is deliberate; the arguments complete. Chapters 24 and 26 are the shortest at 12 minutes.
- Glossary now holds 215 entries. Fifty-two were added this build, covering the cloud and telemetry vocabulary: tenant, cloud service model, IaaS, PaaS, shared responsibility model, multi-tenancy, control plane, data plane, enterprise data protection, service principal, application object, unified audit log, app governance, connector, sensor, telemetry, Event Tracing for Windows, custom indicator, network protection, web content filtering, SmartScreen, threat hunting, cloud discovery, log collector, API connector, app catalogue, risk score, sanctioned and unsanctioned application, shadow IT, sensitive information type, sensitivity label, exact data match, trainable classifier, confidence level, endpoint DLP, browser data security, adaptive protection, collection policy, activity explorer, false positive, data lake, normalisation, correlation rule, detection engineering, ingestion, retention tier, analytics tier, SOAR, posture management, CSPM, one-click policy and Purview.
- Navigation runs continuously 1 to 27. Chapter 20's next link now points to chapter 21; chapter 27's next reads "Part Five in preparation".
- Landing page lists all twenty-seven as links; Part Five items remain `<li class="ch-soon">`. The closing paragraph now reads "Parts One to Four are written: twenty-seven chapters".
- Nothing is committed to git yet, and the section is not yet wired into site search or nav (see Outstanding).

## Conventions locked

- Register: the enabled `tech-strategist-mode-style` skill. No-fluff technical manual. Remove metaphor and rhetorical flourish. Keep the opening scene, but plain.
- Terminology: do not use "learners". Use "students" or "entry-level trainees".
- Australian English throughout. No em-dashes (use semicolon, comma, full stop). No emoji. Do not use "moves", "movements" or "beats" for stages; use steps or phases.
- No visible chapter numbers in headings or the landing contents list. Filenames carry the two-digit number for ordering; the part label and chapter title carry no number. Referring to "Chapter 15" inside prose is fine and expected.
- Part numbers are spelled out in prose: Part One, Part Two, Part Three.
- Confidence labels inline as `<span class="conf">(high|medium|low)</span>`, sparingly in prose, more in sources and open questions. Where the label carries a reason, it goes inside the span. Where unsure, write "I don't know" or "not publicly documented".
- Reading time in `.reading-meta` is the word count of everything inside `<main>` divided by 200, rounded. Part Three chapters land between 16 and 18 minutes.
- Microsoft Learn URLs use the `/en-us/` prefix, matching Parts One and Two.

## Page scaffold (copy an existing chapter as the template)

Best practice: open `part-3/14-os-fundamentals.html` and copy it, then replace the content. Structure:

- `<head>`: fonts link (Cormorant Garamond, Manrope, JetBrains Mono), then `../../styles.css` and `../manual.css` for a page two levels deep (`part-N/xx.html`); canonical, favicon set, `theme-color`. No hand-written social meta; `tools/add-meta.js` writes that later.
- `header.site` with brand `href="../../"`, nav to `../../#library`, `/index/`, `../../#about`, `../../#contact`.
- `nav.breadcrumb` (Home, Shadow AI Blue Team Manual, chapter).
- `section.container-manual.manual-masthead`: `.part-label`, `h1`, `.subtitle`, `.reading-meta`.
- `main.content-body.manual-prose` inside `section.container-manual`: opening `.scene` block, then `h2` sections in prose.
- Callouts: `.callout.breaks` (label "Where this breaks down") and `.callout.check` (label "Check your understanding", an `<ol>` of five prompts).
- Chapter foot: `.chapter-foot` blocks for "Glossary terms used in this chapter" (plain list separated by ` &middot; `, alphabetical, not links), "Sources" (`ol.sources-list`), and "Open questions". A closing chapter may add a fourth block, as chapter 20 does with "Closing Part Three".
- `nav.chapter-nav`: prev, contents (`../`), next. `.last-updated` line, then the shared footer with the CDU copyright line.
- Relative-path depth: pages in `part-N/` use `../../styles.css`, `../manual.css`, `../glossary.html`, `../` for contents.

## Glossary and term-linking

- Single `glossary.html`, alphabetical `<dl>` per letter, each entry `<div class="glossary-entry"><dt>term</dt><dd>...</dd></div>`, letter headers `<div class="glossary-letter">X</div>`. Acronym entries take the form `<dt>DLP <span class="expand">Data Loss Prevention</span></dt>`. Letters now run A to Z with J and Y still absent.
- Linking convention: bold a term on first use. Link the core vocabulary to `../glossary.html` with `<a class="term" href="../glossary.html">term</a>`; leave the long tail bold but unlinked, defined inline. Only link a term if it exists in the glossary, and only once per chapter.
- `/home/claude/sa/add_glossary.py` from this build is the pattern for bulk-inserting entries alphabetically into the right letter group, including creating a missing letter block. It is not in the repo; rewrite it if you need it again.
- The chapter-foot "Glossary terms used" list is plain text.

## Per-chapter workflow

1. Read the matching note in this folder and the neighbouring chapters to avoid overlap.
2. Copy an existing chapter file as the scaffold.
3. Convert the note: de-flourish to the register, keep facts, examples, confidence labels, sources and open questions. Convert, do not rewrite; the notes are already in voice.
4. Add any new bold-linked terms to `glossary.html` alphabetically, then link them in the chapter.
5. Set chapter nav (prev, contents, next). Update the previous chapter's next link and the landing page list item.
6. Verify every Microsoft Learn URL through the Microsoft Learn connector before publishing the chapter, and set the check date to the day you checked.
7. Deliver each file with SendUserFile, then `device_commit_files` to the repo path. Use `force: true` when overwriting files you wrote earlier in the same session.

## Source verification, current position

- Every Microsoft Learn URL cited in Parts Two, Three and Four was verified against the Microsoft Learn connector on 9 August 2026. Those sources read `Last checked 9 August 2026` with a `(high)` label.
- One URL had moved during the Part Three build: the Defender for Cloud Apps app governance page is now `/defender-cloud-apps/app-governance-manage-app-governance`, not `app-governance-overview`. Chapter 13 has been corrected.
- Two flags remain deliberately, both non-Microsoft and unverified: the CISA SolarWinds advisory in chapter 9, which needs a specific advisory URL rather than the advisories index, and the Google Workspace Admin Help page in chapter 13.
- Chapter 12's grant-controls citation covers two Microsoft pages; the grant-controls page is verified and the session-controls page is not, and the source line says so.
- Non-Microsoft sources added in Part Three (Chromium, Google Security Blog, Chrome for Developers, MDN, Mozilla Hacks, Apple developer and support, man7.org, modelcontextprotocol.io, cyber.gov.au) were confirmed to exist by search but have not been read end to end against the claims they support. Chapter 23 reuses the Apple Endpoint Security and eBPF references on the same basis and labels them `(medium)`.
- The Part Four build ran an adversarial check over twelve of the part's most load-bearing claims. Ten were confirmed against Microsoft Learn. Two were softened and are recorded below.

### Corrections this build made to the internal source reports

- **No generative AI category in Defender for Endpoint web content filtering.** The telemetry report refers to one. Current documentation lists only adult content, high bandwidth, legal liability, leisure and uncategorised. An "Artificial Intelligence" category does exist in Global Secure Access web content filtering, which is a different product. Chapter 23 states the correction explicitly and Chapter 24 routes AI blocking through indicators and unsanctioning instead.
- **The QUIC caveat is now first-party.** The telemetry report cited an independent blog. Microsoft documents directly that blocking domains in non-Microsoft browsers requires QUIC and Encrypted Client Hello to be disabled, and links the specific Chrome and Firefox policies. Chapter 23 cites Microsoft and the claim is `(high)`.
- **Unsanctioning latency is up to three hours, not two.** One hour to synchronise the tag to the endpoint product plus up to two hours to push the indicator. Chapter 24 uses the three-hour figure and the breakdown.

### Claims deliberately left soft

- **Adaptive protection policy locations.** Two Purview pages say Exchange, Teams and devices; the data loss prevention policy reference also lists unmanaged cloud apps. Chapter 25 notes the discrepancy in prose and under open questions rather than picking a side.
- **Sentinel analytics tier default retention.** The ninety-day figure is stated on the log plans page but a second page gives thirty days for extended detection and response data. Chapter 26 states ninety days as the stated default, names the inconsistency, and tells the reader to check the setting for the table in question.

## Part Five, ready to build

- Chapters 28 to 33 per `Shadow AI CLAUDE.md`: the Australian privacy landscape; workplace surveillance laws by jurisdiction; notice, consent and proportionality; the risk of driving usage underground; a reference architecture; and incident response as a tabletop.
- There are no prepared notes and no outlines for 28 to 33. Section 5 of `Shadow Telemtery options.md` is the spine: Privacy Act 1988 (Cth) and the Australian Privacy Principles, the position of state and territory universities, the NT Information Act 2002 and its Information Privacy Principles, workplace surveillance legislation by jurisdiction with the NSW Act as the working floor, the Telecommunications (Interception and Access) Act 1979 (Cth), and the argument against full TLS interception. Section 6 supplies the five-level invasiveness ladder and section 7 the maturity model.
- Chapter 28's prev link is cross-part to `../part-4/27-dspm-for-ai.html`; also change chapter 27's next from the "Part Five in preparation" span to a link to chapter 28.
- Part label for these pages: `Part Five &middot; Governance, law and proportionate response`.
- Chapter 27 hands off explicitly with a "Closing Part Four" block. It names the residue the whole manual has now approached from four directions, and frames Part Five as the shift from what can be built to what should be. Keep chapter 28's opening consistent with it.
- Forward promises Part Four made that Part Five is expected to honour: chapter 25 hands the proportionality of risk-adaptive enforcement to Part Five; chapter 26 hands the point at which usage reporting becomes individual monitoring to Part Five, and flags behavioural baselines as an ethical question; chapter 21 flags the sanctioned alternative as the strongest available intervention.
- Cite legislation by section, not just by Act, per `Shadow AI CLAUDE.md`. Australian legal sources should come from the Federal Register of Legislation, AustLII, the OAIC or the relevant state or territory information commissioner, not from law firm commentary, though commentary can be cited as commentary.
- Glossary terms Part Five will likely need and that are not yet present: Australian Privacy Principles, Information Privacy Principles, employee records exemption, workplace surveillance, proportionality, collection notice, privacy impact assessment, data controller and data processor, enterprise agreement.

## Outstanding across the whole manual

- Site wiring, now that four parts are stable: add a library card and nav entry, then run `node tools/build-index.js --sync`, `node tools/add-search.js`, `node tools/add-meta.js` from the repo root, and commit the regenerated `search-index.json` and `sitemap.xml` with the pages.
- Decide whether to git-commit and publish the section, or keep it as a local working copy. Nothing has been committed to git across any of the four builds.
- Chapter 20 has no outline in `drafts/`, unlike chapters 14 to 19 and 21 to 27. Write one if the drafts folder is meant to be complete.
- The pay-as-you-go licensing position for several Purview and Edge for Business capabilities is flagged `(low)` across chapters 19, 20, 22 and 27 and is not resolvable from Microsoft Learn. It needs a look at the tenant billing portal before any figure is quoted. This is now the single most repeated open question in the manual and would be worth resolving once, centrally.
- Part Four cites two figures from vendor product material rather than documentation: the size of the cloud application catalogue and of its generative AI category, both `(medium)` in chapter 24. If a stable documentation source appears, cite it instead.
- Glossary letters J and Y are still absent, which is correct for the current term set.
