# ntworld.ink brand assets

Added 8 August 2026. The ornate NT concept, cut into usable files.

## What this is for

This is the **cover mark**. It goes at the top of a printed deck, on a social card, on the first slide of a workshop, on a title page. Anywhere it can be at least about 120 pixels across and have some room around it.

It is **not** the site mark. The site header and the favicon use the CSS star in `styles.css` (`.brand-mark`), two rounded squares with one rotated 45 degrees. That mark is drawn in CSS, weighs nothing, and stays legible at 16 pixels. Do not swap it for these files; below about 120 pixels the compass framing collapses into a smudge and the monogram disappears.

## The files

| File | Use it for |
| --- | --- |
| `ntwi-logo-concept-sheet.png` | The master reference as supplied. Keep it; do not use it directly. |
| `ntwi-logo-lockup-on-black.png` | Symbol and wordmark together, on the original dark ground. Simplest option when the background is already near-black. |
| `ntwi-logo-lockup-transparent.png` | Same lockup with the background removed. For any dark or mid-tone background. |
| `ntwi-logo-lockup-for-light.png` | The light-background version: the wordmark recoloured to near-black ink, the teal brought down so it holds on white or cream. |
| `ntwi-logo-symbol-on-black.png` | The monogram alone, on the original dark ground. |
| `ntwi-logo-symbol-transparent.png` | The monogram alone, background removed, for dark and mid-tone grounds. |
| `ntwi-logo-symbol-for-light.png` | The monogram alone, for white and cream. |
| `ntwi-logo-tile-on-black.png` | The rounded app-icon tile from the concept sheet. Reference only; see the note on the favicon above. |
| `ntwi-logo-tile-transparent.png` | The same tile with the background removed. |

The transparent versions were cut by keying on the background, which on the concept sheet tops out at about 16 per cent brightness. Everything below that threshold went; the paper grain in the letterforms survived, because it is brighter than the ground.

## Minimum sizes

- Lockup: 320 px wide on screen, 45 mm in print. Below that the wordmark's hairlines break up.
- Symbol alone: 120 px on screen, 20 mm in print.
- Never below 120 px. Use the CSS star instead.

## Clear space

Leave at least the height of the N on all four sides. The compass points already sit close to the edge of the artwork, so the files carry only a 12 px margin of their own.

## The resolution problem

These are cut from a 1448 by 1086 raster, which is the only version available. The symbol is about 310 pixels across at full size. That is fine on screen and fine in print up to roughly 25 mm at 300 dpi, and it will not go further; enlarging it past that will show the pixels, and no amount of resampling adds detail that is not there.

If this mark is going on anything printed larger than a business card, ask whoever drew it for the vector source, or for a master at 4000 pixels or more. Worth doing once rather than working around it every time.

## Colours

Teal `#1ac9c9`, with the lighter `#4ddcdc` in the finer strokes; the same pair as `--accent` and `--accent-2` in `styles.css`. The wordmark is off-white with a paper texture through it. The light-background cut puts the wordmark at `#1a1a1e` and takes the teal down to about two thirds value so it stays readable on white.

## Accessibility

The finest strokes in the compass framing sit below the WCAG contrast floor against black. That is acceptable for a decorative mark, which carries no information, but it means the mark must never be the only way something is labelled. Anywhere it stands in for the site's name, put "ntworld.ink" in text nearby or in the alt text.
