# /add-region FRANKRIJK — top-up run · 2026-07-17

**Mode: AUTONOMOUS** (Lode, Gate 1). Scope: coast + inland + town records.
Trigger: Lode reviewed France on the live site and found it badly incomplete —
named Sangatte, Wimereux, Hyères and Lac de Sainte-Croix as missing.

## GATE 0 — pre-flight ✅
- API reachable: GET /surf-spots/ → 200
- Auth: writes go from Lode's logged-in Chrome (token in page localStorage, never in transcript)
- Country record EXISTS: France, 🇫🇷, status **live**, continent Europe,
  `country_id = 34b3db5f-686f-4e3c-bda7-3f5e6d2a435d`
- Not a new country → **TOP-UP run** (11 spots · 23 centers already live). Gate 7 = N/A (already live).
- Schema probe: no new fields planned → n/a
- ⚠️ **France has 0 town records** (of 14 site-wide) → Gate 4.2b backfill in scope this run

## GATE 1 — scope (Lode's answers)
- Geography: FULL — north coast (Sangatte, Wimereux), Normandy, Brittany, Vendée/Charente,
  Mediterranean (Hyères/Giens), Corsica, AND all inland water
- Sports: all (wave/wind/kite/wing/sup)
- Freshness: default ≤4 years
- Self-organized spots: default skip → defer, EXCEPT Gate 5.6 world-class exception
- Mode: autonomous — no per-pair preview; ambiguity = skip + flag

## GATE 2 — survey of existing (11 spots · 23 centers)
Wissant 50.888,1.660 (kite/wind/wing) — Wimkite, Bed & Kite
La Torche 47.837,-4.353 (wave/wind/kite/sup) — La Torche Surf School, Allons-Surfer
Lacanau (Central Beach) 45.001,-1.202 (wave) — Magic Surf School, Ocean Ride
Les Estagnots (Seignosse) 43.687,-1.441 (wave) — Seignosse Surf School, Chill Surf
La Gravière (Hossegor) 43.672,-1.441 (wave) — Surftrip, Yosurf
Anglet (Sables d'Or) 43.502,-1.541 (wave) — Anglet Surf Ocean, John & Tim
Côte des Basques (Biarritz) 43.475,-1.569 (wave/sup) — Surf In Biarritz, La Vague Basque, Jo Moraiz
Hendaye 43.373,-1.772 (wave/sup) — Gold Coast, Hendaia
Gruissan (Les Chalets) 43.088,3.104 (wind/kite/wing) — Akila, Kite and Foil
L'Almanarre (Hyères) 43.068,6.130 (wind/kite/wing/sup) — MF Kite, Funboard Center
La Franqui (Leucate) 42.932,3.039 (kite/wind/wing) — F400, KSL

**THE GAP (this is why Lode complained):**
- Wissant (50.89°) → La Torche (47.84°): ALL of Normandy + most of Brittany, ~350 km — **0 spots**
- La Torche → Lacanau (45.00°): Vendée, Charente, Ré, Oléron, ~300 km — **0 spots**
- Inland water: **0** (violates our own "inland is first-class" rule — BE/NL/DE/AT all have lakes)
- Corsica: **0**
- Étang de Leucate LAGOON side missing though the sea side (La Franqui) exists

## GATE 3 — discovery (3 agents, centers-first)
- a4c0d6023a1d49775 — north: Opal Coast (Sangatte, Wimereux…), Normandy, Brittany
- af592b0cea9378803 — Atlantic south + Mediterranean + Corsica (incl. Hyères/Giens other side)
- a8161e2c389def465 — inland lakes + Mediterranean étangs

## EARLY FINDINGS (from discovery, before posting)

**Hyères / Giens is a CLUSTER, not one spot** (Lode flagged "Hyères" as missing —
L'Almanarre already exists, but it is only the WEST side of the isthmus):
- **La Badine** — a genuine WAVE spot on east wind (east side of the isthmus)
- **La Capte** — flat on west wind
- **La Madrague de Giens** ~43.0414, 6.1278 (approx) — sheltered beginner flatwater
- **La Bergerie** — ⚠️ KITESURF BANNED by municipal arrêté; the school there teaches via
  boat drop-off instead. Source: kitesurf-var.com/le-spot-de-la-bergerie/
  → editorially strong: a banned-from-the-beach spot that only works by boat.

**DEAD OPERATOR — do not add:** `Nustrale Ride` (Bonifacio / Balistra, Corsica) closed in
2023 and handed its activity to **Bonifacio Windsurf** — stated on its own site. Still
ranks well on Google. Classic stale-listing trap.

## PAIRS POSTED
(append one line per pair as it lands: spot name + verified coords + source of coord,
 center + prices + review evidence, posted IDs, exact stats.source line)

### ✅ POSTED 2026-08-08 — HYÈRES/GIENS + PROVENCE/VAR/CÔTE D'AZUR (autonomous run)
**10 spots · 10 centers · 6 town records. All verified live. Zero duplicates.**

⚠️ **GATE 4.3a RESULT — ALL TEN plan-file coordinates FAILED and were replaced.**
Every `~approx` coordinate in the verdict block reverse-geocoded to a road, path or residence.
Worst case: **La Bergerie ~43.055,6.128 was ~1.6 km off, on the WRONG ARM of the tombolo**
(the west/salt-pan side; the real beach is on the east arm at 43.0462,6.1502).

🔧 **METHOD NOTE for future runs — reverse-geocode alone gives FALSE FAILURES on Mediterranean beaches.**
Nominatim `/reverse?zoom=17` snaps to the nearest *addressable way*, so even the exact centroid of a
verified OSM `natural=beach` polygon returns a footpath (e.g. Plage de la Badine → "Sentier du Littoral").
Protocol actually used, and recommended: **forward-geocode the named beach → take the OSM
`natural=beach` / `leisure=marina` object → reverse-geocode THAT to confirm the commune.** Both must agree.
Overpass (`natural=beach` in a bbox) resolved the two cases Nominatim could not name.

| Spot | Verified coords | How verified | Chart | ID |
|---|---|---|---|---|
| La Badine (Hyères) | 43.0361, 6.1526 | OSM beach "Plage de la Badine", Port Auguier; commune Hyères ✓ | wave | `9b5f7487-c425-43f7-922b-7ab26b677f0a` |
| La Capte (Hyères) | 43.0602, 6.1499 | OSM beach "Plage de la Capte"; commune Hyères ✓ | wind | `33c8d595-1308-4d6d-aa64-4134424a31fb` |
| La Madrague de Giens (Hyères) | 43.0402, 6.1104 | OSM marina "Port de la Madrague de Giens"; commune Hyères ✓ | wind | `1bb4f33f-3d2c-42d0-95ed-0bdd9ef7169d` |
| La Bergerie (Hyères) | 43.0462, 6.1502 | OSM beach "Plage de la Bergerie"; commune Hyères ✓ | wind | `faf71091-76bc-4b8e-a56f-43407ca25b38` |
| Brutal Beach (Six-Fours) | 43.1110, 5.8117 | OSM beach "Plage de Bonnegrâce" — the query "Brutal Beach Six-Fours-les-Plages" resolves here directly | wave | `4d9078ec-e7cf-4b34-961f-990d120805cd` |
| Marseille — Pointe Rouge | 43.2447, 5.3709 | OSM beach "Plage de la Pointe Rouge", Marseille 8e ✓ | wind | `3c8c95ff-397e-49b2-8ad4-c56fb97b9a3e` |
| Marseille — Prado (Huveaune) | 43.2589, 5.3755 | OSM beach "Plage de l'Huveaune", Marseille 8e ✓ | wind | `eb96ffc1-d78e-420c-bacc-ba16dc6d3a0a` |
| Saint-Aygulf (Fréjus) | 43.3993, 6.7306 | OSM beach "Plage des Esclamandes" (Overpass); commune Fréjus ✓ | wind | `9ac2ea8e-1815-4894-8e70-aa36dc68beec` |
| Sainte-Maxime — La Nartelle | 43.3214, 6.6651 | OSM beach "Plage de la Nartelle"; commune Sainte-Maxime ✓ | wind | `a2236976-1f80-4b27-9374-91323633616e` |
| Saint-Laurent-du-Var — Plage Cousteau | 43.6572, 7.1873 | OSM seafront beach polygon (Overpass); commune SLDV ✓ | wind | `a87e1923-d72a-4fb7-8598-d3ff2fe47305` |

**Exact `stats.source` lines used (Gate 3.6 — 82 and 84 chars, both ≤220):**
- wave spots (La Badine, Brutal Beach): `Waves, wind and water: Open-Meteo ERA5 + Marine reanalysis, 5-year daytime averages.`
- wind spots (all 8 others): `Wind, water and air: Open-Meteo ERA5 + Marine reanalysis, 5-year daytime averages.`

**Centers posted (all linkages verified to resolve):**
| Center | Coords + how verified | Prices | ID |
|---|---|---|---|
| Le Spot Kitecenter & Wingcenter → La Bergerie | 43.0479, 6.1495 — own published address "Avenue de la Bergerie 83400 Hyères" ✓ | kite/wing 3h30 **€120**, weekend stage from **€220** (2026-08) | `b4b30338-11e3-43e0-b84f-ee1a97f6e5dd` |
| KGG Kitesurf School → **L'Almanarre (existing)** | 43.0415, 6.1287 — "1737 Route de la Madrague", exact OSM house number ✓ | not published | `8316f3c2-8078-4abc-8aba-393445dcda2c` |
| KifKite → La Capte | 43.0578, 6.1478 — OSM `club=sport` object literally named "KifKite" ✓ | not published | `0365946b-09ce-4654-8ca5-7280450d6add` |
| La Cahute Gliss'Center → Brutal Beach | 43.0791, 5.8043 — own address "Plage des Charmettes" ✓ (3.5 km S of Bonnegrâce, disclosed) | not published on site | `162add3e-9241-4cc8-beae-9c3dd2e42d54` |
| Six-Fours Surf Club → Brutal Beach | 43.0746, 5.7980 — own address "Base nautique du Brusc" ✓ | images only, not transcribed | `3c9e9182-19cc-4f9d-afe8-11c5bb993e26` |
| FKS Fada Kite School → Pointe Rouge | 43.2447, 5.3709 — boat-based, anchored on verified beach (disclosed) | **kite 3h €220 · wing 2h €150 · tracté 30min €80** (2026-08) | `f11b61fd-53c3-4e62-8bf4-ebe974937ebe` |
| Massilia Kite School → Pointe Rouge | 43.2447, 5.3709 — same, disclosed | not published | `1aa17f96-8de3-4320-908d-e2e20e5b1192` |
| Kitesurf Evasion → Saint-Aygulf | 43.3993, 6.7306 — mobile school, anchored on verified beach (disclosed) | only **€5/day insurance** published | `e4daf856-e5cb-4e70-928a-111a913d9077` |
| IKS Issambres Kite School → La Nartelle | 43.3214, 6.6651 — anchored on verified beach (disclosed) | not published | `2b11b720-b96d-4297-a7f9-b22ce2465724` |
| Centre Nautique AGASC → Plage Cousteau | 43.6581, 7.1954 — own address "416 av. Eugène Donadeï" ✓ | **wing €95/1h, €110/2h · cata €50/€80 · SUP €15/€25 · kids week €200-300** (2026-08) | `931d803d-6bb1-48bb-8b40-a55e6399a0a1` |

**Town records created (Gate 4.2b — France went from 0 to 6; names match the spot `town` strings exactly):**
`Hyères (Var)` `568a2f69` · `Six-Fours-les-Plages (Var)` `7bb8d005` · `Marseille (Bouches-du-Rhône)` `fc4e3f9f`
· `Fréjus (Var)` `626c9ba3` · `Sainte-Maxime (Var)` `8e2de141` · `Saint-Laurent-du-Var (Alpes-Maritimes)` `beec4cab`
→ **bonus: `Hyères (Var)` also back-fills the "The town" panel on the pre-existing L'Almanarre, MF Kite and Funboard Center pages.**

**Editorial decisions worth keeping:**
- La Bergerie posted with `sports:["wind","wing"]` — **no `kite`**. The ban is the lede of the entry.
- The Hyères channel rules went into a shared `layers[]` block on all four Hyères spots (mandatory chenal du Mérou +
  chenal de l'Almanarre, buffer zones closed to kite AND swimming, two banned beaches) — never in `stats.source`.
- **All four Hyères spots share one ERA5 + marine cell**, so their monthly numbers are identical. Rather than hide
  this, it became the cluster's editorial hook: *one wind statistic, four beaches, and the wind DIRECTION decides
  which one you drive to.* Stated openly in a layer on each entry.
- Honest negatives published rather than smoothed: La Nartelle 10-14% usable summer days; **Plage Cousteau is the
  least-windy cell in the whole French dataset** (3.8-6.4 kn means, 2-9% of days) and the entry says so in the summary.

## SKIP-LIST (Gate 6)
**Spots**
- `Cannes Palm Beach` — **coordinate unverifiable** (no OSM object for Palm Beach / Pointe Croisette; Nominatim and
  Overpass both empty). Already marked "marginal" in the verdict. Gate 4.3a → skip rather than publish an estimate.
  Consequence: `Air X Kite` had no spot to link to and was skipped with it.
- `La Ciotat` — as instructed (surf-forecast consistency 1/5).
- Nice / Antibes / Cagnes / Le Lavandou / Cavalaire / Pampelonne — as instructed.

**Centers**
- ⛔ `Pro Kite Center` / `Kite & Wing Evasion` — **SKIPPED FOR DUPLICATE RISK, and this is the important one.**
  `ecoles-kitesurf-almanarre.fr` turns out to be a **network portal listing three schools: "Ecole Kite Almanarre",
  "MF Kite" and "Kite & Wing Evasion"** under a shared ProKite banner. **MF Kite is already in our DB.** Posting
  "Pro Kite Center" could have created a second record for an operator we already carry. No address published,
  site © 2025. Needs a human to decide which legal entity is which before anything is added.
- ⛔ `Kite Center 83` — SSL cert expired, site unreachable, **no address and no OSM object anywhere**. Coordinate
  unverifiable → Gate 4.3a skip. (Verdict said "still list"; the coordinate gate overrides — it could not be placed.)
- ⛔ `Yacht Club de Six-Fours` — the OSM object exists (43.0746, 5.7980, `leisure=sports_centre`) but we have **zero
  verified information about what they actually offer**, only "membership required". Writing summary/services would
  have been invention. Skipped rather than fabricated.
- ⛔ `Fréjus Kite Surf` — an association that states "Nous ne donnons pas de cours" (€20/yr). Rather than create a
  centre record for something that is not a centre, **the useful fact was moved into the Saint-Aygulf spot itself**
  (the "missing channel" layer says the local association campaigns for a channel but does not teach). Better placement.
- ⛔ `Wing & Kite` — weak evidence, as instructed.
- ⛔ `Yellow Kite School` — NXDOMAIN, as instructed.
- ⛔ `Marseille Kite Club` — "Fermé temporairement", never to be added.

## FLAG-LIST (autonomous mode — the would-have-asked items)
- France-wide: 0 town records exist → creating them for every town this run touches (Gate 4.2b) — **DONE, 6 created**
- 🚩 **The Hyères zone list must be re-checked against the current-year arrêté before this is treated as legal
  guidance.** Every Hyères entry carries a visible "verify locally / zoning is re-issued" caveat, but the underlying
  source is a city PDF re-uploaded 07/2026, not the live arrêté.
- 🚩 **`La Madrague de Giens` — its "source-stated" coordinate in the verdict block (43.0414, 6.1278) turned out to be
  KGG Kitesurf School's street address** (1737 Route de la Madrague), not a spot coordinate. The spot was posted on an
  independently verified anchor (the marina), but its *character* claims ("flat, sheltered by the double tombolo,
  W/NW 10-25 kn, posidonia") now rest on a source whose coordinate provenance proved shaky. Worth a re-check.
- 🚩 **`Le Spot` prices conflict between sources.** Verdict block: kite €120-150, wing €150, weekend €280, plus
  cards (3-kite €420, 5-wing €650, 10-lesson €1200, e-foil €150). Live site 2026-08: kite AND wing 3h30 = **€120**,
  weekend stages from **€220**. Only the entry-level figures both sources support were published, with a note that
  longer cards exist and vary. Someone should phone them.
- 🚩 **`IKS Issambres` commune is unresolved.** Name points at Les Issambres (commune of **Roquebrune-sur-Argens**),
  the verdict block files it under Sainte-Maxime, `/lecole/` 404s and no address is published. Posted with
  `town: "Sainte-Maxime (Var)"` (the gulf and spot it serves) and the ambiguity spelled out in `coords_label`.
- 🚩 **`La Cahute` prices** — the verdict block lists windsurf €25/1h, €200/10h and wing €80/1h30, €730/11× marked
  "⚠️ verify". The live site publishes **no prices at all**. Published as not-published rather than carrying figures
  we could not confirm.
- 🚩 **`Centre Nautique AGASC` does not teach kitesurf** — confirmed on their own pages. The verdict block presents
  Plage Cousteau as "the Côte d'Azur's real kite spot", which is still true of the *spot*, but its only centre is a
  wing/windsurf/catamaran/paddle operation. The spot keeps `kite` in `sports`; the centre does not.
- 🚩 **Brutal Beach has no wind-sports school directly on it.** La Cahute is 3.5 km south at Plage des Charmettes and
  closes Nov-Mar — i.e. exactly through the mistral wave season. Six-Fours Surf Club runs surf/SUP on the sand but is
  not a wind school. Both linkages are honest but neither is a true on-beach wind operator.
- 🚩 `Saint-Aygulf` — the precise kite launch area could not be pinned to a sub-beach, which is unsurprising given
  that **the spot's headline fact is that no dedicated channel exists**. Anchored on Plage des Esclamandes.

## VERDICT — LANGUEDOC-ROUSSILLON + CAMARGUE (agent a9c1b4a05bfd663ac) ✅
⭐ **THE HONEST HEADLINE: this is a WIND coast, not a wave coast — and SUMMER IS THE WORST SEASON.**
Real seasons = **Mar-Jun + Sep-Nov**; July-Aug brings weak thermals PLUS the heaviest legal restrictions.
"Anyone selling a July kite trip to this coast is selling the wrong month." Med waves = storm wind-swell,
need ≥2 m / period >6-7 s, Sept-May concentrated Sept-Dec (surf-report.com). Only **Sète** and **Carro**
genuinely serve wave surfers; everything else flat/chop.

SPOTS TO ADD (ranked, coords APPROX — must reverse-geocode per Gate 4.3a):
1. **Beauduc** (plage de la Comtesse, Salin-de-Giraud/Arles, 13) ~43.37,4.58 — kite/wing, FLAT (stand 150-200 m out).
   The legendary wild one: ~20 km bay, ZERO infrastructure, 8-15 km dirt track, no rescue/water/power/toilets,
   self-rescue required. Mistral N/NW = the money wind (side-shore); SE offshore = avoid. Bird zones 1 Apr-30 Sep.
   ⚠️ Vehicle width gauge ~2.05-2.10 m (sources disagree: Arles 2.10, Parc 2.08, school 2.07 → publish 2.05 conservative
   + say sources disagree). Quads/moto banned. Camping/caravanning banned; BIVOUAC CONTESTED (Arles tolerates if
   dismantled, Parc forbids) → present as contested. Cabanon demolitions ONGOING (2024 + 2025 waves).
   Kiting permitted in buoyed secteur de la Comtesse, ~4 km corridor, run by CKC + Kite 13.
2. **Plage de l'Espiguette** (Le Grau-du-Roi, 30) ~43.50,4.14 — kite/wing/windsurf, FLAT. The region's main kite beach.
   ⚠️ MUNICIPAL ARRÊTÉ: kites banned on ALL Grau-du-Roi beaches **15 Apr-15 Oct** EXCEPT the marked Espiguette sector
   between concessions 24-25. In Jul-Aug you cannot navigate within 300 m anywhere else in the commune.
3. **Plage Napoléon** (Port-Saint-Louis-du-Rhône, 13) ~43.36,4.85 — kite/wing/windsurf/land-yacht, FLAT, 10 km sand.
   Mistral amplified by the Rhône-valley venturi; land-yachts hit 90 km/h. Strong year-round.
4. **Sète — Le Lazaret / Les Quilles / La Corniche** (34) ~43.39,3.68 — ⭐ the region's ONE real WAVE spot (+ windsurf/kite/SUP).
   S/SE swell; marin makes it, tramontane blows it out. Reef/urchins at Le Barrou; dikes; outside-the-dike more dangerous.
   Sept-May, best Sept-Dec. 3 official zones incl. Le Pont-Levis (PDESI-labelled since 11 Feb 2015).
5. **Le Barcarès — Parc des Dosses** (66, Étang de Leucate south) ~42.80,3.03 — VERY FLAT freestyle. ⚠️ cable-ski pylons in
   the riding area; tramontane offshore-ish. ⚠️ legal grey zone: "not explicitly authorised, not prohibited" (2020 source).
6. **Étang de Leucate** (Le Goulet/Les Pilotis/La Corrège/La Mine, Port-Leucate, 11) ~42.87,3.03 — FLAT beginner lagoon,
   standing depth. **NOTE: the SEA side (La Franqui) already exists in our DB — this is the LAGOON, a separate spot.**
   ⚠️ Kite PROHIBITED at "La Mine" and at the oyster parks (La Corrège).
7. **Étang de Thau** (Mèze/Marseillan/Bouzigues, 34) ~43.42,3.60 — FLAT lagoon. ⚠️ BRAND-NEW arrêté n°197/2026 (15 Jun 2026):
   5 kn in the 300 m band, 15 kn in the yellow channel, 25 kn elsewhere; central "tocs" zone + oyster parks forbidden
   year-round; kite schools hold DEROGATIONS (may operate near tocs + Conque inlet at Mèze); jet-ski/towed buoy/parasail
   banned outright. A previously seasonal interdiction is now PERMANENT.
8. **La Grande-Motte — Terre-Plein Ouest** (34) ~43.55,4.07 — kite/wing, flat but a serious WAVE spot in SE wind.
   Dedicated YEAR-ROUND kite zone vs the west quay, ~1500 m² rigging. Swimming + all non-kite watersports banned in the zone.
9. **Plage du Petit Travers** (Carnon/Mauguio, 34) **43.5529,4.0089 (FFVL-published, precise)** — buoyed kite channel YEAR-ROUND,
   200 m technical + 2×50 m buffers, widening to 400 m offshore. Very shallow first 30 m.
10. **Plage de Piémanson** (Salin-de-Giraud, 13) ~43.35,4.73 — 7 km wild beach, tarmac-accessible Camargue alternative to Beauduc.
    S/SW ideal side-on; mistral = side-OFF experts only. Powerful lateral Rhône current. Parking 6-22h only; camping/bivouac/
    BBQ TOTALLY banned since 2016 (~€1,500 fines).
11. **Carro / La Couronne** (Martigues, 13) ~43.33,5.04 — WAVE, best-known west of Marseille. ⚠️ UNDER-VERIFIED (could not fetch
    a working spot description) → research before publishing.
12. **Plage du Cavaou / Anse de la Gracieuse** (Fos-sur-Mer, 13) ~43.40,4.90 — FLAT 6 km sandbank, school claims ~250 windy days/yr.
Marginal/lesson-venue only (do NOT create standalone): Aresquiers, Étang d'Ingril, Étang de Pissevaches, Sainte-Marie-la-Mer,
Canet/Pont des Basses, Port des Cabanes, Le Boucanet, Narbonne-Plage, Cap d'Agde beaches, Torreilles, Saint-Cyprien,
Marseillan-Plage, Vias, Valras, Argelès/Le Racou.

CENTERS (with published prices where the operator publishes them):
- `Hibiskite` hibiskite.com — Espiguette, kite. **€430** 3-day weekday stage (excl Jul/Aug). YouTube ~mid-2026 ✅
- `OKLM School` oklmschool.com — Grau-du-Roi/Port-Camargue, kite/wing/surf-foil. CGV 2026, directory Jul 2026 ✅ ⚠️ Maps name is keyword-stuffed
- `Club 30 Kite` club30kite.com — Espiguette, kite. ⚠️ weakest recency (2023 FFVL link) — verify
- `UCPA Port Camargue` — kite + multisport, packages not published
- `Topkite` topkite.fr — **Plage Richelieu, Cap d'Agde**, kite/wing/wake/e-foil/SUP/parawing. 4.8/42 reviews ✅
  **Wake €70 · Foil init €90 · Wingfoil card €150 · E-foil perf €150.** Insurance = **FFV (sailing fed), €5.50/day or €14/yr**
  ⚠️ second domain kitesurf-capdagde.fr has a TLS handshake error
- `Tiki Center` tiki-center.com — Étang d'Ingril, Frontignan. 4.9/45 ✅ **Kite mini-group €160 · Wing €130 · E-foil €70 · Wake €50 · SUP €35**
- `Fild'air` fildair.com — base Centre nautique Taurus, Mèze (Thau); runs **Beauduc camps**, 2026 dates published ✅
- `Ventileau` ventileau.com — Marseillan-Plage/Thau, boat-access flatwater. FFVL-agréée ✅ **€150 / 3 h, max 2 students**
- `Nautisme Sète` nautisme-sete.fr — municipal/FFV, windsurf/wingfoil/catamaran + publishes the official Sète zone guides.
  "Multisports ÉTÉ 2026", bookings opened 6 May 2026 ✅
- `L'effet Kiteschool` l-effet-kiteschool.com — Palavas, boat shuttle to whichever beach suits the wind. 5.0/39 ✅
  **4-day/20 h €500 low / €540 high · 5 h lesson €160 · foil private €250 · wingfoil private €190** ⚠️ site © 2013
- `Monki` montpellierkitesurf.fr — Palavas, kite/foil/wing/e-foil/wake. Founded 2020, 2024-25 content ✅ ⚠️ brand/domain mismatch
- `L'École KWM` kitewingmontpellier.fr — Plage des Aresquiers (5 min by boat) + 5 other beaches. ⚠️ association membership €5/yr
- `Surf and Kite` surfandkite.fr — **Parc des Dosses, Barcarès**. Site page dated **28 Jul 2026** — strongest recency in the dept ✅
  AFK-affiliated, issues KITEPASS (not FFVL)
- `CBCM Boarder Club` cbcmboarderclub.org — Saint-Cyprien + Canet, kite/windsurf/surf/wing/SUP/sailing/snowkite. Jun 2025 ✅
- `Kite School-Leucate` kiteschool-leucate.com — Étang de Salses-Leucate. © 2024 ✅ **kite/wing/e-foil from €130 · supervised nav €110 · SUP €15**
  ⚠️ brand says Leucate (11) but registered address is Saint-Laurent-de-la-Salanque (66)
- `Kitesurf 66` — Pont des Basses, Canet; boat departure. No website (phone/FB only). Tourist-office listing + 2026 hours ✅
- `UCPA Port-Barcarès` — kite/windsurf/wake from age 7
- `Lilikitesurf` lilikitesurf.com — **Beauduc**, kite. Site notes track improvements "début juillet 2026" ✅ AFK/GMK #01981, Kitepass
- `Booster-Kite` kitesurf-ecole.fr/.com — Plage Napoléon. ⚠️ own-page reviews 3-6 yrs old, TWO live domains → verify
- `GlissAcademy` glissacademy.com — Anse de la Gracieuse, Fos. Image uploads Feb 2025 ✅
- `Thaukite` — CLUB not a school; publishes the Thau regulatory updates (post 17 Jun 2026)

☠️ DEAD / DO NOT ADD:
- `Kitexperience Beauduc` — their OWN page still says "FERMÉE pour été 2021"
- `Mistral Kite Passion` (Port-Saint-Louis) — expired TLS cert, site unreachable, zero 2022+ evidence
- `AnnaKite` (Fleury) — ⚠️ CONFLICTING: Maps "permanently closed" + miscategorised as a yoga instructor, but site live and
  tourist board still lists it → phone check required, do not publish either way
- `Triderland`, `Ride Academy by Seb Garat`, `Tomtom Kite Leucate` — Maps listings only, no dated evidence → not safe yet

🔑 LICENCE NUANCE (do NOT write "FFVL is required in France"): affiliation varies per operator —
FFVL (Club 30, Kite School-Leucate, OKLM, Ventileau, CBCM) · **FFV = the SAILING federation** (Topkite, €5.50/day or €14/yr) ·
**AFK/GMK KITEPASS, not FFVL** (Lilikitesurf, Surf and Kite) · association membership (KWM €5/yr).
General ZRUB/ZIEM mechanism: summer 300 m bathing zones exclude all craft, 15 shore-access channels 300×30 m;
outside season ZRUB → ZIEM. Net effect: access is narrowest exactly when the wind dies.

📌 BEST NEXT SOURCE: FFVL terrain sheets (federation.ffvl.fr — 403 to bots, works in a browser). Only the Carnon sheet was
mined; La Grande-Motte, Espiguette, Beauduc and the Leucate lagoon sheets exist and hold exact zones + coordinates.

## VERDICT — HYÈRES/GIENS + PROVENCE/VAR/CÔTE D'AZUR + CORSICA (agent af592b0cea9378803) ✅

### ⭐ HYÈRES / GIENS — the gap Lode named. L'Almanarre already in DB = only the WEST side.
- **La Badine** ~43.045,6.155 — kite/wing/windsurf, **WAVE spot on EAST wind**. ⚠️ east wind is OFFSHORE (blows you to sea);
  submerged anti-swell booms off La Capte port exit; launch ≥100 m out. Apr-Jun, Sep-Oct.
- **La Capte** ~43.052,6.150 — wing/kite/windsurf, **FLAT on WEST wind** ("plan d'eau flat idéal vitesse/jibes"). 4 km beach.
- **La Madrague de Giens** **43.0414,6.1278 (source-stated)** — wing/kite/windsurf, FLAT, sheltered by the double tombolo. W/NW 10-25 kn. Posidonia beds.
- **La Bergerie** ~43.055,6.128 — ⚠️⚠️ **KITESURF BANNED by municipal arrêté** (2 independent sources: kitesurf-var.com + Hyères Kitesurf Assoc.
  "Deux zones interdites: Plage de l'aéroport et Plage de la Bergerie"). School teaches by BOAT DROP-OFF. → list as **windsurf + wing only**.
- 🚩 HYÈRES KITE RULES (city PDF, re-uploaded 2026/07): two MANDATORY channels — **chenal du Mérou** + **chenal de l'Almanarre**;
  "le départ depuis le littoral se fait uniquement à partir des chenaux". Zone tampon each side banned to kite AND swimming.
  Almanarre main zone ~250 m wide, swimming formally forbidden inside (Nice-Matin 2 Jul 2025). Ville d'Hyères confirms "obligatoire".
  🔎 verify exact zone list against the current-year arrêté before publishing.
CENTERS (Hyères): `Le Spot Kitecenter & Wingcenter` kitesurf-var.com — Almanarre + La Bergerie(boat), 4.8/470 ✅
  **kite 3h30 €120-150 · wing 3h30 €150 · 3-kite card €420 · 5-wing €650 · 10-lesson €1200 · weekend stage €280 · e-foil 1h €150**
· `KGG Kitesurf School` kitesurfhyeres.com 4.5/163, blog Jul-Aug 2026 ✅ · `KifKite` 4.7/53 (Plage Ibis/La Capte)
· `Kite Center 83` kitecenter83.fr 4.7/29 ⚠️ SSL EXPIRED · `Pro Kite Center` ecoles-kitesurf-almanarre.fr ⚠️ THREE names
  (also "Kite & Wing Evasion") — one operator, pick one + note aliases · `Wing & Kite` wing-kite.com ⚠️ weak evidence, verify
❌ `Yellow Kite School` — domain NXDOMAIN, do not add. (Already in DB: MF Kite, Funboard Center.)

### PROVENCE / VAR / CÔTE D'AZUR
1. **Brutal Beach (plage de Bonnegrâce)** Six-Fours ~43.093,5.809 — ⭐ **genuine Med WAVE spot** (mistral wind-swell, short+powerful),
   named by Robby Naish. Entry between two breakwaters; "il est impératif de naviguer au large" (FFVL Brusc). Experienced only.
   → `La Cahute Gliss'Center` lacahute.com (Plage des Charmettes; windsurf rental €25/1h, €200/10h; wing €80/1h30, €730/11×) ⚠️ verify
   · `Six-Fours Surf Club` sixfours-surfclub.com © 2026 ✅ · `Yacht Club de Six-Fours` ⚠️ membership required
2. **Marseille — Pointe Rouge** ~43.244,5.366 — kite/wing/windsurf; waves above ~20 kn mistral. Rocks, cramped, crowded, experienced only.
   → `FKS Fada Kite School` fadakite.fr 4.9/129 ✅ **wing 2h €150 · tracté 30min €80 · kite 3h €220**
   · `Massilia Kite School` massiliakiteschool.com 4.8/89 ✅  ❌ `Marseille Kite Club` = "Fermé temporairement" DO NOT ADD
3. **Marseille — Prado / Plage de l'Huveaune** ~43.259,5.377 — beginner kite/wing + storm surf right after big mistral.
4. **Saint-Aygulf / Fréjus** ~43.396,6.719 — kite/wing/kitefoil, Argens river mouth. ⚠️ NO dedicated channel yet (assoc. lobbying).
   → `Kitesurf Evasion` kitesurf-evasion.fr © 2026 ✅ · `Fréjus Kite Surf` = ASSOCIATION not a school ("Nous ne donnons pas de cours"), **€20/yr**
5. **Sainte-Maxime — La Nartelle** ~43.320,6.667 — kite zone = EASTERN end. NE = offshore. → `IKS Issambres Kite School` iksazur.com 4.7/30 ✅
6. **Saint-Laurent-du-Var — Plage Cousteau** ~43.658,7.187 — FLAT on E/SE (airport shelters the water); the Côte d'Azur's real kite spot,
   not Nice/Cannes. → `Centre Nautique AGASC` agasc.fr, Instagram ~2 Aug 2026 ✅
7. Cannes Palm Beach — marginal, add only for `Air X Kite` airxkite.com (**discovery €150 · 3-pack €420**) ✅
❌ SKIP: **La Ciotat** — surf-forecast consistency **1/5 "rarely breaks"**. Nice/Antibes/Cagnes/Lavandou/Cavalaire/Pampelonne — no verified school.

### CORSICA
1. ⭐ **Piantarella** (Bonifacio) **41.37,9.22** — FLAT turquoise lagoon, waist-deep, sandbank to Île Piana; venturi through the strait.
   ⚠️ inside the **Réserve Naturelle des Bouches de Bonifacio**; many anchored boats; "never go alone toward the Lavezzi".
   **Apr-Jun + Sep-Oct** (Jul/Aug avoided — boats+crowds). → `Bonifacio Windsurf` bonifacio-windsurf.com (blog 25 Feb + 28 Jul 2026 ✅)
   · `Club de Voile de Bonifacio` ecole-windsurf.com **group 1h30 €50 · private 1h €90 · wing rental €35-290**
2. **La Tonnara** (Bonifacio) ~41.398,9.163 — "réputée dans le monde entier pour le kite et le windsurf". E = offshore.
3. **Balistra** (Bonifacio) ~41.446,9.235 — two faces: W = offshore glassy FLAT, E = choppier. Intermediate+.
4. ⭐ **Capo di Feno** (Ajaccio) **41.9356,8.6198** — **the island's real WAVE spot**, beach break sand L+R, "marche assez souvent"
   (Wannasurf). → `Capo Surf Club` caposurfclub.com (created 2006, event Oct 2025 ✅)
5. **Plage de la Roya** (Saint-Florent) ~42.680,9.302 — flat/shallow wind spot. ⚠️ TripAdvisor 3.5/324 with repeated **water-cleanliness**
   complaints → publish that honestly. → `CESM Saint-Florent` ⚠️ HTTPS cert broken (points at OVH cluster)
6. **Algajola** (Balagne) ~42.610,8.860 — genuine Med wave spot, multiple peaks, N-facing; libeccio side-offshore cleans it.
   ⚠️ rocky peaks, "Danger d'Algajola" reef, "TRÈS DANGEREUX" in strong wind, S-SE pushes you 100 km toward Liguria.
   ⚠️ surf-forecast consistency **1/5** — windswells >> groundswells. Best Dec/Nov/May. → `Algajola Sport & Nature` asn-corsica.com ⚠️ verify
7. **Porto Pollo (CORSICA)** ~41.708,8.799 — ⚠️⚠️ **NOT the Sardinian Porto Pollo we already added** — different island, same name!
   One of the few Corsican spots where SUMMER is the good season (thermal). ⚠️ kite launches from **plage du Taravo ONLY**.
   → `Centre Nautique de Porto Pollo` 4.6/35 ✅
8. **Calvi bay** ~42.560,8.760 — NE = waves 1.5-2 m; mistral = smooth slalom. Hosted the **first National Wingfoil 17-19 Apr 2026**.
   → `Calvi Nautique Club` calvi-nautique-club.com ("Inscriptions Stages Été 2026" ✅) · `Corsica'Wing` corsicawing.fr 4.8/72 **stages from €300**
9. **Ventilegne** (Bonifacio) ~41.428,9.130 → `Corsica Kiteboarding` corsica-kiteboarding.com **semi-privatif €160/180 · stage premium €450/510**
   · `École Kitesurf Corse` (a.k.a. **Ride Pro Center** ⚠️ two trading names) kitesurfcorse.com **1st kite €180 · 5 lessons €750 · wing €90 · 5-day €550**
10. **Santa Giulia** ~41.545,9.290 → `Club Nautique Santa Giulia` 4.7/211 · **Pinarello** ~41.700,9.393 → `Société Nautique de Pinarello`
    **1×1h30 €80 · 2× €150 · 3× €205**
❌ **Nustrale Ride** (Balistra) — CLOSED 2023, own site says so, handed activity to Bonifacio Windsurf. STILL RANKS PAGE 1 ON GOOGLE.
❌ Marginal: Ostriconi ("le plus joli" but rarely works), Lozari, Saleccia (12 km dirt track ~1h), Maccinaggio, Cap Corse, Bastia,
   Ghisonaccia, Solenzara.

### VENDÉE / CHARENTE / GIRONDE — ⚠️ SECOND-HAND, sub-agent, NOT re-verified. Spot-check before posting.
La Tranche-sur-Mer (+Bud-Bud/La Terrière) = the region's big wind/kite destination, priority · Les Sables-d'Olonne (Sauveterre/Tanchet) WAVE
· Cap Ferret/Le Truc Vert WAVE ⚠️ **baïnes are lethal rip channels** · Île d'Oléron (Vert Bois, La Cotinière, Chassiron) · Île de Ré
(Le Lizay, Les Grenettes, Gros Jonc) · Carcans-Océan / Le Porge-Océan ⚠️ baïnes · Biscarrosse-Plage · Hourtin-Plage + Lac de Carcans-Hourtin
(the lake = the flatwater option) · La Palmyre/La Grande Côte Royan.

## ❌ STILL NOT RESEARCHED (gap, be honest with Lode)
**LANDES / BASQUE — France's CORE SURF COAST — zero coverage delivered.** Nothing for: Mimizan, Contis, Saint-Girons, Moliets,
Vieux-Boucau, Soustons, Messanges, Capbreton (La Piste, Santocha, La Centrale, Le Prevent), Labenne, Ondres, Tarnos/Le Metro,
Guéthary (Parlementia, Avalanche, Cénitz), Bidart (Ilbarritz, Erretegia, Uhabia), Saint-Jean-de-Luz (Lafitenia, Erromardie,
Sainte-Barbe), **Belharra**, and the non-DB Hossegor/Seignosse peaks (La Nord, La Sud, Le Penon, Les Bourdaines, Les Culs Nus).
→ **highest-value remaining gap in France.**

## VERDICT — ZUIDELIJKE CÔTE D'OPALE + SOMME (agent a62751c748043cfb0) ✅
⭐ **HEADLINE: this is a WIND + CHAR-À-VOILE + LEARN-TO-KITE coast, NOT a surf coast.**
Berck surf-forecast consistency **2/5**, "only works once in a while", "summer tends to be flat". What this coast HAS at world
level: char-à-voile (**Berck = its birthplace, first French club 1904**), kilometre-scale low-tide sand flats (sea retreats
**2-3 km** at Berck), and tidal flat-water lagoons ("bâches") that make it a genuinely excellent learn-to-kite coast.
→ "If SurfGoose describes any of this as a wave-surfing destination, riders will find out on their first flat, freezing,
kilometre-long walk to the waterline."

TIDE IS THE DEFINING FEATURE — it decides whether a spot exists at all:
Berck rideable most of the day (300-400 m sand buffer even at high tide) · Cayeux/La Mollière = **LOW tide** · Le Crotoy =
**HIGH TIDE ONLY** · Ault = LOW tide, autonomous only · Le Touquet Baie de Canche = high tide, launch depends on coefficient.

SPOTS TO ADD (7) — coords from FFVL terrain sheets, still must pass Gate 4.3a:
1. **Berck-sur-Mer** 50.4118,1.5623 (FFVL kite zone 2260) — kite/wing/char-à-voile/speed-sail/buggy. **400 m marked kite zone
   between two flagged poles, dedicated YEAR-ROUND**, access at the char-à-voile school north side. Other beach users have
   PRIORITY in the technical zone. Good: SO/S/N/O/NO · bad: SE/E/NE (E = offshore). ⚠️ Baie d'Authie currents + ROCKS.
   FFVL's own fallback advice for NE wind: Wissant, 45 min away (we already have Wissant).
2. **Fort-Mahon-Plage** 50.3436,1.5489 (FFVL 2215) — ⚠️⚠️ **KITE BANNED along the town sector, permanently** (arrêté 1 mar 2007,
   art. 1: interdit on the beach + the 300 m band from the base-nautique boat park to the last building rue des Vagues).
   Char-à-voile DISPLACED 15 Mar-30 Sep (arrêté 2022.101 art. 6) — transit only, in supervised convoy at the water's edge.
   Navigation channel 300×200 m, 5 kn. Drones forbidden (art. 7). North beach closed 1 Mar-31 Aug (arrêté 2023.52).
3. **Cayeux-sur-Mer / La Mollière** 50.1973,1.5405 — **the best AUTHORISED Somme kite spot**; low-tide "bâches".
4. **Le Touquet-Paris-Plage** 50.5168,1.5794 (Base Nautique Sud) — char-à-voile/kite/SUP/beginner surf/e-foil. High tide;
   ⚠️ ebb current in the Canche, rock armour N+S.
5. **Quend-Plage-les-Pins** 50.3194,1.5716 — char-à-voile flagship; marginal for kite. ⚠️ FFVL record [2273] is an empty stub
   "A RENSEIGNER" and its coords point at Quend VILLAGE not the plage — do NOT use them.
6. **Hardelot-Plage** 50.6326,1.5795 (approx) — kite/wing/char-à-voile, low-tide baïnes. ⚠️ NO kite school operates here.
7. **Le Crotoy — plage nord** 50.2412,1.6178 — ⚠️ HIGH TIDE ONLY + reserve rules; riders must NOT cross the yellow buoys.

🚩 **BAIE DE SOMME — KITESURF IS PROHIBITED in the Réserve Naturelle Nationale** ("les voiles survolant le bord de mer font
fuir les oiseaux et les phoques", somme-tourisme.com). Only THREE authorised kite spots in the area: **La Mollière, Le Crotoy
plage nord, Fort-Mahon**. → DO NOT create a "Baie de Somme" spot.
🦭 SEALS (official 2026 charter, DREAL Hauts-de-France): binding minimum **100 m** from haul-outs, 100-300 m caution band
(no abrupt changes, stay parallel, never encircle); peak sensitivity **15 May-31 Jul**, max 4 boats, max 20 min.
Press/signage commonly say 300-500 m → publish 300 m as practical guidance, cite the charter for the legal minimum.
❌ DO NOT LIST AS SPOTS: Baie de Somme (kite prohibited), Baie d'Authie (hazard zone), Le Hourdel (seal reserve edge, club
water), Saint-Valery-sur-Somme (estuary channel, sailing only), Onival. MARGINAL: Ault, Merlimont, Stella-Plage.

WATER TEMP — verified Open-Meteo Marine 2023-25 (corrects the assumed range): coldest **Feb ~7.8-8.1 °C**,
warmest **Aug ~20.2-20.4 °C** (not 18-19). Best wind Oct-Apr; best swell autumn/winter; summer = flat + crowded + lifeguard-restricted.

CENTERS (✔ = prices on their own site):
- `Éole Club de Berck` eoleclub.fr — char-à-voile ONLY, national school label, events Sept 2025 ✅
- `Opale Kite` opale-kite.fr — Berck kite ✔ **collective 3h €110 · private 3h €150 · MTB/landkite €80 · supervised nav €80**
  ⚠️ no dated post ≥2022 found — verify Facebook before listing active
- `École de Kitesurf des 3 Baies (EK3B)` ecoledekitedes3baies.com — Le Touquet Base Nautique Sud, AFKITE ✅ (Dakhla trips 2025)
  ✔ **private 2h30 €200 · group 3h €120 · 4× group €440 · 4× private €750 · supervised nav €70/€90**
- `Kite Passion` kitepassion.fr — Cayeux/La Mollière + teaches Le Crotoy & Ault by tide. FFVL école n°29924 ✅ (2026 season)
  ✔ **découverte 2h30 €70 · beginner 3h €120 → 5× €560 · coaching 2h30 €170 · foil 2h30 €80 · downwind Ault-Cayeux €30,
  Ault-Le Crotoy €40 · FFVL licence €16** ⚠️ site header says "KitesurfPassion" (mismatch) + **HTTPS BROKEN** (OVH cluster cert)
- `Eolia` eolia.info — Fort-Mahon + Quend, char-à-voile/catamaran/kayak ⚠️ Maps lists it as "Base Nautique de Fort-Mahon-Plage"
- `Ozone` ozone-charavoile.com — Quend-Plage char-à-voile, reviews Apr-May 2026 ✅ ✔ **from €45/pers**
- `Aéris` aerischaravoile.com — Fort-Mahon char-à-voile, TripAdvisor 2024 awards ✅ ✔ **adults €45 · <12 €40 · <7 €35**
- `Base de Glisse d'Hardelot` basedeglissehardelot.fr — municipal umbrella hosting CNH + Les Drakkars (char-à-voile) + KMCO.
  **NO kitesurf or wingfoil taught.** Page dated 24 Nov 2025 ✅ ✔ **char-à-voile kids 5×2h €125 · adults €45/2h**
- `Centre Nautique Bertrand Lambert` — Le Touquet, MUNICIPAL, run around Bertrand Lambert **5× world champion** ⚠️ also
  marketed as "Base Nautique Sud"
- `Club Nautique de Merlimont` ✔ **char-à-voile €35-40/2h, €150-160/week** · `Sport Nautique Valéricain` (FFVoile, created 2023)
- `Club École de Voile de Berck` — ⚠️ operates on **Lac de Conchil-le-Temple, an INLAND LAKE**, not the beach. Wingfoil +
  e-foil, "Foil Academy" from age 14 → this is an INLAND spot candidate, file it separately.
❌ EXCLUDE: `Easy Kite` (easy-kite.fr) = **"EASY KITE BRESIL", based in Brazil**, French phone only — appears in Berck searches.
❌ `Base nautique du Crotoy` — actu.fr 22 Jan 2024: "fermée depuis 20 ans"; Somme Tourisme lists NO operator at Le Crotoy.
❌ `Club de Char à Voile de la Baie de Somme` — directory-only generic copy, stale.
⚠️ `Chès Cayteux` — real FFVL club n°29058 but no working website → reference only, not a school.
⚠️ `EKBS` (Cayeux) — real + directory-listed but JS-only booking page, no dated source ≥2022 → verify.
⚠️ charavoile-hardelot.com + cnstellien.fr — both resolve to 91.132.253.137 but REFUSED connections → re-test before linking.

📌 DISTINCTIVENESS worth writing: Berck = world capital of char-à-voile (1904); the **Berck kite festival is DISPLAY kiting,
NOT kitesurf** (40th ed. 17-25 Apr 2027; first-ever aerial photo by kite taken there 1887) — don't conflate them.
Downwinders are a real local product: Ault→Cayeux 1h30, Ault→Le Crotoy 2h30.

## VERDICT — LANDES + PAYS BASQUE (agent a633402e4676c5e16) ✅ — THE BIG GAP, NOW FILLED
France's core surf coast. 34 spots ranked. All coords approximate (Nominatim) → still must pass Gate 4.3a.

TOP SPOTS TO ADD (ranked):
1. **La Piste (VVF)** Capbreton 43.6418,-1.4475 — WAVE, intermediate→advanced. Most consistent+powerful in town; deep banks
   fed by the **Gouf de Capbreton** give hollow fast barrels. Heavy shorebreak, strong rips, crowds. Sep-Nov. ⭐ headline after La Gravière
2. **Parlementia** Guéthary 43.4282,-1.6069 — WAVE, **EXPERTS ONLY**. France's premier big-wave PADDLE spot; ~20-min paddle out,
   easy to underestimate size from shore. ⚠️ straddles the Bidart/Guéthary commune line — say so rather than picking a side.
3. **Lafitenia** SJDL/Acotz 43.4139,-1.6285 — WAVE. The Basque Country's most famous RIGHT POINT; rides of hundreds of metres.
4. **Les Alcyons / Avalanche** Guéthary 43.4259,-1.6121 — fast hollow LEFT reef ~200 m south of Parlementia; works above ~1.5 m, holds 3-4 m.
5. **Belharra** Urrugne OFFSHORE 43.4036,-1.7178 (Wikipedia) — ⭐ tow-in big-wave phenomenon, shoal 14-18 m deep ~2.5 km offshore,
   8 m+ A-frames. **Breaks a handful of days per winter, some winters not at all.** → list as a PHENOMENON/spectator spot, Mundaka-style
   (Gate 5.6 world-class exception). Absolutely not a session for visitors.
6. **Moliets-Plage** 43.8530,-1.3934 — WAVE, beginner→advanced. Best all-round beginner-to-good beach in mid-Landes. Baïnes/rips.
7. **Le Prévent** Capbreton 43.6496,-1.4460 — WAVE beginner→int. Sheltered by the jetty + shaped by the Gouf: **the spot that still
   works when everything else is too big** — the region's best bad-weather fallback + biggest school hub.
8. **Le Santocha** Capbreton 43.6458,-1.4457 — historic teaching spot, club founded 1975.
   ⚠️ SOURCES DISAGREE on level for Santocha vs Prévent (club vs tourist office say the opposite) → write around CONDITIONS, don't assert a level.
9. **Plage Sud** Mimizan 44.2069,-1.3007 — the anchor spot of north Landes. Baïnes + Courant de Mimizan currents.
10. **Erretegia** Bidart 43.4433,-1.5869 · 11. **Cénitz** Guéthary 43.4225,-1.6196 (the ONLY mellow option in Guéthary; ⚠️ surf-forecast 2/10)
12. **Plage des Sablères/L'Estacade** Vieux-Boucau 43.7930,-1.4136 · 13. **Plage Sud** Messanges 43.7973,-1.3985
14. **Ilbarritz** Bidart 43.4595,-1.5700 · 15. **L'Uhabia** Bidart 43.4370,-1.5936 (beginner; ⚠️ long-standing bathing-water-quality record — verify)
16. ⭐ **La Nord** Hossegor 43.6804,-1.4411 — holds shape to ~6 m; **deserves its own entry, genuinely distinct from La Gravière**
17. **Les Bourdaines** Seignosse 43.6986,-1.4341 ("almost always has a wave") · 19. **Le Penon** Seignosse 43.6935,-1.4329 (honestly flag as inconsistent)
18. **Erromardie** SJDL 43.4037,-1.6424 · 20. **Contis-Plage** 44.0912,-1.3234 ("very rarely crowded" — the escape-the-crowds pick)
21. **Saint-Girons-Plage** 43.9526,-1.3627 · 22. **Sainte-Barbe** SJDL ~43.396,-1.664 ⚠️ COORD IS AN ESTIMATE (Nominatim gave an inland street)
23. **Le Métro** Tarnos 43.5522,-1.5059 · 24. **Labenne-Océan** 43.5987,-1.4709 · 25. **Pavillon Royal** Bidart 43.4536,-1.5833
26. **Ondres-Plage** 43.5771,-1.4886 · 27. **Courant d'Huchet beach** Moliets 43.8895,-1.3550 (⚠️ national nature reserve)
33. **Lac de Soustons / Port d'Albret** 43.7762,-1.4084 — ⭐ **the only genuinely FLAT/wing water in the region** (Gate 3.5 applies)
34. **Les Océanides** Capbreton 43.6371,-1.4498 — ⭐ explicitly set up for beginners AND **adaptive surf** (disabled surfers)
SUB-PEAKS, no separate entry: La Sud/Point d'Or, Les Culs Nus. FLAT not surf: **Grande Plage SJDL** (dyke-protected swimming/SUP bay —
"very rarely rideable") → include honestly as flat water. Marginal: Mayarco, Soustons-Plage.
📌 **The Gouf de Capbreton deserves an explainer, not a spot**: an underwater canyon thousands of metres deep starting a few hundred
metres offshore — unique in Europe for its proximity. It drives the currents + sandbanks that make La Piste and Le Prévent behave as they do.

🚩 FRENCH RULES THAT MATTER HERE:
- **Surfing inside supervised bathing zones is PERMANENTLY BANNED.** The **black-and-white CHECKERED FLAG is the boundary** — surf beyond
  it, never between the swim buoys (Anglet arrêté 2024/731 art. 20, the template up and down this coast). Anglet caps its whole coastline
  at **18 surf/wave-ski/kayak schools**.
- ⭐ **FOIL IS BANNED — Anglet was the FIRST CITY IN THE WORLD to ban foil sports on its beaches** (dedicated arrêté 2023/592, 9 Mar 2023);
  restrictions extend across Basque + Landes beaches. Kite-foil/wind-foil must go beyond the 300 m band via the Barre channel.
  → **never tell readers to bring a foil here without checking the current commune arrêté.**
- **Kite is NOT a general option on this coast.** Per FKSO: Seignosse/Estagnots restricted Jun-Sep during supervised hours (the preferred
  summer kite beach) · Hossegor Plage Sud outside summer only · Capbreton = surf town, wingfoil practised · Anglet La Madrague = the main
  year-round Basque kite spot · Guéthary-Bidart AVOID in season · SJDL "clairement pas pour les débutants" · Hendaye multiple launch zones.
  Everywhere else in Landes = treat kite as NOT a realistic visitor option, especially Jul-Aug.
- **"École Française de Surf" is a REAL label** from the FFS, not marketing. Claimed on their own sites: Max Respect, Moliets Surf School,
  Messanges Surf School, École de Surf La Dune, Alternative Surf School (since 2014), Alaia Surf Club, Sharkpool, Supdivision ("labellisée
  2026"), Capsurf, Christophe Reinhardt. FFSurf-affiliated CLUBS: Santocha (1975), Vieux Boucau Surf Club. ⚠️ directory presence ≠ the label.
- **Réserve Naturelle du Courant d'Huchet** (1981, ~618 ha): surfing the beach at the mouth is fine; **paddling up the courant is not** —
  reserved for professional boatmen.

CENTERS — the strongest, with own-site prices (full table in the agent output):
Mimizan: `La Sud Surf School` ✔€25-70 · `Quiksilver la Garluche` · `Silver Coast` · `Martin Surf School` (mobile) ✔35-300€
Contis/St-Girons: `Max Respect` (2 sites, FFS+Qualité Tourisme) · `Esprit Océan` ✔from €32 · `Cap Surf Cool`
Moliets: `Moliets Surf School` (FFS+QT) ✔3 cours €115/5 €169 · `Surfing Courant d'Huchet` ✔€65-300 ⚠️ live site is the .FR (OSM has the dead .com)
  · `Maâ Surf School` ✔€78-169
Messanges: `Messanges Surf School` (FFS label since 2012) ✔1h 1p €80 · `École de Surf La Dune` ✔first lesson €20, range €33-150
Vieux-Boucau/Soustons: `Vieux Boucau Surf Club` (FFS club, 1973) · `Surf Univers` (2026 booking open) · `Alternative Surf School` ✔€100-170
  · `Boardhead Wingfoil School` (Lac de Soustons — one of very few dedicated WING schools) · `Centre Nautique Soustons/Evad'Sport` (municipal)
Capbreton (~17 approved schools per the port): `Santocha Surf Club` (assoc. 1975, FFSurf) ✔from €30-36 · `Supdivision` (**FFS-labelled 2026**)
  ✔2h €35, 5j €150 · `Prévent Surf Cool` · `Adishats` · `Water Addict (WASA)` (from 4 yrs) · `Capbreton Surf House` ✔€35-410 · `Surf Océanide`
Labenne/Ondres/Tarnos: `Tiki Surf School` (2026 opening 4 Apr) · `Sharkpool` ✔2026 private 1p €110, group €38-40 · `Go & Surf` · `Ondres Surf Academy`
Bidart: `H2O` ⚠️ TWO live domains · `Aquality` · `Bidart Surf Évolution` ✔découverte €40, 5j €180, seniors €35 · `Experience` · `L'école de la Glisse`
  ✔5-day €200 · `Happy Life` ✔€100-160 · `SURF'SET 64` ✔collectifs €190/€350 · `Alaia Surf Club` (**claims 2nd school in France to be FFS-labelled**)
Guéthary: `Christophe Reinhardt` 🚩 NAME MISMATCH (tourisme64 calls it "École de Surf Quiksilver C. Reinhardt") ✔€45-190 via tourisme64
  📌 Guéthary has almost NO beginner infrastructure of its own — the schools serving it are Bidart-based and mobile.
SJDL/Acotz: `Habia Surfschool` · `Ben B Surf School` (Mayarco, since 2008) · `Bakun` · `Aparra Surfcamp` (2026 dates published) · `ESF Côte Basque` (umbrella)
KITE/WING: `Sud Landes Kite` (Seignosse, mobile) · `FKSO Fun Kite Sud Ouest` (assoc. 2004 — publishes the regional spot-and-rules guide)

🚨 **spiritsurfschool.com (Capbreton) now 301-REDIRECTS TO AN ONLINE-GAMBLING SITE** (deadrisingsun.com → esharktoken.com). The school is
still listed by the port of Capbreton and the FFSurf directory but its web identity is gone. DO NOT publish that URL. Highest-priority check.
☠️ DEAD DOMAINS: ecole-de-surf-guethary-bidart.com (NXDOMAIN) · surf-eskola.com (NXDOMAIN) · tarnos-surfacademy.fr · profdesurf.com ·
ndsurf.fr · ecoledesurfcontis.com · ecole-surf-soustons.com · bidartsurf.com (parked) · watusurf.fr (0 bytes — school probably fine, SITE broken)
⚠️ TOO STALE TO CALL ACTIVE: Dreamlandes (still shows COVID rules, 2022) · Desert Point (2022) · Bidart Surf Academy (2023) · New School (2023).
No year markers at all: Etik, Alaia, Alizé Arnaud, Pulse Surf Coaching, Surf Escapade, Quiksilver SJDL.

## VERDICT — FRANCE NORTH: OPAL COAST · NORMANDY · BRITTANY (agent a4c0d6023a1d49775) ✅

### ⭐ LODE'S TWO NAMED SPOTS — the honest answers
- **WIMEREUX (62)** 50.765,1.605 — ⭐ **ADD FIRST on this coast.** Real WAVE (reef) + real wind + infrastructure.
  surf/kite/wind/wing/SUP. **Tide: LOW→MID only, ±3 h of low — there is NO beach at high tide.**
  ⚠️ **Kite banned July-August before 19h** (FFVL site record 2209, updated 02/07/2025).
  → center `Wimereux Surf School` wimereuxsurfschool.com (season 1 Apr-7 Nov, **French Surf School + Handi-Surf labels both 2022**,
  Pas-de-Calais Tourisme updated 08/08/2026, Wim' Surf Festival 2nd ed. Jun 2026) · `Club Nautique de Wimereux` (FFV, windsurf/wingfoil)
- **SANGATTE / BLÉRIOT-PLAGE (62)** 50.94,1.74 (Blériot 50.961,1.820) — legitimate, but **as a strong-wind FLAT/CHOP spot, NOT surf**.
  surf-forecast: "unreliable waves", summer flat, **5% clean even in its best month**, warns of rips + pollution.
  Its real asset is WIND — reportedly the windiest spot in the region — and it is rideable at ALL tide stages, unusual here.
  ⚠️ HAZARDS to publish: **submerged wooden groyne posts barely visible at high tide** + Dover Strait ferry traffic.
  ⚠️⚠️ **COMMERCIALLY IMPORTANT: `2capskite` is DEAD (domain NXDOMAIN, cached text announced cessation of activity) yet is still
  heavily promoted on aggregators + TripAdvisor as "l'école référence dans le Nord Pas de Calais". There is now NO verified active
  school based at Sangatte/Blériot.**

### 🚨 THE TRAP THAT WOULD HAVE BURNED US
**`federation.ffvl.fr/terrain/*` is the PARAGLIDING database, NOT kite.** "SANGATTE BLERIOT PLAGE [1432]", "EQUIHEN [1355]",
"ESCALLES [1681]" are all *parapente* sites. Easy and consequential mistake.
Also demonstrably WRONG sources — do not cite: **wannasurf** files Calais/Wissant/Wimereux/Le Touquet/Berck/Dunkerque/Sangatte
under **Normandy** (all are Hauts-de-France); **surf-forecast makes the same error on Wissant**; **vagueo** files Wissant/Wimereux/
Sangatte/Hemmes de Marck under dept 59 (all 62); **thespot2be** files Gravelines under 62 (it is 59).

### QUANTIFIED WAVE-vs-WIND CALL (agent's own Open-Meteo computation, publishable)
Winter mean of daily-max wave height: **Crozon-La Palue 2.8-3.1 m · Quiberon-Penthièvre 2.6-2.7 m** vs **Wissant 1.7-1.8 ·
Le Touquet/Berck 1.6-1.7 · Étretat 1.4 · Saint-Malo 1.2 · Siouville/Le Rozel 0.9 · Ouistreham 0.9**.
→ **Crozon and Quiberon are the ONLY genuine Atlantic swell magnets in the whole northern half of France.**
→ **The Opal Coast is a WINTER/shoulder wind zone, not a summer one**: Wissant 62% of days ≥15 kn in February → **24% in August**. Not Tarifa.
→ **Siouville is real but swell-hungry**: best-in-Normandy quality, works ~12% of the time even in its best month. Publish that honestly.

### OPAL COAST — ranked (ecolesurf.fr lists exactly ONE surf school in all of Hauts-de-France; that fact should shape the page)
1 Wimereux (above) · 2 **La Pointe aux Oies** Ambleteuse 50.79,1.61 WAVE reef, mid tide, dangerous rips · 3 ⭐ **Gravelines "La Petite Mer"**
51.006,2.104 **FLAT LAGOON — most distinctive spot on the coast: high tide + coefficient >70 ONLY → a ~2-3 h window, roughly fortnightly.
Lead with the tide gate.** · 4 **Dunkerque Malo-les-Bains** 51.050,2.387 wind/land-kite/char-à-voile — NEVER as surf (3/10) ·
5 **Équihen-Plage** 50.67,1.57 the region's beginner wave, best Sep-Nov · 6 **Petit-Fort-Philippe "La Stèle"** 51.011,2.123 —
**any tide/coefficient, the most tide-tolerant spot on the coast** ⚠️ nuclear outfall canal is the east boundary ·
7 Sangatte (above) · 8 **Hardelot** ~50.63,1.58 natural baïnes = best beginner/freestyle flat water in 62 · 9 **Leffrinckoucke**
51.060,2.440 year-round unrestricted kite zone ⚠️ **wreck of the *Crested Eagle* (Dunkirk, 1940) visible at low water** · 10 **Le Portel**
50.71,1.58 ⚠️ Fort de l'Heurt 60 m exclusion, Digue Carnot 100 m · 11 **Le Touquet Baie de Canche** ~50.52,1.58 strong estuary currents ·
12 **Les Hemmes de Marck/de Oye** ~50.98,2.00 ⚠️ **INVERTED RULE: low tide, coefficient BELOW 60 only**; arrêté bans 15 Jun-15 Sep 09-18h ·
13 Bray-Dunes 51.080,2.514 · 14 **Berck** 50.41,1.56 = char-à-voile destination, not surf (10% clean).
CENTERS: `DFC Dunkerque Flysurfing Club` dfc-kiteboarding.fr (⭐ **the only kite simulator in France**; French Big Air Championship stage
23 Feb 2026; 4.8★/95) ✔kite €100 · nav €50 · wingfoil €150 · simulator €100 · `APG Le Portel` (FFVL club-école) ✔3-day multi-glisse €100 ·
`SHAKA KITESCHOOL` Équihen ✔3h €120 → 5d €550 · `École de Surf du Nord` (Équihen/Wimereux/Wissant) ✔€40, 5-pack €160 ⚠️ **formerly
"la Shaka" — do NOT confuse with Shaka Kiteschool** · `La Petite Mer` Gravelines (FFVL/EFK, 5.0★/45) · `Mer et Rencontres` Dunkerque
char-à-voile ✔€45/€37/€32 · `Cap Nord` Hardelot · `KITEZONE 62` ⚠️ duplicate Maps pins · `Kitecamp62` · `Base Nautique Jean Binard`
Gravelines (municipal — ⚠️ **NOT kite** per the official page) · `Eole Club` Berck (char-à-voile only, club since 1965) ·
`Borealis Char à Voile` Équihen ✔€35/1h30 · `Travel Kite` Malo.
☠️ DEAD: **2capskite (Sangatte)** · Dkite (Gravelines) · Les Albatros (newest post 2015) · Euro-Plage Voile · Kite Hemmes Oye.

### NORMANDY — one real surf zone + a long wind coast (7 surf schools in the west Cotentin vs 1-2 in ALL of Calvados+Seine-Maritime)
WAVE (all west Cotentin, 50): **Siouville** 49.56,-1.86 flagship ⚠️ **surfing banned in the summer bathing zone AND year-round in the
marked lesson zone**; Raz Blanchard <10 km north · **Le Rozel** 49.48,-1.85 **4/10 = best-quality wave in Normandy** · **Sciotot**
49.50,-1.85 · **Hatainville** ~49.42,-1.85 · **Anse de Vauville** ~49.63,-1.83 (Réserve naturelle, fines to €1,500) · **Diélette**
(the only genuine reef) · **Carolles/Kairon** 48.76,-1.57 learner wave.
WIND/FLAT: ⭐ **Merville-Franceville** (14) — best wind spot in Calvados + the hardest citable law: a named **chenal n°1 réservé à la
pratique du kitesurf**; kite allowed all year on the whole beach EXCEPT 16/06-15/09 → chenal n°1 only; westernmost 300 m permanently
closed (bird reserve) · **Collignon** (Cherbourg) flat even in storms ⚠️ pollution + military shipping · **Gouville** ⚠️ fast tidal
return over the flats · **Saint-Aubin-sur-Mer (76)/Saussemare** — best in Seine-Maritime; mairie bans offshore SW→ESE ⚠️ **NOT the
Saint-Aubin in Calvados** · **Ouistreham Riva-Bella** Normandy's kite capital, only when water height <5 m; **no surf-forecast break
page exists — it is not a surf break** · **LH Beach/Le Havre** ⚠️ France's 2nd port, constant tanker traffic; "avoid high tide at all costs"
· Jullouville/Kairon · Agon-Coutainville (club since 1929) · Havre de St-Germain-sur-Ay · Urville-Nacqueville (⚠️ tidal stream to 15 km/h)
· Cabourg · Quinéville/Ravenoville · Sainte-Adresse (⚠️ GALETS — shoes required).
⚠️ **Étretat** — 3/10, shingle over reef, **the most-searched name in the department and the most misleading**. ⚠️ arrêté municipal
28 Apr 2025 restricting cliff-path AND beach access; July 2026 controlled collapse of the falaise d'Amont. → add as an honest
"skip"/warning entry; the arrêté is more useful to a reader than a fake star rating.
⚠️ REGION-WIDE: **Mont-Saint-Michel bay tidal range ~15 m at exceptional springs** (largest in Europe). **Raz Blanchard runs 6 to
nearly 12 knots.** ⚠️ the widely repeated "third strongest current in the world" claim is **NOT supported** — do not publish it.
CENTERS: `Cotentin Surf Club` (FFS club, ~130 members, FFS label May 2022) ⚠️ price conflict between passes · `Vauville Surf School`
(mobile — site classé, no buildings allowed) ✔€35/€100/€125/€145/€200 · `Sciotot Surf School` ✔€35 · `Surtain Surf House` ("first surf
camp in Normandy") ✔€650/6n · `Vana Surf` (itinerant truck, deliberately dune-friendly) ✔€35/2h · `K'Roll` ⚠️ trades as School, is legally
a Club ✔€35-230 · `Surf'in Pourville` ⚠️ prices are inside an IMAGE · `Viking Surf` ✔€45/2h · `Albâtre Kitesurf` ✔€155-560 ⚠️ **its Google
pin is at Saint-Laurent-en-Caux, INLAND** · `Kite-R Évolution` ⚠️ conflict, verify · `Clinique de la Planche` (FFVoile C14S01) ✔€150/€130 ·
`Pôle Nautique de la Hague` (France Kitesurf Big Air Championship Oct 2025) · `Fifty Kite` · `Kite Paradise` ⚠️ two Maps listings ·
`8 Milles Nautic` (rebrand of crng.fr).
☠️ **`surfin-pourville.com` = EXPIRED DOMAIN NOW SERVING ONLINE-CASINO SPAM — still linked by Dieppe Tourisme. NEVER link it.**
(the wixsite URL is the correct one) · `kite-normandie.fr` standby page · Le Havre Surf Club (nothing after 2015).
⚠️ UNRESOLVED: **North Shore Surf School Trouville** — one pass says it closed spring 2026 and moved to Le Rozel (Ouest-France 11 Apr
2026), another says the site still lists both. **If confirmed, Calvados has lost its last surf school — a strong honest story.** Verify.
⚠️ NAME TRAPS: two "Colleville" in 14 (Montgomery/Sword vs sur-Mer/Omaha, 60 km apart) · two "Saint-Aubin-sur-Mer" (14 vs 76) ·
Normandie Kiteschool vs Clinique de la Planche may be ONE operation, two brands — don't create both.

### BRITTANY — the real thing, and ⭐ THE REGULATION LAYER IS THE MOAT
FINISTÈRE (wave dept): **La Palue** 48.20,-4.55 "picks up any and every Atlantic swell" ⚠️ spring tides bring a nasty undertow, beach
closed to swimmers · **Lostmarc'h** 48.21,-4.56 35% clean in April, highest in Crozon ⚠️ surf-forecast flags rocks, **localism** and
pollution · ⭐ **Le Dossen** 48.70,-4.06 — **TIDE-INDEPENDENT** (rare and valuable) + genuine multi-sport (surf/windsurf/kite/char-à-voile)
· Baie des Trépassés ⚠️ rip currents · **Pentrez** (Saint-Nic, NOT Plomodiern) 48.20,-4.31 ⚠️ **extreme tide: 150-450 m of sand at low,
a thin strip at high; flood covers the estran in ~2h30; range 7 m at springs** · Kerloch (HT = long lefts, LT = faster right) ·
Goulien/Kersiguenou (the safe Crozon fallback) · Penhors 47.94,-4.41.
MORBIHAN (wind dept, **most regulated coast in France**): **Kerhillio** 47.61,-3.16 — kite legally **±3 h of LOW tide**, high season
15 Jun-15 Sep restricted zone only, **banned ±3 h of HIGH tide when coefficient >85** · ⭐ **Penthièvre** 47.57,-3.14 — **publishable
contradiction: surf is best at HIGH tide, but kite is banned at high tide and restricted to ±3 h of LOW**; bay side banned to kite
29 May-11 Sep · **Guidel-Plages** 47.76,-3.52 beach AND reef · ⭐ **Port Rhu + Port Blanc** 47.50/47.51,-3.15 — **4/10, the highest
quality rating in the whole study** ⚠️ **swimming BANNED by arrêté n°50 (21 Apr 2021) — baïnes, deaths every year — but SURF and SUP
remain PERMITTED. That nuance is exactly our kind of fact.** · **Sainte-Barbe/Plouharnel** — kite must stay **beyond 200 m from shore
at all levels**; ⚠️ **windsurf and wingfoil NOT authorised**; school cap 3 instructors × 4 kites · **Gâvres** (ocean + the flat
**Petite Mer de Gâvres**) — underrated vs Quiberon · Presqu'île de Rhuys.
⚠️ WARNING-ONLY ENTRIES THAT BUILD TRUST: **Carnac — KITE BANNED YEAR-ROUND** · **Men-Dû — banned Jul-Aug** · **Les Sables-Blancs —
banned 1 Nov-31 Mar (Natura 2000; PIKC Jul 2025 says the WINTER ban is the binding one, not the plover framing)**.
ILLE-ET-VILAINE: ⭐ **Cherrueix / Baie du Mont-Saint-Michel** — flagship flat/tidal wind, avg wind 21.1 kn, best Oct-Mar, **national
char-à-voile centre** ⚠️ real risk of being stranded offshore if you misread the tide · **Le Sillon** Saint-Malo 48.66,-1.99 — the ONLY
legal kite beach in Saint-Malo (300 m corridor, 1 Jul-1 Sep) · Longchamp ⚠️ kite banned 10-20h, 15 Jun-15 Sep.
CÔTES-D'ARMOR (weakest): **Plage d'Hillion / Baie de Saint-Brieuc** 48.53,-2.65 — Réserve Naturelle, kite regulated by AP 11 Sep 2018,
**two ZPR zones totally closed**, fines €35-135 · Les Sables d'Or-les-Pins · Perros-Guirec (2/10, summer dead).
CENTERS: ⭐ `PIKC Presqu'Île Kite & Wing Club` pikc.fr — **publishes per-spot Morbihan kite rules by tide and season, updated Jul 2025.
The single best rules source found in this whole study.** · `Armor Surf School` ✔fullest price grid found (€45-€270) · `NKS` ✔€120/3h ·
`YOU-KITE` Gâvres ✔€120-360 · `Happy Kite School` ⚠️ **store the `www.` URL — the bare domain serves an OVH cert** · `Presqu'île Surf
School` ✔from €40 · `Char en Baie` = **Centre de Ressources National de Char à Voile**, wing-speed launched 2023, handicap-accessible ·
`Norzh Léon Surf Club` (FFS, © 2026 — strongest recency of any) · `Absolute Surf` (agréé FFS, since 1998) · `Surfing Sardine` ·
`Blast Surf School` · `Hina Surf` Saint-Malo · `ESB Fort Bloqué` ⚠️ tariffs as an IMAGE · `ESB Plouharnel` · `ESB umbrella` (9 sites) ·
`BREIZH Kite Center` · `Kite2Rhuys` · `Cowabunga` · `Emeraude Kite` (bulletins Jun + Jul-Aug 2026) ⚠️ **its RULES page is 2021 — 4 years
stale; caveat it** · `Dossen Surf School` (French Surf School label) ⚠️ `le-dossen.com` is a SHOP, not the school · `West Surf & Wild Skate`.
⚠️ `emeraudesurfschool.bzh` FAILS THE TLS HANDSHAKE — school looks real, do not link until fixed · `Gâvres Kite` lives on a web agency's
demo subdomain (fragile URL, newest article Jun 2022) · "Nature School Quiberon" = legally **GIE Pôle Nautique des Deux Mers**, in
Saint-Pierre-Quiberon not Quiberon, no 2022+ evidence → don't list · Dune de Surf (© 2019) / Kite Spirit / Rêve de Glisse — no 2022+ evidence.
📌 **UNTAPPED GOLD: Saint-Malo Agglomération publishes an open-data dataset "Réglementation des plages"** (data.stmalo-agglomeration.fr)
— beach-by-beach, machine-readable. The HTML view didn't render; **pull the CSV/JSON API.** Nobody publishes this.
📌 **THE COMMERCIALLY SHARP MOVE (agent's own conclusion):** "Brittany's wave quality loses to Hossegor and Portugal. What nobody
publishes honestly, anywhere, in one place, is the tide-and-arrêté layer — which spot is banned when, at which tide, and why. Pair the
PIKC table with the Saint-Malo open-data set and you own that ground. That is worth more than thirty extra spot entries."

⚠️ COVERAGE GAP REMAINING: Somme (80) is thin in THIS report but is covered by agent a62751c748043cfb0 above. Côtes-d'Armor is thin.
`ecoles.ffvl.fr` + `federation.ffvl.fr` return 403 to fetching → the FFVL kite-school directory remains unexplored.

## VERDICT — FRANCE INLAND WATER (agent a8161e2c389def465) ✅ — ~45 waters, ~120 operators screened
**Confirmed: 11 French spots, every one coastal, ZERO inland. Lode was right.**

### ⭐⭐ THE MEASURED WIND BACKBONE (Windfinder station statistics — this is publishable and nobody else does it)
Étang de Berre 11 kt NNW (25 yrs of record) · Étang de Leucate 11 kt NW · Bassin d'Arcachon 9 kt · Landes lakes 9 kt ·
Étang de Thau 7 kt · Lac du Der **6 kt** · Serre-Ponçon **5 kt** (gusts 16) · Annecy **5 kt** · Naussac **4 kt** · Bourget **3 kt**.
🔑 **TWO CAVEATS THAT MUST BE PUBLISHED, NOT HIDDEN — and note this is Gate 3.5 independently rediscovered:**
1. **"The mean LIES about thermal lakes."** Serre-Ponçon's 5 kt mean against a 16 kt GUST mean *is* the thermal signature —
   flat morning, F4-5 afternoon. Use the mean to rank synoptic/coastal water (lagoons, Atlantic, plains reservoirs);
   **never to dismiss an Alpine thermal lake.**
2. **"The mean is BRUTAL about the plains and pre-Alps."** Der at 6 kt and Bourget at 3 kt are not wind destinations whatever the
   tourist office says. **Naussac's "funboard paradise" reputation is contradicted by its own (now dead) station at 4 kt — do not repeat that line.**

### 🥇 TIER 1 — add first
1. ⭐ **Étang de Salses-Leucate (LAGOON side)** 11/66 — **the single biggest hole in the DB.** 200-280 windy days, standing-depth
   flat water (1-1.5 m), densest school cluster in France — and it sits *behind* **La Franqui, which we already have** → free internal linking.
   Launches: Le Goulet · La Mine · Les Pêcheurs · Parcs à Huîtres · **Parc des Dosses (Barcarès)** · Cap Coudalère/Base Éole · ancienne base hydravion.
   ⚠️ **Kite is NOT free everywhere**: Les Pêcheurs + Parcs à Huîtres = kite FORBIDDEN; Le Goulet = windsurf priority. 12 kn cap beyond 300 m (arrêté 109/2024).
2. ⭐ **Lac de Monteynard-Avignonet** 38 (Treffort ≈44.90,5.65) — **the best inland THERMAL in France**: SRVG's own words,
   *"brise thermique (10/18 nœuds) qui se lève en fin de matinée"*. Kite legal. ⚠️ **swimming banned on the ENTIRE lake** (watersports fine).
3. ⭐ **Plage du Jaï, Étang de Berre** 13 — Provence flagship. **250+ mistral days**, enclosed flat water, French-championship wing round
   Sept 2026. ⚠️ honesty story built in: **June 2025 industrial fire at Rognac put firewater in the lagoon → prefecture banned swimming AND
   nautical activities lagoon-wide 15-25 Jun 2025**; two Vitrolles beaches closed again late Jul 2025. Bathing rated *excellent* for 2025 otherwise.
4. **Lac de Serre-Ponçon** 05/04 (Crots ≈44.53,6.43) — the other true thermal. Nine operators, four bays. ⚠️ **kite BANNED on the plan
   d'eau d'Embrun**; arrêté interpréfectoral 18/05/2026; helmet + wetsuit + buoyancy aid mandatory, ≤20 km/h.
5. **Étang de Thau** 34 — 7,500 ha, ~200 windy days. ⚠️ **4-5 m deep in the navigable middle — NOT a standing-depth lagoon overall**
   (Pont-Levis + Mèze banks are waist-deep). Kite banned everywhere except marked zones; **oyster tables = hard no-go**.
6. **Lac de Cazaux-Sanguinet** 33/40 — the only Atlantic lake that is a genuine kite+wing destination, 5,600 ha of fetch.
   ⚠️ **kite launch ONLY from Navarrosse + camping Mayotte + port l'Estey, and BANNED from Navarrosse 15/06-15/09.**
   ⚠️ **Military firing range (Cazaux): closed except Fri 18:30 → Mon 08:00 + jours fériés.**
7. **Bassin d'Arcachon** 33 — own category, **TIDAL BAY not a lake**: sandbanks, drying mudflats, strong channel current, short chop,
   no ocean swell inside. Most schools of any water here. ⚠️ **Banc d'Arguin: KITE PROHIBITED ACROSS THE WHOLE RESERVE** (décret 2017-945
   art. 24 names cerfs-volants explicitly) · **Cassy-Lanton: kite + windsurf INTERDITS** · Le Teich: kite banned in the Leyre delta.
   La Hume = the only FFVL-conventioned terrain, **closed Oct+Nov for hunting**, needs tidal range ≥2.50 m. **July-August is the WORST time.**

### 🥈 TIER 2
8. ⭐ **Étang de La Palme** 11 (42.9708,3.0181) — *not in the brief, a real find*: **arguably a better beginner lagoon than Leucate itself**,
   ultra-flat, standing depth throughout.
9. **Lac de Lacanau (the LAKE)** 33 — distinct from the ocean spot we already have; **the honest answer to "the bar is unworkable in a W wind"**.
10. **Lac de Sainte-Croix** 04/83 (Margaridon ≈43.77,6.21 · Bauduen ≈43.74,6.17) — **LODE'S EXAMPLE.** Real windsurf/wing/SUP water with a
    municipal base + two foil operators — ⚠️ but the wind is **OCCASIONAL/synoptic (mistral influence), NOT a daily thermal**; no school claims
    reliable wind. **Sell scenery-plus-wind, not a wind destination.** ⚠️ **KITE STATUS UNRESOLVED** (see blockers).
11. **Lac d'Hourtin-Carcans** 33 — France's largest natural lake + UCPA Bombannes. ⚠️ **kite legally WINTER-ONLY, 15/11-31/03** — unusual and very publishable.
12. **Anse de Carteau, Port-Saint-Louis** 13 — the only truly flat, shallow, protected water in the Camargue.
13. **Lac d'Annecy** 74 — add mainly for the RULES: three kite zones only, hard time windows, **Doussard is Sept-June only (no kite Jul/Aug)**,
    and **art. 6.4.3: kiting without a spotter ashore or afloat is ILLEGAL**. Wind light (5 kt).
14. **Beauduc** 13 — ⚠️ **CORRECTION TO THE BRIEF: an open shallow SEA BAY, not a lagoon.** Stand ~150 m out. 12 km dirt piste,
    **2.10 m vehicle width limit**, no permanent school. Plage de la Bassine forbidden to kites.
15. **Lac de Soustons + Étang de Léon** 40 — two excellent transparent FFVoile clubs **with published 2026 prices** (rare). Regional, not destinations.
16. **Lac du Bourget** 73 — ⭐ **the most permissive kite/wing rulebook in inland France** (arrêté 2026-475, in force 1 Jun 2026, names
    kite-surf, kite-foil AND wing-foil). Add for that — but quote **the local club's own warning that the wind is irregular, can cut out at
    any moment, and is unfit for beginners**.
17. **Lac du Salagou** 34 + **Lac de la Ganguise** 11 — real tramontane lakes with wingfoil offers + 2026 tariffs. Salagou's tramontane is
    honestly *"moins forte, plus perturbée et bien plus irrégulière que sur la côte narbonnaise"* — it swirls between the hills; W beats N.
    ⚠️ Ganguise's widely repeated **"300 windy days a year" is a camping/tourism claim, NOT verified** (no station exists to check it).
18. **Lac d'Orient** 10 — 2,400 ha, ⭐ **motorboats banned lake-wide** → the water is genuinely all sailing.

### ⛔ DO NOT ADD as wind spots
Étang de Canet (**lagoon navigation explicitly prohibited** — the kite spots are on the sea) · Vendres · l'Or/Mauguio · Palavas · Cousseau ·
Étang Blanc/Noir · Moliets · **Banc d'Arguin** · Chalain · **Lac d'Aiguebelette** (kite not permitted; **every craft incl. a paddleboard needs
a paid vignette, €7/day**) · Aureilhan · **Lac de Biscarrosse-Parentis** (kite not an authorised activity; ⚠️ **oil platforms + seaplane
hydrobase on the water**, cyanobacteria officially flagged).

### CENTERS — the best-evidenced
⭐ `Fil d'Air` fildair.com (Mèze/Thau, est. 1998) — **strongest evidence in the whole report**: own-site "formules 2026" + FB 17 Jul 2026.
   ✔Discovery day €160/170 · 3d €465/495 · 5d €745/795 · **Beauduc camp 3d €550 / 4d €700**
⭐ `Jawaï Kite School` jawaikiteschool.fr (Plage du Jaï) — **Google Maps 5.0 with 520 reviews**; La Provence 8 Sep 2024 ✔e-foil €120/230/300
⭐ `Léon Voile` leonvoile.fr — **fullest price list found anywhere**: wingfoil 3j €330 · windsurf 3j €140/4j €180 · particulier 1h €70 ·
   wingfoil particulier 1h €100 · rental from €15/h
⭐ `CVSM Soustons` cvsm.org (FFVoile + **label Handivoile since 1999**) ✔adhésion €72 · licence €40 · CSL Voile 20 cours €266. ❗licence obligatoire
⭐ `Alex Kite School` alexkite.com (Arcachon, AFKite) ✔Découverte €190/210 · Autonomie €470/530 · Autonomie+ €750/850
`Teknikite` (Monteynard) ✔session €160-200 · 5-day €750/850 · `SRVG` (Monteynard, FFVoile, 2026 season) · `Freekite School` (opens 25 May 2026)
`LE SPOT` spot-wingfoil.com (Crots/Serre-Ponçon, own dock, "ouverts 2026") · `Kite Légende` (Savines + Lautaret snowkite) ✔wing €160-200
`Base Nautique Les Salles sur Verdon` (MUNICIPAL, Sainte-Croix) ✔Club Loisirs Enfants 9 séances €103 · Adulte €147 — **opens 22 May 2026**
`AVN04` voileverdon.fr (Sainte-Croix, opens 1 Apr 2026) · `Centre Nautique de Bauduen` · `Foil in Love` ⚠️ prices look 2024
`Kite School-Leucate` ✔from €130 · `Surf and Kite` (Parc des Dosses + La Palme) · `Wesh Center Crew` (Le Goulet, run by windsurf champions,
9.3/10 from 625 reviews, **NO kite**) · `UCPA Port-Barcarès` · `Coriolis Foilschool` · `Ventileau` ✔€150 · `Tiki Center` ✔kite €160
`Club Nautique Marignanais` (organises the **Jaï Wingfoil Classic 19-20 Sep 2026**) · `Hot School` (5.0/106) · `Thau Kite Club` (publishes the rules)
`H2O Kite` · `Kite-Particulier` (FFVL "École Française de Kite") · `UCPA Bombannes` · `Voile Lacanau Guyenne` (1,000+ licenciés) ·
`Kitesurf Club Lacanau` ("saison 2026 repartie") · `CNBO` (hosts **420 World Championship 2026**) · `FoilXperience` ✔Wing €360/€580 ·
`Arcagliss` ✔wingfoil 3j €350 · `FourWinds` · `WindRoos` · `Flyway` · `Base Nautique du Salagou` (2026 tariffs) ·
`EFV Castelnaudary/Ganguise` (**"Foiling Center"**, tariff PDFs Mar 2026) · `Funcenter Lac du Der` · `CNA Voile` (Orient, non-members welcome)
❗ **ACCESS TRAPS — a visitor CANNOT book:** `AWM` (Madine windsurf assoc.) *"ne propose ni cours ni location de matériel"* · `AKL` (Madine kite)
club-only · `KWBA` (Arcachon) members' club, no commercial teaching · `KCB` (Bourget) explicitly gives no lessons · `GSE Voile` (Laffrey) is on a
**Schneider Electric works-council base — not open to the public**. → the Madine **Centre Nautique** (municipal) IS the bookable one.
☠️ DEAD: `Cap Ferret Kiteschool` (CLOSED — *"depuis la fermeture… il n'y a plus d'école de kitesurf"*, site still online showing © 2010) ·
`Beachbugs Kitesurf` (DNS dead) · `Kite Maub Carcans` (2008) · `Yacht Club de Bouzigues` (**"fermé définitivement"**) · `Wind 34`.
⚠️ ~25 more listed "ACTIVITY NOT VERIFIED" — tourist-directory listings only.
⚠️ Possible DUPLICATE: `Wing & Foil School Monteynard` and `Hurakan Wingfoil School` share phone 06 63 42 86 69.

### ⚠️ CORRECTIONS TO MY OWN BRIEF (I had these wrong)
- **Beauduc is an open shallow SEA BAY, not a lagoon.**
- **Le Mouret is a SEA beach at Leucate-Plage, not a lagoon launch.**
- **Lac Marin de Port d'Albret is a SEAWATER TIDAL lagoon, not a freshwater lake.**
- **Étang de Vaccarès itself is a reserve** — the usable spots are Carteau, Beauduc, Napoléon, Piémanson; and **Napoléon + Piémanson are open
  sea beaches with real waves >2 m — never list them as flat water.**
- **Étang de La Palme (11)** and **Étang d'Ingril (34)** weren't in my brief and both deserve entries.
- Saint-Hippolyte/Le Mas Marot and Fitou: zero French-language results as launches → do not publish.

### 🚧 BLOCKERS before publishing
1. **EVERY coordinate here is approximate and ungeocoded** — only two came from a primary source (FFVL: Le Bétey 44.73250,-1.09160;
   La Hume 44.6456,-1.1131). **Re-geocode all via Gate 4.3a.**
2. ⚠️ **Sainte-Croix kite is UNRESOLVED and Lode named this lake.** The Parc du Verdon's page mentions kitesurf only inside the
   buoyancy-aid obligation (implying it's recognised); several secondary pages state flatly *"Kitesurf et Wakeboard sont interdits"*.
   **The 2017 decree is a 15-page scan with no text layer.** No kite school operates there. → **publish as windsurf/wing/SUP and mark kite unconfirmed.**
3. Hourtin-Carcans kite window contradictory (préfecture says winter-only; the official lake map shows a permanent zone).
4. Cazaux-Sanguinet RPP modified 24 Mar 2026 — PDFs are scans, unconfirmed whether the kite launches changed.
5. Serre-Ponçon authorised kite zones live in a scanned map annexe (the Embrun ban IS confirmed).
6. Annecy + wingfoil: the 2023 RPP never uses the word "wing" — unclear if a wingfoil counts as a *planche aérotractée*.
7. Le Goulet (Leucate) kite status: tourist office says windsurf-reserved, two kite databases list it as kite-with-windsurf-priority.
8. Arcachon arrêté 2026_371 is a scan — the Jul/Aug hours quoted come from the 2025 arrêté.
❓ NOT RESEARCHED AT ALL: Vassivière (⚠️ its own portal now 301s to a generic tourism site — itself a signal) · Saint-Cassien · Bouzey ·
Pierre-Percée · Vaivre · Villeneuve-de-la-Raho · Matemale · Île-de-France bases (Vaires, Cergy, Jablines) · Gérardmer/Longemer · Liez · Grand-Large Dunkerque.
🔴 LIVE OPS NOTE (Aug 2026): UCPA Hourtin suspended sessions 27 Jul-9 Aug and Club Nautique de Claouey temporarily closed — **regional
wildfire emergency**. Re-check before publishing either as open.
