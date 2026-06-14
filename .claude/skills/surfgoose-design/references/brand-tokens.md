# SurfGoose brand tokens — full reference

Three registers exist. Pick ONE per page/section and commit to it.

## Register A — Editorial warm (production site + lab 01)

The default. Warm paper, ink, sea/clay/amber accents.

```css
:root {
  --cream:      #f6f1e7;   /* page background */
  --paper:      #fffefb;   /* cards, panels */
  --ink:        #2a2723;   /* primary text */
  --ink-soft:   #6f6658;   /* secondary text */
  --sand:       #e7dcc4;   /* hairline borders */
  --sand-deep:  #d8c9a8;   /* stronger borders, the headline underline accent */
  --sea:        #3f6f7d;   /* primary accent, links, SPOT color */
  --sea-deep:   #2e545f;
  --sea-soft:   #dde8ea;
  --clay:       #bd6242;   /* kickers, CENTER color */
  --clay-soft:  #f0ddd2;
  --amber:      #e0a447;   /* STAY color */
  --amber-soft: #f5e5c4;
  --beak:       #da6132;   /* goose-beak orange: active nav underline, "current month" ring */
  --goose-cream:#fcf9f4;   /* the goose's body */
  --goose-ink:  #23221e;   /* the goose's linework */
  --shadow:     0 14px 40px -18px rgba(42, 39, 35, 0.28);
  --shadow-sm:  0 6px 20px -12px rgba(42, 39, 35, 0.30);
  --radius:     18px;      /* cards go up to 22–24px */
  --maxw:       1080px;
}
```

Signature moves: headline underline via
`background-image: linear-gradient(transparent 62%, var(--sand-deep) 62%, var(--sand-deep) 92%, transparent 92%)`;
kickers uppercase 13px letter-spacing 0.18em in `--clay`; card art gradients per
type (spot `#4d7f8e→sea→sea-deep`, center `#cf7a57→clay→#99492c`, stay
`#ecc27a→amber→#b97f2e`) with a cream goose stamp top-left and sport glyph
(mask of `/sport-*.svg`) bottom-right.

## Register B — Cinematic glass (lab 02 "The Flight")

Golden-hour scene + liquid glass over it.

```css
--ink-night: #0c1d29;  --cream: #fcf7ec;  --beak: #e8703a;  --amber: #ffc97e;
--glass-bg:  linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,.05) 55%, rgba(255,255,255,.10));
```

Liquid-glass recipe: `backdrop-filter: blur(22px) saturate(150%)` (+ `-webkit-`),
inset top highlight `inset 0 1px 0 rgba(255,255,255,.42)`, **chromatic border**
via a `::before` with padding:1px, gradient
(white→warm 25%→cool 22%→white 8%→warm 30%) and `mask-composite: exclude`,
plus a travelling sheen `::after` that sweeps `background-position` on hover.
Buttons: cream gradient pill (dark text) or ghost glass. Letterbox bars
`#050b10`, grain = SVG feTurbulence data-URI at 0.045 opacity, steps(4) jitter.

## Register C — Holo deck (lab 03 "Flight Deck")

Futuristic hologram over photoreal dusk.

```css
--void: #03121c;  --holo: #6ef3ff;  --holo-dim: rgba(110,243,255,.55);
--amber: #ffc46a;  --cream: #f4fbfd;  --beak: #ff8a4d;
```

Holo recipe: panels `linear-gradient(160deg, rgba(8,40,56,.72), rgba(4,22,34,.55))`
+ blur(14px) + 1px border `rgba(110,243,255,.30)` + inner glow + **corner
brackets** (14px `::before/::after` L-shapes in `--holo`); text-shadow glow
`0 0 12px var(--holo-dim)`; subtle 7s flicker keyframes; scanlines overlay
(repeating-linear-gradient 1px/4px, mix-blend screen). HUD labels: Space
Grotesk 700, 10–13px, letter-spacing 0.16–0.3em, uppercase.
Entry-type colors here: spot `#6ef3ff`, center `#ff8a4d`, stay `#ffc46a`.

## Typography (all registers)

- **Fraunces** 500–600 — headlines, brand moments, dossier names. Serif warmth.
- **DM Sans** 400–600 — body, UI copy.
- **Space Grotesk** 500/700 — register C HUD labels only.
- Self-hosted woff2 only: `/fonts/DMSans-latin*.woff2`, `/fonts/Fraunces-latin*.woff2`,
  `lab/sg-latin-{500,700}.woff2`. Never the Google Fonts CDN (visitor-IP/GDPR).
- English site copy; brand voice: honest, warm, a little playful
  ("Honest story →", "paddle down", "HONK!"). Spelling: "centers" (US), the
  Cretan village is "Palekastro".

## The goose asset

- 2D: `lab/goose.svg` (true vector, 13 paths, viewBox `156 84 718 695`).
  Inline it (the `gooseSVG(flip)` pattern in lab/lab.js) — body `#FCF9F4`,
  linework `#23221E`, beak `#DA6132`, wears sunglasses, **faces RIGHT**.
- 3D: `lab/stork.glb` (76 KB, morph flight animation). Faces +Z → rotate
  `Math.PI` to fly toward −Z. Tint material `color(1.0, 0.97, 0.91)`,
  roughness ~0.85. **Credit required:** "Stork" by mirada (ro.me), CC-BY.
