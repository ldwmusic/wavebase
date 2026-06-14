# SurfGoose motion language — tuned recipes

The feeling to aim for: **water and flight**. Scrolling glides like a paddle
stroke, content surfaces like swell, the goose banks like a real bird. Motion is
choreography with intent — one well-orchestrated sequence beats scattered
micro-effects.

## Timing & easing vocabulary

| Use | Recipe |
|---|---|
| Content reveals | `gsap.fromTo(el, {y:56, rotateX:9, autoAlpha:0}, {y:0, rotateX:0, autoAlpha:1, duration:0.95, ease:"power3.out"})`, stagger 0.09, trigger via IntersectionObserver (threshold 0.12, rootMargin "0 0 -40px") |
| Flight paths | MotionPathPlugin, `ease:"power1.inOut"`, curviness 1.3–1.4 |
| Pops / docking | `back.out(1.6–2.2)` |
| Squash (honk, touchdown) | scaleY 0.82–0.9 → 1, `elastic.out(1.6, 0.4)` or quick yoyo |
| Smooth scroll | Lenis `{duration: 1.35–1.4, smoothWheel: true}`, desktop fine-pointer only |
| Hover transitions | 0.18–0.35s; cards lift `translateY(-2..-6px)` |

## Card 3D tilt (lab 01)

`transformPerspective: 900`, pointer → `rotationX: py*-8, rotationY: px*9, z:14`
via `gsap.quickTo(..., {duration: 0.5, ease: "power2.out"})`; reset on leave.
Inner depth: art `translateZ(26px)`, body `translateZ(40px)`. Add a sheen sweep
(`::after` gradient, translateX -120%→120% on hover). Fine pointers only.

## Goose flight grammar (2D, lab 01)

- The vector faces RIGHT. Flying leftward = wrap in `scaleX(-1)`.
- Flight = compound transforms: outer element follows the motion path + scale
  (far 0.10 → near 1.05), inner element does the wing-bob
  (`y:-14, rotation:2.5, 0.55s sine.inOut yoyo`).
- Banking: rotate toward the turn, ±8–10°, sine.inOut, then settle to 0.
- Landing: scale down to ~0.62 while descending, brief nose-up flare, squash on
  touchdown, then `spawnRipples` (3 expanding bordered circles, stagger 0.14) +
  `spawnFoam` (10–14 dots, radial burst with slight upward bias) + gentle
  post-landing bob (`y +=7, 1.1s yoyo`).
- Intro plays FULL once per session (`sessionStorage` flag), SHORT (~1.2s swoop)
  on revisit, "Skip intro" button from t≈0.5s, hard failsafe `setTimeout` that
  force-finishes (4s short / 9s full). The intro ends by handing the goose to
  the header logo (FLIP-style ghost element animated to the header rect).
- Map landing (spot pages): freeze Leaflet interactions during approach, convert
  latlng → containerPoint, fly the goose there, ripples + foam at the point,
  drop a divIcon goose-pin with a `pin-pop` bounce, reopen interactions, then
  popup. Provide a "Replay landing" button.

## Scroll-as-water (lab 01)

- Swell: wrap content in a `perspective: 1400px` stage; each frame tilt
  `rotateX(clamp(velocity * -0.045, ±1.15°))` from smoothed scroll velocity
  (`vel += (rawV - vel) * 0.12`). Subtlety is the point — beyond ±1.2° feels seasick.
- Scroll-buddy: mini goose riding a dotted SVG path at the right edge;
  position = `path.getPointAtLength(scrollProgress * length)`, bank =
  `clamp(vel * 0.7, ±26°)`. Hide under 900px width.
- Page transitions: full-screen wave veil (SVG crest riding ABOVE the panel —
  hide it with `translateY(calc(100% + 94px))`, percent alone fails) sweeping up
  with the goose crossing left→right; `sessionStorage` flag so the destination
  page starts covered and lifts the veil.

## Cinematic 3D (lab 02 grammar)

- Scroll-driven film: scenes are tall sections with `position: sticky` inner
  frames; measure scene boundaries from the DOM (offsetTop/height − vh) and
  drive a keyframe array — one key per scene boundary, smoothstep-lerped.
- **Camera keys in cylindrical coordinates** `[angle°, radius, height]` around
  the subject with CONTINUOUS angles (e.g. −75 → −150 → −188 → −228 …): the
  camera orbits gracefully and can never lerp through the bird.
- Speed feel: world flows past (wave phase offset, clouds recycling past camera,
  streak particles when speed > ~1.6), camera FOV widens with speed (+9°),
  letterbox bars scale in during the dive, fog/sun evolve across the film
  (sun sinks = time passes).
- Whiteout beat: crossing the cloud layer uses a DOM veil (`--cloudveil`
  radial-gradient, opacity = sin(localProgress·π)^1.6 · 0.92) — reliable and
  readable, where 3D-only clouds are not.

## Holo interactivity (lab 03 grammar)

- Steerable goose: pointer → seek target (`x = nx*13, y = clamp(8.6 − ny*5.6,
  3.6, 13.5)`), `position.lerp(seek, dt*2.6)`, bank/pitch from velocity
  (`clamp(−vx*0.075, ±0.65)`), hold ≥180ms = boost (flap timeScale up, FOV kick,
  spray), quick click = HONK (projected bubble + elastic squash + synth honk).
- Globe: drag rotates with inertia (`spinVel` decays toward auto-rotate 0.10),
  beacons pulse `1 + sin(t*2.6)*0.12`, hovered beacon ×1.7, raycast against
  invisible larger hit-spheres (forgiving targets).
- Sound is synthesized (WebAudio oscillators + filtered noise ambient), OPT-IN
  via a visible chip, master gain ~0.22. Hover blip 1.5kHz/50ms, click
  600→1050Hz triangle, honk = saw 255→185 + square 330→250.
- `gsap.killTweensOf(target)` on every mode switch — a stale `onComplete`
  from the previous mode's tween once hid the whole globe.
