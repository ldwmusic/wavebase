# Lab lessons — every pitfall already hit, with the fix

Read this BEFORE debugging anything visual on SurfGoose. Each entry cost real
time once; don't pay twice.

## Data pipeline

- **`data.js` and `constants.js` cannot load together** — both declare
  `const WAVEBASE_MONTHS` / `WAVEBASE_DESTINATIONS` → SyntaxError kills the
  second file silently. Load `data.js` only (it contains everything and provides
  the slug snapshot api-client.js needs).
- **`wavebase:data-ready` may fire BEFORE your script loads** (api-client
  hydrates from localStorage cache synchronously). Pattern:
  `if (WAVEBASE_DATA.length) fn(); window.addEventListener("wavebase:data-ready", fn);`
  and make renderers idempotent (the event re-fires on stale-while-revalidate).
- **The API blocks localhost (CORS).** Local pages render empty. Fix for local
  testing: curl the four endpoints
  (`https://wavebase-api-qqwt.onrender.com/{surf-spots,centers,stays,towns}/`),
  bundle as `{payload:{spots,centers,stays,towns}, savedAt:Date.now()}` into
  localStorage key `wavebase_api_cache_v1`, reload → cache hydrate. On
  surfgoose.com it just works (and shares the production cache).
- Slugs survive the API because api-client matches by NAME against data.js;
  unknown entries fall back to API UUIDs — never hardcode either, always go
  through `byId`-style lookups with graceful fallback entries.

## Caching

- **Bump `?v=N` on EVERY shared js/css change** — ES-module caching served us a
  stale `deck.js` three times in one session. New files start `?v=1`. Site-wide
  bump: `sed -i '' 's/v=OLD/v=NEW/g' *.html` (and lab/*.html separately).
- HTML itself is not cached — pure HTML edits need no bump.

## GSAP

- `gsap.killTweensOf(sharedTarget)` when switching modes/states — overlapping
  tweens on the same property both run; a stale `onComplete` (e.g.
  `visible=false`) lands AFTER the new tween and undoes it.
- Headless/hidden tabs: rAF never fires → gsap timelines freeze. For
  deterministic stills: `gsap.ticker.lagSmoothing(0)` then real-time-spaced
  `gsap.ticker.tick()` calls, or `timeline.pause().time(t, false)`.
- Timers throttle in hidden tabs (~1s per nested setTimeout after 5) — don't
  build verification on long setTimeout chains.

## three.js

- **`preserveDrawingBuffer: true`** on every experiment renderer — costs little,
  makes canvases screenshot-able in any pipeline.
- **Render one frame inside `resize()`** — `setSize` wipes the buffer; without
  an immediate repaint, rotation/resize flashes an empty canvas.
- Sky addon: LOW turbidity (≈3.4) = saturated dusk; high turbidity = washed-out
  haze (counter-intuitive). Sun elevation 2–5° + rayleigh ~3 + ACES exposure
  ~0.55 = golden hour. The classic photoreal combo: Sky + Water addons + PMREM
  (`pmrem.fromScene(envScene with sky)` → `scene.environment`).
- Ocean shaders: damp high-frequency wave terms and fragment normal-noise with
  distance (`exp(-len*k)`) or the horizon moirés.
- Hologram look: emissiveMap = the diffuse map at intensity ~0.75 (self-lit),
  additive BackSide fresnel shell (`pow(1-|dot(N,V)|, 2.6)`), faint wireframe
  sphere, additive cone + base ring + rising dust points.
- lat/lng → sphere: `phi=(90-lat)·π/180, theta=(lng+180)·π/180,
  pos=(-r·sinφ·cosθ, r·cosφ, r·sinφ·sinθ)` — verified against the
  `earth_atmos.jpg` equirect texture (Morocco pins land on Morocco).
- Stork.glb faces +Z: `rotation.y = Math.PI` to fly forward (−Z). Set
  `frustumCulled = false` on its meshes (morph animation).
- Camera transitions between viewpoints: interpolate in cylindrical coords
  (angle/radius/height) — cartesian lerp cuts straight through the subject.

## Headless verification (the preview browser)

- `visibilityState === "hidden"` → no rAF, no animation. Verify states via
  page-provided debug hooks, not by waiting.
- `window.innerWidth` can be 0 at script-execution time → always fall back:
  `innerWidth || docEl.clientWidth || 1200`.
- Captures misplace fixed/sticky layers when scrollY > 0 → capture at
  scrollY 0; to see a lower section, `display:none` the sections above it
  (debug-only) instead of scrolling.
- IntersectionObserver fires behind opaque overlays — gate reveal-setup until
  after the intro if elements shouldn't animate unseen.
- **Build debug hooks into every animated page** (the lab convention):
  `__labFreeze`, `__flightRender(p)`, `__deckMode/__deckRender/__deckInfo/__deckDossier`,
  `?nomotion=1` for a fully static render. They make verification AND live
  demo-jumping possible.

## Robustness checklist for any new experiment page

1. Poster/static fallback when WebGL/motion/CDN unavailable; boot watchdog
   (`window.__xBooted` + 12s timeout → poster).
2. `prefers-reduced-motion` honored (and it disables the heavy path entirely).
3. DPR cap (1.75 desktop / 1.5 touch), reduced texture/geometry on touch.
4. Lazy-load heavy modules behind user intent (`import()` on click).
5. `noindex`, OG tags (shared via WhatsApp → preview matters), favicon reuse.
6. Failsafe timers on anything that blocks interaction (intros, veils, loaders).
7. Credits for third-party assets visible on the page.
