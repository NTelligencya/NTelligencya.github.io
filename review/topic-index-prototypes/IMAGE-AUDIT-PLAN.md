# Site artwork audit and repair plan

Date: 6 September 2026

## What the audit found

- The source artwork is generally not the problem. The strongest repeated failure is a treatment mismatch: finished, edge-framed plates are being put into shallow containers with `object-fit: cover`, so the browser enlarges and crops them.
- The shared `plate-band` component explicitly describes itself as an uncropped treatment, but its image rule used `cover`. Twenty-one production pages use this component. This is the direct cause of the severely enlarged Copilot Study and Learn example.
- Eighty-nine production pages use `masthead-art`. That component deliberately crops, darkens and scrims the artwork. It is suitable for atmospheric backgrounds, but not for plates whose wordmark, monogram, data table or framed edges need to remain visible.
- The Library and Presentations indexes contain 47 per-item artwork slots. Reusing a small pool across this many cards makes repetition unavoidable and consumes artwork without improving findability.
- The four registered parallax routes are a separate system. Their 1672 × 941 layers should remain `contain` and registered; they should not inherit the masthead/card crop rules.

## Immediate corrections made in this maintenance pass

- The Simulation Tools page now calculates its parallax travel over the visible hero height instead of collapsing the whole movement into one scroll pixel. Motion is interpolated with `requestAnimationFrame`, and the envelope depth is reduced from 0.15 to 0.10.
- The busy primary nav no longer includes Contact; the footer's Get in touch link remains available.
- The Copilot Study and Learn page now uses the wide AI-processor artwork in a page-specific uncropped topic-hero treatment; the unsuitable square cloud plate is no longer used there.

An automatic global switch from `cover` to `contain` was tested and rejected: it prevents cropping, but makes portrait artwork tiny inside a wide hero band. The correct repair is to pair wide spaces with wide assets and reserve portrait artwork for square/inset treatments.

## Proposed repair sequence

1. **Approve one topic-index direction.** Choose Prototype A (open masonry-style clusters), Prototype B (denser visual shelves), or a hybrid. This removes the need for 47 decorative thumbnails before more assets are assigned.
2. **Create a page-to-treatment register.** For every production route, record the current asset, intrinsic ratio, current component, whether edge content must survive, and the approved replacement treatment.
3. **Fix by component, not page by page.** Use only four documented treatments: registered parallax (`contain`), full uncropped plate (`contain`), deliberately cropped atmospheric masthead (`cover` with an approved focal point), and small thumbnail (`cover` from a pre-cut card asset).
4. **Reassign imagery by topic.** Use the padlock mouse for cyber security, processor image for AI, spreadsheet for Office/tools, keyboard for other technical/making topics, and Just Ask Copilot for Copilot games. Content format remains a text label, not a navigation category.
5. **Replace unsuitable portrait mastheads.** The repeated portrait cloud/chip/keyboard images are the highest-risk sources when used in wide mastheads. Move them to inset or square treatments; use wide assets for wide spaces.
6. **Viewport QA.** Review representative routes at 320, 768, 1366 and 1920 CSS pixels. Check that full plates show all framed edges, cropped mastheads retain their focal subject, text contrast remains readable, and no mobile overflow appears.
7. **Only after visual approval, rationalise the homepage labels.** Merge the current Library, Library Collections and Simulation Tools lists into the approved topic-first information architecture without changing existing destination URLs.

## Acceptance checks for the next implementation pass

- No wordmark, monogram, framed edge or data-table detail is accidentally cut off.
- No image is stretched non-uniformly.
- Each topic family uses one recognisable visual cue consistently.
- Decorative art is not repeated once per item.
- Existing links remain valid and the format (workshop, presentation, game) remains visible as metadata.
- Homepage and Library language no longer repeats a catalogue name immediately under the same catalogue heading.
