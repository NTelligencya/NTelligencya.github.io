# CLAUDE.md: /resources/ section

House rules and card format for the NT World Ink Resources section. Read this before adding, editing or reordering anything in this folder. SD adds roughly one resource per week and is particular about quality; when in doubt, ask before adding.

## What lives here

- `index.html`: the Resources hub; one card per category, unnumbered.
- `videos-and-podcasts.html`: talks, explainers, news reports, podcast episodes.
- `articles-and-papers.html`: RETIRED 27 July 2026 (outdated, to be rebuilt another day); now a redirect stub to `/resources/`, and its hub card has been removed. Original preserved in git 48a33e6.
- `websites-and-tools.html`: RETIRED 27 July 2026; now a redirect stub to the filterable References library at `/references/` (documented in the main `/CLAUDE.md`). Its curated resources were merged into that tool, and the hub's "Websites & Tools" card now points to `/references/`.
- `legislation-and-guidelines.html`: policy, frameworks and law; must keep its link to the presentation at `/presentations/australias-ai-laws-explained/`.
- `ai-benchmarks.html`: the benchmark catalogue (built 28 July 2026), grouped by capability area. Its cards carry a status flag in the category line (Watch / Watch, nearing saturation / Retired, historical) and a release paper link at the end of each annotation; the page's own template comment shows the variant. Scores and statuses date quickly; recheck against the linked leaderboards when editing.

## The resource card

Every resource is one plain commented HTML block; no JSON, no JavaScript rendering. Each category page has a copy-paste template in a comment block near the top of the file. The card is:

```html
<!-- RESOURCE: short name for finding it in the file -->
<div class="app-card app-card-wide">
  <div class="app-card-category">Source or author &middot; Date</div>
  <h3><a href="VETTED-LINK" target="_blank" rel="noopener">Resource title</a></h3>
  <p>One to two sentence annotation: what it is, and why it's worth someone's time.</p>
</div>
```

On `videos-and-podcasts.html` the card is the media variant: `app-card app-card-wide app-card-media`, with the text wrapped in `div.card-text` and a click-to-play YouTube thumbnail (`div.video-embed` &gt; `button.video-facade` calling `ytPlay(this,'VIDEO-ID')`, with the `i.ytimg.com/vi/VIDEO-ID/hqdefault.jpg` thumbnail image) to the right of the text. The page's template comment shows the full markup; the `ytPlay` function sits in a script tag at the foot of that page, and the `.app-card-media` layout lives in the shared `styles.css`. For an audio-only resource with no video, use the plain card without `div.video-embed`.

Card fields, all required:

- Title: the resource's own name, wrapped in its link. If no vetted link exists yet, leave the title unlinked and end the annotation with "No vetted public link yet; the title is searchable."
- Source or author: publisher, channel, organisation or author in the `app-card-category` line.
- Date: in the same line, after a `&middot;`. Use the most precise date known (year, or month and year). If the resource is a continuously updated site, "Ongoing" is fine. If no date can be established, write "Date unavailable"; never guess.
- Annotation: one to two sentences, factual and specific about why the resource earns its place. Measured language; no breathless adverbs.

## House rules

- Vetted links only. Never add a link SD has not approved or that has not been verified as live and correct. No invented citations, statistics or links. Keep full citations when a statistic is quoted.
- No sequential numbering of resources, sections or categories, in markup or headings. SD reorders items freely; a card must be movable by cutting and pasting its comment-plus-div block anywhere in any `app-grid`.
- Cards live inside a section's `<div class="app-grid">`. Sections are `<section class="content-section" id="...">` with an `h2`; new sections need their id added to the "Jump to" line in the page masthead.
- Australian English throughout (organisation, visualisation, licence). No em-dashes anywhere, including quoted or ported text; use a semicolon, comma or full stop instead. No emojis.
- Shared `styles.css` only; no page-level `<style>` blocks. The pages use existing site classes (`app-card`, `app-card-wide`, `app-grid`, `content-section`, `callout`, `last-updated`).
- Every page keeps its `last-updated` line above the footer. Update it (date format: 25 July 2026) whenever a resource is added, edited or removed.
- Footer carries the small CDU copyright line as on the site's index.html; do not remove or reword it.
- Pages are indexable; do not add noindex meta.
- No "Suggest a resource" contact callouts on these pages; SD removed them (25 July 2026). Do not re-add.

## Adding a resource, step by step

Identify the right category page and section. Copy the template block from the top of that file. Fill in source, date, title, link and annotation per the rules above. Paste it into the section's `app-grid` wherever it reads best (order is editorial, not chronological). Update the page's `last-updated` line. If the resource opens a genuinely new topic area, propose a new section to SD before creating one.
