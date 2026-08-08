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

## PAIRS POSTED
(append one line per pair as it lands: spot name + verified coords + source of coord,
 center + prices + review evidence, posted IDs, exact stats.source line)

## SKIP-LIST (Gate 6)

## FLAG-LIST (autonomous mode — the would-have-asked items)
- France-wide: 0 town records exist → creating them for every town this run touches (Gate 4.2b)
