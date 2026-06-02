# Batch-processing reviews into spot write-ups

> Workflow for Claude (the assistant working on this codebase). Lode
> can paste the trigger phrase below to kick off the run.

## When to use this

When several un-analyzed reviews have accumulated on the admin
dashboard and the area write-ups need updating. Instead of opening
each review by hand, folding the insight into the spot page, and
marking it analyzed one-by-one, Claude does the batch in a single
session.

Use it after content pushes, or once a week / month depending on
review volume.

## Trigger phrase

To start, paste any of these into the chat:

> "Ga door alle un-analyzed reviews en verwerk ze in de write-ups"

> "Run de batch-review-process"

> "Tijd voor een review-batch"

## What Claude does

For each un-analyzed review (newest first):

1. **Read the review** — text, stars, year/month visited, matches
   tag, all details.
2. **Identify the target content** — which spot / center / stay the
   review attaches to, and which sections of that entry's write-up
   are relevant (conditions, intro, seasons, services, vibe, etc.).
3. **Compare with existing data** — does the review say something
   that's NOT already in our write-up?
4. **Decide one of three outcomes**:
   - **a) Update the write-up**: edit the spot/center/stay's content
     via the admin write endpoints. Then mark the review as analyzed
     with a note describing exactly what changed.
   - **b) Already covered**: existing write-up already says this.
     Mark as analyzed with note "already in write-up — no changes".
   - **c) Not actionable**: review is too vague, opinion-only, or
     about something we don't track (e.g. food quality at a stay
     when we don't have a food section). Mark as analyzed with note
     "no actionable insight" so it drops out of the queue.
5. **Always present a diff before saving**. For every content
   change Claude proposes, it shows:
   - The section being edited
   - The before/after diff
   - The review text that triggered the change
   - The proposed admin note
   Lode confirms (yes / skip / edit my note first) before the
   admin endpoints fire.

## Safety rules

- **Never invent facts**. Only insights present in the review text.
  If a reviewer says "very nice surf vibe" Claude does NOT add
  "world-class instructors" — that's hallucination.
- **Quote when paraphrasing**. The proposed write-up edit cites
  "based on review #abc by Michiel, 2 Jun 2026" inline so the
  source is traceable.
- **Single-review attribution → soft language**. If only one review
  backs a claim, use cautious phrasing ("some travellers mention",
  "one reviewer noted"). Only switch to confident phrasing once
  multiple reviews agree.
- **Skip duplicate-pattern edits**. If 5 reviews all say "wind from
  N is best", Claude batches that as one edit, not five.
- **No edits to spots Lode hasn't curated**. If a spot was added
  manually by Lode/Michiel and the review contradicts the
  hand-written write-up, Claude flags it but doesn't auto-overwrite
  — Lode arbitrates.

## API endpoints used

- `GET /admin/reviews/recent?limit=200` — fetch all un-analyzed
  (Claude filters `analyzed_at` is null client-side)
- Reads:
  - `GET /surf-spots/{id}` / `/centers/{id}` / `/stays/{id}`
- Writes (admin-role required):
  - `PUT /surf-spots/{id}` / `PUT /centers/{id}` / `PUT /stays/{id}`
- `POST /admin/reviews/{id}/processed` — mark + add note

## Output format Claude gives Lode

A summary table at the end:

| Review | Spot | Action | Note added |
|---|---|---|---|
| #abc by Michiel | Surfclub Windekind | Updated `intro` | "Reviewers consistently mention warm local welcome" |
| #def by Yana | Anza | No change | "Already covered in seasons section" |
| #ghi by anon | Devil's Rock | Skipped | "Single review, vague claim about parking" |

Plus a count: "Processed X reviews · Y write-up updates · Z marked
as no-action".

## Limitations to know

- **Quality depends on review quality**. Garbage in → nothing useful
  out. Claude won't invent.
- **Doesn't translate** — French/Spanish/etc reviews work but the
  detection of "is this a new insight" is sharper in NL/EN.
- **Doesn't handle photos** (we don't have R2 yet anyway). If a
  review references a photo Claude can't see it.
- **Conservative by default** — when in doubt, marks as "no
  actionable insight" rather than over-editing.

## Future enhancements (not now)

- Pre-flight dry-run mode that previews ALL proposed edits as a
  single document before any save fires.
- LLM-based crowd/wind/wave-condition detection to feed the
  `/admin/conditions-mismatch` panel (currently keyword-only).
- Auto-flag review patterns that suggest content gaps (10 reviews
  asking about parking → maybe we should add a parking section to
  every spot).

---

*Last updated: 2026-06-02 — written when the processed-flag feature
shipped (v=379, admin Batch 2).*
