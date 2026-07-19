---
name: add-surfcenters
description: |
  Add new surf-center entries to the SurfGoose database for a given region. Walks
  the full process: scope-check, survey existing centers, research each candidate
  via 3 independent sources, verify coords via Chrome MCP geocoding, build a
  preview card per center, and POST only after Lode's explicit go for that entry.
  Region is passed as an argument (e.g. "Kreta", "noord-Frankrijk", "Tarifa").
  Lode invokes this skill explicitly — never auto-trigger from conversational
  mentions of surf centers.
---

# add-surfcenters

You add new surf-center entries to the SurfGoose database one careful step at a
time. The job is **research + verification + curation**, not bulk import. Every
center you add will be visible to real visitors and quoted as honest. The whole
skill is built around three rules you must never break:

1. **Verify, don't sketch.** Every claim (existence, sport, prices, reviews)
   needs at least two independent sources.
2. **Per-entry approval.** Never POST a center to the live API without Lode's
   explicit go for THAT specific center. No batch-commits.
3. **Honest fine print.** When you don't know something, say so in the entry's
   own copy. Better an honest gap than a confident invention.

## When this skill fires

Lode invokes you explicitly with a region argument. Recognised phrasings:

- "Voeg alle surfcenters van Kreta toe"
- "Doe de surfcenters in Tarifa"
- "Add surfcenters for north Portugal"
- Or via the Skill tool with `region` in the args

If Lode says something that sounds related but doesn't explicitly invoke this
skill ("we hebben centers in Tarifa nodig"), **do not silently launch into this
workflow** — ask whether he wants the skill or just a casual conversation.

## Process — six gates, in order

### Gate 1 · Scope confirmation (always ask before you start research)

The region might be ambiguous. Before any web fetches, ask Lode:

- **Geography**: full region or sub-area? (e.g. "Kreta — heel het eiland of
  alleen oost waar we al actief zijn?")
- **Sport coverage**: surf only, or also windsurf / kite / wing-foil / SUP?
- **Existence cutoff**: only centers with reviews ≤ 4 years old, OR include
  centers with older reviews flagged as "review-data dated"?
- **Quantity cap**: top-N by reputation, or all that pass the bar?

Ask 1-3 of these questions, not all four — pick the ones that materially change
the work. If Lode has already specified some in the invocation, skip those.

### Gate 2 · Survey existing centers AND existing spots

Before researching anything new, check BOTH collections for that region:

```
GET https://wavebase-api-qqwt.onrender.com/centers/
GET https://wavebase-api-qqwt.onrender.com/surf-spots/
```

Filter client-side by `country.name` matching the region's country. List both
back to Lode. Two things matter:

1. **Existing centers** — don't duplicate. If a candidate later in your
   research matches an existing entry by name + town + coords, **propose an
   update** (PUT) rather than a duplicate insert.
2. **Existing spots** — the centers will need to link to one of these via
   `linked_spot_id`. If the spots for this region aren't in the DB yet, you
   have to add them FIRST (see Gate 3.5 below) — otherwise the center page
   won't render its "At a glance" block (wave / bottom / wind dir / crowd /
   locals + monthly charts), which is the single most important section a
   surfer reads.

### Gate 3.5 · Hard gate — no linked spot, no center POST

**Before researching or POSTing any center, you MUST verify there's a matching
surf spot in the DB for the beach/spot the center teaches at.** Look it up by
name OR by coords-proximity (within ~500 m of the center).

If the matching spot is **missing**:

1. **STOP.** Do not POST the center.
2. Report to Lode with the candidate centers + the missing spots.
3. Ask: (a) add the missing spots first via the `add-surfspots` skill (or
   inline if that skill isn't built yet) and link the centers after, OR
   (b) skip these centers entirely for this run, OR (c) POST without
   linked_spot_id (rendering an incomplete page — only do this if Lode
   explicitly accepts).

Why this gate matters: the "At a glance" panel on a center page is rendered
from `statsPanelHTML(e)` which only fires when `e.type === "center" &&
e.linkedSpotId`. Without that link, the wave / bottom / wind / crowd / locals
block + monthly charts simply don't render. The center page looks half-empty
compared to existing centers like Gone Surfing Crete or Freak Surf which
correctly link to their underlying spot.

This is non-negotiable and overrides Lode's "just do all the centers" override
from any earlier in the session — quality > velocity.

### Gate 3 · Research each candidate (exhaustive review scan)

For every candidate center, scan **every review platform you can find** —
not just enough to hit a "3-source minimum". For centers, **reviews matter
more than for spots**: a center is a commercial operation that customers
have actually paid, taken lessons at, and rated. Their reviews are the
single highest-signal source about whether the center is honest,
well-run, safe, and worth recommending. A shallow research pass on a
center directly shortchanges the visitor — they pay €60-150 per session
based on what we say. The 3-source minimum is a safety floor; the
discipline is exhaustive.

#### Mandatory scan list — check each per center, document why if skipped

Visit each of these platforms for every center. If a platform has no
listing / no reviews, note that ("Booking.com: no listing for this
school") — don't silently skip. Pull review counts + star ratings +
recent verbatim quotes (≤4 years).

- **The center's own official website — scan ALL sub-pages, not just
  the landing or location-specific page**. The mandatory sub-pages:
  - **Service pages:** `/rental/`, `/lessons/`, `/prices/`,
    `/courses/`, `/equipment/`, `/programs/`, `/camps/`
  - **Booking pages** (where solo-instructor operators often hide
    their only price table): `/booking/`, `/book-now/`, `/booking-surf-class/`,
    `/reservations/`, `/reserve/`, `/classes/`, `/book-a-lesson/`
  - **Organization pages:** `/about/`, `/team/`, `/contact/`,
    `/instructors/`
  - **Photo/media pages** sometimes used for promotional pricing:
    `/photos/`, `/gallery/`, `/news/`, `/blog/`

  **Two specific failure modes the Crete + Ericeira batches taught:**
  
  *SurfIsland (Crete, June 2026):* I wrote "prices not published"
  after only checking `/falasarna-station/`. The full euro tables
  sat at `/rental/` and `/lessons/` — flagship pages that ALL
  multi-station chains use. Always check the org-wide pricing
  pages, not just the per-station landing page.
  
  *Surf with Pepe (Ericeira, June 2026):* I wrote "prices not
  publicly listed; book direct" after only checking the homepage.
  The €40/2hr group rate was clearly listed at
  `/booking-surf-class` — a booking-specific URL that I'd missed.
  Always check `/booking*` and `/book*` patterns specifically for
  small / owner-operator schools where the booking page IS the
  pricing page.

  **The discipline rule:** if you couldn't find prices on the
  obvious pages, run a `site:officialsite.com price` Google search
  before declaring "not published". If the operator publicly
  accepts bookings online, the price almost certainly exists
  somewhere on their site.
- **Google Maps** — review count + average rating + recent verbatim
  ("watch out for the rocks", "Marios is a brilliant teacher", etc.).
  Often the highest-volume review pool for non-Anglo schools.
- **TripAdvisor** — frequently the largest individual review pool for
  watersport schools. Pull recent + look for repeated themes (safety,
  instructor quality, equipment freshness)
- **Booking.com** — if center is school+stay, the property page has
  reviews from paying customers. Even if not a stay, sometimes linked
  via adventure-package operators
- **IKO / ISA / ASI / IRSC / WSL** — international federation directories
  (IKO for kite, ISA/ASI for surf). Confirms certification, which is a
  signal of safety + insurance + teaching standards. For German-speaking
  regions (DACH lakes, German coast) add the **VDWS station finder** —
  there it's the primary directory, not IKO.
- **Trustpilot** — less common for surf schools but check it: the Salty
  Kitesurfschool complaint pattern (lesson cancellations + refund
  refusals, May 2026) surfaced here and on Google while the official
  site was spotless. Exactly the honest signal we exist for.
- **Operator aggregators** — BookSurfCamps, Sunbonoo, Surf-Camp.com,
  Adventure-Travel. Often have their own filtered review streams
- **Wannasurf school listings** — surf-specific, often dated but
  occasionally surfaces niche centers
- **Surf-related blogs** — Surfertoday, Sessions Travel, regional
  surf-press, country-specific blogs
- **Reddit** — `/r/surfing`, `/r/kitesurfing`, country-specific
  subreddits. Search for the center name + town

**Don't scan**: YouTube, Instagram, Facebook. Social-media reaction
content isn't text-review signal — it's noise plus copyright + privacy
landmines.

**Capture this per center**, in addition to the standard fields:
- Total review count across platforms (e.g., "324 reviews aggregated:
  Google 156, TripAdvisor 89, Booking 79")
- Average star rating per platform
- 3-5 verbatim quotes from recent (≤4y) reviews — these go into the
  `layers[]` block as evidence
- Recurring themes (positive + negative) — the negative themes are
  especially important for `not_ideal_if`

If a source surfaces information that contradicts the others (e.g.,
official site says "all levels" but reviews say "beginners only — got
overwhelmed as intermediate"), capture both perspectives with soft
language rather than picking a winner.

#### Acceptable additional sources (cite but don't substitute for the above)

- Center's own description of the home spot
- Windguru / Magicseaweed reviews of the linked spot (climate baseline)
- Wikipedia for geographic context only

What to extract per center:

| Field | Where to get it | Notes |
|---|---|---|
| `name` | Official site title | Exact spelling, never paraphrase. Memory: "Palekastro" not "Palaikastro", "centers" not "centres". |
| `town` | Official site or Google Maps address | The town as a surfer would call it, not the postal town. |
| `country_id` | Existing country in DB | Don't add new countries here; if missing, flag and stop. |
| `tagline` | Compose from research (one line) | Honest one-liner, e.g. "Windsurf school on the lagoon side of Tarifa". |
| `sports` | Official site's lessons / rental sections | Use SportType enum: `wave`, `wind`, `kite`, `wing`, `sup`, `sail`. |
| `levels` | Official site | Use SurfLevel enum: `beginner`, `intermediate`, `advanced`. |
| `coords` | Chrome MCP geocoding (see Gate 4) | NEVER guess — must be verified. |
| `google_maps_query` | Use the canonical name + town | Skip (set to false) if name is generic; otherwise let the URL render. |
| `coords_label` | A human note about location | e.g. "On the beach road just south of the harbour". |
| `linked_spot_id` | Existing spot in our DB if any | Match by spot name + coords. Empty if the center isn't at one of our spots. |
| `booking_url` | Official site URL | NEVER an affiliate URL we haven't been given. |
| `services.lessons` | Official site lessons section | Prose, 1-3 sentences. Cite the source in `layers[]`. |
| `services.rental` | Official site rental section | Same. |
| `services.brands` | Official site or recent reviews | Only if explicit, never assumed. |
| `services.facilities` | Official site + recent reviews | What's actually on the premises. |
| `services.team` | Official site + reviews | Optional — only if there's something distinctive to say. |
| `prices.tier` | Comparative to other centers in country | `budget` / `comfortable` / `premium`. |
| `prices.group_lesson_eur` | Official site, **only if listed** | Mark `verified: "YYYY-MM"` if from official source. Otherwise leave null + add a `prices.source` note like "estimate based on regional average". |
| `prices.*_note` | Optional context | e.g. "includes wetsuit + board". |
| `summary[]` | 3-6 short prose bullets | Honest, source-backed. |
| `story[]` | 1-3 paragraph block | Editorial voice, fed by your research. |
| `layers[]` | Layered detail panels | Each has `title`, `source`, `content[]`. Layers are where you cite sources properly. |
| `nearby` | Optional | Food / parking / rental near the center. |
| `ideal_for` / `not_ideal_if` | One line each | Optional but high-value: who should pick this center, who shouldn't. |

**4-year review-freshness rule** (memory):

> Experience MUST come from reviews ≤ 4 years old. Offerings can come from
> anywhere (the lessons + rental sections of the official site are current by
> definition). The "what's it like" prose must lean on recent reviews.

If you can only find reviews from before 2022 → don't add the entry. Surface it
to Lode as "Skipped: only stale reviews available, last from 2019".

### Gate 4 · Coord verification via Chrome MCP

Memory: SurfGoose uses Chrome MCP to pull exact Google Maps coordinates without
needing a Google API key. Workflow:

1. Use `mcp__Claude_in_Chrome__navigate` to open `https://www.google.com/maps?q=<name>+<town>`
2. Wait for Maps to redirect from `?q=` to `/maps/place/...` — this can take
   6-10 seconds. Use a JS poll loop that checks `window.location.href` every 1s
   for up to 15s until the `!3d/!4d` pattern appears.
3. Extract the place pin coord from the URL's **`!3d<lat>!4d<lng>`** pattern
   (NOT the `@<lat>,<lng>` which is the map's viewport center — they can
   differ by 200m+).
4. Confirm the page title shows the right business name. If Maps redirected
   to a generic search results page (no `/place/` in URL), the search was
   ambiguous — fall through to the search-results DOM scrape with a
   **name-substring filter** to ignore competitor results:
   ```js
   const cards = Array.from(document.querySelectorAll('a[href*="/maps/place/"][aria-label]'));
   const matches = cards.map(a => {
     const m = a.href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
     return {name: a.getAttribute('aria-label'), coords: m ? [+m[1], +m[2]] : null};
   }).filter(m => m.coords && /<center-name-substring>/i.test(m.name));
   ```
5. Build a `google_maps_query` that, when appended to `https://www.google.com/maps?q=`,
   reliably lands on the exact same place. Test it.

Anti-pattern from the Belgium audit: "Akti Villas" matched a wholly different
hotel because we searched by name only. Always match by **name + location**.

**Shop ≠ station.** Established schools often keep a SHOP in the village
and the teaching STATION on the beach — and Maps/OSM frequently pin the
shop. kitesurfing.at's OSM node sat 2.3 km south of its actual Nordstrand
station (Jul 2026); "Devil's Rock" auto-query landed on the surf SHOP.
The center's pin is the STATION (where lessons happen, per their own
site's location page). If your only coord is a shop, it isn't verified
yet — find the station, and mention the shop in `coords_label` if it's
useful.

If the place can't be uniquely identified (multiple matches, vague name), stop
and ask Lode rather than guess.

#### Hard Gate 4.5 · No-shared-coords check (mandatory before POST)

**Before POSTing any batch of centers, scan the candidate list for shared
coords.** Two centers sharing exactly the same `[lat, lng]` is almost always
a sign that you fell back to a placeholder ("village center", "old town")
instead of looking each one up individually.

The Ericeira batch of June 2026 violated this and 8 centers ended up with
identical coord `(38.965, -9.418)` — Ericeira village centroid. LDW's
screenshot showed those 8 pins clustered at the shoreline, several IN THE
OCEAN. Fix took a full re-verification round of 22 centers.

**The rule:**
- Every center MUST have its OWN verified `!3d/!4d` coord from Chrome MCP.
- If your candidate list shows two centers with identical first-4-decimal
  coords (~10m precision), STOP and re-verify both before POSTing.
- Acceptable exception: the same physical building has two named entities
  in it (e.g., a shop + the school running from the same address). Log
  this explicitly in `coords_label` for both.

**Why the shoreline anti-pattern is dangerous:** at most surf-village
coastlines, the village centroid sits within ~50m of the water on at
least one cardinal direction. A placeholder coord at "village center"
almost always lands at or past the shoreline for some pin orientations
— and a pin in the water is the kind of visible error that destroys
trust in the whole site.

**Operational discipline:** when adding 5+ centers in one region, the
verification time per center is ~10s via Chrome MCP. There's no excuse
for falling back to placeholders. If you can't get Chrome MCP coords
for a specific center (rare — no Maps listing exists), surface that
to Lode as a candidate-for-deletion rather than POSTing with a
placeholder.

#### Hard Gate 4.6 · "Pin must be on land" — visual-clarity check

**Even when Google Maps returns a coord, that coord can land in the
ocean.** Two failure modes the Peniche batch hit:
- Happy Days Surf's Maps registered place pin was literally at
  (39.385, -9.437) — 1.5 km offshore in open Atlantic. The operator
  has no fixed beach office; Google's data was wrong.
- Supertubos's Maps coord put it 1 km off the actual beach (Praia dos
  Supertubos at 39.344, -9.363 not 39.358, -9.434).

**Rule: after Chrome MCP returns a coord, sanity-check it before POST:**

1. **Centers must be on land/beach.** Never in open water. If Maps'
   coord lands in the ocean (very low longitude on Atlantic coasts,
   etc.), fall back to the nearest beach where the operator actually
   teaches. Add a `coords_label` explaining: "Multi-beach operator —
   pinned at primary lesson beach since operator has no fixed office."
2. **Spots can be on the beach or just offshore — never far offshore.**
   The wave breaks 80-150m from shore for most beach breaks. Pin at
   the BEACH (visually anchored) rather than at the exact wave-break
   coord (visually orphaned in the blue). Big-wave/reef-only spots may
   need offshore pins but flag those explicitly.
3. **If Maps gives you an obviously-wrong coord** (in the ocean for a
   land business, on a different coastline, etc.), search again with a
   more specific query OR fall back to a sensible beach approximation
   and document the substitution.

The June 2026 LDW feedback explicitly said: "If there is no clear
location available, you may consider to take the assumption that a
surf center should always be on the main land and/or beach, never
fully surrounded by water. If unclear, pin at the closest beach."

#### Hard Gate 4.7 · booking_url must resolve — verify EVERY link at creation

**Pre-POST check, no exceptions: every `booking_url` must be a link that
actually opens for a visitor.** This is the single most-reported center bug.
Na Onda Surf School (Peniche) shipped `naondasurf.com` = NXDOMAIN. Worse, a
whole batch shipped plausibly-constructed-but-WRONG domains — Michiel caught
F400 Surfschool (`400surfschool.com`) plus an Ericeira batch (`7aessencia.com`,
`extrasurf.pt`, `boardculturesurf.com`, `hostel-surfcamp-55.com`,
`lacasaatlantica.com`) in June 2026: **10 dead links across the catalog**, all
guessed from the school's name. **Never construct a domain from a name — only
ship a URL you have actually fetched and seen load.**

**How to test (GET, browser UA, follow redirects — NOT a bare HEAD, which many
sites answer with 403/405):**
```bash
curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15" \
  -o /dev/null -w "%{http_code}" --max-time 20 "$URL"
```
Classify:
- **200 / 3xx** → works, use it.
- **403 / 405 / 429** → the site is UP but bot-blocks automated requests
  (Cloudflare etc.); it opens fine for a real visitor — **accept the URL, do
  NOT reject a link over a 403.**
- **000 / "Could not resolve host" / connection refused / timeout** → the
  domain is DEAD (DNS/NXDOMAIN). Real broken link — must fix.
- **404** → retry the ROOT domain (`https://host/`). Root works → use the root
  or the corrected path. Whole domain 404s → treat as dead.

**When the official site is genuinely gone** (dead domain, unpublished Wix,
hijacked/parked/spam, empty placeholder): don't ship a dead link and don't
silently drop the button. Point `booking_url` at the operator's **active
Instagram or Facebook page** instead (verify it loads) — a working social link
beats a dead website (LDW decision, June 2026; applied to BoardCulture, La Casa
Atlantica, Kite and Foil). Only if there's no working site AND no active social
→ `booking_url: null`, or delete the center if we can't link to it at all.

Match the replacement to the RIGHT operator (name + location), same rigor as the
coords check — a same-name business elsewhere is not a fix.

#### Hard Gate 4.8 · Brand-vs-Maps mismatch hard-stop

**Already covered above as Gate 4 brand-vs-Maps cross-check — but
the Sea View Surf Camp / Pure Sea View Surfcamp failure in June 2026
proves it needs sharper teeth:** Maps' "Open in Google Maps" link for
"Sea View Surf Camp" in Portugal resolved to "Pure Sea View Surfcamp"
in Morocco. Same word "Sea View" → completely different business in
a completely different country. Visitors clicked through and got
mis-directed.

**Rule: if your candidate center's name doesn't have an EXACT Maps
match for the right country, STOP.** Don't approximate, don't trust
"close enough", don't POST hoping nobody will click the Maps link.
Either: (a) find the operator's actual Maps listing with a more
specific query, (b) skip the center entirely, or (c) flag the
mismatch in `coords_label` AND set `google_maps_query: false` so the
"Open in Google Maps" button is hidden for this entry.

#### Brand-vs-Maps cross-check — mandatory red-flag detection

**When you search the center's name in Google Maps and the results return
different brand names**, that's a red flag for brand fragmentation.
Investigate before POSTing. Common patterns:

- **Multi-station chain with local brand:** the parent operates under one
  name (e.g. "SurfIsland") but each station markets to its local customer
  base under a different brand (e.g. SurfIsland Elafonisi → "The Wind
  Tribe Crete"). Maps surfaces the local brand because that's what
  customers Google for. The Crete batch hit this: my "SurfIsland Elafonisi"
  entry had no Maps pin, while "The Wind Tribe Crete" had 79 reviews
  and its own dedicated brand identity at the same beach.

- **Rebrand or recent name change:** the official site still uses an
  older name but Maps + Google Search have shifted to the new brand.

- **Same operation, multiple Maps listings:** two pins for what's one
  business — usually a duplicate someone forgot to merge.

**How to verify the link is the same operation:**

1. Same phone number on both sites?  → strong evidence same op
2. Same equipment brand partnerships? → moderate evidence
3. Same on-beach team named in both review streams? → moderate evidence
4. Same coords (within ~200 m)? → moderate evidence
5. Cross-mentions on either site? → strong evidence

**What to do when you confirm same operation, two brands:**

Don't POST both as separate entries (duplicate listings confuse visitors).
Instead: POST the customer-facing brand (the one with the Maps pin +
review history) and add a layer that discloses the parent-brand
relationship. The Crete lesson: "The Wind Tribe Crete is SurfIsland's
Elafonisi-station customer-facing brand; same operation, two URLs,
shared booking phone +30 6976990850."

When you're unsure whether it's one operation or two, surface to Lode
with the evidence and ask.

### Gate 5 · Preview per center, one at a time

For each center you've researched, build a preview block and STOP. Output looks
like:

```
NEW CENTER (candidate 1 of N): Freak Surf Center
  Town:           Palekastro
  Country:        Greece
  Sports:         windsurf, wing-foil
  Levels:         beginner, intermediate, advanced
  Coords:         35.2008, 26.2664  (Chrome MCP verified)
  Linked spot:    → Kouremenos Beach (existing in DB)
  Booking URL:    https://freaksurfcrete.com
  Tagline:        Windsurf school on the wind-blessed Kouremenos Bay

  Prices:
    Group lesson: €45  (verified — their site, 2026-01)
    Private/hr:   €60  (verified)
    Rental/day:   €40
    Tier:         comfortable

  Sources used:
    - Official site:    https://freaksurfcrete.com
    - Booking reviews:  4.7/5 from 89 reviews (2023-2025)
    - TripAdvisor:      4.5/5 from 34 reviews (2024-2025)
    - Google Maps:      4.6/5 from 156 reviews (verified existence + coords)

  Review-freshness:   PASS (12 reviews from 2024-2025)

  [Reply with: GO | SKIP | EDIT <note>]
```

Then **wait**. Don't research the next center until Lode replies. If he says
`GO`, POST and move on. If `SKIP`, skip silently. If `EDIT <note>`, adjust per
his instruction and re-preview the same center.

This is non-negotiable — batch-commits are forbidden.

### Gate 6 · Commit via API

Only after a `GO` for that specific center, POST it:

```
POST https://wavebase-api-qqwt.onrender.com/centers/
  Authorization: Bearer <admin JWT>
  Content-Type: application/json
  Body: <the CenterCreate payload>
```

Auth (verified June 2026): the admin JWT lives in
`localStorage['wavebase_auth_token_v1']` on **surfgoose.com** (NOT the old
`wavebase_jwt` / workers.dev — that note is stale). Preferred, token-never-in-
transcript way: drive the call from Lode's logged-in surfgoose.com tab via
`WaveBaseAuth.authFetch(path, opts)` (Chrome MCP `javascript_tool`), which
prepends the API base + bearer. Same mechanism works for `PATCH /centers/{id}`
with a free-form body like `{booking_url: "..."}` (used to repair the 10 dead
links). Use top-level `await (async()=>{...})()` in the JS tool so the promise
resolves.

After each successful POST, briefly confirm the new center's ID + a link to
its detail page (`spot.html?id=<the-slug>&type=center`) so Lode can visually
verify it appears correctly on the live site.

## Anti-patterns from the Belgium audit (DO NOT REPEAT)

- ❌ Inventing a "regional tier" label without checking other centers in the
  same area first.
- ❌ Claiming a center has X-brand equipment without an explicit source.
- ❌ Using a 2018 review as the "what it's like" basis — must be ≤ 4 years.
- ❌ Searching Google Maps by NAME only and picking the first result.
- ❌ Setting `prices.verified` without a real source URL.
- ❌ POSTing five centers at once "to save time".
- ❌ Writing copy that sounds confident when reviews disagree — soft language
  ("some surfers report") until you have multi-review consensus.

## Spelling + label conventions (memory)

- "Palekastro", not "Palaikastro" (the village in east Crete).
- "centers", not "centres" — site uses US spelling throughout.
- Don't translate place names that have a canonical local spelling — use what
  appears on the official site.

## Stop-criteria — when to pause and ask Lode

Pause and ask, don't guess, when:

- A candidate matches an existing center by name + town. Propose UPDATE not INSERT.
- Reviews are all > 4 years old. Skip-or-include is Lode's call.
- A center clearly has multiple branches (Tarifa is full of these). Ask whether
  each branch is its own entry or one umbrella entry.
- A center exists on Booking but has no website of its own. Ask whether to
  proceed with Booking-only sourcing or skip.
- The country isn't in our DB yet. Stop entirely and flag — countries are added
  by a separate process.

## After all centers in the region are done

Summary table to Lode:

| Center | Status | Note |
|---|---|---|
| Freak Surf Center | Added | id: abc-123 |
| Kouremenos Surf | Skipped | only 2019 reviews |
| Hotel-X-included | Updated | refreshed prices + facilities |

Then ask if Lode wants to do another region or wrap up. **Don't auto-trigger
reporting** — one brein logboek entry per batch (Monday is retired); anything
more only when Lode asks.

## Output style

**Language — strict bilingual split, no mixing:**

1. **CONVERSATION with Lode** = Dutch primary, English fallback for technical
   terms.

2. **EVERYTHING WRITTEN TO THE DATABASE = ENGLISH ALWAYS.** No exceptions.
   SurfGoose is for international visitors. Every field on a public center
   page must be in English: `tagline`, `coords_label`, `summary[]`, `story[]`,
   `services.*`, `layers[].title/source/content`, `nearby.*`, `ideal_for`,
   `not_ideal_if`, `prices.*_note`, `prices.source`.

- Concrete, short, no fluff.
- Every claim cites its source inline.
- In chat, "ik weet dit niet" / "kan ik niet verifiëren" is fine.
  In site content, write "not published" / "not verified" / "contact direct".
