# Educational Content Guide — "Why this spot is like this"

This is the playbook for adding the educational accordion to a spot page on WaveBase. When Lode says "add educational content to [spot]" or "do this for the next batch", follow this guide.

The point of this content is the WaveBase moat: nobody else explains *why* a spot behaves the way it does. Done well, it earns trust, ranks in Google for long-tail queries, and gives the user something to learn — not just check.

---

## The framework

Every spot gets a fixed set of question categories. Pick the right set for the spot type, and the structure is locked in. **Don't deviate without asking Lode.**

| Spot type | Q1 (primary anchor) | Q2 (secondary anchor) | Q3 (season) | Q4 (special) |
|---|---|---|---|---|
| **Wave / surf** | Why are the waves like they are? | Why is the wind like it is? | Why is high season X? | Spot-specific gem |
| **Wind / kite / wing** | Why is the wind like it is? | Why is the water / bay like it is? | Why is high season X? | — |
| **Flatwater put** (Florizoone-type) | Why is the water like it is? | Why is the wind like it is? | Why is high season X? | — |

Wave spots get **4** questions. Wind and flatwater spots get **3**.

The "special" Q4 for wave spots is the wildcard — only add it if there's something genuinely unique about the spot that doesn't fit Q1–Q3. Examples: "Why is it always busy and where does everyone go when it closes out?" (Devil's Rock), "Why does this spot only work on certain tides?", "Why are the locals so protective here?".

If you can't come up with a strong Q4 for a wave spot, leave it at 3. Better strong-three than padded-four.

### Clustered spots: repetition is OK

When several adjacent spots share the same physical setting (a cluster of beach breaks along one bay, a row of point breaks along one headland), the answers to Q1 / Q2 / Q3 will be largely the same — because the underlying mechanism *is* the same. **Don't invent fake differences to make each spot's Q's unique.** That's how the volcanic-rocks mistake happens: stretching for novelty produces unverified claims.

Rule: shared mechanism → shared explanation. Only the Q4 ("special") needs to differ per spot, because that's where the per-spot character lives (this point breaks long; that one breaks short; this one is crowded; that one is empty).

Example: Devil's Rock, Crocro and Banana Beach are three adjacent beach breaks along the Tamraght bay. They share the same Atlantic swell, the same offshore-mornings / side-shore-afternoons wind cycle, the same Oct–Apr season pattern. Q1 / Q2 / Q3 can be near-identical for all three. Q4 is where they diverge (Devil's Rock = always busy + escape network; Crocro = quieter alternative; Banana Beach = ...).

---

## Writing rules

### Language
**English.** Always. The whole site is English. No Dutch, no French, no Spanish — even when the spot is in a non-English country.

### Length
**50–80 words per answer.** Tight, scannable, no filler. If your answer goes over 100, cut.

### Structure of an answer
1. **State the mechanism** — what causes the thing the user is asking about
2. **One technical term, bolded + explained** in a parenthetical the first time it appears (e.g. `**fetch** (the distance over which wind drags across the water surface)`)
3. **One data point or concrete number** from our existing stats if available (e.g. "60% of June days ≥20kn", "97% swell-probability in December")
4. **A practical takeaway** if it lands naturally (e.g. "surf in the morning, beach in the afternoon")

### Bold jargon, once
Use `**term**` markdown around technical terms on first use. The renderer (`eduMarkdown` in app.js) converts this to `<strong>` styled in sea-teal. Examples of terms that should be bolded with inline explanation:

- **fetch** — distance for wind to build waves
- **thermal wind** — wind caused by temperature differences
- **sand-bars** — shallow underwater sand ridges
- **turbulence** — whirls in the airflow
- **boundary layer** — slow-air layer near the ground (avoid this one, use plain "obstacles slow the wind")
- **A-frame** — surfer's wedge-shaped wave with left and right (common surf term, usually doesn't need explaining)

### Source line
**Every answer ends with a source line.** Format: `source: "X + Y + Z."` — short, comma- or +-separated list of where the info comes from. Examples:

- `"Oued Tamraght geography + beach-break physics."`
- `"Meltemi meteorology + Open-Meteo 5-year archive."`
- `"windsurfingdeinze.be + wave-formation physics + Lode + Michiel first-hand."`

The renderer prefixes it with "Bron:" automatically.

---

## The factual discipline (the most important rule)

This is the rule Lode taught me with the "volcanic rocks" mistake. Internalize it.

> **Reasoning from established physics applied to a place = OK.**
> Mechanisms like meltemi, sea-breeze, fetch, surface roughness, swell propagation are universally taught science. You can apply them to a specific spot and explain the local behaviour confidently, even without a peer-reviewed paper on that exact bay.
>
> **Asserting specific local facts without verification = NOT OK.**
> "The rocks are volcanic", "the village was founded in 1230", "the river deposits X tons/year" — these need verified sources. If you can't verify, leave them out.
>
> **Twijfel = always flag.**
> Use "likely [X] — to be confirmed by local center" rather than a confident statement. Or just don't include it.

If your answer makes a specific factual claim about local geology, history, names, dates, or numbers — and you can't point to a source — **delete that claim and rewrite without it.**

---

## Decision-driven curation — what to SKIP

The questions exist to help the user decide. Anything that doesn't serve a decision is trivia. Skip:

- **History/etymology trivia** ("the village name means X", "founded by Phoenicians")
- **Admin/legal stuff** ("swimming is forbidden because of insurance")
- **Generic meteorology** that applies to every coast on earth (don't explain the sea-breeze cycle on every spot — only mention it if the spot's behaviour depends on it specifically)
- **Geological etymology** that doesn't change how the user surfs ("the sand came from glacial deposits 10,000 years ago")
- **Anything you'd file under 'fun fact'**

Keep:

- **Spot-specific mechanisms** (why THIS spot, not a generic explanation)
- **Decision-relevant info** (when to come, what to expect, what gear, what level)
- **Things competitors won't have** (the local wind hour curve, the escape network on big days)

---

## Where to source the info

In order of preference:

1. **Existing data.js entry for the spot** — read the full entry first: `samenvatting`, `verhaal`, `lagen`, `condities`, `stats`. Most of what you need is already there in narrative form; your job is to extract and reorganize.
2. **Open-Meteo numbers in our `stats`** — `monthlyWindProb`, `monthlyWaveM`, `monthlySwellProb`, etc. These are 5-year averages and are the best data we have. Cite specific percentages where helpful.
3. **Reviews of related centers** — search `data.js` for the spot's name. Center entries often quote reviewers about the spot conditions (e.g. Gone Surfing reviews mention Kouremenos wind reliability). Use these as bron-strength SOLID sources.
4. **Established meteorology / geography / surf science** — for mechanisms (meltemi, swell propagation, sea-breeze, fetch, etc.) you can confidently apply textbook physics. No need for a citation per se — just describe the mechanism clearly.
5. **Lode + Michiel first-hand** — they've been to several spots. For Kouremenos and Florizoone in particular, their direct experience is bron-strength SOLID.
6. **Web search** — only if 1–5 don't cover it AND the claim is verifiable. Then cite the source explicitly.

What you should NOT do:
- Don't make up facts to fill out the four questions
- Don't quote anyone without checking that quote is in our data
- Don't claim specific local features (volcanic, sedimentary, etc.) without verification
- Don't use "AI-style" filler like "interestingly", "fascinatingly", "it's worth noting" — get straight to the mechanism

---

## Workflow for adding a new spot

When Lode says "add educational content to [spot]":

1. **Read the full data.js entry for that spot.** Note the type (`spot` / `center` / `stay`) and the discipline (`sports: ["wave"]` vs `["wind"]` etc.) — this determines the framework.
2. **Read the relevant adjacent entries** if helpful (e.g. centers that operate at this spot, nearby spots for context).
3. **Determine the spot type for the framework**:
   - Has `sports: ["wave"]` or similar → wave spot → 4 questions max
   - Has `sports: ["wind", "kite", "wing"]` and no waves → wind spot → 3 questions
   - Is a freshwater put / lake / inland water → flatwater → 3 questions
4. **Draft the Q&A's in English** following the writing rules above. Use the existing 3 hero spots as the style template:
   - Devil's Rock (`data.js` id `devils-rock`) — wave example with 4 Q
   - Kouremenos Beach (`data.js` id `kouremenos`) — wind example with 3 Q
   - Florizoone Surfput (`data.js` id `florizoone-deinze`) — flatwater example with 3 Q
5. **Present the draft to Lode** before publishing. Don't add to data.js yet. Lode will give feedback on (a) what's still too generic, (b) what's not unique enough, (c) what claims need verifying, (d) what jargon needs explaining.
6. **Iterate.** Expect 1–2 rounds of tightening.
7. **Once approved**: add the `educational: [{q, a, source}, ...]` field to the spot's entry in `data.js`, placed between the `lagen: [...]` field and the `condities: {...}` field. Match the indentation of surrounding fields.
8. **Bump the cache version** in all 12 HTML files (`?v=NNN` → next number) — see the existing pattern.
9. **Verify** by loading `localhost:8000/spot.html?id=<spot-id>` and confirming the accordion renders, expands/collapses, and the bold terms look right.
10. **Commit + push** with a clear message like `Educational content: [spot name] (v=NNN)`.

---

## Where it lives in the codebase

| Concern | File | What |
|---|---|---|
| Content | `data.js` | `educational: [{q, a, source}, ...]` on each spot entry |
| Renderer | `app.js` | `educationalHTML()` function + `eduMarkdown()` helper |
| Injection point | `app.js` → `initSpot()` | Between `verhaal` ("The honest story") and `lagen` (technical layers) |
| Styles | `styles.css` | `.educational`, `.edu-item`, `.edu-q`, `.edu-body`, `.edu-a`, `.edu-source` |
| Cache version | All 12 `*.html` | Bump `?v=NNN` on `styles.css` + `data.js` + `app.js` references |

The accordion uses native `<details>`/`<summary>` — JS-free, accessible, closed by default.

---

## Examples — good vs bad

### Good (a real Q from Kouremenos)

> **Why is the wind here so reliable?**
> The meltemi is a **thermal wind** — a wind caused by temperature differences, not by an ordinary weather system. In summer, the South Asian landmass heats up extremely and creates a low-pressure zone that sucks in air from a high-pressure ridge over the Balkans. That N–NW flow drifts across the Aegean Sea. Far-east Crete sits right in the corridor; the Sitia mountains funnel the wind further toward the east coast. Data: **60% of June days ≥20kn**, side-shore.
> *Source: Meltemi meteorology + Open-Meteo 5-year archive.*

Why it's good: one mechanism (meltemi), one bolded term with inline explanation (thermal wind), one data point (60% / ≥20kn), specific to this spot's location (far-east Crete corridor + Sitia mountains), tight (88 words including source).

### Bad (a Q that should be cut)

> **Why is the village 1.5 km inland?**
> Historically, Mediterranean coastal villages were built inland to protect against Saracene and later Ottoman pirate raids. Palekastro fits that pattern — founded as an agricultural settlement away from the coast, only opening up to beach tourism in the 20th century.

Why it's bad:
- Not decision-relevant (doesn't help the user decide whether/when/how to surf)
- Asserts specific historical claims without verification ("Palekastro fits that pattern" is my extrapolation, not a sourced fact)
- Trivia / etymology category — should be cut

### Bad → Good rewrite

**Bad:** "Devil's Rock has volcanic rocks to the south that focus the swell."
- Problem: "volcanic" is unverified (could be sedimentary).

**Good:** "Devil's Rock sits at the boundary where the soft sandy bay (from Oued Tamraght sediment) meets the harder rocky coastline to the south. That harder kustline is where the reef breaks Spiders and Banana Point form."
- Mechanism without unverified specific-rock claim. "Harder rocky coastline" is observable; "volcanic" is geology I haven't checked.

---

## Lessons learned (from the original 3-spot iteration with Lode)

These are the points where the first draft was wrong and Lode corrected me. Don't repeat them.

1. **Too many questions** — I started with 5 per spot. Lode capped it at 3 (4 for wave). Less is more.
2. **Generic meteorology dressed up as spot-specific** — explaining the sea-breeze cycle on every coastal spot is filler. Only include it if the spot's behaviour depends on it specifically.
3. **Unverified factual assertions** — I claimed "volcanic rocks" at Devil's Rock without checking. Lode flagged it as bullshit. Rule: reason from physics, don't assert local facts unless verified.
4. **Jargon without explanation** — I used "synoptic", "boundary-layer", "Beaufort & Stokes wave theory" (the last one was just name-dropping). Lode said explain technical terms inline. Now: bold the term, add a short parenthetical the first time it appears, and only use one or two per answer.
5. **Wrote in Dutch** — first version was Dutch despite the whole site being English. Translate to English from the start.
6. **Wave spots needed wind too** — initial framework had only the medium anchor (waves OR wind), but for wave spots both matter (wind quality determines surf quality). Hence 4 Q for wave, 3 for the others.
7. **Padded "special" questions** — for non-wave spots, the "spot-specific gem" was forced. Cut it. Wind / flatwater spots stay at 3 Q.

---

## Final check before publishing

Before adding to data.js, scan your draft for these red flags:

- [ ] Any answer over 100 words? → cut.
- [ ] Any unverified specific factual claim (geology, history, dates, names)? → delete the claim or flag it as TBC.
- [ ] Any Dutch sneaking in? → translate.
- [ ] Any technical term used without inline explanation (and not a common surf term)? → bold + add parenthetical.
- [ ] Any "fun fact" trivia not serving a decision? → cut.
- [ ] Source line missing on any answer? → add it.
- [ ] Q count matches spot type? (wave = 4, wind/flatwater = 3) → fix.
- [ ] Does each Q say something genuinely *specific* to this spot, not generic to all spots of its type? → if no, rewrite or cut.

If all clean → add to data.js, bump cache, verify, commit, push.
