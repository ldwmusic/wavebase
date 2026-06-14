---
name: surfgoose-design
description: >
  SurfGoose's design system, motion language and hard-learned engineering rules for
  all visual work on this project. Use this skill whenever the task touches design,
  styling, UI, UX, layout, animation, pages, cards, the goose, the labs (/lab/),
  hero sections, maps, hologram/3D views, intros or transitions — in English or Dutch
  ("maak een pagina", "nieuw design", "animatie", "stijl", "mooier maken", "kaarten",
  "experiment"). Also use it when reviewing or extending lab 01/02/03, when adding any
  new page or section, or when the user asks for "iets moois" — even if they don't say
  the word design. It encodes the brand tokens, typography, goose motion grammar,
  honesty-first UX rules, and the pitfalls that already cost hours (CDN fallbacks,
  cache busting, headless testing, three.js/GSAP traps).
---

# SurfGoose Design

SurfGoose is an **honest surf guide**: no marketing spin, every claim sourced from
recent reviews and live catalog data. The design's job is to make that honesty
*felt* — warm, editorial, hand-crafted — with the goose as the guide through
everything. Spectacle is welcome (three design labs prove it) but it must serve
trust, never replace it.

## The one-paragraph brief

Warm paper, ink typography, sea-and-clay accents. Fraunces for headlines, DM Sans
for body. The goose (cream body, ink linework, orange beak, sunglasses, faces
RIGHT) appears at every key moment: it flies you in, lands on real coordinates,
guides scroll, becomes the logo. Data shown is always REAL — live catalog, real
prices with sources, real coords — and experiments never touch the production
site: everything additive under `lab/`, noindex, with graceful fallbacks.

## Non-negotiables (the why is trust)

1. **Real data only.** Cards, dossiers, maps and stats come from the live catalog
   (`/data.js` + `/api-client.js`, event `wavebase:data-ready`). Never invent
   spots, prices, coords or claims; show source lines where the site does.
2. **Production stays untouched.** Experiments are new files under `lab/`,
   `<meta name="robots" content="noindex, nofollow">`, never in `sitemap.xml`.
   A change is only done when `git status` shows additions (plus deliberate lab
   file edits) and zero production-file modifications.
3. **Motion is progressive enhancement.** If GSAP/Lenis/three fail (CDN block,
   old browser) the page must still render and read. Respect
   `prefers-reduced-motion`; keep the `?nomotion=1` debug path working; give every
   heavy page a static poster fallback + boot watchdog.
4. **Honesty chrome.** Experiments carry a visible "Design Lab — experiment, not
   the live site" marker and a link back to the real site. Third-party assets get
   visible credit (Stork bird CC-BY mirada/ro.me; NASA earth texture; OSM tiles).
5. **The goose is the red thread.** Every page answers: where is the goose and
   what is it doing for the visitor here?

## Brand tokens (summary — full tables in references/brand-tokens.md)

| Token | Value | Use |
|---|---|---|
| `--cream` | `#f6f1e7` | page background |
| `--paper` | `#fffefb` | cards/panels |
| `--ink` / `--ink-soft` | `#2a2723` / `#6f6658` | text |
| `--sand` / `--sand-deep` | `#e7dcc4` / `#d8c9a8` | borders, underline accent |
| `--sea` / `--sea-deep` / `--sea-soft` | `#3f6f7d` / `#2e545f` / `#dde8ea` | primary accent, spot color |
| `--clay` (+soft) | `#bd6242` | kickers, center color |
| `--amber` (+soft) | `#e0a447` | stay color |
| `--beak` | `#da6132` | goose-orange highlights (active nav, "now" marker) |
| goose body / linework | `#fcf9f4` / `#23221e` | the goose itself |
| Holo set (lab 03) | void `#03121c`, holo `#6ef3ff`, amber `#ffc46a` | futuristic/hologram surfaces |

Type: **Fraunces** 500–600 (headlines, serif, letter-spacing −0.01em), **DM Sans**
400–600 (body), **Space Grotesk** 500/700 (HUD/futuristic labels only). All
self-hosted (`/fonts/`, lab `sg-latin-*.woff2`) — never Google Fonts CDN (GDPR).
Radii 18–24px; soft long shadows (`0 14px 40px -18px rgba(42,39,35,.28)`).
Entry-type color coding everywhere: **spot=sea, center=clay, stay=amber**.

## Motion language (recipes in references/motion-language.md)

- **Easings:** reveals `power3.out`; flight paths `power1.inOut`; playful pops
  `back.out(1.6–2.2)`; squash `elastic.out`. Lenis duration 1.35–1.4.
- **Reveal grammar:** rise from the water — `y:56, rotateX:9°, autoAlpha:0 →
  0.95s power3.out`, stagger ≈0.09s. Cards tilt ±8° to pointer with inner
  `translateZ` layers.
- **Goose grammar:** native art faces RIGHT (mirror with `scaleX(-1)` to fly
  left). Banking ±10°, sine wing-bob, flare (nose-up + slow) before touchdown,
  ripple rings + foam dots on landing. Intro plays full once per session
  (`sessionStorage`), short version after, always skippable, failsafe timer.
- **Cinema:** letterbox bars during intensity peaks; film grain ≤0.05 opacity;
  3D camera moves on **cylindrical orbit keys** around the subject (never lerp
  camera straight through it); scene-keyed choreography tied to measured DOM
  scroll boundaries.

## Architecture & workflow (details in references/architecture.md)

- Static site, no build step. Cloudflare auto-deploys `main` in ~1 min.
- **Cache busting is law:** any change to a shared `.css`/`.js` file requires
  bumping its `?v=N` in every HTML that references it (ES-module caching bit us
  repeatedly). New files start at `?v=1`.
- Heavy 3D loads lazily (`import()` on user action), DPR capped (1.75 desktop /
  1.5 touch), texture sizes halved on touch.
- Before shipping: run the verification ritual (preview server → console clean →
  per-state screenshots via the page's `__xRender`-style debug hooks → mobile
  width → push → live smoke-test with curl → real-browser look). Build those
  debug hooks into every animated page; headless captures only work at
  scrollY 0 with manual GSAP ticks — see references/lab-lessons.md.

## When you build something new

1. Read the relevant reference file(s) below first.
2. Decide which register it lives in: **editorial warm** (site, lab 01),
   **cinematic glass** (lab 02) or **holo deck** (lab 03) — don't blend
   registers casually; pick one and commit.
3. Reuse the goose assets (`lab/goose.svg` inline pattern, `lab/stork.glb` for
   3D) and existing data plumbing instead of inventing parallel systems.
4. Wire fallbacks + debug hooks from the start, not after.
5. Verify, then ship additive-only, then hand the user the live URL
   (surfgoose.com/lab/...) — they share experiments with Michiel via WhatsApp,
   so set OG tags on every new page.

## References

- `references/brand-tokens.md` — full color/type/shadow tables, per-register palettes
- `references/motion-language.md` — concrete GSAP/Lenis/three recipes with the tuned values
- `references/lab-lessons.md` — every pitfall already hit, with the fix (read before debugging)
- `references/architecture.md` — data pipeline, deploy, cache busting, verification ritual, debug-hook pattern
