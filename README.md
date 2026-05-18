# WaveBase

Honest surf, windsurf and wing-foil guide. No marketing spin — what a spot or
stay is really like, by season, for your level, based on recent reviews.

Live: https://wavebase.lode-b162.workers.dev

---

## Who this README is for

**You (Lode)** — so you can maintain the site yourself for most edits,
without needing a developer or AI. Anything you can't find here is either
in the code as a comment or in a previous Claude conversation.

A future developer or contributor can also use this to get oriented in
~10 minutes.

---

## Quick start for the impatient

**To change text or add a spot:**
1. Open the file (see "Where things live" below) in any editor
2. Save
3. In Terminal:
   ```
   cd "/Users/ldw/AEPIC PLATFORM Dropbox/Lode De Waegenaere/CLAUDE/SURFSPOT WEBSITE"
   git add .
   git commit -m "short description"
   git push
   ```
4. Wait ~1 minute → it's live

**For non-text edits (CSS, JS):** also bump the `?v=NNN` numbers in every
HTML file before pushing. See "Cache busting" below.

**Don't like the terminal?** Use [GitHub Desktop](https://desktop.github.com)
— click "Commit" and "Push origin" instead of typing commands. Or edit
files directly on github.com/ldwmusic/wavebase (pencil icon → edit → commit).

---

## Architecture in 60 seconds

- **Static site** — plain HTML, CSS, JS. No frameworks, no build step, no
  npm. Open any `.html` file in a browser and it works.
- **Deployed via Cloudflare Workers** from GitHub. Push to `main` →
  Cloudflare auto-rebuilds in about a minute.
- **All content lives in `data.js`** as a single JavaScript array.
- **No backend, no database** (yet). Phase 2 will change that.

That's it. Anyone who knows HTML/CSS/JS can maintain this.

---

## Where things live

| File | What it holds |
|---|---|
| `index.html` | Discover page (home — hero, search, filters, results) |
| `spot.html` | Detail page used for every spot, stay, and center |
| `kaart.html` | Map tab (Leaflet) |
| `compare.html` | Compare tab (scoreboard) |
| `account.html` | My WaveBase (fake account — localStorage only) |
| `continent.html` | Continent overview (reached from the world map) |
| `about.html` | About page |
| `data.js` | **All content** — spots, stays, centers, towns, destinations |
| `app.js` | All UI logic — rendering, filters, charts, search, etc. |
| `account.js` | Fake-account module (profile, saved, trips, reviews) — uses `localStorage`, no server |
| `styles.css` | All styling. Colors live at the very top in `:root` |
| `worldmap.svg` | World map for the landing page (CC BY-SA, see Credits) |
| `og-image.png` | Image shown when you share a link on WhatsApp, social, etc. |
| `icon.svg` | Favicon / app icon |
| `manifest.json` | PWA / install-on-iOS metadata |

---

## Common edit recipes

### Change a tagline / description / intro

Search the text in `data.js`. Each entry has:
- `tagline` — short blurb on the card
- `verhaal` — story paragraphs on the detail page
- `samenvatting` — bullet summary
- `lagen` — labeled detail blocks
- `ideaalVoor` / `nietIdeaalAls` — who-it's-for / who-not bullets

Hit save, push. Done.

### Add a new spot

The fastest way: copy an existing spot entry in `data.js`, paste it
elsewhere in the array, then change:

- `id` — unique slug (lowercase, dashes, no spaces). Used in URLs.
- `type` — `"spot"`
- `country` — must match a country name in `WAVEBASE_DESTINATIONS`
- `name`, `town`, `tagline`
- `coords` — `[latitude, longitude]`. Easiest: right-click on Google Maps
  → copy coordinates → paste here
- `levels` — array, e.g. `["beginner","intermediate"]`
- `sports` — array, e.g. `["wave"]` or `["wind","kite","wing"]`
- `goodMonths` — array of month numbers when the spot is rideable
- `stats` — block with `periods`, `monthlyWindKn`, `monthlyAirC`, etc.
  (Easiest: copy a similar spot's stats block and edit values.)
- All the prose fields (`verhaal`, `samenvatting`, `lagen`, etc.)

### Add a new stay or center

Same as a spot but:
- `type` — `"stay"` or `"center"`
- Stays have a `verblijf` block with style/vibe/scores instead of `stats`
- Centers can have `linkedSpotId` — that links them to a spot so they
  inherit its wind/wave/temp data

### Add a new country to the "soon" list

Edit `WAVEBASE_DESTINATIONS` at the bottom of `data.js`. Find the
continent, add to its `countries` array:

```js
{ name: "Sri Lanka", flag: "🇱🇰", status: "soon" }
```

When you actually have content for it later, change `"soon"` to `"live"`.

### Tweak colors

Top of `styles.css`, in `:root`:

```css
--sea: #3f6f7d;
--clay: #bd6242;
--sand: #e7dcc4;
...
```

Change a value, save, bump `?v=NNN`, push.

### Tweak the About page

`about.html` — straight HTML. Edit, push, done.

### Update fonts

Look in any HTML file for the Google Fonts `<link>` near the top.
Currently using Fraunces (serif headings) + DM Sans (body).

---

## Cache busting (important!)

When you change `styles.css`, `app.js`, `data.js`, or `account.js`, **bump
the `?v=NNN` numbers in every HTML file**, otherwise visitors will keep
seeing the old cached version.

Easiest way — in Terminal, from the project folder:

```bash
sed -i '' 's/v=133/v=134/g' *.html
```

(Replace `133` with whatever the current version is, and `134` with the
new one.)

Or in VS Code / TextEdit: find-and-replace across all `.html` files.

For pure HTML edits (e.g. changing About text), you don't need to bump —
HTML isn't cached.

---

## How deployment works

1. You `git push` to `origin/main` on GitHub
2. Cloudflare Workers picks up the change automatically
3. ~1 minute later, the site at `wavebase.lode-b162.workers.dev` is updated

No staging environment, no manual deploy step. Just push.

If you ever want to move off Cloudflare: this is plain static files. You
can host this anywhere — Netlify, Vercel, GitHub Pages, your own server,
a USB stick (joking, mostly). Nothing about the code is locked to
Cloudflare.

---

## Local development

Most edits you can verify by just opening `index.html` in a browser
(double-click the file). But a few things need a local web server:
- The mini world map SVG (loaded via `fetch()`)
- Some `localStorage` features
- Cross-page navigation that uses absolute paths

To run a local server:

```bash
cd "/Users/ldw/AEPIC PLATFORM Dropbox/Lode De Waegenaere/CLAUDE/SURFSPOT WEBSITE"
python3 -m http.server 8765
```

Then open http://localhost:8765 in a browser. Stop the server with Ctrl-C.

---

## Map of `app.js`

It's a single ~3,500 line file. The big sections, in order:

| Where | What |
|---|---|
| Top of file | Constants: sport icons, country coords, ISO→continent table |
| `getStatsFor` / `userSelectedMonth` / etc. | Helpers used everywhere |
| `seasonForMonth` / `cardHTML` | Card rendering (used on Discover, Compare, etc.) |
| `buildDualBarChart` / `buildSingleMetricChart` / `monthlyChartHTML` | Monthly wind/temp/wave bar charts on spot pages |
| `wireChartTooltips` | Hover popovers on the bar charts |
| `renderStatsTicker` / `renderMiniWorldMap` / `renderPeakingCarousel` | Landing-page extras |
| `runSearch` | Discover-page search and filtering logic |
| `initIndex` | Discover page init |
| `initSpot` | Spot detail page init (the big one — most prose rendering happens here) |
| `initMap` | Map tab init |
| `renderAccount` / `renderCompare` | Account + Compare tab rendering |
| `initContinent` | Continent overview page |
| `initDestinations` / `openDestinationsMenu` | The "Where?" / Destinations dropdown |
| `initMobileTabbar` | Bottom nav on mobile |
| `wireHeaderSearch` | Persistent search bar in the header on non-Discover pages |
| End of file | Router — picks which `init...()` to call based on which page is loaded |

---

## What's NOT in this codebase (yet)

This is Phase 1 — a prototype. The following are deliberately out of scope:

- **Real database** — content lives in `data.js`
- **Real user accounts** — `account.js` only uses browser `localStorage`
- **Real reviews** — same as above, previews only
- **Admin panel** — edits happen via Git for now
- **Booking / affiliate links** — placeholder
- **Image uploads** — no spot photos yet (we use solid-color thumbs)
- **Multi-language** — English only

Each of these is a deliberate Phase 2 decision, not an oversight.

---

## Memory for Claude / future helpers

A few things that are easy to forget:

- **Spelling**: the Cretan village is **Palekastro**, not Palaikastro.
- **Review freshness**: experience-based info (crowds, locals, recent
  conditions) must come from reviews ≤4 years old. Static offerings
  (rentals, food) can come from anywhere.
- **Centers** (the surf-school kind), spelled American — not "centres".
- **Don't invent**: coords, booking links, claims about spots must be
  sourced or honestly flagged as inferred. Honesty is the brand.

---

## Credits

- World map SVG: **Al MacDonald** —
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via
  [github.com/cablop/simple-world-map-by-continents](https://github.com/cablop/simple-world-map-by-continents)
- Historical wind / gust data: [Open-Meteo](https://open-meteo.com)
- Spot ratings & narratives: see each entry's `source` field — typically
  Windguru, Beach-Inspector, Booking, OpenStreetMap, plus first-hand
  visits.

---

## Roadmap (rough, not a promise)

- **Now (Phase 1)** — prototype, static, content-curated, getting feedback
- **Next** — content expansion (Portugal, more Crete, more Morocco)
- **Phase 2** — backend, real accounts, real reviews, admin panel
- **Phase 3** — multi-contributor (regional editors), business profiles,
  affiliate booking

---

*Built with care. Maintained by the owner, not the framework.*
