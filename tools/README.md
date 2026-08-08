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
| `--dates-from-git` | Fills in any missing `published` date from the file's first commit |
| `--dry-run` | Reports only; writes nothing |

The usual run after adding pages:

```
node tools/build-index.js --sync --dates-from-git
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

All of these are named in `SKIP_DIRS`, `SKIP_URLS` and `SKIP_PATTERNS` near the top of the script.

## One thing to decide

No page under `/roper-gulf/` carries a `noindex` meta tag, unlike `/cdu-ai-staff/` and `/alice-springs-arn/`, which all do. The script keeps Roper Gulf out of `sitemap.xml` through the `HIDDEN_PREFIXES` path rule, but a path rule in this repo does not stop a search engine indexing a page it finds by other means. Adding `<meta name="robots" content="noindex,nofollow">` to the five session pages, the hub and the MFA page would bring them in line with the other two client areas. Worth a decision either way.
