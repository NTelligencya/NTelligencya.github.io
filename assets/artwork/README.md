# assets/artwork/

The illustrated plates: near-black circuit-board compositions with teal traces, the
ornate NT compass monogram, keyboards, padlocks, a USB drive, an envelope on a
phishing hook, a tiled QR code, a glass cloud and a mouse holding a lit bulb. Applied across the site as a system on 10 August 2026, from the
`design_handoff_site_artwork/` bundle. The treatments live in `styles.css`
section 25; the rollout script is `tools/add-artwork.js`.

## What is in here

| Path | What it is |
|---|---|
| `*.webp`, `*.jpg` | The 28 plates, right-sized for the web. WebP is what the pages request; the JPEG is the `<picture>` fallback. |
| `cards/` | 15 pre-cut 2:1 thumbnails for the card grids, same two formats. |
| `_originals/` | The plates as supplied, untouched, plus the source PNGs for the card cuts. Jekyll skips underscore-prefixed folders, so these stay in the repo without being published. |

Sizes: banner and footer plates are capped at 2400px wide, hero plates at 1600px,
card cuts at 1400px, and nothing is upscaled. A 2.5MB source PNG lands at roughly
80KB of WebP, which matters on a site served from GitHub Pages.

## The rule that catches people out

**Each plate is a finished composition with its own frame**, and that frame runs to
all four edges: corner brackets, the monogram, a `CTRL / ALT / DEL / UNDO` key
block, a `DATA` table, a `DATA / IDEAS / STORIES / STRATEGY` list, and on several
plates the ornate `NTELL WORLD INK` wordmark. Cropping a plate destroys that frame,
and `object-position` cannot rescue a wordmark that sits hard against an edge.

So: the band, the strip, the footer and the inset never crop. The masthead and the
card slot do crop, and only plates that survive it belong there.

Five plates carry the ornate wordmark where a 2:1 card crop slices it:
`hero-motherboard-chip`, `hero-motherboard-chip1`, `hero-padlock-wordmark`,
`hero-wordmark-keyboard-usb` and `hero-portrait-chip-wordmark`. Two of them,
`hero-padlock-wordmark` and `hero-wordmark-keyboard-usb`, happen to keep the
wordmark whole in their cut; `hero-motherboard-chip1` was re-cut right-aligned to
clear it; `hero-motherboard-chip` is shown whole with `.app-card-art fit` instead.

Three of the plates added on 14 August 2026 are too close to square for a 2:1 cut:
`hero-envelope-wordmark`, `hero-qr-mouse` and `hero-cloud-monogram` all lose the
`DATA` table or the monogram to the crop, so they have no `cards/` version and take
`.app-card-art fit` if they are ever wanted in a grid.

Three more rules from the handoff, worth keeping:

- One wordmark plate per page. A wordmark hero plus a wordmark footer is one too many.
- Two or three plates per page is the ceiling. Beyond that it reads as wallpaper.
- Long reading sits on flat `--bg`. Artwork belongs in heroes, dividers, thumbnails,
  footers and list markers, never behind body text.

## Adding a plate

Put the original in `_originals/`, then:

- add a `.r-<name>` ratio class to `styles.css` section 25.1, with the ratio read off
  the file rather than guessed; a wrong ratio silently reintroduces a crop
- write the `.webp` and `.jpg` at the sizes above
- if it will be used in a card grid, cut a centred 2:1 version into `cards/`, unless
  the plate is portrait or wider than about 4:1, in which case use `.fit` instead
- add its alt text to `ALT` in `tools/add-artwork.js` if it will be shown whole

## Changing which plate a page uses

Edit the `PLATES` table in `tools/add-artwork.js` and run `node tools/add-artwork.js`.
It is idempotent: a page that already carries a plate has it swapped in place rather
than wrapped a second time. The home page, the Excel course page and the card grids
are hand-authored, so they are not in that table.

## The plates added on 14 August 2026

Seven plates on two new motifs: an envelope hanging from a phishing hook, and a
QR code built from metal tiles. Both read as security and messaging subjects, so
they carry the phishing, email and machine-verification pages that had been
borrowing padlock and keyboard plates.

| Plate | Ratio | Where it went |
|---|---|---|
| `hero-envelope-mouse-wordmark` | 1780 / 975 | `/presentations/` masthead; `cards/` cut on *How Email Works* |
| `hero-envelope-wordmark` | 728 / 564 | `/agentic-web-dev/` masthead |
| `hero-envelope-connect` | 1827 / 895 | `/cybersecurity/` masthead |
| `footer-envelope-mouse-wordmark` | 2196 / 480 | `/ai-literacy/` and `/roper-gulf/` footers |
| `hero-qr-mouse-wordmark` | 1678 / 913 | `/flashcards/` masthead; `cards/` cut on *CAPTCHAs Explained* |
| `hero-qr-mouse` | 763 / 585 | `/alice-springs-arn/` masthead |
| `hero-cloud-monogram` | 685 / 592 | `/ai-literacy/` and `/cdu-ai-staff/` mastheads |

The point of the round was variety: `footer-mouse-lightbulb-monogram` had been
carrying seven sections and now carries five, and `hero-motherboard-chip`,
`hero-motherboard-chip1`, `hero-keyboard-closeup` and `hero-portrait-keyboard`
each dropped from two sections to one. `hero-padlock-circuit`, displaced from
`/cybersecurity/` by the phishing plate, moved to `/powerpoint/` rather than
falling out of rotation. Every masthead and band plate is now carried by a single
section except `hero-cloud-monogram` and `banner-laptop-spreadsheet`. The round
also cleared a rule breach on `/cdu-ai-staff/`, which had a wordmark masthead over
a wordmark footer.

`hero-envelope-connect` was cut as a band plate first and rejected. At 2.04:1 it
is too tall for `.plate-band`, whose 360px `lg` cap crops a full-width plate from
the top: on `/pandanus-reach/` it sliced the envelope and the `DATA` table. The
band is only uncropped for plates wider than about 3.5:1. It went to a masthead
instead, where the crop is a background at 0.42 opacity, and `/pandanus-reach/`
kept `banner-laptop-spreadsheet`.
