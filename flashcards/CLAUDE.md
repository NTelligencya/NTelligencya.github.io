# CLAUDE.md, /flashcards/

Built 8 August 2026 from the `design_handoff_flashcards` bundle. Terminology sets that can be drilled as flashcards or read as a searchable glossary.

Three page types:

- `/flashcards/`, the set catalogue
- `/flashcards/<slug>/`, the study player, one per set
- `/flashcards/<slug>/list/`, the same set as an A-to-Z glossary

The list view is not an optional extra. Nobody drills 248 ISM terms end to end, but people look one up mid-audit; and the list view is the only one a search engine can index, since the player renders one card at a time from JSON.

## The house-rule exception

Like `/references/` and `/index/`, this section is a deliberate exception to the "no page-level CSS or JS" rule: it needs live filtering, card state and progress. It is built the same way: shared `styles.css` for the chrome, one page CSS file (`flashcards.css`), one page JS file (`flashcards.js`). Every value in the CSS comes from the `styles.css` design tokens. Do not "fix" this to match the static card rules.

Everything else on the site still applies: Australian English, no em-dashes, no emoji, indexable, last-updated line above the footer, the small CDU copyright footer.

## Files

```
flashcards/
  index.html            the catalogue
  flashcards.css        page styles
  flashcards.js         catalogue, player and list logic in one file
  convert.js            CSV to JSON, run by hand
  <slug>/index.html     the player
  <slug>/list/index.html the glossary view
  sets/
    sets.json           the manifest, and the only place set metadata lives
    <slug>.csv          the editable original
    <slug>.json         generated; what the pages fetch
```

The pages find their own behaviour from two attributes on `<body>`: `data-fc="catalogue|player|list"` and `data-slug="<slug>"`.

## Adding or editing a set

SD authors in CSV, because that is what NotebookLM, Excel and Anki produce. The site reads JSON, because a browser fetches it without a parser and it survives commas, quotes and line breaks inside definitions. GitHub Pages has no build step, so both files are committed.

- Add the set's metadata to `sets/sets.json`: `slug`, `title`, `subject`, `level`, `entryKind`, `source`, `licence`, `blurb`. Leave `count` and `ready` alone; the converter writes them.
- Put `sets/<slug>.csv` beside it, with a `Front,Back` header row.
- Run `node flashcards/convert.js` from the repo root. It writes `sets/<slug>.json`, sets the card count, and marks the set `ready`.
- Run `node flashcards/gen-pages.js` to write the player and list pages for every ready set.
- Run `node tools/build-index.js --sync` and `node tools/add-search.js`, then commit the regenerated `search-index.json` and `sitemap.xml`. See the Findability section of the root `CLAUDE.md`.

`convert.js` normalises US spellings and em-dashes to the site's Australian English rule. Extend its `SPELLING` table as more turn up; it is the cheapest place to catch them. Capitalised `-ization` forms are deliberately absent from that table: the ISM's own proper nouns, "International Organization for Standardization" and "Route Origin Authorization", must be reproduced as published.

`ready: false` keeps a set in the manifest but out of the catalogue, so a set can be planned before its data exists. One is waiting that way: `networking`, which needs a content decision from SD about which terms belong. The `tech-words` and `excel-words` sets were dropped from the manifest on 8 August 2026 at SD's decision; the two plain-English glossary pages they would have drawn on stay as they are.

## Set metadata

`entryKind` is the label printed under each term in the list view ("term", "abbreviation"); leave it `null` for a set whose fronts are a mix of terms and questions, and no label is drawn.

`source` and `licence` drive the attribution line at the top of the list view. That line is the only place attribution appears, so it is not optional for third-party material. It is omitted when both are null.

`level` is one of `Foundation`, `Intermediate`, `Advanced`, and is editorial, not computed.

## The study algorithm

Deliberately simple; there is no spaced repetition, which would need accounts.

- **Got it** adds the card to `got`; the deck is the base order filtered to exclude `got`, so cleared cards drop out immediately.
- **Again** does not clear the card. It splices it back roughly three live positions ahead, so it returns before the round ends, and records it in `lapses`.
- `again` is the live "to repeat" count and clears when the card is finally got. `lapses` is cumulative and never clears, and drives the end-of-round summary. They must stay separate; with one array the summary could never report a fumbled round, because finishing means everything is in `got`.
- SD's decision, 8 August 2026: no round splitting. Each set is one deck however long it is, and progress is kept, so a long set can be left and resumed.
- Both answers move to the next card, so the hint under the card changes after the flip to "Pick one to go to the next card", and the buttons read "Again later" and "Got it", each with a forward arrow. SD tested the first wording and could not tell how to advance; do not quietly revert it to a bare "Again".

Progress lives in `localStorage` under the single key `ntwi.flashcards`, as `{slug: {got, lapses, n}}`. `n` is the card count at the time it was saved; if a set is re-converted and the count changes, the stored indices no longer mean anything and the progress is discarded rather than misapplied.

## Sources

`sets/ism-abbreviations.csv` and `sets/ism-terminology.csv` were extracted from the Australian Signals Directorate's Information Security Manual cyber security terminology, June 2026 (the PDF in the handoff bundle), with a layout-aware parse of the two glossary tables. Commonwealth material under CC BY 4.0, so it can be republished with attribution; the attribution line on each list view is that attribution.

`sets/microsoft-security.csv` is SD's NotebookLM export, unchanged apart from the converter's spelling pass.
