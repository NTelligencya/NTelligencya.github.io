# Handoff: ntworldink.com artwork treatment, site-wide

## Overview

`ntworldink.com` is a static, hand-authored teaching site (AI literacy, cyber security, Microsoft Office, workplace digital skills) run by Sally Darwin under Charles Darwin University TAFE ICT, Cyber Security & Digital. It is dark-themed, serif-headed, and deliberately plain.

The site already had a strong illustrated brand — near-black circuit-board plates with teal traces, an ornate NT compass monogram, keyboards, padlocks and a mouse holding a lit bulb — but it was only ever used as a single banner image on the homepage. Every other page was flat black. The result was that all pages, and all presentation decks, looked identical and generic.

**This handoff applies that artwork across the site as a system.** Nine page types are mocked. It also removes marketing-register copy that had crept in, and eliminates a set of stray accent colours (glowing orange, bright green, red) in favour of teal as the only colour.

## About the design files

The files in this bundle are **design references created in HTML**. `site-mock.html` is a prototype showing intended look and behaviour — it is a single flat file with repeated CSS and a screen switcher that does not exist in the real product. **It is not production code to copy.**

The task is to **recreate these designs in the live site's existing environment**. That environment is:

- Static HTML per page, hand-authored, no build step, no framework.
- One shared stylesheet plus per-page `<style>` blocks.
- Hosted on GitHub Pages from `NTelligencya.github.io`.
- Source: the `ntworldink-LIVE/NTelligencya.github.io/` folder (attached to the design project; not included here).

So the implementation is plain HTML and CSS, matching the conventions already in those files. The React sources in `artwork-treatments.md` are included as **precise specifications** of each treatment — its exact gradients, ratios and rules — not as code to install. Read them, then write the CSS equivalent.

## Fidelity

**High fidelity.** Colours, typography, spacing, gradients and ratios are final and should be reproduced exactly. Every numeric value in this document is lifted from the mock, not rounded.

Two deliberate exceptions:
- The screen switcher at the bottom right of `site-mock.html` is scaffolding. Discard it.
- Page copy is verbatim from the live site *except* where noted under "Copy changes" below. Where the mock and the live site disagree on copy, the mock is the intended state.

## The artwork system

This is the substance of the handoff. Everything else follows from it.

### The plates are compositions, not photographs

Each file in `assets/artwork/` is a finished illustration **with its own frame**, and that frame runs to all four edges: corner brackets, the NT compass monogram, a `CTRL / ALT / DEL / UNDO` key block, a `DATA` table, a `DATA / IDEAS / STORIES / STRATEGY` list, and in several cases the ornate `NTELL WORLD INK` wordmark and a tagline.

Consequences, all learned the hard way during the design:

1. **Cropping a plate destroys the frame.** A square plate cut to 16:9 or 2:1 loses the brackets, the tagline and usually the monogram.
2. **`object-position` cannot rescue a wordmark.** `hero-motherboard-chip` carries the wordmark at its left edge and `hero-keyboard-closeup` at its right. In a wide cover crop there is not enough horizontal slack to clear either; shifting the crop just moves which letters get sliced.
3. **Type must never land on the plate's own type.** Any zone carrying page copy needs a scrim fading the plate to the ground colour beneath it.
4. **One wordmark per page.** A wordmark hero plus a wordmark footer is one too many.
5. **Plates behind body text are wrong.** Long reading gets flat `--bg`. Artwork belongs in heroes, dividers, thumbnails, footers and list markers.
6. **Two or three plates per page is the ceiling.** Beyond that it reads as wallpaper.

### The five (six) treatments

Each is specified in `artwork-treatments.md` — usage notes, props contract and a reference implementation per treatment. Read it; it carries the exact values.

| Treatment | Use | Key mechanic |
|---|---|---|
| `PlateBandHero` | Home, Resources, Index, Excel, Workshops | Plate **uncropped at its own aspect ratio**, headline on flat ground below |
| Plate masthead | Presentations, Course, Flashcards, Client area | Plate cropped behind the masthead at **0.42 opacity** under a left-to-right scrim, type over it |
| `PlateBand` | Section divider | Thin strip, plate screened to 0.55, left-to-right scrim |
| `ArtworkCard` | Catalogue grids | Fixed 2:1 thumbnail slot above the card body |
| `PlateFootBand` | Page footer | Plate shown whole; its ratio sets the depth |
| `PlateInset` | List row marker | 96px 1:1 crop, rounded, diagonal scrim |
| `PlateHero` | **not used in the mock** | Full-bleed cover crop, vertical scrim, right edge faded |

**Two notes on that table.** `PlateHero` exists as a component and is fully specified, but no screen in the mock uses it — the full-bleed treatment was tried on the homepage and rejected in favour of the uncropped band, which matches the live site. Treat it as available, not as required.

**The plate masthead is the one treatment with no component**, because it is the existing `PageMasthead` with a plate layer added behind it. Its exact values, which the mock uses on four screens:

```css
.masthead-art img { width:100%; height:100%; object-fit:cover; object-position:78% 50%; opacity:0.42 }
.masthead-art::after { background: linear-gradient(to right,
  var(--bg) 0%, rgba(10,10,12,0.95) 32%, rgba(10,10,12,0.6) 68%, rgba(10,10,12,0.8) 100%) }
```

0.42 is doing real work: above about 0.55 the plate starts competing with the headline, and below 0.3 it is not worth loading the image.

`PlateBandHero` is the workhorse and the safest. Because the plate is uncropped, it is the only hero treatment that can carry a wordmark plate without slicing it. **Read each plate's true pixel ratio off the file and pass it in; never guess it.** A wrong ratio silently reintroduces the crop this treatment exists to avoid. Known ratios: `banner-wordmark-keyboard` 3232/490, `footer-wordmark-url` 3386/504, `banner-mouse-lightbulb-keyboard` 1984/382, `footer-keyboard-data-monogram` 3412/390, `banner-wordmark-usb` 2040/330.

### Two crop sets

- `assets/artwork/*` — the full-size plates as supplied. Use these anywhere the plate is shown whole or cropped 1:1 (`PlateBandHero`, `PlateFootBand`, `PlateInset`, and `ArtworkCard` in its fitted variant).
- `assets/artwork/cards/*` — pre-cut 2:1 versions for `ArtworkCard`. Cut centred, at the largest 2:1 size each source supports; nothing is upscaled, so several are below 1600 × 800.

**The fitted card variant.** Only two wordmark-free plates in the library are near 2:1 (`hero-padlock-circuit` 1.91, `banner-laptop-spreadsheet` 2.36), which is not enough to fill a seven-card grid. Square, portrait and very wide plates therefore get `object-fit: contain` on `--bg` inside the same 2:1 slot — shown whole, letterboxed, reading as a mounted plate. In the mock this is the `.card-art.fit` class. Card heights are unchanged either way.

### Plate assignments per page

Fixed by the client during design. **Repetition across pages is acceptable where the plate fits the subject** — the two spreadsheet plates serve both Excel and Power BI by intent.

| Page | Hero treatment | Hero plate | Divider | Footer |
|---|---|---|---|---|
| Home | band | `banner-wordmark-keyboard` | `banner-mouse-lightbulb-keyboard` | `footer-mouse-lightbulb-monogram` |
| Presentations | masthead | `hero-motherboard-chip` | — | `banner-mouse-lightbulb-keyboard` |
| Course session | masthead | `hero-padlock-wordmark` | — | `banner-wordmark-usb` |
| Flashcards | masthead | `hero-keyboard-closeup` | — | `footer-keyboard-data-monogram` |
| Resources | band | `banner-mouse-lightbulb-keyboard` | — | `footer-mouse-lightbulb-monogram` |
| Index | band | `banner-wordmark-usb` | — | `footer-data-table-monogram` |
| Excel / Power BI | band | `banner-laptop-spreadsheet` | `footer-keyboard-data-monogram` strip, then `banner-laptop-monogram` | `footer-keyboard-data-monogram` |
| Workshops | band | `banner-mouse-lightbulb-keyboard` | — | `footer-keyboard-data-monogram` |
| Client area | masthead | `hero-portrait-keyboard` | — | `footer-mouse-lightbulb-monogram` |

`hero-motherboard-chip` and `hero-keyboard-closeup` both carry the ornate wordmark at an edge, which is why they appear only in the masthead treatment: at 0.42 opacity under a scrim, a sliced wordmark does not read as a defect. Do not move either of them into a band or a full-bleed hero.

Footer plates want to be **3.5:1 or wider**. `footer-monogram-chip` at 2.7:1 exceeds the 230px depth cap at full width and letterboxes with bars either side.

## Screens

`site-mock.html` holds nine screens as sibling `<section>`/`<div class="screen">` elements, switched by the control at bottom right. Each corresponds to one live URL.

### 1. Home — `/`
**Purpose:** entry point; search, then the workshop and course listings.
**Layout:** `PlateBandHero` with `banner-wordmark-keyboard` at 3232/490, uncropped, its foot fading into the ground. Below it on flat black: search field (max-width 480px), the standing site description, two buttons. Then a workshops card grid (2 columns, 16px gap), a `PlateBand` divider carrying `banner-mouse-lightbulb-keyboard`, and the course accordion.
**Note:** the live homepage has **no `h1`**. It opens with the banner, the search field, the standing description and two buttons. Keep that restraint; do not add a headline.

### 2. Presentations — `/presentations/`
Plate masthead with `hero-motherboard-chip` at 0.42. Breadcrumb, eyebrow, `h1` "Presentations", one-line standfirst. Then a 2-column `ArtworkCard` grid, one card per deck, each with a different plate.

### 3. Course session page — `/cyber/session-3/` (representative)
`hero-padlock-wordmark` behind the masthead at 0.42 opacity, cropped right (`object-position: 78% 50%`) so type sits on near-black. Breadcrumb, eyebrow, `h1`, standfirst, mono meta row, download buttons. Body is a 2-column split: `minmax(0, 1fr)` and a 320px sticky rail, 52px gap. **Flat black behind the body text.**

### 4. Flashcards — `/flashcards/` (screen id `s-cards`)
Plate masthead with `hero-keyboard-closeup` at 0.42. Then set rows, each a `96px 1fr` grid with a `PlateInset` marker. This is the most forgiving artwork slot: at 96px even the smallest plate has ample resolution, and a 1:1 crop lands on the interesting middle of the composition.

### 5. Resources — `/resources/`
`banner-mouse-lightbulb-keyboard` uncropped. Three category cards in one row, 920px container.

### 6. Index — `/index/`
Deliberately the most restrained page: a thin `banner-wordmark-usb` band, `h1` "Everything on this site", then ruled lists with paths set in mono at the right. A 168-row index does not want artwork behind it.

### 7. Excel — `/excel/` (and Power BI, same treatment)
`banner-laptop-spreadsheet` hero — the best fit in the library, since the plate's own spreadsheet is the page's subject. Series label, four meta items, back strip, then `footer-keyboard-data-monogram` as a thin ruled strip at 0.8 (replacing what was a jump nav), overview with the Ctrl+Z pull-quote, four session rows, three resource cards, `banner-laptop-monogram` divider.
**Three plates on this page is the ceiling.** If it reads heavy, drop the mid-page `banner-laptop-monogram` divider first.

### 8. Workshops — `/workshops/`
Seven workshop cards. **This page does not exist on the live site** — `/workshops/` has seven subfolders and no `index.html`, so the workshops are currently only reachable from the homepage. This is therefore a new page, not a restyle. Confirm it is wanted before building it.

### 9. Client area — Roper Gulf (representative)
Verbatim from the live page: masthead, Acknowledgement of Country, "How the course runs" with the practice-tools callout, five sessions with three bullets each, and the homework-week interlude between sessions 2 and 3. Artwork is deliberately minimal: `hero-portrait-keyboard` at 0.42 behind the masthead, and a footer plate. Nothing else. **A page carrying an Acknowledgement of Country should not have artwork competing with it.**

## Interactions & behaviour

The site is static; interaction is minimal by design.

- **Card hover:** border `--rule-2` → `--accent-line-25`. `transition: border-color 0.2s ease`. No lift, no shadow, no scale.
- **Accordion / list row hover:** `transform: translateX(12px)`, `transition: transform 0.2s ease`. Distinctive to this site; keep it.
- **Primary button hover:** background `--accent` → `--accent-2`, `transform: translateY(-1px)`.
- **Ghost button hover:** border `--rule-2` → `--text-2`, background `rgba(255,255,255,0.04)`.
- **Download button hover:** background to `rgba(26,201,201,0.1)`, border to `--accent`, text to `--accent`.
- **Sticky rail:** `position: sticky; top: 32px` on the course page only.
- **No entrance animations, no parallax, no scroll-triggered reveals** anywhere on the site.
- **Responsive:** single breakpoint at `max-width: 900px` — grids collapse to one column, the split becomes one column, the nav hides. The plates all use `object-fit`, so they degrade without extra rules.

## State management

None. Static pages. The only stateful thing in the mock is the screen switcher, which is scaffolding and should be discarded.

## Design tokens

Full set in `tokens/` (8 files, 152 tokens), entry point `styles.css`. The values used by these screens:

**Surfaces** — `--bg: #0a0a0c` · `--bg-2: #111114` · `--bg-3: #17171b`
**Text** — `--text: #f5f5f7` · `--text-2: #9b9ba0` · `--text-3: #6b6b70`
**Accent (the only colour)** — `--accent: #1ac9c9` · `--accent-2: #4ddcdc` · `--accent-deep: #0b5555`
**Rules** — `--rule: #1f1f23` · `--rule-2: #2a2a30`
**Teal washes and lines** — `--accent-wash-4/8/12: rgba(26,201,201,0.04/0.08/0.12)` · `--accent-line-25/35/40: rgba(26,201,201,0.25/0.35/0.4)`
**Radii** — `--radius-lg: 8px` (download buttons) · `--radius-xl: 10px` (buttons, strips, search) · `--radius-2xl: 12px` (cards, callouts, rails) · `--radius-3xl: 14px` · `--radius-pill: 100px`
**Type** — `--font-display: 'Cormorant Garamond', Georgia, serif` · `--font-body: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` · `--font-mono: 'JetBrains Mono', ui-monospace, monospace`

Headings are `--font-display` at weight **300**, `line-height: 1.06`, `letter-spacing: 0.01em`. Mono is used for eyebrows, meta rows, breadcrumbs, tags and the legal line — always uppercase, `letter-spacing: 0.14em`–`0.2em`, sizes 9–11px.

**Scrim gradients**, reproduced exactly:
- Hero vertical: `linear-gradient(to bottom, rgba(10,10,12,0.72) 0%, rgba(10,10,12,0.5) 34%, rgba(10,10,12,0.78) 72%, var(--bg) 100%)`
- Hero right edge (22% wide): `linear-gradient(to left, var(--bg) 0%, rgba(10,10,12,0.86) 34%, rgba(10,10,12,0) 100%)`
- Band horizontal: `linear-gradient(to right, var(--bg) 0%, rgba(10,10,12,0.92) 18%, rgba(10,10,12,0.3) 40%, rgba(10,10,12,0.55) 100%)`
- Card thumbnail: `linear-gradient(to bottom, rgba(10,10,12,0.1), rgba(10,10,12,0.72))`
- Inset diagonal: `linear-gradient(160deg, rgba(10,10,12,0), rgba(10,10,12,0.55))`

**Removed colours.** Glowing orange (`#E08A3C`), red (`#E05B4A`) and bright green (`#4CC98A`) were in use across the presentation decks and have been eliminated. If they appear anywhere in the codebase, they are legacy. Where a semantic colour is genuinely needed, three muted replacements exist: steel blue `#4B85A9`, pale mint `#BEEBD5`, sage `#8DB091`. **None of them reads as a warning**, which is a known and accepted limitation — the words carry the meaning.

## Copy changes

The client asked for marketing register to be removed site-wide. Five categories to cut on sight:

1. **Price and access claims** — "free", "no paywall", "no sign-ups", "yours to keep".
2. **Effort minimisation** — "takes about twenty minutes", "nothing to install".
3. **Self-praise about the teaching** — "learning that sticks", "one hour, one idea".
4. **Reassurance about quality** — "nothing is listed that has not been vetted".
5. **Explaining the site's own cleverness** — "they stay out of search engines, but not out of your own index".

Three specific taglines are **retired** and must not reappear: "connect, create, leave a mark" · "learning that sticks" · "intelligence inked, legacies written" as page copy. The last one is still drawn into some artwork plates, which is acceptable — it is part of the illustration, not page copy.

**Carve-out:** factual entry requirements stay. "No experience needed" and "works offline" on the Excel meta row are true statements of fact taken verbatim from the live page, not pitches.

## Assets

`assets/artwork/` — 23 plates, being the subset the mock references, copied byte-for-byte from the client's own supplied files. Nothing is drawn, generated or approximated. The full library is 19 supplied plates plus derived crops; the design project holds all of it.

Native sizes range from 690 × 690 to 3412 × 390. **Several are below 1600px wide** and will go soft used full-bleed on a large display — `banner-wordmark-usb` (660px effective), `footer-monogram-chip` (636px) and `footer-mouse-lightbulb-monogram` (648px) are the weakest. Higher-resolution re-exports would help; the client is aware and intends to supply more artwork.

Logos, icons and brand cuts are **not** in this bundle. They are unchanged from the live site — use what is already there.

## Files

| Path | What it is |
|---|---|
| `site-mock.html` | The nine screens. Open in a browser. Switcher at bottom right. |
| `styles.css` | Design system entry point — `@import` list only. |
| `tokens/*.css` | 8 files, 152 tokens. The real values. |
| `artwork-treatments.md` | The six treatments: usage notes, props contracts and reference implementations. **Read this.** |
| `assets/artwork/*` | Full-size plates. |
| `assets/artwork/cards/*` | Pre-cut 2:1 thumbnails. |

Not included, but referenced: the live site source (`ntworldink-LIVE/NTelligencya.github.io/`) and the full design system (readme with content fundamentals, visual foundations, iconography; 33 components; deck templates).

## Where to start

1. Open `site-mock.html` and click through all nine screens.
2. Read `artwork-treatments.md`. It is short and it carries the reasoning behind each treatment.
3. Implement `PlateBandHero` first. It is the treatment most pages need, and the one whose failure mode (a guessed ratio) is silent.
4. Build one page end to end — Presentations is the simplest — and get it reviewed before doing the rest.
