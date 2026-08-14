# The six artwork treatments

Reference sources for the artwork treatments described in `README.md`. Each section carries the
usage notes, the props contract, and the reference implementation.

**These are specifications, not code to install.** The live site is static HTML with no build step,
so read these for the exact ratios, gradients, opacities and rules, then write the CSS equivalent
in the conventions already used in `ntworldink-LIVE/NTelligencya.github.io/`.

They are bundled as one document rather than as loose `.jsx` files on purpose: they are copies of
components that live in the design system, and shipping them as real source files made two
definitions of each component exist at once.

---

# PlateHero

Full-bleed artwork hero for a landing page: a plate behind the site header and headline, screened so type stays legible and the plate resolves into the page ground.

```jsx
<PlateHero src="assets/artwork/hero-padlock-circuit.jpeg" alt="A padlock built from circuitry, with a mouse holding a lit bulb">
  <SiteHeader transparent />
  <div className="wrap">
    <Eyebrow>Darwin &middot; Northern Territory</Eyebrow>
    <h1>Learning that sticks,<br />from the Top End.</h1>
    <SearchField placeholder="Search the whole site" />
    <p className="lead">Learning materials in cybersecurity, AI literacy, Microsoft Office, and workplace digital skills.</p>
  </div>
</PlateHero>
```

**Only wordmark-free, wide plates.** `hero-padlock-circuit` and `hero-square-padlock-mouse` are the safe ones. `hero-motherboard-chip` and `hero-keyboard-closeup` carry the ornate wordmark at their left and right edges respectively, and there is not enough horizontal slack in a cover crop to clear it — `objectPosition` cannot rescue them. Use PlateBandHero for those.

`fadeRightEdge` is on by default and matters: every plate carries its tagline and `DATA / IDEAS / STORIES / STRATEGY` list hard against its right edge, and below about 1400px the crop lands mid-word. The fade hides the cut. Turn it off only above that width, or on a plate that is genuinely blank at the right.

Set the header transparent when it sits inside this component, so the nav floats on the plate rather than sitting in a bar above it.

### Props

```ts
import * as React from 'react';

export interface PlateHeroProps {
  /** Plate URL. Must be a wordmark-free, wide plate — hero-padlock-circuit,
   *  hero-square-padlock-mouse. Wordmark-bearing plates get sliced here. */
  src: string;
  alt?: string;
  /** CSS object-position for the cover crop. Default 'left 46%'. */
  objectPosition?: string;
  /** Overrides the default clamp(620px, 52vw, 760px). */
  height?: string | number;
  /** Fades the plate's right edge so its own tagline is never cut mid-word.
   *  Leave on unless the plate is genuinely blank at the right. Default true. */
  fadeRightEdge?: boolean;
  /** Header, eyebrow, headline, lead and calls to action. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function PlateHero(props: PlateHeroProps): JSX.Element;
```

### Reference implementation

```jsx
import React from 'react';

/** Full-bleed artwork hero: a plate behind the header and headline, screened by a
 *  vertical scrim so type stays legible and the plate resolves into the page ground.
 *
 *  Only wordmark-free, wide plates belong here — `hero-padlock-circuit`,
 *  `hero-padlock-mouse`. Plates carrying the ornate wordmark at an edge get sliced
 *  by the cover crop; use PlateBandHero for those instead. */
export function PlateHero({ src, alt = '', objectPosition = 'left 46%', height, fadeRightEdge = true, children, style }) {
  return (
    <section style={{
      position: 'relative', width: '100%', height: height || 'clamp(620px, 52vw, 760px)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', ...style
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }} />
        {/* The plate's own tagline and list sit hard against its right edge; below about
            1400px the cover crop lands mid-word, so fade the edge rather than slice it. */}
        {fadeRightEdge && <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '22%', zIndex: 1,
          background: 'linear-gradient(to left, var(--bg) 0%, rgba(10,10,12,0.86) 34%, rgba(10,10,12,0) 100%)'
        }} />}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(10,10,12,0.72) 0%, rgba(10,10,12,0.5) 34%, rgba(10,10,12,0.78) 72%, var(--bg) 100%)'
        }} />
      </div>
      <div style={{
        position: 'relative', zIndex: 3, flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 0 84px'
      }}>{children}</div>
    </section>
  );
}
```

---

# PlateBandHero

Hero for an interior landing page: a banner plate at its own intrinsic ratio, with the headline on flat ground beneath it. The safe hero for wordmark-bearing plates, because nothing is cropped.

```jsx
<PlateBandHero src="assets/artwork/banner-wordmark-keyboard.png" ratio="3232/424" alt="The Ntell World Ink wordmark across a backlit keyboard">
  <div className="wrap">
    <Breadcrumb trail={[{ label: 'ntworld.ink', href: '/' }, { label: 'Presentations' }]} />
    <h1>Presentations</h1>
    <p className="lead">Self-contained decks that open in any browser and work offline.</p>
  </div>
</PlateBandHero>
```

**Read the plate's real ratio off the file; never guess it.** The whole point of this component is that the plate is uncropped, and a wrong ratio reintroduces the crop. `banner-wordmark-keyboard` is 3232/490, `footer-wordmark-url` 3386/504, `banner-mouse-lightbulb-keyboard` 1984/382.

`maxHeight` caps the band on a wide screen. Above about 420px a 6:1 band starts to read as a hero image in its own right and competes with the headline.

### Props

```ts
import * as React from 'react';

export interface PlateBandHeroProps {
  /** Plate URL — this is the safe hero for wordmark-bearing plates. */
  src: string;
  alt?: string;
  /** The plate's true aspect ratio, e.g. '3232/424'. Never guess it; read the file. */
  ratio?: string;
  /** Caps the band on wide screens. Default 420. */
  maxHeight?: number | string;
  objectPosition?: string;
  /** Fades the band's foot into the page ground. Default true. */
  fade?: boolean;
  /** Headline and lead, set on flat ground below the band. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function PlateBandHero(props: PlateBandHeroProps): JSX.Element;
```

### Reference implementation

```jsx
import React from 'react';

/** A banner plate at its own intrinsic ratio, with the page's headline set on flat
 *  ground beneath it. The safe hero for wordmark-bearing plates: nothing is cropped,
 *  so nothing is sliced.
 *
 *  Pass the plate's true ratio as `ratio` ("3232/424" for banner-wordmark-keyboard);
 *  the band then scales with the window instead of cropping. */
export function PlateBandHero({ src, alt = '', ratio = '3232/424', maxHeight = 420, objectPosition = 'center top', fade = true, children, style }) {
  return (
    <div style={style}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: ratio, maxHeight,
        lineHeight: 0, overflow: 'hidden', background: 'var(--bg)'
      }}>
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }} />
        {fade && <div aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '140px', pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent, var(--bg))'
        }} />}
      </div>
      <div style={{ padding: '44px 0 76px' }}>{children}</div>
    </div>
  );
}
```

---

# PlateBand

A thin plate strip dividing two sections of a page, carrying a mono label and serif heading over its left end.

```jsx
<PlateBand src="assets/artwork/banner-mouse-lightbulb-keyboard.png" label="// courses" title="Eight courses, all downloadable" />
```

Ruled top and bottom, plate screened to 0.55, with a left-to-right scrim reaching near-full opacity by 18% so the heading never lands on the artwork's own lettering. That scrim is not optional decoration — without it a section label collides with the plate's `CTRL / ALT / DEL` block.

Default `objectPosition` is `62% 50%`, which favours the right-hand half of a banner plate; the left is where the scrim is heaviest, so there is no point spending the interesting part of the composition there.

One per page. Two bands in one scroll starts to read as a pattern rather than a division.

### Props

```ts
import * as React from 'react';

export interface PlateBandProps {
  /** Plate URL. A banner-* plate suits this best. */
  src: string;
  alt?: string;
  /** Mono eyebrow, e.g. '// courses'. */
  label?: string;
  /** Serif heading set over the plate's left end. */
  title?: string;
  /** Strip height. Default 132. */
  height?: number | string;
  objectPosition?: string;
  /** How far the plate is screened back. Default 0.55. */
  opacity?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function PlateBand(props: PlateBandProps): JSX.Element;
```

### Reference implementation

```jsx
import React from 'react';

/** A thin plate strip used as a section divider, with a mono label and serif heading
 *  set over its left end. Ruled top and bottom; the plate is screened back and a
 *  left-to-right scrim keeps the type off the artwork's own lettering. */
export function PlateBand({ src, alt = '', label, title, height = 132, objectPosition = '62% 50%', opacity = 0.55, children, style }) {
  return (
    <div style={{
      position: 'relative', height, overflow: 'hidden',
      borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', ...style
    }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, opacity, display: 'block' }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, var(--bg) 0%, rgba(10,10,12,0.92) 18%, rgba(10,10,12,0.3) 40%, rgba(10,10,12,0.55) 100%)'
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
          {label && <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-label-sm)', letterSpacing: 'var(--ls-eyebrow)',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px'
          }}>{label}</div>}
          {title && <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '40px', lineHeight: 1.1, margin: 0
          }}>{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

# ArtworkCard

AppCard with a plate across the top — the card to use in a catalogue grid where each item deserves a face.

```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
  <ArtworkCard src="assets/artwork/cards/hero-padlock-circuit.png" category="Presentation &middot; 19 slides"
    title="How Scammers Fake It with AI" href="/presentations/how-scammers-fake-it-with-ai/">
    Voice cloning, deepfake endorsements, fake casinos and romance baiting.
  </ArtworkCard>
</div>
```

**Feed it the pre-cut plates in `assets/artwork/cards/`.** They are already 2:1. The slot is a fixed ratio on purpose: it was a fixed 150px height at first, which meant the crop ratio slid from 4:1 at full width to 2.8:1 in a narrow window, so no export size could ever have fitted it.

Square and portrait plates lose their frames at 2:1 — the corner brackets, the tagline and usually the monogram are cropped out. They still read as texture, which is all a thumbnail needs, but do not use this slot to show a plate as a composition.

Omit `src` and it degrades to a plain AppCard, which is how the "more topics on the way" card at the foot of a grid is built. Use `wide` for that.

### Props

```ts
import * as React from 'react';

export interface ArtworkCardProps {
  /** Plate URL. Use the pre-cut 2:1 files in assets/artwork/cards/ — the slot is a
   *  fixed 2:1, so a square or portrait plate loses its frame here. */
  src?: string;
  alt?: string;
  /** Mono category line, e.g. 'Presentation · 19 slides'. */
  category?: string;
  title?: string;
  href?: string;
  /** Spans the full grid width. */
  wide?: boolean;
  /** One or two sentences of description. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler;
}

export declare function ArtworkCard(props: ArtworkCardProps): JSX.Element;
```

### Reference implementation

```jsx
import React from 'react';

/** AppCard with a plate across the top: a fixed 2:1 thumbnail slot, ruled off from the
 *  body, with a bottom scrim so the mono category line never lands on busy artwork.
 *
 *  The slot is a fixed ratio on purpose — a fixed pixel height made the crop shift with
 *  the window, so no export size could ever fit it. Feed it the pre-cut plates in
 *  assets/artwork/cards/, which are already 2:1. */
export function ArtworkCard({ src, alt = '', category, title, href, wide, children, style, onClick }) {
  const [hover, setHover] = React.useState(false);
  const Tag = href ? 'a' : 'div';
  return (
    <Tag href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-2)', border: '1px solid ' + (hover ? 'var(--accent-line-25)' : 'var(--rule-2)'),
        borderRadius: 'var(--radius-2xl)', overflow: 'hidden', display: 'block', textDecoration: 'none',
        transition: 'border-color 0.2s ease', gridColumn: wide ? '1 / -1' : undefined, ...style
      }}>
      {src && <div style={{ position: 'relative', aspectRatio: '2 / 1', overflow: 'hidden', borderBottom: '1px solid var(--rule)' }}>
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,12,0.1), rgba(10,10,12,0.72))'
        }} />
      </div>}
      <div style={{ padding: '20px 24px 24px' }}>
        {category && <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-label-xs)', color: 'var(--accent)',
          letterSpacing: 'var(--ls-callout)', textTransform: 'uppercase', marginBottom: '8px'
        }}>{category}</div>}
        {title && <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '23px',
          color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.2
        }}>{title}</h3>}
        <p style={{ fontSize: 'var(--fs-ui)', color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{children}</p>
      </div>
    </Tag>
  );
}
```

---

# PlateFootBand

The footer plate, shown whole at its own intrinsic ratio. No crop, no fixed height.

```jsx
<footer>
  <PlateFootBand src="assets/artwork/footer-mouse-lightbulb-monogram.png" alt="A mouse holding a lit bulb, with the NT monogram" />
  <div className="wrap">{/* columns, then the legal line */}</div>
</footer>
```

The plate's own ratio governs the depth, so a 8.75:1 plate (`footer-keyboard-data-monogram`) becomes a thin band and a 2.7:1 one (`footer-monogram-chip`) a deeper one. Both are complete. This is the opposite decision from ArtworkCard, and deliberately so: a footer has room to show a composition, a thumbnail does not.

`maxHeight` defaults to 230 and stops the deepest plates dominating a short page.

Wordmark plates belong here — `footer-wordmark-url` is the strongest — but only if the page's hero is not also a wordmark plate. One wordmark per page.

### Props

```ts
import * as React from 'react';

export interface PlateFootBandProps {
  /** A footer-* plate, shown whole. Its own ratio governs the band's depth. */
  src: string;
  alt?: string;
  /** Caps the depth on short pages. Default 230. */
  maxHeight?: number | string;
  /** Default 0.9. */
  opacity?: number;
  style?: React.CSSProperties;
}

export declare function PlateFootBand(props: PlateFootBandProps): JSX.Element;
```

### Reference implementation

```jsx
import React from 'react';

/** The footer plate, shown whole at its own intrinsic ratio — no crop, no fixed height.
 *  Feed it a `footer-*` plate and its true ratio; wide plates (up to 8.75:1) become a
 *  thin band, squarer ones a deeper one, and neither is sliced.
 *
 *  `maxHeight` stops the deepest plates dominating a short page. */
export function PlateFootBand({ src, alt = '', maxHeight = 230, opacity = 0.9, style }) {
  return (
    <div style={{
      position: 'relative', lineHeight: 0, borderTop: '1px solid var(--rule)',
      background: 'var(--bg)', ...style
    }}>
      <img src={src} alt={alt} style={{
        width: '100%', height: 'auto', maxHeight, objectFit: 'contain', opacity, display: 'block'
      }} />
    </div>
  );
}
```

---

# PlateInset

A small square plate crop marking a list row — flashcard sets, resource rows, session lists.

```jsx
<div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '20px', alignItems: 'start' }}>
  <PlateInset src="assets/artwork/hero-square-padlock-mouse.png" />
  <div><h3>ISM Cyber Security Terms</h3></div>
</div>
```

**Use the full-size plate, not the 2:1 card cut** — this slot is 1:1, so a pre-cropped file would be cropped twice.

The most forgiving use of the artwork. At 96px the slot needs about 192px of source at double density, so even the smallest plate in the library has three times the pixels it needs; the files that were too soft for a hero are comfortably oversized here. A 1:1 crop also lands on the interesting middle of the composition — the padlock, the monogram, the keys — and nobody expects to see the frame or tagline at that size.

### Props

```ts
import * as React from 'react';

export interface PlateInsetProps {
  /** Plate URL. Use the FULL-SIZE plate, not the 2:1 card cut — this slot is 1:1. */
  src: string;
  alt?: string;
  /** Square edge in px. Default 96. */
  size?: number | string;
  /** Corner radius in px. Default 8. */
  radius?: number | string;
  /** Default 0.85. */
  opacity?: number;
  style?: React.CSSProperties;
}

export declare function PlateInset(props: PlateInsetProps): JSX.Element;
```

### Reference implementation

```jsx
import React from 'react';

/** A small square plate crop used as a list-row marker — flashcard sets, resource rows.
 *  Rounded, ruled, with a diagonal scrim so it reads as decoration rather than a photo.
 *
 *  The most forgiving use of the artwork: at 96px even the smallest plate has three
 *  times the pixels it needs, and a 1:1 crop lands on the interesting middle of the
 *  composition, where nobody expects to see the frame or tagline. */
export function PlateInset({ src, alt = '', size = 96, radius = 8, opacity = 0.85, style }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, overflow: 'hidden',
      border: '1px solid var(--rule)', position: 'relative', flex: 'none', ...style
    }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, display: 'block' }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(10,10,12,0), rgba(10,10,12,0.55))'
      }} />
    </div>
  );
}
```

---
