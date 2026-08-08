# tools/social-card/

Source for `assets/brand/ntwi-social-card.png`, the 1200 by 630 image every page uses as its link preview.

The card is an HTML page rendered to a PNG rather than an image file to be retouched. Change the wording or the layout in `social-card.html`, render it again, and overwrite the PNG; the meta tags never need to change, because the path stays the same.

## Rendering it

The reliable way, if you have Node and Playwright to hand:

```
npx playwright screenshot --viewport-size=1200,630 \
  tools/social-card/social-card.html \
  assets/brand/ntwi-social-card.png
```

By hand, if you would rather: open `social-card.html` in Chrome, open developer tools, set the device toolbar to 1200 by 630, and use "Capture screenshot" from the command menu. Check the result is exactly 1200 by 630 before committing it, since the tags declare those dimensions.

The page pulls Manrope and JetBrains Mono from Google Fonts, so render it with a network connection or the type falls back and the spacing shifts.

## What it must keep

- Exactly 1200 by 630. `tools/add-meta.js` declares those dimensions in `og:image:width` and `og:image:height`, and a mismatch makes some platforms crop or reject the card.
- Under about 1MB. Well within every platform's limit, and the current file is around 270KB.
- The wordmark legible at roughly a fifth of full size. Link previews in chat apps are small, and a card that only works at full size reads as a smudge where it actually appears. Check any change at thumbnail size before committing it.
- Nothing important within about 40 pixels of the edge. Some platforms crop to a squarer ratio.

## After changing it

Platforms cache link previews, so an updated card does not appear straight away on a URL that has already been shared. Force a re-scrape with the platform's own tool: Facebook and Instagram use the Sharing Debugger, LinkedIn uses Post Inspector. For chat apps that offer no tool, sharing the URL with a query string on the end, such as `?v=2`, fetches it fresh and is a quick way to confirm the new card is live.

## Per-section cards

One card serves the whole site. If sections ever want their own, add an image per section and change `CARD` in `tools/add-meta.js` to pick one by URL prefix. Nothing else in the pipeline would need to move.
