# tools/build-index.js

Generates `search-index.json` (the data behind site search, the homepage rail and `/index/`) and `sitemap.xml`.

GitHub Pages has no build step, so both outputs are checked-in artefacts. Run the script by hand whenever pages are added, moved or renamed, then commit the regenerated files alongside the page changes.

## Running it

From the repo root:

```
node tools/build-index.js
```

No dependencies; Node's standard library only.

| Flag | What it does |
| --- | --- |
| `--sync` | Adds a stub to `tools/index-meta.json` for any page it has not seen before, with a derived topic and a blank date, ready for you to correct |
| `--dry-run` | Reports only; writes nothing |
| `--no-git-dates` | Skips the git lookup for published dates. Only useful outside a repo; it leaves most pages undated |

Any `published` date not set by hand in `index-meta.json` is filled from the file's first commit. That happens by default.

The usual run after adding pages:

```
node tools/build-index.js --sync
```

Every run prints a report: how many pages were indexed, how many are hidden, how many carry a date, the breakdown by type, and a list of pages with no date, since those cannot appear in the "recently published" rail.

## tools/index-meta.json

Everything the script cannot work out by reading a page lives here, keyed by URL. The script reads this file and never writes over what is in it, so hand-set values survive regeneration.

```json
"/cybersecurity/session-4-when-things-go-wrong.html": {
  "title": "When Something Goes Wrong: Reporting and Response",
  "topic": "Cyber security",
  "published": "2026-06-14"
}
```

Any of `title`, `section`, `type`, `topic`, `published` and `hidden` can be set. Only include the ones you want to override; anything absent is derived.

Use `title` when the page's own `<title>` is longer than you want in a search result. Use `type` for the pages that sit oddly in their folder, such as the plain-English glossaries inside course folders, which are Resources rather than Lessons.

## What the script derives

**Title** comes from `<title>`, split on the site's separators, with trailing site and section furniture dropped. "Session 5 · Wrap Up and AI Image Generation · Roper Gulf · NTell World Ink" becomes "Session 5, Wrap Up and AI Image Generation". Em-dashes and en-dashes in titles become commas, matching the house rule.

**Section and type** come from the path, using the `RULES` table near the top of the script. Each rule can give a folder's own hub page a different section and type from the pages inside it, which is how `/excel/` reads as a Course while `/excel/session-1-...` reads as a Lesson.

**Topic** falls back to a per-folder default from the same table when `index-meta.json` is silent. The defaults are a starting point, not a judgement; correct them in `index-meta.json`.

**Hidden** is true when a page carries a `noindex` meta tag, or sits under one of the paths in `HIDDEN_PREFIXES`. Hidden pages appear in site search, marked, and stay out of `sitemap.xml`.

## Two settings worth knowing about

Both are constants at the top of the script.

`INCLUDE_SECTION_HUBS` is on. Hub pages such as `/simulations/` and `/presentations/` are indexed, so someone searching "simulations" reaches the catalogue rather than only individual tools.

`INCLUDE_HOMEPAGE` is off. The front page is not indexed; the banner logo already goes home, and it groups awkwardly under Resources on `/index/`.

`INCLUDE_DESCRIPTION` is also off. Turning it on adds each page's meta description to its entry, which would make search match on description text too; the search code would need its match string extended to use it.

## What is excluded

- `_to_delete/`, the duplicate copy of the site kept for screenshot rendering
- `digitalliteracy/`, the legacy Tennant Creek path that duplicates `digital-literacy/`
- `*-original.html`, the superseded Roper Gulf drafts
- the two redirect stubs, `/resources/websites-and-tools.html` and `/resources/articles-and-papers.html`
- `/client-access/`, the noindex course-access hub reached from the homepage artwork

All of these are named in `SKIP_DIRS`, `SKIP_URLS` and `SKIP_PATTERNS` near the top of the script.

## Client areas

Pages under `/cdu-ai-staff/`, `/cdu-teaching-staff/`, `/alice-springs-arn/` and `/roper-gulf/` are marked `hidden` in the index, appear in the site's own search with a "hidden" pill, and are kept out of `sitemap.xml`. The explicit path rule remains in place even where pages carry `noindex`, so a missing page-level tag cannot expose a client area in the sitemap.

A page is hidden when it carries a `noindex` meta tag, or when it sits under a path in `HIDDEN_PREFIXES`. A new client area needs its prefix added there as well as `noindex` on its pages.

`robots.txt` disallows `/search-index.json`, since that file lists client-area titles and URLs. This does not affect the site's own search; robots.txt governs crawlers, not browsers.


# tools/add-meta.js

Writes the social preview tags and the icon links into every page's `<head>`.

```
node tools/add-meta.js            apply
node tools/add-meta.js --dry-run  report only
```

Each page gets Open Graph and Twitter card tags, a canonical URL, the three icon links and a theme colour, wrapped in a marked block:

```
<!-- social: generated by tools/add-meta.js; edit the script, not this -->
...
<!-- /social -->
```

Re-running replaces that block rather than adding a second one, so titles and descriptions stay in step with the pages. Run it after `build-index.js`, because it takes each page's title from `search-index.json` where the page is listed; that way a title shortened in `index-meta.json` is the one that appears when the link is shared. Pages the index does not list fall back to their own `<title>`.

The description comes from the page's own `<meta name="description">`. A page without one gets the site default, and the run reports every page that fell back, so the gaps are easy to find.

The two redirect stubs under `/resources/` are skipped, because they carry their own canonical pointing at the page they redirect to and a second, self-referring one would fight it. A stub that already picked up a block has it taken back out.

## The files it points at

| File | What it is |
| --- | --- |
| `assets/brand/ntwi-social-card.png` | The 1200 by 630 card every page shares |
| `favicon.svg` | The site mark, matching `.brand-mark` in `styles.css`, with slightly heavier strokes so it holds at 16 pixels |
| `favicon-32.png` | PNG fallback for browsers that will not take an SVG icon |
| `apple-touch-icon.png` | 180 by 180, on a solid dark ground, since iOS does not handle transparency here |

Every page shares one card. Per-section cards would mean one image per section and a change to `CARD` in the script; nothing else in the pipeline would need to move.
