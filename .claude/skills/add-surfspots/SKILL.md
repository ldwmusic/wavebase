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
| `educational[]` | Q&A accordion ("Why this spot is like this") | Surf-guide reasoning + reviews |
| `conditions` | At-a-glance prose: wave_type, wave_height, wind, water, crowd | Combined sources |
| `stats` | Structured data: 9 monthly arrays + periods[] + narrative fields | Open-Meteo + reviews |
| `nearby` | Food / parking / rental | Reviews + Maps |
| `ideal_for`, `not_ideal_if` | One line each | Who should pick this, who shouldn't |

## Process — six gates, in order

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

### Gate 3 · Research each candidate (3-source rule)

For every candidate spot, gather information from at least 3 independent
sources. Don't trust any single one. Acceptable sources:

- Wannasurf / Magicseaweed / Surfline spot pages
- Windguru / Windfinder forecast pages (for the climate baseline they imply)
- Surfertoday or other surf-press features
- Recent (≤ 4 years) reviews on Google Maps, TripAdvisor, surf blogs
- Reports / videos from local centers (who know their break)
- The center's own description of the spot, if one teaches there
- Wikipedia for geographic context (bay, river mouth, reef vs beach) — never
  for character or sport-fit

What to extract per spot, beyond the standard fields above:

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
- `monthly_daily_peak_kn[12]` — for each day's daytime window, take the max
  wind speed, then average those per-day peaks per month
- `monthly_gust_peak_kn[12]` — same logic for gusts
- `monthly_wind_prob[12]` — share of days where mean daytime wind ≥ workable
  threshold. **Default baseline**: 12 kn for windsurf/kite, 15 kn for wing.
  **Override per spot** when local norm clearly differs — e.g. a light-wind
  beachie where everything ≥ 8 kn is rideable, or a heavy-wind point where
  the regulars only paddle out above 18 kn. When you override, mention the
  threshold in the spot's `stats.source` line so it's transparent.
- `monthly_air_c[12]` — mean daytime air temperature

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

### Gate 5 · Coord verification via Chrome MCP

SurfGoose uses Chrome MCP to pull exact Google Maps coordinates without
needing a Google API key. Workflow:

1. Use `mcp__claude-in-chrome__navigate` to open `https://www.google.com/maps`
2. Search the spot's name + town + "beach" or "surf spot"
3. Once the place card loads, the URL contains `@lat,lng,zoom` — extract those
4. For spots without a discrete Maps place (a stretch of coast, an unnamed
   reef), drop a pin at the break centroid and read the coords from the URL
5. Open the place's "About" panel where one exists, copy the canonical name +
   address back to confirm
6. Build a `google_maps_query` that, appended to `https://www.google.com/maps?q=`,
   lands on the same spot. **Test it.** If it doesn't, fall back to passing
   the raw `lat,lng` as the query.

Anti-pattern from the Belgium audit: "Akti Villas" matched a wholly different
hotel because we searched by name only. For spots: a break called "El Palmar"
might match a town hundreds of kilometres away. Always match by
**name + location + visible coastline shape**.

If the place can't be uniquely identified, stop and ask Lode rather than
guess.

### Gate 6 · Preview per spot, one at a time

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

### Gate 7 · Commit via API

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

### Gate 8 · Back-fill linked centers (if applicable)

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

- Dutch primary, English fallback for technical terms (matches Lode's native
  preference).
- Concrete, short, no fluff.
- Every climate value cites Open-Meteo with its coord + sample size.
- Every experience claim cites a recent (≤ 4y) review source.
- When uncertain, say "ik weet dit niet" or "kan ik niet verifiëren" rather
  than confidently filling a gap.
