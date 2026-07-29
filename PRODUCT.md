# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site's actual primary user is **Sally Davis** herself, Lecturer in ICT, Cyber Security and Digital Technology at Charles Darwin University (CDU), based in Darwin, NT. She uses the site as a personal teaching hub: when asked to deliver a lunch-and-learn or a one-hour session, she reaches for an existing topic, tool, presentation, course or resource rather than scoping one from scratch.

There is no single primary visitor; the intended audience shifts per section:

- **NT community and workforce learners** (courses, digital literacy, cyber awareness): regional and remote Australians, often with low prior tech confidence, learning self-serve or in a facilitated session.
- **Broader NT public and Darwin business audience** (workshops, presentations, resources): people who receive a blurb or link, or who arrive via search.
- **CDU staff** (the internal `/cdu-ai-staff/` pages, which stay `noindex`).

Pages are public and indexable, but they are not routinely shared with attendees after a session. Public discoverability is incidental to the site's purpose, not its goal.

## Product Purpose

A personal, reach-for catalogue and teaching hub that removes the stress and time cost of standing up short sessions.

Origin and mechanism: requests for one-hour or lunch-and-learn sessions are disproportionately time-intensive, because the hard part is scoping a topic small and coherent enough to fill exactly an hour. The site pre-solves that. It holds a set of topics Sally can already talk on for an hour, each paired with the tool, presentation, course or curated resources it needs, organised so she can grab and go when the next request lands.

Success means time saved and stress removed for Sally: when a request arrives ("can you do a lunch-and-learn on X, and send us a blurb?"), the topic, the supporting materials and a ready blurb already exist. The centre of gravity is deliberately not moving toward public marketing, reach or a commercial pipeline; the marketing and social-media hooks in the build plan exist only to answer the recurring "send us a blurb" ask.

## Positioning

Not a public course marketplace, an LMS, or a portfolio. It is one educator's pre-built, self-authored catalogue of hour-sized, coherent, delivery-ready topics, plus the bespoke interactive tools, browser presentations and curated resources each topic needs. The value is the pre-scoping and the coherence for a fixed session length, not breadth, enrolment, or audience size. A neighbouring public training site could copy the topics but not the fact that they are already scoped, resourced and reach-ready for their author.

## Operating Context

- **Trigger:** an external request for a lunch-and-learn, one-hour talk or short session, often arriving with "send us a blurb."
- **Author workflow:** identify (or add) a topic Sally can teach in an hour; build or assemble the tool, presentation, course or resource it needs; organise it on the site; reach for it, and its blurb/hook, when a request lands.
- **Delivery:** sessions run live, in person or online. The site backs the delivery and holds the durable materials; it is not usually handed to attendees afterward.
- **Programs co-exist:** general NT community courses, the CDU-internal set, and place-specific builds (Alice Springs ARN, Roper Gulf, Pandanus Reach, Tennant Creek origins) all live in the one static site.

## Capabilities and Constraints

- **Sections:** a Course library; a Simulations/Tools catalogue (interactive browser exercises); Presentations (self-contained browser slide decks); Resources (static card pages plus the filterable References library); and the Workshops catalogue (eleven hour-long AI special-interest topics, currently in build).
- **Materials are durable and portable:** handouts, practice workbooks and datasets are downloadable and work offline, independent of the website ("everything downloadable and yours to keep").
- **Technical:** static HTML/CSS/JS on GitHub Pages at ntworldink.com; no build system. A shared `styles.css` design system is linked by every page. Deliberate, documented exceptions exist (the References library carries its own CSS/JS for live search, filtering and copy-to-clipboard).
- **Content house rules (see project CLAUDE.md, authoritative):** Australian English throughout; no em-dashes in public web content; no emoji on public pages; no invented citations, statistics or links; a last-updated line at the foot of every page.
- **CDU framing:** the small CDU copyright/RTO footer line (RTO Provider No 0373; ABN 54 093 513 649; TAFE ICT, Cyber Security and Digital) is retained, but CDU framing is de-emphasised on public-facing workshop and resource pages; those pages read as NT-centric special-interest topics for a general audience. Workshops and resources are indexable; the `/cdu-ai-staff/` pages keep `noindex`.

## Brand Commitments

- **Name and wordmark:** "NTell World Ink" / "NT World Ink", shown as the `ntworld.ink` wordmark (with a teal accent dot). Domain: ntworldink.com. Banner asset `NTellWorldInk_Banner.png`, taglines "Intelligence Inked. Legacies Written." and "connect, create, leave a mark".
- **Voice:** plain, dry, unpretentious, NT-grounded. "Learning that sticks"; "no paywall, no email harvesting, no nonsense".
- **Language:** Australian English everywhere; no em-dashes in public-facing web content; no emoji on public pages. (Individual project CLAUDE.md files may refine this; theirs wins locally.)
- **Incumbent visual system** (dark "after dark" theme, teal accent, Cormorant Garamond / Manrope / JetBrains Mono, shared `styles.css`) is existing design authority. Recorded here as a commitment; init does not redesign it.

## Evidence on Hand

- **Substantial real content:** 7+ courses including Power Query ("Pandanus Reach", 13 CSV dataset), Excel / Word / PowerPoint (with take-home handouts and starter/solution workbooks), an 11-session Digital Literacy course, Cyber Security Awareness, and AI Literacy; roughly 40+ interactive simulations/tools; five browser presentations; the Resources and References sections; and two workshop decks already built (Global AI World Tour, Which AI Is Best).
- **Place-specific programs:** `/cdu-ai-staff/`, `/alice-springs-arn/`, `/roper-gulf/`, `/pandanus-reach/`, and the Tennant Creek origins of the Digital Literacy course.
- **Research/migration notes** (external to the repo, at `~/Desktop/Websites/CDU Training/migration-notes/`) back specific workshop claims and are the vetted source for new links and statistics.
- **Absences future work must not fabricate:** no enrolment numbers, testimonials, attendance figures or outcome metrics; no NT mining or tourism AI case-study data (a known gap in the build plan). Use national data where NT data is absent, and say so.

## Product Principles

1. **Serve the author first.** The site's job is to make Sally's next session cheap to stand up. Grab-and-go for her outranks reach for strangers.
2. **Hour-sized and coherent.** Each topic is pre-scoped to a deliverable one-hour session; coherence and the right supporting tool, deck or resource matter more than breadth.
3. **Durable and self-contained.** Materials are downloadable, offline-capable and static; they outlast any single delivery and any host.
4. **Public but not performative.** Pages are indexable and must read well to a general NT audience, yet discoverability and marketing are incidental. Blurb and social hooks exist only to answer "send us a blurb".
5. **Honest and NT-grounded.** Real Australian examples, plain language, no invented citations or statistics, CDU credit present but de-emphasised on public pages.

## Accessibility & Inclusion

Built for regional and remote NT delivery: beginner-friendly, plain language, no tech background assumed. Materials work offline and independently of the website, which matters where connectivity is unreliable. The courses themselves teach the Microsoft Accessibility Checker. No formal conformance standard (for example a specific WCAG level) has been set as a binding requirement; the delivery constraints above are the established, known need. Confirm a target standard here if one is later adopted.
