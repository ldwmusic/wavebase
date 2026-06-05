---
name: add-surfspots
description: Add new surf-spot entries to the SurfGoose database, one at a time, with verified Open-Meteo climate data, multi-source research, and per-entry approval. Trigger explicitly with a region argument, e.g. "/add-surfspots Heraklion" or "voeg de spots in Tarifa toe".
---

# add-surfspots

You add new surf-spot entries to the SurfGoose database one careful step at a
time. The job is **research + verification + curation**, not bulk import. Every
spot you add will be visible to real visitors and quoted as honest. The whole
skill is built around three rules you must never break:

1. **Verify, don't sketch.** Coords, sport-fit, character, season pattern —
   every claim needs at least two independent sources. Climate values come from
   Open-Meteo, never invented.
2. **Per-entry approval.** Never POST a spot to the live API without Lode's
   explicit go for THAT specific spot. No batch-commits.
3. **Honest fine print.** When you don't know something, say so in the entry's
   own copy. "Wave height varies — we don't have hard data for this break" is
   better than a confident invented range.

## When this skill fires

Lode invokes you explicitly with a region argument. Recognised phrasings:

- "Voeg de surfspots van Heraklion toe"
- "Doe de spots in Tarifa"
- "Add surf spots for north Portugal"
- "Need spots: Xeropotamos Beach, Arina Beach" (named candidates)
- Or via the Skill tool with `region` or `candidates` in the args

If Lode says something that sounds related but doesn't explicitly invoke this
skill, **do not silently launch into this workflow** — ask whether he wants
the skill or just a casual conversation.

When called as a sub-step of `add-surfcenters` (because a center needs a
linked spot that doesn't exist yet), you still run the full 6 gates per spot —
the spot has its own approval moment. The center workflow waits for spots to
land before back-filling `linked_spot_id`.

## The reference shape — match Belgium / Greece / Morocco

The bar is set by spots that are already live. Always sanity-check your
draft against ONE of these three reference spots before previewing:

- **Oostduinkerke-Bad** (Belgium) — beach-break shape, editorial layers
  ("Why surfers come here vs. other Belgian beaches" + "What the data
  actually says"), Marine API + KMI climatology fallback for water_c.
- **Kouremenos Beach** (Greece) — wind-driven spot, topic-block layers
  ("The wind & water" + "The region & getting there"), East Crete
  climatology fallback for water_c.
- **Anchor Point** (Morocco) — point-break shape, single layer ("The
  surf"), uses **Windguru GFS-Wave 16km archive** for waves because
  Open-Meteo Marine returned nulls for that coord. Wave-source fallback
  is real and pre-approved.

Every new spot must carry the same rich shape. Anything thinner reads as
half-finished and breaks the consistency that makes the site feel
trustworthy.

Pull the reference live with:
```
curl -s "https://wavebase-api-qqwt.onrender.com/surf-spots/" \
  | python3 -c "import json,sys; print(json.dumps([x for x in json.load(sys.stdin) if x['name']=='Oostduinkerke-Bad'][0], indent=2))"
```

Per spot you fill:

| Block | What's in it | Source |
|---|---|---|
| `name`, `town`, `tagline` | Identity | Local naming + your one-line characterisation |
| `country_id` | FK to countries collection | Existing entry only — don't add new countries |
| `sports[]` | Which disciplines work here | Reviews + center listings, not assumption |
| `levels[]` | Beginner / intermediate / advanced | Reviews + spot guides |
| `good_months[]` | Months when the spot actually works | Open-Meteo + local guides |
| `coords[lat,lng]` | Verified via Chrome MCP | NEVER guess |
| `google_maps_query` | Reliable Maps link for this exact place | Test it |
| `coords_label` | Human note ("North end of the bay, past the harbour") | Your call |
| `photo` | URL | Optional — leave null if no clean rights-cleared photo |
| `summary[]` | 3-6 short prose bullets, honest | Distilled from research |
| `story[]` | 1-3 paragraph narrative block | Editorial voice, source-backed |
| `layers[]` | Layered detail panels — title set is **free per spot**, not a fixed vocabulary. Pick titles that fit the spot's character (editorial-comparative like Oostduinkerke, topic-block like Kouremenos, or a single panel like Anchor Point). 1-3 layers is typical. | Recent reviews + spot guides; cite each one in `layer.source` |
| `educational[]` | Q&A accordion ("Why this spot is like this") — **mandatory template, see Hard Gate 6**: Q about wind always, Q about waves if it's a wave spot, Q spot-specific always. Min 3 questions. | Surf-guide reasoning + reviews + meteorology / geology / local history |
| `conditions` | At-a-glance prose: wave_type, wave_height, wind, water, crowd | Combined sources |
| `stats` | Structured data: 9 monthly arrays + periods[] + narrative fields | Open-Meteo + reviews |
| `nearby` | Food / parking / rental | Reviews + Maps |
| `ideal_for`, `not_ideal_if` | One line each | Who should pick this, who shouldn't |

## Process — nine gates, in order

### Gate 1 · Scope confirmation (always ask before you start research)

The region might be ambiguous. Before any web fetches or Open-Meteo calls, ask
Lode 1-3 of these (only the ones that materially change the work):

- **Geography**: full region or sub-area? (e.g. "Heraklion stad of de hele
  noordkust van Kreta?")
- **Sport coverage**: surf only, or also windsurf / kite / wing-foil / SUP /
  sail? (Some spots host all five.)
- **Existence cutoff**: only spots with reviews ≤ 4 years old, OR include
  classic spots with older sources flagged as "review-data dated"?
- **Quantity cap**: top-N by repute, or every spot that passes the bar?
- **Center backlink**: are any of these spots needed because a center already
  references them? (Surf In Crete + iKiTe right now both need Heraklion spots
  for their `linked_spot_id`.)

If Lode has already specified some in the invocation, skip those.

### Gate 2 · Survey existing spots

Before researching anything new, check what's already in the database for that
region. Use the public API:

```
GET https://wavebase-api-qqwt.onrender.com/surf-spots/
```

Filter client-side by `country.name` matching the region's country and by
`town` matching the area. List the existing spots back to Lode so we don't
duplicate. If a candidate later in your research matches an existing entry by
name + coords (≤ 200 m apart), **propose an update** (PUT) rather than a
duplicate insert.

### Gate 3 · Research each candidate (exhaustive review scan)

#### Pre-step — cross-reference center directories

**Before** finalising the candidate spot list, scan the region's
school/center directories for beach names. Schools teach at beaches
that don't always appear in pure surf-spot guides — tourism stretches
like Agia Marina, Kalamaki, Platanias, Damnoni were missed in the
first Crete spots batch because cretanbeaches/thesurfatlas focus on
"famous breaks" while school operations sit at the more
accessible-from-resort beaches. Sources to scan for beach names:

- SurfIsland, KretaSurf, Surfincrete, Kalo Surf, Chania Surf Club style
  multi-station operations — they list every beach where they teach
- TripAdvisor "Best [Region] Surfing/Windsurfing/Kitesurfing" listings —
  each school's profile carries its beach name
- IKO / ISA / ASI / BookSurfCamps / Sunbonoo operator listings
- Local school websites — most list "spots we teach at" alongside
  their primary base

Capture EVERY beach name a school mentions, then dedupe against your
existing candidate list and the live spots DB. Any beach with an
operating school is a candidate spot, even if no surf-guide lists it.

#### The main scan — every review platform you can find

For every candidate spot, scan **every review platform you can find** —
not just enough to hit a "3-source minimum". The minimum is enforced as
a safety floor, but the discipline is exhaustive: every spot deserves
the broadest research net we can practically cast. Reviews are the
heart of the site (this is a memory rule), and a shallow scan
shortchanges the visitor relying on us.

#### Mandatory scan list — check each per spot, document why if skipped

Visit each of these platforms for every spot. If a platform has no
reviews / no entry for the spot, note that ("Google Maps: no reviews
for this break") — don't silently skip.

- **Google Maps reviews** — the broadest pool, search the spot name + town
- **TripAdvisor** — for the beach + for any school operating there
- **Wannasurf** — surf-specific spot atlas (often dated but still useful)
- **Magicseaweed / Surfline / Surf-forecast** — spot forecast + community ratings
- **Windguru / Windfinder** — forecast page comment streams + spot ratings
- **Surf-related blogs** — Surfertoday, Sessions Travel, regional surf magazines
- **Operator listings** — IKO (kite), ISA / ASI (surf), BookSurfCamps, Sunbonoo
- **Local school websites** — they describe their home break in detail
- **Reddit** — `/r/surfing`, `/r/kitesurfing`, country-specific subreddits

**Don't scan**: YouTube, Instagram, Facebook. Social-media reaction
content isn't text-review signal — it's noise plus copyright + privacy
landmines. Stick to the platforms above.

If a source surfaces information that contradicts the others (e.g.,
locals say "always crowded" but TripAdvisor says "quiet"), capture
both perspectives in the spot's prose with soft language rather than
picking a winner.

#### What to extract per spot

Beyond the standard fields above, extract:

- **Bottom**: sand / sand+rocks / reef / cobblestone. Critical for safety
  framing. Goes in `stats.bottom` and influences the story.
- **Wave character**: A-frame, point break, beachie, reform — verify across
  sources.
- **Wind direction it likes**: cross-shore / onshore / offshore — goes in
  `stats.wind_direction`.
- **Localism**: low / moderate / high — only assert "low" if multiple recent
  reviews mention friendly locals or a relaxed line-up.
- **Crowd**: low / moderate / high — `stats.crowd` AND `conditions.crowd`.
- **Season pattern**: which months work best. This will be cross-checked
  against Open-Meteo (Gate 4).

**4-year review-freshness rule** (memory):

> Experience MUST come from reviews ≤ 4 years old. Climate baselines and
> bottom type are timeless, but the "what's it like" prose must lean on
> recent reviews.

If you can only find reviews from before 2022 → don't add the entry. Surface
it to Lode as "Skipped: only stale reviews available, last from 2019".

### Gate 4 · Open-Meteo climate fetch (the data spine)

Every spot's `stats` block is grounded in two Open-Meteo API calls. These are
free, no API key needed, and produce hard numbers we can stand behind.

**Coord verification first** — before any climate call, use the Chrome MCP
geocoding workflow to lock the spot's exact `[lat, lng]` (see Gate 5).
Open-Meteo calls fail silently for off-shore coords, so for surf spots use the
spot's break centroid — usually a few hundred metres off the beach line.

#### Call 1 · Wind, gust, air-temp (5-year historical, daytime only)

```
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude=<lat>
  &longitude=<lng>
  &start_date=<5y ago, e.g. 2021-05-20>
  &end_date=<60 days ago, e.g. 2026-03-22>
  &hourly=wind_speed_10m,wind_gusts_10m,temperature_2m
  &wind_speed_unit=kn
  &timezone=auto
```

From the hourly response, **filter to daytime only: hours 10–18 local time,
both endpoints inclusive — so 9 hours per day** (10, 11, 12, 13, 14, 15,
16, 17, 18). Over a 5-year archive this is ~16,400 sampled hours per spot,
which matches Oostduinkerke-Bad's published "16,407 hours sampled". This
matches when people actually surf.

From the daytime subset, compute per calendar month (Jan..Dec, 12 values
each):

- `monthly_wind_kn[12]` — mean daytime wind speed
- `monthly_gust_kn[12]` — mean daytime gust
- `monthly_daily_peak_kn[12]` — **avg of per-day max GUST in daytime**
  (NOT peak wind — the chart label and panel both expect peak gust here,
  matches the Kouremenos reference convention). For each day's daytime
  window: take max gust, then average those per-day max-gusts per month.
- `monthly_gust_peak_kn[12]` — **absolute single-hour max GUST across the
  whole 5-year archive**, per month. This is the "max ever recorded" in
  the daytime window — useful as the upper-bound storm-day reference.
- `monthly_wind_prob[12]` — share of days where mean daytime wind ≥ workable
  threshold. **Default baseline**: 12 kn for windsurf/kite, 15 kn for wing.
  **Override per spot** when local norm clearly differs — e.g. a light-wind
  beachie where everything ≥ 8 kn is rideable, or a heavy-wind point where
  the regulars only paddle out above 18 kn. When you override, mention the
  threshold in the spot's `stats.source` line so it's transparent.
- `monthly_air_c[12]` — mean daytime air temperature

**CRITICAL — wind-array semantics convention (Crete-batch lesson):**

The frontend chart reads `monthly_daily_peak_kn` AS-IF it's peak GUST
(see `app.js` line 1429 comment). Both Kouremenos and the live
reference spots store peak GUST there, not peak wind. If you store
peak wind instead, the "Gust" bars on the spot page show ~10 kn for
known windy spots — visibly broken on first inspection.

Correct field semantics — copy this convention exactly:

| Field | What goes in |
|---|---|
| `monthly_wind_kn` | mean daytime wind speed |
| `monthly_gust_kn` | mean daytime gust |
| `monthly_daily_peak_kn` | **avg of per-day MAX GUST** in daytime |
| `monthly_gust_peak_kn` | **absolute single-hour MAX GUST** across 5y archive |

**Mandatory sanity-check before PATCH** — compare your computed values
to live reference spots, fix before pushing:

```python
# Run this on every spot before PATCH
print(f"  wind_jul = {monthly_wind_kn[6]}      (Kouremenos: 16.0)")
print(f"  gust_jul = {monthly_gust_kn[6]}      (Kouremenos: 34.0)")
print(f"  daily_peak_jul = {monthly_daily_peak_kn[6]}  (Kouremenos: 36.0 — must be > gust_jul)")
print(f"  gust_peak_jul = {monthly_gust_peak_kn[6]}   (Kouremenos: 52.0 — must be > daily_peak_jul)")
```

**Three red flags** (any of these = wrong array, stop and fix):

1. `monthly_daily_peak_kn[6]` < `monthly_gust_kn[6]` → you stored peak
   wind, not peak gust. Peak gust must be ≥ mean gust by definition.
2. `monthly_daily_peak_kn[6]` < 20 kn for a meltemi-fed Greek spot →
   same problem.
3. `monthly_gust_peak_kn[6]` < `monthly_daily_peak_kn[6]` → you stored
   avg-of-peaks for both. Absolute max must be the bigger number.

Pull the live Kouremenos values for comparison:
```
curl -s "https://wavebase-api-qqwt.onrender.com/surf-spots/" \
  | python3 -c "import json,sys; s=[x for x in json.load(sys.stdin) if x['name']=='Kouremenos Beach'][0]['stats']; \
print('Kouremenos:'); \
print(f'  wind={s[\"monthly_wind_kn\"][6]} gust={s[\"monthly_gust_kn\"][6]} '\
      f'daily_peak={s[\"monthly_daily_peak_kn\"][6]} gust_peak={s[\"monthly_gust_peak_kn\"][6]}')"
```

Round all values to one decimal place.

#### Call 2 · Wave, swell, sea-surface temp (2-year Marine API)

```
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude=<lat>
  &longitude=<lng>
  &start_date=<2y ago>
  &end_date=<60 days ago>
  &hourly=wave_height,swell_wave_height,sea_surface_temperature
  &timezone=auto
```

Compute:

- `monthly_wave_m[12]` — mean significant wave height per month
- `monthly_swell_prob[12]` — share of days where mean swell_wave_height ≥
  workable threshold (0.6 m for beach breaks, 1.0 m for points/reefs)
- `monthly_water_c[12]` — mean sea-surface temperature

If the Marine API returns nulls (happens for spots tucked inside bays or
estuaries — and notably for the Moroccan Atlantic cluster), the approved
fallback chain is:

1. **Windguru GFS-Wave 16km archive** for the nearest forecast point — this
   is what Anchor Point uses (`Windguru GFS-Wave 16km archive (Taghazout
   id 549853, Apr 2025–May 2026)`). Requires a public Windguru spot id +
   manually compiled monthly means.
2. **Regional climatology** from a reputable source (KMI for Belgium,
   regional pilot charts) — only for `monthly_water_c[12]` when the SST
   reading is the bit that's missing.
3. **Skip the array entirely** + write an honest gap line in the layers.
   Better than invented numbers.

**Always note which path you took in `stats.source`** — never silently
invent.

#### Compose `stats.periods[]`

Group the 12 months into named season blocks based on the climate arrays AND
local-knowledge sources from Gate 3. Each period gets:

```
{
  "name": "Peak summer",         // human label that surfers use
  "months": [6, 7, 8],           // which calendar months
  "tier": "peak",                // peak | high | low | off
  "wind_kn": [12.5, 18.0],       // [min mean, max mean] across those months
  "water_c": [22.0, 25.0],
  "wave_m": [0.4, 0.7]           // ranges, not averages — let the user see spread
}
```

Tiers are deliberate — we skip "shoulder" by design. A spot's months are split
across 2-4 periods total, and **off** is real — if Open-Meteo + reviews agree
that the spot effectively doesn't work in December-February, write that period
in.

#### Build `stats.source` (mandatory transparency string)

The footer attribution must include:
- Which API endpoints were called
- The exact coords used
- The date range (so users can re-run the call if they want)
- The number of hours sampled
- Any climatology fallback you used and why

Reference shapes from the three live anchor spots — copy this voice:

> **Oostduinkerke-Bad** (Marine API path):
> "Wind / air / gust: Open-Meteo historical GFS @ 51.142, 2.697 (daytime
> 10–18h, 2021-05-20 → 2026-05-16, 5y archive, 16,407 hours sampled). Wave
> height: Open-Meteo Marine API @ same coords (2024–2025, 2y). Water temp:
> KMI Belgian coast climatology."

> **Kouremenos Beach** (no wave array, climatology water temp):
> "Wind/gust/air: Open-Meteo historical GFS at 35.2058,26.2706 (daytime
> 10–18h, 2021-05-16–2026-05-16, 5-year avg). Water temp: East Crete
> Mediterranean climatology."

> **Anchor Point** (Windguru wave fallback):
> "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–
> May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256
> (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the
> cluster). Water temp: Morocco Atlantic coast climatology."

This goes in `stats.source` verbatim, adapted to the spot's coords + actual
sources used. Users see it in the at-a-glance footer.

#### Pick `stats.chart_type`

- `wave` for breaks where wave height drives the surf decision (Atlantic
  beach breaks, points, reefs)
- `wind` for breaks where wind drives it (windsurf/kite spots like
  Kouremenos, Tarifa, Boa Vista)

### Gate 5 · Coord verification — HARD GATE, no POST without this

SurfGoose uses Chrome MCP to pull exact Google Maps coordinates without
needing a Google API key. **This gate is non-negotiable: no spot ships
without per-spot coord verification.** Research-derived coords are
unreliable — beach names like "Chrissi Akti" (Golden Beach), "El Palmar",
"Stalida" exist in dozens of places, and Greek transliteration variants
('Komos' vs 'Kommos' vs 'Κόμμος') silently land on the wrong pin. The
Crete batch of June 2026 burned this lesson: 5 of 11 batch-POSTed spots
had coords ≥2 km off the actual beach — one was 7 km off, one was so
unverifiable it had to be deleted.

#### Per-spot verification workflow (mandatory)

1. Use `mcp__claude-in-chrome__navigate` to open
   `https://www.google.com/maps/search/?api=1&query=<name+town+Crete>`
2. Wait ~5 seconds for Google to redirect to a specific `place/.../@lat,lng,zoom` URL
3. Read the URL via `tabs_context_mcp` — extract the `@lat,lng` block
4. For spots without a discrete Maps place (a stretch of coast, an unnamed
   reef), drop a pin at the break centroid and read the coords from the URL
5. Open the place's "About" panel where one exists, copy the canonical name +
   address back to confirm
6. Build a `google_maps_query` that, appended to `https://www.google.com/maps?q=`,
   lands on the same spot. **Test it.** If it doesn't, fall back to passing
   the raw `lat,lng` as the query.

#### Delta-check (mandatory before POST)

Compute the haversine distance between your verified coord and any
research-derived starting coord. If the delta is:

- **≤ 1 km** → OK, proceed to POST
- **1 – 2 km** → CHECK: re-read the Maps page; pick the coord that's
  clearly on the beach (not in a village inland). Note the delta in
  `stats.source`.
- **≥ 2 km** → **STOP AND RE-RESEARCH**. Your starting coord was wrong,
  which means either (a) you searched the wrong name variant, (b) there
  are multiple places with this name, or (c) the source you trusted is
  unreliable. Pick the verified coord, then **re-pull Open-Meteo at the
  new coord** if the move crossed an Open-Meteo grid cell (~10 km
  resolution at this latitude; a 7 km move in latitude almost always
  changes the cell).
- **Cannot find a unique place** → DELETE the candidate from your queue
  and surface it to Lode as "Skipped: unverifiable identity, source
  named this spot but Google Maps + OSM disagree".

#### OSM Nominatim as a sanity-check sidecar

For a fast independent second opinion, query OSM Nominatim:
```
curl "https://nominatim.openstreetmap.org/search?q=<name>&format=json&limit=3" \
  -H "User-Agent: SurfGoose/1.0 (lode.b162@gmail.com)"
```
Compare OSM's top hit against your Google Maps coord. If they're ≥2 km
apart, BOTH need a closer look — usually one of them is hitting a
similarly-named place elsewhere.

Anti-pattern from the Belgium audit: "Akti Villas" matched a wholly different
hotel because we searched by name only. Anti-pattern from the Crete batch:
"Golden Bay" matched a JUMBO supermarket 20 km from where the spot
description said it was. Always match by **name + location + visible
coastline shape**, and run the delta-check before POST.

#### No batched WORK on any per-spot step

The Crete batch tried to shortcut this gate by trusting research-derived
coords for 11 spots after Chrome-MCP-verifying the first 3. Five spots
landed wrong. The same batch also templated educational[] and layers[]
across all 11 spots — producing 1 generic Q&A per spot ("What sport
works best here?" → restated metadata) instead of the mandated 3
mechanism-based Qs.

**Per-spot discipline applies to EVERY step except the optional Monday
update**: research, Open-Meteo aggregation, coord verification, prose,
layers, educational, conditions, periods. None of these get batched
across spots. What's batched is the GO/SKIP/EDIT decision in Gate 7,
and the actual POST loop in Gate 8 — never the content authoring.

When Lode says "GO ALL", that means "approve all the previews I've
shown you" — not "skip the per-spot work that comes before the
previews".

### Gate 6 · Educational[] template — HARD GATE, mandatory shape per spot

The `educational[]` block is the "Why this spot is like this" accordion.
It is where the site earns trust — answers explain MECHANISMS (wind
physics, swell geography, local geology, history) not just facts. A
visitor who already read the summary should still learn something here.

#### Mandatory shape (non-negotiable)

Every spot has **minimum 3 Q&As**, each starting with "Why":

1. **Q1 — Why is the wind the way it is?** Always present, even for
   pure wave spots. Explains the meteorology behind the spot's wind
   pattern: thermal lows, Atlantic depressions, meltemi onset, land/sea
   breeze cycle, etc.

2. **Q2 — Why are the waves the way they are?** Mandatory if the spot
   is a wave spot (`sports` includes `"wave"`). Explains swell origin,
   refraction, bottom geology, why the wave breaks the way it does.
   For pure wind/kite spots: skip this Q and move Q3 up.

3. **Q3 — Why is THIS spot specifically [some local feature]?** Always
   present. The thing that makes this spot different from its neighbours
   — geology, history, micro-climate quirk, unusual access, bottom
   change, regional anomaly. This Q can't be reused across spots.

4. **Q4 (optional, for flagship spots)** — extra distinctive
   characteristic: crowd dynamics, cultural significance, hazard worth
   calling out.

A common pattern across the live reference spots:
- Q1 + season Q ("Why is high season X-Y?") shared across spots in the
  same region (same meteorology, same answer — write it once, copy it
  to the regional siblings).
- Q2 + Q3 fully unique per spot.

#### Answer style (also mandatory)

- **50–100 words per answer — snappy insight, not a mini-lecture.**
  Name the mechanism, give one or two specifics, stop. The reader is
  scanning, not studying. If you wrote a paragraph break, you went too
  long.
- **Markdown bold for key terms** (e.g., `**Atlantic storm season**`,
  `**thermal wind**`, `**flat reef**`). This is how the reference spots
  do it and the site renders it.
- **One concrete `source` per Q** (the reasoning source — surf-guide,
  meteorology textbook, local center quote, observation).
- **No questions that restate metadata.** ❌ "What sport works best
  here?" with answer "Wave + SUP, beginner-friendly" — that's already
  in `sports[]` and `levels[]`. Hard-banned.
- **No competitive / comparative questions.** ❌ "Why pick X over Y?",
  ❌ "Why is X better than [other spot]?", ❌ "Why is X less crowded
  than Y?" Every spot page stands alone — readers shouldn't see one spot
  trash-talk another, and we shouldn't be building an internal ranking
  through the back door. The spot-specific Q3 must explain a feature of
  THIS spot in its own right (geology, history, micro-quirk, local
  culture, hidden trait) without naming another spot as a reference.

#### Concrete reference examples (live spots — copy this voice)

The 6 anchor reference spots all follow this template. When unsure,
pull one of these via `GET /surf-spots/` and study its `educational[]`:

| Spot | Q1 (wind) | Q2 (wave or spot) | Q3 (spot) | Q4 if any |
|---|---|---|---|---|
| Oostduinkerke-Bad (BE) | "Why is the wind here so reliable?" | "Why are there no groynes here — and why does it matter?" | "Why is high season September–March (despite being cold)?" | — |
| De Haan Beach (BE) | "Why is the wind here so reliable?" | "Why are the sandbanks cleaner here — and why does that occasionally produce real waves?" | "Why is high season September–March?" | — |
| Florizoone Surfput (BE) | "Why is the wind lighter and gustier here than at the coast?" | "Why is there a flat-water put in the middle of Flemish farmland?" | "Why is high season May–September?" | — |
| Kouremenos Beach (GR) | "Why is the wind here so reliable?" | "Why does the bay work for both beginners AND advanced?" | "Why is high season June–September?" | — |
| Faneromeni (GR, wave) | (Q2 = wind) "Why is the wind side-shore here?" | (Q1) "Why are the waves like they are — mast-high on meltemi?" | "Why is high season both summer AND winter?" | "Why is it expert-only — what makes it heavy?" |
| Anchor Point (MA, wave) | "Why is the wind like it is — offshore mornings, side-shore afternoons?" | "Why is the right so long — peeling over a kilometre?" | "Why does it only really work October–April?" | "Why is it Morocco's flagship — and why does that make it busy?" |

#### Anti-patterns (DO NOT REPEAT — Crete-batch lesson)

- ❌ One templated Q per spot that restates metadata
- ❌ Same Q-set across multiple spots (Q1+Q3 in same region is OK; all
  3 the same is lazy)
- ❌ One-sentence answers
- ❌ Mini-lecture answers (>100 words) — readers scan, they don't study
- ❌ Q's that don't start with "Why"
- ❌ **Competitive Qs** ("Why pick X over Y?", "Why is X better/less
  crowded than Y?") — every spot stands alone
- ❌ Skipping the wind Q on a wave spot ("it's not the main thing here") —
  wind always matters, always Q
- ❌ Skipping the wave Q on a wave spot
- ❌ Generic answers without named mechanisms (no "Atlantic depressions",
  no "thermal low", no "flat reef" → not enough)

### Gate 7 · Preview per spot, one at a time

For each spot you've researched + climate-fetched, build a preview block and
STOP. Output looks like:

```
NEW SPOT (candidate 1 of N): Xeropotamos Beach
  Town:           Heraklion
  Country:        Greece
  Sports:         wave, sup
  Levels:         beginner, intermediate
  Coords:         35.3402, 25.2701  (Chrome MCP verified, Maps URL tested)
  Bottom:         sand
  Wave type:      A-frame beach break
  Wind direction: N / NW best (offshore)
  Crowd:          low (3 of 4 recent reviews: "rarely more than 5 surfers")
  Localism:       low
  Chart type:     wave

  Climate (Open-Meteo, see footer attribution):
    Peak summer (Jun-Aug):  air 27°C, water 23°C, wave 0.4-0.7 m, wind 8-12 kn
    Best surf  (Oct-Mar):   air 16°C, water 18°C, wave 0.8-1.6 m, wind 10-18 kn
    Off       (Apr-May):    flat most of the time

  Sources used:
    - Wannasurf:        https://wannasurf.com/spot/Europe/Greece/Crete/Xeropotamos/
    - Magicseaweed:     spot exists, no character beyond "exposed beach break"
    - Google Maps:      4.5/5 from 47 reviews, 2023-2025
    - Local center:     Surf In Crete description (they teach here)
    - Open-Meteo:       5y wind archive + 2y marine, see stats.source

  Review-freshness:   PASS (8 reviews from 2023-2025)
  Needed by center:   Surf In Crete (id 7e08d31b-...), iKiTe (id 03e05a18-...)

  [Reply with: GO | SKIP | EDIT <note>]
```

Then **wait**. Don't research the next spot until Lode replies. If he says
`GO`, POST and move on. If `SKIP`, skip silently. If `EDIT <note>`, adjust
per his instruction and re-preview the same spot.

This is non-negotiable — batch-commits are forbidden.

### Gate 8 · Commit via API

Only after a `GO` for that specific spot, POST it:

```
POST https://wavebase-api-qqwt.onrender.com/surf-spots/
  Authorization: Bearer <admin JWT>
  Content-Type: application/json
  Body: <the SurfSpotCreate payload>
```

Auth: the admin JWT lives in `localStorage['wavebase_auth_token_v1']` of
Lode's browser on `wavebase.lode-b162.workers.dev`. If you don't have a token,
ask Lode to run a small helper snippet in the admin console to copy his JWT —
don't try to proxy it any other way.

After each successful POST, briefly confirm the new spot's ID + a link to
its detail page (`spot.html?id=<the-slug>&type=spot`) so Lode can visually
verify it appears correctly on the live site.

### Gate 9 · Back-fill linked centers (if applicable)

If this spot was needed by an existing center (Gate 1 told you so), after
POSTing the spot:

```
PATCH https://wavebase-api-qqwt.onrender.com/centers/<center-id>
  Body: { "linked_spot_id": "<new-spot-id>" }
```

This unlocks the center's at-a-glance section, which is otherwise empty (the
bug we hit with Surf In Crete + iKiTe — `const inherited = (e.type ===
"center" && e.linkedSpotId)` returns false when `linkedSpotId` is missing).

Confirm the center's `spot.html?id=<center-id>&type=center` now renders a
populated at-a-glance.

## Anti-patterns (DO NOT REPEAT)

- ❌ Inventing climate values because "the Marine API was slow today" — wait,
  retry, or honestly note climatology fallback.
- ❌ Using a 2018 surf-blog post as the "what it's like" basis — must be ≤ 4
  years for experience claims.
- ❌ Searching Google Maps by NAME only — picks the wrong El Palmar.
- ❌ POSTing a spot without `stats.source` filled — breaks the transparency
  contract.
- ❌ Setting `crowd: "low"` without multi-review evidence — soft language until
  multi-source consensus.
- ❌ Filling all 12 months of `monthly_wave_m` from a single 2-week forecast.
  Must be from the 2-year Marine archive.
- ❌ POSTing five spots at once "to save time".
- ❌ Writing copy that sounds confident when reviews disagree — soft language
  ("some surfers report") until you have multi-review consensus.
- ❌ Skipping the educational[] block "because the rest is already long".
  Other regions all have it; consistency matters.
- ❌ Forgetting to back-fill `linked_spot_id` on the center that needed this
  spot. The whole reason you might be running is to fix that center.

## Period-tier discipline — "peak" = when THIS spot is at its best

**The June 2026 Praia do Norte feedback:** I labeled all newly-added Portugal
spots' winter period as `tier="peak"` regardless of spot type. That was wrong
for beginner + kite/wing spots. LDW caught it because Praia do Norte's
"BEST MONTHS" showed Jun/Jul/Aug — but Praia do Norte is a big-wave spot
that only works on huge winter NW swells. The fix went into the frontend
(pickPeakPeriod now respects tier rank + chart-type) AND the data layer
(re-tier periods correctly per spot type).

**Period-tier rule per spot type:**

| Spot type | Levels | Peak season | Why |
|---|---|---|---|
| Big-wave specialist | advanced (big-wave) | **Winter** | Only works on big NW swells |
| Advanced wave | advanced | **Winter** | Cleaner powerful winter swells |
| Intermediate wave | intermediate | **Winter shoulder** | Clean swells + manageable size |
| Beginner wave | beginner only | **Summer** | School season + small waves + light wind |
| Kite/wing/wind | kite/wing | **Summer** | Peak thermal nortada — most riding days |
| Wave + beginner serves both | beginner+advanced | **Either — depends on emphasis** | Use tier "peak" for the season that matches the spot's PRIMARY user |

**Concrete: for the periods array, pick which one gets tier="peak"**:

- ONE period per spot should have `tier="peak"` (the actual best season)
- Other periods: `tier="high"` (workable), `"shoulder"` (transitional), `"low"` (off-season)
- The frontend's `pickPeakPeriod` uses tier rank first — so this label drives
  the "Best months" display directly. Tier-rank: peak > high > shoulder > low.

**Anti-pattern — DON'T do this:**
```python
# WRONG — same template for all spots
periods = [
    {"name": "Peak winter", "months": [12,1,2,3], "tier": "peak", ...},
    {"name": "Shoulder",    "months": [4,5,10,11], "tier": "high", ...},
    {"name": "Summer",      "months": [6,7,8,9],   "tier": "high", ...}
]
```
Use this only for advanced/big-wave/intermediate wave spots where winter
genuinely IS the best season. For beginner + kite/wing spots, swap the
tier assignment so summer (or whichever season is actually best for THAT
spot type) gets `tier="peak"`.

## Pre-POST schema cheat-sheet (Pydantic SpotCreate)

The Peniche/Baleal batch of June 2026 burned 4 retries figuring out the exact
shape of the POST body. Capture for future regions:

**Required top-level fields (Pydantic raises 422 if missing):**
- `name`, `town`, `country_id` — strings/UUID
- `coords` — `[lat, lng]` floats
- `sports` — list of SportType enum (`wave|wind|kite|wing|sup|sail`)
- `levels` — list of SurfLevel enum (`beginner|intermediate|advanced`)
- `tagline` — string (1 line)
- `good_months` — list of int 1-12 (**NOT** `best_months` — common mistake)
- `ideal_for` — string (1 line, who should go)
- `not_ideal_if` — string (1 line, who should skip)

**Nested object shapes (Pydantic strict — string ≠ object):**
- `conditions` — dict with `wave_type`, `wave_height`, `wind`, `water`, `crowd` keys
  - `conditions.crowd` is `{"level": "low|moderate|high|very high", "note": "..."}` — **NOT a string**
- `stats` — dict with monthly arrays + meta:
  - `wind_direction`, `wave_type`, `bottom`, `localism`, `source` — strings
  - `crowd` — enum string (`low|moderate|high|very high`) — **NOT prose**
  - `monthly_wind_prob`, `monthly_wind_kn`, `monthly_gust_kn`, `monthly_daily_peak_kn`, `monthly_gust_peak_kn`, `monthly_wave_m`, `monthly_swell_prob`, `monthly_air_c`, `monthly_water_c` — arrays of length 12 (null OK per month)
  - `periods` — list of `{name, months[], tier, wind_kn[min,max], water_c[min,max], wave_m[min,max]}`
  - `chart_type` — `"wave"` or `"wind"`
- `educational[]` — each item needs `source` + `q` + `a` (source NOT optional on POST, even though the GET response often shows it absent)
- `layers[]` — each item has `title` + `source` + `content[]`; **`content[]` items are `{heading, text}` dicts**, NOT bare strings
- `nearby` — `{food, parking, rental}` object, NOT a string

**Center extras (CenterCreate):**
- `good_months` required (same as spot)
- `nearby` same `{food, parking, rental}` object shape
- `services` = `{lessons, rental, brands, facilities, team}` — all strings
- `prices` matches the established tier dict shape
- `linked_spot_id` is the spot UUID — POST spots FIRST, capture IDs, then POST centers with linkage

**Smoke test before a batch:** POST one minimal payload first with only the
required-at-the-top fields. Read the 422 response to enumerate any new fields
you missed. Iterate the script until you get a 200 on one entry — THEN batch
the rest. This saves the per-entry retry cycle.

## Spelling + label conventions (memory)

- "Palekastro", not "Palaikastro" (the village in east Crete).
- "centers", not "centres" — site uses US spelling throughout.
- Don't translate place names that have a canonical local spelling — use what
  appears on local sources.
- `wind_direction` values: write as `"N / NW (offshore)"` or `"Cross-shore
  from W"` — readable, not bare compass.

## Stop-criteria — when to pause and ask Lode

Pause and ask, don't guess, when:

- A candidate matches an existing spot by name + coords (≤ 200 m). Propose
  UPDATE not INSERT.
- Reviews are all > 4 years old. Skip-or-include is Lode's call.
- A spot has multiple distinct breaks within walking distance (a long beach
  with a north peak and south peak that behave differently). Ask whether each
  break is its own entry or one umbrella entry.
- Open-Meteo Marine API returns nulls for this coord. Ask whether to fall
  back to climatology or skip the wave numbers entirely.
- The country isn't in our DB yet. Stop entirely and flag.
- The spot is closed to the public, dangerous beyond beginner reach in any
  weather, or a known no-go for foreigners. Flag, don't add quietly.

## After all spots in the region are done

Summary table to Lode:

| Spot | Status | Note |
|---|---|---|
| Xeropotamos Beach | Added | id: abc-123; Surf In Crete back-filled |
| Arina Beach | Added | id: def-456; iKiTe back-filled |
| Vai Beach | Skipped | only 2019 reviews |
| Malia Reef | Update | refreshed monthly arrays + crowd note |

Then ask if Lode wants to do another region, run `add-surfcenters` for the
same area, or wrap up. **Don't auto-trigger Monday updates or any other
reporting** — Lode will ask explicitly if he wants those.

## Output style

**Language — strict bilingual split, no mixing:**

1. **CONVERSATION with Lode** = Dutch primary, English fallback for technical
   terms. This means everything you say in chat to Lode.

2. **EVERYTHING WRITTEN TO THE DATABASE = ENGLISH ALWAYS.** No exceptions.
   SurfGoose is for international visitors who don't read Dutch. Every field
   that ends up on a public spot/center page must be in English:
   - `tagline`, `coords_label`, `summary[]`, `story[]`, `conditions.*`,
     `stats.*` (prose fields), `educational[].q`, `educational[].a`,
     `layers[].title`, `layers[].source`, `layers[].content[].heading`,
     `layers[].content[].text`, `nearby.*`, `ideal_for`, `not_ideal_if`,
     `services.*`, `prices.*_note`, `prices.source`.

**The June 2026 Peniche/Baleal mistake:** I wrote the educational[] Q&A's
in Dutch for 6 new spots because the skill said "Dutch primary". LDW caught
it visually on the spot page. Fix took a translate-all-6 pass. The skill now
makes the language split unambiguous: chat=Dutch, site=English.

- Concrete, short, no fluff.
- Every climate value cites Open-Meteo with its coord + sample size.
- Every experience claim cites a recent (≤ 4y) review source.
- When uncertain in chat, say "ik weet dit niet" or "kan ik niet verifiëren".
  In site content, say "not verified" or "specifically: not published" — never
  shift the Dutch hedging-phrase into English content.
