# Section hero v3 review report

Branch: `main` (local working tree only)

Release boundary: local review only. No publish or deployment was performed.

## Page structure

- `/` — P3 v2 three-plane keyboard hero, Main Menu search/navigation, existing illustrated footer.
- `/library/` — P4 processor hero, workshops, training games, presentations, and About.
- `/courses/` — P8 stone-QR hero and the complete expandable course list.
- `/simulations/` — P5 hooked-envelope hero followed by the existing simulation catalogue.
- `Main Menu` remains the current label. Changing it to `Login` is deferred until authentication is implemented.

## Verification

- The homepage now renders only the v2 background, intact keyboard-and-cable PNG, and unchanged interface overlay. The retired P3 midground, old keyboard and foreground files remain stored but are not referenced.
- The homepage uses three active planes; the three other section routes retain their existing five-plane scenes, for 18 active layers across the four routes. Every active layer retains the 1672 × 941 registration canvas.
- Browser checks: 1920 × 1080, 1366 × 768, 768 × 900 and 320 × 568.
- Every checked viewport reported `scrollWidth === innerWidth`; the three homepage layers retained the same aspect ratio and `object-fit: contain` rule.
- Pointer verification observed one rigid keyboard transform at `translate3d(2.68px, -6.65px, 0) rotate(0.134deg) scale(1.0025)`, followed by a smooth reset to the neutral transform.
- Library section links wrap on mobile and anchor headings remain visible below sticky navigation.
- All local links and asset references in the five affected public pages resolve to existing files.
- Main Menu, header, and discreet client links retain safe new-tab attributes.
- Coarse-pointer and reduced-motion guards keep the keyboard at its neutral registered position; the pointer loop is not installed for those modes.
- `/client-access/` remains `noindex,nofollow`, absent from search and sitemap; client pages remain hidden internal-search entries.
- Full index generation: 233 entries, 46 hidden client entries, 187 visible sitemap URLs.
- Browser request log showed the homepage, both new v2 assets, the unchanged interface, scripts, stylesheets and card artwork returning HTTP 200. Browser console inspection reported no warnings or errors.
- `node --check homepage-parallax.js` and `python3 tools/check-homepage-parallax.py` completed successfully. This GitHub Pages repository has no separate package build step.

## Review pages

- `/review-screenshots-v3/desktop-review.html`
- `/review-screenshots-v3/responsive-review.html`
