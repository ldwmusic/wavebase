/* WaveBase API client.

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


/* ---------- bootstrap ---------- */

(async function bootstrapFromAPI() {
  // Step 1: snapshot the slug-IDs from data.js BEFORE we wipe it. We re-use
  // these slugs after the API replace so URLs (spot.html?id=devils-rock),
  // localStorage saved-spots and linkedSpotId references stay stable.
  const slugByName = {};
  if (Array.isArray(WAVEBASE_DATA)) {
    WAVEBASE_DATA.forEach(e => { slugByName[e.name] = e.id; });
  }

  // Step 2: wipe data.js fallback values so nothing leaks through.
  // After this point, only API data populates these globals.
  WAVEBASE_DATA  = [];
  WAVEBASE_TOWNS = {};

  // Step 3: parallel fetch all four collections.
  let spots, centers, stays, towns;
  try {
    const results = await Promise.all([
      fetch(`${WAVEBASE_API}/surf-spots/`).then(r => r.json()),
      fetch(`${WAVEBASE_API}/centers/`   ).then(r => r.json()),
      fetch(`${WAVEBASE_API}/stays/`     ).then(r => r.json()),
      fetch(`${WAVEBASE_API}/towns/`     ).then(r => r.json()),
    ]);
    [spots, centers, stays, towns] = results;
  } catch (e) {
    console.error("[api-client] Failed to load data from API:", e);
    // Pages will render empty. Acceptable while we have no real users.
    window.dispatchEvent(new CustomEvent("wavebase:data-ready"));
    return;
  }

  // Step 4: build the two cross-boundary id maps and expose them on
  // window so other modules can translate IDs across the slug/UUID
  // boundary. account.js uses these when syncing saved-spots: it
  // stores slugs in localStorage but needs the API UUID when POSTing
  // to /users/me/saved-spots/{spot_id}. Same problem in reverse on
  // the way back (GET returns UUIDs; we need slugs to render).
  const slugByApiId = {};
  const apiIdBySlug = {};
  function _registerIdPair(apiId, name) {
    const slug = slugByName[name] || apiId;
    slugByApiId[apiId] = slug;
    apiIdBySlug[slug]  = apiId;
  }
  (spots   || []).forEach(s => _registerIdPair(s.id, s.name));
  // Centers + stays go in the same maps — the saved-spots endpoint
  // accepts any entry-id and Lode will likely save those too in v2.
  // Doing it now means we don't have to revisit this mapper later.
  (centers || []).forEach(c => _registerIdPair(c.id, c.name));
  (stays   || []).forEach(s => _registerIdPair(s.id, s.name));
  window.WAVEBASE_SLUG_BY_API_ID = slugByApiId;
  window.WAVEBASE_API_ID_BY_SLUG = apiIdBySlug;

  // Step 5: assemble the global data the rest of app.js consumes.
  WAVEBASE_DATA = [
    ...(spots   || []).map(s => _apiToFrontendSpot(s, slugByName)),
    ...(centers || []).map(c => _apiToFrontendCenter(c, slugByName, slugByApiId)),
    ...(stays   || []).map(s => _apiToFrontendStay(s, slugByName, slugByApiId)),
  ];
  WAVEBASE_TOWNS = Object.fromEntries(
    (towns || []).map(t => [t.name, _apiToFrontendTown(t)])
  );

  console.log(`[api-client] Loaded ${WAVEBASE_DATA.length} entries + ${Object.keys(WAVEBASE_TOWNS).length} towns from API`);

  // Step 6: tell app.js the data is ready — page init runs now.
  window.dispatchEvent(new CustomEvent("wavebase:data-ready"));
})();
