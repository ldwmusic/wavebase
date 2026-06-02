/* SurfGoose API client.

   Replaces data.js as the runtime source for WAVEBASE_DATA + WAVEBASE_TOWNS.
   At boot:
     1. Snapshot the slug-IDs from data.js (kept as an in-file fallback for
        emergency revert) so we can preserve "devils-rock" etc. after replace.
     2. Wipe WAVEBASE_DATA + WAVEBASE_TOWNS so any leak from data.js is
        impossible — the API IS the source of truth from here on.
     3. Fetch /surf-spots/, /centers/, /stays/, /towns/ in parallel.
     4. Reverse-map API shape (English snake_case, nested objects) back to
        the frontend's expected shape (Dutch/camelCase) the rest of app.js
        was written against.
     5. Stitch slugs back in by matching on name — so URLs like
        spot.html?id=devils-rock keep working, and linkedSpotId in centers/
        stays resolves to slugs (not API UUIDs).
     6. Dispatch `wavebase:data-ready` — app.js's page-init listener runs
        the per-page render functions only after this fires.

   If the fetch fails the page renders empty. LDW accepted this trade-off
   while there are no real users yet — data.js still ships as the in-file
   fallback for revert, but is no longer used at runtime. */

const WAVEBASE_API = "https://wavebase-api-qqwt.onrender.com";

// Crowd values pass through as-is from the API: "low" | "moderate"
// | "high". The frontend's crowdLabel() turns them into the
// human-facing "Quiet / Moderate / Busy" at render time. We used to
// translate to Dutch keys here (rustig/gemiddeld/druk) and then re-
// translate to English at display — round-trip noise that bit us
// when crowdLabelText didn't recognise the Dutch keys (LDW: "ik zie
// nog steeds druk/rustig").


/* ---------- nested reverse-mappers ---------- */

function _apiToFrontendLayer(l) {
  return {
    titel:  l.title  || "",
    bron:   l.source || "",
    inhoud: (l.content || []).map(c => ({
      kop:   c.heading || "",
      tekst: c.text    || "",
    })),
  };
}

function _apiToFrontendConditions(c) {
  if (!c) return undefined;
  const out = {
    golftype:   c.wave_type   || undefined,
    golfhoogte: c.wave_height || undefined,
    wind:       c.wind        || undefined,
    water:      c.water       || undefined,
  };
  if (c.crowd) {
    out.drukte = {
      niveau: c.crowd.level,
      tekst:  c.crowd.note || "",
    };
  }
  return out;
}

function _apiToFrontendStats(s) {
  if (!s) return undefined;
  return {
    windDir:            s.wind_direction || undefined,
    waveType:           s.wave_type      || undefined,
    bottom:             s.bottom         || undefined,
    crowd:              s.crowd,
    localism:           s.localism       || undefined,
    source:             s.source         || undefined,
    periods: (s.periods || []).map(p => ({
      name:     p.name,
      months:   p.months,
      // SeasonTier enum → inSeason boolean (everything except "off" is in season)
      inSeason: p.tier !== "off",
      windKn:   p.wind_kn || null,
      waterC:   p.water_c || null,
      waveM:    p.wave_m  || null,
    })),
    monthlyWindProb:    s.monthly_wind_prob     || undefined,
    monthlyWindKn:      s.monthly_wind_kn       || undefined,
    monthlyGustKn:      s.monthly_gust_kn       || undefined,
    monthlyDailyPeakKn: s.monthly_daily_peak_kn || undefined,
    monthlyGustPeakKn:  s.monthly_gust_peak_kn  || undefined,
    monthlyWaveM:       s.monthly_wave_m        || undefined,
    monthlySwellProb:   s.monthly_swell_prob    || undefined,
    monthlyAirC:        s.monthly_air_c         || undefined,
    monthlyWaterC:      s.monthly_water_c       || undefined,
    chartType:          s.chart_type            || undefined,
  };
}

function _apiToFrontendNearby(n) {
  if (!n) return undefined;
  return {
    eten:    n.food    || undefined,
    parking: n.parking || undefined,
    verhuur: n.rental  || undefined,
  };
}


/* ---------- top-level reverse-mappers ---------- */

function _apiToFrontendSpot(api, slugByName) {
  return {
    id:              slugByName[api.name] || api.id,
    type:            "spot",
    country:         api.country && api.country.name,
    sports:          api.sports || [],
    name:            api.name,
    town:            api.town,
    tagline:         api.tagline || "",
    levels:          api.levels || [],
    goodMonths:      api.good_months || [],
    coords:          api.coords || [],
    googleMapsQuery: api.google_maps_query,
    coordsLabel:    api.coords_label,
    photo:           api.photo || "",
    samenvatting:    api.summary || [],
    verhaal:         api.story || [],
    lagen:           (api.layers || []).map(_apiToFrontendLayer),
    educational:     api.educational || [],
    condities:       _apiToFrontendConditions(api.conditions),
    stats:           _apiToFrontendStats(api.stats),
    buurt:           _apiToFrontendNearby(api.nearby),
    vergelijking:    null,
    ideaalVoor:      api.ideal_for     || "",
    nietIdeaalAls:   api.not_ideal_if  || "",
  };
}

function _apiToFrontendCenter(api, slugByName, slugByApiId) {
  const d = api.services;
  const p = api.prices;
  return {
    id:              slugByName[api.name] || api.id,
    type:            "center",
    country:         api.country && api.country.name,
    sports:          api.sports || [],
    name:            api.name,
    town:            api.town,
    tagline:         api.tagline || "",
    levels:          api.levels || [],
    goodMonths:      api.good_months || [],
    coords:          api.coords || [],
    googleMapsQuery: api.google_maps_query,
    coordsLabel:    api.coords_label,
    photo:           api.photo || "",
    linkedSpotId:    api.linked_spot_id ? (slugByApiId[api.linked_spot_id] || api.linked_spot_id) : undefined,
    bookingUrl:      api.booking_url,
    diensten: d ? {
      lessen:       d.lessons,
      rental:       d.rental,
      brands:       d.brands,
      faciliteiten: d.facilities,
      team:         d.team,
    } : undefined,
    samenvatting:    api.summary || [],
    verhaal:         api.story || [],
    lagen:           (api.layers || []).map(_apiToFrontendLayer),
    vergelijking:    null,
    ideaalVoor:      api.ideal_for    || "",
    nietIdeaalAls:   api.not_ideal_if || "",
    prices: p ? {
      tier:                 p.tier,
      groupLessonEUR:       p.group_lesson_eur,
      groupLessonNote:      p.group_lesson_note,
      privateLessonHourEUR: p.private_lesson_hour_eur,
      privateLessonNote:    p.private_lesson_note,
      rentalDayEUR:         p.rental_day_eur,
      rentalNote:           p.rental_note,
      packageEUR:           p.package_eur,
      packageDays:          p.package_days,
      packageNote:          p.package_note,
      unit:                 p.unit,
      verified:             p.verified,
      source:               p.source,
    } : undefined,
  };
}

function _apiToFrontendStay(api, slugByName, slugByApiId) {
  const v = api.accommodation;
  const p = api.prices;
  return {
    id:              slugByName[api.name] || api.id,
    type:            "stay",
    country:         api.country && api.country.name,
    sports:          api.sports || [],
    name:            api.name,
    town:            api.town,
    tagline:         api.tagline || "",
    levels:          api.levels || [],
    goodMonths:      api.good_months || [],
    coords:          api.coords || [],
    googleMapsQuery: api.google_maps_query,
    coordsLabel:    api.coords_label,
    photo:           api.photo || "",
    linkedSpotId:    api.linked_spot_id ? (slugByApiId[api.linked_spot_id] || api.linked_spot_id) : undefined,
    bookingUrl:      api.booking_url,
    verblijf: v ? {
      eten:         v.food,
      afstandSpot:  v.distance_to_spot,
      verhuur:      v.rental,
      lessen:       v.lessons,
      rating:       v.rating,
      sfeer:        v.vibe,
      activiteiten: v.activities,
      scores:       v.scores,
      essence:      v.essence,
    } : undefined,
    samenvatting:    api.summary || [],
    verhaal:         api.story || [],
    lagen:           (api.layers || []).map(_apiToFrontendLayer),
    vergelijking:    null,
    ideaalVoor:      api.ideal_for    || "",
    nietIdeaalAls:   api.not_ideal_if || "",
    prices: p ? {
      tier:     p.tier,
      fromEUR:  p.from_eur,
      toEUR:    p.to_eur,
      unit:     p.unit,
      verified: p.verified,
      source:   p.source,
    } : undefined,
  };
}

function _apiToFrontendTown(t) {
  return {
    naam:    t.name,
    country: t.country && t.country.name,
    intro:   t.intro,
    teDoen:  t.things_to_do,
    vervoer: t.transport,
    afstand: t.distance,
    bron:    t.source,
  };
}


/* ---------- bootstrap ----------

   Cache-first design. The "feels broken when you click SurfGoose" bug
   is that Render's free tier has cold-starts up to ~30s — every page
   navigation was awaiting four serial API roundtrips before any page
   chrome could render. Now we:

     1. Read the previous response out of localStorage. If present and
        not insanely old, hydrate WAVEBASE_DATA + maps from it and fire
        `wavebase:data-ready` IMMEDIATELY — pages render with the stale
        data in <50ms, no API wait at all.
     2. Fire off the same four fetches in the background.
     3. When fresh data arrives, re-apply + re-dispatch the event so
        listeners refresh. Stale-while-revalidate.
     4. Write the fresh response back to localStorage for next time.

   Trade-off: a user who loads after a content push sees the OLD spot
   list for one render cycle. Acceptable while we don't push content
   hourly. Cache version (CACHE_KEY suffix) lets us hard-invalidate on
   schema changes by bumping the suffix in this file. */

const CACHE_KEY = "wavebase_api_cache_v1";
const CACHE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;  // 14 days — after that we'd rather wait for fresh data than show stale

/* Snapshot the slug-IDs from data.js BEFORE we wipe it. Computed
   once at module load; reused on every apply (cache hydrate AND
   fresh fetch). Slugs are how URLs / localStorage / linkedSpotId
   refer to entries — we MUST keep them stable across the API
   migration. */
const _slugByName = {};
if (Array.isArray(WAVEBASE_DATA)) {
  WAVEBASE_DATA.forEach(e => { _slugByName[e.name] = e.id; });
}
// Wipe data.js fallback values immediately so nothing leaks through.
WAVEBASE_DATA  = [];
WAVEBASE_TOWNS = {};

/* Take raw API responses (spots, centers, stays, towns), build the
   cross-boundary id maps, assemble WAVEBASE_DATA + WAVEBASE_TOWNS,
   and dispatch `wavebase:data-ready` so app.js / account.js render.
   Pure function of its inputs — works equally for cache hydrate and
   fresh fetch. */
function _applyAPIResponse({ spots, centers, stays, towns }, source) {
  spots   = Array.isArray(spots)   ? spots   : [];
  centers = Array.isArray(centers) ? centers : [];
  stays   = Array.isArray(stays)   ? stays   : [];
  towns   = Array.isArray(towns)   ? towns   : [];

  // Build the two cross-boundary id maps. account.js uses these
  // when syncing saved-spots: it stores slugs in localStorage but
  // needs the API UUID when POSTing to /users/me/saved-spots/{id}.
  const slugByApiId = {};
  const apiIdBySlug = {};
  function _registerIdPair(apiId, name) {
    const slug = _slugByName[name] || apiId;
    slugByApiId[apiId] = slug;
    apiIdBySlug[slug]  = apiId;
  }
  spots  .forEach(s => _registerIdPair(s.id, s.name));
  centers.forEach(c => _registerIdPair(c.id, c.name));
  stays  .forEach(s => _registerIdPair(s.id, s.name));
  window.WAVEBASE_SLUG_BY_API_ID = slugByApiId;
  window.WAVEBASE_API_ID_BY_SLUG = apiIdBySlug;

  WAVEBASE_DATA = [
    ...spots  .map(s => _apiToFrontendSpot  (s, _slugByName)),
    ...centers.map(c => _apiToFrontendCenter(c, _slugByName, slugByApiId)),
    ...stays  .map(s => _apiToFrontendStay  (s, _slugByName, slugByApiId)),
  ];
  WAVEBASE_TOWNS = Object.fromEntries(towns.map(t => [t.name, _apiToFrontendTown(t)]));

  console.log(`[api-client] ${source}: ${WAVEBASE_DATA.length} entries + ${Object.keys(WAVEBASE_TOWNS).length} towns`);
  window.dispatchEvent(new CustomEvent("wavebase:data-ready"));
}

/* Try to hydrate from localStorage. Returns true on a successful
   hydrate — boot uses that to decide whether the user is seeing
   anything yet. */
function _hydrateFromCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return false;
    const cached = JSON.parse(raw);
    if (!cached || !cached.payload || !cached.savedAt) return false;
    if (Date.now() - cached.savedAt > CACHE_MAX_AGE_MS) {
      // Old enough that we'd rather wait for fresh data than risk
      // showing a wildly out-of-date catalog.
      localStorage.removeItem(CACHE_KEY);
      return false;
    }
    _applyAPIResponse(cached.payload, "cache hit");
    return true;
  } catch (e) {
    // Corrupted cache — drop it. Fresh fetch will populate it again.
    try { localStorage.removeItem(CACHE_KEY); } catch (e2) {}
    return false;
  }
}

function _saveToCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      payload,
      savedAt: Date.now(),
    }));
  } catch (e) {
    // Quota exceeded or storage disabled — silently skip. Next page
    // load just does a fresh fetch like before.
  }
}

(async function bootstrapFromAPI() {
  const hadCache = _hydrateFromCache();
  // Read the cached payload back from storage so we can compare it
  // bit-for-bit with the fresh response. If they match, no point
  // re-rendering — saves a full page-init flicker for the common
  // case where the catalog hasn't changed since last visit.
  let cachedRaw = null;
  if (hadCache) {
    try { cachedRaw = localStorage.getItem(CACHE_KEY); } catch (e) {}
  }

  // Always fetch fresh in parallel. If cache hydrated, this runs in
  // the background and re-applies when done (stale-while-revalidate).
  // If no cache, this IS the first render path.
  let payload;
  try {
    const [spots, centers, stays, towns] = await Promise.all([
      fetch(`${WAVEBASE_API}/surf-spots/`).then(r => r.json()),
      fetch(`${WAVEBASE_API}/centers/`   ).then(r => r.json()),
      fetch(`${WAVEBASE_API}/stays/`     ).then(r => r.json()),
      fetch(`${WAVEBASE_API}/towns/`     ).then(r => r.json()),
    ]);
    payload = { spots, centers, stays, towns };
  } catch (e) {
    console.error("[api-client] Fresh fetch failed:", e);
    // If we never hydrated from cache, app.js is still waiting on
    // the ready event — fire it (with empty data) so the page at
    // least exits its loading state instead of staring at nothing.
    if (!hadCache) window.dispatchEvent(new CustomEvent("wavebase:data-ready"));
    return;
  }

  // Cheap deep-equality via JSON. If the response is identical to
  // what we just hydrated from cache, skip the re-render and the
  // re-dispatch — the page already shows the right data.
  if (hadCache && cachedRaw) {
    try {
      const prev = JSON.parse(cachedRaw);
      if (prev && JSON.stringify(prev.payload) === JSON.stringify(payload)) {
        console.log("[api-client] cache still fresh — skipping re-render");
        // Still bump the savedAt so the TTL clock resets — we just
        // confirmed the cache is good.
        _saveToCache(payload);
        return;
      }
    } catch (e) { /* fall through to re-apply */ }
  }

  _applyAPIResponse(payload, hadCache ? "cache refresh" : "fresh fetch");
  _saveToCache(payload);
})();
