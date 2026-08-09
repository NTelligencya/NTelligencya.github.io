# Shadow AI Blue Team Manual, site-build handoff

Purpose: let a fresh Cowork session continue working on the manual on the NT World Ink site without re-deriving conventions. This covers the HTML site build only. The manual's own `Shadow AI CLAUDE.md` and `style-guide.md` in this folder remain authoritative for voice and content; this note records the site-specific decisions and the build state, current to 9 August 2026 (Part Five build).

## Where it lives

- Repo: `NTelligencya.github.io` (the ntworldink-LIVE folder). Device path root: `C:\Users\April\iCloudDrive\Desktop\Websites\ntworldink-LIVE\NTelligencya.github.io\`.
- Section: `/shadow-ai-manual/`. Landing `index.html`, `glossary.html`, `manual.css`, and `part-1/` through `part-5/`.
- HTML is the canonical form on the site. There is no parallel Markdown repo being maintained; the Markdown notes in this Obsidian folder are the source you write from, not a synced copy.

## Build state

- **The manual is written.** Thirty-three chapters across five parts, plus a landing page and a glossary of 253 entries.
- Part One: seven chapters, `part-1/01-osi-tcpip.html` through `07-proxies-swg-sase.html`.
- Part Two: six chapters, `part-2/08-authn-authz.html` through `13-tenant-app-registrations.html`.
- Part Three: seven chapters, `part-3/14-os-fundamentals.html` through `20-device-join-states.html`. Chapter 20 still has no outline in `drafts/`.
- Part Four: seven chapters, `part-4/21-cloud-service-models.html` through `27-dspm-for-ai.html`.
- Part Five: six chapters, `part-5/28-australian-privacy-landscape.html`, `29-workplace-surveillance-law.html`, `30-notice-consent-proportionality.html`, `31-driving-usage-underground.html`, `32-reference-architecture.html`, `33-incident-response-tabletop.html`. Built 9 August 2026 through the full three-step workflow: outline in `drafts/28-outline.md` to `33-outline.md`, then a Markdown note in the Obsidian folder, then the page. Each note carries a "Note on provenance" recording that the note and the page were written together; revise both if a chapter changes.
- **Part Five pages are longer than earlier parts**, running 14 to 24 minutes against Part Four's 12 to 15 and Part Three's 16 to 18. That is deliberate and is the topic's doing. Chapters 28 and 29 have to cover nine privacy regimes and eight surveillance statutes respectively, and their source lists are the longest in the manual because every legal claim carries a section number and a link. Prose word counts excluding the sources and open questions apparatus run 2,450 to 3,900, which is within the brief's guidance.
- Navigation runs continuously 1 to 33. Chapter 27's next link now points to chapter 28; chapter 33's next reads "End of the manual".
- Landing page lists all thirty-three as links. The `ch-soon` class is no longer used anywhere. The closing paragraph now reads "The manual is complete: thirty-three chapters across five parts".
- Glossary now holds 253 entries. Thirty-eight were added this build, covering the legal and governance vocabulary: APP entity, collection notice, compliance budget, computer surveillance, consultation term, containment, covert surveillance, data controller, data minimisation, data processor, data surveillance device, decision record, eligible data breach, employee record, employee records exemption, enterprise agreement, intelligent enablement, interception, invasiveness ladder, network protection duties, NDB, penalty unit, personal information, PIA, post-incident review, prevented delivery notice, proportionality, reference architecture, residual risk, sanctioned alternative, sensitive information, serious harm, shadow security, situation report, statutory tort of serious invasion of privacy, surveillance record, tabletop exercise and workplace surveillance.
- `APP` and `IPP` already existed as acronym entries, so Part Five links to those rather than duplicating them. `network protection duties` is a separate entry from the existing `network protection`, and the entry says so, because they are unrelated and easily confused.
- Glossary letters J and Y are still absent, which is correct for the current term set.

## Conventions locked

- Register: the enabled `tech-strategist-mode-style` skill. No-fluff technical manual. Remove metaphor and rhetorical flourish. Keep the opening scene, but plain.
- Terminology: do not use "learners". Use "students" or "entry-level trainees".
- Australian English throughout. No em-dashes (use semicolon, comma, full stop). No emoji. Do not use "moves", "movements" or "beats" for stages; use steps or phases. **One exception now exists**: the official title of the *Privacy (Australian Government Agencies — Governance) APP Code 2017* contains an em-dash and is reproduced accurately in chapter 30. That is the only em-dash in the section and it should stay.
- No visible chapter numbers in headings or the landing contents list. Filenames carry the two-digit number for ordering; the part label and chapter title carry no number. Referring to "Chapter 15" inside prose is fine and expected.
- Part numbers are spelled out in prose: Part One, Part Two, Part Three, Part Four, Part Five.
- Confidence labels inline as `<span class="conf">(high|medium|low)</span>`, sparingly in prose, more in sources and open questions. Where the label carries a reason, it goes inside the span. Where unsure, write "I don't know" or "not publicly documented". Part Five uses them more heavily than earlier parts, which is appropriate for legal material.
- Reading time in `.reading-meta` is the word count of everything inside `<main>` divided by 200, rounded.
- Microsoft Learn URLs use the `/en-us/` prefix.
- **Australian legal citation**: cite the section, not just the Act. Sources come from the Federal Register of Legislation, AustLII, each jurisdiction's own legislation service, the OAIC or the relevant state or territory information commissioner. Law firm commentary appears only as commentary and is labelled as such.
- Every chapter that touches law carries a line in its "Note on provenance" stating that the chapter is not legal advice.

## Page scaffold

Best practice: open `part-5/30-notice-consent-proportionality.html` and copy it, then replace the content. Structure:

- `<head>`: fonts link (Cormorant Garamond, Manrope, JetBrains Mono), then `../../styles.css` and `../manual.css` for a page two levels deep (`part-N/xx.html`); canonical, favicon set, `theme-color`. No hand-written social meta; `tools/add-meta.js` writes that later.
- `header.site` with brand `href="../../"`, nav to `../../#library`, `/index/`, `../../#about`, `../../#contact`.
- `nav.breadcrumb` (Home, Shadow AI Blue Team Manual, chapter).
- `section.container-manual.manual-masthead`: `.part-label`, `h1`, `.subtitle`, `.reading-meta`.
- `main.content-body.manual-prose` inside `section.container-manual`: opening `.scene` block, then `h2` sections in prose.
- Callouts: `.callout.breaks` (label "Where this breaks down") and `.callout.check` (label "Check your understanding", an `<ol>` of five prompts).
- Chapter foot: `.chapter-foot` blocks for "Glossary terms used in this chapter" (plain list separated by ` &middot; `, alphabetical, not links), "Sources" (`ol.sources-list`), and "Open questions". A closing chapter may add a fourth block, as chapter 33 does with "Closing Part Five and the manual".
- `nav.chapter-nav`: prev, contents (`../`), next. `.last-updated` line, then the shared footer with the CDU copyright line.
- Relative-path depth: pages in `part-N/` use `../../styles.css`, `../manual.css`, `../glossary.html`, `../` for contents.

## Build tooling from the Part Five session

The Part Five build wrote the Markdown notes first and generated the HTML from them with a script, rather than hand-authoring each page. That is a better pattern than the earlier parts used and is worth repeating for any revision.

- The note Markdown uses two extra markers that the generator resolves: `[[term]]` for a glossary link, resolved to `<a class="term" href="../glossary.html">term</a>` on first occurrence per chapter and to plain text thereafter; and `<span class="conf">(high)</span>` written inline, stripped back to `(high)` in the clean Markdown note that is committed to the Obsidian folder.
- Section headings map to page structure by name: everything before the first `##` becomes the `.scene` block; `## Where it breaks` becomes the breaks callout; `## Check your understanding` becomes the check callout as an ordered list, one prompt per paragraph; `## Glossary terms used in this chapter`, `## Sources` and `## Open questions` become chapter-foot blocks in that order; a `## Closing ...` heading becomes a final chapter-foot block; `## Note on provenance` is note-only and is not published.
- The scripts were `build.py` and `glossary_add.py`, written in the session working directory and not committed to the repo. They are simple enough to rewrite; the mapping above is the part worth keeping.

## Source verification, current position

- Every Microsoft Learn URL cited in Parts Two, Three and Four was verified against the Microsoft Learn connector on 9 August 2026. The two Microsoft Learn URLs newly cited in Part Five, the enterprise data protection page and the Copilot Chat management page, were verified the same way during the Part Five build.
- Australian legislation and regulator guidance cited in Part Five was verified during the Part Five build against the Federal Register of Legislation, each jurisdiction's legislation service, and the relevant commissioner's own pages. Two preferred primary hosts were unreachable during the build: **AustLII returned HTTP 403 throughout**, and **legislation.nsw.gov.au was blocked**. New South Wales material is therefore verified against the Workplace Surveillance Bill 2005 as passed by both Houses and the NSW Judicial Commission Local Court Bench Book, which agree on every section number and penalty used. Anyone with AustLII access should re-check the New South Wales section numbers before the section is treated as final.
- Two flags remain from earlier builds, both non-Microsoft and unverified: the CISA SolarWinds advisory in chapter 9, which needs a specific advisory URL rather than the advisories index, and the Google Workspace Admin Help page in chapter 13.
- Chapter 12's grant-controls citation covers two Microsoft pages; the grant-controls page is verified and the session-controls page is not, and the source line says so.

### Corrections and cautions the Part Five build recorded

- **The section numbering in the New South Wales Workplace Surveillance Act is one off from the first print of the Bill from clause 18 onward.** A clause was inserted during passage. In the Act as passed: s 15 change rooms, s 16 not at work, s 17 blocking of email and website access, s 18 use and disclosure, s 19 covert surveillance offence. Any draft written from the first print will be wrong.
- **The ACT's privacy regulator changed on 1 July 2024.** An independent ACT Privacy Commissioner within the ACT Human Rights Commission replaced the arrangement under which the Australian Information Commissioner performed the role. Any source describing the OAIC as the ACT regulator is stale.
- **Western Australia's privacy regime commenced on 1 July 2026**, six weeks before this build. Material written before then describes a regime that did not exist. Its serious data breach obligations begin 1 January 2027.
- **Queensland replaced its IPPs and NPPs with a single set of Queensland Privacy Principles from 1 July 2025.**
- **The 2024 retail facial recognition determination was substantially overturned on review in March 2026.** Chapter 30 tells both halves. Do not cite the determination without the review outcome.

## Outstanding

- **Site wiring was not completed.** The device bridge to the user's machine dropped partway through the Part Five build, before the library card, nav entry, `node tools/build-index.js --sync`, `node tools/add-search.js` and `node tools/add-meta.js` steps could run, and before anything was committed to git. This is the first task for the next session, and it now covers the whole manual rather than one part.
- **Nothing has been committed to git across any of the five builds.** The section exists only as a local working copy.
- Chapter 20 has no outline in `drafts/`, unlike chapters 14 to 19 and 21 to 33. Write one if the drafts folder is meant to be complete.
- **The licensing question is now the manual's single most repeated open item**, flagged in chapters 19, 20, 22, 27 and 32. Several Purview, Edge for Business and posture capabilities are billed as pay-as-you-go rather than included, the guidance moved more than once during 2025, and Australian education pricing is not published. It needs one look at the tenant billing portal, resolved centrally, and then a pass over those five chapters.
- Part Four cites two figures from vendor product material rather than documentation: the size of the cloud application catalogue and of its generative AI category, both `(medium)` in chapter 24.
- Part Five carries several deliberate unknowns that are worth chasing if the manual is ever revised for print: the neutral citation of the March 2026 tribunal decision reviewing the facial recognition determination; the primary report behind the widely quoted figure of 71 per cent of Australian university staff using generative AI; whether South Australia's Information Privacy Principles Instruction reaches SA universities; and full bibliographic details for two of the shadow IT papers cited in chapter 31.
- The Part Five chapters could carry a short standing disclaimer on the landing page rather than one per note, if a legal review ever asks for it. At present the disclaimer sits in each chapter's provenance note, which is not published, and in the landing page's existing sentence that the manual is not a substitute for legal advice.
