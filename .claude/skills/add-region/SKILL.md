---
name: add-region
description: Add a region or sub-region (Kreta heel, alleen noordkust Frankrijk, Tarifa-lagoon, Tamraght-cluster, ...) to SurfGoose using the pair-workflow — for each surf center, do its spot first if missing, then the center, one pair at a time. Defers remote spots without centers. The default workflow for any new geographic area. Trigger explicitly with the region or sub-region as the argument, e.g. "/add-region Tarifa", "/add-region noordkust Frankrijk", "voeg de regio noord-Marokko toe".
---

# add-region

The default workflow for adding a region or sub-region to SurfGoose.
Where the individual `/add-surfspots` and `/add-surfcenters` skills are
specialist tools, this skill is the **coordinator**: it walks one pair
at a time (spot + the center that teaches there), so every spot in the
DB has a clear use case and every center has its linked_spot_id
populated in the same pass.

**Sub-region scoping is first-class.** The "region" argument can be as
narrow as needed — full country, single coast, single bay, single
operator cluster. Gate 1 confirms the exact bounds before research
starts.

## When this skill fires

Lode invokes explicitly with the region or sub-region as the argument.
Recognised phrasings — note the range from country-wide to bay-narrow:

**Country / full island:**
- "/add-region Tarifa" (covers the wider area)
- "/add-region Kreta"
- "Voeg de regio noord-Marokko toe"

**Coast or sub-area:**
- "/add-region noordkust Frankrijk"
- "/add-region oost-Kreta only"
- "/add-region Algarve west coast"

**Cluster or bay:**
- "/add-region Tarifa lagoon side"
- "/add-region Plakias-Damnoni cluster"
- "/add-region Tamraght-Taghazout area"
- "Add the spots and centers for north Portugal"

Use this when the goal is **systematic coverage of a region**. Use the
individual skills (`/add-surfspots`, `/add-surfcenters`) when adding
individual entries to a region that's already covered.

## Why this is the default (vs. the two individual skills)

The Kreta batch of June 2026 taught the cost of running spots + centers
as separate passes:

- I added 22 Greek spots first. 5 of them were "remote no-signal"
  candidates that probably shouldn't be in the DB at all (Komos,
  Plakias, Kedrodasos for advanced-only, etc.).
- Then I added centers in a second pass, which hit the Hard Gate 3.5
  back-fill problem when centers wanted to link to spots that hadn't
  been added yet (Kalamaki, Agia Marina).
- And the brand-vs-Maps fragmentation issue (The Wind Tribe Crete vs
  SurfIsland Elafonisi) was discovered AFTER the spot for Elafonisi
  was already in production — earlier discovery via center-first
  research would have shaped the spot entry differently.

The pair-workflow defaults all three issues away:
- **No ghost spots** — every spot in DB exists because a school is
  teaching there.
- **No Hard Gate 3.5 back-fill** — center gets `linked_spot_id` in
  the same pass as the spot.
- **Brand fragmentation caught early** — center research surfaces
  the customer-facing Maps brand before the spot prose is written.

## Process — six coordinating gates

### Gate 1 · Scope confirm

Ask Lode 1-3 of these:

- **Geography**: full region or sub-area?
- **Sport coverage**: all 4 (wave/wind/kite/wing) or filter?
- **Existence cutoff**: only ≤4-year-old reviews (default), or include
  dated classics?
- **Self-organized-spot inclusion**: after the pair pass, do you want
  a second pass for visitor-traffic spots without schools (the "Komos"
  category)? Default: skip them this run, log to `defer/` for later.

Skip questions Lode already answered in the invocation.

### Gate 2 · Survey existing

Pull BOTH collections for the region. Same as the individual skills.

```
GET https://wavebase-api-qqwt.onrender.com/centers/
GET https://wavebase-api-qqwt.onrender.com/surf-spots/
```

List existing spots + centers back to Lode. Two purposes:
- Don't duplicate.
- Identify spots already in DB that will save work in the pair pass
  (no need to re-add them).

### Gate 3 · Discovery — start with CENTERS

This is the order-of-operations difference from the individual skills.
**Start with the center directories**, not the surf-guide spot lists.

Sources to scan (same as `/add-surfcenters` Gate 3):
- TripAdvisor "Best [region] surfing/windsurfing/kitesurfing"
- IKO / ISA / ASI / IRSC / WSL international school directories
- BookSurfCamps / Sunbonoo / Surf-Camp.com aggregators
- Multi-station chain sites (SurfIsland-style, regional)
- Local Google Maps "surf school near [region]" searches

**Inland waters are first-class (Lode's rule, 2026-06-12).** Wind,
kite and wing spots don't need a coastline — Windsurfing Deinze (BE)
and Surfcenter/Schildmeer (Steendam, Groningen) are the precedents
in our own DB. For any country-wide run the Gate 3 sweep MUST include
the inland lake districts as their own search grid, not just the
famous coast: run "windsurfschool / kiteschool + [province or lake]"
per inland region before declaring discovery done. Anti-pattern this
rule kills: the Netherlands run of 2026-06 anchored discovery on
coastal fame and silently skipped the whole northeast + every inland
lake — Lode caught it via Roegeweg 1, Steendam.

Build a candidate-centers list. **For each candidate**, capture:
- Center name + URL
- Beach/spot they teach at (per their own site + reviews)
- Sport mix + skill levels they market

The beach-name capture gives you the **candidate-spots list as a
side-effect** — every beach a school mentions is a spot candidate.
Dedupe against the existing-spots survey.

### Gate 3.5 · Inland water: the model LIES about wind. Validate or label. (Lode's rule, 2026-07-17)

**This gate is mandatory for every lake / reservoir / pit / river spot.**
It exists because the coastal pipeline silently produces worse data inland
and says nothing about it.

**The physics.** Reanalysis 10 m wind (ERA5, and the whole Open-Meteo
archive family) is a grid-cell average. A small lake never fills its cell,
so the cell is land-dominated and **land roughness drags the MEAN wind down
~30-40%**. Gusts come from a different parameterisation and largely escape
the effect — so gusts look right while the mean is quietly wrong. That
combination is the tell.

**The evidence (Austria, Jul 2026).** Podersdorf / Neusiedler See:
- our ERA5 daytime mean **7.6 kn**, gusts **14.3 kn**
- Windfinder's *measuring station* on the same beach (6/2007–2/2019):
  mean **11 kn**, gusts **15 kn**, NW
- Gusts match. The mean is ~30-40% low. Lode caught it by eye from the
  chart alone: *"lijkt er niet zoveel wind te zijn, volgens mij is er meer."*
- Tested and rejected: `cell_selection=sea` returns the SAME cell (the lake
  is too small to have a sea cell); **CERRA** (5.5 km, closer grid point)
  only reaches 7.8 kn. There is no model fix. Do not go hunting for one.

**What you MUST do for an inland spot:**

1. **Never let the model be the headline.** Find ground truth and put THAT
   in `conditions.wind`: a measuring station (Windfinder / Windguru station
   statistics), the school's own site, or Lode's first-hand account. Name
   the source in `stats.source`.
2. **The monthly arrays are for the SEASONAL SHAPE only** — which months
   blow, how they rank against each other. Reanalysis does that well. Say
   so explicitly in `stats.source`, including the land-roughness caveat.
3. **NEVER fabricate wave data.** Inland means:
   `monthly_wave_m: null`, `monthly_swell_prob: null`, every period's
   `wave_m: null`, and `wave_type: "None — flat ..."`. A flat nominal
   `0.2` across twelve months is **banned** — that is invented data wearing
   a lab coat.
4. **Water temps are hand climatology, not model output.** Say that too.
5. **Never invent a correction factor** to close the model/station gap.
   Label the gap; don't paper over it.

**Copy the precedent, don't reinvent it:** `Florizoone Surfput` (Deinze, BE)
does all five correctly — real on-water range in `conditions.wind`
("Typical 8–14 kn, gusty 18–25 kn"), `wave_m: null`, and a source line that
credits the school + first-hand knowledge for the feel. **Read that entry
before writing any lake spot.**

**Anti-pattern this gate kills:** the Austrian batch of July 2026 shipped
Podersdorf with a bare model chart and fabricated 0.2 m waves. The numbers
were reproducible and still misleading — which is worse than obviously
wrong, because it looks rigorous.

### Gate 4 · Pair-by-pair, sequential

This is the meat of the skill. **For each center in your candidate
list, do these steps in order, before moving to the next center:**

#### 4.1 · Research the center exhaustively

Run the full `/add-surfcenters` Gate 3 review-scan (9 platforms, all
hardenings: sub-page price scan, brand-vs-Maps cross-check, 4-year
freshness rule).

If the research surfaces a brand-vs-Maps red flag (Maps returns a
different name than your candidate), resolve it BEFORE writing the
center entry. The Crete batch lesson: do this once, here, not later
as cleanup.

#### 4.2 · Identify the spot the center teaches at

From the center research, you know which beach. Three cases:

**Case A: Spot exists in DB** → reuse it. Move to 4.4.

**Case B: Spot missing from DB** → add it now, inline, using
`/add-surfspots`' gates (Open-Meteo data fetch, Chrome MCP coord
verify with hard delta-check, Hard Gate 6 educational template, etc.).
This is a full spot entry — don't shortcut to "minimal spot just for
the center link".

**Case C: Spot is ambiguous** (multiple beaches mentioned, or
brand-vs-Maps disagrees) → stop and ask Lode which spot to link to.

#### 4.3 · Verify both coords + the linkage

Chrome MCP-verify the center coord. Confirm it's within ~500 m of the
spot coord. If they're further apart, you've probably got the wrong
spot match — re-research.

#### 4.4 · Preview the pair (or just the center if spot already existed)

Build the preview block for the center per `/add-surfcenters` Gate 5.
If you added a new spot in 4.2, present its preview FIRST, get GO,
then center preview after.

#### 4.5 · After GO: POST both, with the linkage

- If new spot: POST it via `/surf-spots/`, capture the returned ID.
- POST the center via `/centers/` with `linked_spot_id` populated.
- Verify the center page's at-a-glance renders.

#### 4.6 · Move to the next center

Don't batch across centers. The Crete batch confirmed: even when
Lode says "GO ALL", per-center research depth is the discipline. What
gets batched is the GO decision, not the content authoring.

### Gate 5 · Optional second pass — self-organized spots

After all center-pair work is done, ask Lode whether to do a second
pass for spots that don't have schools but clearly attract
self-organized visitor traffic.

**Bar for the second pass:**
- ≥3 recent (≤4y) reviews from named platforms (Wannasurf, Google
  Maps, surf blogs)
- Clear visitor pull (named as a destination in surf-press, not just
  "exists on the coast")
- Distinctive character that complements the center-pair coverage

**Examples of pass:** Komos Beach (south Heraklion, named destination
in 3+ surf-press sources, distinct from any school).
**Examples of skip:** Eligas Beach (named in one cretanbeaches list,
no reviews, no visitor signal).

Each self-organized spot goes through the full `/add-surfspots` gates.
The entry's prose should explicitly note "no school operates here —
self-organized session only".

### Gate 5.6 · World-class exception — fame alone is enough (Lode's rule, 2026-06-12)

**If a spot is genuinely world-famous, it goes in — even when it fails
the normal inclusion logic.** No center pair needed, no minimum review
count, no "does the chart flatter it" test. World-class fame IS the
visitor signal: people will search SurfGoose for it, and a gap there
reads as ignorance, not curation.

What counts as world-class (needs at least ONE, verifiable):
- World tour / world cup / world championship venue, past or present
  (Mundaka, La Gravière, Leucate's Mondial du Vent, Pozo's PWA).
- Named in essentially every international guide for its discipline
  (L'Almanarre for windsurf, Silver Rock for bodyboard).
- A wave/wind phenomenon with its own name recognition beyond surf
  media (Nazaré's canyon, Belharra, the Imsouane Bay).

What does NOT count: "popular locally", "best spot of the province",
big Instagram presence without contest/guide pedigree. The bar is
international, not national.

How to enter it:
- Full `/add-surfspots` gates as always — fame is an inclusion
  override, never a research shortcut.
- If no school teaches there, say so explicitly in the entry
  ("self-organized sessions only"), Mundaka-style.
- If the honest data undercuts the legend (episodic wind, wrap-tax,
  model-shadow cell), keep the honest data AND explain the legend in
  the educational block — that contrast is exactly our brand.

Precedents: Mundaka (no school — added anyway), the French
Mediterranean wind icons (Leucate/La Franqui, L'Almanarre, Gruissan —
added 2026-06 under this rule after the wave-stats objection was
correctly overruled for wind-discipline fame).

### Gate 6 · Skip-list — explicit deferral log

For every candidate spot you considered but didn't add (either via
pair-pass or self-organized pass), log it with the reason. The log
goes into the per-region task notes, not the DB. Example:

```
SKIPPED for now:
  - Eligas Beach (Cape Sidero) — no recent reviews, no visitor signal
  - Sougia Beach (south coast) — no school, no reviews, marginal mention
  - Itanos Beach (east coast) — no school, only Wikipedia listing
```

Surface this list to Lode at the end so he sees the negative space + can
flag any "actually let's add that anyway".

### Gate 7 · Country promotion — SOON → live (mandatory if first content for the country)

**When this gate fires:** the region you just added is the FIRST content
SurfGoose has for that country. Before this batch, the country was a
placeholder showing "SOON" in the picker. Now that it has real spots +
centers, it needs to be promoted to "live" so visitors can find it.

The Portugal/Ericeira batch of June 2026 missed this — Portugal stayed
"SOON" in the country picker for 30 minutes after going live with 10
spots + 23 centers, until Lode caught the gap. The skill now mandates
the promotion as a final step.

**Three places to update — all required:**

1. **Frontend `constants.js`** — change the country's `status: "soon"`
   to `status: "live"` in the `WAVEBASE_DESTINATIONS` array.
2. **Legacy `data.js`** — same change in the duplicated
   `WAVEBASE_DESTINATIONS` block (kept in sync).
3. **Backend API `/countries/{id}`** — PATCH the country's status to
   "live". The API has its own status field that's currently unused at
   runtime but should stay in sync for future use:
   ```
   curl -X PATCH https://wavebase-api-qqwt.onrender.com/countries/<country-id> \
     -H "Authorization: Bearer <JWT>" \
     -H "Content-Type: application/json" \
     -d '{"status": "live"}'
   ```

**Verify after the changes:**
- Country picker shows the new country WITHOUT the "SOON" badge
- "Pick a country to begin" section shows the new country as a card
  alongside existing live countries
- The worldwide map shows a pin in the new country (auto-renders from
  the live-status filter)

**Do NOT skip this gate.** A country with content but still flagged
"SOON" is invisible to visitors using the picker — the entire batch
work is wasted from a discoverability angle until the promotion lands.

## After the region is done

Summary table to Lode:

| Pair | Spot | Center | Status |
|---|---|---|---|
| 1 | Falassarna Beach (existed) | SurfIsland Falassarna | added |
| 2 | Kalamaki Beach (NEW) | SurfIsland Kalamaki | both added |
| 3 | Elafonisi Beach (existed) | The Wind Tribe Crete (= SurfIsland brand) | center added |
| 4 | Amoudara Beach (existed) | Heraklion Windsurfing Club | center added |
| ... | | | |

Plus the skip-list from Gate 6.

Plus self-organized-pass results if you ran it.

**Don't auto-trigger Monday updates** — Lode will ask explicitly.

## What this skill does NOT do (intentional gaps)

- **Stays.** Accommodation entries go through a separate skill
  (`/add-stays` once built). Don't pull stays into the pair-workflow.
- **Replace the individual skills.** `/add-surfspots` and
  `/add-surfcenters` stay available for editing existing entries or
  adding individual new ones to a region that's already covered.
- **Cross-region work.** This skill is per-region. For pan-regional
  improvements (e.g., adding the 4-year-review-freshness flag to all
  centers), use direct API calls.

## Output style

**Language — strict bilingual split, no mixing:**

1. **CONVERSATION with Lode** = Dutch primary, English fallback for tech terms.

2. **EVERY field written to the DB = ENGLISH ALWAYS.** SurfGoose is for
   international visitors. This applies to BOTH the spot and the center
   side of every pair: `tagline`, `coords_label`, `summary[]`, `story[]`,
   `conditions.*`, `stats.*` prose, `educational[].q/a`, `layers[].*`,
   `nearby.*`, `ideal_for`, `not_ideal_if`, `services.*`, `prices.*_note`.

- Concrete, short, no fluff.
- Every claim cites its source inline (especially per-pair).
- When uncertain in chat, say "ik weet dit niet" or "kan ik niet verifiëren".
  In DB content, write "not published" / "not verified" / "contact direct".
- After each pair, give Lode the live URLs to verify on the site.
