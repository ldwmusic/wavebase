/* WaveBase — QnD logic (English). One script, routes per page:
   index (search + split lists), spot (detail), map, account, compare. */

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function byId(id) { return WAVEBASE_DATA.find(x => x.id === id); }

// Haversine — straight-line km between [lat, lon] pairs.
function distanceKm(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function fmtKm(km) {
  if (km == null || !isFinite(km)) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
function googleMapsHref(coords) {
  return `https://www.google.com/maps?q=${coords[0]},${coords[1]}&z=15`;
}
function bookingHref(e) {
  if (e.bookingUrl) return e.bookingUrl;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(e.name + " " + e.town)}`;
}
function typeLabel(t) {
  if (t === "spot") return "Surf spot";
  if (t === "center") return "Surf center";
  return "Stay";
}
// Build spot.html href; propagates current month filter so the chosen month
// carries through to the detail page's "Your month vs Best month" panel.
function spotHref(id) {
  const m = new URLSearchParams(window.location.search).get("month");
  return m && m !== "all" ? `spot.html?id=${id}&month=${m}` : `spot.html?id=${id}`;
}
// Shorter labels for the corner badge — fits the narrow list-view thumb.
// The entity type is clear; the sport pictogram tells you the discipline.
function typeBadge(t) {
  if (t === "spot") return "Spot";
  if (t === "center") return "Center";
  return "Stay";
}
function typeColor(t) {
  if (t === "spot") return "#3f6f7d";    // teal — surf spots
  if (t === "center") return "#e0a447";  // amber — surf centers
  return "#bd6242";                       // orange — stays
}
function crowdLabel(n) { return { rustig: "Quiet", gemiddeld: "Moderate", druk: "Busy" }[n] || n; }
function thumbStyle(e) { return e.photo ? ` style="background-image:url('${e.photo}')"` : ""; }

/* ---- nav: profile name + compare count ---- */
function updateNav() {
  const acc = document.getElementById("nav-account");
  if (acc) {
    const p = WaveBaseAccount.getProfile();
    const firstName = (p.name || "").trim().split(/\s+/)[0];
    acc.textContent = firstName ? ("Hi, " + firstName) : "My WaveBase";
  }
  const cmp = document.getElementById("nav-compare");
  if (cmp) {
    const n = WaveBaseAccount.getCompare().length;
    cmp.textContent = n ? `Compare (${n})` : "Compare";
  }
  // also sync the mobile bottom tab bar's compare count
  const cmpTab = document.querySelector('.mobile-tabbar a[data-tab="compare"] .tab-label');
  if (cmpTab) {
    const n = WaveBaseAccount.getCompare().length;
    cmpTab.textContent = n ? `Compare (${n})` : "Compare";
  }
}

/* ---- sport pictograms (v9 — locked 2026-05-16) ---- */
const WAVEBASE_SPORT_ICONS = {
  wave: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M50 14.8L46.77 15.97L45.5 17.15L44.59 18.32L43.86 19.49L43.25 20.67L42.73 21.84L42.29 23.01L41.91 24.19L41.57 25.36L41.28 26.53L41.02 27.71L40.79 28.88L40.59 30.05L40.42 31.23L40.27 32.4L40.14 33.57L40.03 34.75L39.94 35.92L39.86 37.09L39.79 38.27L39.74 39.44L39.7 40.61L39.67 41.79L39.64 42.96L39.62 44.13L39.61 45.31L39.61 46.48L39.6 47.65L39.6 48.83L39.6 50L39.6 51.17L39.6 52.35L39.61 53.52L39.61 54.69L39.62 55.87L39.64 57.04L39.67 58.21L39.7 59.39L39.74 60.56L39.79 61.73L39.86 62.91L39.94 64.08L40.03 65.25L40.14 66.43L40.27 67.6L40.42 68.77L40.59 69.95L40.79 71.12L41.02 72.29L41.28 73.47L41.57 74.64L41.91 75.81L42.29 76.99L42.73 78.16L43.25 79.33L43.86 80.51L44.59 81.68L45.5 82.85L46.77 84.03L50 85.2L50 85.2L53.23 84.03L54.5 82.85L55.41 81.68L56.14 80.51L56.75 79.33L57.27 78.16L57.71 76.99L58.09 75.81L58.43 74.64L58.72 73.47L58.98 72.29L59.21 71.12L59.41 69.95L59.58 68.77L59.73 67.6L59.86 66.43L59.97 65.25L60.06 64.08L60.14 62.91L60.21 61.73L60.26 60.56L60.3 59.39L60.33 58.21L60.36 57.04L60.38 55.87L60.39 54.69L60.39 53.52L60.4 52.35L60.4 51.17L60.4 50L60.4 48.83L60.4 47.65L60.39 46.48L60.39 45.31L60.38 44.13L60.36 42.96L60.33 41.79L60.3 40.61L60.26 39.44L60.21 38.27L60.14 37.09L60.06 35.92L59.97 34.75L59.86 33.57L59.73 32.4L59.58 31.23L59.41 30.05L59.21 28.88L58.98 27.71L58.72 26.53L58.43 25.36L58.09 24.19L57.71 23.01L57.27 21.84L56.75 20.67L56.14 19.49L55.41 18.32L54.5 17.15L53.23 15.97L50 14.8Z"/></svg>',
  wind: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M16 75.6L17.7 74.09L19.4 73.52L21.1 73.12L22.8 72.81L24.5 72.56L26.2 72.36L27.9 72.19L29.6 72.06L31.3 71.95L33 71.86L34.7 71.79L36.4 71.73L38.1 71.69L39.8 71.65L41.5 71.63L43.2 71.62L44.9 71.61L46.6 71.6L48.3 71.6L50 71.6L51.7 71.6L53.4 71.6L55.1 71.61L56.8 71.62L58.5 71.63L60.2 71.65L61.9 71.69L63.6 71.73L65.3 71.79L67 71.86L68.7 71.95L70.4 72.06L72.1 72.19L73.8 72.36L75.5 72.56L77.2 72.81L78.9 73.12L80.6 73.52L82.3 74.09L84 75.6L84 75.6L82.3 77.11L80.6 77.68L78.9 78.08L77.2 78.39L75.5 78.64L73.8 78.84L72.1 79.01L70.4 79.14L68.7 79.25L67 79.34L65.3 79.41L63.6 79.47L61.9 79.51L60.2 79.55L58.5 79.57L56.8 79.58L55.1 79.59L53.4 79.6L51.7 79.6L50 79.6L48.3 79.6L46.6 79.6L44.9 79.59L43.2 79.58L41.5 79.57L39.8 79.55L38.1 79.51L36.4 79.47L34.7 79.41L33 79.34L31.3 79.25L29.6 79.14L27.9 79.01L26.2 78.84L24.5 78.64L22.8 78.39L21.1 78.08L19.4 77.68L17.7 77.11L16 75.6Z"/><path d="M43.6 71.6L54 14L57.16 16.87L60.27 19.73L63.26 22.6L66.1 25.47L68.76 28.33L71.2 31.2L73.42 34.07L75.44 36.93L77.26 39.8L78.93 42.67L80.49 45.53L82 48.4L78.16 51.09L74.32 53.75L70.48 56.33L66.64 58.82L62.8 61.2L58.96 63.46L55.12 65.61L51.28 67.67L47.44 69.65Z"/></svg>',
  kite: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><g transform="rotate(-45 50 50)"><path d="M12 42L13.95 34.92L15.9 32.12L17.85 30.06L19.79 28.41L21.74 27.02L23.69 25.84L25.64 24.81L27.59 23.91L29.54 23.12L31.49 22.44L33.44 21.84L35.38 21.32L37.33 20.88L39.28 20.51L41.23 20.2L43.18 19.96L45.13 19.78L47.08 19.67L49.03 19.61L50.97 19.61L52.92 19.67L54.87 19.78L56.82 19.96L58.77 20.2L60.72 20.51L62.67 20.88L64.62 21.32L66.56 21.84L68.51 22.44L70.46 23.12L72.41 23.91L74.36 24.81L76.31 25.84L78.26 27.02L80.21 28.41L82.15 30.06L84.1 32.12L86.05 34.92L88 42L88 42L86.05 41.64L84.1 41.28L82.15 40.93L80.21 40.58L78.26 40.24L76.31 39.92L74.36 39.61L72.41 39.31L70.46 39.03L68.51 38.77L66.56 38.53L64.62 38.31L62.67 38.12L60.72 37.95L58.77 37.81L56.82 37.7L54.87 37.61L52.92 37.55L50.97 37.52L49.03 37.52L47.08 37.55L45.13 37.61L43.18 37.7L41.23 37.81L39.28 37.95L37.33 38.12L35.38 38.31L33.44 38.53L31.49 38.77L29.54 39.03L27.59 39.31L25.64 39.61L23.69 39.92L21.74 40.24L19.79 40.58L17.85 40.93L15.9 41.28L13.95 41.64L12 42Z"/><line x1="15.9" y1="32.12" x2="38" y2="80.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="84.1" y1="32.12" x2="62" y2="80.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="37.33" y1="20.88" x2="44" y2="80.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="62.67" y1="20.88" x2="56" y2="80.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><rect x="38" y="78.64" width="24" height="3.52" rx="1.44" ry="1.44"/></g></svg>',
  wing: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M12 29.2L14.53 28.46L17.07 27.75L19.6 27.05L22.13 26.38L24.67 25.73L27.2 25.11L29.73 24.52L32.27 23.95L34.8 23.42L37.33 22.92L39.87 22.46L42.4 22.04L44.93 21.68L47.47 21.38L50 21.2L52.53 21.38L55.07 21.68L57.6 22.04L60.13 22.46L62.67 22.92L65.2 23.42L67.73 23.95L70.27 24.52L72.8 25.11L75.33 25.73L77.87 26.38L80.4 27.05L82.93 27.75L85.47 28.46L88 29.2L88 29.2L85.47 30.16L82.93 31.09L80.4 31.99L77.87 32.86L75.33 33.7L72.8 34.51L70.27 35.29L67.73 36.02L65.2 36.72L62.67 37.37L60.13 37.97L57.6 38.51L55.07 38.98L52.53 39.37L50 39.6L47.47 39.37L44.93 38.98L42.4 38.51L39.87 37.97L37.33 37.37L34.8 36.72L32.27 36.02L29.73 35.29L27.2 34.51L24.67 33.7L22.13 32.86L19.6 31.99L17.07 31.09L14.53 30.16L12 29.2ZM40 33.6L40.04 33.29L40.16 33L40.35 32.75L40.6 32.56L40.89 32.44L41.2 32.4L58.8 32.4L59.11 32.44L59.4 32.56L59.65 32.75L59.84 33L59.96 33.29L60 33.6L60 33.6L59.96 33.91L59.84 34.2L59.65 34.45L59.4 34.64L59.11 34.76L58.8 34.8L41.2 34.8L40.89 34.76L40.6 34.64L40.35 34.45L40.16 34.2L40.04 33.91L40 33.6ZM41.6 29.2L43.2 29.2L43.2 32.4L41.6 32.4ZM56.8 29.2L58.4 29.2L58.4 32.4L56.8 32.4Z" fill-rule="evenodd"/><path d="M28 64.4L29.47 63.02L30.93 62.51L32.4 62.16L33.87 61.91L35.33 61.72L36.8 61.57L38.27 61.45L39.73 61.37L41.2 61.3L42.67 61.26L44.13 61.23L45.6 61.21L47.07 61.2L48.53 61.2L50 61.2L51.47 61.2L52.93 61.2L54.4 61.21L55.87 61.23L57.33 61.26L58.8 61.3L60.27 61.37L61.73 61.45L63.2 61.57L64.67 61.72L66.13 61.91L67.6 62.16L69.07 62.51L70.53 63.02L72 64.4L72 64.4L70.53 65.78L69.07 66.29L67.6 66.64L66.13 66.89L64.67 67.08L63.2 67.23L61.73 67.35L60.27 67.43L58.8 67.5L57.33 67.54L55.87 67.57L54.4 67.59L52.93 67.6L51.47 67.6L50 67.6L48.53 67.6L47.07 67.6L45.6 67.59L44.13 67.57L42.67 67.54L41.2 67.5L39.73 67.43L38.27 67.35L36.8 67.23L35.33 67.08L33.87 66.89L32.4 66.64L30.93 66.29L29.47 65.78L28 64.4Z"/><path d="M48.2 67.6L51.8 67.6L51.8 82L48.2 82Z"/><path d="M34 82L35.33 81.04L36.67 80.7L38 80.48L39.33 80.32L40.67 80.21L42 80.13L43.33 80.07L44.67 80.04L46 80.02L47.33 80L48.67 80L50 80L51.33 80L52.67 80L54 80.02L55.33 80.04L56.67 80.07L58 80.13L59.33 80.21L60.67 80.32L62 80.48L63.33 80.7L64.67 81.04L66 82L66 82L64.67 82.96L63.33 83.3L62 83.52L60.67 83.68L59.33 83.79L58 83.87L56.67 83.93L55.33 83.96L54 83.98L52.67 84L51.33 84L50 84L48.67 84L47.33 84L46 83.98L44.67 83.96L43.33 83.93L42 83.87L40.67 83.79L39.33 83.68L38 83.52L36.67 83.3L35.33 82.96L34 82Z"/></svg>'
};

const SPORT_LABEL = { wave: "Surf", wind: "Windsurf", kite: "Kitesurf", wing: "Wingfoil" };

function sportIconsHTML(sports) {
  if (!sports || !sports.length) return "";
  const icons = sports
    .filter(s => WAVEBASE_SPORT_ICONS[s])
    .map(s => `<span class="sport-icon" title="${SPORT_LABEL[s] || s}">${WAVEBASE_SPORT_ICONS[s]}</span>`)
    .join("");
  return `<div class="sport-icons">${icons}</div>`;
}

/* At-a-glance stats panel — first numeric block on spot/center pages.
   Spots store stats themselves; centers inherit from their linkedSpotId.
   Stays don't show this block (they're not condition-bound).
   Missing fields render as "—" rather than being invented. */
function getStatsFor(e) {
  if (e.type === "stay") return null;
  if (e.stats) return e.stats;
  if (e.linkedSpotId) {
    const linked = WAVEBASE_DATA.find(x => x.id === e.linkedSpotId);
    if (linked && linked.stats) return linked.stats;
  }
  return null;
}

function fmtRange(arr, unit) {
  if (!arr || !arr.length) return "—";
  if (arr.length === 1) return `${arr[0]} ${unit}`;
  return `${arr[0]}–${arr[1]} ${unit}`;
}

function crowdLabelText(c) {
  if (c === "low" || c === "laag")        return "low";
  if (c === "moderate" || c === "gemiddeld") return "moderate";
  if (c === "high" || c === "hoog")       return "high";
  return c || "—";
}

function crowdDotsHTML(c) {
  const map = { low: 1, laag: 1, moderate: 2, gemiddeld: 2, high: 3, hoog: 3 };
  const n = map[c] || 0;
  let html = "";
  for (let i = 1; i <= 3; i++) {
    html += `<span class="crowd-dot${i <= n ? " on" : ""}"></span>`;
  }
  return html;
}

const WAVEBASE_MONTH_LONG = ["", "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"];

// Find which period contains a given month (1-12). Returns null if no match.
function findPeriodForMonth(periods, month) {
  if (!periods || !periods.length) return null;
  return periods.find(p => Array.isArray(p.months) && p.months.includes(month)) || null;
}

// Average wind probability for a period — derived from monthlyWindProb where it
// exists, falls back to period.windProb (legacy structure).
function periodWindProb(period, monthlyWindProb) {
  if (!period) return null;
  if (Array.isArray(monthlyWindProb) && Array.isArray(period.months)) {
    const vals = period.months
      .map(m => monthlyWindProb[m - 1])
      .filter(v => typeof v === "number");
    if (vals.length) return vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  return (typeof period.windProb === "number") ? period.windProb : null;
}

// Pick the "best" period — only in-season periods compete; highest wind first.
function pickPeakPeriod(periods, monthlyWindProb) {
  if (!periods || !periods.length) return null;
  const inSeason = periods.filter(p => p.inSeason !== false);
  const pool = inSeason.length ? inSeason : periods;
  return [...pool].sort((a, b) => {
    const pa = periodWindProb(a, monthlyWindProb) || 0;
    const pb = periodWindProb(b, monthlyWindProb) || 0;
    if (pb !== pa) return pb - pa;
    return (b.months || []).length - (a.months || []).length;
  })[0];
}

// What month should the panel highlight as "yours"?
// Priority: ?month= URL param → today's month.
function userSelectedMonth() {
  const params = new URLSearchParams(window.location.search);
  const m = parseInt(params.get("month"), 10);
  if (m >= 1 && m <= 12) return m;
  return new Date().getMonth() + 1;
}

function periodColumnHTML(period, label, monthLabel, isPeak, stats, targetMonth) {
  if (!period) {
    return `<div class="period-col">
      <div class="period-head">
        <span class="period-tag">${label}</span>
        <span class="period-month">${monthLabel}</span>
      </div>
      <div class="period-empty">No reliable data for this month.</div>
    </div>`;
  }
  // Prefer per-month value where we have monthly arrays — more precise than
  // the period range. Falls back to period.windKn etc. when monthlies missing.
  const m = targetMonth - 1;
  const monthlyKn        = (stats && Array.isArray(stats.monthlyWindKn))      ? stats.monthlyWindKn[m]      : null;
  const monthlyGust      = (stats && Array.isArray(stats.monthlyGustKn))      ? stats.monthlyGustKn[m]      : null;
  const monthlyDailyPeak = (stats && Array.isArray(stats.monthlyDailyPeakKn)) ? stats.monthlyDailyPeakKn[m] : null;
  const monthlyGustPeak  = (stats && Array.isArray(stats.monthlyGustPeakKn))  ? stats.monthlyGustPeakKn[m]  : null;
  const monthlyWat       = (stats && Array.isArray(stats.monthlyWaterC))      ? stats.monthlyWaterC[m]      : null;

  const hasWindData = (typeof monthlyKn === "number") || period.windKn;
  const wind = (typeof monthlyKn === "number")
    ? `~${monthlyKn} kn`
    : (period.windKn ? fmtRange(period.windKn, "kn") : "—");

  // Gust note: avg gust · typical daily peak · 5-year absolute max
  const gustParts = [];
  if (typeof monthlyGust === "number")      gustParts.push(`gust ~${monthlyGust}`);
  if (typeof monthlyDailyPeak === "number") gustParts.push(`daily peak ~${monthlyDailyPeak}`);
  if (typeof monthlyGustPeak === "number")  gustParts.push(`max ${monthlyGustPeak}`);
  let gustNote = gustParts.length ? `${gustParts.join(" · ")} kn` : "";
  if (period.inSeason === false) {
    gustNote = gustNote ? `${gustNote} · centers closed` : "centers closed";
  }

  const wave = period.waveM ? fmtRange(period.waveM, "m") : "—";
  const water = (typeof monthlyWat === "number")
    ? `${monthlyWat} °C`
    : (period.waterC ? fmtRange(period.waterC, "°C") : "—");

  const windRow = hasWindData ? `<div class="period-stat"><span class="period-stat-label">Wind</span>
      <span class="period-stat-val">${wind}</span>
      ${gustNote ? `<span class="period-stat-note">${gustNote}</span>` : ""}
    </div>` : "";

  return `<div class="period-col${isPeak ? " is-peak" : ""}">
    <div class="period-head">
      <span class="period-tag">${label}</span>
      <span class="period-month">${monthLabel} · ${period.name}</span>
    </div>
    ${windRow}
    <div class="period-stat"><span class="period-stat-label">Wave</span>
      <span class="period-stat-val">${wave}</span></div>
    <div class="period-stat"><span class="period-stat-label">Water</span>
      <span class="period-stat-val">${water}</span></div>
  </div>`;
}

function statsPanelHTML(e) {
  const s = getStatsFor(e);
  if (!s) return "";

  const inherited = (e.type === "center" && e.linkedSpotId);
  const inheritedNote = inherited
    ? `<p class="stats-source">Conditions are for the beach this center sits on.</p>`
    : "";

  // Top "always" facts: wave character, wind direction, bottom, crowd
  const topRows = [
    { label: "Wave",     main: s.waveType || "—",  note: "" },
    { label: "Bottom",   main: s.bottom   || "—",  note: "" },
    { label: "Wind dir", main: s.windDir  || "—",  note: "" },
    { label: "Crowd",
      main: `<span class="crowd-dots">${crowdDotsHTML(s.crowd)}</span>`,
      note: crowdLabelText(s.crowd) }
  ];
  const topFacts = `<div class="stats-grid">${topRows.map(r =>
    `<div class="stats-row">
      <span class="stats-label">${r.label}</span>
      <span class="stats-main">${r.main}</span>
      <span class="stats-note">${r.note}</span>
    </div>`).join("")}</div>`;

  // Period comparison
  let periodComparison = "";
  if (s.periods && s.periods.length) {
    const userMonth = userSelectedMonth();
    const userPeriod = findPeriodForMonth(s.periods, userMonth);
    const peakPeriod = pickPeakPeriod(s.periods, s.monthlyWindProb);
    const userIsPeak = userPeriod && peakPeriod && userPeriod.name === peakPeriod.name;
    const userLabel = WAVEBASE_MONTH_LONG[userMonth];
    // For "Best month" pick the single month inside the peak period with the
    // highest probability — gives a sharper target month for the right column.
    let peakMonth = peakPeriod && peakPeriod.months && peakPeriod.months[0];
    if (peakPeriod && Array.isArray(s.monthlyWindProb)) {
      peakMonth = peakPeriod.months.reduce((best, m) =>
        (s.monthlyWindProb[m - 1] || 0) > (s.monthlyWindProb[best - 1] || 0) ? m : best,
        peakPeriod.months[0]);
    }
    const peakLabel = (peakPeriod && peakPeriod.months || [])
      .map(m => WAVEBASE_MONTH_LONG[m]).join("/");
    periodComparison = `<div class="period-comparison">
      ${periodColumnHTML(userPeriod, "Your month", userLabel, userIsPeak, s, userMonth)}
      ${periodColumnHTML(peakPeriod, "Best months", peakLabel, true, s, peakMonth)}
    </div>`;
  }

  return `<section class="at-a-glance">
    <h2>At a glance</h2>
    ${inheritedNote}
    ${topFacts}
    ${periodComparison}
    ${monthlyChartHTML(e)}
  </section>`;
}

// Two side-by-side bars per month — used for temperature (air vs water).
function buildDualBarChart(opts) {
  // { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks,
  //   barA: { arr, label, colorClass }, barB: { arr, label, colorClass } }
  const { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks, barA, barB } = opts;
  const bars = monthLabels.map((m, i) => {
    const monthNum = i + 1;
    const isUser = monthNum === userMonth;
    const period = findPeriodForMonth(stats.periods, monthNum);
    const inSeason = !period || period.inSeason !== false;
    const seasonClass = inSeason ? "in-season" : "off-season";
    const va = barA.arr[i], vb = barB.arr[i];
    const pctA = (va != null && !isNaN(va)) ? Math.max(2, Math.min(100, (va / maxValue) * 100)) : 0;
    const pctB = (vb != null && !isNaN(vb)) ? Math.max(2, Math.min(100, (vb / maxValue) * 100)) : 0;
    const tip = `${m}: ${barA.label} ${va}${unit} · ${barB.label} ${vb}${unit}`;
    return `<div class="month-bar dual ${seasonClass}${isUser ? " is-user" : ""}" title="${tip}">
      <span class="dual-bars">
        <span class="dual-bar ${barA.colorClass}" style="height: ${pctA}%;"></span>
        <span class="dual-bar ${barB.colorClass}" style="height: ${pctB}%;"></span>
      </span>
      <span class="month-bar-label">${m}</span>
    </div>`;
  }).join("");
  const yAxis = `<div class="y-axis">${axisTicks.map(t =>
    `<span class="y-tick">${t}</span>`).join("")}</div>`;
  const gridlines = `<div class="y-gridlines" aria-hidden="true">${
    axisTicks.map(() => `<span class="y-gridline"></span>`).join("")
  }</div>`;
  const legend = `<div class="chart-legend">
    <span class="legend-item"><span class="legend-swatch ${barA.colorClass}"></span>${barA.label}</span>
    <span class="legend-item"><span class="legend-swatch ${barB.colorClass}"></span>${barB.label}</span>
  </div>`;
  return `<div class="single-chart">
    <h3>${label}${sublabel ? ` <span class="muted">— ${sublabel}</span>` : ""}</h3>
    ${legend}
    <div class="chart-body">
      ${yAxis}
      <div class="chart-plot">
        ${gridlines}
        <div class="month-bars">${bars}</div>
      </div>
    </div>
  </div>`;
}

function buildSingleMetricChart(metricArr, opts) {
  // opts: { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks, colorClass, tooltipFor, overlayArr }
  // axisTicks = array of values to show on the Y axis (top → bottom).
  // tooltipFor(monthNum, value, overlayValue?) → custom tooltip string (optional).
  // overlayArr (optional) → per-month secondary value (e.g. gust kn, air temp);
  //   rendered as a thin horizontal line on top of the bar at its scaled height.
  const { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks, colorClass, tooltipFor, overlayArr } = opts;
  const bars = monthLabels.map((m, i) => {
    const monthNum = i + 1;
    const isUser = monthNum === userMonth;
    const v = metricArr[i];
    const period = findPeriodForMonth(stats.periods, monthNum);
    const inSeason = !period || period.inSeason !== false;
    const seasonClass = inSeason ? "in-season" : "off-season";
    const pct = Math.max(2, Math.min(100, (v / maxValue) * 100));
    const ov = overlayArr ? overlayArr[i] : null;
    const ovPct = (ov != null && !isNaN(ov)) ? Math.max(2, Math.min(100, (ov / maxValue) * 100)) : null;
    const tip = tooltipFor ? tooltipFor(monthNum, v, ov) : `${m}: ${v}${unit}`;
    const overlay = ovPct != null
      ? `<span class="month-bar-overlay" style="bottom: ${ovPct}%;"></span>` : "";
    return `<div class="month-bar ${colorClass} ${seasonClass}${isUser ? " is-user" : ""}" title="${tip}">
      <span class="month-bar-fill" style="height: ${pct}%;"></span>
      ${overlay}
      <span class="month-bar-label">${m}</span>
    </div>`;
  }).join("");
  // Y-axis = labels on the left + dashed gridlines at each tick value.
  const yAxis = `<div class="y-axis">${axisTicks.map(t =>
    `<span class="y-tick">${t}</span>`).join("")}</div>`;
  const gridlines = `<div class="y-gridlines" aria-hidden="true">${
    axisTicks.map(() => `<span class="y-gridline"></span>`).join("")
  }</div>`;
  return `<div class="single-chart">
    <h3>${label}${sublabel ? ` <span class="muted">— ${sublabel}</span>` : ""}</h3>
    <div class="chart-body">
      ${yAxis}
      <div class="chart-plot">
        ${gridlines}
        <div class="month-bars">${bars}</div>
      </div>
    </div>
  </div>`;
}

function monthlyChartHTML(e) {
  const stats = getStatsFor(e);
  const userMonth = userSelectedMonth();
  const monthLabels = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  // Wave-type spots get a primary wave-height chart; wind-type spots have
  // no primary chart (avg wind / gust info is surfaced in the at-a-glance
  // facts above). All spots get the temperature chart.
  //   temperature chart: bar = daytime air °C (the value most surfers
  //   intuitively expect to be highest); overlay line = sea water °C.
  if (stats && Array.isArray(stats.monthlyWaterC)) {
    const chartType = stats.chartType || (Array.isArray(stats.monthlyWindKn) ? "wind" : null);
    let primaryChart = null;

    if (chartType === "wave" && Array.isArray(stats.monthlyWaveM)) {
      primaryChart = buildSingleMetricChart(stats.monthlyWaveM, {
        stats, userMonth, monthLabels,
        label: "Wave height",
        sublabel: "daytime avg, metres",
        unit: " m", maxValue: 3, axisTicks: ["3 m", "1.5 m", "0"],
        colorClass: "color-wind",
        tooltipFor: (mn, v) => {
          const i = mn - 1;
          const sp = Array.isArray(stats.monthlySwellProb)
            ? ` · ${Math.round(stats.monthlySwellProb[i] * 100)}% days ≥1 m` : "";
          return `${monthLabels[i]}: ${v} m${sp}`;
        }
      });
    }

    // Temperature chart always renders (whenever water data exists). When
    // air-temp data is present, render as paired bars (air | water) per month.
    const hasAir = Array.isArray(stats.monthlyAirC);
    const tempChart = hasAir
      ? buildDualBarChart({
          stats, userMonth, monthLabels,
          label: "Temperature",
          sublabel: "°C per month — daytime air vs sea water",
          unit: "°C", maxValue: 35, axisTicks: ["35°", "20°", "0°"],
          barA: { arr: stats.monthlyAirC,   label: "Air",   colorClass: "color-air" },
          barB: { arr: stats.monthlyWaterC, label: "Water", colorClass: "color-water" }
        })
      : buildSingleMetricChart(stats.monthlyWaterC, {
          stats, userMonth, monthLabels,
          label: "Temperature",
          sublabel: "°C — sea water",
          unit: " °C", maxValue: 35, axisTicks: ["35°", "20°", "0°"],
          colorClass: "color-water"
        });

    const hasOffSeason = stats.periods && stats.periods.some(p => p.inSeason === false);
    const notes = [];
    if (hasOffSeason) notes.push("Dimmed bars = off-season (centers closed).");
    if (stats.source) notes.push(`Source: ${stats.source}.`);
    const chartNote = notes.length
      ? `<p class="chart-note">${notes.join(" ")}</p>` : "";

    const charts = primaryChart ? `${primaryChart}${tempChart}` : tempChart;
    const wrapClass = primaryChart ? "monthly-chart split" : "monthly-chart single";
    return `<div class="${wrapClass}">
      <div class="chart-pair">${charts}</div>
      ${chartNote}
    </div>`;
  }

  // Fallback: binary "good months" (entries without monthly arrays yet)
  const good = new Set(Array.isArray(e.goodMonths) ? e.goodMonths : []);
  if (!good.size) return "";
  const bars = monthLabels.map((m, i) => {
    const isGood = good.has(i + 1);
    const isUser = (i + 1) === userMonth;
    const height = isGood ? 100 : 25;
    return `<div class="month-bar ${isGood ? "on" : "off"}${isUser ? " is-user" : ""}">
      <span class="month-bar-fill" style="height: ${height}%;"></span>
      <span class="month-bar-label">${m}</span>
    </div>`;
  }).join("");
  return `<div class="monthly-chart">
    <h3>Best months <span class="muted">— recommended months in sea-blue</span></h3>
    <div class="month-bars">${bars}</div>
  </div>`;
}

/* Connect-the-dots — every detail page shows the other entity types nearby
   by ACTUAL distance (Haversine). Keeps clicks inside WaveBase rather than
   leaking to Google: see a stay → click the nearby center → click that
   center's website. */
function nearbyEntriesHTML(currentEntry, targetType, labelPlural, labelSingular, intro, opts) {
  opts = opts || {};
  const maxKm = opts.maxKm != null ? opts.maxKm : 30;
  const limit = opts.limit != null ? opts.limit : 8;
  let scored;
  if (!currentEntry.coords) {
    // Fallback to town equality when this entry has no coords yet.
    scored = WAVEBASE_DATA
      .filter(c => c.type === targetType && c.id !== currentEntry.id &&
                   c.country === entryCountry(currentEntry) && c.town === currentEntry.town)
      .map(c => ({ entry: c, dist: null }));
  } else {
    scored = WAVEBASE_DATA
      .filter(c => c.type === targetType && c.id !== currentEntry.id && c.coords)
      .map(c => ({ entry: c, dist: distanceKm(currentEntry.coords, c.coords) }))
      .filter(x => x.dist <= maxKm)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit);
  }
  if (!scored.length) return "";
  const label = scored.length === 1 ? labelSingular : labelPlural;
  const headerLoc = currentEntry.coords ? `near ${escHTML(currentEntry.town)}` : `at ${escHTML(currentEntry.town)}`;
  return `<section class="related-entries">
    <h2>${label} ${headerLoc}</h2>
    ${intro ? `<p class="muted form-note">${intro}</p>` : ""}
    <div class="grid list-view">${scored.map(x => cardHTML(x.entry, x.dist)).join("")}</div>
  </section>`;
}

// Section for a single explicitly-linked entry (used when a center should
// only ever surface ITS spot — not every nearby spot).
function linkedSpotSectionHTML(centerEntry) {
  if (!centerEntry.linkedSpotId) return "";
  const spot = byId(centerEntry.linkedSpotId);
  if (!spot) return "";
  return `<section class="related-entries">
    <h2>The spot this center sits on</h2>
    <p class="muted form-note">Where lessons and rentals happen.</p>
    <div class="grid list-view">${cardHTML(spot, distanceKm(centerEntry.coords, spot.coords))}</div>
  </section>`;
}

function relatedSectionsForDetail(e) {
  if (e.type === "spot") {
    return nearbyEntriesHTML(e, "center", "Centers", "Center",
      "Where to take lessons or rent gear at this beach.", { maxKm: 5, limit: 8 }) +
      nearbyEntriesHTML(e, "stay", "Stays", "Stay",
        "Places to base yourself within easy reach.", { maxKm: 20, limit: 8 });
  }
  if (e.type === "stay") {
    return nearbyEntriesHTML(e, "center", "Centers", "Center",
      "Where to take lessons or rent gear nearby.", { maxKm: 20, limit: 8 }) +
      nearbyEntriesHTML(e, "spot", "Spots", "Spot",
        "The breaks and beaches within easy reach.", { maxKm: 20, limit: 8 });
  }
  if (e.type === "center") {
    // Center pages: ONLY the spot the center sits on — never other nearby
    // spots, even if they're close. Per LDW: the center belongs to its beach.
    return linkedSpotSectionHTML(e) +
      nearbyEntriesHTML(e, "stay", "Stays", "Stay",
        "Places to base yourself within easy reach.", { maxKm: 20, limit: 8 });
  }
  return "";
}

/* ---- card ---- */
function cardHTML(e, distKm) {
  const pills = e.levels.map(l => `<span class="pill">${cap(l)}</span>`).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);
  const distHint = (distKm != null && isFinite(distKm))
    ? ` <span class="muted">· ${fmtKm(distKm)} away</span>` : "";
  return `
  <article class="card" data-href="${spotHref(e.id)}">
    <div class="thumb ${e.type}${e.photo ? " has-photo" : ""}"${thumbStyle(e)}>
      <span class="badge">${typeBadge(e.type)}</span>
      ${e.type === "stay" ? "" : sportIconsHTML(entrySports(e))}
      <button class="compare-btn ${comparing ? "on" : ""}" data-compare="${e.id}" aria-label="Compare" title="${comparing ? "In your compare list" : "Add to compare"}">⇄</button>
      <button class="save-btn ${saved ? "on" : ""}" data-save="${e.id}" aria-label="Save" title="${saved ? "Saved" : "Save this place"}">${saved ? "♥" : "♡"}</button>
    </div>
    <div class="body">
      <div class="place">${e.town}${distHint}</div>
      <h3>${e.name}</h3>
      <p class="tag">${e.tagline}</p>
      <div class="meta">${pills}</div>
    </div>
  </article>`;
}

function wireCards(container) {
  container.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", ev => {
      if (ev.target.closest(".save-btn") || ev.target.closest(".compare-btn")) return;
      window.location.href = card.dataset.href;
    });
  });
  container.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      const on = WaveBaseAccount.toggleSave(btn.dataset.save);
      btn.classList.toggle("on", on);
      btn.textContent = on ? "♥" : "♡";
      btn.title = on ? "Saved" : "Save this place";
    });
  });
  container.querySelectorAll(".compare-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      const on = WaveBaseAccount.toggleCompare(btn.dataset.compare);
      btn.classList.toggle("on", on);
      btn.title = on ? "In your compare list" : "Add to compare";
      updateNav();
    });
  });
}

/* ---- INDEX: country-driven search ---- */
function findCountry(name) {
  if (typeof WAVEBASE_DESTINATIONS === "undefined") return null;
  for (const c of WAVEBASE_DESTINATIONS) {
    for (const co of c.countries) {
      if (co.name === name) return co;
    }
  }
  return null;
}

/* Backward-compatible accessors — older Morocco entries lack country/sports fields */
function entryCountry(e) { return e.country || "Morocco"; }
function entrySports(e)  { return e.sports  || ["wave"]; }

/* HTML-escape user-supplied strings before injecting into innerHTML */
function escHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* Free-text matcher — checks name, town, country, tagline, summary, story and layer titles */
function searchMatch(e, q) {
  const ql = String(q || "").toLowerCase().trim();
  if (!ql) return true;
  const layerText = (e.lagen || []).map(l => l.titel + " " + (l.inhoud || []).map(b => b.kop + " " + b.tekst).join(" ")).join(" ");
  const haystack = [
    e.name, e.town, entryCountry(e), e.tagline,
    ...(e.samenvatting || []),
    ...(e.verhaal || []),
    layerText
  ].join(" ").toLowerCase();
  return haystack.includes(ql);
}

/* Derive live country×sport combos from the actual data, so COMING SOON copy
   updates automatically as new countries/sports get content. */
function getLiveCombos() {
  const map = {};
  WAVEBASE_DATA.forEach(e => {
    const c = entryCountry(e);
    if (!map[c]) map[c] = new Set();
    entrySports(e).forEach(s => map[c].add(s));
  });
  return Object.keys(map).map(country => {
    const dest = findCountry(country);
    return { country, flag: dest ? dest.flag : "", sports: Array.from(map[country]) };
  });
}

/* Friendly country headings: known clusters spelled out, others just the country name */
function countryHeading(country) {
  const map = {
    "Morocco": "Tamraght & Taghazout, Morocco",
    "Greece":  "East Crete, Greece"
  };
  return map[country] || country;
}

function townStripHTML(country) {
  if (typeof WAVEBASE_TOWNS === "undefined") return "";
  const names = Object.keys(WAVEBASE_TOWNS).filter(name => {
    const t = WAVEBASE_TOWNS[name];
    return !country || (t.country || "Morocco") === country;
  });
  if (!names.length) return "";
  const cards = names.map(name => {
    const t = WAVEBASE_TOWNS[name];
    return `<div class="town-card">
      <h3>${t.naam}</h3>
      <p>${t.intro}</p>
      <div class="town-card-facts">
        <span><strong>What to do:</strong> ${t.teDoen}</span>
      </div>
    </div>`;
  }).join("");
  const heading = country
    ? `The location in general: ${escHTML(country)}`
    : "The location in general";
  return `<section class="town-intro-section">
    <h2 class="town-intro-h2">${heading}</h2>
    <div class="town-intro-strip">${cards}</div>
  </section>`;
}

/* ---- view preference (cards vs list), persisted in localStorage ---- */
function getViewPref() {
  return localStorage.getItem("wavebase_view_pref") || "grid";
}
function setViewPref(pref) {
  localStorage.setItem("wavebase_view_pref", pref);
}
function viewToggleHTML(pref) {
  const gridIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
  const listIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
  return `<div class="view-toggle" role="group" aria-label="Result view">
    <button class="view-btn ${pref === "grid" ? "active" : ""}" data-view="grid" aria-label="Card view" title="Card view">${gridIcon}</button>
    <button class="view-btn ${pref === "list" ? "active" : ""}" data-view="list" aria-label="List view" title="List view">${listIcon}</button>
  </div>`;
}
function wireViewToggle(container) {
  container.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setViewPref(btn.dataset.view);
      runSearch();
    });
  });
}

/* ---- sport scope (all / wave / wind / kite / wing) — 'live' is derived from data ---- */
const WAVEBASE_SPORTS = [
  { key: "all",  label: "All"  },
  { key: "wave", label: "Wave" },
  { key: "wind", label: "Wind" },
  { key: "kite", label: "Kite" },
  { key: "wing", label: "Wing" }
];
function sportIsLive(key) {
  if (key === "all") return true;
  if (typeof WAVEBASE_DATA === "undefined") return key === "wave";
  return WAVEBASE_DATA.some(e => entrySports(e).includes(key));
}
function getSportPref() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("sport");
  if (fromUrl) return fromUrl;
  return localStorage.getItem("wavebase_sport_pref") || "all";
}
function setSportPref(sport) {
  localStorage.setItem("wavebase_sport_pref", sport);
}
function sportLabel(key) {
  const s = WAVEBASE_SPORTS.find(s => s.key === key);
  return s ? s.label : key;
}
function sportPillsHTML(active) {
  return `<div class="sport-pills" role="tablist" aria-label="Surf sport">
    ${WAVEBASE_SPORTS.map(s => {
      const live = sportIsLive(s.key);
      return `<button class="sport-pill ${s.key === active ? "active" : ""}${live ? "" : " soon"}" data-sport="${s.key}" role="tab" aria-selected="${s.key === active}">${s.label}${live ? "" : ' <span class="soon-tag">soon</span>'}</button>`;
    }).join("")}
  </div>`;
}
function wireSportPills(container) {
  container.querySelectorAll(".sport-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      setSportPref(btn.dataset.sport);
      const url = new URL(window.location.href);
      if (btn.dataset.sport === "all") url.searchParams.delete("sport");
      else url.searchParams.set("sport", btn.dataset.sport);
      window.history.replaceState(null, "", url.toString());
      runSearch();
    });
  });
}

/* Render the spots/centers/stays sections + sticky jumper bar shared between
   country-picker mode and free-text search mode. Returns the HTML string. */
function renderResultsSections(matches, gridClass) {
  if (!matches.length) return "";
  const spots   = matches.filter(e => e.type === "spot");
  const centers = matches.filter(e => e.type === "center");
  const stays   = matches.filter(e => e.type === "stay");
  const sections = [
    { key: "spots",   label: "Surf spots",   items: spots   },
    { key: "centers", label: "Surf centers", items: centers },
    { key: "stays",   label: "Stays",        items: stays   }
  ].filter(s => s.items.length);
  let html = "";
  if (sections.length >= 2) {
    html += `<nav class="section-jumper" aria-label="Jump to section">${sections.map(s =>
      `<a class="jumper-chip" href="#sec-${s.key}" data-jump="${s.key}">${s.label} <span class="jumper-count">${s.items.length}</span></a>`
    ).join("")}</nav>`;
  }
  sections.forEach(s => {
    html += `<section class="result-section" id="sec-${s.key}">
      <button class="section-toggle" type="button" aria-expanded="true" aria-controls="body-${s.key}">
        <span class="section-chev" aria-hidden="true">▾</span>
        <h2>${s.label} <span class="seccount">${s.items.length}</span></h2>
      </button>
      <div class="${gridClass} section-body" id="body-${s.key}">${s.items.map(cardHTML).join("")}</div>
    </section>`;
  });
  return html;
}

function runSearch() {
  const country = document.getElementById("f-country").value;
  const level = document.getElementById("f-level").value;
  const month = document.getElementById("f-month").value;
  const type  = document.getElementById("f-type").value;
  const sport = getSportPref();
  const qEl   = document.getElementById("f-search");
  const query = qEl ? qEl.value.trim() : "";
  const results = document.getElementById("results");
  const longSport = { all: "All surf sports", wave: "Wave surfing", wind: "Windsurfing", kite: "Kitesurfing", wing: "Wing foiling" };

  // keep URL in sync — country + filters + sport + free-text query — so links are shareable AND back-navigation restores the state
  const url = new URL(window.location.href);
  const setParam = (k, v, isDefault) => {
    if (v && !isDefault) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  };
  setParam("country", country, !country);
  setParam("level", level, level === "all");
  setParam("type", type, type === "all");
  setParam("month", month, month === "all");
  setParam("sport", sport, sport === "all");
  setParam("q", query, !query);
  window.history.replaceState(null, "", url.toString());

  // Toggle the clear-search button based on whether there's a query
  const clearBtn = document.getElementById("f-search-clear");
  if (clearBtn) clearBtn.hidden = !query;

  // refresh sport pill active state to reflect current sport
  document.querySelectorAll(".sport-pill").forEach(btn => {
    const isActive = btn.dataset.sport === sport;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const pref = getViewPref();
  const gridClass = pref === "list" ? "grid list-view" : "grid";

  // ============ FREE-TEXT SEARCH MODE — overrides the country picker ============
  if (query) {
    const matches = WAVEBASE_DATA.filter(e => {
      if (!searchMatch(e, query)) return false;
      if (sport !== "all" && !entrySports(e).includes(sport)) return false;
      const okL = level === "all" || e.levels.includes(level);
      const okM = month === "all" || e.goodMonths.includes(parseInt(month, 10));
      const okT = type === "all" || e.type === type;
      return okL && okM && okT;
    });
    let html = `<div class="results-head"><h2>Search: &ldquo;${escHTML(query)}&rdquo; <span class="seccount">${matches.length}</span></h2>${matches.length ? viewToggleHTML(pref) : ""}</div>`;
    if (matches.length === 0) {
      html += `<div class="empty">
        <strong>Nothing matches &ldquo;${escHTML(query)}&rdquo; in <strong>${longSport[sport]}</strong>.</strong><br>
        Try a different spelling, a broader term, or another sport — or clear the search and browse by country.
      </div>`;
    } else {
      html += renderResultsSections(matches, gridClass);
    }
    results.innerHTML = html;
    wireCards(results);
    wireViewToggle(results);
    wireSectionToggle(results);
    wireSectionJumper(results);
    return;
  }

  // no country yet → ask the user to pick one
  if (!country) {
    results.innerHTML = `<div class="empty"><strong>Pick a country to begin.</strong><br>
      Use the &ldquo;Where?&rdquo; picker above, type a place in the search bar, or open the Destinations menu in the header.</div>`;
    return;
  }

  // Data-driven: filter entries by country (with default) and sport (with default)
  const liveCountrySportEntries = WAVEBASE_DATA.filter(e =>
    entryCountry(e) === country && (sport === "all" || entrySports(e).includes(sport))
  );

  // No entries for this country×sport combo → COMING SOON with smart hints
  if (liveCountrySportEntries.length === 0) {
    const dest = findCountry(country);
    const flag = dest ? dest.flag : "";
    const title = `${longSport[sport]} in ${country}`;

    // What is live for this country (other sports)?
    const combos = getLiveCombos();
    const thisCountry = combos.find(c => c.country === country);
    const otherSportsHere = thisCountry ? thisCountry.sports.filter(s => s !== sport) : [];

    // What countries are live for this sport?
    const otherCountriesForSport = combos
      .filter(c => c.country !== country && c.sports.includes(sport))
      .map(c => `${c.flag} ${c.country}`);

    let hint = "";
    if (otherSportsHere.length) {
      const list = otherSportsHere.map(s => longSport[s]).join(", ");
      hint += `<p>In <strong>${country}</strong>, <strong>${list}</strong> is already live — switch the sport pill above.</p>`;
    }
    if (otherCountriesForSport.length) {
      hint += `<p>For <strong>${longSport[sport]}</strong>, live countries: ${otherCountriesForSport.join(" &middot; ")}.</p>`;
    }
    if (!hint) {
      hint = `<p>WaveBase is rolling out worldwide and across all surf sports — more is on its way.</p>`;
    }

    results.innerHTML = `<section class="coming-soon">
      ${flag ? `<div class="coming-flag">${flag}</div>` : ""}
      <h2>Coming soon</h2>
      <p><strong>${title}</strong> is on its way.</p>
      ${hint}
    </section>`;
    return;
  }

  // Apply the secondary filters (level / month / type) inside the country×sport set
  const matches = liveCountrySportEntries.filter(e => {
    const okL = level === "all" || e.levels.includes(level);
    const okM = month === "all" || e.goodMonths.includes(parseInt(month, 10));
    const okT = type === "all" || e.type === type;
    return okL && okM && okT;
  });

  const heading = countryHeading(country);
  let html = "";

  if (matches.length === 0) {
    html += `<div class="results-head"><h2>${heading}</h2></div>`;
    html += townStripHTML(country);
    html += `<div class="empty"><strong>Nothing's a perfect match here.</strong><br>
      Try loosening a filter — the live region only has so many entries for now.</div>`;
  } else {
    html += `<div class="results-head"><h2>${heading}</h2>${viewToggleHTML(pref)}</div>`;
    html += townStripHTML(country);
    html += renderResultsSections(matches, gridClass);
  }

  results.innerHTML = html;
  wireCards(results);
  wireViewToggle(results);
  wireSectionToggle(results);
  wireSectionJumper(results);
}

function wireSectionToggle(container) {
  container.querySelectorAll(".section-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".result-section");
      const wasOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", wasOpen ? "false" : "true");
      section.classList.toggle("collapsed", wasOpen);
    });
  });
}

function wireSectionJumper(container) {
  container.querySelectorAll(".jumper-chip").forEach(chip => {
    chip.addEventListener("click", ev => {
      ev.preventDefault();
      const key = chip.dataset.jump;
      const section = document.getElementById("sec-" + key);
      if (!section) return;
      // Expand if currently collapsed so the user lands on visible content
      const btn = section.querySelector(".section-toggle");
      if (btn && btn.getAttribute("aria-expanded") === "false") btn.click();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initIndex() {
  const mSel = document.getElementById("f-month");
  for (let i = 1; i <= 12; i++) {
    const o = document.createElement("option");
    o.value = i; o.textContent = WAVEBASE_MONTHS[i];
    mSel.appendChild(o);
  }
  // populate the country picker — datalist gives native type-ahead autocomplete.
  // option.value = bare country name (clean URLs + clean state). The "— soon" hint
  // appears only in the suggestion display where the user picks.
  const cDl = document.getElementById("f-country-list");
  if (cDl && typeof WAVEBASE_DESTINATIONS !== "undefined") {
    WAVEBASE_DESTINATIONS.forEach(cont => {
      cont.countries.forEach(co => {
        const o = document.createElement("option");
        o.value = co.name;
        if (co.status !== "live") o.label = `${co.name} — soon`;
        cDl.appendChild(o);
      });
    });
  }
  // pre-select all filters from URL params (country + level/type/month + free-text q) — supports deep links and back-navigation
  const params = new URLSearchParams(window.location.search);
  [["country","f-country"],["level","f-level"],["type","f-type"],["month","f-month"],["q","f-search"]].forEach(([k, id]) => {
    const v = params.get(k);
    if (v) {
      const el = document.getElementById(id);
      if (el) el.value = v;
    }
  });
  ["f-level", "f-month", "f-type", "f-country"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", runSearch);
  });
  document.getElementById("search-btn").addEventListener("click", runSearch);

  // live free-text search (debounced — small dataset, so 150 ms is plenty)
  const fSearch = document.getElementById("f-search");
  if (fSearch) {
    let t;
    fSearch.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(runSearch, 150);
    });
    fSearch.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { fSearch.value = ""; runSearch(); fSearch.blur(); }
    });
  }
  const fClear = document.getElementById("f-search-clear");
  if (fClear && fSearch) {
    fClear.addEventListener("click", () => {
      fSearch.value = "";
      runSearch();
      fSearch.focus();
    });
  }

  // inject sport pills (Wave / Wind / Kite / Wing) above the searcher section
  const searcherEl = document.querySelector(".searcher");
  const searcherSection = searcherEl && searcherEl.closest("section");
  if (searcherSection && !document.querySelector(".sport-pills")) {
    const wrap = document.createElement("section");
    wrap.className = "wrap sport-pills-wrap";
    wrap.innerHTML = sportPillsHTML(getSportPref());
    searcherSection.parentNode.insertBefore(wrap, searcherSection);
    wireSportPills(wrap);
  }

  runSearch();
}

/* ---- SEO helpers ---- */
const SITE_ORIGIN = "https://wavebase.lode-b162.workers.dev";

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const m = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function applySpotSEO(e) {
  const typeLabelStr = typeLabel(e.type);
  const country = entryCountry(e);
  const title = `${e.name} — ${typeLabelStr} in ${e.town}, ${country} | WaveBase`;
  const desc = (e.tagline || `Honest analysis of ${e.name} (${typeLabelStr}) in ${e.town}, ${country}.`).slice(0, 300);
  const url = `${SITE_ORIGIN}/spot.html?id=${e.id}`;

  document.title = title;
  setMeta('meta[name="description"]', "content", desc);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", desc);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", desc);

  // canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);

  // JSON-LD structured data — schema.org type per entity type
  const schemaType = e.type === "spot" ? "TouristAttraction"
                   : e.type === "stay" ? "LodgingBusiness"
                   : "LocalBusiness";
  const ld = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": e.name,
    "description": desc,
    "url": url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": e.town,
      "addressCountry": country
    }
  };
  if (e.coords) {
    ld.geo = {
      "@type": "GeoCoordinates",
      "latitude": e.coords[0],
      "longitude": e.coords[1]
    };
  }
  if (e.bookingUrl) ld.sameAs = [e.bookingUrl];
  let ldEl = document.getElementById("ld-spot");
  if (!ldEl) {
    ldEl = document.createElement("script");
    ldEl.type = "application/ld+json";
    ldEl.id = "ld-spot";
    document.head.appendChild(ldEl);
  }
  ldEl.textContent = JSON.stringify(ld);
}

/* ---- SPOT: detail page ---- */
function laagHTML(laag) {
  const blokken = laag.inhoud.map(b =>
    `<div class="blok"><h3>${b.kop}</h3><p>${b.tekst}</p></div>`).join("");
  return `<section class="laag"><h2>${laag.titel}</h2>
    <span class="bron">Source: ${laag.bron}</span>${blokken}</section>`;
}

function vergelijkingHTML(v) {
  if (!v) return "";
  const rows = v.rijen.map(r =>
    `<tr><td class="mon">${r.label}</td><td class="surf">${r.a}</td><td class="host">${r.b}</td></tr>`).join("");
  return `<section class="vergelijking"><h2>${v.kop}</h2>
    <table class="cal"><tr><th>Period</th><th>Surf</th><th>Stay</th></tr>${rows}</table></section>`;
}

function druktelIndicator(niveau) {
  const order = ["rustig", "gemiddeld", "druk"];
  const idx = order.indexOf(niveau);
  const segs = [0, 1, 2].map(i =>
    `<span class="drukte-seg${i <= idx ? " on " + niveau : ""}"></span>`).join("");
  return `<span class="drukte-bar" title="${crowdLabel(niveau)}">${segs}</span>`;
}

function conditiesHTML(c) {
  if (!c) return "";
  return `<section class="condities">
    <h2>Conditions</h2>
    <div class="cond-grid">
      <div class="cond-item"><span class="cond-label">Wave type</span><span class="cond-val">${c.golftype}</span></div>
      <div class="cond-item"><span class="cond-label">Wave height</span><span class="cond-val">${c.golfhoogte}</span></div>
      <div class="cond-item"><span class="cond-label">Wind</span><span class="cond-val">${c.wind}</span></div>
      <div class="cond-item"><span class="cond-label">Water temperature</span><span class="cond-val">${c.water}</span></div>
      <div class="cond-item drukte-item">
        <span class="cond-label">Crowd &middot; ${crowdLabel(c.drukte.niveau)} ${druktelIndicator(c.drukte.niveau)}</span>
        <span class="cond-val">${c.drukte.tekst}</span>
      </div>
    </div>
  </section>`;
}

function verblijfHTML(v) {
  if (!v) return "";
  const rows = [
    ["Food", v.eten],
    ["Distance from surf spot", v.afstandSpot],
    ["Gear rental", v.verhuur],
    ["Lessons", v.lessen],
    ["Rating", v.rating],
    ["Vibe", v.sfeer],
    ["Other activities", v.activiteiten]
  ];
  const items = rows.map(([k, val]) =>
    `<div class="cond-item"><span class="cond-label">${k}</span><span class="cond-val">${val || "—"}</span></div>`
  ).join("");
  return `<section class="condities">
    <h2>The stay at a glance</h2>
    <div class="cond-grid verblijf-grid">${items}</div>
  </section>`;
}

function dienstenHTML(d) {
  if (!d) return "";
  const rows = [
    ["Lessons", d.lessen],
    ["Rental", d.rental],
    ["Gear brands", d.brands],
    ["Facilities", d.faciliteiten],
    ["Team & vibe", d.team]
  ];
  const items = rows.map(([k, val]) =>
    `<div class="cond-item"><span class="cond-label">${k}</span><span class="cond-val">${val || "—"}</span></div>`
  ).join("");
  return `<section class="condities">
    <h2>The center at a glance</h2>
    <div class="cond-grid verblijf-grid">${items}</div>
  </section>`;
}

function buurtHTML(b) {
  if (!b) return "";
  return `<section class="buurt">
    <h2>Nearby</h2>
    <div class="buurt-grid">
      <div class="buurt-item"><span class="buurt-label">Food</span><span>${b.eten}</span></div>
      <div class="buurt-item"><span class="buurt-label">Parking</span><span>${b.parking}</span></div>
      <div class="buurt-item"><span class="buurt-label">Gear rental</span><span>${b.verhuur}</span></div>
    </div>
  </section>`;
}

function townPanelHTML(townName) {
  const towns = (typeof WAVEBASE_TOWNS !== "undefined") ? WAVEBASE_TOWNS : null;
  const t = towns && towns[townName];
  if (!t) return "";
  return `<section class="town-panel">
    <h2>The town &middot; ${t.naam}</h2>
    <p class="town-intro-line">${t.intro}</p>
    <div class="town-grid">
      <div class="town-item"><span class="town-label">What to do</span><span>${t.teDoen}</span></div>
      <div class="town-item"><span class="town-label">Public transport</span><span>${t.vervoer}</span></div>
      <div class="town-item"><span class="town-label">Getting there</span><span>${t.afstand}</span></div>
    </div>
    ${t.bron ? `<span class="bron">Source: ${t.bron}</span>` : ""}
  </section>`;
}

function tripOptionsHTML() {
  const opts = WaveBaseAccount.getTrips().map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  return `<option value="">+ Add to a trip…</option>${opts}<option value="__new">➕ New trip…</option>`;
}

function initSpot() {
  const root = document.getElementById("detail-root");
  const id = new URLSearchParams(window.location.search).get("id");
  const e = byId(id);
  if (!e) {
    root.innerHTML = `<p class="empty"><strong>Not found.</strong><br>
      <a href="index.html">Back to all places</a></p>`;
    return;
  }
  applySpotSEO(e);
  const verhaal = e.verhaal.map(p => `<p>${p}</p>`).join("");
  const samenvatting = e.samenvatting.map(s => `<li>${s}</li>`).join("");
  const lagen = e.lagen.map(laagHTML).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);

  // Back link defaults to the entry's country on "All" sport — keeps the fallback
  // welcoming. history.back() restores the specific sport state when the user
  // came from inside the site (handled by the click listener further down).
  const backHref = `index.html?country=${encodeURIComponent(entryCountry(e))}`;
  root.innerHTML = `
    <a class="backlink" href="${backHref}">&larr; Back to all places</a>
    <div class="detail-photo ${e.type}${e.photo ? " has-photo" : ""}"${e.photo ? ` style="background-image:url('${e.photo}')"` : ""}>
      ${e.photo ? "" : `<span class="photo-placeholder">Photo coming soon</span>`}
    </div>
    <header class="detail-head">
      <div class="place">${typeLabel(e.type)} &middot; ${e.town}</div>
      <h1>${e.name}</h1>
      <p class="tag">${e.tagline}</p>
      ${e.coordsLabel ? `<p class="coords-note">About the location: ${e.coordsLabel}</p>` : ""}
      <div class="detail-actions">
        ${e.type === "stay" ? `<a class="btn btn-book" href="${bookingHref(e)}" target="_blank" rel="noopener">Book now ↗</a>` : ""}
        ${e.type === "center" && e.bookingUrl ? `<a class="btn btn-book" href="${e.bookingUrl}" target="_blank" rel="noopener">Visit website ↗</a>` : ""}
        <button class="btn ghost ${saved ? "on" : ""}" id="save-toggle">${saved ? "♥ Saved" : "♡ Save this place"}</button>
        <button class="btn ghost ${comparing ? "on" : ""}" id="compare-toggle">${comparing ? "✓ In compare" : "+ Compare"}</button>
        <select id="trip-select">${tripOptionsHTML()}</select>
      </div>
    </header>

    ${e.coords ? `<div class="detail-map" id="detail-map"></div>
      <p class="map-actions"><a href="${googleMapsHref(e.coords)}" target="_blank" rel="noopener">Open in Google Maps ↗</a></p>` : ""}

    ${statsPanelHTML(e)}

    <div class="kort">
      <h2>In short</h2>
      <ul>${samenvatting}</ul>
    </div>

    ${conditiesHTML(e.condities)}
    ${verblijfHTML(e.verblijf)}
    ${dienstenHTML(e.diensten)}

    <div class="verhaal">
      <h2>The honest story</h2>
      ${verhaal}
    </div>

    ${lagen}
    ${buurtHTML(e.buurt)}
    ${vergelijkingHTML(e.vergelijking)}
    ${relatedSectionsForDetail(e)}
    ${townPanelHTML(e.town)}

    <section class="fit">
      <div class="box yes"><h3>Ideal for</h3><p>${e.ideaalVoor}</p></div>
      <div class="box no"><h3>Not ideal if</h3><p>${e.nietIdeaalAls}</p></div>
    </section>`;

  // mini-map showing this entry's location
  if (e.coords && typeof L !== "undefined" && document.getElementById("detail-map")) {
    const m = L.map("detail-map", { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
    }).addTo(m);
    L.circleMarker(e.coords, { radius: 10, color: "#fff", weight: 3, fillColor: typeColor(e.type), fillOpacity: 1 })
      .bindPopup(`<strong>${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}`)
      .addTo(m);
    m.setView(e.coords, 14);
  }

  // Wire embedded entry cards in the connect-the-dots list-view sections
  if (root.querySelector(".related-entries .grid")) wireCards(root);

  document.getElementById("save-toggle").addEventListener("click", function () {
    const on = WaveBaseAccount.toggleSave(e.id);
    this.textContent = on ? "♥ Saved" : "♡ Save this place";
    this.classList.toggle("on", on);
  });
  document.getElementById("compare-toggle").addEventListener("click", function () {
    const on = WaveBaseAccount.toggleCompare(e.id);
    this.textContent = on ? "✓ In compare" : "+ Compare";
    this.classList.toggle("on", on);
    updateNav();
  });
  document.getElementById("trip-select").addEventListener("change", function () {
    const v = this.value;
    if (!v) return;
    if (v === "__new") {
      const name = window.prompt("Name your new trip:");
      if (name) {
        const t = WaveBaseAccount.addTrip(name);
        WaveBaseAccount.addToTrip(t.id, e.id);
        alert(`"${e.name}" added to trip "${t.name}".`);
      }
    } else {
      WaveBaseAccount.addToTrip(v, e.id);
      const t = WaveBaseAccount.getTrips().find(x => x.id === v);
      alert(`"${e.name}" added to trip "${t ? t.name : ""}".`);
    }
    this.innerHTML = tripOptionsHTML();
    this.value = "";
  });

  // back link: if the user came from inside the site, use history.back() to restore their previous state.
  // The href fallback (set above) points to this entry's country + sport.
  const back = root.querySelector(".backlink");
  if (back) {
    back.addEventListener("click", ev => {
      if (document.referrer && document.referrer.startsWith(window.location.origin)) {
        ev.preventDefault();
        history.back();
      }
    });
  }
}

/* ---- MAP ---- */
function initMap() {
  const map = L.map("map");
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
  }).addTo(map);

  // Pre-pass: spread markers that land within ~200 m of each other so they're
  // both visible at any zoom level. Without this, Gone Surfing + Freak Surf
  // (~140 m apart) stack on top of each other and look like one center.
  // Real coords stay on the entry; we only offset the DISPLAY position.
  const displayCoords = {};
  const PROX_M = 200, OFFSET_DEG = 0.0012; // ~130 m
  const groups = [];
  WAVEBASE_DATA.forEach(e => {
    if (!e.coords) return;
    const existing = groups.find(g => distanceKm(g.center, e.coords) * 1000 < PROX_M);
    if (existing) existing.entries.push(e);
    else groups.push({ center: e.coords, entries: [e] });
  });
  groups.forEach(g => {
    if (g.entries.length === 1) {
      displayCoords[g.entries[0].id] = g.entries[0].coords;
    } else {
      g.entries.forEach((e, i) => {
        const angle = (i / g.entries.length) * 2 * Math.PI;
        displayCoords[e.id] = [
          g.center[0] + Math.cos(angle) * OFFSET_DEG,
          g.center[1] + Math.sin(angle) * OFFSET_DEG
        ];
      });
    }
  });

  // One layer per entity-type (for the type toggles), and per-marker entry refs
  // (so the sport filter can hide individual markers within a layer).
  const layers = { spot: L.layerGroup(), stay: L.layerGroup(), center: L.layerGroup() };
  const markerEntries = []; // [{marker, entry, layer}]
  const allCoords = [];
  WAVEBASE_DATA.forEach(e => {
    if (!e.coords || !layers[e.type]) return;
    allCoords.push(e.coords);
    const pos = displayCoords[e.id] || e.coords;
    const m = L.circleMarker(pos, {
      radius: 8, color: "#fff", weight: 2, fillColor: typeColor(e.type), fillOpacity: 1
    });
    const note = e.coordsLabel ? "<br><em>Approximate location</em>" : "";
    m.bindPopup(`<strong>${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}${note}<br>
      <a href="spot.html?id=${e.id}">See the analysis →</a>`);
    markerEntries.push({ marker: m, entry: e, layer: layers[e.type] });
    m.addTo(layers[e.type]);
  });
  layers.spot.addTo(map);
  layers.stay.addTo(map);
  layers.center.addTo(map);
  if (allCoords.length) map.fitBounds(allCoords, { padding: [30, 30] });

  // ---- filter state ----
  const typeState = { spot: true, stay: true, center: true };
  const sportState = { wave: true, wind: true, kite: true, wing: true };

  function applyFilters() {
    // First, toggle the entity-type LayerGroups on/off (cheap when whole type is hidden)
    ["spot", "stay", "center"].forEach(t => {
      const on = typeState[t];
      if (on) layers[t].addTo(map); else map.removeLayer(layers[t]);
    });
    // Then within visible layers, hide markers whose sports don't intersect with the
    // active sport set. Stays have no real sport — always show them when type=stay is on.
    markerEntries.forEach(({ marker, entry, layer }) => {
      const typeOn = typeState[entry.type];
      let sportOn = true;
      if (entry.type === "spot" || entry.type === "center") {
        const sports = entrySports(entry);
        sportOn = sports.some(s => sportState[s]);
      }
      const shouldShow = typeOn && sportOn;
      if (shouldShow) {
        if (!layer.hasLayer(marker)) layer.addLayer(marker);
      } else {
        if (layer.hasLayer(marker)) layer.removeLayer(marker);
      }
    });
  }

  // Wire entity-type toggles
  ["spot", "stay", "center"].forEach(t => {
    const el = document.getElementById("t-" + t);
    if (!el) return;
    el.addEventListener("change", () => {
      typeState[t] = el.checked;
      applyFilters();
    });
  });
  // Wire sport toggles
  document.querySelectorAll(".t-sport").forEach(el => {
    el.addEventListener("change", () => {
      sportState[el.dataset.sport] = el.checked;
      applyFilters();
    });
  });
}

/* ---- trip maps (account) — a roadtrip-style map per trip ---- */
function initTripMaps(trips) {
  if (typeof L === "undefined") return;
  trips.forEach(t => {
    const el = document.getElementById("trip-map-" + t.id);
    if (!el) return;
    const items = t.spotIds.map(byId).filter(e => e && e.coords);
    if (!items.length) return;
    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
    }).addTo(map);
    const coords = [];
    items.forEach((e, i) => {
      coords.push(e.coords);
      const icon = L.divIcon({
        className: "trip-pin " + e.type,
        html: String(i + 1),
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      L.marker(e.coords, { icon: icon })
        .bindPopup(`<strong>${i + 1}. ${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}<br>
          <a href="spot.html?id=${e.id}">See the analysis →</a>`)
        .addTo(map);
    });
    if (coords.length > 1) {
      L.polyline(coords, { color: "#2a2723", weight: 2, opacity: 0.55, dashArray: "4,7" }).addTo(map);
    }
    map.fitBounds(coords, { padding: [30, 30], maxZoom: 13 });
  });
}

/* ---- ACCOUNT (fake, local) ---- */
function renderAccount() {
  const root = document.getElementById("account-root");
  const p = WaveBaseAccount.getProfile();
  const saved = WaveBaseAccount.getSaved().map(byId).filter(Boolean);
  const trips = WaveBaseAccount.getTrips();

  function opts(list, val) {
    return list.map(o => `<option value="${o}" ${val === o ? "selected" : ""}>${o}</option>`).join("");
  }
  const levelOpts = ["beginner", "intermediate", "advanced"]
    .map(l => `<option value="${l}" ${p.level === l ? "selected" : ""}>${cap(l)}</option>`).join("");
  const boardOpts = opts(["Shortboard", "Longboard", "Funboard", "Fish", "Foamie", "Other"], p.boardType);
  const styleOpts = opts(["Solo", "Couple", "Friends", "Family"], p.travelStyle);
  const intentOpts = opts(["Pure surf", "Learn", "Progress", "Surf + chill"], p.tripIntent);
  const foundOpts = opts(["Friend / word of mouth", "Social media", "Search engine", "Surf forum / community", "Press / article", "Other"], p.howDidYouFindUs);

  const surfTypes = [
    { key: "surfer",     label: "Surfer"     },
    { key: "windsurfer", label: "Windsurfer" },
    { key: "kitesurfer", label: "Kitesurfer" },
    { key: "wingfoiler", label: "Wingfoiler" }
  ];
  const disciplines = [
    { key: "freeride",  label: "Freeride"  },
    { key: "wave",      label: "Wave"      },
    { key: "freestyle", label: "Freestyle" },
    { key: "slalom",    label: "Slalom"    }
  ];
  const showDiscipline = (p.surfType || []).some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");
  const cb = (name, items, selected) => items.map(it =>
    `<label class="cb"><input type="checkbox" name="${name}" value="${it.key}" ${selected.indexOf(it.key) !== -1 ? "checked" : ""}> ${it.label}</label>`
  ).join("");

  const savedHTML = saved.length
    ? `<div class="grid">${saved.map(cardHTML).join("")}</div>`
    : `<p class="muted">Nothing saved yet. Tap the heart on a spot or stay.</p>`;

  const tripsHTML = trips.length
    ? trips.map(t => {
        const items = t.spotIds.map(byId).filter(Boolean);
        const located = items.filter(e => e.coords);
        const list = items.length
          ? `<ol class="trip-items">${items.map((e, i) =>
              `<li><div class="trip-item-row" draggable="true" data-trip="${t.id}" data-idx="${i}" title="Drag to reorder">
                <span class="drag-grip" aria-hidden="true">⠿</span>
                <span class="trip-item-main"><a href="spot.html?id=${e.id}" draggable="false">${e.name}</a> <span class="muted">&middot; ${typeLabel(e.type)} &middot; ${e.town}</span></span>
                <span class="trip-item-ctrl">
                  <button class="tc-btn tc-del" data-remove data-trip="${t.id}" data-spot="${e.id}" aria-label="Remove from trip" title="Remove from trip">✕</button>
                </span>
              </div></li>`).join("")}</ol>`
          : `<p class="muted">Empty so far — add places from a detail page.</p>`;
        const mapDiv = located.length ? `<div class="trip-map" id="trip-map-${t.id}"></div>` : "";
        return `<div class="trip">
          <div class="trip-head"><h3>${t.name}</h3><button class="link-btn" data-del="${t.id}">remove</button></div>
          ${list}
          ${mapDiv}</div>`;
      }).join("")
    : `<p class="muted">No trips yet.</p>`;

  root.innerHTML = `
    <h1>My WaveBase</h1>
    <p class="muted lead-note">This is a fake account — everything is stored locally in your browser. There's no real login or server yet; that's phase 2.</p>

    <section class="acc-block">
      <h2>Profile</h2>
      <p class="muted form-note">The more you fill in, the better WaveBase can match spots and stays to you.</p>
      <div class="profile-form">
        <label>Name<input type="text" id="p-name" value="${p.name || ""}" placeholder="Your name"></label>
        <label>Email<input type="email" id="p-email" value="${p.email || ""}" placeholder="you@example.com"></label>
        <label>Birth year<input type="number" id="p-birthyear" value="${p.birthYear || ""}" placeholder="1995" min="1920" max="2020"></label>
        <label>Home country<input type="text" id="p-country" value="${p.homeCountry || ""}" placeholder="e.g. Belgium"></label>
        <div class="form-checkset form-wide" id="p-surftype-set">
          <span class="form-checkset-label">What do you do? <span class="muted">(pick all that apply)</span></span>
          <div class="form-checkset-options">${cb("surfType", surfTypes, p.surfType || [])}</div>
        </div>
        <div class="form-checkset form-wide ${showDiscipline ? "" : "hidden"}" id="p-discipline-set">
          <span class="form-checkset-label">Discipline <span class="muted">(for wind / kite / wing)</span></span>
          <div class="form-checkset-options">${cb("discipline", disciplines, p.discipline || [])}</div>
        </div>
        <label>Surf level<select id="p-level"><option value="">—</option>${levelOpts}</select></label>
        <label>Years surfing<input type="number" id="p-years" value="${p.yearsSurfing || ""}" placeholder="3" min="0" max="80"></label>
        <label>Board<select id="p-board"><option value="">—</option>${boardOpts}</select></label>
        <label>Travel style<select id="p-style"><option value="">—</option>${styleOpts}</select></label>
        <label>What you want from a trip<select id="p-intent"><option value="">—</option>${intentOpts}</select></label>
        <label class="form-wide">How did you find us?<select id="p-found"><option value="">—</option>${foundOpts}</select></label>
        <button class="btn" id="p-save">Save profile</button>
      </div>
    </section>

    <section class="acc-block">
      <h2>Saved places <span class="seccount">${saved.length}</span></h2>
      ${savedHTML}
    </section>

    <section class="acc-block">
      <div class="trip-section-head">
        <h2>My trips <span class="seccount">${trips.length}</span></h2>
        <button class="btn ghost" id="new-trip">+ New trip</button>
      </div>
      <p class="muted form-note">Drag locations to reorder them — each trip's map and its route line follow the order. Use ✕ to remove a stop.</p>
      ${tripsHTML}
    </section>`;

  const readChecks = name => Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(el => el.value);

  document.getElementById("p-save").addEventListener("click", () => {
    WaveBaseAccount.setProfile({
      name: document.getElementById("p-name").value,
      email: document.getElementById("p-email").value,
      birthYear: document.getElementById("p-birthyear").value,
      homeCountry: document.getElementById("p-country").value,
      level: document.getElementById("p-level").value,
      yearsSurfing: document.getElementById("p-years").value,
      boardType: document.getElementById("p-board").value,
      travelStyle: document.getElementById("p-style").value,
      tripIntent: document.getElementById("p-intent").value,
      surfType: readChecks("surfType"),
      discipline: readChecks("discipline"),
      howDidYouFindUs: document.getElementById("p-found").value
    });
    updateNav();
    alert("Profile saved.");
  });

  // Toggle discipline fieldset live when surfType selection changes
  document.querySelectorAll('input[name="surfType"]').forEach(cbEl => {
    cbEl.addEventListener("change", () => {
      const picked = readChecks("surfType");
      const show = picked.some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");
      document.getElementById("p-discipline-set").classList.toggle("hidden", !show);
    });
  });
  document.getElementById("new-trip").addEventListener("click", () => {
    const name = window.prompt("Name your new trip:");
    if (name) { WaveBaseAccount.addTrip(name); renderAccount(); }
  });
  root.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => { WaveBaseAccount.deleteTrip(b.dataset.del); renderAccount(); });
  });
  let dragSrc = null;
  root.querySelectorAll(".trip-item-row[draggable='true']").forEach(row => {
    row.addEventListener("dragstart", e => {
      dragSrc = { tripId: row.dataset.trip, fromIndex: parseInt(row.dataset.idx, 10) };
      row.classList.add("dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", row.dataset.idx); } catch (err) {}
      }
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      root.querySelectorAll(".trip-item-row.drag-over").forEach(x => x.classList.remove("drag-over"));
      dragSrc = null;
    });
    row.addEventListener("dragover", e => {
      if (!dragSrc || dragSrc.tripId !== row.dataset.trip) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      row.classList.add("drag-over");
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over");
    });
    row.addEventListener("drop", e => {
      e.preventDefault();
      row.classList.remove("drag-over");
      if (!dragSrc || dragSrc.tripId !== row.dataset.trip) return;
      const toIndex = parseInt(row.dataset.idx, 10);
      if (dragSrc.fromIndex !== toIndex) {
        WaveBaseAccount.reorderTrip(row.dataset.trip, dragSrc.fromIndex, toIndex);
        renderAccount();
      }
    });
  });
  root.querySelectorAll("[data-remove]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.removeFromTrip(b.dataset.trip, b.dataset.spot);
      renderAccount();
    });
  });
  if (root.querySelector(".grid")) wireCards(root);
  initTripMaps(trips);
}

/* ---- COMPARE ---- */
function compareKeyPoints(e) {
  if (e.type === "spot") {
    const c = e.condities || {};
    return [
      ["Wave type", c.golftype || "—"],
      ["Wave height", c.golfhoogte || "—"],
      ["Crowd", c.drukte ? crowdLabel(c.drukte.niveau) : "—"],
      ["Levels", e.levels.map(cap).join(", ")],
      ["Water", c.water || "—"]
    ];
  }
  if (e.type === "center") {
    const d = e.diensten || {};
    return [
      ["Lessons", d.lessen || "—"],
      ["Rental", d.rental || "—"],
      ["Gear brands", d.brands || "—"],
      ["Facilities", d.faciliteiten || "—"],
      ["Team & vibe", d.team || "—"]
    ];
  }
  const v = e.verblijf || {};
  return [
    ["Food", v.eten || "—"],
    ["Distance from surf spot", v.afstandSpot || "—"],
    ["Gear rental", v.verhuur || "—"],
    ["Lessons available?", v.lessen || "—"],
    ["Rating", v.rating || "—"],
    ["Chill or party", v.sfeer || "—"],
    ["Other activities", v.activiteiten || "—"]
  ];
}

function renderCompare() {
  const root = document.getElementById("compare-root");
  const items = WaveBaseAccount.getCompare().map(byId).filter(Boolean);
  if (!items.length) {
    root.innerHTML = `<h1>Compare</h1>
      <p class="muted">Nothing to compare yet. Tap the "⇄" button on a spot or stay, then come back here.</p>`;
    return;
  }
  const cols = items.map(e => {
    const pts = compareKeyPoints(e).map(([k, v]) =>
      v ? `<div class="cmp-row"><span class="cmp-k">${k}</span><span class="cmp-v">${v}</span></div>` : "").join("");
    return `<div class="cmp-col">
      <div class="thumb ${e.type}${e.photo ? " has-photo" : ""}"${thumbStyle(e)}>
        <span class="badge">${typeBadge(e.type)}</span>
        ${e.type === "stay" ? "" : sportIconsHTML(entrySports(e))}
      </div>
      <div class="cmp-body">
        <div class="place">${e.town}</div>
        <h3><a href="spot.html?id=${e.id}">${e.name}</a></h3>
        <p class="tag">${e.tagline}</p>
        ${pts}
        <button class="link-btn" data-uncompare="${e.id}">remove</button>
      </div>
    </div>`;
  }).join("");
  root.innerHTML = `
    <div class="compare-head">
      <h1>Compare <span class="seccount">${items.length}</span></h1>
      <button class="btn ghost" id="clear-compare">Clear all</button>
    </div>
    <div class="cmp-grid">${cols}</div>`;
  document.getElementById("clear-compare").addEventListener("click", () => {
    WaveBaseAccount.clearCompare(); updateNav(); renderCompare();
  });
  root.querySelectorAll("[data-uncompare]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.toggleCompare(b.dataset.uncompare);
      updateNav(); renderCompare();
    });
  });
}

/* ---- destinations mega-menu ---- */
function initDestinations() {
  if (typeof WAVEBASE_DESTINATIONS === "undefined") return;
  const nav = document.querySelector(".site-nav");
  const header = document.querySelector(".site-header");
  if (!nav || !header || document.getElementById("destinations-trigger")) return;

  const trigger = document.createElement("button");
  trigger.id = "destinations-trigger";
  trigger.className = "nav-destinations";
  trigger.type = "button";
  trigger.textContent = "Destinations";
  nav.prepend(trigger);

  const cols = WAVEBASE_DESTINATIONS.map(c => {
    const chips = c.countries.map(co => {
      const href = `index.html?country=${encodeURIComponent(co.name)}`;
      return co.status === "live"
        ? `<a class="dest-chip live" href="${href}">${co.flag} ${co.name}</a>`
        : `<a class="dest-chip soon" href="${href}">${co.flag} ${co.name}<span class="soon-tag">soon</span></a>`;
    }).join("");
    return `<div class="dest-continent"><h3>${c.continent}</h3><div class="dest-chips">${chips}</div></div>`;
  }).join("");

  const panel = document.createElement("div");
  panel.id = "destinations-menu";
  panel.className = "destinations-menu";
  panel.innerHTML = `<div class="wrap">
    <div class="dest-grid">${cols}</div>
    <p class="dest-note">WaveBase is rolling out worldwide — Morocco is live now, the rest are on the way.</p>
  </div>`;
  header.appendChild(panel);

  trigger.addEventListener("click", ev => {
    ev.stopPropagation();
    const open = panel.classList.toggle("open");
    trigger.classList.toggle("active", open);
  });
  panel.addEventListener("click", ev => ev.stopPropagation());
  document.addEventListener("click", () => {
    panel.classList.remove("open");
    trigger.classList.remove("active");
  });
}

/* ---- mobile bottom tab bar (Discover / Map / Compare / Me) ---- */
function initMobileTabbar() {
  if (document.querySelector(".mobile-tabbar")) return;

  const path = window.location.pathname;
  const route =
    /kaart\.html$/.test(path) ? "map" :
    /compare\.html$/.test(path) ? "compare" :
    /account\.html$/.test(path) ? "me" :
    "discover";

  const ico = {
    discover: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="16,8 13,14 8,16 11,10"/></svg>',
    map: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    compare: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    me: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };
  const tabs = [
    { route: "discover", href: "index.html", label: "Discover" },
    { route: "map", href: "kaart.html", label: "Map" },
    { route: "compare", href: "compare.html", label: "Compare" },
    { route: "me", href: "account.html", label: "Me" }
  ];

  const html = tabs.map(t =>
    `<a href="${t.href}" class="tab${t.route === route ? ' active' : ''}" data-tab="${t.route}" aria-label="${t.label}">${ico[t.route]}<span class="tab-label">${t.label}</span></a>`
  ).join("");

  const nav = document.createElement("nav");
  nav.className = "mobile-tabbar";
  nav.setAttribute("aria-label", "Main navigation");
  nav.innerHTML = html;
  document.body.appendChild(nav);

  // sync the compare count if items already exist
  const cmpLabel = nav.querySelector('a[data-tab="compare"] .tab-label');
  if (cmpLabel && typeof WaveBaseAccount !== "undefined") {
    const n = WaveBaseAccount.getCompare().length;
    if (n) cmpLabel.textContent = `Compare (${n})`;
  }
}

/* ---- router ---- */
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  initDestinations();
  initMobileTabbar();
  if (document.getElementById("results")) initIndex();
  if (document.getElementById("detail-root")) initSpot();
  if (document.getElementById("map")) initMap();
  if (document.getElementById("account-root")) renderAccount();
  if (document.getElementById("compare-root")) renderCompare();
});
