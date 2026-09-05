# Section hero v3 review report

Branch: `homepage-section-heroes-v3`

Release boundary: local review only. `main` and the public site remain unchanged until visual approval.

## Page structure

- `/` — P3 keyboard hero, Main Menu search/navigation, existing illustrated footer.
- `/library/` — P4 processor hero, workshops, training games, presentations, and About.
- `/courses/` — P8 stone-QR hero and the complete expandable course list.
- `/simulations/` — P5 hooked-envelope hero followed by the existing simulation catalogue.
- `Main Menu` remains the current label. Changing it to `Login` is deferred until authentication is implemented.

## Verification

- Four routes contain one approved five-plane scene each; all 20 source and delivery layers retain the 1672 × 941 canvas.
- Desktop browser checks: 1920 × 1080 and 1280 × 720.
- Mobile browser checks: 430 × 932 and 390 × 844.
- All 16 page/viewport combinations reported `scrollWidth === innerWidth`.
- Library section links wrap on mobile and anchor headings remain visible below sticky navigation.
- All local links and asset references in the five affected public pages resolve to existing files.
- Main Menu, header, and discreet client links retain safe new-tab attributes.
- Reduced-motion CSS and JavaScript guards remain present.
- `/client-access/` remains `noindex,nofollow`, absent from search and sitemap; client pages remain hidden internal-search entries.
- Full index generation: 233 entries, 46 hidden client entries, 187 visible sitemap URLs.
- Browser request log showed every site page, scene layer, script, stylesheet, and card artwork used in review returning HTTP 200/304.

## Review pages

- `/review-screenshots-v3/desktop-review.html`
- `/review-screenshots-v3/responsive-review.html`
