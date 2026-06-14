# Architecture & workflow

## The site

- Plain static HTML/CSS/JS, **no build step, no npm**. Anyone can open the files.
- Deploy: push to `main` → Cloudflare Workers serves the repo root in ~1 min.
  Live: https://surfgoose.com (mirror: wavebase.lode-b162.workers.dev).
- Production pages: `index.html` (discover), `spot.html` (every detail page),
  `kaart.html`, `compare.html`, `account.html`, `about.html`. All UI logic in
  `app.js`, styling in `styles.css`, fake accounts in `account.js`.
- **Data**: live API (`api-client.js` → wavebase-api-qqwt.onrender.com, Render
  free tier, cold starts ≤30s) with localStorage stale-while-revalidate cache
  (`wavebase_api_cache_v1`). `data.js` is the legacy in-repo snapshot that
  still provides slug stability and the destinations/months constants.
- Entry shape (frontend): `{id, type: spot|center|stay, name, town, country,
  coords:[lat,lng], tagline, levels[], sports[], goodMonths[], stats{monthly*…,
  periods, windDir, crowd}, prices{fromEUR…|groupLessonEUR…, source, verified},
  verblijf/diensten, samenvatting[], verhaal[], lagen[], ideaalVoor,
  nietIdeaalAls, googleMapsQuery, linkedSpotId}`. Centers/stays inherit
  conditions via `linkedSpotId` → look up the linked spot for stats.

## The design lab

- Everything experimental lives in **`lab/`** and is linked between pages:
  - `lab/index.html` + `lab/spot.html` + `lab/lab.css|lab.js` — lab 01
    (editorial warm: goose intro, water scroll, 3D cards, map landing,
    holo-toggle on the map via lazy `lab/holomap.js`).
  - `lab/flight.html|flight.css|flight.js` — lab 02 (cinematic scroll-film,
    liquid glass, Stork bird, custom sky/ocean shaders).
  - `lab/deck.html|deck.css|deck.js` — lab 03 (interactive holo deck:
    Sky+Water photoreal, steerable goose, hologram Earth with live-data
    beacons + dossiers, opt-in synth sound).
  - Shared assets in `lab/`: `goose.svg`, `stork.glb`, `waternormals.jpg`,
    `earth_atmos.jpg`, `sg-latin-{500,700}.woff2`.
- CDN dependencies (consistent versions): GSAP 3.13 + MotionPathPlugin,
  Lenis 1.3.x (UMD), three 0.160 via **importmap**
  (`three` → build/three.module.min.js, `three/addons/` → examples/jsm/) —
  the importmap must be in any page that (lazy-)imports three.
- Leaflet 1.9.4 + OSM tiles on map pages (same as production).

## Shipping rules

1. Experiments: ONLY add files under `lab/` (+ edits to lab files themselves).
   `git status` must show no production-file modifications.
2. Bump `?v=` on changed shared css/js in the HTML that references them.
3. Commit style: one-line summary + a short body explaining what/why;
   trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
4. After push: `until curl -s -o /dev/null -w '%{http_code}' URL = 200`
   smoke-test the new URLs (note: Cloudflare 307-redirects `x.html` → `/x` —
   follow with `-L`; query strings survive).
5. Hand the user live URLs — they forward them to Michiel (Vienna) via
   WhatsApp, so OG title/description/image on every new page.

## Verification ritual (do this before claiming "done")

1. `.claude/launch.json` has the `wavebase` server (python http.server 8765) —
   start it via the preview tools, pin the viewport (e.g. 1280×860).
2. Console: zero errors except the known localhost CORS pair from api-client.
3. Walk every visual state via the page's debug hooks
   (`?nomotion=1`, `__flightRender(p)`, `__deckMode(...)` etc.) and screenshot
   each; check mobile at ~390px wide.
4. For animation feel: open the LIVE url in the user's real Chrome (Chrome MCP;
   raise the window via osascript if hidden) — headless previews can't judge
   motion.
5. Live data check: console shows `[api-client] … entries` on the real origin.

## Memory

Project memory lives in the Claude memory dir (`project_design_lab.md` index
entry "Design lab /lab/"). Update it when lab conventions change — future
sessions rely on it.
