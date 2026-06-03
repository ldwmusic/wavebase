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

### Gate 2 · Survey existing centers

Before researching anything new, check what's already in the database for that
region. Use the public API:

```
GET https://wavebase-api-qqwt.onrender.com/centers/
```

Filter client-side by `country.name` matching the region's country. List the
existing centers back to Lode so we don't duplicate. If a candidate later in
your research matches an existing entry by name + town + coords, **propose an
update** (PUT) rather than a duplicate insert.

### Gate 3 · Research each candidate (3-source rule)

For every candidate center, gather information from at least 3 independent
sources. Don't trust any single one. Acceptable sources:

- The center's own official website (always #1 if it exists)
- Booking.com / Airbnb (for accommodation pages that link to a center)
- TripAdvisor reviews
- Google Maps listing + reviews
- Windguru / Magicseaweed reviews of the spot the center teaches at
- Surfertoday or other surf-press features
- Recent (≤ 4 years) Booking / TripAdvisor / Google reviews from real customers

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

1. Use `mcp__claude-in-chrome__navigate` to open `https://www.google.com/maps`
2. Search the center's name + town
3. Once the place card loads, the URL contains `@lat,lng,zoom` — extract those
4. Open the place's "About" section, copy the canonical name + address back to
   confirm the entry is correct
5. Build a `google_maps_query` that, when appended to `https://www.google.com/maps?q=`,
   reliably lands on the exact same place. Test it.

Anti-pattern from the Belgium audit: "Akti Villas" matched a wholly different
hotel because we searched by name only. Always match by **name + location**.

If the place can't be uniquely identified (multiple matches, vague name), stop
and ask Lode rather than guess.

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

Auth: the admin JWT lives in `localStorage['wavebase_jwt']` of Lode's browser
on `wavebase.lode-b162.workers.dev`. If you don't have a token, ask Lode to
run a small helper snippet in the admin console to copy his JWT — don't try to
proxy it any other way.

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
Monday updates or any other reporting** — Lode will ask explicitly if he wants
those.

## Output style

- Dutch primary, English fallback for technical terms (matches Lode's native
  preference).
- Concrete, short, no fluff.
- Every claim cites its source inline.
- When uncertain, say "ik weet dit niet" or "kan ik niet verifiëren" rather
  than confidently filling a gap.
