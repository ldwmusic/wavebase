/* ============================================================
   WaveBase — app.js
   ============================================================
   One script for the whole site. The router at the bottom of the
   file picks the right `init*()` to run based on which page DOM
   elements are present.

   Rough table of contents (for grep & sanity):

   - Top helpers                      cap, byId, distanceKm, fmtKm
   - Stats helpers                    getStatsFor, userSelectedMonth,
                                      seasonForMonth, periodColumnHTML
   - Cards & search                   cardHTML, runSearch, renderResultsSections
   - Monthly charts                   buildDualBarChart, buildSingleMetricChart,
                                      monthlyChartHTML, wireChartTooltips
   - Landing-page extras              COUNTRY_COORDS, ISO_TO_CONTINENT,
                                      renderRegionCards, renderMiniWorldMap,
                                      renderPeakingCarousel
   - Page initializers                initIndex, initSpot, initMap,
                                      renderAccount, renderCompare,
                                      initContinent
   - Header / nav / destinations      initDestinations, openDestinationsMenu,
                                      initMobileTabbar, wireHeaderSearch
   - Router                           DOMContentLoaded at the very bottom

   Data lives in `data.js` (WAVEBASE_DATA + WAVEBASE_DESTINATIONS +
   WAVEBASE_TOWNS + WAVEBASE_MONTHS). Account state lives in
   `account.js` (WaveBaseAccount, localStorage only).

   See README.md for the higher-level project map and edit recipes.
   ============================================================ */

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function byId(id) { return WAVEBASE_DATA.find(x => x.id === id); }

/* Gate any "this is account-bound data" interaction behind being
   signed in. Returns true → caller proceeds. Returns false → caller
   aborts (we already opened the login modal). Used by:
     - Save / ♡ on cards + spot pages
     - Add to compare on cards + spot pages
     - Add to trip on cards + spot pages
   "Surfed it" is still anon-friendly for now (Lode hasn't asked,
   and the surf log is currently passive UI). */
function requireAuth() {
  if (typeof WaveBaseAuth !== "undefined" && WaveBaseAuth.isLoggedIn()) return true;
  if (typeof WaveBaseAuthModal !== "undefined") {
    WaveBaseAuthModal.open({ mode: "login" });
  }
  return false;
}
// Back-compat alias — keep the old name working so we don't have
// to chase down every call site in this commit.
const requireAuthForSave = requireAuth;

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
/* Build a "Open in Google Maps" URL for a WaveBase entry.

   Strategy (most reliable first):
   1. Google Place ID → direct place page, deterministic.
   2. Plain ?q=NAME+TOWN+COUNTRY → Google's auto-redirector finds
      the best matching place and redirects to /place/... directly.
      Verified: a /maps?q=Banana+Point+Tamraght+Morocco URL resolves
      to the actual Banana Point business page (4.5 / 59 reviews)
      without showing a search list.

   The earlier /maps/search/?api=1&query= path was WORSE — it forces
   a search-results UI even when there's a single obvious match.
   The /place/<name>/@<lat>,<lng> path was also worse — when the
   name doesn't match Google's canonical name exactly, Google
   silently strips it and just shows the coords.

   3. Coord pin → last resort when no name is available. */
function googleMapsHref(entry) {
  // Backward-compat: callers that still pass a [lat, lng] array.
  if (Array.isArray(entry)) {
    return `https://www.google.com/maps?q=${entry[0]},${entry[1]}&z=15`;
  }
  if (!entry) return "https://www.google.com/maps";
  // (1) Deterministic — Place ID
  if (entry.googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.name || "")}&query_place_id=${encodeURIComponent(entry.googlePlaceId)}`;
  }
  // (2a) Explicit override via googleMapsQuery field:
  //      - string starting with "https://" → full Google Maps URL, use as-is
  //        (best when text queries are ambiguous and we have the canonical
  //        shortlink from the user, e.g. https://maps.app.goo.gl/xxx)
  //      - string (other) → use that as the ?q= search text verbatim
  //        (good when our entry's name differs from Google's canonical name,
  //        or when our name has an apostrophe that breaks the redirect)
  //      - false   → skip Google place search; use coord pin only
  //        (for spots Google has no business listing for, e.g. K17, Spiders)
  if (entry.googleMapsQuery === false) {
    if (Array.isArray(entry.coords)) {
      return `https://www.google.com/maps?q=${entry.coords[0]},${entry.coords[1]}&z=15`;
    }
  }
  if (typeof entry.googleMapsQuery === "string" && entry.googleMapsQuery) {
    if (/^https?:\/\//i.test(entry.googleMapsQuery)) {
      return entry.googleMapsQuery;
    }
    return `https://www.google.com/maps?q=${encodeURIComponent(entry.googleMapsQuery)}`;
  }
  // (2b) Default: plain ?q=NAME+TOWN+COUNTRY — Google auto-redirects
  //      to the matching place page. We use entryCountry() not
  //      entry.country so the older Morocco entries (which predate
  //      the country field and fall back to "Morocco") also get
  //      the country hint.
  if (entry.name) {
    const parts = [entry.name];
    if (entry.town) parts.push(entry.town);
    const country = (typeof entryCountry === "function") ? entryCountry(entry) : entry.country;
    if (country) parts.push(country);
    return `https://www.google.com/maps?q=${encodeURIComponent(parts.join(" "))}`;
  }
  // (3) Coord pin only
  if (Array.isArray(entry.coords)) {
    return `https://www.google.com/maps?q=${entry.coords[0]},${entry.coords[1]}&z=15`;
  }
  return "https://www.google.com/maps";
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

/* ---- nav: account label + compare count ---- */
function updateNav() {
  // The "Hi, ..." / "Login" label is owned by _renderAuthNav (in
  // account.js) — it reads the AUTH state, not the local profile.
  // We delegate here so that calling updateNav() from anywhere
  // (saveProfile, toggle compare, etc.) still keeps the nav in
  // sync with the server identity. Without this delegation, the
  // old local-profile path would override _renderAuthNav and leak
  // "Hi, Lode" into the logged-out view (the local profile still
  // has the name even after the auth token is wiped).
  if (typeof _renderAuthNav === "function") _renderAuthNav();

  // Compare count is anon-friendly (works without an account), so
  // it stays driven by localStorage regardless of auth state.
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
  wave: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="40 80 230 160" fill="currentColor"><path d="M0 0 C2.438 2.125 2.438 2.125 4 5 C4.081 8.971 3.469 10.478 0.812 13.438 C-2 15 -2 15 -5.188 14.875 C-8 14 -8 14 -10 12 C-10.674 5.037 -10.674 5.037 -8.375 1.5 C-5.257 -0.469 -3.623 -0.679 0 0 Z " fill="currentColor" transform="translate(124,120)"/><path d="M0 0 C4.639 -0.306 7.112 -0.233 10.965 2.496 C14.385 7.62 14.962 14.419 15.965 20.371 C16.701 20.494 17.437 20.616 18.195 20.742 C20.858 21.347 22.872 22.17 25.277 23.434 C25.975 23.796 26.672 24.158 27.391 24.531 C27.91 24.808 28.43 25.086 28.965 25.371 C28.635 26.691 28.305 28.011 27.965 29.371 C21.78 28.921 16.236 27.81 10.965 24.371 C8.902 21.121 8.902 21.121 7.965 18.371 C7.305 18.371 6.645 18.371 5.965 18.371 C4.457 20.34 4.457 20.34 2.84 22.871 C2.301 23.706 1.762 24.542 1.207 25.402 C0.797 26.052 0.387 26.702 -0.035 27.371 C0.713 27.655 1.46 27.938 2.23 28.23 C5.933 29.775 9.063 31.578 11.965 34.371 C14.04 39.62 12.236 45.057 10.965 50.371 C11.555 50.191 11.555 50.191 14.543 49.277 C16.1 48.808 17.657 48.34 19.215 47.871 C19.992 47.633 20.769 47.394 21.57 47.148 C22.324 46.923 23.079 46.697 23.855 46.465 C24.547 46.255 25.238 46.046 25.95 45.83 C27.965 45.371 27.965 45.371 31.965 45.371 C27.648 55.435 16.532 62.721 6.965 67.371 C3.574 68.086 3.574 68.086 0.965 68.371 C0.965 69.031 0.965 69.691 0.965 70.371 C1.79 70.206 1.79 70.206 5.965 69.371 C5.965 70.031 5.965 70.691 5.965 71.371 C-1.263 77.516 -8.958 78.63 -18.16 78.246 C-24.946 77.695 -31.041 76.127 -37.559 74.227 C-42.128 73.102 -46.366 72.976 -51.035 73.371 C-51.035 72.051 -51.035 70.731 -51.035 69.371 C-46.871 65.755 -42.482 64.415 -37.207 62.984 C-35.035 62.371 -35.035 62.371 -33.035 61.371 C-31.036 61.331 -29.035 61.328 -27.035 61.371 C-26.985 60.662 -26.935 59.953 -26.883 59.223 C-25.926 56.003 -24.424 54.563 -22.036 52.275 C-17.831 48.164 -14.747 44.73 -14.555 38.648 C-14.621 36.157 -14.785 33.686 -14.96 31.2 C-15.328 24.757 -14.172 21.323 -9.859 16.328 C-9.257 15.682 -8.655 15.036 -8.035 14.371 C-7.197 13.18 -6.38 11.974 -5.598 10.746 C-5.082 9.962 -4.566 9.179 -4.035 8.371 C-11.14 9.029 -14.612 11.273 -19.211 16.691 C-21.035 18.371 -21.035 18.371 -25.035 18.371 C-24.234 11.696 -20.071 7.533 -15.035 3.371 C-10.14 1.139 -5.288 0.647 0 0 Z M-6.035 34.371 C-6.038 34.928 -6.04 35.485 -6.043 36.059 C-6.488 44.849 -11.04 49.376 -17.035 55.371 C-17.035 56.031 -17.035 56.691 -17.035 57.371 C-10.327 56.193 -3.673 54.895 2.965 53.371 C3.955 48.751 4.945 44.131 5.965 39.371 C4.542 38.546 3.119 37.721 1.652 36.871 C0.852 36.407 0.051 35.943 -0.773 35.465 C-3.035 34.371 -3.035 34.371 -6.035 34.371 Z " fill="currentColor" transform="translate(105.03515625,133.62890625)"/><path d="M0 0 C2.324 2.016 2.324 2.016 4 4 C4 4.66 4 5.32 4 6 C3.371 5.893 2.742 5.786 2.094 5.676 C-3.948 4.83 -8.686 4.745 -14 8 C-19.096 12.874 -20.683 17.517 -21.312 24.438 C-20.751 30.839 -18.665 36.458 -14 41 C-7.569 45.584 -0.651 47.408 7 49 C7 49.66 7 50.32 7 51 C-15.929 51.968 -15.929 51.968 -24.938 43.812 C-29.988 38.119 -32.694 31.862 -32.332 24.207 C-31.593 19.294 -29.758 15.137 -27 11 C-32.721 15.173 -36.89 20.23 -41.062 25.875 C-41.583 26.579 -42.104 27.284 -42.641 28.009 C-44.784 30.927 -46.901 33.858 -48.973 36.828 C-54.881 45.041 -63.18 49.711 -73 52 C-73.99 52 -74.98 52 -76 52 C-74.496 48.176 -72.331 46.535 -69.062 44.125 C-62.007 38.542 -55.057 31.115 -51 23 C-51.66 23 -52.32 23 -53 23 C-52.133 18.479 -49.521 15.882 -46.438 12.625 C-45.894 12.046 -45.35 11.466 -44.79 10.87 C-32.318 -2.202 -17.232 -8.792 0 0 Z " fill="currentColor" transform="translate(192,156)"/><path d="M0 0 C0.66 0 1.32 0 2 0 C2.098 0.664 2.196 1.328 2.297 2.012 C3.218 7.451 4.126 10.868 8 15 C8 15.66 8 16.32 8 17 C4.578 15.534 2.235 14.006 0 11 C-1.742 3.484 -1.742 3.484 0 0 Z " fill="currentColor" transform="translate(153,188)"/></svg>',
  wind: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="60 80 200 160" fill="currentColor"><path d="M0 0 C10.511 2.867 16.916 15.142 22 24 C30.73 40.318 41 60.088 41 79 C34.85 78.384 29.382 76.593 23.562 74.562 C17.415 72.434 11.339 70.475 5 69 C3.467 52.26 1.971 35.521 0.812 18.75 C0.729 17.551 0.645 16.352 0.559 15.116 C0.22 10.063 -0.04 5.066 0 0 Z " fill="currentColor" transform="translate(164,86)"/><path d="M0 0 C2 2.125 2 2.125 3 5 C2.188 8.312 2.188 8.312 1 11 C-5.374 12.323 -5.374 12.323 -7.938 11 C-9.579 7.911 -9.373 5.424 -9 2 C-5.526 -0.316 -4.086 -0.596 0 0 Z " fill="currentColor" transform="translate(149,139)"/><path d="M0 0 C4.299 0.496 5.436 2.191 8.25 5.375 C10.25 7.25 10.25 7.25 12.25 8.375 C16.394 8.157 19.619 6.269 23.25 4.375 C27.079 3.099 28.58 3.891 32.387 5.141 C33.604 5.536 34.822 5.932 36.076 6.34 C37.363 6.768 38.65 7.197 39.938 7.625 C41.192 8.034 42.447 8.442 43.74 8.863 C49.965 10.902 56.142 13.009 62.25 15.375 C62.415 16.695 62.415 16.695 63.25 23.375 C56.221 27.019 49.087 30.216 41.75 33.188 C40.763 33.594 39.775 34.001 38.758 34.42 C31.507 37.375 31.507 37.375 29.25 37.375 C29.25 38.695 29.25 40.015 29.25 41.375 C41.978 38.471 54.563 35.272 67.072 31.523 C68.081 31.229 69.09 30.936 70.129 30.633 C71.022 30.366 71.914 30.099 72.834 29.825 C75.367 29.353 76.838 29.544 79.25 30.375 C79.119 35.632 77.134 38.547 73.695 42.273 C69.275 46.073 61.215 52.375 55.25 52.375 C55.25 53.035 55.25 53.695 55.25 54.375 C61.438 54.009 67.279 53.197 73.312 51.75 C80.377 50.151 86.368 50.081 93.25 52.375 C93.25 53.035 93.25 53.695 93.25 54.375 C92.367 54.34 91.484 54.305 90.574 54.27 C84.697 54.137 79.344 54.089 73.688 55.812 C63.375 58.935 54.948 58.565 44.702 55.865 C34.55 53.282 25.213 53.555 15.195 56.695 C6.358 58.735 -2.905 58.061 -11.395 55.047 C-18.783 52.939 -27.239 54.463 -34.75 55.375 C-34.75 54.715 -34.75 54.055 -34.75 53.375 C-33.979 53.193 -33.208 53.011 -32.414 52.824 C-31.411 52.573 -30.408 52.321 -29.375 52.062 C-28.377 51.819 -27.38 51.575 -26.352 51.324 C-23.75 50.375 -23.75 50.375 -21.75 47.375 C-18.672 47.23 -15.756 47.245 -12.688 47.375 C-3.037 47.607 5.843 46.422 15.25 44.375 C14.74 39.993 14.028 36.852 11.25 33.375 C8.881 31.995 6.677 30.844 4.188 29.75 C-2.502 26.747 -2.502 26.747 -4.75 23.375 C-6.172 16.405 -7.297 7.843 -3.75 1.375 C-2.75 0.375 -2.75 0.375 0 0 Z M20.062 11.875 C16.008 13.72 12.661 13.607 8.25 13.375 C7.671 16.529 7.504 19.238 8.25 22.375 C10.043 24.039 10.043 24.039 12.375 25.562 C18.896 29.889 20.739 36.275 23.25 43.375 C23.91 43.21 23.91 43.21 27.25 42.375 C26.92 31.815 26.59 21.255 26.25 10.375 C23.25 10.375 23.25 10.375 20.062 11.875 Z M5.25 11.375 C5.25 12.035 5.25 12.695 5.25 13.375 C5.91 13.375 6.57 13.375 7.25 13.375 C7.25 12.715 7.25 12.055 7.25 11.375 C6.59 11.375 5.93 11.375 5.25 11.375 Z " fill="currentColor" transform="translate(143.75,153.625)"/></svg>',
  kite: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="60 80 200 160" fill="currentColor"><path d="M0 0 C8.254 5.749 12.768 13.22 15 23 C16.159 31.613 14.175 39.671 9.023 46.695 C7.097 48.931 5.219 51.054 3 53 C2.34 53 1.68 53 1 53 C1.046 52.117 1.093 51.234 1.141 50.324 C1.483 38.952 -0.725 29.002 -8 20 C-16.293 11.492 -23.344 8.603 -35 7 C-32.644 1.572 -28.42 -0.871 -23.188 -3.312 C-14.739 -5.135 -7.585 -4.214 0 0 Z " fill="currentColor" transform="translate(215,90)"/><path d="M0 0 C3.375 1.125 3.375 1.125 5.375 3.312 C6.612 6.793 6.517 8.622 5.375 12.125 C3.105 14.647 1.738 15.072 -1.625 15.562 C-4.625 15.125 -4.625 15.125 -7 13.5 C-9.138 10.375 -9.308 8.843 -8.625 5.125 C-5.934 1.292 -4.739 0.163 0 0 Z " fill="currentColor" transform="translate(98.625,146.875)"/><path d="M0 0 C0.332 0.182 0.332 0.182 2.012 1.102 C5.896 3.152 8.565 3.416 13.012 3.039 C13.963 2.96 14.914 2.882 15.895 2.801 C18.603 2.569 21.307 2.313 24.012 2.039 C24.342 1.049 24.672 0.059 25.012 -0.961 C26.332 -0.961 27.652 -0.961 29.012 -0.961 C28.867 -0.703 28.867 -0.703 28.137 0.602 C26.724 3.663 25.887 6.789 25.012 10.039 C27.982 9.379 30.952 8.719 34.012 8.039 C34.012 8.699 34.012 9.359 34.012 10.039 C33.022 10.039 32.032 10.039 31.012 10.039 C30.795 10.622 30.579 11.204 30.355 11.805 C28.566 14.78 26.454 15.977 23.512 17.789 C22.532 18.403 21.552 19.016 20.543 19.648 C18.012 21.039 18.012 21.039 16.012 21.039 C16.012 21.699 16.012 22.359 16.012 23.039 C16.61 23.111 16.61 23.111 19.637 23.477 C27.598 25.198 34.956 30.758 41.199 35.809 C45.964 39.044 54.546 36.748 60.012 36.039 C60.342 37.029 60.672 38.019 61.012 39.039 C58.206 40.083 55.395 41.099 52.574 42.102 C51.791 42.396 51.008 42.691 50.201 42.994 C44.406 45.021 40.014 45.154 34.012 44.039 C32.658 43.847 31.304 43.659 29.949 43.477 C28.98 43.332 28.01 43.188 27.012 43.039 C27.342 41.719 27.672 40.399 28.012 39.039 C27.29 38.771 26.568 38.503 25.824 38.227 C23.012 37.039 23.012 37.039 20.734 35.496 C17.512 33.772 15.271 33.643 11.637 33.539 C4.24 33.081 -0.253 32.16 -5.488 26.602 C-16.233 13.396 -16.233 13.396 -16.676 6.039 C-15.862 2.489 -14.892 1.196 -11.988 -0.961 C-7.738 -2.378 -4.075 -1.969 0 0 Z M15.074 9.602 C9.574 11.518 4.68 10.919 -0.988 10.039 C-0.988 10.699 -0.988 11.359 -0.988 12.039 C0.29 12.245 1.569 12.452 2.887 12.664 C5.113 13.199 5.113 13.199 7.012 14.039 C8.262 17.102 8.262 17.102 9.012 20.039 C10.762 20.938 10.762 20.938 13.012 21.039 C15.371 19.605 15.371 19.605 17.762 17.602 C18.161 17.272 18.161 17.272 20.184 15.605 C20.787 15.089 21.39 14.572 22.012 14.039 C21.682 12.059 21.352 10.079 21.012 8.039 C18.657 8.039 17.256 8.722 15.074 9.602 Z " fill="currentColor" transform="translate(107.98828125,165.9609375)"/><path d="M0 0 C0 0.99 0 1.98 0 3 C-1.438 2.69 -2.875 2.377 -4.312 2.062 C-5.113 1.888 -5.914 1.714 -6.738 1.535 C-9 1 -9 1 -12 0 C-21.069 -0.764 -28.685 0.531 -37.355 3.109 C-42.615 4.395 -47.626 4.36 -53 4 C-53 3.34 -53 2.68 -53 2 C-52.068 1.83 -51.136 1.66 -50.176 1.484 C-43.702 0.254 -37.507 -1.072 -31.25 -3.188 C-20.1 -6.714 -10.45 -5.225 0 0 Z " fill="currentColor" transform="translate(207,213)"/><path d="M0 0 C0.547 0.072 0.547 0.072 3.312 0.438 C6.788 0.865 10.266 1.265 13.75 1.625 C14.201 1.673 14.201 1.673 16.484 1.914 C18.955 1.998 20.629 1.606 23 1 C25.165 0.907 27.333 0.87 29.5 0.875 C30.624 0.872 31.748 0.87 32.906 0.867 C35.472 0.977 37.563 1.247 40 2 C40 2.66 40 3.32 40 4 C10.457 8.348 10.457 8.348 0 2 C0 1.34 0 0.68 0 0 Z " fill="currentColor" transform="translate(103,210)"/><path d="M138 158 C155 135 170 115 195 91" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M162 158 C174 150 188 142 205 134" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  wing: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="60 80 200 160" fill="currentColor"><path d="M0 0 C4.724 3.699 9.207 7.592 13.234 12.043 C13.234 12.703 13.234 13.363 13.234 14.043 C13.894 14.043 14.554 14.043 15.234 14.043 C21.031 20.734 24.558 27.727 25.672 36.48 C24.666 44.669 21.192 51.213 15.297 56.918 C13.234 58.043 13.234 58.043 10.812 57.844 C7.743 56.89 6.858 55.877 4.922 53.355 C-1.068 46.108 -8.812 40.531 -18.016 38.23 C-20.607 38.054 -22.305 38.34 -24.766 39.043 C-26.766 38.043 -26.766 38.043 -27.766 35.043 C-29.832 34.094 -29.832 34.094 -32.328 33.355 C-32.741 33.23 -32.741 33.23 -34.832 32.594 C-35.47 32.412 -36.108 32.23 -36.766 32.043 C-37.213 32.742 -37.66 33.44 -38.121 34.16 C-38.423 34.615 -38.423 34.615 -39.953 36.918 C-40.545 37.823 -41.136 38.728 -41.746 39.66 C-44.024 42.347 -45.347 43.26 -48.766 44.043 C-51.441 43.582 -51.441 43.582 -54.078 42.668 C-54.52 42.52 -54.52 42.52 -56.754 41.77 C-57.418 41.53 -58.082 41.29 -58.766 41.043 C-58.766 41.703 -58.766 42.363 -58.766 43.043 C-57.817 43.187 -56.868 43.332 -55.891 43.48 C-54.859 43.996 -53.828 44.512 -52.766 45.043 C-52.273 46.863 -52.273 46.863 -52.016 49.105 C-51.306 53.751 -49.623 55.413 -46.016 58.355 C-40.328 63.021 -37.385 68.219 -34.766 75.043 C-34.766 75.703 -34.766 76.363 -34.766 77.043 C-34.097 76.91 -33.428 76.777 -32.738 76.641 C-23.766 74.991 -14.861 74.452 -5.766 74.043 C-5.106 75.363 -4.446 76.683 -3.766 78.043 C-14.488 84.111 -24.655 86.313 -36.766 88.043 C-37.426 95.303 -38.086 102.563 -38.766 110.043 C-41.742 111.035 -43.493 111.089 -46.578 110.98 C-50.775 110.932 -53.802 111.609 -57.766 113.043 C-63.754 114.391 -67.822 113.917 -73.512 111.75 C-78.646 110.139 -83.956 110.895 -89.203 111.605 C-92.766 112.043 -92.766 112.043 -94.766 111.043 C-94.766 110.383 -94.766 109.723 -94.766 109.043 C-87.894 107.224 -80.834 105.583 -73.957 108.051 C-70.278 109.194 -67.233 109.24 -63.391 109.168 C-62.145 109.15 -60.9 109.132 -59.617 109.113 C-59.147 109.102 -59.147 109.102 -56.766 109.043 C-56.601 108.383 -56.601 108.383 -55.766 105.043 C-54.776 105.043 -53.786 105.043 -52.766 105.043 C-52.766 105.703 -52.766 106.363 -52.766 107.043 C-50.126 107.043 -47.486 107.043 -44.766 107.043 C-44.766 100.773 -44.766 94.503 -44.766 88.043 C-45.756 88.373 -46.746 88.703 -47.766 89.043 C-51.532 89.275 -55.305 89.228 -59.078 89.23 C-60.111 89.243 -61.144 89.255 -62.209 89.268 C-67.453 89.278 -71.869 89.175 -76.766 87.043 C-76.516 85.168 -76.516 85.168 -75.766 83.043 C-72.366 80.755 -69.033 80.659 -65.016 80.418 C-64.43 80.381 -64.43 80.381 -61.469 80.191 C-60.577 80.142 -59.685 80.093 -58.766 80.043 C-57.445 71.751 -60.06 67.666 -64.852 61.055 C-67.732 56.522 -68.411 52.33 -68.766 47.043 C-68.846 46.129 -68.925 45.215 -69.008 44.273 C-69.202 40.381 -69.185 37.827 -67.328 34.355 C-63.392 32.34 -59.981 33.074 -55.766 34.043 C-54.858 34.414 -53.951 34.785 -53.016 35.168 C-49.968 36.353 -48.818 36.278 -45.766 35.043 C-41.97 32.515 -39.208 30.003 -38.18 25.449 C-37.924 18.448 -39.41 11.813 -44.156 6.48 C-47.336 3.668 -50.92 1.783 -54.766 0.043 C-54.625 -1.758 -54.625 -1.758 -53.766 -3.957 C-51.219 -5.625 -51.219 -5.625 -48.016 -7.145 C-46.969 -7.654 -45.922 -8.163 -44.844 -8.688 C-29.799 -14.893 -12.646 -8.949 0 0 Z M-32.766 3.043 C-32.479 3.891 -32.193 4.739 -31.898 5.613 C-30.768 9.036 -29.696 12.471 -28.641 15.918 C-28.287 17.07 -27.934 18.223 -27.57 19.41 C-27.305 20.279 -27.039 21.148 -26.766 22.043 C-18.902 19.86 -11.349 17.05 -3.766 14.043 C-6.167 8.886 -9.497 6.352 -14.766 4.293 C-20.664 2.447 -26.653 2.788 -32.766 3.043 Z M-52.766 64.043 C-52.106 68.663 -51.446 73.283 -50.766 78.043 C-48.126 78.043 -45.486 78.043 -42.766 78.043 C-43.304 73.603 -44.841 69.458 -47.766 66.043 C-48.591 65.713 -48.591 65.713 -52.766 64.043 Z " fill="currentColor" transform="translate(179.765625,104.95703125)"/><path d="M0 0 C0.887 0.412 1.774 0.825 2.688 1.25 C3.438 4.5 3.438 4.5 3.688 8.25 C2.062 10.688 2.062 10.688 -0.312 12.25 C-3.219 12.746 -4.615 12.683 -7.125 11.125 C-8.911 8.305 -8.846 6.515 -8.312 3.25 C-5.438 -0.132 -4.413 -0.999 0 0 Z " fill="currentColor" transform="translate(122.3125,123.75)"/><path d="M0 0 C4.748 1.79 8.529 1.396 13.438 0.438 C14.448 0.252 15.459 0.066 16.5 -0.125 C17.139 -0.269 17.779 -0.414 18.438 -0.562 C18.602 -0.067 18.602 -0.067 19.438 2.438 C11.476 5.606 5.963 5.295 -2.273 3.223 C-8.551 1.724 -13.409 1.951 -19.5 4 C-24.749 5.764 -29.17 5.39 -34.562 4.438 C-34.562 3.778 -34.562 3.118 -34.562 2.438 C-33.621 2.316 -32.68 2.195 -31.711 2.07 C-31.088 1.987 -31.088 1.987 -27.938 1.562 C-26.708 1.4 -25.478 1.238 -24.211 1.07 C-5.642 -2.15 -5.642 -2.15 0 0 Z " fill="currentColor" transform="translate(177.5625,213.5625)"/></svg>'
};

const SPORT_LABEL = { wave: "Surf", wind: "Windsurf", kite: "Kitesurf", wing: "Wingfoil", sup: "SUP", sail: "Sail" };

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

// Full month names for use in headings (WAVEBASE_MONTHS holds short
// labels for charts and tooltips — "Sep" rather than "September").
const WAVEBASE_MONTHS_FULL = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

/* Primary "what makes this spot good" metric for a spot+month combo.
   Used in two places:
   1. Card chip: "💨 18 kn avg" or "🌊 1.4 m avg" so a user filtering on
      sport+month can see the value without opening the spot page.
   2. Sort order in renderResultsSections: when the user picks a month,
      spots are sorted desc by their primary metric for that month —
      best windsurf-in-September shows up first, weakest last.
   Returns null when there's nothing useful to show (no month, no stats,
   not a spot, etc.). */
function primaryMetricForSpot(e, monthIdx, sportFilter, useDaily) {
  if (!e || e.type !== "spot" || !monthIdx) return null;
  const stats = getStatsFor(e);
  if (!stats) return null;
  const i = monthIdx - 1;

  // Which metric? Explicit sport filter wins; else fall back to the
  // spot's own primary sport (first in its sports array).
  let metricType;
  if (sportFilter === "wave") metricType = "wave";
  else if (sportFilter === "wind" || sportFilter === "kite" || sportFilter === "wing") metricType = "wind";
  else {
    const primary = entrySports(e)[0];
    metricType = (primary === "wave") ? "wave" : "wind";
  }

  if (metricType === "wave") {
    // No daily-peak data exists for waves yet — fall back to typical
    // (monthlyWaveM is itself a monthly mean). Phase 2: add wave-peak.
    const v = stats.monthlyWaveM ? stats.monthlyWaveM[i] : null;
    if (v == null) return null;
    return { type: "wave", icon: "🌊", value: v, label: `${v.toFixed(1)} m typical`, sortValue: v };
  } else {
    // Wind: prefer the daily peak when asked (better headline number
    // than the 24h mean — users care about the windiest stretch).
    const arr = useDaily ? (stats.monthlyDailyPeakKn || stats.monthlyWindKn)
                         : stats.monthlyWindKn;
    if (!arr) return null;
    const v = arr[i];
    if (v == null) return null;
    const suffix = (useDaily && stats.monthlyDailyPeakKn) ? "kn peak" : "kn avg";
    return { type: "wind", icon: "💨", value: v, label: `${Math.round(v)} ${suffix}`, sortValue: v };
  }
}

/* Top-5 highlight block. Sits between the smart heading and the town
   strip. Shows up to 5 spots from the current matches, sorted by their
   peak metric (daily-peak wind kn for wind sports, typical wave m for
   wave). Each card carries a metric chip so users see at a glance which
   spots have the strongest signal in their picked month — without having
   to open each one. Skipped when there are no matching spots. */
function topSpotsBlockHTML(matches, monthIdx, sportFilter) {
  if (!Array.isArray(matches)) return "";
  const spots = matches.filter(e => e.type === "spot");
  if (!spots.length) return "";
  // Score every spot by its primary peak metric, then take top 5.
  const scored = spots
    .map(e => ({ e, m: primaryMetricForSpot(e, monthIdx, sportFilter, true) }))
    .filter(x => x.m)
    .sort((a, b) => b.m.sortValue - a.m.sortValue)
    .slice(0, 5);
  if (!scored.length) return "";
  const subLabel = monthIdx
    ? `Sorted by daily-peak wind / typical waves in ${WAVEBASE_MONTHS_FULL[monthIdx]}.`
    : "Sorted by peak conditions.";
  const cards = scored.map(x => cardHTML(x.e, undefined, {
    showMetric: true,
    monthIdx,
    sportFilter,
    useDailyPeak: true
  })).join("");
  return `<section class="top-spots" aria-label="Top spots for this filter">
    <div class="top-spots-head">
      <h3>Top ${scored.length} ${scored.length === 1 ? "spot" : "spots"}</h3>
      <span class="top-spots-sub">${escHTML(subLabel)}</span>
    </div>
    <div class="top-spots-grid">${cards}</div>
  </section>`;
}

/* Smart heading for Discover results. Reads like Michiel suggested:
   "Best spots for windsurfing in September · East Crete, Greece"
   when both sport and month are picked. Falls back gracefully:
     sport+month → "Best spots for X in M · Country"
     sport only  → "Best spots for X · Country"
     month only  → "Country in M"
     neither     → "Country" */
function smartResultsHeading(country, sport, month) {
  const sportLabel = { wave: "wave surfing", wind: "windsurfing", kite: "kite surfing", wing: "wing foiling" };
  const mIdx = parseInt(month, 10);
  const mLabel = (mIdx >= 1 && mIdx <= 12) ? WAVEBASE_MONTHS_FULL[mIdx] : null;
  const loc = countryHeading(country);
  const hasSport = sport && sport !== "all" && sportLabel[sport];
  if (hasSport && mLabel) return `Best spots for ${sportLabel[sport]} in ${mLabel} <span class="heading-loc">· ${escHTML(loc)}</span>`;
  if (hasSport)           return `Best spots for ${sportLabel[sport]} <span class="heading-loc">· ${escHTML(loc)}</span>`;
  if (mLabel)             return `${escHTML(loc)} in ${mLabel}`;
  return escHTML(loc);
}

// What month should the panel highlight as "yours"?
// Priority: ?month= URL param → localStorage pref → today's month.
// localStorage lets the chosen month carry over from Discover to Compare,
// detail pages, etc. — without it, internal nav resets to today.
function userSelectedMonth() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parseInt(params.get("month"), 10);
  if (fromUrl >= 1 && fromUrl <= 12) return fromUrl;
  try {
    const stored = parseInt(localStorage.getItem("wavebase_month_pref"), 10);
    if (stored >= 1 && stored <= 12) return stored;
  } catch (e) { /* localStorage unavailable */ }
  return new Date().getMonth() + 1;
}
function setMonthPref(month) {
  try {
    const m = parseInt(month, 10);
    if (m >= 1 && m <= 12) localStorage.setItem("wavebase_month_pref", String(m));
    else localStorage.removeItem("wavebase_month_pref");
  } catch (e) { /* ignore */ }
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

// The "At a glance" block at the top of every spot detail page.
// Renders the top facts (wave, bottom, wind dir, crowd, locals) + period
// comparison + the monthly bar charts. Returns empty string when the
// entry has no stats (e.g. a stay — those don't render this block).
function statsPanelHTML(e) {
  const s = getStatsFor(e);
  if (!s) return "";

  const inherited = (e.type === "center" && e.linkedSpotId);
  const inheritedNote = inherited
    ? `<p class="stats-source">Conditions are for the beach this center sits on.</p>`
    : "";

  // Top "always" facts: wave character, wind direction, bottom, crowd, locals
  const topRows = [
    { label: "Wave",     main: s.waveType || "—",  note: "" },
    { label: "Bottom",   main: s.bottom   || "—",  note: "" },
    { label: "Wind dir", main: s.windDir  || "—",  note: "" },
    { label: "Crowd",
      main: `<span class="crowd-dots">${crowdDotsHTML(s.crowd)}</span>`,
      note: crowdLabelText(s.crowd) },
    { label: "Locals",
      main: s.localism || "No verified reports in recent reviews yet.",
      // The "inferred" warning used to sit in the right-hand note column,
      // which on iPhone crushed the Locals prose into 1-2 words per line.
      // It now renders as a single disclaimer at the bottom of the panel.
      note: "" }
  ];
  const localsDisclaimer = s.localism
    ? `<p class="stats-disclaimer">⚠ "Locals" is inferred from the spot's general character — not yet verified against recent reviews.</p>`
    : "";
  const topFacts = `<div class="stats-grid">${topRows.map(r =>
    `<div class="stats-row">
      <span class="stats-label">${r.label}</span>
      <span class="stats-main">${r.main}</span>
      <span class="stats-note">${r.note}</span>
    </div>`).join("")}</div>${localsDisclaimer}`;

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
    const fullMonth = WAVEBASE_MONTHS[monthNum] || m;
    const tipHTML = `<strong>${fullMonth}</strong>` +
      `<span class="bt-row"><span class="bt-swatch ${barA.colorClass}"></span>${barA.label}<b>${va == null ? "—" : va + unit}</b></span>` +
      `<span class="bt-row"><span class="bt-swatch ${barB.colorClass}"></span>${barB.label}<b>${vb == null ? "—" : vb + unit}</b></span>` +
      (period && period.name ? `<span class="bt-sub">${escHTML(period.name)}${inSeason ? "" : " · off-season"}</span>` : "") +
      `<span class="bt-hint">Click to pin for comparison</span>`;
    return `<div class="month-bar dual ${seasonClass}${isUser ? " is-user" : ""}" data-month="${monthNum}" data-tooltip="${escHTML(tipHTML)}">
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
    const fullMonth = WAVEBASE_MONTHS[monthNum] || m;
    const customTip = tooltipFor ? tooltipFor(monthNum, v, ov) : null;
    const baseTip = customTip
      ? `<strong>${fullMonth}</strong><span class="bt-sub">${escHTML(customTip)}</span>`
      : `<strong>${fullMonth}</strong>` +
        `<span class="bt-row"><span class="bt-swatch ${colorClass}"></span>${label || "Value"}<b>${v == null ? "—" : v + unit}</b></span>` +
        (period && period.name ? `<span class="bt-sub">${escHTML(period.name)}${inSeason ? "" : " · off-season"}</span>` : "");
    const tipHTML = baseTip + `<span class="bt-hint">Click to pin for comparison</span>`;
    const overlay = ovPct != null
      ? `<span class="month-bar-overlay" style="bottom: ${ovPct}%;"></span>` : "";
    return `<div class="month-bar ${colorClass} ${seasonClass}${isUser ? " is-user" : ""}" data-month="${monthNum}" data-tooltip="${escHTML(tipHTML)}">
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
  // Empty legend placeholder so single-metric charts line up vertically
  // with dual-metric charts (Wind + Temperature) that render a real legend.
  const legendSpacer = `<div class="chart-legend chart-legend-empty" aria-hidden="true">&nbsp;</div>`;
  return `<div class="single-chart">
    <h3>${label}${sublabel ? ` <span class="muted">— ${sublabel}</span>` : ""}</h3>
    ${legendSpacer}
    <div class="chart-body">
      ${yAxis}
      <div class="chart-plot">
        ${gridlines}
        <div class="month-bars">${bars}</div>
      </div>
    </div>
  </div>`;
}

// Floating popover that follows hover over a .month-bar[data-tooltip].
// Single global tooltip element reused across charts. Positioned above
// the bar, centered horizontally, with a downward-pointing arrow.
function wireChartTooltips(root) {
  if (!root) return;
  const bars = root.querySelectorAll(".month-bar[data-tooltip]");
  if (!bars.length) return;
  let tip = document.getElementById("bar-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "bar-tooltip";
    tip.className = "bar-tooltip";
    tip.hidden = true;
    document.body.appendChild(tip);
  }
  const show = bar => {
    tip.innerHTML = bar.dataset.tooltip || "";
    tip.hidden = false;
    const r = bar.getBoundingClientRect();
    // Position above the bar, centered horizontally; clamp inside viewport.
    const tr = tip.getBoundingClientRect();
    let left = window.scrollX + r.left + r.width / 2 - tr.width / 2;
    const top = window.scrollY + r.top - tr.height - 10;
    const minLeft = window.scrollX + 6;
    const maxLeft = window.scrollX + window.innerWidth - tr.width - 6;
    left = Math.max(minLeft, Math.min(maxLeft, left));
    tip.style.left = left + "px";
    tip.style.top  = top  + "px";
  };
  const hide = () => { tip.hidden = true; };
  bars.forEach(bar => {
    bar.addEventListener("mouseenter", () => show(bar));
    bar.addEventListener("mouseleave", hide);
    // Touch: tap shows briefly
    bar.addEventListener("touchstart", () => show(bar), { passive: true });
  });
  // Hide on scroll so the tooltip doesn't drift away from its anchor.
  window.addEventListener("scroll", hide, { passive: true });
}

/* Click-to-pin: tap a month-bar to pin that month across all three charts
   (wind/temp/wave). Pinned months show side-by-side in a compare strip
   below the charts. Max 3 pins; clicking a 4th drops the oldest (FIFO).
   Click a pinned bar (or the × on its card) to remove it. */
function wireMonthPinning(root, entry) {
  if (!root) return;
  const stats = getStatsFor(entry);
  if (!stats) return;

  let pinned = [];  // ordered array of month numbers (1-12)

  // Compare strip lives directly under the monthly-chart block.
  let strip = root.querySelector(".month-compare-strip");
  if (!strip) {
    strip = document.createElement("div");
    strip.className = "month-compare-strip";
    const chart = root.querySelector(".monthly-chart");
    if (chart && chart.parentNode) chart.parentNode.insertBefore(strip, chart.nextSibling);
  }

  // Each row in the scoreboard table: an icon + label + a function that
  // returns the cell value for a given month number. Only rows whose
  // underlying data actually exists on this spot are kept.
  function buildDimensions() {
    const dims = [];
    const fmt = (v, unit) => (v == null || isNaN(v)) ? "—" : `${v}${unit}`;
    dims.push({
      icon: "📅",
      label: "Season",
      get: (m) => {
        const p = findPeriodForMonth(stats.periods, m);
        return p && p.name ? escHTML(p.name) : "—";
      }
    });
    if (Array.isArray(stats.monthlyWindKn)) {
      dims.push({ icon: "💨", label: "Wind", get: m => fmt(stats.monthlyWindKn[m - 1], " kn") });
    }
    const gustArr = Array.isArray(stats.monthlyDailyPeakKn) ? stats.monthlyDailyPeakKn
                  : Array.isArray(stats.monthlyGustKn)      ? stats.monthlyGustKn : null;
    if (gustArr) {
      dims.push({ icon: "⚡", label: "Gust", get: m => fmt(gustArr[m - 1], " kn") });
    }
    if (Array.isArray(stats.monthlyWindProb)) {
      dims.push({
        icon: "📊", label: "Wind days", sub: "≥4 Bft",
        get: m => {
          const v = stats.monthlyWindProb[m - 1];
          return (v == null || isNaN(v)) ? "—" : `${Math.round(v * 100)}%`;
        }
      });
    }
    if (Array.isArray(stats.monthlyWaveM)) {
      dims.push({ icon: "🌊", label: "Wave", get: m => fmt(stats.monthlyWaveM[m - 1], " m") });
    }
    if (Array.isArray(stats.monthlySwellProb)) {
      dims.push({
        icon: "📊", label: "Swell days", sub: "≥1 m",
        get: m => {
          const v = stats.monthlySwellProb[m - 1];
          return (v == null || isNaN(v)) ? "—" : `${Math.round(v * 100)}%`;
        }
      });
    }
    if (Array.isArray(stats.monthlyWaterC)) {
      dims.push({ icon: "💧", label: "Water", get: m => fmt(stats.monthlyWaterC[m - 1], " °C") });
    }
    if (Array.isArray(stats.monthlyAirC)) {
      dims.push({ icon: "☀️", label: "Air", get: m => fmt(stats.monthlyAirC[m - 1], " °C") });
    }
    // Crowd: documented per-spot (not per-month), but we adjust for season —
    // an off-season month means the centers are closed and the spot is mostly
    // empty, so the "typical" crowd value doesn't apply.
    const crowdLabel = crowdLabelText(stats.crowd);
    if (crowdLabel && crowdLabel !== "—") {
      dims.push({
        icon: "👥", label: "Crowd",
        get: (m) => {
          const p = findPeriodForMonth(stats.periods, m);
          if (p && p.inSeason === false) return "Very quiet";
          return cap(crowdLabel);
        }
      });
    }
    return dims;
  }

  function syncBars() {
    root.querySelectorAll(".month-bar[data-month]").forEach(bar => {
      const m = parseInt(bar.dataset.month, 10);
      bar.classList.toggle("is-pinned", pinned.indexOf(m) !== -1);
    });
    // Toggle a body class so the "Click to pin" hint in the tooltip can
    // hide itself once at least one month is already pinned.
    document.body.classList.toggle("has-pinned-months", pinned.length > 0);
  }

  function renderStrip() {
    // Empty state — always visible so the user knows the feature exists.
    // Header + a friendly hint pointing back to the bar charts above.
    if (pinned.length === 0) {
      strip.innerHTML = `
        <div class="mcc-head-row">
          <span class="mcc-kicker">Compare months</span>
        </div>
        <div class="mcc-empty">
          <span class="mcc-empty-icon" aria-hidden="true">👆</span>
          <span class="mcc-empty-text">Click any month bar above to pin it here &mdash; compare 2 or more months side-by-side.</span>
        </div>
      `;
      strip.classList.add("is-visible");
      return;
    }
    const dims = buildDimensions();
    // Header row: empty corner cell + one column header per pinned month
    // with its short name, season name, and a × remove button.
    const headerCells = pinned.map(m => {
      const monthName = WAVEBASE_MONTHS[m] || "";
      const p = findPeriodForMonth(stats.periods, m);
      const seasonName = p && p.name ? escHTML(p.name) : "";
      return `
        <th class="sb-entry-header mcc-col-head">
          <button type="button" class="mcc-col-remove" data-remove="${m}" aria-label="Remove ${monthName}">&times;</button>
          <span class="sb-entry-name">${monthName}</span>
          ${seasonName ? `<div class="sb-entry-sub">${seasonName}</div>` : ""}
        </th>`;
    }).join("");

    // Body rows: dimension icon + label on the left, one cell per pinned month
    const bodyRows = dims.map(d => {
      const cells = pinned.map(m =>
        `<td class="sb-cell">${d.get(m)}</td>`
      ).join("");
      const subHTML = d.sub ? `<span class="mcc-dim-sub">${d.sub}</span>` : "";
      const iconHTML = d.icon ? `<span class="sb-dim-icon" aria-hidden="true">${d.icon}</span>` : "";
      return `
        <tr>
          <th class="sb-dim-cell">
            ${iconHTML}<span class="sb-dim-label">${d.label}</span>${subHTML}
          </th>
          ${cells}
        </tr>`;
    }).join("");

    strip.innerHTML = `
      <div class="mcc-head-row">
        <span class="mcc-kicker">Compare months</span>
        <button type="button" class="mcc-clear">Clear all</button>
      </div>
      <div class="sb-table-wrap mcc-table-wrap">
        <table class="sb-table mcc-table">
          <thead>
            <tr><th class="sb-dim-cell mcc-corner"></th>${headerCells}</tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `;
    strip.classList.add("is-visible");

    strip.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const m = parseInt(btn.dataset.remove, 10);
        pinned = pinned.filter(x => x !== m);
        syncBars();
        renderStrip();
      });
    });
    strip.querySelector(".mcc-clear").addEventListener("click", () => {
      pinned = [];
      syncBars();
      renderStrip();
    });
  }

  // Click anywhere in a month-bar = pin/unpin that month.
  root.addEventListener("click", (ev) => {
    const bar = ev.target && ev.target.closest && ev.target.closest(".month-bar[data-month]");
    if (!bar || !root.contains(bar)) return;
    const m = parseInt(bar.dataset.month, 10);
    if (isNaN(m)) return;
    const idx = pinned.indexOf(m);
    if (idx !== -1) {
      pinned.splice(idx, 1);
    } else {
      pinned.push(m);
      // No cap — only 12 months exist; the compare strip scrolls
      // horizontally when more than ~4 are pinned.
    }
    syncBars();
    renderStrip();
  });

  // Initial render so the empty-state hint ("Click any month bar above
  // to pin it here...") shows on first arrival.
  renderStrip();
}

function monthlyChartHTML(e) {
  const stats = getStatsFor(e);
  const userMonth = userSelectedMonth();
  const monthLabels = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  // Two side-by-side bar charts on the at-a-glance: wind (left) and
  // temperature (right). Each is dual-bar per month (avg + gust for wind,
  // air + water for temp). Wave-type spots also get a single-bar wave-
  // height chart in front (so primary = wave; then wind; then temp).
  if (stats && Array.isArray(stats.monthlyWaterC)) {
    const chartType = stats.chartType || (Array.isArray(stats.monthlyWindKn) ? "wind" : null);
    let waveChart = null;

    if (chartType === "wave" && Array.isArray(stats.monthlyWaveM)) {
      waveChart = buildSingleMetricChart(stats.monthlyWaveM, {
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

    // Wind chart (left): per-month dual bars — average wind + gust (we use
    // monthlyDailyPeakKn = typical daily-peak gust, which is the gust value
    // a surfer actually feels at peak afternoon — more session-relevant than
    // the 9-hour gust avg).
    const hasWind = Array.isArray(stats.monthlyWindKn);
    const gustsArr = Array.isArray(stats.monthlyDailyPeakKn)
      ? stats.monthlyDailyPeakKn
      : (Array.isArray(stats.monthlyGustKn) ? stats.monthlyGustKn : null);
    const windChart = (hasWind && gustsArr) ? buildDualBarChart({
      stats, userMonth, monthLabels,
      label: "Wind",
      sublabel: "kn per month — average vs typical daily-peak gust",
      unit: " kn", maxValue: 45, axisTicks: ["45 kn", "22 kn", "0"],
      barA: { arr: stats.monthlyWindKn, label: "Average", colorClass: "color-wind-avg" },
      barB: { arr: gustsArr,            label: "Gust",    colorClass: "color-wind-gust" }
    }) : null;

    // Temperature chart (right): per-month dual bars — air + water.
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

    // Compose: [wave][wind][temp], collapsing any null. Layout class adapts
    // to how many panes there are (split = 2 across, trio = 3 across,
    // single = full width).
    const parts = [waveChart, windChart, tempChart].filter(Boolean);
    const wrapClass = parts.length >= 3 ? "monthly-chart trio"
      : parts.length === 2 ? "monthly-chart split"
      : "monthly-chart single";
    return `<div class="${wrapClass}">
      <div class="chart-pair">${parts.join("")}</div>
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
  const maxKm = opts.maxKm != null ? opts.maxKm : 3;
  const limit = opts.limit != null ? opts.limit : 8;
  // excludeIds: a Set of entry IDs to skip — used to avoid duplicating
  // entries already surfaced in a sibling section (e.g. spot pages show
  // explicitly-linked centers in their own section, then "other centers
  // nearby" must skip those to avoid showing the same card twice).
  const excludeIds = opts.excludeIds instanceof Set ? opts.excludeIds : null;
  const passesExclude = (e) => !excludeIds || !excludeIds.has(e.id);
  let scored;
  if (!currentEntry.coords) {
    scored = WAVEBASE_DATA
      .filter(c => c.type === targetType && c.id !== currentEntry.id &&
                   c.country === entryCountry(currentEntry) && c.town === currentEntry.town &&
                   passesExclude(c))
      .map(c => ({ entry: c, dist: null }));
  } else {
    scored = WAVEBASE_DATA
      .filter(c => c.type === targetType && c.id !== currentEntry.id && c.coords && passesExclude(c))
      .map(c => ({ entry: c, dist: distanceKm(currentEntry.coords, c.coords) }))
      .filter(x => x.dist <= maxKm)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit);
  }
  if (!scored.length) return "";
  const label = scored.length === 1 ? labelSingular : labelPlural;
  const headerLoc = currentEntry.coords ? `nearby` : `at ${escHTML(currentEntry.town)}`;
  const viewPref = getViewPref();
  const gridClass = viewPref === "list" ? "grid list-view" : "grid";
  return `<section class="related-entries">
    <header class="related-head">
      <h2>${label} ${headerLoc}</h2>
      <span class="related-head-actions">${opts.headerAction || ""}${viewToggleHTML(viewPref)}</span>
    </header>
    ${intro ? `<p class="muted form-note">${intro}</p>` : ""}
    <div class="${gridClass}">${scored.map(x => cardHTML(x.entry, x.dist)).join("")}</div>
  </section>`;
}

// Section for a single explicitly-linked entry (used when a center should
// only ever surface ITS spot — not every nearby spot).
function linkedSpotSectionHTML(centerEntry) {
  if (!centerEntry.linkedSpotId) return "";
  const spot = byId(centerEntry.linkedSpotId);
  if (!spot) return "";
  const viewPref = getViewPref();
  const gridClass = viewPref === "list" ? "grid list-view" : "grid";
  return `<section class="related-entries">
    <header class="related-head">
      <h2>The spot this center sits on</h2>
      ${viewToggleHTML(viewPref)}
    </header>
    <p class="muted form-note">Where lessons and rentals happen.</p>
    <div class="${gridClass}">${cardHTML(spot, distanceKm(centerEntry.coords, spot.coords))}</div>
  </section>`;
}

// Reverse lookup: on a spot page, find the centers that explicitly point at
// THIS spot via their linkedSpotId. These are the clubs that DEFINE this
// launch — especially relevant in Belgium where surfcenter and spot are
// often the same thing (LDW, 2026-05-20). Rendered as a highlighted
// section above the proximity-based "Centers nearby" — distinct visual
// treatment so the reader sees this isn't just any nearby club but the
// one(s) running this exact stretch of water.
function linkedCentersSectionHTML(spotEntry) {
  const centers = WAVEBASE_DATA.filter(c =>
    c.type === "center" && c.linkedSpotId === spotEntry.id
  );
  if (!centers.length) return "";
  const viewPref = getViewPref();
  const gridClass = viewPref === "list" ? "grid list-view" : "grid";
  const label = centers.length === 1 ? "The surfclub at this spot" : "The surfclubs at this spot";
  const intro = centers.length === 1
    ? "This isn't a natural break with passing schools — the spot and the club below are the same place. The club runs the launch zone, the rentals, the daily vibe."
    : "These aren't passing schools — they each run this stretch of water as their home. The spot and the clubs below are the same place.";
  const cards = centers.map(c => {
    const dist = (c.coords && spotEntry.coords) ? distanceKm(c.coords, spotEntry.coords) : null;
    return cardHTML(c, dist);
  }).join("");
  return `<section class="related-entries linked-clubs">
    <header class="related-head">
      <h2>${label}</h2>
      ${viewToggleHTML(viewPref)}
    </header>
    <p class="muted form-note">${intro}</p>
    <div class="${gridClass}">${cards}</div>
  </section>`;
}

// One-page view-toggle wireup: switches the .list-view class on every
// related-entries grid at once + persists the preference.
function wireDetailViewToggles(container) {
  container.querySelectorAll(".related-entries .view-toggle .view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      setViewPref(view);
      container.querySelectorAll(".related-entries .grid").forEach(g => {
        g.classList.toggle("list-view", view === "list");
      });
      container.querySelectorAll(".related-entries .view-toggle .view-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.view === view);
      });
    });
  });
}

// "More in [country]" — a wider net than the proximity-based "Nearby"
// section. Shows up to 6 other entries from the same country, mixing
// types so the user gets a sense of what else WaveBase has there.
function moreInCountryHTML(currentEntry) {
  const country = entryCountry(currentEntry);
  if (!country) return "";
  const pool = WAVEBASE_DATA.filter(c =>
    entryCountry(c) === country && c.id !== currentEntry.id
  );
  if (!pool.length) return "";
  // Mix types: try to surface a balance of spots / centers / stays
  const byType = { spot: [], center: [], stay: [] };
  pool.forEach(p => { if (byType[p.type]) byType[p.type].push(p); });
  // Round-robin pick to get a mix
  const picks = [];
  while (picks.length < 6 && (byType.spot.length || byType.center.length || byType.stay.length)) {
    for (const t of ["spot", "center", "stay"]) {
      if (byType[t].length && picks.length < 6) picks.push(byType[t].shift());
    }
  }
  if (!picks.length) return "";
  return `<section class="more-in-country">
    <header class="more-in-country-head">
      <h2>More in ${escHTML(country)}</h2>
      <a class="more-in-country-all" href="index.html?country=${encodeURIComponent(country)}">See all &rarr;</a>
    </header>
    <div class="grid list-view">${picks.map(p => cardHTML(p)).join("")}</div>
  </section>`;
}

function relatedSectionsForDetail(e) {
  if (e.type === "spot") {
    // Two-tier center surfacing:
    // 1. Centers that EXPLICITLY link to this spot via linkedSpotId — the
    //    clubs that DEFINE this launch. Especially relevant in Belgium where
    //    center and spot are the same thing.
    // 2. Other centers nearby (≤1km), EXCLUDING the linked ones (no dupes).
    const linkedIds = new Set(
      WAVEBASE_DATA
        .filter(c => c.type === "center" && c.linkedSpotId === e.id)
        .map(c => c.id)
    );
    return linkedCentersSectionHTML(e) +
      nearbyEntriesHTML(e, "center", "Other centers", "Other center",
        "Other surfschools within walking distance.",
        { maxKm: 1, limit: 8, excludeIds: linkedIds }) +
      nearbyEntriesHTML(e, "stay", "Stays", "Stay",
        "Places to base yourself within easy reach.", { maxKm: 3, limit: 8 });
  }
  if (e.type === "stay") {
    return nearbyEntriesHTML(e, "center", "Centers", "Center",
      "Where to take lessons or rent gear nearby.", { maxKm: 3, limit: 8 }) +
      nearbyEntriesHTML(e, "spot", "Spots", "Spot",
        "The breaks and beaches within easy reach.",
        { maxKm: 3, limit: 8,
          headerAction: `<a class="exp-launch-btn" href="explorer.html?base=${e.id}">Explore spots from here →</a>` });
  }
  if (e.type === "center") {
    // Center pages: ONLY the spot the center sits on — never other nearby
    // spots, even if they're close. Per LDW: the center belongs to its beach.
    return linkedSpotSectionHTML(e) +
      nearbyEntriesHTML(e, "stay", "Stays", "Stay",
        "Places to base yourself within easy reach.", { maxKm: 3, limit: 8 });
  }
  return "";
}

// Pick the period (Peak / High / Shoulder / Off / etc.) that contains a
// given month. Returns { name, klass } where klass is a normalised CSS hook.
function seasonForMonth(stats, monthNum) {
  if (!stats || !Array.isArray(stats.periods) || !monthNum) return null;
  const p = stats.periods.find(pp => Array.isArray(pp.months) && pp.months.includes(monthNum));
  if (!p) return null;
  const lower = (p.name || "").toLowerCase();
  let klass = "neutral";
  if (lower.includes("peak"))          klass = "peak";
  else if (lower.includes("high"))     klass = "high";
  else if (lower.includes("shoulder") || lower.includes("low")) klass = "shoulder";
  else if (lower.includes("summer") && p.inSeason !== false) klass = "shoulder";
  else if (lower.includes("storm"))    klass = "peak";
  else if (lower.includes("off") || p.inSeason === false) klass = "off";
  return { name: p.name, klass };
}

/* ---- card ---- */
function cardHTML(e, distKm, opts) {
  // opts: { showMetric, monthIdx, sportFilter, useDailyPeak }
  // Used to inject a wind/wave metric chip on the card. Off by default
  // so the standard grid stays clean — only the "Top spots" highlight
  // block at the top of results opts in.
  const o = opts || {};
  const pills = e.levels.map(l => `<span class="pill">${cap(l)}</span>`).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);
  const inAnyTrip = WaveBaseAccount.getTrips().some(t => Array.isArray(t.spotIds) && t.spotIds.includes(e.id));
  const distHint = (distKm != null && isFinite(distKm))
    ? ` <span class="muted">· ${fmtKm(distKm)} away</span>` : "";
  // Season tag based on the user-selected month (Peak / High / Shoulder /
  // Off — pulled from each spot's own `periods`). Skipped for stays.
  let seasonChip = "";
  if (e.type !== "stay") {
    const season = seasonForMonth(getStatsFor(e), userSelectedMonth());
    if (season) seasonChip = `<span class="season-chip season-${season.klass}">${escHTML(season.name)}</span>`;
  }
  // Metric chip — opt-in. The "Top spots" block uses it; the regular
  // section grid below does not (kept clean per LDW feedback).
  let metricChip = "";
  if (o.showMetric) {
    const metric = primaryMetricForSpot(e, o.monthIdx, o.sportFilter, !!o.useDailyPeak);
    if (metric) {
      const mFull = WAVEBASE_MONTHS_FULL[o.monthIdx] || "";
      const tip = metric.type === "wave"
        ? `Typical wave height in ${mFull}`
        : (o.useDailyPeak ? `Daily peak wind in ${mFull}` : `Average wind in ${mFull}`);
      metricChip = `<span class="metric-chip metric-${metric.type}" title="${escHTML(tip)}">${metric.icon} ${escHTML(metric.label)}</span>`;
    }
  }
  // Price line on cards — ONLY for stays. Centers get their pricing
  // shown on the detail page instead (lessons + rentals from €X). Stays
  // get tier chip + cheapest nightly rate.
  let priceLine = "";
  if (e.type === "stay" && e.prices && e.prices.tier) {
    const meta = tierMeta(e.prices.tier);
    const priceVal = priceDisplayShort(e);
    priceLine = `<div class="card-price">
      <span class="tier-chip tier-${e.prices.tier}" title="${meta ? meta.blurb : ""}">${meta ? meta.icon : ""} ${meta ? meta.label : e.prices.tier}</span>
      ${priceVal ? `<span class="card-price-val">${priceVal}</span>` : ""}
    </div>`;
  }
  return `
  <article class="card" data-href="${spotHref(e.id)}">
    <div class="thumb ${e.type}${e.photo ? " has-photo" : ""}"${thumbStyle(e)}>
      <span class="badge">${typeBadge(e.type)}</span>
      ${seasonChip}
      ${e.type === "stay" ? "" : sportIconsHTML(entrySports(e))}
      <button class="trip-btn ${inAnyTrip ? "on" : ""}" data-trip-add="${e.id}" aria-label="Add to a trip" title="${inAnyTrip ? "In a trip — click to add to another" : "Add to a trip"}">${inAnyTrip ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6"/></svg>' : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'}</button>
      <button class="compare-btn ${comparing ? "on" : ""}" data-compare="${e.id}" aria-label="Compare" title="${comparing ? "In your compare list" : "Add to compare"}">⇄</button>
      <button class="save-btn ${saved ? "on" : ""}" data-save="${e.id}" aria-label="Save" title="${saved ? "Saved" : "Save this place"}">${saved ? "♥" : "♡"}</button>
    </div>
    <div class="body">
      <div class="place">${e.town}${distHint}</div>
      <h3>${e.name}</h3>
      <p class="tag">${e.tagline}</p>
      ${metricChip ? `<div class="metric-row">${metricChip}</div>` : ""}
      <div class="meta">${pills}</div>
      ${priceLine}
    </div>
  </article>`;
}

// Floating mini-popover anchored under a card's "+" button. Lists trips
// (with ✓ for ones already containing this entry) + a "New trip…" option
// at the bottom. Auto-closes on next outside click. Rendered into body
// so card overflow doesn't clip it.
function openCardTripPopover(btn) {
  closeCardTripPopover();
  const entryId = btn.dataset.tripAdd;
  const trips = WaveBaseAccount.getTrips();
  const inSet = new Set(trips
    .filter(t => Array.isArray(t.spotIds) && t.spotIds.includes(entryId))
    .map(t => t.id));
  const items = trips.map(t => {
    const isIn = inSet.has(t.id);
    return `<li><button type="button" class="trip-pop-item${isIn ? " is-in" : ""}"
      data-pop-trip="${t.id}">${isIn ? "✓ " : ""}${escHTML(t.name)}</button></li>`;
  }).join("");
  const newItem = `<li><button type="button" class="trip-pop-item trip-pop-new"
    data-pop-trip="__new">＋ New trip…</button></li>`;
  const wrapper = document.createElement("div");
  wrapper.className = "trip-popover";
  wrapper.innerHTML = `<ul class="trip-pop-list">${items}${newItem}</ul>`;
  document.body.appendChild(wrapper);

  // Position under the button, clamped to the viewport.
  const r = btn.getBoundingClientRect();
  const top = window.scrollY + r.bottom + 6;
  let left = window.scrollX + r.left;
  document.body.appendChild(wrapper); // already there, but ensure
  wrapper.style.top = `${top}px`;
  wrapper.style.left = `${left}px`;
  // After insert, clamp right edge to viewport
  requestAnimationFrame(() => {
    const w = wrapper.getBoundingClientRect();
    if (w.right > window.innerWidth - 8) {
      left = window.scrollX + window.innerWidth - w.width - 8;
      wrapper.style.left = `${left}px`;
    }
  });

  wrapper.querySelectorAll(".trip-pop-item").forEach(item => {
    item.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const tid = item.dataset.popTrip;
      if (tid === "__new") {
        const name = window.prompt("Name your new trip:", "My trip");
        if (!name) { closeCardTripPopover(); return; }
        const t = WaveBaseAccount.addTrip(name);
        WaveBaseAccount.addToTrip(t.id, entryId);
      } else {
        WaveBaseAccount.addToTrip(tid, entryId);
      }
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6"/></svg>';
      btn.classList.add("on");
      btn.title = "In a trip — click to add to another";
      updateNav();
      closeCardTripPopover();
    });
  });

  // Close on next outside click
  setTimeout(() => {
    document.addEventListener("click", closeCardTripPopover, { once: true });
  }, 0);
}
function closeCardTripPopover() {
  const p = document.querySelector(".trip-popover");
  if (p) p.remove();
}

// Attach interaction handlers to every .card inside `container`:
// - whole-card click → navigate to its detail page
// - save/compare/trip-add buttons → call account helpers (don't navigate)
// Re-runs are safe; this is the standard wiring after any HTML re-render
// that contains cards (Discover results, related sections, account saved
// places, etc.).
function wireCards(container) {
  container.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", ev => {
      if (ev.target.closest(".save-btn") || ev.target.closest(".compare-btn") ||
          ev.target.closest(".trip-btn") || ev.target.closest(".trip-popover")) return;
      window.location.href = card.dataset.href;
    });
  });
  container.querySelectorAll(".trip-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      if (!requireAuth()) return;
      openCardTripPopover(btn);
    });
  });
  container.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      if (!requireAuthForSave()) return;
      const on = WaveBaseAccount.toggleSave(btn.dataset.save);
      btn.classList.toggle("on", on);
      btn.textContent = on ? "♥" : "♡";
      btn.title = on ? "Saved" : "Save this place";
    });
  });
  container.querySelectorAll(".compare-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      if (!requireAuth()) return;
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
// Falls back to ["wave"] when the entry has no sport tags at all
// (missing field OR empty array). Pre-API-migration the field was
// undefined for surf-only stays, so `|| ["wave"]` was enough; the
// API now stores `[]` instead of leaving it absent, and `[] || x`
// returns `[]` in JS (truthy). The length check below handles both
// cases. (Bug surfaced on Morocco stays which were invisible to
// every sport filter — LDW May 2026.)
function entrySports(e)  { return (e.sports && e.sports.length) ? e.sports : ["wave"]; }

/* ============================================================
   Price tiers + currency
   ============================================================
   Each stay/center carries a `prices` object. The `tier` is editorial
   and country-relative: a "comfortable" stay in Morocco may cost €40,
   in France €120 — same EXPERIENCE category, different absolute price.
   The filter on Discover and the display labels use the tier; absolute
   numbers (always sourced in EUR) are converted on-the-fly to whatever
   currency the user prefers. */

const PRICE_TIERS = ["budget", "comfortable", "premium", "luxury"];
// Tiers are RELATIVE to local-market prices, not global. "Comfortable" in
// Morocco (e.g. €40 private room) ≠ "Comfortable" in Belgium (e.g. €120).
// Always make the regional nature explicit on screen, not just in tooltips.
const TIER_META = {
  "budget":      { icon: "🎒", label: "Budget",      blurb: "Hostels, dorms, bare bones — cheapest end RELATIVE to this country's prices." },
  "comfortable": { icon: "🏠", label: "Comfortable", blurb: "Private room, decent kit — surf-camp standard RELATIVE to this country's prices." },
  "premium":     { icon: "✨", label: "Premium",     blurb: "Boutique, pool, breakfast — high-end RELATIVE to this country's prices." },
  "luxury":      { icon: "🌟", label: "Luxury",      blurb: "Spa, gourmet, private service — top of this country's market." }
};
function tierMeta(t) { return TIER_META[t] || null; }
function entryTier(e) {
  return (e.prices && e.prices.tier) || null;
}
function tierRank(t) {
  const i = PRICE_TIERS.indexOf(t);
  return i === -1 ? 99 : i;
}

/* Price-level scale — the right half of a stay's split pricing panel.
   A 4-step scale (Budget → Luxury), a pictogram per tier, this stay's
   tier highlighted + a caret, so it reads as a position on the scale. */
function tierDegreeHTML(t) {
  const meta = tierMeta(t);
  if (!meta) return "";
  const active = PRICE_TIERS.indexOf(t);
  const steps = PRICE_TIERS.map((k, i) =>
    `<span class="tier-deg-step tier-${k}${i === active ? " on" : ""}">
      <span class="tier-deg-ico" aria-hidden="true">${TIER_META[k].icon}</span>
      <span class="tier-deg-lbl">${escHTML(TIER_META[k].label)}</span>
    </span>`
  ).join("");
  return `<div class="price-panel-side price-panel-level">
    <div class="tier-degree-head">
      <span class="tier-degree-title">Price level</span>
      <span class="tier-degree-rel">📍 relative to local prices</span>
    </div>
    <div class="tier-deg-bar">${steps}</div>
    <p class="tier-degree-blurb">${escHTML(meta.blurb)}</p>
  </div>`;
}

/* Currency. EUR is the storage baseline; rates updated quarterly.
   Auto-detect from navigator.language on first visit, allow user to
   override in the My-WaveBase profile. Persisted in localStorage. */
const CURRENCY_RATES = {
  EUR: { code: "EUR", symbol: "€",  rate: 1.00,  decimals: 0 },
  USD: { code: "USD", symbol: "$",  rate: 1.08,  decimals: 0 },
  GBP: { code: "GBP", symbol: "£",  rate: 0.85,  decimals: 0 },
  CHF: { code: "CHF", symbol: "CHF",rate: 0.96,  decimals: 0 },
  AUD: { code: "AUD", symbol: "A$", rate: 1.65,  decimals: 0 },
  MAD: { code: "MAD", symbol: "DH", rate: 10.85, decimals: 0 }
};
const CURRENCY_RATES_UPDATED = "2026-05";

function defaultCurrencyFromLocale() {
  // Map common browser locales → reasonable default currency.
  const loc = (navigator.language || "en-US").toLowerCase();
  if (loc.startsWith("en-us") || loc.endsWith("-us")) return "USD";
  if (loc.startsWith("en-gb") || loc.startsWith("cy") || loc.endsWith("-gb")) return "GBP";
  if (loc.startsWith("de-ch") || loc.startsWith("fr-ch") || loc.startsWith("it-ch")) return "CHF";
  if (loc.startsWith("en-au") || loc.endsWith("-au")) return "AUD";
  if (loc.startsWith("ar-ma") || loc.endsWith("-ma")) return "MAD";
  return "EUR"; // Belgium / NL / DE / FR / IT / ES / PT / IE / etc.
}
function getCurrencyPref() {
  // Priority: profile.currency → localStorage → locale default
  if (typeof WaveBaseAccount !== "undefined") {
    const p = WaveBaseAccount.getProfile();
    if (p && p.currency && CURRENCY_RATES[p.currency]) return p.currency;
  }
  try {
    const ls = localStorage.getItem("wavebase_currency");
    if (ls && CURRENCY_RATES[ls]) return ls;
  } catch (e) { /* ignore */ }
  const d = defaultCurrencyFromLocale();
  try { localStorage.setItem("wavebase_currency", d); } catch (e) {}
  return d;
}
function setCurrencyPref(code) {
  if (!CURRENCY_RATES[code]) return;
  try { localStorage.setItem("wavebase_currency", code); } catch (e) {}
}
function fmtCurrency(eurAmount, opts) {
  if (eurAmount == null || isNaN(eurAmount)) return "—";
  opts = opts || {};
  const code = opts.code || getCurrencyPref();
  const cur = CURRENCY_RATES[code] || CURRENCY_RATES.EUR;
  const converted = eurAmount * cur.rate;
  const rounded = converted.toFixed(cur.decimals);
  // Symbol-before-number for most, except CHF which usually trails the number.
  return code === "CHF" ? `${rounded} ${cur.symbol}` : `${cur.symbol}${rounded}`;
}
function fmtPriceRange(fromEUR, toEUR) {
  if (fromEUR == null && toEUR == null) return "—";
  if (toEUR == null || fromEUR === toEUR) return fmtCurrency(fromEUR);
  return `${fmtCurrency(fromEUR)}–${fmtCurrency(toEUR)}`;
}
function priceForMonth(entry, monthNum) {
  const p = entry && entry.prices;
  if (!p) return null;
  if (Array.isArray(p.monthlyEUR) && monthNum >= 1 && monthNum <= 12) {
    const v = p.monthlyEUR[monthNum - 1];
    if (v != null && !isNaN(v)) return v;
  }
  // Fall back to range midpoint
  if (p.fromEUR != null && p.toEUR != null) return (p.fromEUR + p.toEUR) / 2;
  return p.fromEUR != null ? p.fromEUR : null;
}

/* Compact price label for the card. Honestly reflects what we have:
   - stay/center with a range → "from €X" or "€X–€Y"
   - center with a group-lesson rate → "from €X / lesson"
   - no public rate published → "By enquiry"
   Always EUR baseline, converted to the user's currency at display time. */
function priceDisplayShort(entry) {
  const p = entry && entry.prices;
  if (!p) return "";
  // Centers prefer a per-lesson rate when available
  if (entry.type === "center") {
    if (p.groupLessonEUR != null) {
      return `from ${fmtCurrency(p.groupLessonEUR)} / lesson`;
    }
    if (p.rentalDayEUR != null) {
      return `from ${fmtCurrency(p.rentalDayEUR)} / day rental`;
    }
    return `By enquiry`;
  }
  // Stays: range when we have both bounds, "from" when only low, else by enquiry.
  // Package-based pricing (full-board surf-camp deals) shows "from €X / package"
  // so users don't read the number as a nightly rate.
  const unit = (p.unit || "").toLowerCase();
  const isPackage = unit.includes("package") || unit.includes("week");
  if (p.fromEUR != null && p.toEUR != null && !isPackage) {
    return `${fmtCurrency(p.fromEUR)}–${fmtCurrency(p.toEUR)}`;
  }
  if (p.fromEUR != null) {
    return isPackage ? `from ${fmtCurrency(p.fromEUR)} / package` : `from ${fmtCurrency(p.fromEUR)}`;
  }
  return `By enquiry`;
}

/* HTML-escape user-supplied strings before injecting into innerHTML */
function escHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* Free-text matcher — checks name, town, country, tagline, summary,
   story and layer titles. Exact substring wins (cheap); if that fails,
   falls back to a per-word fuzzy compare using Levenshtein distance so
   typos still match ("kremeenos" → "kouremenos", "tagazout" →
   "taghazout", etc.). */
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
  if (haystack.includes(ql)) return true;
  // Spelling tolerance: split the query into words ≥3 chars and check
  // each against every haystack word ≥3 chars within an edit-distance
  // budget proportional to length (≤4 → 1 typo, ≤7 → 2, else 3). A
  // single tolerated query word is enough to match.
  const qWords = ql.split(/\s+/).filter(w => w.length >= 3);
  if (!qWords.length) return false;
  const hayWords = haystack.split(/[^a-zà-ÿ0-9]+/i).filter(w => w.length >= 3);
  for (const qw of qWords) {
    const budget = qw.length <= 4 ? 1 : qw.length <= 7 ? 2 : 3;
    for (const hw of hayWords) {
      // Length-prefilter: words too different in length can't match.
      if (Math.abs(hw.length - qw.length) > budget) continue;
      if (levenshtein(qw, hw) <= budget) return true;
    }
  }
  return false;
}
// Render the live suggestions dropdown under the home searchbar. Pure
// JS, no full page render — keeps iOS focus + keyboard alive while the
// user types. Click a suggestion (or Enter) to navigate to its detail.
function updateSearchSuggestions(rawQ) {
  const list = document.getElementById("search-suggestions");
  if (!list) return;
  const q = String(rawQ || "").trim();
  if (!q) { list.hidden = true; list.innerHTML = ""; return; }
  const matches = (typeof WAVEBASE_DATA !== "undefined" ? WAVEBASE_DATA : [])
    .filter(e => searchMatch(e, q))
    .slice(0, 8);
  if (!matches.length) {
    list.innerHTML = `<div class="search-suggestion-empty muted">No match — try a different spelling or a broader term.</div>`;
    list.hidden = false;
    return;
  }
  list.innerHTML = matches.map(e =>
    `<button type="button" class="search-suggestion" role="option" data-href="spot.html?id=${escHTML(e.id)}">
      <span class="search-suggestion-name">${escHTML(e.name)}</span>
      <span class="search-suggestion-meta">${typeLabel(e.type)} · ${escHTML(e.town || "")}${e.town ? ", " : ""}${escHTML(entryCountry(e) || "")}</span>
    </button>`
  ).join("");
  const first = list.querySelector(".search-suggestion");
  if (first) first.classList.add("is-active");
  // mousedown (not click) so the navigate fires BEFORE the input's blur
  // hides the list. Otherwise clicking a suggestion would race with blur.
  list.querySelectorAll(".search-suggestion").forEach(btn => {
    btn.addEventListener("mousedown", ev => {
      ev.preventDefault();
      const href = btn.dataset.href;
      if (href) window.location.href = href;
    });
  });
  list.hidden = false;
}
function hideSearchSuggestions() {
  const list = document.getElementById("search-suggestions");
  if (list) { list.hidden = true; }
}
function navigateSearchSuggestion(dir) {
  const list = document.getElementById("search-suggestions");
  if (!list || list.hidden) return;
  const items = [...list.querySelectorAll(".search-suggestion")];
  if (!items.length) return;
  const curIdx = items.findIndex(x => x.classList.contains("is-active"));
  const nextIdx = ((curIdx + dir) + items.length) % items.length;
  items.forEach((x, i) => x.classList.toggle("is-active", i === nextIdx));
  items[nextIdx].scrollIntoView({ block: "nearest" });
}

// Classic two-row DP Levenshtein. O(m*n) but trivial at this scale.
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 0; i < a.length; i++) {
    curr[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a.charCodeAt(i) === b.charCodeAt(j) ? 0 : 1;
      curr[j + 1] = Math.min(curr[j] + 1, prev[j + 1] + 1, prev[j] + cost);
    }
    const tmp = prev; prev = curr; curr = tmp;
  }
  return prev[b.length];
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
    "Greece":  "East Crete, Greece",
    "Belgium": "Belgian coast & Deinze, Belgium"
  };
  return map[country] || country;
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
// Sport pref is now an ARRAY of sport keys (multi-select). Empty array
// = "all sports" (no filter applied). Backward compat: legacy single-string
// values like "wave" still parse as a 1-element array via comma-split.
function getSportPref() {
  // Returns Array<string> of sport keys. Empty = no sport filter.
  // Priority: URL (intentional state from clicks / deep links / back-nav)
  // → profile.surfType (the user's identity — primary source of truth)
  // → localStorage (only for users without a profile yet)
  // → empty (= "All").
  //
  // Why profile > localStorage: LDW reported that profile changes weren't
  // reflected on the home page because old localStorage from earlier
  // testing was winning. The user expectation is clear — profile IS the
  // setting; localStorage is just historical pill clicks. Putting profile
  // above means: edit account → next page load reflects it. Trade-off:
  // clicking "All" doesn't survive a reload unless the URL preserves it
  // (it does, via setParam in runSearch).
  const SURF_MAP = { surfer: "wave", windsurfer: "wind", kitesurfer: "kite", wingfoiler: "wing" };
  const parseList = s => {
    if (s == null || s === "" || s === "all") return [];
    return s.split(",").map(x => x.trim()).filter(Boolean);
  };
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("sport");
  if (fromUrl !== null) return parseList(fromUrl);
  if (typeof WaveBaseAccount !== "undefined") {
    const types = WaveBaseAccount.getProfile().surfType || [];
    const mapped = types.map(t => SURF_MAP[t]).filter(Boolean);
    if (mapped.length) return mapped;
  }
  // Legacy "wave" single-key in localStorage was an old implicit default —
  // clear it so it doesn't stick after the multi-select rollout.
  const stored = localStorage.getItem("wavebase_sport_pref");
  if (stored === "wave") {
    localStorage.removeItem("wavebase_sport_pref");
  } else if (stored !== null) {
    return parseList(stored);
  }
  return [];
}
function setSportPref(sports) {
  // sports = Array<string>. Empty array means "show all" — stored explicitly
  // as "all" so this choice overrides the profile fallback on next load.
  // (If we removed the key here, getSportPref would auto-re-apply the user's
  // profile sport, which would feel like "All" doesn't stick.)
  try {
    if (!sports || sports.length === 0) {
      localStorage.setItem("wavebase_sport_pref", "all");
    } else {
      localStorage.setItem("wavebase_sport_pref", sports.join(","));
    }
  } catch (e) { /* ignore */ }
}
function sportLabel(key) {
  const s = WAVEBASE_SPORTS.find(s => s.key === key);
  return s ? s.label : key;
}
// Active state on pills:
//   "All"   pill is active when the sport filter is empty (no sports selected)
//   sport pill is active when its key is in the selected set
function sportPillsHTML(activeArr) {
  const set = new Set(activeArr || []);
  const isAllActive = set.size === 0;
  return `<div class="sport-pills" role="tablist" aria-label="Surf sport">
    ${WAVEBASE_SPORTS.map(s => {
      const live = sportIsLive(s.key);
      const isActive = (s.key === "all") ? isAllActive : set.has(s.key);
      return `<button class="sport-pill ${isActive ? "active" : ""}${live ? "" : " soon"}" data-sport="${s.key}" role="tab" aria-selected="${isActive}">${s.label}${live ? "" : ' <span class="soon-tag">soon</span>'}</button>`;
    }).join("")}
  </div>`;
}
function wireSportPills(container) {
  container.querySelectorAll(".sport-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const clicked = btn.dataset.sport;
      let next;
      if (clicked === "all") {
        // Clicking "All" clears the entire selection — show every sport.
        next = [];
      } else {
        // Toggle this sport in the current selection (multi-select).
        const current = new Set(getSportPref());
        if (current.has(clicked)) current.delete(clicked);
        else current.add(clicked);
        next = [...current];
      }
      setSportPref(next);
      // Mirror to URL. Empty selection = ?sport=all (explicitly) so the
      // choice survives a page reload — otherwise an empty URL would let
      // the profile default re-apply and the "All" click would silently
      // revert to the user's profile sport.
      const url = new URL(window.location.href);
      url.searchParams.set("sport", next.length === 0 ? "all" : next.join(","));
      window.history.replaceState(null, "", url.toString());
      runSearch();
    });
  });
}

/* Price-tier preference — mirrors the sport-pref pattern. Affects which
   stays/centers show in results (spots are price-less and pass through). */
function getTierPref() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("tier");
  if (fromUrl && (fromUrl === "all" || PRICE_TIERS.indexOf(fromUrl) !== -1)) return fromUrl;
  try {
    const stored = localStorage.getItem("wavebase_tier_pref");
    if (stored && PRICE_TIERS.indexOf(stored) !== -1) return stored;
  } catch (e) { /* ignore */ }
  return "all";
}
function setTierPref(tier) {
  try {
    if (tier === "all") localStorage.removeItem("wavebase_tier_pref");
    else localStorage.setItem("wavebase_tier_pref", tier);
  } catch (e) { /* ignore */ }
}
/* ============================================================
   Price range slider (replaces the tier dropdown)
   ============================================================
   Two-handle slider with a histogram of stay prices and tier zone
   labels above the track. Lets the user pick a min/max budget per
   night, while keeping the per-country "what's cheap and what's
   pricey" insight that the tier system gave us — by overlaying
   Budget / Comfortable / Premium / Luxury labels on the price scale.

   Tiers (Budget, Comfortable, Premium, Luxury) are still stored on
   each stay's `prices.tier` and shown as a chip on cards. They just
   don't drive the filter anymore. */
const PR_KEY = "wavebase_price_range";

function getPriceRange() {
  try {
    const p = JSON.parse(localStorage.getItem(PR_KEY) || "null");
    if (p && typeof p.min === "number" && typeof p.max === "number") return p;
  } catch (e) {}
  return null;
}
function setPriceRange(r) {
  try {
    if (!r) localStorage.removeItem(PR_KEY);
    else localStorage.setItem(PR_KEY, JSON.stringify(r));
  } catch (e) {}
}

// All stays in a country that have a known nightly fromEUR. Skips
// "by enquiry" (no number) and package/per-week pricing (not /night
// comparable). These categories always pass the filter — they're a
// different product, not part of the price-range pool.
function priceDataForCountry(country) {
  return WAVEBASE_DATA.filter(e =>
    e.type === "stay"
    && (!country || entryCountry(e) === country)
    && e.prices && typeof e.prices.fromEUR === "number"
    && !/package|week/i.test(e.prices.unit || "")
  );
}

function priceBoundsForCountry(country) {
  const stays = priceDataForCountry(country);
  if (!stays.length) return null;
  const all = [];
  stays.forEach(s => {
    all.push(s.prices.fromEUR);
    if (typeof s.prices.toEUR === "number") all.push(s.prices.toEUR);
  });
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  // Snap to round-€5 boundaries with a small headroom on either side.
  return {
    min: Math.max(0, Math.floor((lo - 5) / 5) * 5),
    max: Math.ceil((hi + 5) / 5) * 5
  };
}

function passesPriceFilter(e) {
  if (e.type !== "stay") return true;
  const range = getPriceRange();
  if (!range) return true;
  if (!e.prices) return true;
  // by-enquiry and package stays always pass — they're not /night.
  if (typeof e.prices.fromEUR !== "number") return true;
  if (/package|week/i.test(e.prices.unit || "")) return true;
  return e.prices.fromEUR >= range.min && e.prices.fromEUR <= range.max;
}

function initPriceRange() {
  const root  = document.getElementById("price-range");
  const minIn = document.getElementById("pr-min");
  const maxIn = document.getElementById("pr-max");
  const fill  = document.getElementById("pr-fill");
  const label = document.getElementById("pr-label");
  const reset = document.getElementById("pr-reset");
  if (!root || !minIn || !maxIn || !fill || !label || !reset) return;

  function syncFill() {
    const lo = parseFloat(minIn.value), hi = parseFloat(maxIn.value);
    const min = parseFloat(minIn.min), max = parseFloat(minIn.max);
    const total = max - min || 1;
    fill.style.left  = ((lo - min) / total) * 100 + "%";
    fill.style.width = ((hi - lo) / total) * 100 + "%";
  }
  function syncLabel() {
    const lo = parseFloat(minIn.value), hi = parseFloat(maxIn.value);
    const min = parseFloat(minIn.min), max = parseFloat(minIn.max);
    if (root.dataset.state === "empty") return;
    if (lo <= min && hi >= max) {
      label.textContent = "Any budget";
      reset.hidden = true;
    } else {
      label.textContent = `${fmtCurrency(lo)} – ${fmtCurrency(hi)} / night`;
      reset.hidden = false;
    }
  }
  function enforceOrder(src) {
    let lo = parseFloat(minIn.value), hi = parseFloat(maxIn.value);
    if (lo > hi) {
      if (src === minIn) maxIn.value = lo;
      else minIn.value = hi;
    }
  }
  function onChange(src) {
    enforceOrder(src);
    syncFill();
    syncLabel();
    const lo = parseFloat(minIn.value), hi = parseFloat(maxIn.value);
    const min = parseFloat(minIn.min), max = parseFloat(minIn.max);
    if (lo <= min && hi >= max) setPriceRange(null);
    else setPriceRange({ min: lo, max: hi });
    runSearch();
  }
  minIn.addEventListener("input", () => onChange(minIn));
  maxIn.addEventListener("input", () => onChange(maxIn));
  reset.addEventListener("click", () => {
    minIn.value = minIn.min;
    maxIn.value = maxIn.max;
    onChange(minIn);
  });
  // Expose for redraws on country change
  root._syncFill = syncFill;
  root._syncLabel = syncLabel;
}

function updatePriceRangeForCountry(country) {
  const root  = document.getElementById("price-range");
  const minIn = document.getElementById("pr-min");
  const maxIn = document.getElementById("pr-max");
  const bars  = document.getElementById("pr-bars");
  const label = document.getElementById("pr-label");
  const reset = document.getElementById("pr-reset");
  if (!root || !minIn || !maxIn || !bars) return;

  const bounds = priceBoundsForCountry(country);
  if (!bounds) {
    root.dataset.state = "empty";
    label.textContent = country ? "No priced stays here yet" : "Pick a country first";
    reset.hidden = true;
    bars.innerHTML = "";
    return;
  }
  root.dataset.state = "ready";
  minIn.min = bounds.min;  minIn.max = bounds.max;
  maxIn.min = bounds.min;  maxIn.max = bounds.max;

  const stored = getPriceRange();
  if (stored && stored.min >= bounds.min && stored.max <= bounds.max) {
    minIn.value = stored.min; maxIn.value = stored.max;
  } else {
    minIn.value = bounds.min; maxIn.value = bounds.max;
    setPriceRange(null);
  }
  renderHistogram(country, bounds);
  if (root._syncFill) root._syncFill();
  if (root._syncLabel) root._syncLabel();
}

function renderHistogram(country, bounds) {
  const bars = document.getElementById("pr-bars");
  if (!bars) return;
  const NBUCKETS = 22;
  const bucketSize = (bounds.max - bounds.min) / NBUCKETS;
  const buckets = Array(NBUCKETS).fill(0);
  priceDataForCountry(country).forEach(s => {
    const v = s.prices.fromEUR;
    let i = Math.floor((v - bounds.min) / bucketSize);
    i = Math.max(0, Math.min(NBUCKETS - 1, i));
    buckets[i]++;
  });
  const peak = Math.max(1, ...buckets);
  bars.innerHTML = buckets.map(c =>
    `<span class="pr-bar" style="height: ${Math.max(8, (c / peak) * 100)}%"></span>`
  ).join("");
}

function renderTierZones(country, bounds) {
  const tiersEl = document.getElementById("pr-tiers");
  if (!tiersEl) return;
  const total = bounds.max - bounds.min || 1;
  const zones = PRICE_TIERS.map(t => {
    const stays = priceDataForCountry(country).filter(e => e.prices.tier === t);
    if (!stays.length) return null;
    const froms = stays.map(s => s.prices.fromEUR);
    const tos = stays.map(s => typeof s.prices.toEUR === "number" ? s.prices.toEUR : s.prices.fromEUR);
    return { tier: t, min: Math.min(...froms), max: Math.max(...tos), meta: TIER_META[t] };
  }).filter(Boolean);
  // The widest zone carries the "relative to location" note — one place,
  // inside a tier box, and the zone with the best chance of fitting it.
  let widest = 0;
  zones.forEach((z, i) => {
    if ((z.max - z.min) > (zones[widest].max - zones[widest].min)) widest = i;
  });
  tiersEl.innerHTML = zones.map((z, i) => {
    const left = ((z.min - bounds.min) / total) * 100;
    const right = ((z.max - bounds.min) / total) * 100;
    const width = Math.max(10, right - left);
    const rel = i === widest
      ? `<span class="pr-tier-rel" title="Each tier is calibrated to local prices — 'Comfortable' costs differently per country.">📍 relative to location</span>`
      : "";
    return `<span class="pr-tier-zone tier-${z.tier}" style="left: ${left}%; width: ${width}%;" title="${escHTML(z.meta.label)} · ${fmtCurrency(z.min)}–${fmtCurrency(z.max)} /n"><span class="pr-tier-icon" aria-hidden="true">${z.meta.icon}</span><span class="pr-tier-name">${escHTML(z.meta.label)}</span>${rel}</span>`;
  }).join("");
  // Compact tier summary for the default (non-sidebar) searcher — the tier
  // band is dropped there, this line sits beside the price instead.
  const inlineEl = document.getElementById("pr-tier-inline");
  if (inlineEl) {
    inlineEl.innerHTML = zones.length
      ? zones.map(z => `<span class="pr-tin tier-${z.tier}"><span class="pr-tin-icon" aria-hidden="true">${z.meta.icon}</span>${escHTML(z.meta.label)}</span>`).join("")
        + `<span class="pr-tin-rel" title="Each tier is calibrated to local prices — 'Comfortable' costs differently per country.">📍 relative to location</span>`
      : "";
  }
}

function tierPillsHTML(active) {
  const pills = [{ key: "all", label: "Any" }]
    .concat(PRICE_TIERS.map(k => ({ key: k, label: `${TIER_META[k].icon} ${TIER_META[k].label}` })));
  return `<div class="tier-pills" role="tablist" aria-label="Trip type">
    <span class="tier-pills-label">Trip type:</span>
    ${pills.map(p =>
      `<button class="tier-pill ${p.key === active ? "active" : ""}" data-tier="${p.key}" role="tab" aria-selected="${p.key === active}">${p.label}</button>`
    ).join("")}
  </div>`;
}
function wireTierPills(container) {
  container.querySelectorAll(".tier-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      setTierPref(btn.dataset.tier);
      const url = new URL(window.location.href);
      if (btn.dataset.tier === "all") url.searchParams.delete("tier");
      else url.searchParams.set("tier", btn.dataset.tier);
      window.history.replaceState(null, "", url.toString());
      runSearch();
    });
  });
}

/* Render the spots/centers/stays sections + sticky jumper bar shared between
   country-picker mode and free-text search mode. Returns the HTML string. */
/* Combined mini-map at the top of Discover results. One map, all visible
   entries (spots + centers + stays) as type-colored pins. Lets the user
   see the geographic spread in 1 glance, click a pin → detail page.
   The legend keys are clickable: click "4 spots" to hide just the spot
   pins, click again to bring them back. Useful for isolating one type.
   Skipped if <2 entries with coords — one pin alone isn't worth a map. */
function resultsMiniMapHTML(matches) {
  const withCoords = matches.filter(e => Array.isArray(e.coords));
  if (withCoords.length < 2) return "";
  const counts = { spot: 0, center: 0, stay: 0 };
  withCoords.forEach(e => { if (counts[e.type] !== undefined) counts[e.type]++; });
  const keyBtn = (type, n, singular, plural) => n
    ? `<button type="button" class="rml-key" data-type="${type}" aria-pressed="true" title="Click to toggle ${plural} on the map"><span class="rml-dot ${type}"></span> ${n} ${n === 1 ? singular : plural}</button>`
    : "";
  const legend = [
    keyBtn("spot",   counts.spot,   "spot",   "spots"),
    keyBtn("center", counts.center, "center", "centers"),
    keyBtn("stay",   counts.stay,   "stay",   "stays")
  ].filter(Boolean).join("");
  return `<section class="results-map-frame" aria-label="Map of results">
    <div class="results-map-head">
      <span class="results-map-title">In one glance, on the map</span>
      <div class="results-map-legend">${legend}</div>
    </div>
    <div id="results-mini-map" class="results-mini-map-stage" role="application" aria-label="Mini map of all visible results"></div>
  </section>`;
}

function initResultsMiniMap(matches) {
  if (typeof L === "undefined") return;
  const el = document.getElementById("results-mini-map");
  if (!el) return;
  const withCoords = matches.filter(e => Array.isArray(e.coords));
  if (withCoords.length < 2) return;

  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
  }).addTo(map);

  // One Leaflet layer per type → toggling is a single addLayer/removeLayer call.
  const layers = { spot: L.layerGroup(), center: L.layerGroup(), stay: L.layerGroup() };
  const allCoords = [];
  withCoords.forEach(e => {
    if (!layers[e.type]) return;
    allCoords.push(e.coords);
    const m = L.circleMarker(e.coords, {
      radius: 9, color: "#fff", weight: 2.5,
      fillColor: typeColor(e.type), fillOpacity: 1
    });
    const tipBody = `<strong>${escHTML(e.name)}</strong><br><span class="rml-tip-meta">${typeLabel(e.type)}${e.town ? " &middot; " + escHTML(e.town) : ""}</span>`;
    m.bindTooltip(tipBody, { direction: "top", offset: [0, -6], className: "rml-tooltip" });
    m.on("click", () => { window.location.href = spotHref(e.id); });
    m.addTo(layers[e.type]);
  });
  layers.spot.addTo(map);
  layers.center.addTo(map);
  layers.stay.addTo(map);
  map.fitBounds(allCoords, { padding: [28, 28], maxZoom: 13 });
  // Leaflet sometimes mis-sizes when its container is initially hidden /
  // re-rendered via innerHTML; this nudges it to recompute once attached.
  setTimeout(() => map.invalidateSize(), 60);

  // Wire legend toggles. Click "spots" → hide spot pins; click again → restore.
  // State resets on each runSearch (re-render), which feels right — a new
  // country search shouldn't keep types from the previous one hidden.
  const visible = { spot: true, center: true, stay: true };
  document.querySelectorAll(".results-map-frame .rml-key").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.type;
      if (!layers[t]) return;
      visible[t] = !visible[t];
      if (visible[t]) layers[t].addTo(map); else map.removeLayer(layers[t]);
      btn.classList.toggle("off", !visible[t]);
      btn.setAttribute("aria-pressed", visible[t] ? "true" : "false");
    });
  });
}

function renderResultsSections(matches, gridClass, monthIdx, sportFilter) {
  if (!matches.length) return "";
  let spots     = matches.filter(e => e.type === "spot");
  const centers = matches.filter(e => e.type === "center");
  const stays   = matches.filter(e => e.type === "stay");
  // When the user has picked a month: sort spots by their primary metric
  // (avg wind for wind/kite/wing or sport=all if wind-spot, avg wave for
  // wave or sport=all if wave-spot) descending. Best for that month first.
  if (monthIdx) {
    spots = spots.slice().sort((a, b) => {
      const am = primaryMetricForSpot(a, monthIdx, sportFilter);
      const bm = primaryMetricForSpot(b, monthIdx, sportFilter);
      const av = am ? am.sortValue : -Infinity;
      const bv = bm ? bm.sortValue : -Infinity;
      return bv - av;
    });
  }
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
      <div class="${gridClass} section-body" id="body-${s.key}">${s.items.map(e => cardHTML(e)).join("")}</div>
    </section>`;
  });
  return html;
}

/* The Discover-page search/filter brain. Fires on every filter change
   AND on page load. Three execution paths:
   1. Free-text query → search all entries by name/text, ignore country
   2. No country picked → render the "Pick a country" empty state
   3. Country picked → render filtered results for that country
   Also toggles `is-home` on <body> to hide the hero/plan-trip/stats
   blocks once the user has filtered anything, and slides the searchbar
   from the hero slot into the sticky header. */
function runSearch() {
  const country = document.getElementById("f-country").value;
  const level = document.getElementById("f-level").value;
  const month = document.getElementById("f-month").value;
  const type  = document.getElementById("f-type").value;
  // Sport filter is now multi-select. `sports` is the live array; `sport`
  // is a backward-compat string ("all" or the first selected key) so the
  // rest of runSearch + functions it calls keep working without a wider
  // refactor. Predicates that need multi-select awareness use `sports` /
  // `sportSet` directly below.
  const sports = getSportPref();              // Array<string> — empty = all
  const sportSet = new Set(sports);
  const sportIsAll = sports.length === 0;
  const sport = sportIsAll ? "all" : sports[0];
  const qEl   = document.getElementById("f-search");
  const query = qEl ? qEl.value.trim() : "";
  const results = document.getElementById("results");
  // Heading label per current selection — used in a few "x spots in y" lines.
  const SINGLE_LABEL = { all: "All surf sports", wave: "Wave surfing", wind: "Windsurfing", kite: "Kitesurfing", wing: "Wing foiling" };
  const SHORT_LABEL = { wave: "Wave", wind: "Wind", kite: "Kite", wing: "Wing" };
  let sportHeading;
  if (sportIsAll)          sportHeading = "All surf sports";
  else if (sports.length === 1) sportHeading = SINGLE_LABEL[sports[0]] || "Surf";
  else                     sportHeading = sports.map(s => SHORT_LABEL[s] || s).join(" + ");
  const longSport = SINGLE_LABEL; // legacy map for single-key lookups elsewhere

  // "Home state" — when the user hasn't picked a country or typed a query.
  // Plan-trip strip and the stats ticker only show in this state; other
  // landing blocks (peaking, world map) stay visible once filtered, since
  // they're context, not the primary CTA.
  const isHome = !country && !query;
  document.body.classList.toggle("is-home", isHome);

  // Once filtered, the prominent hero searchbar slides up into the sticky
  // header (between logo and nav). On home it lives in the hero again.
  // Single DOM node moved between two slots — no input value sync needed.
  // SKIP THE MOVE WHILE THE INPUT IS FOCUSED: an appendChild detaches +
  // re-attaches the element, which kills focus on iOS (keyboard drops,
  // typing breaks). The slot-flip is deferred to the input's blur, which
  // also calls runSearch — see wireSearch below.
  const heroSlot   = document.getElementById("hero-search-slot");
  const headerSlot = document.getElementById("header-search-slot");
  const searchbar  = document.querySelector(".searchbar");
  if (searchbar && heroSlot && headerSlot) {
    const inp = searchbar.querySelector("input");
    const inpFocused = inp && document.activeElement === inp;
    const wantHost = isHome ? heroSlot : headerSlot;
    if (searchbar.parentElement !== wantHost && !inpFocused) {
      wantHost.appendChild(searchbar);
    }
  }

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
  // Sport URL uses comma-joined multi-select form (e.g. "wave,wind"), or
  // "all" when nothing is selected. We DO write "all" explicitly (don't omit)
  // so a refresh of an "All" URL stays on All — an absent param would let
  // the profile-default re-apply on next load.
  setParam("sport", sportIsAll ? "all" : sports.join(","), false);
  setParam("q", query, !query);
  window.history.replaceState(null, "", url.toString());

  // Toggle the clear-search button based on whether there's a query
  const clearBtn = document.getElementById("f-search-clear");
  if (clearBtn) clearBtn.hidden = !query;

  // refresh sport pill active state. "All" pill = active when no sports are
  // selected; each sport pill = active when its key is in the current set.
  document.querySelectorAll(".sport-pill").forEach(btn => {
    const isActive = (btn.dataset.sport === "all") ? sportIsAll : sportSet.has(btn.dataset.sport);
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  // refresh the price-range slider for the current country (bounds,
  // histogram, tier zones)
  updatePriceRangeForCountry(country);

  const pref = getViewPref();
  const gridClass = pref === "list" ? "grid list-view" : "grid";

  // ============ FREE-TEXT SEARCH MODE — overrides the country picker ============
  if (query) {
    const matches = WAVEBASE_DATA.filter(e => {
      if (!searchMatch(e, query)) return false;
      if (!sportIsAll && !sports.some(s => entrySports(e).includes(s))) return false;
      // Stays (guesthouses) host every level — filtering them by the
      // user's wave skill makes no sense and just hides options for
      // advanced surfers (LDW May 2026). Same in the country/sport
      // browse path below.
      const okL = level === "all" || e.type === "stay" || e.levels.includes(level);
      const okM = month === "all" || e.goodMonths.includes(parseInt(month, 10));
      const okT = type === "all" || e.type === type;
      return okL && okM && okT && passesPriceFilter(e);
    });
    const qMonthIdx = (month !== "all") ? parseInt(month, 10) : null;
    let html = `<div class="results-head"><h2>Search: &ldquo;${escHTML(query)}&rdquo; <span class="seccount">${matches.length}</span></h2>${matches.length ? viewToggleHTML(pref) : ""}</div>`;
    if (matches.length === 0) {
      html += `<div class="empty">
        <strong>Nothing matches &ldquo;${escHTML(query)}&rdquo; in <strong>${sportHeading}</strong>.</strong><br>
        Try a different spelling, a broader term, or another sport — or clear the search and browse by country.
      </div>`;
    } else {
      html += resultsMiniMapHTML(matches);
      html += renderResultsSections(matches, gridClass, qMonthIdx, sport);
    }
    results.innerHTML = html;
    initResultsMiniMap(matches);
    wireCards(results);
    wireViewToggle(results);
    wireSectionToggle(results);
    wireSectionJumper(results);
    return;
  }

  // no country yet → make the whole empty box one big click target that
  // opens the country picker (per LDW: no link-in-text, the whole dotted
  // panel is the affordance).
  if (!country) {
    results.innerHTML = `<button type="button" class="empty empty-clickable" id="empty-open-destinations">
      <strong>Pick a country to begin.</strong>
      <span class="empty-sub">Tap here to open the country picker &mdash; or use the &ldquo;Where?&rdquo; field above, or type a place in the search bar.</span>
    </button>`;
    const openBtn = document.getElementById("empty-open-destinations");
    if (openBtn) {
      openBtn.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        openDestinationsMenu();
      });
    }
    return;
  }

  // Data-driven: filter entries by country (with default) and sport (with default)
  const liveCountrySportEntries = WAVEBASE_DATA.filter(e =>
    entryCountry(e) === country && (sportIsAll || sports.some(s => entrySports(e).includes(s)))
  );

  // No entries for this country×sport combo → COMING SOON with smart hints
  if (liveCountrySportEntries.length === 0) {
    const dest = findCountry(country);
    const flag = dest ? dest.flag : "";
    const title = `${sportHeading} in ${country}`;

    // What is live for this country (sports the user has NOT picked)?
    const combos = getLiveCombos();
    const thisCountry = combos.find(c => c.country === country);
    const otherSportsHere = thisCountry ? thisCountry.sports.filter(s => !sportSet.has(s)) : [];

    // What countries are live for any of the picked sports?
    const otherCountriesForSport = combos
      .filter(c => c.country !== country && c.sports.some(s => sportSet.has(s)))
      .map(c => `${c.flag} ${c.country}`);

    let hint = "";
    if (otherSportsHere.length) {
      const list = otherSportsHere.map(s => SINGLE_LABEL[s] || s).join(", ");
      hint += `<p>In <strong>${country}</strong>, <strong>${list}</strong> is already live — switch the sport pill above.</p>`;
    }
    if (otherCountriesForSport.length) {
      hint += `<p>For <strong>${sportHeading}</strong>, live countries: ${otherCountriesForSport.join(" &middot; ")}.</p>`;
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

  // Apply level/type strictly, but be lenient on month: if the picked
  // month excludes ANY entry in the country×sport pool, drop the month
  // filter and show all of them with a banner. Lets the user keep
  // browsing the full inventory while knowing what's actually peaking.
  const monthInt = parseInt(month, 10);
  const passLevelType = e => {
    // Stays bypass the level filter — guesthouses host every level
    // (see comment in the free-text-search branch above).
    const okL = level === "all" || e.type === "stay" || e.levels.includes(level);
    const okT = type === "all" || e.type === type;
    return okL && okT && passesPriceFilter(e);
  };
  const passMonth = e => month === "all" || e.goodMonths.includes(monthInt);
  const inSeason = liveCountrySportEntries.filter(e => passLevelType(e) && passMonth(e));
  const offSeason = liveCountrySportEntries.filter(e => passLevelType(e) && !passMonth(e));
  let matches = inSeason;
  let offSeasonBanner = "";
  if (month !== "all" && offSeason.length > 0) {
    matches = liveCountrySportEntries.filter(passLevelType); // show all
    const monthLabel = WAVEBASE_MONTHS[monthInt] || month;
    offSeasonBanner = inSeason.length === 0
      ? `<div class="off-season-banner">
          <strong>${monthLabel} is off-season here.</strong>
          Showing the live ${escHTML(country)} entries anyway — check each one's at-a-glance to see when it actually peaks.
        </div>`
      : `<div class="off-season-banner">
          <strong>${inSeason.length} of ${matches.length} entries peak in ${monthLabel}.</strong>
          Showing them all — check each one's at-a-glance to see when it actually peaks.
        </div>`;
  }

  const heading = smartResultsHeading(country, sport, month);
  const monthIdxForSort = (month !== "all") ? monthInt : null;
  let html = "";

  if (matches.length === 0) {
    html += `<div class="results-head"><h2>${heading}</h2></div>`;
    html += `<div class="empty"><strong>Nothing's a perfect match here.</strong><br>
      Try loosening a filter — the live region only has so many entries for now.</div>`;
  } else {
    html += `<div class="results-head"><h2>${heading}</h2>${viewToggleHTML(pref)}</div>`;
    html += topSpotsBlockHTML(matches, monthIdxForSort, sport);
    if (offSeasonBanner) html += offSeasonBanner;
    html += resultsMiniMapHTML(matches);
    html += renderResultsSections(matches, gridClass, monthIdxForSort, sport);
  }

  results.innerHTML = html;
  initResultsMiniMap(matches);
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

/* ===================== LANDING EXTRAS =====================
   First-touch elements above the searcher: a live numbers ticker, a
   mini world map showing live and queued countries, and a "peaking
   right now" carousel. Built from existing data so they stay accurate
   as inventory and rollout change.
   =========================================================== */

// Approximate country center coords (lat, lng) for the mini-world-map.
// Just enough precision to drop a recognizable pin per country — we're not
// drawing borders. Sourced from public geo references.
const COUNTRY_COORDS = {
  "Greece": [39.07, 21.83], "Belgium": [50.50, 4.47], "Portugal": [39.40, -8.22], "Spain": [40.46, -3.75],
  "France": [46.23, 2.21], "Italy": [41.87, 12.57], "Ireland": [53.41, -8.24],
  "United Kingdom": [54.38, -2.44], "Norway": [60.47, 8.47], "Iceland": [64.96, -19.02],
  "Morocco": [31.79, -7.09], "South Africa": [-30.56, 22.94], "Senegal": [14.50, -14.45],
  "Namibia": [-22.96, 18.49], "Mozambique": [-18.67, 35.53], "Cape Verde": [16.54, -23.05],
  "Indonesia": [-0.79, 113.92], "Sri Lanka": [7.87, 80.77], "Philippines": [12.88, 121.77],
  "Maldives": [3.20, 73.22], "Japan": [36.20, 138.25], "India": [20.59, 78.96],
  "United States": [37.09, -95.71], "Mexico": [23.63, -102.55], "Canada": [56.13, -106.35],
  "Costa Rica": [9.75, -83.75], "Nicaragua": [12.86, -85.21], "Panama": [8.54, -80.78],
  "El Salvador": [13.79, -88.90], "Barbados": [13.19, -59.54],
  "Brazil": [-14.24, -51.93], "Peru": [-9.19, -75.02], "Chile": [-35.68, -71.54],
  "Ecuador": [-1.83, -78.18],
  "Australia": [-25.27, 133.78], "New Zealand": [-40.90, 174.89], "Fiji": [-17.71, 178.07],
  "French Polynesia": [-17.65, -149.43], "Samoa": [-13.76, -172.10]
};

// ISO 3166-1 alpha-2 code → continent name. Used to tint the right
// continent when the cursor enters any country path in the inline
// SVG world map. Bridges to the SVG's path IDs (which use ISO codes)
// from the continent groupings in WAVEBASE_DESTINATIONS.
const ISO_TO_CONTINENT = {
  // Europe
  "al":"Europe","ad":"Europe","at":"Europe","by":"Europe","be":"Europe","ba":"Europe",
  "bg":"Europe","hr":"Europe","cy":"Europe","cz":"Europe","dk":"Europe","ee":"Europe",
  "fo":"Europe","fi":"Europe","fr":"Europe","de":"Europe","gi":"Europe","gr":"Europe",
  "hu":"Europe","is":"Europe","ie":"Europe","im":"Europe","it":"Europe","lv":"Europe",
  "li":"Europe","lt":"Europe","lu":"Europe","mk":"Europe","mt":"Europe","md":"Europe",
  "mc":"Europe","me":"Europe","nl":"Europe","no":"Europe","pl":"Europe","pt":"Europe",
  "ro":"Europe","ru":"Europe","sm":"Europe","rs":"Europe","sk":"Europe","si":"Europe",
  "es":"Europe","se":"Europe","ch":"Europe","ua":"Europe","gb":"Europe","va":"Europe",
  "xk":"Europe","gg":"Europe","je":"Europe",
  // Africa
  "dz":"Africa","ao":"Africa","bj":"Africa","bw":"Africa","bf":"Africa","bi":"Africa",
  "cv":"Africa","cm":"Africa","cf":"Africa","td":"Africa","km":"Africa","cg":"Africa",
  "cd":"Africa","ci":"Africa","dj":"Africa","eg":"Africa","gq":"Africa","er":"Africa",
  "sz":"Africa","et":"Africa","ga":"Africa","gm":"Africa","gh":"Africa","gn":"Africa",
  "gw":"Africa","ke":"Africa","ls":"Africa","lr":"Africa","ly":"Africa","mg":"Africa",
  "mw":"Africa","ml":"Africa","mr":"Africa","mu":"Africa","ma":"Africa","mz":"Africa",
  "na":"Africa","ne":"Africa","ng":"Africa","rw":"Africa","st":"Africa","sn":"Africa",
  "sc":"Africa","sl":"Africa","so":"Africa","za":"Africa","ss":"Africa","sd":"Africa",
  "tz":"Africa","tg":"Africa","tn":"Africa","ug":"Africa","zm":"Africa","zw":"Africa",
  "_somaliland":"Africa","eh":"Africa",
  // Asia (incl. Middle East)
  "af":"Asia","am":"Asia","az":"Asia","bh":"Asia","bd":"Asia","bt":"Asia","bn":"Asia",
  "kh":"Asia","cn":"Asia","ge":"Asia","in":"Asia","id":"Asia","ir":"Asia","iq":"Asia",
  "il":"Asia","jp":"Asia","jo":"Asia","kz":"Asia","kp":"Asia","kr":"Asia","kw":"Asia",
  "kg":"Asia","la":"Asia","lb":"Asia","my":"Asia","mv":"Asia","mn":"Asia","mm":"Asia",
  "np":"Asia","om":"Asia","pk":"Asia","ps":"Asia","ph":"Asia","qa":"Asia","sa":"Asia",
  "sg":"Asia","lk":"Asia","sy":"Asia","tw":"Asia","tj":"Asia","th":"Asia","tl":"Asia",
  "tr":"Asia","tm":"Asia","ae":"Asia","uz":"Asia","vn":"Asia","ye":"Asia",
  // North America
  "ca":"North America","gl":"North America","mx":"North America","us":"North America",
  "bm":"North America","pm":"North America",
  // Central America & Caribbean
  "ag":"Central America & Caribbean","bs":"Central America & Caribbean",
  "bb":"Central America & Caribbean","bz":"Central America & Caribbean",
  "cr":"Central America & Caribbean","cu":"Central America & Caribbean",
  "dm":"Central America & Caribbean","do":"Central America & Caribbean",
  "sv":"Central America & Caribbean","gd":"Central America & Caribbean",
  "gt":"Central America & Caribbean","ht":"Central America & Caribbean",
  "hn":"Central America & Caribbean","jm":"Central America & Caribbean",
  "ni":"Central America & Caribbean","pa":"Central America & Caribbean",
  "kn":"Central America & Caribbean","lc":"Central America & Caribbean",
  "vc":"Central America & Caribbean","tt":"Central America & Caribbean",
  "pr":"Central America & Caribbean",
  // South America
  "ar":"South America","bo":"South America","br":"South America","cl":"South America",
  "co":"South America","ec":"South America","fk":"South America","gf":"South America",
  "gy":"South America","py":"South America","pe":"South America","sr":"South America",
  "uy":"South America","ve":"South America",
  // Oceania
  "au":"Oceania","fj":"Oceania","ki":"Oceania","mh":"Oceania","fm":"Oceania","nr":"Oceania",
  "nz":"Oceania","pw":"Oceania","pg":"Oceania","ws":"Oceania","sb":"Oceania","to":"Oceania",
  "tv":"Oceania","vu":"Oceania","pf":"Oceania","nc":"Oceania","gu":"Oceania"
};

// Country name → ISO 3166-1 alpha-2. Used to drop pin markers on the
// inline SVG and to mark a country path as live/queued.
const COUNTRY_TO_ISO = {
  "Greece":"gr", "Belgium":"be", "Portugal":"pt", "Spain":"es", "France":"fr", "Italy":"it",
  "Ireland":"ie", "United Kingdom":"gb", "Norway":"no", "Iceland":"is",
  "Morocco":"ma", "South Africa":"za", "Senegal":"sn", "Namibia":"na",
  "Mozambique":"mz", "Cape Verde":"cv",
  "Indonesia":"id", "Sri Lanka":"lk", "Philippines":"ph", "Maldives":"mv",
  "Japan":"jp", "India":"in",
  "United States":"us", "Mexico":"mx", "Canada":"ca",
  "Costa Rica":"cr", "Nicaragua":"ni", "Panama":"pa", "El Salvador":"sv",
  "Barbados":"bb",
  "Brazil":"br", "Peru":"pe", "Chile":"cl", "Ecuador":"ec",
  "Australia":"au", "New Zealand":"nz", "Fiji":"fj",
  "French Polynesia":"pf", "Samoa":"ws"
};

function continentCounts(name) {
  const cont = (typeof WAVEBASE_DESTINATIONS !== "undefined")
    ? WAVEBASE_DESTINATIONS.find(c => c.continent === name) : null;
  if (!cont) return { live: 0, soon: 0 };
  return {
    live: cont.countries.filter(c => c.status === "live").length,
    soon: cont.countries.filter(c => c.status !== "live").length
  };
}

function flattenDestinations() {
  if (typeof WAVEBASE_DESTINATIONS === "undefined") return [];
  const out = [];
  WAVEBASE_DESTINATIONS.forEach(cont => {
    cont.countries.forEach(co => out.push(Object.assign({}, co, { continent: cont.continent })));
  });
  return out;
}

// Live-region cards on the home page — one card per live country, right
// under the hero. Counts are pulled live from WAVEBASE_DATA so they stay
// honest as inventory grows; clicking a card runs the search for that
// country.
function renderRegionCards() {
  const host = document.getElementById("region-cards");
  if (!host || typeof WAVEBASE_DESTINATIONS === "undefined") return;
  const AREA = {
    "Morocco": "Tamraght & Taghazout",
    "Greece":  "East Crete — Palekastro & Kouremenos",
    "Belgium": "The full coast + Deinze"
  };
  // Flag-colour band per country — gives each card its own pop.
  const FLAG = {
    "Morocco": "linear-gradient(90deg,#c1272d 0 42%,#0a7d3b 42% 58%,#c1272d 58%)",
    "Greece":  "linear-gradient(90deg,#0d5eaf 0 38%,#eef2f6 38% 62%,#0d5eaf 62%)",
    "Belgium": "linear-gradient(90deg,#2a2a2a 0 33.33%,#f4d23c 33.33% 66.66%,#e23636 66.66%)"
  };
  const live = [];
  WAVEBASE_DESTINATIONS.forEach(cont => {
    cont.countries.forEach(co => { if (co.status === "live") live.push(co); });
  });
  // Order the cards by the AREA map (Morocco first); any live country
  // without an AREA entry falls to the end.
  const order = Object.keys(AREA);
  live.sort((a, b) => {
    const ia = order.indexOf(a.name), ib = order.indexOf(b.name);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  host.innerHTML = live.map(co => {
    const inCountry = WAVEBASE_DATA.filter(e => entryCountry(e) === co.name);
    const n = type => inCountry.filter(e => e.type === type).length;
    const counts = [["spot", n("spot")], ["center", n("center")], ["stay", n("stay")]]
      .filter(p => p[1] > 0)
      .map(p => `${p[1]} ${p[0]}${p[1] === 1 ? "" : "s"}`)
      .join(" · ");
    return `<a class="region-card" style="--flagband:${FLAG[co.name] || "var(--sea)"}" href="index.html?country=${encodeURIComponent(co.name)}">
      <span class="region-card-flag" aria-hidden="true">${co.flag}</span>
      <span class="region-card-name">${escHTML(co.name)}</span>
      <span class="region-card-area">${escHTML(AREA[co.name] || "")}</span>
      <span class="region-card-counts">${counts}</span>
    </a>`;
  }).join("");
}

// Mini world map. Inline SVG (no Leaflet) so we get the design-magazine
// look from the reference: white country silhouettes on a soft sea-grey
// sea, continent regions tint clay on hover, pin-shape markers sit on
// top of the live countries. Each country path's data-continent attr is
// derived from ISO_TO_CONTINENT; hovering any country tints all paths
// sharing its continent, and clicking navigates to continent.html.
// World-map SVG: "Simple World Map" by Al MacDonald, CC BY-SA 3.0,
// via github.com/cablop/simple-world-map-by-continents — attribution
// appears under the map.
function renderMiniWorldMap() {
  const host = document.getElementById("mini-world-map");
  if (!host) return;
  // Skip if already rendered (e.g. re-entry during dev hot-reload)
  if (host.dataset.rendered === "1") return;

  fetch("worldmap.svg")
    .then(r => r.ok ? r.text() : Promise.reject(r.status))
    .then(svgText => {
      host.innerHTML = svgText;
      host.dataset.rendered = "1";
      const svg = host.querySelector("svg");
      if (!svg) return;
      // Make the SVG fill its container responsively.
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.classList.add("worldmap-svg");

      // Tag each country path/group with its continent so CSS+JS can
      // operate continent-wide. Live destinations get a marker class
      // and an SVG-native pin overlay rendered on top.
      const liveCountries = new Set();
      const soonCountries = new Set();
      if (typeof WAVEBASE_DESTINATIONS !== "undefined") {
        WAVEBASE_DESTINATIONS.forEach(c =>
          c.countries.forEach(co => {
            (co.status === "live" ? liveCountries : soonCountries).add(co.name);
          }));
      }
      const isoToCountryName = {};
      Object.keys(COUNTRY_TO_ISO).forEach(name => {
        isoToCountryName[COUNTRY_TO_ISO[name]] = name;
      });

      // Walk every top-level <g> / <path> with an id (one per country)
      // and tag it with continent + live/queued/inactive metadata.
      const countryNodes = svg.querySelectorAll("[id]");
      countryNodes.forEach(node => {
        const iso = node.getAttribute("id");
        if (!iso) return;
        const continent = ISO_TO_CONTINENT[iso];
        if (!continent) return;
        node.classList.add("country");
        node.setAttribute("data-continent", continent);
        const cName = isoToCountryName[iso];
        if (cName && liveCountries.has(cName)) {
          node.classList.add("country-live");
          node.setAttribute("data-country", cName);
        } else if (cName && soonCountries.has(cName)) {
          node.classList.add("country-soon");
          node.setAttribute("data-country", cName);
        }
      });

      // Build a pin overlay group rendered on top of all country paths
      // so the drop-pin shape never sits behind a country fill. One
      // pin per live country, anchored to the country path's centroid.
      const svgNS = "http://www.w3.org/2000/svg";
      const pinLayer = document.createElementNS(svgNS, "g");
      pinLayer.setAttribute("class", "worldmap-pins");
      svg.appendChild(pinLayer);

      const addPin = (countryName, kind) => {
        const iso = COUNTRY_TO_ISO[countryName];
        if (!iso) return;
        const path = svg.getElementById(iso);
        if (!path || !path.getBBox) return;
        let bbox;
        try { bbox = path.getBBox(); } catch (e) { return; }
        const cx = bbox.x + bbox.width  / 2;
        const cy = bbox.y + bbox.height / 2;
        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("class", `worldmap-pin ${kind === "live" ? "is-live" : "is-soon"}`);
        g.setAttribute("transform", `translate(${cx},${cy})`);
        g.setAttribute("data-country", countryName);
        g.setAttribute("data-continent", ISO_TO_CONTINENT[iso] || "");
        // Drop-pin silhouette (teardrop) + inner circle. Anchor at tip.
        const tear = document.createElementNS(svgNS, "path");
        tear.setAttribute("d", "M0 2 C-4 -3 -7 -6 -7 -9 C-7 -13 -3 -16 0 -16 C3 -16 7 -13 7 -9 C7 -6 4 -3 0 2 Z");
        tear.setAttribute("class", "pin-body");
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", "0"); dot.setAttribute("cy", "-9");
        dot.setAttribute("r", "2.4");
        dot.setAttribute("class", "pin-dot");
        const title = document.createElementNS(svgNS, "title");
        title.textContent = `${countryName} — ${kind === "live" ? "live" : "coming"}`;
        g.appendChild(tear);
        g.appendChild(dot);
        g.appendChild(title);
        pinLayer.appendChild(g);
      };
      liveCountries.forEach(name => addPin(name, "live"));

      // Hover: tint the whole continent the cursor is over.
      let hoveredContinent = null;
      const continentName = el => el.closest("[data-continent]")
        && el.closest("[data-continent]").getAttribute("data-continent");

      const setHover = name => {
        if (hoveredContinent === name) return;
        if (hoveredContinent) {
          svg.querySelectorAll(`[data-continent="${cssEscape(hoveredContinent)}"]`)
             .forEach(n => n.classList.remove("is-hover"));
        }
        hoveredContinent = name;
        if (name) {
          svg.querySelectorAll(`[data-continent="${cssEscape(name)}"]`)
             .forEach(n => n.classList.add("is-hover"));
        }
        // Update overlay label
        const label = document.getElementById("worldmap-hover-label");
        if (label) {
          if (!name) {
            label.textContent = "";
            label.classList.remove("is-visible");
          } else {
            const counts = continentCounts(name);
            label.textContent = `${name} — ${counts.live} live · ${counts.soon} queued`;
            label.classList.add("is-visible");
          }
        }
      };

      svg.addEventListener("mousemove", ev => {
        const target = ev.target;
        if (target && target.closest) {
          const cont = continentName(target);
          setHover(cont || null);
        }
      });
      svg.addEventListener("mouseleave", () => setHover(null));

      // Click anywhere in a continent (country path OR a pin) → continent page
      svg.addEventListener("click", ev => {
        const node = ev.target && ev.target.closest("[data-continent]");
        if (!node) return;
        const cont = node.getAttribute("data-continent");
        if (cont) {
          window.location.href = `continent.html?name=${encodeURIComponent(cont)}`;
        }
      });
    })
    .catch(err => {
      // Fail silent — the page works without the map. Log so dev sees it.
      // eslint-disable-next-line no-console
      console.warn("World map SVG failed to load:", err);
      host.innerHTML = `<div class="worldmap-fallback">Map didn't load — pick a country below.</div>`;
    });
}

// Defensive CSS.escape shim — older browsers may not have CSS.escape.
function cssEscape(s) {
  if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(s);
  return String(s).replace(/["\\]/g, "\\$&");
}

// "Peaking right now" carousel. Header reads e.g. "Peaking right now —
// May 2026"; cards reuse the regular renderer so the carousel always
// matches the rest of the site. Only spots + centers (stays aren't
// condition-bound). Falls back to shoulder-season entries if nothing
// is in peak/high. Filterable by sport: default comes from the user's
// account profile if they've picked exactly one sport, else "all".

// Per-carousel sport pref. Survives within a session via localStorage;
// otherwise inherits from the user's account profile.
function getPeakingSport() {
  try {
    const stored = localStorage.getItem("wavebase_peaking_sport");
    if (stored) return stored;
  } catch (e) { /* ignore */ }
  if (typeof WaveBaseAccount !== "undefined") {
    const p = WaveBaseAccount.getProfile();
    if (Array.isArray(p.surfType) && p.surfType.length === 1) {
      return p.surfType[0];
    }
  }
  return "all";
}
function setPeakingSport(s) {
  try {
    if (s && s !== "all") localStorage.setItem("wavebase_peaking_sport", s);
    else localStorage.removeItem("wavebase_peaking_sport");
  } catch (e) { /* ignore */ }
}

function renderPeakingSportPills() {
  const host = document.getElementById("peaking-sport-pills");
  if (!host) return;
  const active = getPeakingSport();
  const sports = [
    { key: "all",  label: "All" },
    { key: "wave", label: "Wave" },
    { key: "wind", label: "Wind" },
    { key: "kite", label: "Kite" },
    { key: "wing", label: "Wing" }
  ];
  host.innerHTML = sports.map(s =>
    `<button type="button" class="peaking-sport-pill${s.key === active ? " active" : ""}"
             data-sport="${s.key}" aria-pressed="${s.key === active ? "true" : "false"}">${s.label}</button>`
  ).join("");
  host.querySelectorAll(".peaking-sport-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      setPeakingSport(btn.dataset.sport);
      renderPeakingSportPills();
      renderPeakingCarousel();
    });
  });
}

function renderPeakingCarousel() {
  const row = document.getElementById("peaking-carousel");
  const sub = document.getElementById("peaking-sub");
  if (!row) return;
  const month = userSelectedMonth();
  const monthLabel = WAVEBASE_MONTHS[month];
  const year = new Date().getFullYear();
  const sport = getPeakingSport();
  // Spots only — stays and centers don't peak on their own conditions.
  const isSpot = e => e.type === "spot";
  const klass = e => {
    if (!isSpot(e)) return null;
    const s = seasonForMonth(getStatsFor(e), month);
    return s ? s.klass : null;
  };
  const score = k => k === "peak" ? 3 : k === "high" ? 2 : k === "shoulder" ? 1 : 0;
  const matchesSport = e => sport === "all" || entrySports(e).includes(sport);
  let list = WAVEBASE_DATA
    .map(e => ({ e, k: klass(e) }))
    .filter(x => (x.k === "peak" || x.k === "high") && matchesSport(x.e))
    .sort((a, b) => score(b.k) - score(a.k));
  let fallback = false;
  if (list.length === 0) {
    fallback = true;
    list = WAVEBASE_DATA
      .map(e => ({ e, k: klass(e) }))
      .filter(x => x.k === "shoulder" && matchesSport(x.e));
  }
  const top = list.slice(0, 5).map(x => x.e);
  if (sub) {
    const sportLabel = sport === "all" ? "" :
      ({ wave: " for wave surfing", wind: " for windsurfing", kite: " for kitesurfing", wing: " for wing foiling" })[sport] || "";
    if (top.length === 0) {
      sub.textContent = `${monthLabel} ${year}${sportLabel} — nothing's peaking right now.`;
    } else if (fallback) {
      sub.textContent = `${monthLabel} ${year}${sportLabel} — low season everywhere; here's what's still rideable.`;
    } else {
      sub.textContent = `${monthLabel} ${year}${sportLabel} — ${top.length} ${top.length === 1 ? "place" : "places"} in season right now.`;
    }
  }
  row.innerHTML = top.map(e => cardHTML(e)).join("");
  wireCards(row);
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
  // pre-select all filters from URL params (country + level/type/month + free-text q) — supports deep links and back-navigation.
  // If no URL param is set for a given filter, fall back to the user's profile
  // value where it makes sense (currently: level only — country pre-fill would
  // be wrong since the user is here to *explore* destinations beyond home base).
  const params = new URLSearchParams(window.location.search);
  const profile = (typeof WaveBaseAccount !== "undefined") ? WaveBaseAccount.getProfile() : {};
  const profileFallbacks = {
    level: profile.level || ""
  };
  [["country","f-country"],["level","f-level"],["type","f-type"],["month","f-month"],["q","f-search"]].forEach(([k, id]) => {
    const v = params.get(k) || profileFallbacks[k];
    if (v) {
      const el = document.getElementById(id);
      if (el) el.value = v;
    }
  });
  ["f-level", "f-month", "f-type", "f-country"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", runSearch);
  });
  // Persist the picked month so it carries to Compare / detail pages.
  const fMonth = document.getElementById("f-month");
  if (fMonth) {
    // Save on load (handles deep links and the initial select-from-URL above)
    setMonthPref(fMonth.value === "all" ? null : fMonth.value);
    fMonth.addEventListener("change", () => {
      setMonthPref(fMonth.value === "all" ? null : fMonth.value);
    });
  }
  // Opening the Where field also opens the destinations menu so the user
  // sees the country grid (with flags + "soon" labels). Typing inside the
  // field filters the chips inline — a country whose name doesn't include
  // the typed substring fades out + becomes unclickable.
  const fCountry = document.getElementById("f-country");
  if (fCountry) {
    // On touch devices (iPhone/iPad) the field is "tap to open picker",
    // not "tap to type". Focusing a real <input> on iOS opens the soft
    // keyboard and leaves a blinking cursor floating behind the menu,
    // both of which are pure noise here — the user picks a country chip,
    // not types. So on touch: readonly + inputmode="none" + hidden caret
    // + immediate blur. Desktop keeps the typing-to-filter flow intact.
    const isTouch = matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      fCountry.readOnly = true;
      fCountry.setAttribute("inputmode", "none");
      fCountry.style.caretColor = "transparent";
    }
    // Focus handler opens the menu WITHOUT scrolling — focus fires before
    // mouseup, so a scroll here would move the input out from under the
    // cursor and break the click. The click handler (which fires after
    // mouseup) is the one that scrolls.
    fCountry.addEventListener("focus", () => {
      openDestinationsMenu({ scroll: false });
      // On touch, release focus right after so iOS drops the keyboard.
      if (isTouch) setTimeout(() => fCountry.blur(), 0);
    });
    fCountry.addEventListener("click", ev => {
      ev.stopPropagation();
      openDestinationsMenu();
    });
    fCountry.addEventListener("input", () => {
      const q = fCountry.value.trim().toLowerCase();
      const panel = document.getElementById("destinations-menu");
      if (!panel) return;
      panel.querySelectorAll(".dest-chip").forEach(chip => {
        const name = (chip.dataset.country || "").toLowerCase();
        const hit = !q || name.includes(q);
        chip.classList.toggle("dimmed", !hit);
      });
      // Hide continent columns that no longer have any matching chips.
      panel.querySelectorAll(".dest-continent").forEach(col => {
        const anyHit = col.querySelector(".dest-chip:not(.dimmed)");
        col.classList.toggle("dimmed", !anyHit);
      });
    });
    fCountry.addEventListener("keydown", ev => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      // Pressing Enter selects the first visible (non-dimmed) chip
      const panel = document.getElementById("destinations-menu");
      const first = panel && panel.querySelector(".dest-chip:not(.dimmed)");
      if (first) first.click();
    });
  }
  document.getElementById("search-btn").addEventListener("click", runSearch);

  // Free-text search: typing shows a live SUGGESTIONS dropdown right
  // under the searchbar (same pattern as "+ Add a place" in trip-add).
  // Clicking a suggestion navigates to that entry's detail page; Enter
  // picks the highlighted (or first) suggestion. We deliberately DON'T
  // call runSearch on input anymore — that triggered the page-render
  // AND moved the bar to the header mid-typing, which dropped iOS
  // focus and made the bar visibly jump. Suggestions are quieter +
  // closer to what trip-add does (LDW request).
  const fSearch = document.getElementById("f-search");
  if (fSearch) {
    fSearch.addEventListener("input", () => updateSearchSuggestions(fSearch.value));
    fSearch.addEventListener("focus", () => updateSearchSuggestions(fSearch.value));
    fSearch.addEventListener("blur", () => {
      // Hide after a beat so a click on a suggestion still lands.
      setTimeout(hideSearchSuggestions, 160);
    });
    fSearch.addEventListener("keydown", ev => {
      if (ev.key === "Escape") {
        fSearch.value = "";
        hideSearchSuggestions();
        fSearch.blur();
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        const list = document.getElementById("search-suggestions");
        const sug = list && (list.querySelector(".search-suggestion.is-active") || list.querySelector(".search-suggestion"));
        if (sug && sug.dataset.href) window.location.href = sug.dataset.href;
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        navigateSearchSuggestion(1);
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        navigateSearchSuggestion(-1);
      }
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

  // Inject sport pills (Wave / Wind / Kite / Wing) inside the .searcher
  // box (top row), so they live next to the other filter dropdowns. Falls
  // back to a section above the searcher if the inline host is missing.
  const pillHost = document.getElementById("searcher-sport-pills");
  const searcherEl = document.querySelector(".searcher");
  const searcherSection = searcherEl && searcherEl.closest("section");
  if (pillHost && !document.querySelector(".sport-pills")) {
    pillHost.innerHTML = sportPillsHTML(getSportPref());
    wireSportPills(pillHost);
  } else if (searcherSection && !document.querySelector(".sport-pills")) {
    const wrap = document.createElement("section");
    wrap.className = "wrap sport-pills-wrap";
    wrap.innerHTML = sportPillsHTML(getSportPref());
    searcherSection.parentNode.insertBefore(wrap, searcherSection);
    wireSportPills(wrap);
  }

  // Floating filter bar: when the user scrolls past the .searcher-wrap
  // section, lift it out of the flow and pin a compact card to the top
  // of the viewport. Uses a scroll listener with hysteresis (5 px gap
  // between pin and release thresholds) so a tiny scroll wiggle doesn't
  // re-trigger the toggle, plus a placeholder spacer to keep the layout
  // height stable when we go fixed.
  //
  // The natural top of the section can SHIFT when runSearch toggles the
  // is-home body class (hero/plan-trip/ticker show/hide). We therefore
  // re-measure on every check rather than caching once — and measure
  // the spacer (which is in the flow when pinned) rather than the
  // section itself (which is fixed when pinned and reports viewport
  // coords, not document coords).
  if (searcherSection && searcherSection.classList.contains("searcher-wrap")) {
    // Header height is dynamic (padding scales with viewport). Read it
    // live and expose via a CSS variable so the pinned wrap's `top` can
    // stay snug under the header at every breakpoint.
    const header = document.querySelector(".site-header");
    function headerH() { return header ? header.getBoundingClientRect().height : 78; }
    function syncHeaderVar() {
      document.documentElement.style.setProperty("--header-h", headerH() + "px");
    }
    syncHeaderVar();
    window.addEventListener("resize", syncHeaderVar);

    // ---- Drag-to-reposition the sidebar ----
    // The user can grab any non-interactive area of the card (anywhere
    // that's not a select / input / button / pill) and drag the whole
    // thing to a new spot on screen. Position is persisted across
    // sessions in localStorage so it stays where you parked it. We
    // clamp to keep the card on-screen and below the sticky header.
    const POS_KEY = "wavebase_searcher_pos";
    function getStoredPos() {
      try { const p = JSON.parse(localStorage.getItem(POS_KEY) || "null");
        return p && typeof p.x === "number" && typeof p.y === "number" ? p : null;
      } catch (e) { return null; }
    }
    function setStoredPos(pos) {
      try { localStorage.setItem(POS_KEY, pos ? JSON.stringify(pos) : ""); } catch (e) {}
    }
    function clampPos(x, y, w, h) {
      const topMin = headerH() + 8;
      return {
        x: Math.max(8, Math.min(x, window.innerWidth - w - 8)),
        y: Math.max(topMin, Math.min(y, window.innerHeight - h - 8))
      };
    }
    function applyStoredPos() {
      if (!searcherSection.classList.contains("is-fixed")) {
        // Clear inline overrides so the default CSS layout takes over
        // when the searcher is back in flow.
        searcherSection.style.left = "";
        searcherSection.style.top = "";
        searcherSection.style.right = "";
        return;
      }
      const pos = getStoredPos();
      if (!pos) return;
      const rect = searcherSection.getBoundingClientRect();
      const c = clampPos(pos.x, pos.y, rect.width || 280, rect.height || 300);
      searcherSection.style.left = c.x + "px";
      searcherSection.style.top = c.y + "px";
      searcherSection.style.right = "auto";
    }

    // Burger toggle inside the sidebar: collapse/expand the filter card
    // when pinned. Persisted in localStorage so it stays in the user's
    // preferred state across pin cycles and reloads.
    const COLLAPSE_KEY = "wavebase_searcher_collapsed";
    function isCollapsedPref() {
      try { return localStorage.getItem(COLLAPSE_KEY) === "1"; } catch (e) { return false; }
    }
    function setCollapsedPref(on) {
      try { localStorage.setItem(COLLAPSE_KEY, on ? "1" : "0"); } catch (e) {}
    }
    const searcherCard = searcherSection.querySelector(".searcher");
    if (searcherCard && !searcherCard.querySelector(".searcher-toggle")) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "searcher-toggle";
      toggle.setAttribute("aria-label", "Collapse or expand filters");
      toggle.setAttribute("aria-expanded", isCollapsedPref() ? "false" : "true");
      // Two icons via spans — CSS swaps which one is visible based on
      // .is-collapsed. Burger when open (= "close to a small button"),
      // funnel/filter icon when collapsed (= "tap to open filters").
      toggle.innerHTML = `<span class="st-icon st-icon-open" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
      </span><span class="st-icon st-icon-closed" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 4 21 4 14 13 14 20 10 20 10 13 3 4"/></svg>
      </span>`;
      searcherCard.appendChild(toggle);
      // Apply persisted state immediately
      searcherSection.classList.toggle("is-collapsed", isCollapsedPref());
      toggle.addEventListener("click", () => {
        const willCollapse = !searcherSection.classList.contains("is-collapsed");
        searcherSection.classList.toggle("is-collapsed", willCollapse);
        toggle.setAttribute("aria-expanded", willCollapse ? "false" : "true");
        setCollapsedPref(willCollapse);
        // Card size just changed — re-clamp the stored position so an
        // expanded card doesn't pop off-screen if it was parked at an
        // edge while collapsed.
        requestAnimationFrame(applyStoredPos);
      });
    }

    // Drag handlers — attached after the toggle so we can exclude it.
    if (searcherCard) {
      let dragging = false;
      let dragOffset = { x: 0, y: 0 };
      const INTERACTIVE_SELECTOR = "select, input, button, label, a, .sport-pill, .searcher-toggle";

      searcherCard.addEventListener("mousedown", ev => {
        if (!searcherSection.classList.contains("is-fixed")) return;
        if (ev.button !== 0) return; // primary click only
        if (ev.target.closest(INTERACTIVE_SELECTOR)) return;
        ev.preventDefault();
        dragging = true;
        searcherCard.classList.add("is-dragging");
        const rect = searcherSection.getBoundingClientRect();
        dragOffset.x = ev.clientX - rect.left;
        dragOffset.y = ev.clientY - rect.top;
      });

      window.addEventListener("mousemove", ev => {
        if (!dragging) return;
        ev.preventDefault();
        const rect = searcherSection.getBoundingClientRect();
        const c = clampPos(ev.clientX - dragOffset.x, ev.clientY - dragOffset.y, rect.width, rect.height);
        searcherSection.style.left = c.x + "px";
        searcherSection.style.top = c.y + "px";
        searcherSection.style.right = "auto";
      });

      window.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        searcherCard.classList.remove("is-dragging");
        const rect = searcherSection.getBoundingClientRect();
        setStoredPos({ x: rect.left, y: rect.top });
      });
    }

    const spacer = document.createElement("div");
    spacer.className = "searcher-spacer";
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.display = "none";
    searcherSection.parentNode.insertBefore(spacer, searcherSection);

    let pinned = false;
    let triggerY = Infinity;
    let unpinY = 0;

    function recomputeNatural() {
      // Only measure when the wrap is in flow. Once pinned, the wrap is
      // position:fixed (its rect lies about position) and the spacer's
      // top doesn't match the wrap's old top (margin-collapse from the
      // .searcher inside means the wrap visually starts ~40 px lower
      // than the spacer). So we cache the trigger captured the last
      // time we were unpinned, and trust it through the pinned cycle.
      if (pinned) return;
      const r = searcherSection.getBoundingClientRect();
      const h = searcherSection.offsetHeight;
      const naturalTop = r.top + window.scrollY - headerH();
      // Wide hysteresis to kill flicker at the threshold: pin once the
      // searcher is ~halfway scrolled out of view, but don't unpin again
      // until it has scrolled all the way back to its natural spot. The
      // big gap between the two (half the searcher height) means hovering
      // right on the edge can't bounce it between states.
      triggerY = Math.max(30, naturalTop + h / 2);
      unpinY = Math.max(0, naturalTop);
      spacer.style.height = h + "px";
    }

    // Below this viewport width the floating card is disabled — the
    // card would eat too much vertical room and overflow-x scroll inside
    // it conflicts with page scroll on touch. Filters stay in flow.
    const FLOAT_MIN_WIDTH = 560;

    function checkPin() {
      const tooNarrow = window.innerWidth < FLOAT_MIN_WIDTH;
      recomputeNatural();
      if (!pinned && !tooNarrow && window.scrollY > triggerY) {
        pinned = true;
        spacer.style.display = "";
        searcherSection.classList.add("is-fixed");
        applyStoredPos();
      } else if (pinned && (tooNarrow || window.scrollY <= unpinY)) {
        pinned = false;
        spacer.style.display = "none";
        searcherSection.classList.remove("is-fixed");
        applyStoredPos(); // clears inline left/top
      }
    }
    window.addEventListener("scroll", checkPin, { passive: true });
    window.addEventListener("resize", () => { recomputeNatural(); checkPin(); applyStoredPos(); });

    // Re-measure when the layout shifts under us (e.g. runSearch toggles
    // is-home, the results grid renders, fonts settle). MutationObserver
    // on <main> catches DOM changes; ResizeObserver catches reflows
    // (covers font loading, image lazy-load, etc.). Both schedule a
    // checkPin in the next frame so any pending paint can settle first.
    let pending = false;
    function schedulePinCheck() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; checkPin(); });
    }
    const mainEl = document.querySelector("main") || document.body;
    if (typeof MutationObserver === "function") {
      new MutationObserver(schedulePinCheck).observe(mainEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    }
    if (typeof ResizeObserver === "function") {
      new ResizeObserver(schedulePinCheck).observe(mainEl);
    }
    window.addEventListener("load", checkPin);
    // First check after any pending layout changes from initIndex / runSearch
    // (is-home toggling, etc.) settle in the next frame.
    requestAnimationFrame(checkPin);
  }
  // Wire the price-range slider (replaces the old trip-type dropdown).
  initPriceRange();

  // ---- Mobile filter drawer ----
  // On narrow viewports (where the floating sidebar is disabled) the
  // searcher sits in normal flow at the top of the page. To keep the
  // filters reachable without scrolling all the way back up, we add a
  // fixed "Filters" trigger button. Tap → slides the searcher-wrap up
  // from the bottom as a sheet over a backdrop. Tap backdrop / close →
  // slides back down and the wrap returns to its normal in-flow spot.
  if (searcherSection && !document.querySelector(".mobile-filters-trigger")) {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "mobile-filters-trigger";
    trigger.setAttribute("aria-label", "Open filters");
    trigger.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 4 21 4 14 13 14 20 10 20 10 13 3 4"/></svg><span>Filters</span>`;
    document.body.appendChild(trigger);

    const backdrop = document.createElement("div");
    backdrop.className = "mobile-filters-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "mobile-filters-close";
    closeBtn.setAttribute("aria-label", "Close filters");
    closeBtn.innerHTML = "Close ✕";
    searcherSection.appendChild(closeBtn);

    function openMobileFilters() {
      document.body.classList.add("mobile-filters-open");
    }
    function closeMobileFilters() {
      document.body.classList.remove("mobile-filters-open");
    }
    trigger.addEventListener("click", openMobileFilters);
    backdrop.addEventListener("click", closeMobileFilters);
    closeBtn.addEventListener("click", closeMobileFilters);
    // Close on Esc
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape" && document.body.classList.contains("mobile-filters-open")) {
        closeMobileFilters();
      }
    });
  }

  // Landing extras: region cards, mini-world-map, peaking-right-now carousel.
  renderRegionCards();
  renderMiniWorldMap();
  renderPeakingSportPills();
  renderPeakingCarousel();
  // Keep the peaking carousel in sync with the month selector.
  if (fMonth) {
    fMonth.addEventListener("change", renderPeakingCarousel);
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
// Auto-link entry names in prose — turns "Tenda is a separate destination"
// into "<a href=...>Tenda</a> is a separate destination". Skips the current
// entry (so a page doesn't link to itself), prefers longer name matches
// first (so "Gone Surfing Crete" wins over a stray "Surfing"), and uses
// a zero-width marker to avoid re-matching text that's already inside a
// link we just inserted.
function autoLinkEntries(html, currentId) {
  if (!html || typeof html !== "string") return html || "";
  const entries = (typeof WAVEBASE_DATA === "undefined" ? [] : WAVEBASE_DATA)
    .filter(e => e && e.id !== currentId && e.name)
    .sort((a, b) => b.name.length - a.name.length);
  if (!entries.length) return html;
  const MARK = "​"; // zero-width space marker
  let out = html;
  for (const e of entries) {
    // Strip parentheticals so "Freak Surf (Freak Windsurf Station)" still matches "Freak Surf"
    const baseName = e.name.replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (!baseName) continue;
    const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Word boundary + skip if already wrapped (marker prefix/suffix).
    const re = new RegExp(`(?<!${MARK})\\b(${escaped})\\b(?!${MARK})`, "gi");
    out = out.replace(re, (match) =>
      `${MARK}<a class="entry-ref" href="${spotHref(e.id)}">${match}</a>${MARK}`);
  }
  return out.split(MARK).join("");
}

function laagHTML(laag, currentId) {
  const blokken = laag.inhoud.map(b =>
    `<div class="blok"><h3>${b.kop}</h3><p>${autoLinkEntries(b.tekst, currentId)}</p></div>`).join("");
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

/* Educational accordion — explains the "why" behind a spot's character.
   Each item: { q, a, source }. Renders as a native <details> accordion
   so it's accessible and JS-free. The answer text supports a tiny markdown
   subset (**bold**) so technical terms like "fetch" or "thermische wind"
   can be highlighted on first use; everything else is HTML-escaped. */
function eduMarkdown(text) {
  return escHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function educationalHTML(items) {
  if (!items || !items.length) return "";
  const rows = items.map(item => `
    <details class="edu-item">
      <summary class="edu-q">${escHTML(item.q)}</summary>
      <div class="edu-body">
        <p class="edu-a">${eduMarkdown(item.a)}</p>
        ${item.source ? `<p class="edu-source">Bron: ${escHTML(item.source)}</p>` : ""}
      </div>
    </details>`).join("");
  return `<section class="educational">
    <h2>Why this spot is like this</h2>
    <p class="edu-intro">The mechanism behind the spot's wind, water and season — so you understand it, not just check it.</p>
    <div class="edu-items">${rows}</div>
  </section>`;
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

/* Indicative-price panel for the detail page. Only renders if there's
   verified data — empty otherwise. Honest about source + that rates
   change. Used for both stays (per-night) and centers (per-lesson). */
function pricesHTML(e) {
  const p = e && e.prices;
  if (!p) return "";
  const rows = [];
  if (e.type === "center") {
    if (p.groupLessonEUR != null) {
      rows.push(["Group lesson", `from ${fmtCurrency(p.groupLessonEUR)}${p.groupLessonNote ? ` <span class="muted">— ${escHTML(p.groupLessonNote)}</span>` : ""}`]);
    }
    if (p.privateLessonHourEUR != null) {
      rows.push(["Private lesson", `from ${fmtCurrency(p.privateLessonHourEUR)} / hour`]);
    }
    if (p.rentalDayEUR != null) {
      rows.push(["Equipment rental", `from ${fmtCurrency(p.rentalDayEUR)} / day`]);
    }
    if (p.packageEUR != null && p.packageDays != null) {
      rows.push(["Package", `from ${fmtCurrency(p.packageEUR)} for ${p.packageDays} days${p.packageNote ? ` <span class="muted">— ${escHTML(p.packageNote)}</span>` : ""}`]);
    }
    if (rows.length === 0) {
      rows.push(["Pricing", `<em class="muted">Rates not published online — direct enquiry only.</em>`]);
    }
  } else if (e.type === "stay") {
    if (p.fromEUR != null && p.toEUR != null) {
      rows.push(["Indicative price", `${fmtCurrency(p.fromEUR)}–${fmtCurrency(p.toEUR)} ${escHTML(p.unit || "per night")}`]);
    } else if (p.fromEUR != null) {
      rows.push(["Indicative price", `from ${fmtCurrency(p.fromEUR)} ${escHTML(p.unit || "per night")}`]);
    } else {
      rows.push(["Indicative price", `<em class="muted">No public rate — direct enquiry / check Booking on your dates.</em>`]);
    }
  } else {
    return "";
  }
  const verif = p.verified ? ` <span class="muted">verified ${escHTML(p.verified)}</span>` : "";
  const src = p.source ? `<div class="price-source"><strong>Source:</strong> ${escHTML(p.source)}${verif}</div>` : "";
  const tier = (e.type === "stay" && p && p.tier) ? p.tier : null;
  let body;
  if (tier) {
    // Stay with a price tier → one box split down the middle: the
    // indicative price on the left, the price-level scale on the right.
    const indicVal = rows.length ? rows[0][1] : "";
    body = `<div class="price-panel">
      <div class="price-panel-side price-panel-indic">
        <span class="cond-label">Indicative price</span>
        <span class="cond-val">${indicVal}</span>
      </div>
      ${tierDegreeHTML(tier)}
    </div>`;
  } else {
    // Centers (several price rows) or stays without a tier → plain grid.
    const items = rows.map(([k, val]) =>
      `<div class="cond-item"><span class="cond-label">${k}</span><span class="cond-val">${val}</span></div>`
    ).join("");
    body = `<div class="cond-grid verblijf-grid">${items}</div>`;
  }
  return `<section class="condities">
    <h2>Pricing</h2>
    ${body}
    ${src}
  </section>`;
}

function dienstenHTML(d) {
  if (!d) return "";
  const rows = [
    ["Lessons", d.lessen],
    ["Rental", d.rental],
    ["Gear brands", d.brands],
    ["Facilities", iconizeFacilities(d.faciliteiten)],
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

function buurtHTML(b, currentId) {
  if (!b) return "";
  return `<section class="buurt">
    <h2>Nearby</h2>
    <div class="buurt-grid">
      <div class="buurt-item"><span class="buurt-label">Food</span><span>${autoLinkEntries(b.eten, currentId)}</span></div>
      <div class="buurt-item"><span class="buurt-label">Parking</span><span>${autoLinkEntries(b.parking, currentId)}</span></div>
      <div class="buurt-item"><span class="buurt-label">Gear rental</span><span>${autoLinkEntries(b.verhuur, currentId)}</span></div>
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

// Surfer-reviews mock — per-type story-prose forms with inline chip
// dropdowns (spot / center / stay each have their own structure). UI
// only for now: submissions persist locally as previews. Backend turns
// them into shared reviews in phase 2.
function reviewsMockHTML(e) {
  const typeWord = e.type === "stay" ? "stay" : (e.type === "center" ? "center" : "spot");
  const profile = WaveBaseAccount.getProfile();

  // Helper: build a chip-select with options. selected is auto-applied if
  // it matches one of the option values, so account pre-fills carry over.
  const chip = (name, opts, selected, placeholder) => {
    const optionsHtml = (placeholder ? `<option value="">${escHTML(placeholder)}</option>` : "") +
      opts.map(o => `<option value="${escHTML(o.value)}" ${o.value === selected ? "selected" : ""}>${escHTML(o.label)}</option>`).join("");
    return `<select class="review-chip" name="${name}">${optionsHtml}</select>`;
  };

  // Common option sets
  const yearOpts = (() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => ({ value: String(now - i), label: String(now - i) }));
  })();
  const monthOpts = WAVEBASE_MONTHS.slice(1).map((m, i) => ({ value: String(i + 1), label: m }));
  const levelOpts = [
    { value: "beginner",     label: "beginner" },
    { value: "intermediate", label: "intermediate" },
    { value: "advanced",     label: "advanced" }
  ];
  const disciplineOpts = [
    { value: "surfer",     label: "surfer" },
    { value: "windsurfer", label: "windsurfer" },
    { value: "kitesurfer", label: "kitesurfer" },
    { value: "wingfoiler", label: "wingfoiler" }
  ];
  const score10Opts = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}/10` }));
  const tripDays   = ["1","2","3","4","5","6","7","10","14","21","30+"].map(v => ({ value: v, label: `${v} day${v === "1" ? "" : "s"}` }));
  const nights     = ["1","2","3","4","5","6","7","10","14","21","30+"].map(v => ({ value: v, label: `${v} night${v === "1" ? "" : "s"}` }));
  // Verdict labels phrased to slot into "I'd ... again" sentences. The
  // values stay the same so any stored review is backward-compatible.
  const verdictForType = (kind) => {
    const verb = kind === "stay" ? "stay" : kind === "center" ? "book" : "come";
    return [
      { value: "would-go-again", label: `${verb} again in a heartbeat` },
      { value: "maybe",          label: `maybe ${verb} again` },
      { value: "no",             label: `not bother ${verb === "come" ? "coming" : verb + "ing"} back` }
    ];
  };
  const travelOpts = [
    { value: "solo",    label: "solo" },
    { value: "couple",  label: "as a couple" },
    { value: "friends", label: "with friends" },
    { value: "family",  label: "with family" }
  ];
  const vibeFelt = [
    { value: "chill",   label: "chill" },
    { value: "social",  label: "social" },
    { value: "party",   label: "party" },
    { value: "family",  label: "family" },
    { value: "pro",     label: "pro / focused" }
  ];
  const distanceFelt = [
    { value: "close",   label: "right by the spot" },
    { value: "ok",      label: "ok-ish, manageable" },
    { value: "too-far", label: "felt too far" }
  ];

  // Pre-fill defaults from account profile
  const preLevel = profile.level || "";
  const preDiscipline = Array.isArray(profile.surfType) && profile.surfType.length ? profile.surfType[0] : "";
  const preTravel = profile.travelStyle ? profile.travelStyle.toLowerCase() : "";
  const preName = profile.name || "";

  // Stars + date row — always present, common to all types.
  const starsRow = `<div class="review-stars" role="radiogroup" aria-label="Star rating">
    ${[1,2,3,4,5].map(n => `<button type="button" class="review-star" data-stars="${n}" role="radio" aria-label="${n} star${n>1?'s':''}">★</button>`).join("")}
  </div>`;
  const dateRow = `<span class="review-date">
    ${chip("monthVisited", monthOpts, "", "month")}
    ${chip("yearVisited",  yearOpts,  String(new Date().getFullYear()), null)}
  </span>`;

  // The "Reviewing as ..." sub-line — pre-filled from account where possible.
  const profileLine = `<p class="review-as">Reviewing as
    ${chip("level", levelOpts, preLevel, "your level")}
    ${chip("discipline", disciplineOpts, preDiscipline, "discipline")}
    ${profile.name ? ` &middot; <span class="muted">${escHTML(profile.name)}</span>` : ""}
  </p>`;

  // Build the type-specific story prose
  let story;
  if (e.type === "spot") {
    // Crowd labels phrased to slot into "The spot felt ___".
    // Locals labels phrased to slot into "the locals were ___".
    const crowdFelt = [
      { value: "empty",    label: "nearly empty" },
      { value: "quiet",    label: "pleasantly quiet" },
      { value: "moderate", label: "moderate" },
      { value: "busy",     label: "pretty busy" },
      { value: "packed",   label: "packed" }
    ];
    const localsFelt = [
      { value: "welcoming",   label: "welcoming to visitors" },
      { value: "friendly",    label: "friendly enough" },
      { value: "neutral",     label: "neutral" },
      { value: "territorial", label: "territorial" },
      { value: "hostile",     label: "outright hostile to tourists" }
    ];
    story = `<p class="review-story">
      I surfed at <strong>${escHTML(e.name)}</strong> in ${dateRow}.
      I spent ${chip("tripLength", tripDays, "", "how long?")} there
      and got wet on ${chip("daysSailed", tripDays, "", "how many?")} of them.
      The spot felt ${chip("crowd", crowdFelt, "", "how busy?")},
      and the locals were ${chip("localism", localsFelt, "", "tourist-friendly?")}.
      I'd ${chip("verdict", verdictForType("spot"), "", "would I come back?")}.
    </p>`;
  } else if (e.type === "center") {
    // Center-specific story — chips read like a sentence.
    const lessonsFelt = [
      { value: "excellent",     label: "excellent" },
      { value: "good",          label: "solid" },
      { value: "fine",          label: "fine" },
      { value: "disappointing", label: "disappointing" },
      { value: "didnt-take",    label: "I didn't take any" }
    ];
    const gearFelt = [
      { value: "brand-new",       label: "brand new" },
      { value: "well-maintained", label: "well-maintained" },
      { value: "decent",          label: "decent" },
      { value: "dated",           label: "dated" },
      { value: "poor",            label: "rough" },
      { value: "didnt-rent",      label: "I brought my own" }
    ];
    const staffFelt = [
      { value: "outstanding", label: "outstanding" },
      { value: "great",       label: "great" },
      { value: "fine",        label: "fine" },
      { value: "mixed",       label: "mixed" },
      { value: "weak",        label: "weak" }
    ];
    const safetyFelt = [
      { value: "very-tight", label: "very tight" },
      { value: "careful",    label: "careful" },
      { value: "adequate",   label: "adequate" },
      { value: "lax",        label: "a bit lax" },
      { value: "risky",      label: "frankly risky" }
    ];
    const valueFelt = [
      { value: "great-value", label: "like great value" },
      { value: "fair",        label: "fair" },
      { value: "pricey",      label: "a bit pricey" },
      { value: "overpriced",  label: "overpriced" }
    ];
    story = `<p class="review-story">
      I surfed with <strong>${escHTML(e.name)}</strong> in ${dateRow}
      and spent ${chip("tripLength", tripDays, "", "how long?")} with them.
      The lessons were ${chip("lessons", lessonsFelt, "", "?")},
      the rental gear felt ${chip("gear", gearFelt, "", "?")},
      and the staff was ${chip("team", staffFelt, "", "?")}.
      Safety felt ${chip("safety", safetyFelt, "", "?")},
      and the price felt ${chip("value", valueFelt, "", "?")}.
      The vibe was ${chip("vibe", vibeFelt, "", "?")}.
      I'd ${chip("verdict", verdictForType("center"), "", "would I book again?")}.
    </p>`;
  } else { // stay
    // Stay-specific story reads as flowing prose rather than a numeric
    // checklist. Each chip is a descriptive word so the sentence makes
    // sense on its own (e.g. "the hosts felt warm and the food was great").
    const hostsFelt = [
      { value: "warm",         label: "warm" },
      { value: "friendly",     label: "friendly" },
      { value: "professional", label: "professional" },
      { value: "cool",         label: "cool/distant" },
      { value: "off-putting",  label: "off-putting" }
    ];
    const foodFelt = [
      { value: "excellent",     label: "excellent" },
      { value: "good",          label: "good" },
      { value: "fine",          label: "fine" },
      { value: "disappointing", label: "disappointing" },
      { value: "n/a",           label: "self-catering / no food" }
    ];
    const comfortFelt = [
      { value: "very-comfortable", label: "very comfortable" },
      { value: "comfortable",      label: "comfortable" },
      { value: "ok",               label: "ok" },
      { value: "cramped",          label: "cramped" },
      { value: "poor",             label: "poor" }
    ];
    const cleanFelt = [
      { value: "spotless", label: "spotless" },
      { value: "clean",    label: "clean" },
      { value: "fine",     label: "fine" },
      { value: "patchy",   label: "patchy" },
      { value: "poor",     label: "poor" }
    ];
    const valueFelt = [
      { value: "great-value", label: "like great value" },
      { value: "fair",        label: "fair" },
      { value: "pricey",      label: "a bit pricey" },
      { value: "overpriced",  label: "overpriced" }
    ];
    const distanceFeltPhrased = [
      { value: "right-at-spot", label: "right outside" },
      { value: "short-drive",   label: "a short drive away" },
      { value: "too-far",       label: "a real hassle to reach" }
    ];
    story = `<p class="review-story">
      I stayed at <strong>${escHTML(e.name)}</strong> in ${dateRow}
      for ${chip("tripLength", nights, "", "how long?")},
      ${chip("travelGroup", travelOpts, preTravel, "with whom?")}.
      The hosts felt ${chip("hosts", hostsFelt, "", "?")}
      and the food was ${chip("food", foodFelt, "", "?")}.
      Rooms were ${chip("comfort", comfortFelt, "", "?")},
      and the place was ${chip("cleanliness", cleanFelt, "", "?")}.
      The price felt ${chip("value", valueFelt, "", "?")},
      and the overall vibe was ${chip("vibe", vibeFelt, "", "?")}.
      The surf was ${chip("distance", distanceFeltPhrased, "", "?")} from here.
      I'd ${chip("verdict", verdictForType("stay"), "", "would I stay again?")}.
    </p>`;
  }

  return `<section class="reviews-mock" id="reviews">
    <header class="reviews-head">
      <h2>Surfer reviews <span class="reviews-soon-tag">coming soon</span></h2>
      <p class="muted">Have you been to this ${typeWord}? Drop a quick review.
        The form below works as a preview — saved on this device, will become a
        real shared review once the backend lands.</p>
    </header>

    <form class="review-form" data-entry-id="${e.id}" data-entry-type="${e.type}" autocomplete="off">
      <div class="review-top">${starsRow}${profileLine}</div>
      ${story}

      <div class="review-field">
        <label for="review-text">Your honest take <span class="muted">— this is the part that really helps other surfers</span></label>
        <textarea id="review-text" name="text" rows="5" placeholder="What surprised you? What worked? Anything off? Talk to a friend who's about to go there."></textarea>
      </div>

      <div class="review-bottom">
        <label class="review-name-field">First name or initials
          <input type="text" name="name" placeholder="e.g. Lode D." value="${escHTML(preName)}">
        </label>
        <div class="review-matches">
          <span class="muted">Does our write-up match?</span>
          <label class="review-radio"><input type="radio" name="matches" value="yes"> yes</label>
          <label class="review-radio"><input type="radio" name="matches" value="partial"> partly</label>
          <label class="review-radio"><input type="radio" name="matches" value="no"> no</label>
        </div>
        <button type="submit" class="btn">Submit (preview)</button>
      </div>

      <p class="review-feedback" hidden></p>
    </form>
  </section>`;
}

function tripOptionsHTML(entryId) {
  // Trips that already contain this entry get a ✓ prefix so the user can see
  // at a glance where it sits without re-adding. The first such trip becomes
  // the selected default — so the dropdown shows the membership rather than
  // a flat "+ Add to a trip…" after a successful add.
  const trips = WaveBaseAccount.getTrips();
  const inTrips = new Set(trips.filter(t => Array.isArray(t.spotIds) && t.spotIds.includes(entryId)).map(t => t.id));
  const opts = trips.map(t => {
    const isIn = inTrips.has(t.id);
    const sel = isIn ? " selected" : "";
    const label = isIn ? `✓ In: ${t.name}` : t.name;
    return `<option value="${t.id}"${sel}>${label}</option>`;
  }).join("");
  const placeholderSel = inTrips.size ? "" : " selected";
  return `<option value=""${placeholderSel}>+ Add to a trip…</option>${opts}<option value="__new">➕ New trip…</option>`;
}

function tripViewLinkHTML(entryId) {
  // Inline link that opens whichever trip this entry sits in, on the account
  // page, scrolled to that trip. Empty when the entry isn't in any trip yet.
  const trips = WaveBaseAccount.getTrips();
  const containing = trips.filter(t => Array.isArray(t.spotIds) && t.spotIds.includes(entryId));
  if (!containing.length) return "";
  if (containing.length === 1) {
    const t = containing[0];
    return `<a class="trip-view-link" href="account.html#trip-${t.id}" title="Open ${escHTML(t.name)} on your account page">View trip ↗</a>`;
  }
  return `<a class="trip-view-link" href="account.html#trips" title="Open your trips on the account page">View ${containing.length} trips ↗</a>`;
}

/* Spot detail page renderer (used for spots, stays AND centers — same
   template, different sections shown based on `e.type`). The page reads
   the entry id from `?id=…` in the URL.

   Render order (top → bottom):
   - Hero image / placeholder + back link
   - Type-specific title block (spot/center/stay)
   - Action row (Save, Compare, Add to trip)
   - Mini-map of this spot's coords
   - "At a glance" block (statsPanelHTML — spots/centers only)
   - Story + summary + layered detail (verhaal / samenvatting / lagen)
   - Centers/stays nearby (relatedSectionsForDetail)
   - More in country
   - Reviews mock

   Editing copy on spot pages? Most prose comes from `data.js` (per-entry
   `verhaal`, `samenvatting`, `lagen` fields), NOT from this function. */
function initSpot() {
  const root = document.getElementById("detail-root");
  const id = new URLSearchParams(window.location.search).get("id");
  const e = byId(id);
  if (!e) {
    // Hand off to the dedicated 404 page so the user sees a real not-found
    // experience instead of an in-line "Not found" line.
    window.location.replace("404.html");
    return;
  }
  applySpotSEO(e);
  const verhaal = e.verhaal.map(p => `<p>${autoLinkEntries(p, e.id)}</p>`).join("");
  const samenvatting = e.samenvatting.map(s => `<li>${autoLinkEntries(s, e.id)}</li>`).join("");
  const lagen = e.lagen.map(l => laagHTML(l, e.id)).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);
  // "Surfed it" — spots only (you surf a spot, not a center or a stay).
  const surfed = e.type === "spot" && WaveBaseAccount.isSurfed(e.id);

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
      <div class="place">
        <a class="head-chip" href="index.html?type=${e.type}">${typeLabel(e.type)}</a>
        <span class="head-sep">&middot;</span>
        <a class="head-chip" href="index.html?country=${encodeURIComponent(entryCountry(e))}&amp;q=${encodeURIComponent(e.town)}">${e.town}</a>
        <span class="head-sep">&middot;</span>
        <a class="head-chip" href="index.html?country=${encodeURIComponent(entryCountry(e))}">${entryCountry(e)}</a>
      </div>
      <h1>${e.name}</h1>
      <p class="tag">${e.tagline}</p>
      ${e.coordsLabel ? `<p class="coords-note">About the location: ${e.coordsLabel}</p>` : ""}
      <div class="detail-actions">
        ${e.type === "stay" ? `<a class="btn btn-book" href="${bookingHref(e)}" target="_blank" rel="noopener">Book now ↗</a>` : ""}
        ${e.type === "center" && e.bookingUrl ? `<a class="btn btn-book" href="${e.bookingUrl}" target="_blank" rel="noopener">Visit website ↗</a>` : ""}
        <button class="btn ghost ${saved ? "on" : ""}" id="save-toggle">${saved ? "♥ Saved" : "♡ Save this place"}</button>
        <button class="btn ghost ${comparing ? "on" : ""}" id="compare-toggle">${comparing ? "✓ In compare" : "+ Compare"}</button>
        ${e.type === "spot" ? `<button class="btn ghost surfed-btn ${surfed ? "on" : ""}" id="surfed-toggle">${surfed ? "✓ Surfed it" : "Surfed it"}</button>` : ""}
        ${e.type === "stay" ? `<a class="btn ghost" href="explorer.html?base=${e.id}">Explore spots from here →</a>` : ""}
        ${(e.type === "spot" || e.type === "center") && e.coords ? `<a class="btn ghost" href="${windyHref(e)}" target="_blank" rel="noopener">See forecast ↗</a>` : ""}
        <span class="trip-picker">
          <select id="trip-select">${tripOptionsHTML(e.id)}</select>
          <span id="trip-view-link-slot">${tripViewLinkHTML(e.id)}</span>
        </span>
      </div>
    </header>

    ${e.coords ? `<div class="detail-map" id="detail-map"></div>
      <p class="map-actions"><a href="${googleMapsHref(e)}" target="_blank" rel="noopener">Open in Google Maps ↗</a></p>` : ""}

    ${statsPanelHTML(e)}

    <div class="kort">
      <h2>In short</h2>
      <ul>${samenvatting}</ul>
    </div>

    ${conditiesHTML(e.condities)}
    ${verblijfHTML(e.verblijf)}
    ${dienstenHTML(e.diensten)}
    ${pricesHTML(e)}

    <div class="verhaal">
      <h2>The honest story</h2>
      ${verhaal}
    </div>

    ${educationalHTML(e.educational)}

    ${lagen}
    ${buurtHTML(e.buurt, e.id)}
    ${vergelijkingHTML(e.vergelijking)}
    ${relatedSectionsForDetail(e)}
    ${townPanelHTML(e.town)}

    <section class="fit">
      <div class="box yes"><h3>Ideal for</h3><p>${e.ideaalVoor}</p></div>
      <div class="box no"><h3>Not ideal if</h3><p>${e.nietIdeaalAls}</p></div>
    </section>

    ${moreInCountryHTML(e)}

    ${reviewsMockHTML(e)}`;

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

  // Wire embedded entry cards (related sections + "More in country") + the
  // per-section list/cards toggle.
  if (root.querySelector(".related-entries .grid") || root.querySelector(".more-in-country .grid")) {
    wireCards(root);
    wireDetailViewToggles(root);
  }

  // Hover popovers on the monthly wind/temperature/wave bar charts.
  wireChartTooltips(root);
  // Click-to-pin months for comparison across all three charts.
  wireMonthPinning(root, e);

  document.getElementById("save-toggle").addEventListener("click", function () {
    if (!requireAuthForSave()) return;
    const on = WaveBaseAccount.toggleSave(e.id);
    this.textContent = on ? "♥ Saved" : "♡ Save this place";
    this.classList.toggle("on", on);
  });
  document.getElementById("compare-toggle").addEventListener("click", function () {
    if (!requireAuth()) return;
    const on = WaveBaseAccount.toggleCompare(e.id);
    this.textContent = on ? "✓ In compare" : "+ Compare";
    this.classList.toggle("on", on);
    updateNav();
  });
  // "Surfed it" toggle — only present on spot pages.
  const surfedBtn = document.getElementById("surfed-toggle");
  if (surfedBtn) {
    surfedBtn.addEventListener("click", function () {
      const on = WaveBaseAccount.toggleSurfed(e.id);
      this.textContent = on ? "✓ Surfed it" : "Surfed it";
      this.classList.toggle("on", on);
    });
  }
  document.getElementById("trip-select").addEventListener("change", function () {
    const v = this.value;
    if (!v) return;
    // Anon visitors can't have trips (no account = nothing to add
    // them to). Reset the dropdown so it's not stuck on the option
    // they clicked, then pop the login modal.
    if (!requireAuth()) {
      this.value = "";
      return;
    }
    let targetId = v;
    if (v === "__new") {
      const name = window.prompt("Name your new trip:");
      if (!name) { this.innerHTML = tripOptionsHTML(e.id); return; }
      const t = WaveBaseAccount.addTrip(name);
      WaveBaseAccount.addToTrip(t.id, e.id);
      targetId = t.id;
    } else {
      WaveBaseAccount.addToTrip(v, e.id);
    }
    // Rebuild options so the newly-containing trip is checkmarked + selected,
    // and refresh the inline "View trip ↗" link so the user can jump there.
    this.innerHTML = tripOptionsHTML(e.id);
    this.value = targetId;
    const slot = document.getElementById("trip-view-link-slot");
    if (slot) slot.innerHTML = tripViewLinkHTML(e.id);
  });

  // Reviews mock — stars highlight on click; submit persists the preview
  // locally (so it shows on My WaveBase → My reviews) and clears the form.
  // The story-prose chips and free text all serialise into a `details`
  // object on the saved review so future readers see the full context.
  const reviewForm = root.querySelector(".review-form");
  if (reviewForm) {
    let chosenStars = 0;
    reviewForm.querySelectorAll(".review-star").forEach(btn => {
      btn.addEventListener("click", () => {
        chosenStars = parseInt(btn.dataset.stars, 10);
        reviewForm.querySelectorAll(".review-star").forEach(b => {
          b.classList.toggle("on", parseInt(b.dataset.stars, 10) <= chosenStars);
        });
      });
    });
    reviewForm.addEventListener("submit", ev => {
      ev.preventDefault();
      const fb = reviewForm.querySelector(".review-feedback");
      if (!fb) return;
      const fd = new FormData(reviewForm);
      // Fields handled at top level: stars, year, month, matches, text, name.
      // Everything else gets bundled into details — that's the per-type chip data.
      const TOP = new Set(["yearVisited", "monthVisited", "matches", "text", "name"]);
      const details = {};
      for (const [k, v] of fd.entries()) {
        if (TOP.has(k) || !v) continue;
        details[k] = v;
      }
      WaveBaseAccount.addReview({
        entryId: e.id,
        entryType: e.type,
        stars: chosenStars,
        yearVisited:  fd.get("yearVisited"),
        monthVisited: fd.get("monthVisited"),
        matches: fd.get("matches") || "",
        text:    fd.get("text") || "",
        name:    fd.get("name") || "",
        details
      });
      fb.hidden = false;
      fb.innerHTML = `Thanks — your preview review is saved on this device. See it on <a href="account.html#my-reviews">My WaveBase → My reviews</a>. Real, shared reviews land when the backend goes live.`;
      // Reset state so the user sees the form go back to blank after a moment.
      setTimeout(() => {
        chosenStars = 0;
        reviewForm.querySelectorAll(".review-star").forEach(b => b.classList.remove("on"));
        reviewForm.reset();
      }, 3000);
    });
  }

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

  // One layer per entity-type (for the type toggles), and per-marker entry refs
  // (so the sport filter can hide individual markers within a layer).
  const layers = { spot: L.layerGroup(), stay: L.layerGroup(), center: L.layerGroup() };
  const markerEntries = []; // [{marker, entry, layer}]
  const allCoords = [];
  WAVEBASE_DATA.forEach(e => {
    if (!e.coords || !layers[e.type]) return;
    allCoords.push(e.coords);
    const m = L.circleMarker(e.coords, {
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
    el._wbMap = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
    }).addTo(map);

    // Pins per type. The stay layer also carries the stay-to-stay route
    // line; connSpot / connCenter carry the connector from each stay to
    // the spots / centers coupled to it.
    const layers = { spot: L.layerGroup(), center: L.layerGroup(), stay: L.layerGroup() };
    const connSpot = L.layerGroup();
    const connCenter = L.layerGroup();
    // Stays get a numbered pin (matching the Itinerary list); spots and
    // centers get a plain colored dot — places near a stay, not numbered
    // stops of their own.
    const tripStays = t.spotIds.map(byId).filter(x => x && x.type === "stay");
    items.forEach(e => {
      if (!layers[e.type]) return;
      const isStay = e.type === "stay";
      const num = isStay ? tripStays.indexOf(e) + 1 : 0;
      const icon = isStay
        ? L.divIcon({ className: "trip-pin stay", html: String(num), iconSize: [26, 26], iconAnchor: [13, 13] })
        : L.divIcon({ className: "trip-pin " + e.type, html: "", iconSize: [14, 14], iconAnchor: [7, 7] });
      L.marker(e.coords, { icon: icon })
        .bindPopup(`<strong>${isStay ? num + ". " : ""}${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}<br>
          <a href="spot.html?id=${e.id}">See the analysis →</a>${navAppsHTML(e)}`)
        .addTo(layers[e.type]);
    });

    // A distance label — a divIcon marker so it toggles cleanly with its
    // layer. cls "trip-dist-sub" makes it the smaller connector variant.
    const distMarker = (a, b, cls) => {
      const dist = fmtKm(distanceKm(a, b));
      if (!dist) return null;
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      return L.marker(mid, {
        interactive: false,
        icon: L.divIcon({
          className: "trip-dist-marker",
          html: `<span class="trip-dist-label${cls ? " " + cls : ""}">${dist}</span>`,
          iconSize: [90, 22], iconAnchor: [45, 11]
        })
      });
    };

    // Route line through the stays, in trip order, with a per-hop label.
    const stays = items.filter(e => e.type === "stay");
    if (stays.length > 1) {
      L.polyline(stays.map(e => e.coords), { color: "#2a2723", weight: 2, opacity: 0.55, dashArray: "4,7" }).addTo(layers.stay);
      for (let i = 0; i < stays.length - 1; i++) {
        const m = distMarker(stays[i].coords, stays[i + 1].coords);
        if (m) m.addTo(layers.stay);
      }
    }

    // Connector from each stay to the spots / centers coupled to it, with
    // the distance labelled — so you see how far each one is from base.
    tripLegs(items).legs.forEach(leg => {
      leg.extras.forEach(ex => {
        const isCenter = ex.type === "center";
        const target = isCenter ? connCenter : connSpot;
        L.polyline([leg.stay.coords, ex.coords], {
          color: isCenter ? "#e0a447" : "#3f6f7d",
          weight: 1.5, opacity: 0.7, dashArray: "1,5"
        }).addTo(target);
        const m = distMarker(leg.stay.coords, ex.coords, "trip-dist-sub");
        if (m) m.addTo(target);
      });
    });

    map.fitBounds(items.map(e => e.coords), { padding: [30, 30], maxZoom: 13 });
    setTimeout(() => map.invalidateSize(), 60);

    // The count pills in the trip overview double as the map's type
    // filter. A stay->spot connector needs both its stay and its spot
    // visible, so the connectors are re-evaluated on every toggle.
    const visible = { spot: true, center: true, stay: true };
    const applyFilter = () => {
      ["spot", "center", "stay"].forEach(ty => {
        if (visible[ty]) layers[ty].addTo(map); else map.removeLayer(layers[ty]);
      });
      if (visible.spot && visible.stay) connSpot.addTo(map); else map.removeLayer(connSpot);
      if (visible.center && visible.stay) connCenter.addTo(map); else map.removeLayer(connCenter);
    };
    applyFilter();
    const card = document.getElementById("trip-" + t.id);
    if (card) card.querySelectorAll(".ts-pill[data-type]").forEach(btn => {
      btn.addEventListener("click", () => {
        const ty = btn.dataset.type;
        if (!(ty in visible)) return;
        visible[ty] = !visible[ty];
        applyFilter();
        btn.classList.toggle("off", !visible[ty]);
        btn.setAttribute("aria-pressed", visible[ty] ? "true" : "false");
      });
    });
  });
}

/* ---- trip dates / nights / cost estimates ---- */

// Whole nights between two YYYY-MM-DD strings. 0 when either is missing
// or check-out isn't strictly after check-in. Math.round absorbs DST.
function tripNights(inStr, outStr) {
  if (!inStr || !outStr) return 0;
  const a = new Date(inStr + "T00:00:00");
  const b = new Date(outStr + "T00:00:00");
  if (isNaN(a) || isNaN(b)) return 0;
  const n = Math.round((b - a) / 86400000);
  return n > 0 ? n : 0;
}
// "5 Jul" or, with withYear, "5 Jul 2026".
function fmtTripDate(str, withYear) {
  if (!str) return "";
  const d = new Date(str + "T00:00:00");
  if (isNaN(d)) return "";
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  return d.getDate() + " " + mon + (withYear ? " " + d.getFullYear() : "");
}
// A trip period: "5 – 12 Jul 2026" within one month, "28 Jun – 5 Jul
// 2026" across months, "28 Dec 2026 – 3 Jan 2027" across years.
function fmtTripPeriod(inStr, outStr) {
  const a = new Date(inStr + "T00:00:00"), b = new Date(outStr + "T00:00:00");
  if (isNaN(a) || isNaN(b)) return "";
  const sameYear = a.getFullYear() === b.getFullYear();
  if (sameYear && a.getMonth() === b.getMonth()) return a.getDate() + " – " + fmtTripDate(outStr, true);
  return fmtTripDate(inStr, !sameYear) + " – " + fmtTripDate(outStr, true);
}
// Estimated cost of one stay for N nights, in the user's currency.
// "" when the stay has no per-night price (package / by enquiry).
function stayCostEstimate(e, nights) {
  if (nights <= 0 || !e || !e.prices) return "";
  if (typeof e.prices.fromEUR !== "number" || /package|week/i.test(e.prices.unit || "")) return "";
  const lo = e.prices.fromEUR * nights;
  const hi = (typeof e.prices.toEUR === "number" ? e.prices.toEUR : e.prices.fromEUR) * nights;
  const loS = fmtCurrency(lo), hiS = fmtCurrency(hi);
  return loS === hiS ? "~" + loS : "~" + loS + " – " + hiS;
}

/* Quick at-a-glance summary for one trip: counts by entry type, the
   derived trip period (earliest check-in -> latest check-out across its
   stays) and a cost figure. Once stays carry dates the figure is the
   booked total (nights x nightly rate); before that it falls back to a
   nightly-budget range. By-enquiry / package stays are counted but kept
   out of the money math — they aren't /night-comparable. */
function tripSummary(items, dates) {
  dates = dates || {};
  const counts = { spot: 0, stay: 0, center: 0 };
  let budgetLo = 0, budgetHi = 0, pricedStayCount = 0, otherStayCount = 0;
  let totalLo = 0, totalHi = 0, datedPricedCount = 0, undatedPricedCount = 0;
  let totalNights = 0, earliestIn = "", latestOut = "";
  const stayCoords = [];
  items.forEach(e => {
    if (counts[e.type] != null) counts[e.type]++;
    if (e.type !== "stay") return;
    if (e.coords) stayCoords.push(e.coords);
    const d = dates[e.id];
    const nights = d ? tripNights(d.in, d.out) : 0;
    if (d && d.in && (!earliestIn || d.in < earliestIn)) earliestIn = d.in;
    if (d && d.out && (!latestOut || d.out > latestOut)) latestOut = d.out;
    totalNights += nights;
    if (!e.prices) return;
    const perNight = typeof e.prices.fromEUR === "number" && !/package|week/i.test(e.prices.unit || "");
    if (!perNight) { otherStayCount++; return; }
    pricedStayCount++;
    budgetLo += e.prices.fromEUR;
    budgetHi += (typeof e.prices.toEUR === "number" ? e.prices.toEUR : e.prices.fromEUR);
    if (nights > 0) {
      datedPricedCount++;
      totalLo += e.prices.fromEUR * nights;
      totalHi += (typeof e.prices.toEUR === "number" ? e.prices.toEUR : e.prices.fromEUR) * nights;
    } else {
      undatedPricedCount++;
    }
  });
  // Route distance — sum of straight-line hops between consecutive
  // stays in trip order. Stays are the legs of the trip; spots and
  // centers are visited from a base, not driven between.
  let routeKm = 0;
  for (let i = 0; i < stayCoords.length - 1; i++) {
    routeKm += distanceKm(stayCoords[i], stayCoords[i + 1]);
  }
  return { counts, budgetLo, budgetHi, pricedStayCount, otherStayCount,
           totalLo, totalHi, datedPricedCount, undatedPricedCount,
           totalNights, earliestIn, latestOut,
           routeKm, routeHops: Math.max(0, stayCoords.length - 1) };
}

function tripSummaryHTML(items, dates) {
  if (!items.length) return "";
  const s = tripSummary(items, dates);
  const parts = [];
  // The count pills double as the trip map's type filter — clicking one
  // toggles that type's pins (and, for stays, the route line) on the map.
  const pill = (type, n, singular, plural) =>
    `<button type="button" class="ts-pill" data-type="${type}" aria-pressed="true" title="Click to toggle ${plural} on the map"><span class="ts-dot ts-dot-${type}"></span>${n} ${n === 1 ? singular : plural}</button>`;
  if (s.counts.spot)   parts.push(pill("spot",   s.counts.spot,   "spot",   "spots"));
  if (s.counts.center) parts.push(pill("center", s.counts.center, "center", "centers"));
  if (s.counts.stay)   parts.push(pill("stay",   s.counts.stay,   "stay",   "stays"));

  let distStr = "";
  if (s.routeHops >= 1) {
    const km = fmtKm(s.routeKm);
    if (km) distStr = `<div class="ts-distance" title="Straight-line distance between the stays on this trip"><span class="ts-distance-icon" aria-hidden="true">🗺️</span>~${km}</div>`;
  }

  let periodStr = "";
  if (s.earliestIn && s.latestOut) {
    periodStr = `<div class="ts-period">
      <span class="ts-period-icon" aria-hidden="true">📅</span>
      <span class="ts-period-dates">${fmtTripPeriod(s.earliestIn, s.latestOut)}</span>
    </div>`;
  }
  let nightsStr = "";
  if (s.totalNights) {
    nightsStr = `<span class="ts-nights">${s.totalNights} night${s.totalNights === 1 ? "" : "s"}</span>`;
  }

  let budgetStr = "";
  if (s.datedPricedCount > 0) {
    const lo = fmtCurrency(s.totalLo), hi = fmtCurrency(s.totalHi);
    const bits = [];
    if (s.undatedPricedCount) bits.push(`${s.undatedPricedCount} without dates`);
    if (s.otherStayCount)     bits.push(`${s.otherStayCount} by enquiry`);
    const note = bits.length ? ` <span class="ts-note">(+${bits.join(", ")})</span>` : "";
    budgetStr = `<div class="ts-budget"><span class="ts-budget-label">Est. total</span><span class="ts-budget-val">${lo === hi ? lo : lo + " – " + hi}</span>${note}</div>`;
  } else if (s.pricedStayCount > 0) {
    const lo = fmtCurrency(s.budgetLo), hi = fmtCurrency(s.budgetHi);
    const note = s.otherStayCount ? ` <span class="ts-note">(+${s.otherStayCount} by enquiry / package)</span>` : "";
    budgetStr = `<div class="ts-budget"><span class="ts-budget-label">Nightly budget</span><span class="ts-budget-val">${lo === hi ? lo : lo + " – " + hi}</span>${note}</div>`;
  } else if (s.otherStayCount) {
    budgetStr = `<div class="ts-budget"><span class="ts-budget-label">Nightly budget</span><span class="ts-budget-val">By enquiry / package</span></div>`;
  }
  return `<div class="trip-summary">
    <div class="ts-pills">${parts.join("")}</div>
    <div class="ts-mid">${distStr}${periodStr}</div>
    <div class="ts-end">${nightsStr}${budgetStr}</div>
  </div>`;
}

/* The inline check-in / check-out fields for a stay's row in the
   Itinerary view — part of the stay row itself (no separate box), so
   the dates read as belonging to the stay. */
/* The nights + cost-estimate cell shown under a stay's date inputs.
   Split out so a date change can refresh just this cell in place,
   without re-rendering (and destroying) the date inputs. */
function stayCalcHTML(e, d) {
  const nights = tripNights(d.in, d.out);
  if (nights > 0) {
    const est = stayCostEstimate(e, nights);
    return `<span class="tsp-calc"><strong>${nights} night${nights === 1 ? "" : "s"}</strong>${est ? ` &middot; ${est}` : ""}</span>`;
  }
  if (d.in && d.out) return `<span class="tsp-calc tsp-warn">Check-out before check-in</span>`;
  if (d.in || d.out) return `<span class="tsp-calc tsp-hint">Add the other date</span>`;
  return `<span class="tsp-calc tsp-hint">Add dates</span>`;
}
function stayDatesHTML(trip, e) {
  const d = (trip.dates && trip.dates[e.id]) || { in: "", out: "" };
  return `<span class="trip-stay-dates">
    <label class="tsp-field">Check-in
      <input type="date" class="tsp-date" data-trip="${trip.id}" data-spot="${e.id}" data-field="in" value="${d.in}">
    </label>
    <label class="tsp-field">Check-out
      <input type="date" class="tsp-date" data-trip="${trip.id}" data-spot="${e.id}" data-field="out" value="${d.out}"${d.in ? ` min="${d.in}"` : ""}>
    </label>
    ${stayCalcHTML(e, d)}
  </span>`;
}

/* Type icon for a trip row — replaces the text label "Stay / Center /
   Spot" with a visual cue. Switched from custom SVG to emoji after
   LDW reported the SVG center/spot icons rendered as indistinct
   squiggles at small size on his device. Emojis render reliably and
   recognizably across all browsers; we lose the ability to tint them
   via CSS, but the coloured left-edge bar on the row already carries
   the per-type colour signal — the icon just adds shape recognition. */
function tripTypeIcon(type) {
  if (type === "stay")   return "🏠";
  if (type === "center") return "🎓";
  if (type === "spot")   return "🌊";
  return "";
}

/* One row in the Itinerary view — number + name, plus (for stays) the
   dates and a one-tap navigate button. Editable rows carry the drag
   handle, date inputs and remove button; readonly rows (shared trips)
   show the dates as plain text.
   Visual type system: each row gets a per-type class (trip-item-stay /
   -center / -spot) that drives the coloured left border + icon tint
   via CSS. Replaces the old text label "· Stay ·" / "· Center ·" with
   the icon prefix from tripTypeIcon — visible at a glance, no scanning. */
function tripItemRowHTML(t, e, idx, readonly) {
  // Only stays carry a number — they're the trip's "stops". Spots and
  // centers sit unnumbered under the stay they're coupled to.
  const stayNo = e.type === "stay"
    ? t.spotIds.map(byId).filter(x => x && x.type === "stay").indexOf(e) + 1
    : 0;
  const icon = tripTypeIcon(e.type);
  const main = `<span class="trip-item-main">${stayNo ? `<span class="ti-num">${stayNo}</span>` : ""}<span class="trip-item-icon">${icon}</span><a href="spot.html?id=${e.id}" draggable="false">${escHTML(e.name)}</a> <span class="muted">&middot; ${escHTML(e.town)}</span></span>`;
  const typeCls = ` trip-item-${e.type}`;
  const navBtn = e.coords
    ? `<button type="button" class="tc-btn tc-nav" data-nav="${e.id}" title="Navigate here" aria-label="Navigate to ${escHTML(e.name)}"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg></button>`
    : "";
  const bookBtn = bookBtnHTML(e);
  if (readonly) {
    const ctrl = (bookBtn || navBtn) ? `<span class="trip-item-ctrl">${bookBtn}${navBtn}</span>` : "";
    return `<div class="trip-item-row${typeCls}">
      ${main}
      ${e.type === "stay" ? stayDatesReadonlyHTML(t, e) : ""}
      ${ctrl}
    </div>`;
  }
  return `<div class="trip-item-row${typeCls}" draggable="true" data-trip="${t.id}" data-idx="${idx}" title="Drag to reorder">
    <span class="drag-grip" aria-hidden="true">⠿</span>
    ${main}
    ${e.type === "stay" ? stayDatesHTML(t, e) : ""}
    <span class="trip-item-ctrl">
      ${bookBtn}
      ${navBtn}
      <button class="tc-btn tc-del" data-remove data-trip="${t.id}" data-spot="${e.id}" aria-label="Remove from trip" title="Remove from trip">✕</button>
    </span>
  </div>`;
}

/* "Book ↗" link for a stay — opens its booking page in a new tab.
   Empty for spots and centers; shown in editable and shared trips. */
function bookBtnHTML(e) {
  if (!e || e.type !== "stay") return "";
  return `<a class="tc-book" href="${bookingHref(e)}" target="_blank" rel="noopener" title="Check availability — ${escHTML(e.name)}">Book ↗</a>`;
}

/* Read-only stay dates for a shared trip — the period + nights + cost
   as plain text, no inputs. */
function stayDatesReadonlyHTML(t, e) {
  const d = (t.dates && t.dates[e.id]) || { in: "", out: "" };
  const nights = tripNights(d.in, d.out);
  if (nights > 0) {
    const est = stayCostEstimate(e, nights);
    return `<span class="trip-stay-dates-ro">${fmtTripPeriod(d.in, d.out)} &middot; <strong>${nights} night${nights === 1 ? "" : "s"}</strong>${est ? " &middot; " + est : ""}</span>`;
  }
  return `<span class="trip-stay-dates-ro muted">No dates set</span>`;
}

/* Group a trip's items into legs for the Day-by-day view: each stay
   starts a leg, and the spots/centers that follow it in itinerary order
   belong to that leg. Spots/centers before the first stay stay
   unscheduled. */
function tripLegs(items) {
  const legs = [];
  const unscheduled = [];
  let current = null;
  items.forEach(e => {
    if (e.type === "stay") {
      current = { stay: e, extras: [] };
      legs.push(current);
    } else if (current) {
      current.extras.push(e);
    } else {
      unscheduled.push(e);
    }
  });
  return { legs, unscheduled };
}

/* The free-text note line under a day in the Day-by-day view. An
   editable trip shows a clickable note (or a faint "+ note"); a shared
   trip shows the note as plain text, and nothing when empty. */
function dayNoteHTML(tripId, dateStr, note, readonly) {
  note = note || "";
  if (readonly) {
    return note
      ? `<div class="dbd-note has-note"><span class="dbd-note-icon" aria-hidden="true">📝</span><span class="dbd-note-text">${escHTML(note)}</span></div>`
      : "";
  }
  return note
    ? `<button type="button" class="dbd-note has-note" data-note-trip="${tripId}" data-note-date="${dateStr}"><span class="dbd-note-icon" aria-hidden="true">📝</span><span class="dbd-note-text">${escHTML(note)}</span></button>`
    : `<button type="button" class="dbd-note dbd-note-add" data-note-trip="${tripId}" data-note-date="${dateStr}">+ note</button>`;
}

/* The Day-by-day timeline for one trip — stay legs in date order, a row
   per night, plus the spots/centers coupled to each leg. */
function dayByDayHTML(items, dates, dayNotes, tripId, readonly) {
  dates = dates || {};
  dayNotes = dayNotes || {};
  const { legs, unscheduled } = tripLegs(items);
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDay = d => `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}`;
  const chip = e => `<a class="dbd-chip" href="spot.html?id=${e.id}"><span class="ts-dot ts-dot-${e.type}"></span>${escHTML(e.name)}</a>`;
  const nearby = extras => extras.length
    ? `<div class="dbd-nearby"><span class="dbd-nearby-label">Nearby</span>${extras.map(chip).join("")}</div>`
    : "";

  // Split legs into dated (they form the timeline) and undated.
  const dated = [], undated = [];
  legs.forEach(leg => {
    const d = dates[leg.stay.id] || {};
    const nights = tripNights(d.in, d.out);
    if (nights > 0) { leg._in = d.in; leg._out = d.out; leg._nights = nights; dated.push(leg); }
    else undated.push(leg);
  });
  dated.sort((a, b) => a._in < b._in ? -1 : a._in > b._in ? 1 : 0);

  const undatedHTML = undated.map(leg =>
    `<div class="dbd-leg dbd-leg-undated">
      <div class="dbd-leg-head">
        <span class="ts-dot ts-dot-stay"></span>
        <a class="dbd-leg-name" href="spot.html?id=${leg.stay.id}">${escHTML(leg.stay.name)}</a>
        <span class="dbd-leg-town">${escHTML(leg.stay.town || "")}</span>
        <span class="dbd-leg-nodate">dates not set</span>
      </div>
      ${nearby(leg.extras)}
    </div>`).join("");
  const unschedHTML = unscheduled.length
    ? `<div class="dbd-unsched"><span class="dbd-unsched-label">Not scheduled yet</span>${unscheduled.map(chip).join("")}</div>`
    : "";

  if (!dated.length) {
    return `<div class="day-by-day">
      <p class="muted dbd-hint">Add check-in and check-out dates to your stays in the Itinerary view — your trip lays itself out day by day here.</p>
      ${undatedHTML}${unschedHTML}
    </div>`;
  }

  const pad = n => (n < 10 ? "0" : "") + n;
  const isoOf = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  let dayNum = 0;
  const legBlocks = dated.map((leg, legIdx) => {
    const inD = new Date(leg._in + "T00:00:00");
    let rows = "";
    for (let i = 0; i < leg._nights; i++) {
      dayNum++;
      const d = new Date(inD);
      d.setDate(d.getDate() + i);
      const iso = isoOf(d);
      rows += `<div class="dbd-day">
        <span class="dbd-daynum">Day ${dayNum}</span>
        <span class="dbd-date">${fmtDay(d)}</span>
        ${i === 0 ? `<span class="dbd-marker dbd-in">check in</span>` : ""}
      </div>${dayNoteHTML(tripId, iso, dayNotes[iso], readonly)}`;
    }
    // Check-out row — the morning you leave this stay. Not a numbered
    // night, so the day column stays blank. The last stay's check-out
    // is also where the trip ends.
    const outD = new Date(leg._out + "T00:00:00");
    const isLast = legIdx === dated.length - 1;
    rows += `<div class="dbd-day dbd-day-out">
      <span class="dbd-daynum"></span>
      <span class="dbd-date">${fmtDay(outD)}</span>
      <span class="dbd-marker dbd-out">check out</span>
      ${isLast ? `<span class="dbd-end-text">trip ends</span>` : ""}
    </div>${isLast ? dayNoteHTML(tripId, leg._out, dayNotes[leg._out], readonly) : ""}`;
    return `<div class="dbd-leg">
      <div class="dbd-leg-head">
        <span class="ts-dot ts-dot-stay"></span>
        <a class="dbd-leg-name" href="spot.html?id=${leg.stay.id}">${escHTML(leg.stay.name)}</a>
        <span class="dbd-leg-town">${escHTML(leg.stay.town || "")}</span>
        <span class="dbd-leg-nights">${leg._nights} night${leg._nights === 1 ? "" : "s"}</span>
        ${bookBtnHTML(leg.stay)}
      </div>
      <div class="dbd-days">${rows}</div>
      ${nearby(leg.extras)}
    </div>`;
  }).join("");

  return `<div class="day-by-day">${legBlocks}${undatedHTML}${unschedHTML}</div>`;
}

/* ---- ACCOUNT (fake, local) ---- */
/* "Your surf log" — the scratch-map (account page). The world map is the
   picker: tap any highlighted country to open its spots panel and tick
   them off. The region list above the map shows ONLY countries you've
   already surfed in (a progress bar each). The spots panel opens inline
   under a country's row if it has one, else in a slot just above the map.
   Driven by the "surfed" list. */
function surfLogData() {
  const surfedIds = new Set(WaveBaseAccount.getSurfed());
  const byCountry = {};
  WAVEBASE_DATA.forEach(e => {
    if (e.type !== "spot") return;
    const c = entryCountry(e);
    if (!byCountry[c]) byCountry[c] = { total: 0, done: 0 };
    byCountry[c].total++;
    if (surfedIds.has(e.id)) byCountry[c].done++;
  });
  const countries = Object.keys(byCountry).sort();
  let totalDone = 0, countriesDone = 0;
  countries.forEach(c => {
    totalDone += byCountry[c].done;
    if (byCountry[c].done > 0) countriesDone++;
  });
  return { byCountry: byCountry, countries: countries, totalDone: totalDone, countriesDone: countriesDone };
}

function surfLogHeroHTML(d) {
  return d.totalDone === 0
    ? `<p class="surflog-empty">No spots logged yet. Tap a highlighted country on the map below to tick off the ones you've surfed — or hit <strong>“Surfed it”</strong> on any spot page.</p>`
    : `<p class="surflog-total"><strong>${d.totalDone}</strong> spot${d.totalDone===1?"":"s"} surfed · <strong>${d.countriesDone}</strong> ${d.countriesDone===1?"country":"countries"} of ${d.countries.length}</p>`;
}

/* The spots of one country, grouped by town, each an inline surfed toggle. */
function surfLogSpotsPanel(country) {
  const surfedIds = new Set(WaveBaseAccount.getSurfed());
  const spots = WAVEBASE_DATA.filter(e => e.type === "spot" && entryCountry(e) === country);
  const byTown = {};
  spots.forEach(e => { (byTown[e.town] = byTown[e.town] || []).push(e); });
  const towns = Object.keys(byTown).sort();
  return `<div class="surflog-spots">` + towns.map(town => `
    <div class="surflog-town">
      <div class="surflog-town-name">${escHTML(town)}</div>
      <div class="surflog-town-spots">${byTown[town].map(e => {
        const done = surfedIds.has(e.id);
        return `<button type="button" class="surflog-spot${done ? " done" : ""}" data-surf="${e.id}" aria-pressed="${done}">
          <span class="surflog-spot-check" aria-hidden="true">${done ? "✓" : "+"}</span>
          <span class="surflog-spot-name">${escHTML(e.name)}</span>
        </button>`;
      }).join("")}</div>
    </div>`).join("") + `</div>`;
}

/* The region list — ONLY countries the user has surfed in (done > 0).
   Each row is a clickable progress bar; the selected country's spots
   panel is injected inline right under its row. */
function surfLogRegionsHTML(d, selected) {
  const visited = d.countries.filter(c => d.byCountry[c].done > 0);
  if (!visited.length) return "";
  return visited.map(c => {
    const t = d.byCountry[c].total, done = d.byCountry[c].done;
    const pct = t ? Math.round((done / t) * 100) : 0;
    const complete = done === t && t > 0;
    return `<div class="surflog-region${complete ? " is-complete" : ""}${c === selected ? " is-selected" : ""}">
      <button type="button" class="surflog-region-head" data-region="${escHTML(c)}">
        <span class="surflog-region-name">${escHTML(c)}${complete ? ` <span class="surflog-done-tag">✓ all done</span>` : ""}</span>
        <span class="surflog-region-count">${done} / ${t}</span>
      </button>
      <div class="surflog-bar"><div class="surflog-bar-fill" style="width:${pct}%"></div></div>
      ${c === selected ? surfLogPanelHTML(c, true) : ""}
    </div>`;
  }).join("");
}

/* The spots panel for the selected country. `inline` true → it sits under
   that country's progress-bar row (the row already names the country, so
   the heading drops the name); false → it's the standalone panel just
   above the map and needs the country name in its heading. */
function surfLogPanelHTML(country, inline) {
  if (!country) return "";
  const heading = inline ? "Tick off your spots" : `${escHTML(country)} — tick off your spots`;
  return `<div class="surflog-panel-inner">
    <div class="surflog-panel-head">
      <h3>${heading}</h3>
      <button type="button" class="surflog-panel-close" id="surflog-close" aria-label="Close">✕</button>
    </div>
    <div class="surflog-search">
      <span class="surflog-search-icon" aria-hidden="true">🔍</span>
      <input type="search" class="surflog-search-input" placeholder="Search a spot or town…" autocomplete="off" enterkeyhint="search" aria-label="Search spots">
    </div>
    ${surfLogSpotsPanel(country)}
  </div>`;
}

function surfLogHTML() {
  const d = surfLogData();
  return `<section class="acc-block" id="surf-log">
    <h2>Your surf log</h2>
    <p class="muted form-note">Tap a highlighted country on the map to tick off its spots — or hit “Surfed it” on any spot page.</p>
    <div id="surflog-hero">${surfLogHeroHTML(d)}</div>
    <div class="surflog-regions" id="surflog-regions">${surfLogRegionsHTML(d, null)}</div>
    <div id="surflog-panel"></div>
    <div class="surflog-map-wrap">
      <div class="surflog-map" id="surflog-map" aria-label="Map — tap a country to tick off its spots"></div>
      <p class="surflog-map-cap">Green = surfed · teal = spots to discover. Tap a highlighted country to tick off its spots.</p>
    </div>
  </section>`;
}

/* Re-render hero + regions + panel in place; the world map SVG stays put
   (just re-tagged, no re-fetch, no flicker). A surfed country shows its
   panel inline under its progress-bar row; a country with no row yet
   shows it in the standalone slot just above the map. */
function refreshSurfLog(selected, scroll) {
  const hero = document.getElementById("surflog-hero");
  const regions = document.getElementById("surflog-regions");
  const panel = document.getElementById("surflog-panel");
  if (!hero || !regions || !panel) return;
  const d = surfLogData();
  const isVisited = !!(selected && d.byCountry[selected] && d.byCountry[selected].done > 0);
  hero.innerHTML = surfLogHeroHTML(d);
  regions.innerHTML = surfLogRegionsHTML(d, selected);
  // Visited country → panel rendered inline by surfLogRegionsHTML; a brand-
  // new country has no row, so it goes in the standalone slot above the map.
  panel.innerHTML = (selected && !isVisited) ? surfLogPanelHTML(selected, false) : "";
  wireSurfLog(selected);
  renderSurfLogMap();
  if (selected && scroll) {
    const sec = document.getElementById("surf-log");
    const target = sec && sec.querySelector(".surflog-panel-inner");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function wireSurfLog(selected) {
  const sec = document.getElementById("surf-log");
  if (!sec) return;
  // Region row → open/close that country's panel.
  sec.querySelectorAll(".surflog-region-head").forEach(btn => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.region;
      refreshSurfLog(c === selected ? null : c, c !== selected);
    });
  });
  // Spot toggle → mark surfed; keep the panel on the same country. Scroll
  // only when the panel relocates (a country's first/last spot flips it
  // between the inline row slot and the standalone slot above the map).
  sec.querySelectorAll(".surflog-spot").forEach(btn => {
    btn.addEventListener("click", () => {
      // A toggle re-renders the panel — remember any active spot search
      // so it can be restored straight after.
      const si = sec.querySelector(".surflog-search-input");
      surfLogReopenQuery = si ? si.value : null;
      const before = surfLogData().byCountry[selected];
      const wasOn = !!(before && before.done > 0);
      WaveBaseAccount.toggleSurfed(btn.dataset.surf);
      const after = surfLogData().byCountry[selected];
      const nowOn = !!(after && after.done > 0);
      refreshSurfLog(selected, wasOn !== nowOn);
    });
  });
  // Panel close button.
  const close = document.getElementById("surflog-close");
  if (close) close.addEventListener("click", () => refreshSurfLog(null, false));
  // Spot search — type to filter, arrows + Enter to tick off by keyboard.
  wireSurfLogSearch(sec);
  // Re-apply a search that was active when a toggle forced this re-render.
  if (surfLogReopenQuery) {
    const si = sec.querySelector(".surflog-search-input");
    if (si) {
      si.value = surfLogReopenQuery;
      applySurfLogFilter(sec, surfLogReopenQuery);
      si.focus();
    }
    surfLogReopenQuery = null;
  }
}

/* Filter the surf-log spot chips by a query — matches a spot's name or
   its town; a town with no remaining matches is hidden entirely. */
function applySurfLogFilter(sec, q) {
  q = (q || "").trim().toLowerCase();
  sec.querySelectorAll(".surflog-town").forEach(town => {
    const tn = town.querySelector(".surflog-town-name");
    const townName = tn ? tn.textContent.toLowerCase() : "";
    let anyVisible = false;
    town.querySelectorAll(".surflog-spot").forEach(spot => {
      const sn = spot.querySelector(".surflog-spot-name");
      const name = sn ? sn.textContent.toLowerCase() : "";
      const match = !q || name.indexOf(q) !== -1 || townName.indexOf(q) !== -1;
      spot.classList.toggle("is-hidden", !match);
      if (match) anyVisible = true;
    });
    town.classList.toggle("is-hidden", !anyVisible);
  });
}

/* Wire the surf-log spot search: filter as you type, arrow keys move a
   highlight through the visible chips, Enter ticks the highlighted one. */
function wireSurfLogSearch(sec) {
  const input = sec.querySelector(".surflog-search-input");
  if (!input) return;
  let activeIdx = -1;
  const visible = () => Array.from(sec.querySelectorAll(".surflog-spot:not(.is-hidden)"));
  const clearActive = () => {
    sec.querySelectorAll(".surflog-spot.is-active").forEach(s => s.classList.remove("is-active"));
    activeIdx = -1;
  };
  const setActive = i => {
    sec.querySelectorAll(".surflog-spot.is-active").forEach(s => s.classList.remove("is-active"));
    const spots = visible();
    if (!spots.length) { activeIdx = -1; return; }
    activeIdx = (i + spots.length) % spots.length;
    spots[activeIdx].classList.add("is-active");
    spots[activeIdx].scrollIntoView({ block: "nearest" });
  };
  input.addEventListener("input", () => {
    applySurfLogFilter(sec, input.value);
    if (input.value.trim()) setActive(0); else clearActive();
  });
  input.addEventListener("keydown", ev => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); setActive(activeIdx + 1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive(activeIdx - 1); }
    else if (ev.key === "Enter") {
      const spots = visible();
      if (activeIdx >= 0 && spots[activeIdx]) { ev.preventDefault(); spots[activeIdx].click(); }
    }
  });
}

/* Tints the world map for the surf log — surfed countries lit green,
   countries with spots-but-not-yet-surfed teal, the rest plain. WaveBase
   countries are clickable (open their spots panel). If the SVG is already
   loaded, just re-tag it (no re-fetch). */
function renderSurfLogMap() {
  const host = document.getElementById("surflog-map");
  if (!host || typeof COUNTRY_TO_ISO === "undefined") return;
  const surfedIds = new Set(WaveBaseAccount.getSurfed());
  const surfedCountries = new Set(), spotCountries = new Set();
  WAVEBASE_DATA.forEach(e => {
    if (e.type !== "spot") return;
    const c = entryCountry(e);
    spotCountries.add(c);
    if (surfedIds.has(e.id)) surfedCountries.add(c);
  });
  const isoToName = {};
  Object.keys(COUNTRY_TO_ISO).forEach(name => { isoToName[COUNTRY_TO_ISO[name]] = name; });
  function tag(svg) {
    svg.querySelectorAll("[id]").forEach(node => {
      const iso = node.getAttribute("id");
      if (!iso || typeof ISO_TO_CONTINENT === "undefined" || !ISO_TO_CONTINENT[iso]) return;
      node.classList.add("country");
      const name = isoToName[iso];
      const isWaveBase = !!(name && spotCountries.has(name));
      node.classList.toggle("country-surfed", !!(name && surfedCountries.has(name)));
      node.classList.toggle("country-available", isWaveBase && !surfedCountries.has(name));
      if (isWaveBase) node.setAttribute("data-country", name);
    });
  }
  const existing = host.querySelector("svg");
  if (existing) { tag(existing); return; }
  fetch("worldmap.svg")
    .then(r => r.ok ? r.text() : Promise.reject(r.status))
    .then(svgText => {
      host.innerHTML = svgText;
      const svg = host.querySelector("svg");
      if (!svg) return;
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.classList.add("surflog-svg");
      tag(svg);
      // Click a highlighted country → open its spots panel. Delegation,
      // added once — the SVG node persists across surf-log refreshes.
      host.addEventListener("click", e => {
        const node = e.target.closest("[data-country]");
        if (node) refreshSurfLog(node.getAttribute("data-country"), true);
      });
    })
    .catch(() => { host.innerHTML = `<p class="muted" style="padding:14px;">Map unavailable.</p>`; });
}

/* "+ Add a place" — add spots/stays/centers to a trip from its own
   card, without leaving for a detail page. reopenAddFor re-opens the
   search field after an add re-renders the account. */
let reopenAddFor = null;
/* Surf-log spot search query, preserved across the re-render a tick-off
   triggers so the search box doesn't reset itself mid-use. */
let surfLogReopenQuery = null;
function wireTripAdd(root) {
  root.querySelectorAll(".trip-add").forEach(box => {
    const tripId = box.dataset.trip;
    const btn = box.querySelector(".trip-add-btn");
    const search = box.querySelector(".trip-add-search");
    const input = box.querySelector(".trip-add-input");
    const results = box.querySelector(".trip-add-results");
    let activeIdx = -1;
    const open = () => { btn.hidden = true; search.hidden = false; input.focus(); };
    const close = () => { search.hidden = true; btn.hidden = false; input.value = ""; results.innerHTML = ""; activeIdx = -1; };
    // Highlight the i-th selectable result (wraps around) for arrow-key nav.
    const setActive = i => {
      const opts = Array.from(results.querySelectorAll(".trip-add-result:not([disabled])"));
      if (!opts.length) { activeIdx = -1; return; }
      activeIdx = (i + opts.length) % opts.length;
      opts.forEach((o, k) => o.classList.toggle("is-active", k === activeIdx));
      opts[activeIdx].scrollIntoView({ block: "nearest" });
    };
    btn.addEventListener("click", open);
    box.querySelector(".trip-add-close").addEventListener("click", close);
    // Arrow keys move the highlight through the results; Enter adds the
    // highlighted one; Escape closes the search.
    input.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { close(); return; }
      const opts = Array.from(results.querySelectorAll(".trip-add-result:not([disabled])"));
      if (ev.key === "ArrowDown") { ev.preventDefault(); setActive(activeIdx + 1); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive(activeIdx - 1); }
      else if (ev.key === "Enter" && activeIdx >= 0 && opts[activeIdx]) {
        ev.preventDefault();
        opts[activeIdx].click();
      }
    });
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ""; activeIdx = -1; return; }
      const trip = WaveBaseAccount.getTrips().find(x => x.id === tripId);
      const inTrip = new Set(trip ? trip.spotIds : []);
      const matches = WAVEBASE_DATA.filter(e =>
        (e.name && e.name.toLowerCase().indexOf(q) !== -1) ||
        (e.town && e.town.toLowerCase().indexOf(q) !== -1)
      ).slice(0, 8);
      results.innerHTML = matches.length
        ? matches.map(e => {
            const added = inTrip.has(e.id);
            return `<button type="button" class="trip-add-result" data-add-id="${e.id}"${added ? " disabled" : ""}>
              <span class="ts-dot ts-dot-${e.type}"></span>
              <span class="trip-add-name">${escHTML(e.name)}</span>
              <span class="trip-add-meta muted">${typeLabel(e.type)} &middot; ${escHTML(e.town)}</span>
              ${added ? `<span class="trip-add-added">added</span>` : ""}
            </button>`;
          }).join("")
        : `<div class="trip-add-noresult muted">No match — try another name or town.</div>`;
      results.querySelectorAll(".trip-add-result:not([disabled])").forEach(r => {
        r.addEventListener("click", () => {
          WaveBaseAccount.addToTrip(tripId, r.dataset.addId);
          reopenAddFor = tripId;
          renderAccount();
        });
      });
      // Pre-highlight the first hit so Enter adds it without arrowing.
      setActive(0);
    });
    if (reopenAddFor === tripId) {
      reopenAddFor = null;
      // After an add, re-open the search box so a follow-up add is one
      // click away. On touch (iPad/iPhone) DON'T auto-focus the input —
      // that would pop the soft keyboard back up immediately after the
      // user just picked a result, which is annoying (LDW). Desktop
      // keeps the auto-focus for keyboard-driven flow.
      const isTouch = matchMedia("(pointer: coarse)").matches;
      btn.hidden = true;
      search.hidden = false;
      if (!isTouch) input.focus();
    }
  });
}

// Persisted collapse state for trip cards on the account page — keeps
// the overview short when the user has many trips. Stored as a JSON
// array of trip IDs in localStorage under "wavebase_trips_collapsed".
function getCollapsedTrips() {
  try { return JSON.parse(localStorage.getItem("wavebase_trips_collapsed") || "[]") || []; }
  catch (e) { return []; }
}
function setTripCollapsed(id, val) {
  let arr = getCollapsedTrips();
  if (val) { if (arr.indexOf(id) === -1) arr.push(id); }
  else { arr = arr.filter(x => x !== id); }
  try { localStorage.setItem("wavebase_trips_collapsed", JSON.stringify(arr)); } catch (e) {}
}
function isTripCollapsed(id) { return getCollapsedTrips().indexOf(id) !== -1; }

// renderAccount's scroll-restore default is "stay where you were";
// set this from a callsite (currently: + New trip) to override it with
// "scroll the freshly-rendered card with this trip ID into view."
let __renderAccountScrollTo = null;

// Profile section toggles between a compact view-mode summary and a
// full edit-mode form. Default: view (less scrolling, less to look
// at). Onboarding flow always shows the form. Persists across
// re-renders of the account page (e.g. after adding a trip we don't
// kick the user out of an edit they were in the middle of).
let __profileEditMode = false;

/* One-line label maps for profile multi-selects. Same shape used in
   admin.js — kept duplicated here to avoid loading admin.js on every
   page just for these constants. */
const _PROFILE_SUMMARY_LABELS = {
  surfType:       { surfer: "Surf", windsurfer: "Windsurf", kitesurfer: "Kitesurf", wingfoiler: "Wing-foil" },
  discipline:     { freeride: "Freeride", wave: "Wave", freestyle: "Freestyle", slalom: "Slalom" },
  travelStyles:   { Solo: "Solo / chill", Couple: "With partner", Family: "Family with kids", Friends: "Group of friends" },
  tripPriorities: { "wave-time": "Wave time", "lessons": "Lessons", "vibe-food": "Vibe + food", "hidden-gems": "Hidden gems", "affordable": "Budget", "comfort": "Comfort" },
  level:          { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
};
function _labelList(arr, dictKey) {
  const dict = _PROFILE_SUMMARY_LABELS[dictKey] || {};
  return (arr || []).map(k => dict[k] || k).filter(Boolean).join(", ");
}
function _profileSummaryRow(label, value, emoji) {
  // Show "—" for empty so the layout stays predictable + the user
  // sees the full shape of what's tracked. escHTML on the value
  // because some fields (name, country) can include user input.
  const v = (value && String(value).trim()) ? escHTML(value) : `<span class="muted">—</span>`;
  return `<div class="prof-summary-row">
    <span class="prof-summary-k">${emoji} ${label}</span>
    <span class="prof-summary-v">${v}</span>
  </div>`;
}
function _profileSummaryHTML(p, authEmail) {
  // Show authEmail (server-side identity) as the email rather than
  // p.email which is the local-form field — local can be stale or
  // empty for a freshly-skipped onboarding.
  const surf  = _labelList(p.surfType, "surfType");
  const disc  = _labelList(p.discipline, "discipline");
  const surfLine = [surf, _PROFILE_SUMMARY_LABELS.level[p.level] || "", disc].filter(Boolean).join(" · ");
  const trav  = _labelList(p.travelStyles, "travelStyles");
  const prio  = _labelList(p.tripPriorities, "tripPriorities");
  return `
    ${_profileSummaryRow("Name",      p.name,            "🧑")}
    ${_profileSummaryRow("Email",     authEmail,         "📧")}
    ${_profileSummaryRow("Born",      p.birthYear,       "🎂")}
    ${_profileSummaryRow("Home base", p.homeCountry,     "🌍")}
    ${_profileSummaryRow("Surfing",   surfLine,          "🏄")}
    ${_profileSummaryRow("Travel",    trav,              "✈️")}
    ${_profileSummaryRow("Looking for", prio,            "🎯")}
    ${_profileSummaryRow("Found us via", p.howDidYouFindUs, "📍")}
  `;
}

/* Renders a whole trip card — overview header, the Itinerary <-> Day by
   day views and the map. readonly drops the edit affordances (drag,
   date inputs, remove, share, add) — used for shared-trip pages. */
function tripCardHTML(t, readonly) {
  const items = t.spotIds.map(byId).filter(Boolean);
  const located = items.filter(e => e.coords);
  const list = items.length ? (() => {
    const { legs, unscheduled } = tripLegs(items);
    const idxOf = e => items.indexOf(e);
    const rows = arr => arr.map(e => tripItemRowHTML(t, e, idxOf(e), readonly)).join("");
    if (!legs.length) return `<div class="trip-items">${rows(items)}</div>`;
    const loose = unscheduled.length
      ? `<div class="trip-leg trip-leg-loose"><span class="trip-leg-loose-label">Not coupled to a stay yet</span>${rows(unscheduled)}</div>`
      : "";
    const legHTML = legs.map(leg => {
      const extras = leg.extras.length
        ? `<div class="trip-leg-extras">${rows(leg.extras)}</div>` : "";
      return `<div class="trip-leg">${tripItemRowHTML(t, leg.stay, idxOf(leg.stay), readonly)}${extras}</div>`;
    }).join("");
    return `<div class="trip-items">${loose}${legHTML}</div>`;
  })() : (readonly
      ? `<p class="muted">This trip is empty.</p>`
      : `<p class="muted trip-empty-line">This trip is empty — search below to add your first spot, stay or center.</p>`);
  const mapDiv = located.length ? `<div class="trip-map" id="trip-map-${t.id}"></div>` : "";
  const summary = tripSummaryHTML(items, t.dates);
  const viewToggle = items.length ? `<div class="trip-view-toggle" role="tablist">
      <button type="button" class="tv-tab active" data-view="itinerary" role="tab" aria-selected="true">Itinerary</button>
      <button type="button" class="tv-tab" data-view="day" role="tab" aria-selected="false">Day by day</button>
    </div>` : "";
  const hasDatedStay = items.some(e => e.type === "stay" && tripNights(((t.dates || {})[e.id] || {}).in, ((t.dates || {})[e.id] || {}).out) > 0);
  const calBtn = hasDatedStay ? `<button type="button" class="link-btn" data-ics="${t.id}">add to calendar</button>` : "";
  // A shared (read-only) trip still gets "add to calendar" — just not
  // share / remove, which only make sense on your own trip.
  const headActions = readonly
    ? (calBtn ? `<span class="trip-head-actions">${calBtn}</span>` : "")
    : `<span class="trip-head-actions">${
        items.length ? `<button type="button" class="link-btn" data-share="${t.id}">share</button>` : ""
      }${calBtn}<button type="button" class="link-btn" data-del="${t.id}">remove</button></span>`;
  // Trip name — a plain heading on the shared (read-only) page; a
  // click-to-rename heading on the owner's account page.
  const nameEl = readonly
    ? `<h3>${escHTML(t.name)}</h3>`
    : `<h3 class="trip-name" data-rename="${t.id}" role="button" tabindex="0" title="Rename this trip"><span class="trip-name-text">${escHTML(t.name)}</span><span class="trip-name-pencil" aria-hidden="true">✎</span></h3>`;
  const addBox = readonly ? "" : `<div class="trip-add" data-trip="${t.id}">
    <button type="button" class="trip-add-btn"${items.length ? "" : " hidden"}>+ Add a place</button>
    <div class="trip-add-search"${items.length ? " hidden" : ""}>
      <div class="trip-add-bar">
        <input type="search" class="trip-add-input" placeholder="Search a spot, stay or center…" autocomplete="off" enterkeyhint="search">
        <button type="button" class="trip-add-close" aria-label="Done">✕</button>
      </div>
      <div class="trip-add-results"></div>
    </div>
  </div>`;
  // Collapse toggle (only on the owner's account, not on shared trips).
  // Initial state from localStorage so a collapsed trip stays collapsed
  // across re-renders. Click handler just toggles the class on the .trip
  // element + persists — no full re-render needed.
  const collapsed = !readonly && isTripCollapsed(t.id);
  const collapseBtn = readonly ? "" : `<button type="button" class="trip-collapse-btn" data-collapse="${t.id}" aria-label="Show / hide trip" title="Show / hide trip"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></button>`;
  return `<div class="trip${collapsed ? " is-collapsed" : ""}" id="trip-${t.id}">
    <header class="trip-overview">
      <div class="trip-head"><span class="trip-name-wrap">${collapseBtn}${nameEl}</span>${headActions}</div>
      ${summary}
    </header>
    ${viewToggle}
    <div class="trip-view trip-view-itinerary">${list}${addBox}${mapDiv}</div>
    ${items.length ? `<div class="trip-view trip-view-day" hidden>${dayByDayHTML(items, t.dates, t.dayNotes, t.id, readonly)}</div>` : ""}
  </div>`;
}

/* Click a trip's name (account page only) to rename it inline. The
   heading is swapped for a text input; Enter or blur saves, Escape
   cancels. No full re-render is needed — nothing else on the page
   shows the trip name, so only the heading text is updated. */
function wireTripRename(root) {
  root.querySelectorAll("h3.trip-name[data-rename]").forEach(h3 => {
    const open = () => {
      if (h3.dataset.editing === "1") return;
      const id = h3.dataset.rename;
      const trip = WaveBaseAccount.getTrips().find(x => x.id === id);
      if (!trip) return;
      h3.dataset.editing = "1";
      const oldName = trip.name;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "trip-name-input";
      input.value = oldName;
      input.maxLength = 60;
      input.setAttribute("aria-label", "Trip name");
      h3.style.display = "none";
      h3.insertAdjacentElement("afterend", input);
      input.focus();
      input.select();
      let done = false;
      const finish = save => {
        if (done) return;
        done = true;
        const val = input.value.trim();
        input.remove();
        h3.style.display = "";
        delete h3.dataset.editing;
        if (save && val && val !== oldName) {
          WaveBaseAccount.renameTrip(id, val);
          const txt = h3.querySelector(".trip-name-text");
          if (txt) txt.textContent = val;
        }
      };
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); finish(true); }
        else if (e.key === "Escape") { e.preventDefault(); finish(false); }
      });
      input.addEventListener("blur", () => finish(true));
    };
    h3.addEventListener("click", open);
    h3.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

/* Day-by-day notes — click a day's note (or its "+ note") to edit it
   inline. Enter / blur saves, Escape cancels. Only that one note element
   is swapped, so the rest of the trip card is left untouched. */
function wireTripDayNotes(root) {
  root.querySelectorAll("button.dbd-note[data-note-trip]").forEach(btn => {
    btn.addEventListener("click", () => editDayNote(btn));
  });
}
function editDayNote(btn) {
  const tripId = btn.dataset.noteTrip, dateStr = btn.dataset.noteDate;
  const trip = WaveBaseAccount.getTrips().find(x => x.id === tripId);
  if (!trip) return;
  const cur = (trip.dayNotes || {})[dateStr] || "";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "dbd-note-input";
  input.value = cur;
  input.maxLength = 140;
  input.placeholder = "e.g. surf lesson 9am · rest day · drive to Taghazout";
  input.setAttribute("aria-label", "Day note");
  btn.replaceWith(input);
  input.focus();
  input.select();
  let done = false;
  const finish = save => {
    if (done) return;
    done = true;
    const val = input.value.trim();
    if (save && val !== cur) WaveBaseAccount.setDayNote(tripId, dateStr, val);
    const tmp = document.createElement("div");
    tmp.innerHTML = dayNoteHTML(tripId, dateStr, save ? val : cur, false);
    const fresh = tmp.firstElementChild;
    input.replaceWith(fresh);
    fresh.addEventListener("click", () => editDayNote(fresh));
  };
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); finish(true); }
    else if (e.key === "Escape") { e.preventDefault(); finish(false); }
  });
  input.addEventListener("blur", () => finish(true));
}

/* Wire the Itinerary <-> Day by day toggle on every trip card under root.
   Shared between the account page and the shared-trip page. */
function wireTripToggles(root) {
  root.querySelectorAll(".tv-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const card = tab.closest(".trip");
      if (!card) return;
      const view = tab.dataset.view;
      card.querySelectorAll(".tv-tab").forEach(b => {
        const on = b === tab;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      card.querySelectorAll(".trip-view").forEach(v => {
        v.hidden = !v.classList.contains("trip-view-" + view);
      });
      // Leaflet mis-sizes if its container was display:none — nudge it.
      if (view === "itinerary") {
        const mapEl = card.querySelector(".trip-map");
        if (mapEl && mapEl._wbMap) setTimeout(() => mapEl._wbMap.invalidateSize(), 0);
      }
    });
  });
}

/* Pack a trip into a URL-safe string — the whole trip (name, place ids,
   dates) rides in the link itself, so a shared trip needs no backend. */
function encodeTrip(t) {
  const json = JSON.stringify({ n: t.name, s: t.spotIds, d: t.dates || {}, dn: t.dayNotes || {} });
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
/* Unpack + sanitise a shared-trip string from a URL. Returns null on
   anything malformed. */
function decodeTrip(param) {
  try {
    let b64 = String(param).replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const p = JSON.parse(decodeURIComponent(escape(atob(b64))));
    const isDate = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
    const dates = {};
    if (p && p.d && typeof p.d === "object") {
      Object.keys(p.d).forEach(k => {
        const v = p.d[k] || {};
        const din = isDate(v.in) ? v.in : "";
        const dout = isDate(v.out) ? v.out : "";
        if (din || dout) dates[String(k)] = { in: din, out: dout };
      });
    }
    const dayNotes = {};
    if (p && p.dn && typeof p.dn === "object") {
      Object.keys(p.dn).forEach(k => {
        if (isDate(k) && typeof p.dn[k] === "string") {
          const v = p.dn[k].trim().slice(0, 140);
          if (v) dayNotes[k] = v;
        }
      });
    }
    return {
      id: "shared",
      name: (p && typeof p.n === "string") ? p.n.slice(0, 120) : "Shared trip",
      spotIds: (p && Array.isArray(p.s)) ? p.s.filter(x => typeof x === "string").slice(0, 80) : [],
      dates: dates,
      dayNotes: dayNotes
    };
  } catch (e) {
    return null;
  }
}

/* Build an iCalendar (.ics) for a trip — one all-day event per dated
   stay, check-in to check-out. Returns null if no stay has dates. */
function tripICS(t) {
  const items = (t.spotIds || []).map(byId).filter(Boolean);
  const dates = t.dates || {};
  const compact = s => s.replace(/-/g, "");
  const esc = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WaveBase//Trip//EN", "CALSCALE:GREGORIAN"];
  let n = 0;
  items.forEach(e => {
    if (e.type !== "stay") return;
    const d = dates[e.id] || {};
    if (!d.in || !d.out) return;
    n++;
    lines.push("BEGIN:VEVENT",
      "UID:wavebase-" + t.id + "-" + e.id + "@wavebase",
      "DTSTAMP:" + stamp,
      "DTSTART;VALUE=DATE:" + compact(d.in),
      "DTEND;VALUE=DATE:" + compact(d.out),
      "SUMMARY:" + esc(e.name + (e.town ? " — " + e.town : "")),
      "DESCRIPTION:" + esc((t.name || "Trip") + " · planned on WaveBase"));
    if (e.town) lines.push("LOCATION:" + esc(e.town));
    lines.push("END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return n ? lines.join("\r\n") : null;
}

/* Download a trip as an .ics file the user can import into any calendar. */
function downloadTripICS(t) {
  const ics = tripICS(t);
  if (!ics) return;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (t.name || "trip").trim().replace(/[^\w.-]+/g, "-").toLowerCase().slice(0, 50) + ".ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* The shared-trip page (trip.html) — decodes the trip from the ?t= URL
   param and renders it read-only, with a button to copy it into the
   viewer's own WaveBase. */
function renderSharedTrip() {
  const root = document.getElementById("shared-trip-root");
  if (!root) return;
  const param = new URLSearchParams(location.search).get("t");
  const trip = param ? decodeTrip(param) : null;
  const items = trip ? trip.spotIds.map(byId).filter(Boolean) : [];
  if (!trip || !items.length) {
    root.innerHTML = `<div class="shared-trip-empty">
      <h1>Trip link</h1>
      <p class="muted">This shared trip link is empty or broken — ask whoever sent it for a fresh one.</p>
      <a class="btn" href="index.html">Go to WaveBase</a>
    </div>`;
    return;
  }
  root.innerHTML = `
    <p class="shared-trip-intro">📍 A WaveBase trip, shared with you</p>
    ${tripCardHTML(trip, true)}
    <div class="shared-trip-actions">
      <button type="button" class="btn" id="save-shared-trip">Save to my WaveBase</button>
      <a class="btn ghost" href="index.html">Explore WaveBase</a>
    </div>`;
  wireTripToggles(root);
  wireTripNav(root);
  initTripMaps([trip]);
  const icsBtn = root.querySelector("[data-ics]");
  if (icsBtn) icsBtn.addEventListener("click", () => downloadTripICS(trip));
  const saveBtn = document.getElementById("save-shared-trip");
  if (saveBtn) saveBtn.addEventListener("click", () => {
    const nt = WaveBaseAccount.addTrip(trip.name);
    trip.spotIds.filter(id => byId(id)).forEach(id => WaveBaseAccount.addToTrip(nt.id, id));
    Object.keys(trip.dates || {}).forEach(id => {
      const d = trip.dates[id] || {};
      if (d.in)  WaveBaseAccount.setStayDate(nt.id, id, "in", d.in);
      if (d.out) WaveBaseAccount.setStayDate(nt.id, id, "out", d.out);
    });
    Object.keys(trip.dayNotes || {}).forEach(dt => WaveBaseAccount.setDayNote(nt.id, dt, trip.dayNotes[dt]));
    location.href = "account.html#trips";
  });
}

/* Full list of UN-recognised countries, alphabetised. Used by the
   profile-form Home base dropdown. Alphabetical so the native browser
   picker (especially on iOS) is predictable; type-the-first-letter
   jumps work in desktop browsers. */
const WAVEBASE_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
  "Congo (Kinshasa)", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

/* ============================================================
   WaveBaseProfileForm — extracted profile-form renderer so the same
   4 prof-blocks work both on the account page (renderAccount) and
   inside the auth modal's "profile" step (account.js).

   Two methods:
     buildBlocksHTML(p)
       Returns the HTML for the 4 prof-blocks pre-filled from `p`
       (a WaveBaseAccount-shaped profile object). No wrapper div,
       no actions row — caller wraps + adds its own actions.

     wire(rootEl, opts)
       Wires up auto-save (localStorage every blur/change), debounced
       server-sync when signed in, and the conditional discipline
       fieldset show/hide. opts:
         - onSavedFlash()    — called after each save (account page
                               uses to flash the "✓ saved" badge)
         - updateProgress()  — called after each save AND on input
                               (account page uses to update the
                               "Profile X% complete" pill live)
         - serverSync (bool) — default true, set false to skip the
                               PATCH /users/me/profile call
       Returns { flushPendingSave } — call to force the debounced
       server sync to fire now and get a promise back. Modal uses
       this on the Continue button so the user isn't left with a
       pending save mid-redirect.
   ============================================================ */
const WaveBaseProfileForm = (function () {
  const SURF_TYPES = [
    { key: "surfer",     label: "Surf"      },
    { key: "windsurfer", label: "Windsurf"  },
    { key: "kitesurfer", label: "Kitesurf"  },
    { key: "wingfoiler", label: "Wing-foil" }
  ];
  const DISCIPLINES = [
    { key: "freeride",  label: "Freeride"  },
    { key: "wave",      label: "Wave"      },
    { key: "freestyle", label: "Freestyle" },
    { key: "slalom",    label: "Slalom"    }
  ];
  const TRAVEL_STYLES = [
    { key: "Solo",    label: "Solo / chill"      },
    { key: "Couple",  label: "With partner"      },
    { key: "Family",  label: "Family with kids"  },
    { key: "Friends", label: "Group of friends"  }
  ];
  const TRIP_PRIORITIES = [
    { key: "wave-time",   label: "Wave time, lots of it"     },
    { key: "lessons",     label: "Lessons / improvement"     },
    { key: "vibe-food",   label: "Vibe, food, downtime"      },
    { key: "hidden-gems", label: "Hidden gems"               },
    { key: "affordable",  label: "Affordable / budget"       },
    { key: "comfort",     label: "Comfort / a bit of luxury" }
  ];
  const FOUND_OPTS = [
    "Friend / word of mouth", "Social media", "Search engine",
    "Surf forum / community", "Press / article", "Other"
  ];
  const LEVEL_DESCS = {
    beginner:     "Beginner — just starting out",
    intermediate: "Intermediate — pop up, paddle out, ride the face",
    advanced:     "Advanced — overhead, tubes, no-paddle takeoffs"
  };
  // Backend wants title-cased SurfLevel enum values.
  const SURF_LEVEL_MAP = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

  function _esc(s) {
    return (typeof escHTML === "function") ? escHTML(s) : String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }
  function _cb(name, items, selected) {
    return items.map(it =>
      `<label class="cb"><input type="checkbox" name="${name}" value="${it.key}" ${selected.indexOf(it.key) !== -1 ? "checked" : ""}> ${it.label}</label>`
    ).join("");
  }
  function _readChecks(rootEl, name) {
    return Array.from(rootEl.querySelectorAll('input[name="' + name + '"]:checked')).map(el => el.value);
  }
  function _buildApiPatch(rootEl) {
    const get = id => rootEl.querySelector("#" + id);
    const byr = parseInt(get("p-birthyear").value, 10);
    return {
      name:                (get("p-name").value || "").trim() || null,
      birth_year:          Number.isFinite(byr) ? byr : null,
      home_country:        get("p-country").value || null,
      surf_types:          _readChecks(rootEl, "surfType"),
      surf_level:          SURF_LEVEL_MAP[get("p-level").value] || null,
      discipline:          _readChecks(rootEl, "discipline"),
      travel_styles:       _readChecks(rootEl, "travelStyles"),
      trip_priorities:     _readChecks(rootEl, "tripPriorities"),
      how_did_you_find_us: get("p-found").value || null,
    };
  }

  function buildBlocksHTML(p) {
    p = p || {};
    const levelOpts = Object.keys(LEVEL_DESCS).map(l =>
      `<option value="${l}" ${p.level === l ? "selected" : ""}>${LEVEL_DESCS[l]}</option>`
    ).join("");
    const countryList = (typeof WAVEBASE_COUNTRIES !== "undefined") ? WAVEBASE_COUNTRIES : [];
    const countryOpts = countryList.map(c =>
      `<option value="${_esc(c)}" ${p.homeCountry === c ? "selected" : ""}>${_esc(c)}</option>`
    ).join("");
    const foundOpts = FOUND_OPTS.map(o =>
      `<option value="${o}" ${p.howDidYouFindUs === o ? "selected" : ""}>${o}</option>`
    ).join("");
    const initialTravelStyles = (p.travelStyles && p.travelStyles.length)
      ? p.travelStyles
      : (p.travelStyle ? [p.travelStyle] : []);
    const showDiscipline = (p.surfType || []).some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");

    return `
      <div class="prof-block prof-block-required">
        <div class="prof-block-head">
          <span class="prof-block-title">You</span>
        </div>
        <p class="prof-block-why">We need this to create your account.</p>
        <div class="prof-block-fields">
          <label class="prof-field"><span>Name</span><input type="text" id="p-name" value="${_esc(p.name || "")}" placeholder="Your name" autocomplete="name"></label>
          <label class="prof-field"><span>Email</span><input type="email" id="p-email" value="${_esc(p.email || "")}" placeholder="you@example.com" autocomplete="email"></label>
          <label class="prof-field"><span>Birth year</span><input type="number" id="p-birthyear" value="${_esc(p.birthYear || "")}" placeholder="1985" min="1920" max="2020" inputmode="numeric"></label>
          <label class="prof-field"><span>Home base</span><select id="p-country" autocomplete="country-name"><option value="">— pick a country —</option>${countryOpts}</select></label>
        </div>
      </div>

      <div class="prof-block prof-block-helps">
        <div class="prof-block-head">
          <span class="prof-block-title">Your surfing</span>
          <span class="prof-block-tag">unlocks better matches</span>
        </div>
        <p class="prof-block-why">Fill this in and the homepage starts showing spots and centers that fit your level and gear — instead of all of them.</p>
        <div class="prof-block-fields">
          <div class="form-checkset form-wide" id="p-surftype-set">
            <span class="form-checkset-label">What do you do? <span class="muted">(tick all that apply)</span></span>
            <div class="form-checkset-options">${_cb("surfType", SURF_TYPES, p.surfType || [])}</div>
          </div>
          <label class="prof-field form-wide"><span>Level</span><select id="p-level"><option value="">—</option>${levelOpts}</select></label>
          <div class="form-checkset form-wide ${showDiscipline ? "" : "hidden"}" id="p-discipline-set">
            <span class="form-checkset-label">Wind discipline <span class="muted">(for wind / kite / wing)</span></span>
            <div class="form-checkset-options">${_cb("discipline", DISCIPLINES, p.discipline || [])}</div>
          </div>
        </div>
      </div>

      <div class="prof-block prof-block-helps">
        <div class="prof-block-head">
          <span class="prof-block-title">Trip kind</span>
          <span class="prof-block-tag">unlocks better matches</span>
        </div>
        <p class="prof-block-why">Fill this in and the homepage shows trips that fit your style (family-friendly stays, hidden gems, budget-friendly...) instead of everything.</p>
        <div class="prof-block-fields">
          <div class="form-checkset form-wide" id="p-styles-set">
            <span class="form-checkset-label">Travel style <span class="muted">(tick all that apply)</span></span>
            <div class="form-checkset-options">${_cb("travelStyles", TRAVEL_STYLES, initialTravelStyles)}</div>
          </div>
          <div class="form-checkset form-wide" id="p-priorities-set">
            <span class="form-checkset-label">What you want from a trip <span class="muted">(tick all that apply)</span></span>
            <div class="form-checkset-options">${_cb("tripPriorities", TRIP_PRIORITIES, p.tripPriorities || [])}</div>
          </div>
        </div>
      </div>

      <div class="prof-block prof-block-optional">
        <div class="prof-block-head">
          <span class="prof-block-title">One last thing</span>
          <span class="prof-block-tag prof-block-tag-optional">optional</span>
        </div>
        <div class="prof-block-fields">
          <label class="prof-field form-wide">
            <span>How did you find WaveBase?</span>
            <select id="p-found"><option value="">—</option>${foundOpts}</select>
            <span class="prof-field-hint muted">Helps us know which channels are working.</span>
          </label>
        </div>
      </div>
    `;
  }

  function wire(rootEl, opts) {
    opts = opts || {};
    const authed = (typeof WaveBaseAuth !== "undefined") && WaveBaseAuth.isLoggedIn();
    const doServerSync = (opts.serverSync !== false);
    const autoSave     = (opts.autoSave   !== false);  // default true
    let serverSyncTimer = null;
    const get = id => rootEl.querySelector("#" + id);

    function localSave() {
      // Spread current first so cut fields (yearsSurfing, currency,
      // etc.) survive across saves through the new form shape.
      const current = WaveBaseAccount.getProfile();
      WaveBaseAccount.setProfile({
        ...current,
        name:            get("p-name").value,
        email:           get("p-email").value,
        birthYear:       get("p-birthyear").value,
        homeCountry:     get("p-country").value,
        level:           get("p-level").value,
        travelStyles:    _readChecks(rootEl, "travelStyles"),
        surfType:        _readChecks(rootEl, "surfType"),
        discipline:      _readChecks(rootEl, "discipline"),
        tripPriorities:  _readChecks(rootEl, "tripPriorities"),
        howDidYouFindUs: get("p-found").value,
      });
      if (typeof updateNav === "function") updateNav();
      if (typeof opts.onSavedFlash === "function") opts.onSavedFlash();
      if (typeof opts.updateProgress === "function") opts.updateProgress();
    }
    function scheduleServerSync() {
      if (!authed || !doServerSync || typeof WaveBaseAuth === "undefined") return;
      if (serverSyncTimer) clearTimeout(serverSyncTimer);
      serverSyncTimer = setTimeout(() => {
        WaveBaseAuth.updateProfile(_buildApiPatch(rootEl)).catch(e => {
          console.warn("[profile form] sync failed:", e.message || e);
        });
      }, 1500);
    }
    function save() { localSave(); scheduleServerSync(); }

    /* Save NOW: always writes local + (if signed in) immediately
       PATCHes server, cancelling any pending debounce. Idempotent
       — autoSave=true callers (where local already wrote on blur)
       pay an extra cheap localStorage write; autoSave=false callers
       (account-page Edit mode) get full commit on demand. Returns
       a Promise that settles when the server responds (or right
       away if anon / serverSync off). */
    function flushPendingSave() {
      localSave();  // also covers autoSave=false case
      if (!authed || !doServerSync || typeof WaveBaseAuth === "undefined") {
        return Promise.resolve(null);
      }
      if (serverSyncTimer) {
        clearTimeout(serverSyncTimer);
        serverSyncTimer = null;
      }
      return WaveBaseAuth.updateProfile(_buildApiPatch(rootEl));
    }

    if (autoSave) {
      // Text inputs: save on blur (avoid spamming localStorage per
      // keystroke), live progress on input.
      ["p-name", "p-email", "p-birthyear"].forEach(id => {
        const el = get(id);
        if (!el) return;
        el.addEventListener("blur", save);
        if (typeof opts.updateProgress === "function") {
          el.addEventListener("input", opts.updateProgress);
        }
      });
      // Selects: save on change.
      ["p-country", "p-level", "p-found"].forEach(id => {
        const el = get(id);
        if (el) el.addEventListener("change", save);
      });
      // Checkboxes: save on change.
      rootEl.querySelectorAll('input[name="surfType"], input[name="discipline"], input[name="travelStyles"], input[name="tripPriorities"]').forEach(cbEl => {
        cbEl.addEventListener("change", save);
      });
    } else {
      // autoSave=false: only the conditional discipline-fieldset
      // toggle is wired (it's a pure UI affordance, not a save), and
      // the live progress on input if requested.
      ["p-name", "p-email", "p-birthyear"].forEach(id => {
        const el = get(id);
        if (el && typeof opts.updateProgress === "function") {
          el.addEventListener("input", opts.updateProgress);
        }
      });
    }

    // Conditional Wind-discipline fieldset show/hide. Always wired
    // regardless of autoSave — it's a UX affordance, not a save.
    rootEl.querySelectorAll('input[name="surfType"]').forEach(cbEl => {
      cbEl.addEventListener("change", () => {
        const picked = _readChecks(rootEl, "surfType");
        const show = picked.some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");
        const set = get("p-discipline-set");
        if (set) {
          set.classList.toggle("hidden", !show);
          if (!show) {
            set.querySelectorAll('input[name="discipline"]:checked').forEach(c => { c.checked = false; });
          }
        }
        if (typeof opts.updateProgress === "function") opts.updateProgress();
      });
    });

    return { flushPendingSave: flushPendingSave };
  }

  return {
    buildBlocksHTML: buildBlocksHTML,
    wire:            wire,
  };
})();

function renderAccount() {
  const root = document.getElementById("account-root");
  // Default: preserve the page scroll across the full re-render. Any
  // inline action that calls renderAccount would otherwise jump back
  // to the top — extra annoying when you have several trips. Callsites
  // can override this by setting __renderAccountScrollTo to a trip ID
  // before calling renderAccount — that trip's card gets scrolled into
  // view instead (currently used by the + New trip button).
  const __sy = window.scrollY;
  const __scrollTarget = __renderAccountScrollTo;
  __renderAccountScrollTo = null;
  const p = WaveBaseAccount.getProfile();
  const saved = WaveBaseAccount.getSaved().map(byId).filter(Boolean);
  const trips = WaveBaseAccount.getTrips();
  const reviews = WaveBaseAccount.getReviews();
  queueMicrotask(() => {
    if (__scrollTarget) {
      // Two-pass scroll: first an instant scroll right after layout so
      // we land roughly on the new trip, then a delayed smooth scroll
      // that re-measures — other trips' Leaflet maps initialise async
      // and push subsequent cards down, which previously parked the
      // new trip just below the viewport (LDW).
      const HEADER_OFFSET = 96;
      const computeY = el => Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
      requestAnimationFrame(() => {
        const el = document.getElementById("trip-" + __scrollTarget);
        if (!el) { window.scrollTo(0, __sy); return; }
        // Pass 1: jump immediately (instant) so the user isn't confused.
        window.scrollTo({ top: computeY(el), behavior: "auto" });
        // Pass 2: re-measure after a beat to absorb late content. If the
        // card moved, smooth-scroll to its new position.
        setTimeout(() => {
          const el2 = document.getElementById("trip-" + __scrollTarget);
          if (el2) window.scrollTo({ top: computeY(el2), behavior: "smooth" });
        }, 400);
      });
      return;
    }
    window.scrollTo(0, __sy);
  });

  // Profile-form option arrays + HTML building are now owned by
  // WaveBaseProfileForm so the modal can reuse them. renderAccount
  // composes: header + WaveBaseProfileForm.buildBlocksHTML(p) +
  // a page-specific actions row + the other account sections.

  // Profile completeness — drives the "Profile X% complete" pill and bar.
  // Counts only fields the user can actually fill in *right now* (so the
  // optional Wind discipline is only counted when wind/kite/wing is ticked).
  const calcCompleteness = (prof) => {
    const showDisc = (prof.surfType || []).some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");
    let filled = 0, total = 0;
    ["name", "email", "birthYear", "homeCountry"].forEach(f => {
      total++; if ((prof[f] || "").toString().trim()) filled++;
    });
    total++; if ((prof.surfType || []).length) filled++;
    total++; if (prof.level) filled++;
    if (showDisc) { total++; if ((prof.discipline || []).length) filled++; }
    total++; if ((prof.travelStyles || []).length) filled++;
    total++; if ((prof.tripPriorities || []).length) filled++;
    total++; if (prof.howDidYouFindUs) filled++;
    return Math.round((filled / total) * 100);
  };
  const profPct = calcCompleteness(p);

  const discoverCTA = `<div class="saved-discover">
    <span class="saved-discover-text">Looking for more?</span>
    <a class="exp-launch-btn" href="explorer.html?view=all">Discover new places →</a>
  </div>`;
  // Group saved entries by country so the list reads like a packing
  // list ("Belgium: 3, Greece: 2, Morocco: 6") rather than a single
  // long undifferentiated grid. Countries with no name (orphans that
  // somehow survived pruning) bucket under "Other".
  function _savedByCountry(entries) {
    const buckets = {};
    entries.forEach(e => {
      const c = (e.country || "").trim() || "Other";
      (buckets[c] = buckets[c] || []).push(e);
    });
    // Alphabetical country order — predictable, scannable.
    return Object.keys(buckets).sort().map(c => ({ country: c, entries: buckets[c] }));
  }
  const savedHTML = (saved.length
    ? _savedByCountry(saved).map(b => `
        <div class="saved-country-block">
          <h3 class="saved-country-head">${escHTML(b.country)} <span class="seccount">${b.entries.length}</span></h3>
          <div class="grid">${b.entries.map(e => cardHTML(e)).join("")}</div>
        </div>
      `).join("")
    : `<p class="muted">Nothing saved yet. Tap the heart on a spot, center or stay as you browse.</p>`)
    + discoverCTA;

  // Split trips into Upcoming vs Past based on the latest date in
  // the trip (max of all check-out dates across stays, falling back
  // to check-in if no check-out is set). Trips with no dates yet
  // count as Upcoming — they're still being planned.
  function _tripLatestDate(t) {
    const datesObj = t.dates || {};
    const all = [];
    Object.keys(datesObj).forEach(k => {
      const d = datesObj[k] || {};
      if (d.out) all.push(d.out);
      else if (d.in) all.push(d.in);
    });
    if (!all.length) return null;  // no dates → treat as upcoming
    return all.sort().slice(-1)[0];  // ISO YYYY-MM-DD lex-sorts correctly
  }
  const todayISO = new Date().toISOString().slice(0, 10);
  const upcomingTrips = [];
  const pastTrips     = [];
  trips.forEach(t => {
    const latest = _tripLatestDate(t);
    if (latest && latest < todayISO) pastTrips.push(t);
    else upcomingTrips.push(t);
  });
  // Within each bucket, sort by latest date (earliest upcoming on
  // top, most-recent past on top). No-date trips bubble to the
  // bottom of upcoming.
  upcomingTrips.sort((a, b) => {
    const la = _tripLatestDate(a) || "9999-12-31";
    const lb = _tripLatestDate(b) || "9999-12-31";
    return la.localeCompare(lb);
  });
  pastTrips.sort((a, b) => {
    const la = _tripLatestDate(a) || "";
    const lb = _tripLatestDate(b) || "";
    return lb.localeCompare(la);
  });

  const upcomingTripsHTML = upcomingTrips.length
    ? upcomingTrips.map(t => tripCardHTML(t, false)).join("")
    : `<p class="muted">No upcoming trips. Click "+ New trip" to start planning.</p>`;
  const pastTripsHTML = pastTrips.length
    ? pastTrips.map(t => tripCardHTML(t, false)).join("")
    : "";  // hide the past section entirely if it's empty

  const matchesLabel = { yes: "Matched our write-up", partial: "Partly matched", no: "Differed from our write-up" };
  // Pretty labels for the keys we know about. Anything not listed renders
  // with the raw key (graceful when we add new fields).
  const detailLabels = {
    tripLength: "Trip length", daysSailed: "Days sailed",
    travelGroup: "Travel group", crowd: "Crowd",
    localism: "Locals",
    // Spot/center: gear chip; both old (gearScore) and new (gear) keys
    gear: "Gear", gearScore: "Gear",
    // Center prose chips
    lessons: "Lessons", lessonsScore: "Lessons",
    team: "Instructor / team", instructorScore: "Instructor",
    safety: "Safety", safetyScore: "Safety",
    value: "Value", valueScore: "Value",
    // Stay prose chips
    hosts: "Hosts", hostsScore: "Hosts",
    food: "Food", foodScore: "Food",
    comfort: "Comfort", comfortScore: "Comfort",
    cleanliness: "Cleanliness", cleanlinessScore: "Cleanliness",
    vibe: "Vibe", distance: "Distance",
    verdict: "Verdict", level: "Reviewer level",
    discipline: "Discipline"
  };
  const detailValueFmt = (k, v) => {
    // 1-10 scores show as "N/10". Verdict/vibe/etc as plain word.
    if (/Score$|crowd|localism|gear$/i.test(k) && /^\d+$/.test(v)) return `${v}/10`;
    if (k === "verdict") return v === "would-go-again" ? "would go again" : v === "maybe" ? "maybe" : "wouldn't go again";
    return v;
  };
  const reviewsHTML = reviews.length
    ? `<ul class="my-reviews">${reviews.map(r => {
        const entry = byId(r.entryId);
        const where = entry
          ? `<a href="${spotHref(entry.id)}">${escHTML(entry.name)}</a> <span class="muted">&middot; ${typeLabel(entry.type)} &middot; ${escHTML(entry.town)}</span>`
          : `<span class="muted">(removed entry)</span>`;
        const date = r.when ? new Date(r.when).toISOString().slice(0, 10) : "";
        const stars = r.stars
          ? `<span class="my-review-stars" aria-label="${r.stars} stars">${"★".repeat(r.stars)}${"☆".repeat(Math.max(0, 5 - r.stars))}</span>` : "";
        const visited = (r.monthVisited && r.yearVisited)
          ? ` <span class="muted">&middot; visited ${WAVEBASE_MONTHS[r.monthVisited]} ${r.yearVisited}</span>` : "";
        const matchTag = r.matches && matchesLabel[r.matches]
          ? `<span class="my-review-match match-${r.matches}">${matchesLabel[r.matches]}</span>` : "";
        const author = r.name ? ` &mdash; ${escHTML(r.name)}` : "";
        // Render details as pill list
        const detailPills = r.details
          ? Object.entries(r.details).filter(([k, v]) => v).map(([k, v]) =>
              `<span class="my-review-detail"><span class="muted">${escHTML(detailLabels[k] || k)}:</span> ${escHTML(detailValueFmt(k, v))}</span>`).join("")
          : "";
        return `<li class="my-review" data-review="${r.id}">
          <div class="my-review-head">
            <div class="my-review-where">${where}</div>
            <button class="link-btn" data-del-review="${r.id}" aria-label="Delete review">remove</button>
          </div>
          <div class="my-review-meta">${stars} ${matchTag} <span class="muted">${date}${author}${visited}</span></div>
          ${detailPills ? `<div class="my-review-details">${detailPills}</div>` : ""}
          ${r.text ? `<p class="my-review-text">${escHTML(r.text)}</p>` : ""}
        </li>`;
      }).join("")}</ul>`
    : `<p class="muted">No reviews yet. Use any spot, center or stay page — the review form at the bottom saves a preview here.</p>`;

  // Auth state — drives the page chrome (h1 + lead note + sign-out
  // button) and the onboarding flow. `isOnboarding` is set when the
  // user just signed up: ?onboarding=1 is appended by the auth modal
  // before redirecting here. In that mode we trim away saved/trips/
  // reviews so the user only sees the profile form they're meant to
  // fill (or skip).
  const isOnboarding = new URLSearchParams(window.location.search).get("onboarding") === "1";
  const authed       = (typeof WaveBaseAuth !== "undefined") && WaveBaseAuth.isLoggedIn();
  const authUser     = authed ? WaveBaseAuth.currentUser() : null;
  const authEmail    = (authUser && authUser.email) || "";

  // Anon gate. Account features (saved spots, trips, surf log,
  // reviews, profile) are signed-in-only. If a visitor lands here
  // without a token (typed the URL, followed an old bookmark, or
  // clicked a stale link), don't show them an empty/local account
  // form — show a "Sign in to access" CTA that opens the modal.
  // The onboarding flow is exempt because it always implies signed-in
  // (the auth modal redirects with ?onboarding=1 only after signup).
  if (!authed && !isOnboarding) {
    root.innerHTML = `
      <section class="acc-anon-gate">
        <p class="kicker">My WaveBase</p>
        <h1>Sign in to your <span class="ul">account</span>.</h1>
        <p class="lead">Your saved spots, trips, surf log and reviews live here.
          Sign in or create an account to access them.</p>
        <div class="acc-anon-cta">
          <button type="button" class="btn"       id="acc-anon-signin">Sign in</button>
          <button type="button" class="btn ghost" id="acc-anon-signup">Create account</button>
        </div>
      </section>
    `;
    const open = (mode) => {
      if (typeof WaveBaseAuthModal !== "undefined") {
        WaveBaseAuthModal.open({ mode: mode });
      }
    };
    document.getElementById("acc-anon-signin").addEventListener("click", () => open("login"));
    document.getElementById("acc-anon-signup").addEventListener("click", () => open("signup"));
    return;  // bail before rendering the logged-in shell
  }

  // Three head variants:
  //   1. Onboarding   — welcome banner, no signed-in-as line (it'd be
  //                     redundant with the email they just typed)
  //   2. Logged in    — "My WaveBase" + signed-in-as line + Sign out
  //   3. Anonymous    — old "fake account" lead note + Sign in CTA
  const headHTML = isOnboarding
    ? `<div class="acc-onboard-head">
         <p class="kicker">Welcome to WaveBase</p>
         <h1>One last step — your <span class="ul">profile</span>.</h1>
         <p class="lead-note acc-onboard-lead">
           Tell us a bit about yourself and the home page starts showing the right
           spots for your level and trip style. You can skip it and add it later.
         </p>
       </div>`
    : `<div class="acc-head-row">
         <h1>My WaveBase</h1>
         <div class="acc-head-meta">
           <span class="muted">Signed in as <strong>${escHTML(authEmail)}</strong></span>
         </div>
       </div>`;

  root.innerHTML = `
    ${headHTML}

    <section class="acc-block">
      <div class="prof-head">
        <h2>My WaveBase profile</h2>
        <div class="prof-status">
          <span class="prof-progress" id="prof-progress">
            <span class="prof-progress-bar" style="--pct:${profPct}%"></span>
            <span class="prof-progress-label">Profile ${profPct}% complete</span>
          </span>
          <span class="prof-saved" id="prof-saved" hidden>✓ saved</span>
        </div>
      </div>
      <p class="muted lead-note">Helps us filter the site for you. Honest, anonymous, never shared.</p>

      ${(isOnboarding || __profileEditMode)
        ? `<div class="profile-form-v2" id="profile-form-root">

            ${WaveBaseProfileForm.buildBlocksHTML(p)}

            <div class="prof-actions">
              ${isOnboarding
                ? `<button type="button" class="btn ghost" id="p-skip">Skip for now</button>
                   <button type="button" class="btn"       id="p-continue">Save and continue &rarr;</button>`
                : `<button type="button" class="btn ghost" id="p-cancel">Cancel</button>
                   <button type="button" class="btn"       id="p-save-edit">Save</button>`
              }
            </div>
          </div>`
        : `<div class="prof-summary">
            ${_profileSummaryHTML(p, authEmail)}
            <div class="prof-summary-actions">
              <button type="button" class="btn" id="prof-edit">Edit profile</button>
              ${authed ? `<button type="button" class="btn ghost btn-quiet" id="acc-signout">Sign out</button>` : ``}
            </div>
          </div>`
      }
    </section>

    ${isOnboarding ? "" : `
    ${surfLogHTML()}

    <section class="acc-block">
      <h2>Saved places <span class="seccount">${saved.length}</span></h2>
      ${savedHTML}
    </section>

    <section class="acc-block" id="trips">
      <div class="trip-section-head">
        <h2>My trips <span class="seccount">${trips.length}</span></h2>
        <button class="btn ghost" id="new-trip">+ New trip</button>
      </div>
      <p class="muted form-note">Drag locations to reorder them — the map and route line follow the order. Give each stay check-in / check-out dates for a nights + cost estimate. Use ✕ to remove a stop.</p>

      <h3 class="trips-bucket-head">Upcoming <span class="seccount">${upcomingTrips.length}</span></h3>
      ${upcomingTripsHTML}

      ${pastTrips.length ? `
      <h3 class="trips-bucket-head trips-bucket-head-past">Past <span class="seccount">${pastTrips.length}</span></h3>
      ${pastTripsHTML}
      ` : ``}

      ${authed && trips.length ? `
      <div class="trips-save-row">
        <span class="muted trips-save-hint" id="trips-save-hint">Auto-saved to your account as you edit.</span>
        <button type="button" class="btn" id="trips-save">Save trips</button>
      </div>
      ` : ``}
    </section>

    <section class="acc-block" id="my-reviews">
      <h2>My reviews <span class="seccount">${reviews.length}</span></h2>
      <p class="muted form-note">Previews of reviews you wrote — saved locally on this device.
        They'll turn into real, shared reviews when the backend is live (phase 2).</p>
      ${reviewsHTML}
    </section>

    ${authed ? `
    <section class="acc-block acc-danger-zone">
      <h2>Delete account</h2>
      <p class="muted form-note">Permanently delete your WaveBase account and the data we have on the server (email, profile fields, saved spots). Your trips, surf log and reviews live in your browser and are unaffected — clear your browser data if you want those gone too. This action can&rsquo;t be undone.</p>
      <button type="button" class="btn btn-danger" id="acc-delete">Delete my account &hellip;</button>
    </section>
    ` : ``}
    `}`;

  // readChecks helper for the calcCompleteness call below — the
  // form's own checkboxes are read by WaveBaseProfileForm.wire(),
  // but updateProgressDisplay still needs to peek at the DOM to
  // compute live completeness without going through a save.
  const readChecks = name => Array.from(
    document.querySelectorAll('input[name="' + name + '"]:checked')
  ).map(el => el.value);

  let _savedTimer = null;
  const flashSaved = () => {
    const el = document.getElementById("prof-saved");
    if (!el) return;
    el.hidden = false;
    if (_savedTimer) clearTimeout(_savedTimer);
    _savedTimer = setTimeout(() => { el.hidden = true; }, 1800);
  };

  // Live progress recompute — reads the in-DOM values without going
  // through setProfile, so the bar updates as the user types/ticks
  // even before a save fires (text inputs save on blur, not on input).
  const updateProgressDisplay = () => {
    const liveProf = {
      name:           document.getElementById("p-name").value,
      email:          document.getElementById("p-email").value,
      birthYear:      document.getElementById("p-birthyear").value,
      homeCountry:    document.getElementById("p-country").value,
      level:          document.getElementById("p-level").value,
      travelStyles:   readChecks("travelStyles"),
      surfType:       readChecks("surfType"),
      discipline:     readChecks("discipline"),
      tripPriorities: readChecks("tripPriorities"),
      howDidYouFindUs: document.getElementById("p-found").value
    };
    const pct = calcCompleteness(liveProf);
    const wrap = document.getElementById("prof-progress");
    if (!wrap) return;
    const bar = wrap.querySelector(".prof-progress-bar");
    if (bar) bar.style.setProperty("--pct", pct + "%");
    const label = wrap.querySelector(".prof-progress-label");
    if (label) label.textContent = `Profile ${pct}% complete`;
  };

  // Wire the profile-form via the shared module so the account page
  // and the modal stay in sync. Onboarding flow uses auto-save (any
  // typed field is preserved even on Skip). The account-page edit
  // mode uses explicit Save (autoSave: false) — Lode's UX call: a
  // button to click gives users confidence the change landed.
  const profileFormRoot = document.getElementById("profile-form-root");
  if (profileFormRoot && typeof WaveBaseProfileForm !== "undefined") {
    const wired = WaveBaseProfileForm.wire(profileFormRoot, {
      autoSave:       isOnboarding,  // auto in onboarding, explicit Save otherwise
      onSavedFlash:   flashSaved,
      updateProgress: updateProgressDisplay,
    });
    profileFormRoot.__wbWired = wired;
  }

  // Profile view ↔ edit toggle handlers.
  const profEditBtn = document.getElementById("prof-edit");
  if (profEditBtn) profEditBtn.addEventListener("click", () => {
    __profileEditMode = true;
    renderAccount();
  });
  const profCancelBtn = document.getElementById("p-cancel");
  if (profCancelBtn) profCancelBtn.addEventListener("click", () => {
    __profileEditMode = false;
    renderAccount();  // re-renders from last-saved localStorage state, edits discarded
  });
  const profSaveEditBtn = document.getElementById("p-save-edit");
  if (profSaveEditBtn) profSaveEditBtn.addEventListener("click", async () => {
    profSaveEditBtn.disabled = true;
    profSaveEditBtn.textContent = "Saving…";
    try {
      if (profileFormRoot && profileFormRoot.__wbWired) {
        await profileFormRoot.__wbWired.flushPendingSave();
      }
    } catch (e) {
      alert("Couldn't save: " + (e.message || e));
      profSaveEditBtn.disabled = false;
      profSaveEditBtn.textContent = "Save";
      return;
    }
    __profileEditMode = false;
    renderAccount();
  });

  // Reset button — confirm, then clear profile fields (keeps the
  // user's saved spots, trips and reviews untouched). Hidden in
  // onboarding mode (replaced by Skip + Continue), so null-guard.
  const resetBtn = document.getElementById("p-reset");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (!confirm("Reset your profile? This clears all the fields above.\n\n(Your saved spots, trips and reviews stay safe.)")) return;
    const current = WaveBaseAccount.getProfile();
    WaveBaseAccount.setProfile({
      ...current,
      name: "", email: "", birthYear: "", homeCountry: "",
      level: "",
      surfType: [], discipline: [], travelStyles: [], tripPriorities: [],
      howDidYouFindUs: ""
    });
    updateNav();
    renderAccount();
  });

  // Onboarding-only: Skip + Continue. Skip just navigates home; Continue
  // pushes the form values to the server (PATCH /users/me/profile) and
  // then navigates home. We map our local UI shape (camelCase, plain
  // strings) to the API's snake_case + capitalised enum values.
  const skipBtn = document.getElementById("p-skip");
  if (skipBtn) skipBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const continueBtn = document.getElementById("p-continue");
  if (continueBtn) continueBtn.addEventListener("click", async () => {
    // Force the debounced server-sync to fire NOW (it'd otherwise
    // wait 1.5s after the last field change, which we can't afford
    // because we're about to navigate away). flushPendingSave is
    // exposed by WaveBaseProfileForm.wire() via the stashed wired
    // controller.
    continueBtn.disabled = true;
    continueBtn.textContent = "Saving…";
    try {
      if (profileFormRoot && profileFormRoot.__wbWired) {
        await profileFormRoot.__wbWired.flushPendingSave();
      }
    } catch (e) {
      alert("Couldn't save your profile: " + (e.message || e));
      continueBtn.disabled = false;
      continueBtn.textContent = "Save and continue →";
      return;
    }
    window.location.href = "index.html";
  });

  // Sign-out button (shown next to Reset profile when logged in).
  // Redirects home rather than reloading the account page — without
  // the user's data the page would just be the anon-gate, which
  // makes for a confusing "wait, am I still here?" moment. Home is
  // a clean landing that signals the sign-out succeeded.
  const signoutBtn = document.getElementById("acc-signout");
  if (signoutBtn) signoutBtn.addEventListener("click", () => {
    if (!confirm("Sign out of WaveBase?")) return;
    if (typeof WaveBaseAuth !== "undefined") WaveBaseAuth.logout();
    window.location.href = "index.html";
  });

  // Delete account button (very bottom of the page, danger zone).
  // Single confirm — Lode chose the simpler UX over a typed-string
  // double-check. Button label is explicit enough that a misclick
  // would still hit the confirm dialog as a stop. On success we
  // wipe local auth state inside deleteAccount() and ship the user
  // home; on failure we surface the server error verbatim so they
  // can retry.
  const deleteBtn = document.getElementById("acc-delete");
  if (deleteBtn) deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete your WaveBase account permanently?\n\nThis wipes your email, profile and saved spots from our server. It cannot be undone.")) return;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting…";
    try {
      await WaveBaseAuth.deleteAccount();
    } catch (e) {
      alert("Couldn't delete your account: " + (e.message || e));
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete my account …";
      return;
    }
    window.location.href = "index.html";
  });

  // + New trip button — hidden in onboarding mode, so null-guard.
  const newTripBtn = document.getElementById("new-trip");
  if (newTripBtn) newTripBtn.addEventListener("click", () => {
    const name = window.prompt("Name your new trip:");
    if (name) {
      const nt = WaveBaseAccount.addTrip(name);
      // Override the default scroll-preserve so the freshly created
      // trip card scrolls into view — without this you'd stay at the
      // top of the page and have to hunt for it (LDW).
      if (nt && nt.id) __renderAccountScrollTo = nt.id;
      renderAccount();
    }
  });

  // Explicit "Save trips" button. Trips already auto-sync (debounced
  // 1.5s after every edit) but user-testing showed people want a
  // button to click for peace of mind. Behind the scenes we force-
  // flush any pending debounced syncs by calling the trip-sync
  // helper for every trip with a serverId OR no serverId — exposed
  // via the WaveBaseAccount.flushTripSyncs() helper added in
  // account.js.
  const tripsSaveBtn = document.getElementById("trips-save");
  if (tripsSaveBtn) tripsSaveBtn.addEventListener("click", async () => {
    tripsSaveBtn.disabled = true;
    tripsSaveBtn.textContent = "Saving…";
    const hint = document.getElementById("trips-save-hint");
    try {
      if (typeof WaveBaseAccount.flushTripSyncs === "function") {
        await WaveBaseAccount.flushTripSyncs();
      }
      if (hint) {
        hint.textContent = "✓ Saved to your account just now.";
        hint.classList.add("trips-save-flash");
      }
    } catch (e) {
      alert("Couldn't save: " + (e.message || e));
    }
    tripsSaveBtn.disabled = false;
    tripsSaveBtn.textContent = "Save trips";
    setTimeout(() => {
      if (hint) {
        hint.textContent = "Auto-saved to your account as you edit.";
        hint.classList.remove("trips-save-flash");
      }
    }, 2500);
  });
  root.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => { WaveBaseAccount.deleteTrip(b.dataset.del); renderAccount(); });
  });
  // Collapse toggle on each trip card — pure class toggle, persists
  // to localStorage so the state survives re-renders. No full re-render.
  root.querySelectorAll("[data-collapse]").forEach(b => {
    b.addEventListener("click", () => {
      const id = b.dataset.collapse;
      const tripEl = document.getElementById("trip-" + id);
      if (!tripEl) return;
      const nowCollapsed = !tripEl.classList.contains("is-collapsed");
      tripEl.classList.toggle("is-collapsed", nowCollapsed);
      setTripCollapsed(id, nowCollapsed);
    });
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
      root.querySelectorAll(".trip-item-row.drag-over").forEach(x => x.classList.remove("drag-over", "drop-below"));
      dragSrc = null;
    });
    // While dragging over a row, show the drop line on the half the
    // cursor is in — top half = land above this row, bottom = below.
    row.addEventListener("dragover", e => {
      if (!dragSrc || dragSrc.tripId !== row.dataset.trip) return;
      if (parseInt(row.dataset.idx, 10) === dragSrc.fromIndex) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      const rect = row.getBoundingClientRect();
      const below = (e.clientY - rect.top) > rect.height / 2;
      row.classList.add("drag-over");
      row.classList.toggle("drop-below", below);
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over", "drop-below");
    });
    row.addEventListener("drop", e => {
      e.preventDefault();
      row.classList.remove("drag-over", "drop-below");
      if (!dragSrc || dragSrc.tripId !== row.dataset.trip) return;
      const from = dragSrc.fromIndex;
      const targetIdx = parseInt(row.dataset.idx, 10);
      if (targetIdx === from) return;
      const rect = row.getBoundingClientRect();
      const below = (e.clientY - rect.top) > rect.height / 2;
      // Index of the target row once the dragged item is pulled out,
      // then +1 if the cursor was in its lower half (drop below it).
      const shifted = from < targetIdx ? targetIdx - 1 : targetIdx;
      const toIndex = below ? shifted + 1 : shifted;
      if (from !== toIndex) {
        // Snapshot + restore scroll so the page doesn't jump to top
        // after the re-render. Critical when there are several trips
        // and the user moved a spot deep in the second/third trip.
        const sy = window.scrollY;
        WaveBaseAccount.reorderTrip(row.dataset.trip, from, toIndex);
        renderAccount();
        window.scrollTo(0, sy);
      }
    });

    // Touch-drag fallback for iPad / iPhone — HTML5 drag events don't
    // fire on touchscreens. Reorder UX with iOS-feel: a floating clone
    // follows the finger, the original row collapses, and rows shift
    // to open a gap at the prospective drop position.
    //
    // Critical detail: hit-testing uses positions CAPTURED ONCE at
    // touchstart (post-collapse), not live getBoundingClientRect. Live
    // rects move with our own shift transforms, which creates a feedback
    // loop where the gap flickers under slow movement. Stable caches +
    // "only re-apply on dropIdx change" + nearest-row fallback when the
    // finger is over an open gap = no jitter.
    const grip = row.querySelector(".drag-grip");
    if (grip) {
      let touchDrag = null;
      let ghost = null;
      let touchOffsetY = 0;
      let draggedH = 0;
      let siblingCache = [];   // [{ row, origIdx, top, bot }]
      const clearVisuals = () => {
        siblingCache.forEach(c => { c.row.style.transform = ""; });
        root.querySelectorAll(".trip-item-row.drag-over")
          .forEach(x => x.classList.remove("drag-over", "drop-below"));
        root.querySelectorAll(".trip-leg.drop-leg-target")
          .forEach(l => {
            l.classList.remove("drop-leg-target");
            l.style.removeProperty("--leg-grow");
          });
      };
      // Find the stay-leg the dropped spot will belong to: spots group
      // under the most recent preceding stay, so we scan all rows up to
      // dropIdx and remember the last stay-row we saw — its enclosing
      // .trip-leg is the highlight target.
      const legForDrop = (dropIdx, fromIdx) => {
        if (dropIdx == null) return null;
        const allRows = [...root.querySelectorAll(".trip-item-row[draggable='true']")]
          .filter(r => r.dataset.trip === row.dataset.trip);
        let lastStayLeg = null;
        for (const r of allRows) {
          const i = parseInt(r.dataset.idx, 10);
          const visIdx = i < fromIdx ? i : i - 1;
          if (visIdx >= dropIdx) break;
          if (r.classList.contains("trip-item-stay")) {
            lastStayLeg = r.closest(".trip-leg");
          }
        }
        return lastStayLeg;
      };
      grip.addEventListener("touchstart", ev => {
        const t = ev.touches[0];
        const rect = row.getBoundingClientRect();
        touchOffsetY = t.clientY - rect.top;
        draggedH = rect.height;
        // Clone the row, position fixed at its current spot, follow finger.
        ghost = row.cloneNode(true);
        ghost.classList.add("trip-ghost");
        ghost.style.position = "fixed";
        ghost.style.left = rect.left + "px";
        ghost.style.top = rect.top + "px";
        ghost.style.width = rect.width + "px";
        document.body.appendChild(ghost);
        const fromIndex = parseInt(row.dataset.idx, 10);
        // Cache sibling positions BEFORE collapsing the dragged row, then
        // adjust for the upcoming collapse: rows below the dragged row
        // shift up by draggedH once the row collapses. We hit-test against
        // these adjusted-stable coordinates — they DON'T change as we
        // apply gap shifts later (which is what kills the feedback loop).
        const sibs = [...root.querySelectorAll(".trip-item-row[draggable='true']")]
          .filter(r => r !== row && r.dataset.trip === row.dataset.trip);
        siblingCache = sibs.map(r => {
          const rr = r.getBoundingClientRect();
          const i = parseInt(r.dataset.idx, 10);
          const dy = i > fromIndex ? -draggedH : 0;   // post-collapse offset
          return { row: r, origIdx: i, top: rr.top + dy, bot: rr.bottom + dy };
        });
        // Collapse the dragged row out of flow so the list compacts.
        // Touch-specific class so we don't break the desktop drag image
        // (which uses `.dragging` for a subtle opacity-only preview).
        row.classList.add("touch-dragging");
        touchDrag = { fromIndex, dropIdx: null };
      }, { passive: true });
      grip.addEventListener("touchmove", ev => {
        if (!touchDrag) return;
        ev.preventDefault();
        const t = ev.touches[0];
        // Float the ghost under the finger.
        if (ghost) ghost.style.top = (t.clientY - touchOffsetY) + "px";
        // Find the target row using STABLE cached coordinates. If finger
        // is over an open gap (no direct hit), pick the nearest row.
        const ty = t.clientY;
        let target = null;
        let bestDist = Infinity;
        for (const c of siblingCache) {
          if (ty >= c.top && ty <= c.bot) { target = c; break; }
          const d = ty < c.top ? c.top - ty : ty - c.bot;
          if (d < bestDist) { bestDist = d; target = c; }
        }
        // Compute drop index in the post-removal space.
        let dropIdx;
        if (!target) {
          dropIdx = null;
        } else {
          const mid = (target.top + target.bot) / 2;
          const below = ty > mid;
          const visIdx = target.origIdx < touchDrag.fromIndex
            ? target.origIdx
            : target.origIdx - 1;
          dropIdx = below ? visIdx + 1 : visIdx;
        }
        // Only update visuals if dropIdx actually changed — prevents
        // re-triggering transform animations on every micro-touchmove,
        // which is what caused the slow-movement glitching.
        if (dropIdx === touchDrag.dropIdx) return;
        touchDrag.dropIdx = dropIdx;
        // Repaint hover state + gap shifts.
        root.querySelectorAll(".trip-item-row.drag-over")
          .forEach(x => x.classList.remove("drag-over", "drop-below"));
        if (target && dropIdx != null) {
          const mid = (target.top + target.bot) / 2;
          target.row.classList.add("drag-over");
          target.row.classList.toggle("drop-below", ty > mid);
        }
        siblingCache.forEach(c => {
          const visIdx = c.origIdx < touchDrag.fromIndex ? c.origIdx : c.origIdx - 1;
          c.row.style.transform = (dropIdx != null && visIdx >= dropIdx)
            ? `translateY(${draggedH}px)`
            : "";
        });
        // Light up the destination stay-leg so it's visually obvious which
        // leg the spot will join — plus give it extra bottom padding so
        // the kader actually grows as preview (LDW feedback).
        root.querySelectorAll(".trip-leg.drop-leg-target")
          .forEach(l => {
            l.classList.remove("drop-leg-target");
            l.style.removeProperty("--leg-grow");
          });
        const targetLeg = legForDrop(dropIdx, touchDrag.fromIndex);
        if (targetLeg) {
          targetLeg.style.setProperty("--leg-grow", draggedH + "px");
          targetLeg.classList.add("drop-leg-target");
        }
      }, { passive: false });
      const endTouch = () => {
        if (!touchDrag) return;
        const { fromIndex, dropIdx } = touchDrag;
        if (ghost) { ghost.remove(); ghost = null; }
        row.classList.remove("touch-dragging");
        clearVisuals();
        touchDrag = null;
        siblingCache = [];
        if (dropIdx == null) return;
        // dropIdx is in post-removal index space, same as reorderTrip's
        // `to` argument. The only no-op is dropping back into the slot
        // the dragged row originally occupied (= dropIdx === fromIndex).
        // Earlier code also excluded fromIndex + 1, which incorrectly
        // skipped legitimate "move past the next neighbour" drops (LDW:
        // kon Panorama niet onder Surf Hostel zetten — exact dat geval).
        if (dropIdx !== fromIndex) {
          // Same scroll-preservation as the desktop drop handler — don't
          // jump to top after re-render (especially noticeable on iPad
          // with several trips, LDW).
          const sy = window.scrollY;
          WaveBaseAccount.reorderTrip(row.dataset.trip, fromIndex, dropIdx);
          renderAccount();
          window.scrollTo(0, sy);
        }
      };
      grip.addEventListener("touchend", endTouch);
      grip.addEventListener("touchcancel", endTouch);
    }
  });
  root.querySelectorAll("[data-remove]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.removeFromTrip(b.dataset.trip, b.dataset.spot);
      renderAccount();
    });
  });
  /* Per-stay date inputs. A change updates the data and refreshes the
     stay's own nights/cost cell in place — it does NOT re-render the
     whole account, because that would destroy the <input> mid-edit
     and yank the open date picker shut (the iOS first-tap bug). The
     full re-render (trip summary, day-by-day) is deferred to blur. */
  let tripDatesDirty = false;
  const refreshStayCalc = (tId, eId) => {
    const trip = WaveBaseAccount.getTrips().find(x => x.id === tId);
    const ent = byId(eId);
    if (!trip || !ent) return;
    const d = (trip.dates && trip.dates[eId]) || { in: "", out: "" };
    const di = root.querySelector(`.tsp-date[data-trip="${tId}"][data-spot="${eId}"]`);
    const wrap = di && di.closest(".trip-stay-dates");
    const calcEl = wrap && wrap.querySelector(".tsp-calc");
    if (calcEl) calcEl.outerHTML = stayCalcHTML(ent, d);
  };
  const isTouch = matchMedia("(pointer: coarse)").matches;
  root.querySelectorAll(".tsp-date").forEach(inp => {
    // Dedupe: input + change both fire on iOS calendar picks; we only
    // want to run the logic once per actual value commit.
    let lastValue = inp.value;
    const handleDate = () => {
      if (inp.value === lastValue) return;
      lastValue = inp.value;
      const tripId = inp.dataset.trip, entryId = inp.dataset.spot, field = inp.dataset.field;
      WaveBaseAccount.setStayDate(tripId, entryId, field, inp.value);
      tripDatesDirty = true;
      // Keep this stay's check-out picker from offering days before check-in.
      if (field === "in") {
        const wrap = inp.closest(".trip-stay-dates");
        const outInp = wrap && wrap.querySelector('.tsp-date[data-field="out"]');
        if (outInp) { if (inp.value) outInp.min = inp.value; else outInp.removeAttribute("min"); }
      }
      // Smart default: setting a stay's check-out pre-fills the next
      // stay's check-in (trips are usually consecutive). We overwrite
      // an existing check-in IF it's empty or now invalid (earlier
      // than this stay's new check-out). If the user has set a LATER
      // check-in for the next stay (a planned gap), we respect it.
      if (field === "out" && inp.value) {
        const trip = WaveBaseAccount.getTrips().find(x => x.id === tripId);
        const ids = trip ? trip.spotIds : [];
        const myIdx = ids.indexOf(entryId);
        if (myIdx !== -1) {
          for (let i = myIdx + 1; i < ids.length; i++) {
            const nx = byId(ids[i]);
            if (nx && nx.type === "stay") {
              const nd = (trip.dates && trip.dates[ids[i]]) || {};
              const existing = nd.in || "";
              const shouldFill = !existing || existing < inp.value;
              if (shouldFill) {
                WaveBaseAccount.setStayDate(tripId, ids[i], "in", inp.value);
                const nextIn = root.querySelector(`.tsp-date[data-trip="${tripId}"][data-spot="${ids[i]}"][data-field="in"]`);
                if (nextIn) nextIn.value = inp.value;
                const nextOut = root.querySelector(`.tsp-date[data-trip="${tripId}"][data-spot="${ids[i]}"][data-field="out"]`);
                if (nextOut) nextOut.min = inp.value;
                refreshStayCalc(tripId, ids[i]);
              }
              break;
            }
          }
        }
      }
      refreshStayCalc(tripId, entryId);
    };
    // Listen to BOTH events: iOS calendar popup fires `input` as soon
    // as the user taps a date; change only fires on Done. Listening to
    // both means the auto-fill of the next stay's check-in runs even
    // if the user dismisses the picker without confirming.
    inp.addEventListener("change", handleDate);
    inp.addEventListener("input", handleDate);
    // Touch devices: auto-dismiss the iOS calendar AFTER the user has
    // actually picked a date — but skip the auto-blur if input fires
    // within ~500 ms of focus, because for an empty date field iOS
    // pre-fires `input` with "today" as soon as the popup opens, and
    // an immediate blur would dismiss the picker with today silently
    // committed (LDW: "selecteerd automatisch de dag van vandaag en
    // bevestigd die ook"). 500 ms gives the user time to actually
    // interact before we treat input as a real pick.
    if (isTouch) {
      let focusedAt = 0;
      inp.addEventListener("focus", () => { focusedAt = Date.now(); });
      inp.addEventListener("input", () => {
        if (Date.now() - focusedAt > 500) {
          setTimeout(() => inp.blur(), 0);
        }
      });
    }
    // Defer the full re-render until focus leaves the date fields, so
    // the picker stays open and tabbing between in / out keeps working.
    inp.addEventListener("blur", e => {
      if (e.relatedTarget && e.relatedTarget.classList &&
          e.relatedTarget.classList.contains("tsp-date")) return;
      if (tripDatesDirty) { tripDatesDirty = false; renderAccount(); }
    });
  });
  wireTripToggles(root);
  wireTripNav(root);
  wireTripAdd(root);
  wireTripRename(root);
  wireTripDayNotes(root);
  // Export a trip to the user's calendar as a downloadable .ics file.
  root.querySelectorAll("[data-ics]").forEach(b => {
    b.addEventListener("click", () => {
      const t = WaveBaseAccount.getTrips().find(x => x.id === b.dataset.ics);
      if (t) downloadTripICS(t);
    });
  });
  // Share a trip — pack it into a URL and copy that to the clipboard.
  root.querySelectorAll("[data-share]").forEach(b => {
    b.addEventListener("click", () => {
      const t = WaveBaseAccount.getTrips().find(x => x.id === b.dataset.share);
      if (!t) return;
      const url = location.origin + location.pathname.replace(/[^/]*$/, "") + "trip.html?t=" + encodeTrip(t);
      const done = () => { b.textContent = "link copied ✓"; setTimeout(() => { b.textContent = "share"; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(() => window.prompt("Copy this trip link:", url));
      } else {
        window.prompt("Copy this trip link:", url);
      }
    });
  });
  root.querySelectorAll("[data-del-review]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.deleteReview(b.dataset.delReview);
      renderAccount();
    });
  });
  if (root.querySelector(".grid")) wireCards(root);
  initTripMaps(trips);
  wireSurfLog(null);
  renderSurfLogMap();
}

// Tag recognised facility words in a free-text facilities string with a
// small pictogram, for quick scanning in the compare scoreboard. The prose
// is left intact — only the first hit of each keyword gets an icon, and
// multi-word phrases are listed before their sub-words ("mountain bike"
// before "bike") so the longer match wins.
function iconizeFacilities(text) {
  if (!text || typeof text !== "string") return text;
  const map = [
    [/\bwater fountain\b/i, "🚰"],
    [/\bbeach volleyball\b/i, "🏐"],
    [/\bchanging rooms?\b/i, "🚪"],
    [/\bmountain bikes?\b/i, "🚲"],
    [/\bequipment storage\b/i, "🧳"],
    [/\brescue boat\b/i, "🛟"],
    [/\bsun ?beds?\b/i, "⛱️"],
    [/\bshowers?\b/i, "🚿"],
    [/\blockers?\b/i, "🔒"],
    [/\bparking\b/i, "🅿️"],
    [/\bwi-?fi\b/i, "📶"],
    [/\bwebcam\b/i, "📹"],
    [/\brestaurants?\b/i, "🍽️"],
    [/\byoga\b/i, "🧘"],
    [/\blifeguard\b/i, "🛟"],
    [/\binsurance\b/i, "🛡️"],
    [/\bwheelchairs?\b/i, "♿"],
    [/\bbars?\b/i, "🍹"]
  ];
  let out = text;
  map.forEach(([re, icon]) => {
    out = out.replace(re, m => icon + " " + m);
  });
  return out;
}

// "Sports taught" compare cell: the four main sports render as our
// pictograms (currentColor SVGs); any extra sport key (e.g. SUP, sail)
// not in WAVEBASE_SPORT_ICONS is rendered as a small text chip alongside,
// per LDW: "buiten windsurfen, golfsurfen, kitesurfen of wingfoilen mag
// het geschreven zijn in tekst."
function sportsCellHTML(sports) {
  if (!Array.isArray(sports) || !sports.length) {
    return `<span class="sb-cell empty">—</span>`;
  }
  const parts = sports.map(s => {
    if (WAVEBASE_SPORT_ICONS[s]) {
      return `<span class="sport-icon" title="${escHTML(SPORT_LABEL[s] || s)}">${WAVEBASE_SPORT_ICONS[s]}</span>`;
    }
    return `<span class="cmp-sport-text">${escHTML(SPORT_LABEL[s] || s)}</span>`;
  });
  return `<div class="sport-icons cmp-sports-cell">${parts.join("")}</div>`;
}

// Monthly wind (kn) compare cell: a compact 3-row × 13-col mini-table
// per center — header (J F M A M J J A S O N D) on top, then "avg" and
// "gust" rows. Same numbers the bar chart on the detail page uses, just
// without the chart, so two centers' seasonal wind profiles line up
// cell-by-cell across the columns.
function windMonthCellHTML(stats, currentIdx) {
  // Only the user's currently-selected month is shown (the month sits in
  // the row label, so the cell itself is just two clean lines of label +
  // value + unit). LDW: "toon enkel de wind van die maand".
  const avg = (stats && Array.isArray(stats.monthlyWindKn)) ? stats.monthlyWindKn[currentIdx] : null;
  const gust = stats
    ? (Array.isArray(stats.monthlyDailyPeakKn) ? stats.monthlyDailyPeakKn[currentIdx]
       : (Array.isArray(stats.monthlyGustKn) ? stats.monthlyGustKn[currentIdx] : null))
    : null;
  if (avg == null && gust == null) return `<span class="sb-cell empty">—</span>`;
  const fmt = v => (v != null ? Math.round(v) : "—");
  return `<div class="cmp-wind-cell">
    <div class="cmp-wind-line"><span class="lbl">avg</span> <strong>${fmt(avg)}</strong> kn</div>
    <div class="cmp-wind-line"><span class="lbl">gust</span> <strong>${fmt(gust)}</strong> kn</div>
  </div>`;
}

/* ---- COMPARE ---- */
// Scoreboard above the text cards. Bar direction is always "less = left,
// more = right" — short bar for "less of this dimension", long for more.
// winnerDirection per dimension says which extreme is "better" for the
// clay accent: "higher" = longest bar wins, "lower" = shortest bar wins
// (e.g. distance to spot), null = no winner (preference-driven).
function compareScoreboardHTML(items) {
  if (items.length < 2) return "";
  const types = new Set(items.map(i => i.type));
  if (types.size > 1) return "";
  const type = items[0].type;
  if (type !== "spot" && type !== "center" && type !== "stay") return "";

  const m = userSelectedMonth() - 1;
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const v = (arr) => (Array.isArray(arr) && arr[m] != null && !isNaN(arr[m])) ? arr[m] : null;
  const crowdLow = c => ({ rustig: 1, low: 1, gemiddeld: 2, moderate: 2, druk: 3, high: 3 }[c] || null);

  // Count comma- or plus-separated chunks in a free-text field (proxy for
  // "how many things does this center offer in this category"). Used for
  // centers where the data is qualitative prose.
  const itemCount = (text) => {
    if (!text || typeof text !== "string") return null;
    const parts = text.split(/[,;]|\sand\s|\s\+\s/i).map(s => s.trim()).filter(Boolean);
    return parts.length || null;
  };

  // Parse a "Rating" prose string. Stays often have something like
  //   "TripAdvisor 4.7/5 over 23 reviews"
  //   "10+ Booking reviews 2023-2026 (most 9.0-10.0)"
  // Picks the first "/5" or "/10" pattern it sees and normalizes to a /5
  // scale. Returns null when nothing parseable is found.
  const parseRating = (text, structured) => {
    if (typeof structured === "number" && !isNaN(structured)) return structured;
    if (!text || typeof text !== "string") return null;
    // Explicit X.X/5
    const five = text.match(/(\d(?:\.\d+)?)\s*\/\s*5\b/);
    if (five) return Math.min(5, Math.max(0, parseFloat(five[1])));
    // Explicit X.X/10 — halve to /5
    const ten = text.match(/(\d(?:\.\d+)?)\s*\/\s*10\b/);
    if (ten) return Math.min(5, Math.max(0, parseFloat(ten[1]) / 2));
    // "TripAdvisor X.X" without explicit "/5" — TripAdvisor's scale IS /5
    const ta = text.match(/TripAdvisor\s+(\d(?:\.\d+)?)\b/i);
    if (ta) return Math.min(5, Math.max(0, parseFloat(ta[1])));
    // "Booking X.X" or "Google X.X" without explicit "/10" — assume /10
    const bg = text.match(/(?:Booking|Google|Hostelworld)\s*(?:\.com\s*)?(\d(?:\.\d+)?)\b/i);
    if (bg) return Math.min(5, Math.max(0, parseFloat(bg[1]) / 2));
    // "most 9.0-10.0" Booking range — assume /10
    const range = text.match(/most\s+(\d(?:\.\d+)?)[\s–-]+(\d(?:\.\d+)?)/i);
    if (range) {
      const mid = (parseFloat(range[1]) + parseFloat(range[2])) / 2;
      return Math.min(5, Math.max(0, mid / 2));
    }
    return null;
  };

  // Parse a distance string into meters. Returns null when nothing parseable.
  // Handles: explicit "X km" / "X m"; "Zero" or "middle of beach" or "On X
  // beach" → 0 m; "X-minute walk" → X * 80 m (~80 m / min walking pace);
  // "walking distance" / "short walk" → ~250 m fuzzy fallback. Stays can
  // also set verblijf.distanceM: <number> for an explicit override.
  const parseDistance = (text, structured) => {
    if (typeof structured === "number" && !isNaN(structured)) return structured;
    if (!text || typeof text !== "string") return null;
    if (/\bzero\b/i.test(text)) return 0;
    if (/\b(?:on|middle of)\b[^.,;]*\bbeach\b/i.test(text)) return 0;
    const mw = text.match(/(\d+)[\s-]+minute(?:s)?\s+walk/i);
    if (mw) return parseInt(mw[1], 10) * 80;
    const km = text.match(/(\d+(?:\.\d+)?)\s*km\b/i);
    if (km) return parseFloat(km[1]) * 1000;
    const mr = text.match(/(\d+(?:\.\d+)?)\s*m\b/i);
    if (mr) return parseFloat(mr[1]);
    if (/walking distance|short walk/i.test(text)) return 250;
    return null;
  };
  const fmtDistance = (mtrs) => mtrs >= 1000 ? `${(mtrs / 1000).toFixed(1)} km` : `${Math.round(mtrs)} m`;

  // mode: "fill" (default) | "range"
  // winnerDirection: "higher" → longest bar wins · "lower" → shortest wins ·
  //                  null → no winner (preference-driven)
  let all;
  const levelsDim = {
    icon: "🎓", label: "Levels welcome", mode: "levels",
    get: e => Array.isArray(e.levels) && e.levels.length ? e.levels : null
  };

  if (type === "spot") {
    all = [
      // Typical wind = 9-hour daytime average. Honest "what blows on
      // average across the surf window" number, not a flattering peak.
      { icon: "🌬️", label: "Wind (typical)", max: 30, unit: " kn", winnerDirection: "higher",
        get: e => v((getStatsFor(e) || {}).monthlyWindKn) },
      // Typical peak gust = avg of daily max gust (the strongest moment of
      // a typical day). Not the 5-year storm extreme.
      { icon: "💨", label: "Gust (typical peak)", max: 40, unit: " kn", winnerDirection: "higher",
        get: e => v((getStatsFor(e) || {}).monthlyDailyPeakKn) },
      { icon: "🌊", label: "Wave height", max: 3, unit: " m", fmt: x => x.toFixed(1), winnerDirection: "higher",
        get: e => v((getStatsFor(e) || {}).monthlyWaveM) },
      { icon: "🌡️", label: "Water warmth", max: 30, unit: " °C",
        get: e => v((getStatsFor(e) || {}).monthlyWaterC) },
      { icon: "☀️", label: "Daytime air", max: 35, unit: " °C",
        get: e => v((getStatsFor(e) || {}).monthlyAirC) },
      { icon: "👥", label: "Crowd", max: 3, unit: "",
        labelFor: x => x === 1 ? "Quiet" : x === 2 ? "Moderate" : "Busy",
        get: e => {
          const c = (e.condities && e.condities.drukte && e.condities.drukte.niveau)
                 || (getStatsFor(e) && getStatsFor(e).crowd);
          return crowdLow(c);
        } },
      levelsDim
    ];
  } else if (type === "center") {
    all = [
      levelsDim,
      { icon: "🏄", label: "Sports taught",
        // Surf pictograms for the four main sports; extra sports (SUP,
        // sail, …) render as a text chip alongside (LDW feedback).
        cellHTML: e => sportsCellHTML(e.sports) },
      { icon: "🏷️", label: "Gear brands", mode: "label", labelStyle: "wrap",
        // LDW (2026-05-20): show the actual brand names, not a count.
        // The brands string is usually formatted as "Name + Name + Name —
        // marketing prose" or "Name (note). Detail sentence." We extract
        // just the brand-list clause before the first em-dash or period.
        // labelStyle: "wrap" → render as wrappable text, not a one-line pill.
        get: e => {
          const raw = e.diensten && e.diensten.brands;
          if (!raw || typeof raw !== "string") return null;
          const compact = raw.split(/[—.]/, 1)[0].trim();
          return compact || raw;
        } },
      { icon: "🛠️", label: "Facilities", mode: "label", labelStyle: "wrap",
        // Show which facilities, not a count, and tag recognised facility
        // words with a pictogram for quick scanning (LDW/Michiel feedback).
        get: e => {
          const raw = e.diensten && e.diensten.faciliteiten;
          return (raw && typeof raw === "string" && raw.trim()) ? iconizeFacilities(raw.trim()) : null;
        } },
      // Wind for the user's currently selected month — average + typical
      // daily-peak gust, the same numbers the bar chart on the detail
      // page uses for that month. The month name lives in the row label
      // so it reads as "Wind in May" at a glance (LDW feedback).
      { icon: "💨", label: `Wind in ${monthNames[m]}`,
        cellHTML: e => windMonthCellHTML(getStatsFor(e), m) },
      // ---- Prices (partial: kept even if not all centers have the field) ----
      { icon: "💶", label: "Group lesson", max: 100, partial: true, winnerDirection: "lower",
        labelFor: x => "€" + x,
        get: e => (e.prices && typeof e.prices.groupLessonEUR === "number") ? e.prices.groupLessonEUR : null },
      { icon: "🛹", label: "Day rental", max: 120, partial: true, winnerDirection: "lower",
        labelFor: x => "€" + x,
        get: e => (e.prices && typeof e.prices.rentalDayEUR === "number") ? e.prices.rentalDayEUR : null },
      { icon: "📦", label: "Package", max: 1500, partial: true, winnerDirection: "lower",
        labelFor: x => "€" + x,
        get: e => (e.prices && typeof e.prices.packageEUR === "number") ? e.prices.packageEUR : null }
    ];
  } else { // stay
    // Numeric scores (1-5) live on verblijf.scores, inferred from prose
    // (refine in data.js if you disagree). Essence labels (style/vibe) are
    // categorical chips, no bar.
    const numericDims = [
      // Food: nullLabel "Self-catering" — for stays with no meal service the
      // score is left null in data.js (not a fake 3/5). The scoreboard then
      // shows a "Self-catering" chip instead of stars. By construction, a
      // null food score on a stay means exactly that: no meals served.
      { key: "food",        icon: "🍽️", label: "Food", nullLabel: "Self-catering" },
      { key: "hosts",       icon: "🤝", label: "Hosts" },
      { key: "comfort",     icon: "🛏️", label: "Comfort" },
      { key: "cleanliness", icon: "🧼", label: "Cleanliness" },
      { key: "value",       icon: "💶", label: "Value for money" }
    ].map(sd => ({
      icon: sd.icon, label: sd.label, max: 5, unit: " / 5", winnerDirection: "higher",
      fmt: x => x.toFixed(1),
      nullLabel: sd.nullLabel,
      get: e => {
        const s = e.verblijf && e.verblijf.scores;
        return (s && typeof s[sd.key] === "number") ? s[sd.key] : null;
      }
    }));
    const essenceDims = [
      { key: "style", icon: "🏠", label: "Style" },
      { key: "vibe",  icon: "✨", label: "Vibe" }
    ].map(sd => ({
      icon: sd.icon, label: sd.label, mode: "label",
      get: e => {
        const s = e.verblijf && e.verblijf.essence;
        return (s && typeof s[sd.key] === "string" && s[sd.key]) ? s[sd.key] : null;
      }
    }));

    all = [
      // Closer to the spot wins — short bar = close, long bar = far away.
      { icon: "📍", label: "Distance to surf spot", max: 5000, unit: "", winnerDirection: "lower",
        labelFor: mtrs => fmtDistance(mtrs),
        get: e => parseDistance(e.verblijf && e.verblijf.afstandSpot, e.verblijf && e.verblijf.distanceM) },
      // Aggregate review rating, parsed from the rating prose into a /5 scale.
      // Stays can override with verblijf.ratingScore: <0..5>.
      { icon: "⭐", label: "Review rating", max: 5, unit: " / 5", winnerDirection: "higher",
        fmt: x => x.toFixed(1),
        get: e => parseRating(e.verblijf && e.verblijf.rating, e.verblijf && e.verblijf.ratingScore) },
      // Things to do counts comma/and-separated items in activiteiten.
      { icon: "🗺️", label: "Things to do nearby", max: 8, unit: " items", winnerDirection: "higher",
        get: e => itemCount(e.verblijf && e.verblijf.activiteiten) },
      // ---- Prices (partial: kept even if some stays are "by enquiry") ----
      { icon: "🎟️", label: "Trip type", mode: "label", partial: true,
        get: e => e.prices && e.prices.tier ? cap(e.prices.tier) : null },
      { icon: "💶", label: "Price from", max: 250, partial: true, winnerDirection: "lower",
        labelFor: x => "€" + x,
        get: e => (e.prices && typeof e.prices.fromEUR === "number") ? e.prices.fromEUR : null },
      ...numericDims,
      ...essenceDims
    ];
  }

  const dims = all.filter(d => {
    // Custom-HTML dims (sport icons, mini wind table, …) decide their own
    // "missing data" rendering inside cellHTML, so they're always kept.
    if (typeof d.cellHTML === "function") return true;
    // `partial: true` rows are kept if AT LEAST ONE compared item has the
    // value (the others render "—"). Used for price rows so a "by enquiry"
    // stay doesn't hide the whole price row for everyone.
    const checker = d.partial ? items.some.bind(items) : items.every.bind(items);
    return checker(e => {
      const val = d.get(e);
      // A null value still counts as displayable when the dimension has a
      // nullLabel (e.g. Food → "Self-catering"). That keeps the Food row on
      // the scoreboard even when some — or all — compared stays serve no
      // meals: LDW wants Food to stay a permanent criterion, not vanish the
      // moment one self-catering stay is in the mix.
      if (val == null) return !!d.nullLabel;
      if (d.mode === "range") return val.lo != null && val.hi != null;
      if (d.mode === "label") return typeof val === "string" && val.length > 0;
      if (d.mode === "levels") return Array.isArray(val) && val.length > 0;
      return !isNaN(val);
    });
  });
  if (!dims.length) return "";

  // Renders one cell value depending on dimension mode + special-cases the
  // 1-to-5 score dimensions as stars instead of plain text.
  const fiveStar = (val) => {
    const v = Math.max(0, Math.min(5, Number(val) || 0));
    const full = Math.floor(v);
    const half = (v - full) >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return `<span class="sb-stars" title="${v.toFixed(1)} / 5">
      ${"★".repeat(full)}${half ? "<span class=\"sb-star-half\">★</span>" : ""}${"☆".repeat(empty)}
    </span>`;
  };
  const renderCell = (d, e) => {
    // Dims with a `cellHTML` function render arbitrary HTML (sport icons,
    // mini wind tables, …) — skipping the escHTML/text path below.
    if (typeof d.cellHTML === "function") {
      return `<td class="sb-cell">${d.cellHTML(e)}</td>`;
    }
    const val = d.get(e);
    if (val == null) {
      // A dimension can declare a nullLabel — shown as a chip instead of "—".
      // Used by "Food" so a self-catering stay reads "Self-catering" rather
      // than a meaningless dash or a fake middle score.
      if (d.nullLabel) {
        return `<td class="sb-cell"><span class="sb-chip">${escHTML(d.nullLabel)}</span></td>`;
      }
      return `<td class="sb-cell empty">—</td>`;
    }
    if (d.mode === "label") {
      // "wrap" → wrappable plain text (for longer values like brand lists).
      // Default → one-line pill chip (for short categorical labels).
      const cls = d.labelStyle === "wrap" ? "sb-label-wrap" : "sb-chip";
      return `<td class="sb-cell"><span class="${cls}">${escHTML(val)}</span></td>`;
    }
    if (d.mode === "levels") {
      const set = new Set(val);
      const pills = ["beginner","intermediate","advanced"]
        .map(k => `<span class="sb-level-pill${set.has(k)?" on":""}">${cap(k)}</span>`)
        .join("");
      return `<td class="sb-cell"><span class="sb-level-set">${pills}</span></td>`;
    }
    // 1-to-5 score dimensions → stars
    if (d.max === 5 && /\/\s*5/.test(d.unit || "")) {
      return `<td class="sb-cell">${fiveStar(val)}</td>`;
    }
    const fmt = d.fmt || (x => Math.round(x));
    const text = d.labelFor ? d.labelFor(val) : (fmt(val) + (d.unit || ""));
    return `<td class="sb-cell">${escHTML(text)}</td>`;
  };

  // Header row: dimension column header (empty) + one entry-name per column.
  const headerCells = items.map(e => `<th class="sb-entry-header">
    <div class="sb-entry-name">${escHTML(e.name)}</div>
    <div class="sb-entry-sub muted">${escHTML(e.town)}</div>
  </th>`).join("");

  // Body rows: dimension label + one value cell per compared entry.
  const rows = dims.map(d => {
    const cells = items.map(e => renderCell(d, e)).join("");
    return `<tr>
      <th class="sb-dim-cell">
        <span class="sb-dim-icon" aria-hidden="true">${d.icon}</span>
        <span class="sb-dim-label">${d.label}</span>
      </th>
      ${cells}
    </tr>`;
  }).join("");

  // --n-items drives the mobile CSS-grid: each row gets that many equal
  // columns when the layout flips below the 700-px breakpoint.
  const tableHTML = `<div class="sb-table-wrap">
    <table class="sb-table" style="--n-items: ${items.length}">
      <thead><tr><th class="sb-dim-cell"></th>${headerCells}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;

  const monthHint = type === "spot"
    ? `${monthNames[m]} numbers from each entry's data. `
    : "";
  const inferredNote = type === "stay"
    ? `<p class="muted form-note">⚠ Food / Hosts / Comfort / Cleanliness / Value / Style / Vibe are inferred from the reviewer prose — not yet verified against fresh reviews. Refine if you disagree.</p>`
    : "";

  // Sources block at the bottom — same self-documentation as the at-a-glance
  // panel on detail pages. For spots/centers we surface stats.source; for
  // stays we describe how distance, rating, and scores were derived.
  let sourcesHTML = "";
  if (type === "spot" || type === "center") {
    const lines = items.map(e => {
      const s = (getStatsFor(e) || {}).source;
      return `<li><strong>${escHTML(e.name)}</strong> &mdash; ${escHTML(s || "no source listed")}</li>`;
    }).join("");
    sourcesHTML = `<div class="sb-sources">
      <h3>Sources</h3>
      <ul class="sb-sources-list">${lines}</ul>
    </div>`;
  } else if (type === "stay") {
    sourcesHTML = `<div class="sb-sources">
      <h3>Sources</h3>
      <ul class="sb-sources-list">
        <li><strong>Distance to surf spot</strong> &mdash; parsed from each stay's <code>verblijf.afstandSpot</code> prose.</li>
        <li><strong>Review rating</strong> &mdash; parsed from each stay's <code>verblijf.rating</code> prose (TripAdvisor / Booking / Google / Hostelworld figures).</li>
        <li><strong>Things to do</strong> &mdash; count of comma- or and-separated items in <code>verblijf.activiteiten</code>.</li>
        <li><strong>Food / Hosts / Comfort / Cleanliness / Value / Style / Vibe</strong> &mdash; inferred by Claude from each stay's samenvatting / verhaal / lagen reviewer prose. See per-stay bron-strength labels (SOLID / MOSTLY SOLID / STALE) on the detail page for confidence.</li>
        <li><strong>Food &mdash; "Self-catering"</strong> &mdash; shown instead of a star score for stays with no meal service (kitchenette-only apartments). We don't rate food where no food is served.</li>
      </ul>
    </div>`;
  }

  // Month dropdown in the top-right of the scoreboard — quick switch
  // "hoe zou het zijn in een andere maand?" Persists to wavebase_month_
  // pref via the change handler wired in renderCompare.
  const monthSelectHTML = `<label class="sb-month-select-wrap">
    <span class="sb-month-select-label">📅 Month</span>
    <select id="sb-month-select" class="sb-month-select" aria-label="Compare for month">
      ${monthNames.map((mn, i) =>
        `<option value="${i + 1}"${i === m ? " selected" : ""}>${mn}</option>`
      ).join("")}
    </select>
  </label>`;
  return `<section class="cmp-scoreboard">
    <header class="sb-head">
      <div class="sb-head-text">
        <h2>Scoreboard</h2>
        <p class="muted form-note">${monthHint}You decide what's "better" for your trip.</p>
        ${inferredNote}
      </div>
      ${monthSelectHTML}
    </header>
    ${tableHTML}
    ${sourcesHTML}
  </section>`;
}

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
      ["Facilities", iconizeFacilities(d.faciliteiten) || "—"],
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

/* Compare-page mini-map. Same visual language as the Discover combined map
   (type-colored circle markers, OSM tiles, click-to-detail), but each pin
   carries a PERMANENT name label so users can correlate map pins with the
   scoreboard/cards below. Skipped when fewer than 2 items have coords —
   a single pin alone is wasted space. */
function compareMapHTML(items) {
  const withCoords = items.filter(e => Array.isArray(e.coords));
  if (withCoords.length < 2) return "";
  const counts = { spot: 0, center: 0, stay: 0 };
  withCoords.forEach(e => { if (counts[e.type] !== undefined) counts[e.type]++; });
  const keyChip = (type, n, singular, plural) => n
    ? `<span class="rml-key" aria-hidden="true"><span class="rml-dot ${type}"></span> ${n} ${n === 1 ? singular : plural}</span>`
    : "";
  const legend = [
    keyChip("spot",   counts.spot,   "spot",   "spots"),
    keyChip("center", counts.center, "center", "centers"),
    keyChip("stay",   counts.stay,   "stay",   "stays")
  ].filter(Boolean).join("");
  return `<section class="results-map-frame compare-map-frame" aria-label="Map of compared items">
    <div class="results-map-head">
      <span class="results-map-title">In one glance, on the map</span>
      <div class="results-map-legend">${legend}</div>
    </div>
    <div id="compare-mini-map" class="results-mini-map-stage" role="application" aria-label="Mini map of compared items"></div>
  </section>`;
}

function initCompareMap(items) {
  if (typeof L === "undefined") return;
  const el = document.getElementById("compare-mini-map");
  if (!el) return;
  const withCoords = items.filter(e => Array.isArray(e.coords));
  if (withCoords.length < 2) return;

  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
  }).addTo(map);

  const allCoords = [];
  withCoords.forEach(e => {
    allCoords.push(e.coords);
    const m = L.circleMarker(e.coords, {
      radius: 9, color: "#fff", weight: 2.5,
      fillColor: typeColor(e.type), fillOpacity: 1
    }).addTo(map);
    // Permanent name label so the user can match map pins to scoreboard
    // columns without clicking. Hover tooltip would force back-and-forth.
    m.bindTooltip(escHTML(e.name), {
      permanent: true, direction: "top", offset: [0, -8],
      className: "cmp-map-label"
    });
    m.on("click", () => { window.location.href = spotHref(e.id); });
  });
  // fitBounds: tight padding works for clustered items (one country); for
  // multi-country compares the maxZoom cap keeps it readable rather than
  // zooming to street level around a single dense cluster.
  map.fitBounds(allCoords, { padding: [40, 40], maxZoom: 12 });
  setTimeout(() => map.invalidateSize(), 60);
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
        <button class="cmp-remove" data-uncompare="${e.id}" aria-label="Remove from compare" title="Remove from compare">×</button>
        ${e.type === "stay" ? "" : sportIconsHTML(entrySports(e))}
      </div>
      <div class="cmp-body">
        <div class="place">${e.town}</div>
        <h3><a href="spot.html?id=${e.id}">${e.name}</a></h3>
        <p class="tag">${e.tagline}</p>
        ${pts}
      </div>
    </div>`;
  }).join("");
  root.innerHTML = `
    <div class="compare-head">
      <h1>Compare <span class="seccount">${items.length}</span></h1>
      <button class="btn ghost" id="clear-compare">Clear all</button>
    </div>
    ${compareMapHTML(items)}
    <div id="compare-scoreboard-slot">${compareScoreboardHTML(items)}</div>
    <div class="cmp-grid">${cols}</div>`;
  initCompareMap(items);
  document.getElementById("clear-compare").addEventListener("click", () => {
    WaveBaseAccount.clearCompare(); updateNav(); renderCompare();
  });
  root.querySelectorAll("[data-uncompare]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.toggleCompare(b.dataset.uncompare);
      updateNav(); renderCompare();
    });
  });
  // Month dropdown lives inside the scoreboard header. Re-bind on every
  // slot re-render so the freshly-rendered select stays interactive.
  const wireMonthSelect = () => {
    const sel = document.getElementById("sb-month-select");
    if (!sel) return;
    sel.addEventListener("change", () => {
      setMonthPref(parseInt(sel.value, 10));
      const slot = document.getElementById("compare-scoreboard-slot");
      if (slot) slot.innerHTML = compareScoreboardHTML(items);
      wireMonthSelect();
    });
  };
  wireMonthSelect();
}

/* ---- destinations mega-menu ---- */
// Open/close the destinations menu — exposed so the Where-field on Discover
// and the "pick a country to begin" empty-state link can also trigger it.
// The menu is positioned under the header (absolute). When opening from
// below the fold we need to scroll to top to make it visible — but ONLY
// from event handlers that fire AFTER mouseup (i.e. click handlers).
// Calling scroll from the focus handler (which fires BEFORE mouseup)
// shifts the page mid-click, so the mouseup target is wrong and bubbles
// to the document close-handler — the "flash" bug. Default opts.scroll=true
// is for click handlers; focus handlers pass {scroll:false}.
// Timestamp of the last open — used to ignore any "close" attempts that
// happen within the same click cycle (mousedown → focus → scroll → mouseup
// → click → bubble to document → close). 250 ms is enough to swallow the
// rogue event without disabling legitimate user clicks elsewhere.
let __destMenuOpenedAt = 0;
function openDestinationsMenu(opts) {
  const scroll = !opts || opts.scroll !== false;
  const panel = document.getElementById("destinations-menu");
  const trigger = document.getElementById("destinations-trigger");
  if (!panel || !trigger) return;
  panel.classList.add("open");
  trigger.classList.add("active");
  __destMenuOpenedAt = Date.now();
  if (scroll && window.scrollY > 4) window.scrollTo(0, 0);
}
function closeDestinationsMenu() {
  // Direct close (chip click, etc.) — no guard. The "race with opening"
  // guard lives in the document outside-click handler instead, so legit
  // manual closes still go through.
  const panel = document.getElementById("destinations-menu");
  const trigger = document.getElementById("destinations-trigger");
  if (!panel || !trigger) return;
  panel.classList.remove("open");
  trigger.classList.remove("active");
}

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
      const dataAttr = ` data-country="${co.name}" data-status="${co.status}"`;
      return co.status === "live"
        ? `<a class="dest-chip live" href="${href}"${dataAttr}>${co.flag} ${co.name}</a>`
        : `<a class="dest-chip soon" href="${href}"${dataAttr}>${co.flag} ${co.name}<span class="soon-tag">soon</span></a>`;
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
    const panel = document.getElementById("destinations-menu");
    const open = panel.classList.toggle("open");
    trigger.classList.toggle("active", open);
  });
  panel.addEventListener("click", ev => ev.stopPropagation());
  // Close on any click that's NOT inside the panel, the trigger, the
  // Where-field, or the country-picker empty-state button. Plus a 250 ms
  // grace window after opening — any rogue close attempt during the click
  // cycle that opened the menu is ignored. Belt + suspenders against the
  // "open then immediately close" flash.
  document.addEventListener("click", (ev) => {
    if (Date.now() - __destMenuOpenedAt < 250) return;
    const t = ev.target;
    if (!t) return;
    if (t.closest && (
      t.closest("#destinations-menu") ||
      t.closest("#destinations-trigger") ||
      t.closest("#f-country") ||
      t.closest("#empty-open-destinations")
    )) return;
    closeDestinationsMenu();
  });

  // On Discover: clicking a country chip should fill the Where field and
  // re-run the search inline (no full reload). Off Discover: normal navigation.
  if (document.getElementById("f-country")) {
    panel.querySelectorAll(".dest-chip").forEach(chip => {
      chip.addEventListener("click", ev => {
        ev.preventDefault();
        const country = chip.dataset.country;
        const input = document.getElementById("f-country");
        if (input) input.value = country;
        closeDestinationsMenu();
        // Update URL so deep-links + back button still work.
        const url = new URL(window.location.href);
        url.searchParams.set("country", country);
        window.history.replaceState(null, "", url.toString());
        if (typeof runSearch === "function") runSearch();
      });
    });
  }
}

/* ---- mobile bottom tab bar (Home / Explorer / Map / Compare / Me) ----
   About is intentionally not on the mobile bar — 6 tabs is too tight;
   it stays in the desktop nav + the footer. */
function initMobileTabbar() {
  if (document.querySelector(".mobile-tabbar")) return;

  const path = window.location.pathname;
  const route =
    /explorer\.html$/.test(path) ? "explorer" :
    /kaart\.html$/.test(path) ? "map" :
    /compare\.html$/.test(path) ? "compare" :
    /account\.html$/.test(path) ? "me" :
    /about\.html$/.test(path) ? "about" :
    "discover";

  const ico = {
    discover: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="16,8 13,14 8,16 11,10"/></svg>',
    map: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    compare: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    me: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    explorer: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>'
  };
  const tabs = [
    { route: "discover", href: "index.html", label: "Home" },
    { route: "explorer", href: "explorer.html", label: "Explorer" },
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

  // Auto-hide-on-scroll: scrolling down hides the bar (more reading room
  // for content-heavy pages — LDW: "doel is om meer plaats te winnen"),
  // scrolling up brings it back. Always show near the top so the bar
  // is reachable when the user just landed. rAF-throttled so the scroll
  // listener stays cheap; a small px threshold ignores micro-jitter.
  let lastY = window.scrollY;
  let ticking = false;
  const HIDE_AFTER_PX = 80;   // don't hide until scrolled past this
  const DELTA = 6;            // px threshold to count as a real scroll
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (y < HIDE_AFTER_PX) {
        nav.classList.remove("is-hidden");
      } else if (dy > DELTA) {
        nav.classList.add("is-hidden");
      } else if (dy < -DELTA) {
        nav.classList.remove("is-hidden");
      }
      // Mirror the state on <body> so other fixed elements (e.g. the
      // .mobile-filters-trigger floating button) can drop to the real
      // bottom when the tabbar slides away and rise back when it returns.
      document.body.classList.toggle("tabbar-hidden", nav.classList.contains("is-hidden"));
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
}

/* ---- Continent page — list of countries in one continent ----
   Live countries get a prominent linked card showing spot/stay/center
   counts (click → Discover filtered to that country); queued countries
   render as dim dashed cards with "coming soon". */
function initContinent() {
  const root = document.getElementById("continent-root");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  if (!name) {
    window.location.replace("404.html");
    return;
  }
  const continent = (typeof WAVEBASE_DESTINATIONS !== "undefined")
    ? WAVEBASE_DESTINATIONS.find(c => c.continent === name) : null;
  if (!continent) {
    window.location.replace("404.html");
    return;
  }
  document.title = `${continent.continent} — WaveBase`;

  const live = continent.countries.filter(c => c.status === "live");
  const soon = continent.countries.filter(c => c.status !== "live");
  const countryEntries = co => WAVEBASE_DATA.filter(e => entryCountry(e) === co.name);

  let html = `
    <header class="continent-head">
      <p class="continent-kicker">Continent</p>
      <h1>${escHTML(continent.continent)}</h1>
      <p class="continent-sub">
        <strong>${live.length}</strong> ${live.length === 1 ? "country" : "countries"} live ·
        <strong>${soon.length}</strong> queued
      </p>
    </header>
  `;

  if (live.length) {
    html += `<h2 class="continent-section-h">Live now</h2>`;
    html += `<div class="continent-grid">`;
    live.forEach(co => {
      const entries = countryEntries(co);
      const spots   = entries.filter(e => e.type === "spot").length;
      const stays   = entries.filter(e => e.type === "stay").length;
      const centers = entries.filter(e => e.type === "center").length;
      const parts = [];
      if (spots)   parts.push(`${spots} ${spots === 1 ? "spot" : "spots"}`);
      if (stays)   parts.push(`${stays} ${stays === 1 ? "stay" : "stays"}`);
      if (centers) parts.push(`${centers} ${centers === 1 ? "center" : "centers"}`);
      html += `
        <a class="continent-country live" href="index.html?country=${encodeURIComponent(co.name)}">
          <span class="cc-flag">${co.flag}</span>
          <span class="cc-body">
            <strong class="cc-name">${escHTML(co.name)}</strong>
            <span class="cc-count">${parts.join(" · ") || "Live"}</span>
          </span>
          <span class="cc-go">Explore &rarr;</span>
        </a>
      `;
    });
    html += `</div>`;
  }

  if (soon.length) {
    html += `<h2 class="continent-section-h">Coming next</h2>`;
    html += `<div class="continent-grid">`;
    soon.forEach(co => {
      html += `
        <div class="continent-country soon">
          <span class="cc-flag">${co.flag}</span>
          <span class="cc-body">
            <strong class="cc-name">${escHTML(co.name)}</strong>
            <span class="cc-count">Coming soon</span>
          </span>
        </div>
      `;
    });
    html += `</div>`;
  }

  root.innerHTML = html;
}

/* ---- Persistent header search ----
   On non-Discover pages the searchbar lives permanently in the header.
   It doesn't filter the current page (there's nothing to filter on a
   detail page); pressing Enter hops to Discover with the query so the
   user lands in the full search results. */
function wireHeaderSearch() {
  const input = document.getElementById("f-header-search");
  const clear = document.getElementById("f-header-search-clear");
  if (!input) return;
  const go = () => {
    const q = input.value.trim();
    if (q) window.location.href = `index.html?q=${encodeURIComponent(q)}`;
  };
  input.addEventListener("keydown", ev => {
    if (ev.key === "Enter") { ev.preventDefault(); go(); }
    else if (ev.key === "Escape") { input.value = ""; if (clear) clear.hidden = true; }
  });
  input.addEventListener("input", () => {
    if (clear) clear.hidden = !input.value;
  });
  if (clear) {
    clear.addEventListener("click", () => {
      input.value = "";
      clear.hidden = true;
      input.focus();
    });
  }
}

/* ============================================================
   Cookie consent + Cloudflare Web Analytics loader
   ============================================================
   Strict-necessary localStorage (saved spots, trips, compare,
   reviews mock) runs always — it's part of how the site works
   and stays on the user's device. Analytics is opt-in: the
   Cloudflare beacon is only injected after the user clicks
   Accept (or Customize → Analytics on). Choice persists in
   `wavebase_consent_v1`. The footer link re-opens the banner. */
const CONSENT_KEY = "wavebase_consent_v1";
const CF_BEACON_TOKEN = "62ad05eecbb8442ba571b2d4db28b8b5";

function readConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function writeConsent(obj) {
  try {
    const entry = Object.assign({ ts: new Date().toISOString() }, obj);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(entry));
  } catch (e) { /* ignore */ }
}
function loadCloudflareBeacon() {
  if (document.getElementById("cf-beacon-loaded")) return;
  const s = document.createElement("script");
  s.id = "cf-beacon-loaded";
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_BEACON_TOKEN }));
  document.body.appendChild(s);
}

function renderConsentBanner(opts) {
  opts = opts || {};
  closeConsentBanner();
  const current = readConsent() || { analytics: true };
  const wrap = document.createElement("div");
  wrap.id = "consent-banner";
  wrap.className = "consent-banner";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-live", "polite");
  wrap.setAttribute("aria-label", "Cookie and tracking preferences");
  wrap.innerHTML = `
    <div class="consent-inner">
      <div class="consent-body">
        <strong>A word on cookies.</strong>
        Your saved places, trips and compare list stay in this browser only
        &mdash; they never leave your device. We also count anonymous visits
        with Cloudflare Web Analytics (no cookies, no profiles) so we can
        see which pages people actually use. You can switch that off.
        <a href="privacy.html">Read the privacy policy</a>.
      </div>
      <div class="consent-options" hidden id="consent-customize">
        <label class="consent-row">
          <input type="checkbox" checked disabled>
          <span><strong>Strictly necessary</strong> &mdash; needed for the site to work (always on).</span>
        </label>
        <label class="consent-row">
          <input type="checkbox" id="consent-analytics" ${current.analytics ? "checked" : ""}>
          <span><strong>Anonymous analytics</strong> &mdash; Cloudflare Web Analytics, no cookies, no individual tracking.</span>
        </label>
      </div>
      <div class="consent-actions">
        <button type="button" class="btn" data-consent="accept">Accept all</button>
        <button type="button" class="btn btn-quiet" data-consent="reject">Reject analytics</button>
        <button type="button" class="btn btn-quiet" data-consent="customize">Customize</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  wrap.querySelector('[data-consent="accept"]').addEventListener("click", () => {
    writeConsent({ analytics: true });
    loadCloudflareBeacon();
    closeConsentBanner();
  });
  wrap.querySelector('[data-consent="reject"]').addEventListener("click", () => {
    writeConsent({ analytics: false });
    closeConsentBanner();
  });
  wrap.querySelector('[data-consent="customize"]').addEventListener("click", () => {
    const box = document.getElementById("consent-customize");
    if (box.hidden) {
      box.hidden = false;
      // Replace the three-button row with a single save button when expanded.
      const actions = wrap.querySelector(".consent-actions");
      actions.innerHTML =
        '<button type="button" class="btn" data-consent="save">Save my choice</button>' +
        '<button type="button" class="btn btn-quiet" data-consent="cancel">Cancel</button>';
      actions.querySelector('[data-consent="save"]').addEventListener("click", () => {
        const analytics = !!document.getElementById("consent-analytics").checked;
        writeConsent({ analytics });
        if (analytics) loadCloudflareBeacon();
        closeConsentBanner();
      });
      actions.querySelector('[data-consent="cancel"]').addEventListener("click", closeConsentBanner);
    }
  });
}
function closeConsentBanner() {
  const el = document.getElementById("consent-banner");
  if (el) el.remove();
}
function initConsent() {
  const current = readConsent();
  if (!current) {
    renderConsentBanner();
  } else if (current.analytics) {
    loadCloudflareBeacon();
  }
}
// Footer link wires here.
function openConsentPreferences() {
  renderConsentBanner({ reopen: true });
}

/* Driving-directions options for a place. Apple Maps shows on Apple
   devices (iPhone, iPad, Mac — modern iPads report as "Macintosh");
   Waze and Google Maps appear everywhere. When a base is set the route
   starts FROM that base — Apple Maps (saddr) and Google Maps (origin)
   support a fixed start point; Waze's deep link does not, so Waze always
   routes from the user's live location. Returns [{label, href}]. */
function navApps(e, base) {
  if (!Array.isArray(e.coords)) return [];
  const dlat = e.coords[0], dlng = e.coords[1];
  const hasBase = !!(base && isFinite(base.lat) && isFinite(base.lng));
  const onApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent || "");
  const apps = [];
  if (onApple) {
    const saddr = hasBase ? `&saddr=${base.lat},${base.lng}` : "";
    apps.push({ label: "Apple Maps", href: `https://maps.apple.com/?daddr=${dlat},${dlng}${saddr}&dirflg=d` });
  }
  apps.push({ label: "Waze", href: `https://waze.com/ul?ll=${dlat},${dlng}&navigate=yes` });
  const gOrigin = hasBase ? `&origin=${base.lat},${base.lng}` : "";
  apps.push({ label: "Google Maps", href: `https://www.google.com/maps/dir/?api=1&destination=${dlat},${dlng}${gOrigin}&travelmode=driving` });
  return apps;
}
/* The inline "Navigate there" block for map-pin popups. */
function navAppsHTML(e, base) {
  const apps = navApps(e, base);
  if (!apps.length) return "";
  const links = apps.map(a => `<a href="${a.href}" target="_blank" rel="noopener">${a.label}</a>`).join("");
  return `<div class="exp-pop-nav"><span class="exp-pop-nav-label">Navigate there</span>${links}</div>`;
}

/* A small popover, anchored under a trip row's navigate button, that lets
   you pick which maps app to navigate with. */
function openNavPopover(btn, e) {
  closeNavPopover();
  const apps = navApps(e);
  if (!apps.length) return;
  const wrapper = document.createElement("div");
  wrapper.className = "trip-popover nav-popover";
  wrapper.innerHTML = `<ul class="trip-pop-list">${apps.map(a =>
    `<li><a class="trip-pop-item" href="${a.href}" target="_blank" rel="noopener">${a.label}</a></li>`
  ).join("")}</ul>`;
  document.body.appendChild(wrapper);
  const r = btn.getBoundingClientRect();
  wrapper.style.top = `${window.scrollY + r.bottom + 6}px`;
  wrapper.style.left = `${window.scrollX + r.left}px`;
  requestAnimationFrame(() => {
    const w = wrapper.getBoundingClientRect();
    if (w.right > window.innerWidth - 8) {
      wrapper.style.left = `${window.scrollX + window.innerWidth - w.width - 8}px`;
    }
  });
  wrapper.querySelectorAll(".trip-pop-item").forEach(item => {
    item.addEventListener("click", closeNavPopover);
  });
  setTimeout(() => {
    document.addEventListener("click", closeNavPopover, { once: true });
  }, 0);
}
function closeNavPopover() {
  const p = document.querySelector(".nav-popover");
  if (p) p.remove();
}
/* Wire every navigate button (data-nav) under root to open its popover. */
function wireTripNav(root) {
  root.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      const e = byId(btn.dataset.nav);
      if (e) openNavPopover(btn, e);
    });
  });
}

/* Windy.com forecast link for a spot. The /lat/lng path makes Windy drop
   a marker ON the exact spot and open the forecast detail panel (just
   ?coords would only re-centre the map — no pin). The ?overlay,lat,lng,
   zoom part positions the map; overlay matches the sport — waves for
   surf, wind for windsurf/kite/wing. A plain deep link: no API, no key. */
function windyHref(e) {
  if (!Array.isArray(e.coords)) return "";
  const lat = e.coords[0], lng = e.coords[1];
  const overlay = entrySports(e).includes("wave") ? "waves" : "wind";
  return `https://www.windy.com/${lat}/${lng}?${overlay},${lat},${lng},12`;
}

/* ===== Explorer page (explorer.html) — base + reach spot discovery =====
   The use case: "I'm in <region>, I have my own gear, I want a spot I
   don't know yet that's not too far." Set a base, set a reach, see the
   spots within range. Fase 1 = base + reach + list. (Fase 2 adds the
   new-vs-known dimming; Fase 3 conditions; Fase 4 real drive time.) */
function initExplorer() {
  const mapEl = document.getElementById("exp-map");
  if (typeof L === "undefined" || !mapEl) return;

  const LS_KEY = "wavebase_explorer_v1";
  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        region: state.region, base: state.base, maxKm: state.maxKm,
        sports: state.sports, onlyNew: state.onlyNew
      }));
    } catch (e) {}
  }

  // Regions = countries that have at least one spot with coords.
  const regions = [...new Set(
    WAVEBASE_DATA.filter(e => e.type === "spot" && Array.isArray(e.coords)).map(e => entryCountry(e))
  )].sort();
  if (!regions.length) return;

  const params = new URLSearchParams(window.location.search);
  const stored = loadState();
  const state = {
    region: (stored.region === "all" || (stored.region && regions.indexOf(stored.region) !== -1)) ? stored.region : regions[0],
    base:   stored.base || null,          // {lat, lng, label}
    maxKm:  stored.maxKm || 25,
    sports: stored.sports || { wave: true, wind: true, kite: true, wing: true },
    onlyNew: false                        // "only new to me" — removed
  };

  // Fase 2 — "known" spots = surfed / saved / in a trip. A spot you've
  // engaged with is not a spot to "discover". Built once.
  const tripSpotIds = new Set();
  (WaveBaseAccount.getTrips() || []).forEach(t => {
    (t.spotIds || []).forEach(id => tripSpotIds.add(id));
  });
  function spotKnown(e) {
    if (WaveBaseAccount.isSurfed(e.id)) return "surfed";
    if (tripSpotIds.has(e.id)) return "trip";
    if (WaveBaseAccount.isSaved(e.id)) return "saved";
    return null;
  }
  // ?region= override
  const urlRegion = params.get("region");
  if (urlRegion && regions.indexOf(urlRegion) !== -1) state.region = urlRegion;
  // ?view=all — the "Discover new places" entry point: show every spot on
  // the website at once, map zoomed out to fit them all (no base).
  if (params.get("view") === "all") {
    state.region = "all";
    state.base = null;
  }
  // ?base=<stayId> — the stay-page launch bridge
  const urlBase = params.get("base");
  if (urlBase) {
    const stay = byId(urlBase);
    if (stay && Array.isArray(stay.coords)) {
      state.base = { lat: stay.coords[0], lng: stay.coords[1], label: stay.name };
      state.region = entryCountry(stay);
    }
  }

  // ---- map ----
  const map = L.map(mapEl, { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
  }).addTo(map);
  // An initial view so layers can project. An L.circle (metric radius)
  // added before any view throws "layerPointToLatLng" — redraw()'s
  // fitBounds immediately corrects this in the same frame.
  map.setView([20, 0], 2);
  const spotLayer = L.layerGroup().addTo(map);
  let baseMarker = null, reachCircle = null;
  let rows = []; // [{entry, dist, inReach, marker}]

  function regionSpots() {
    return WAVEBASE_DATA.filter(e =>
      e.type === "spot" && Array.isArray(e.coords) &&
      (state.region === "all" || entryCountry(e) === state.region));
  }
  function sportOk(e) { return entrySports(e).some(s => state.sports[s]); }
  // Geolocation helper — snap the region to the country of the nearest spot.
  function regionForPoint(lat, lng) {
    let best = null, bestD = Infinity;
    WAVEBASE_DATA.forEach(e => {
      if (e.type !== "spot" || !Array.isArray(e.coords)) return;
      const d = distanceKm([lat, lng], e.coords);
      if (d < bestD) { bestD = d; best = entryCountry(e); }
    });
    return best || state.region;
  }
  function setBase(lat, lng, label) {
    state.base = { lat: lat, lng: lng, label: label || "Your pin" };
    saveState(); redraw(true);
  }
  function clearBase() { state.base = null; saveState(); redraw(true); }

  function redraw(fit) {
    spotLayer.clearLayers();
    if (baseMarker) { map.removeLayer(baseMarker); baseMarker = null; }
    if (reachCircle) { map.removeLayer(reachCircle); reachCircle = null; }
    rows = [];

    const spots = regionSpots().filter(sportOk);

    if (state.base) {
      const bll = [state.base.lat, state.base.lng];
      reachCircle = L.circle(bll, {
        radius: state.maxKm * 1000, color: "#3f6f7d", weight: 1.5,
        fillColor: "#3f6f7d", fillOpacity: 0.06, dashArray: "5,6", interactive: false
      }).addTo(map);
      baseMarker = L.marker(bll, {
        draggable: true,
        icon: L.divIcon({ className: "exp-base-pin", html: "★", iconSize: [32,32], iconAnchor: [16,16] })
      }).addTo(map);
      baseMarker.bindTooltip(state.base.label, { direction: "top", offset: [0,-14] });
      baseMarker.on("dragend", () => {
        const ll = baseMarker.getLatLng();
        setBase(ll.lat, ll.lng, "Your pin");
      });
    }

    spots.forEach(e => {
      const dist = state.base ? distanceKm([state.base.lat, state.base.lng], e.coords) : null;
      const inReach = dist == null ? true : dist <= state.maxKm;
      const known = spotKnown(e);
      if (state.onlyNew && known) return;   // "only new to me" — drop known spots
      const faded = state.base && !inReach;
      // Pin style: out-of-reach faded · in-reach known greyed · in-reach fresh bright.
      let fill, fillOp, op, rad;
      if (faded)      { fill = typeColor("spot"); fillOp = 0.4;  op = 0.55; rad = 6; }
      else if (known) { fill = "#9c968a";         fillOp = 0.75; op = 0.9; rad = 8; }
      else            { fill = typeColor("spot"); fillOp = 1;    op = 1;   rad = 9; }
      const m = L.circleMarker(e.coords, {
        radius: rad, color: "#fff", weight: 2, fillColor: fill, fillOpacity: fillOp, opacity: op
      });
      const distLine = dist != null ? ` <span class="exp-pop-dist">· ${fmtKm(dist)} from base</span>` : "";
      const wHref = windyHref(e);
      const forecastLink = wHref ? ` <span class="exp-pop-sep">·</span> <a href="${wHref}" target="_blank" rel="noopener">See forecast →</a>` : "";
      const statusLine = known
        ? `<br><span class="exp-pop-status">${known === "surfed" ? "✓ You've surfed this" : known === "trip" ? "In one of your trips" : "♥ Saved"}</span>`
        : "";
      m.bindPopup(`<strong>${escHTML(e.name)}</strong><br><span class="rml-tip-meta">${escHTML(e.town)}${distLine}</span>${statusLine}<br><span class="exp-pop-tag">${escHTML(e.tagline || "")}</span><br><a href="spot.html?id=${e.id}">See the analysis →</a>${forecastLink}${navAppsHTML(e, state.base)}`);
      m.addTo(spotLayer);
      rows.push({ entry: e, dist: dist, inReach: inReach, known: known, marker: m });
    });

    // Only re-fit the map on a base / region / first-load change — never on
    // a filter tweak (reach, sport, only-new), so the view holds still while
    // you refine. Out-of-reach spots stay on the map (just faded), so the
    // fitted bounds cover every spot plus the whole reach circle.
    if (fit) {
      if (state.base && reachCircle) {
        const b = reachCircle.getBounds();
        spots.forEach(e => b.extend(e.coords));
        map.fitBounds(b, { padding: [24,24] });
      } else {
        const pts = spots.map(e => e.coords);
        if (pts.length) map.fitBounds(pts, { padding: [34,34], maxZoom: 11 });
      }
    }

    renderList();
    renderBaseStatus();
    setTimeout(() => map.invalidateSize(), 60);
  }

  function renderList() {
    const el = document.getElementById("exp-list");
    if (!el) return;
    let list = rows.slice();
    if (state.base) {
      // In-reach spots first (nearest first); out-of-reach spots are NOT
      // dropped — they stay in the list below, shown faded / non-active.
      list.sort((a,b) =>
        (a.inReach === b.inReach) ? (a.dist - b.dist) : (a.inReach ? -1 : 1));
    } else {
      list.sort((a,b) => a.entry.name.localeCompare(b.entry.name));
    }
    const inReachCount = list.filter(r => r.inReach).length;
    const freshCount = list.filter(r => r.inReach && !r.known).length;
    let head;
    if (state.base) {
      head = inReachCount
        ? `<div class="exp-list-head">${inReachCount} spot${inReachCount===1?"":"s"} within ${state.maxKm} km${state.onlyNew ? "" : ` · <span class="exp-fresh-count">${freshCount} new to you</span>`}</div>`
        : `<div class="exp-list-head">Nothing within ${state.maxKm} km yet <span class="muted">— widen your reach</span></div>`;
    } else if (state.region === "all") {
      head = `<div class="exp-list-head">${list.length} spot${list.length===1?"":"s"} across every region <span class="muted">— set your base to sort by distance</span></div>`;
    } else {
      head = `<div class="exp-list-head">${list.length} spot${list.length===1?"":"s"} in ${escHTML(state.region)} <span class="muted">— set your base to sort by distance</span></div>`;
    }
    const legend = (state.base && !state.onlyNew)
      ? `<div class="exp-legend"><span class="exp-leg-dot fresh"></span>new to you<span class="exp-leg-dot known"></span>surfed / saved / in a trip</div>`
      : "";
    if (!list.length) {
      const msg = state.onlyNew
        ? "Nothing new to you in this region — switch off “only new to me” to see every spot."
        : "No spots match — turn a sport filter back on.";
      el.innerHTML = head + `<p class="exp-list-empty">${msg}</p>`;
      return;
    }
    const items = list.map(r => {
      const distChip = r.dist != null ? `<span class="exp-row-dist">${fmtKm(r.dist)}</span>` : "";
      const badge = r.known
        ? ` <span class="exp-row-badge ${r.known}">${r.known === "surfed" ? "✓ surfed" : r.known === "trip" ? "in a trip" : "saved"}</span>`
        : "";
      const faded = state.base && !r.inReach;
      return `<button type="button" class="exp-row${r.known ? " is-known" : ""}${faded ? " is-faded" : ""}" data-id="${r.entry.id}">
        <span class="exp-row-main">
          <span class="exp-row-name">${escHTML(r.entry.name)}</span>
          <span class="exp-row-town">${escHTML(r.entry.town)}${badge}</span>
        </span>${distChip}
      </button>`;
    }).join("");
    el.innerHTML = head + legend + `<div class="exp-rows">${items}</div>`;
    el.querySelectorAll(".exp-row").forEach(btn => {
      btn.addEventListener("click", () => {
        const r = rows.find(x => x.entry.id === btn.dataset.id);
        if (r) { map.panTo(r.entry.coords); r.marker.openPopup(); }
      });
    });
  }

  function renderBaseStatus() {
    const el = document.getElementById("exp-base-status");
    if (!el) return;
    if (state.base) {
      el.innerHTML = `<span class="exp-base-set">📍 Base: <strong>${escHTML(state.base.label)}</strong></span>
        <button type="button" class="exp-clear" id="exp-clear">Clear base</button>`;
      const c = document.getElementById("exp-clear");
      if (c) c.addEventListener("click", clearBase);
    } else {
      el.innerHTML = `<span class="exp-base-none">No base set yet — click anywhere on the map, use your location, or pick a stay.</span>`;
    }
  }

  // ---- controls ----
  const regionSel = document.getElementById("exp-region");
  regionSel.innerHTML =
    `<option value="all"${state.region==="all"?" selected":""}>🌍 All regions</option>` +
    regions.map(r =>
      `<option value="${escHTML(r)}"${r===state.region?" selected":""}>${escHTML(r)}</option>`).join("");
  regionSel.addEventListener("change", () => {
    state.region = regionSel.value; saveState(); populateStays(); redraw(true);
  });

  function populateStays() {
    const sel = document.getElementById("exp-stay");
    const stays = WAVEBASE_DATA.filter(e =>
      e.type === "stay" && Array.isArray(e.coords) &&
      (state.region === "all" || entryCountry(e) === state.region));
    if (!stays.length) {
      sel.innerHTML = `<option value="">No stays in this region</option>`;
      sel.disabled = true; return;
    }
    sel.disabled = false;
    sel.innerHTML = `<option value="">Pick a stay…</option>` +
      stays.map(s => `<option value="${s.id}">${escHTML(s.name)}</option>`).join("");
  }
  populateStays();
  document.getElementById("exp-stay").addEventListener("change", function () {
    if (!this.value) return;
    const stay = byId(this.value);
    if (stay && Array.isArray(stay.coords)) setBase(stay.coords[0], stay.coords[1], stay.name);
    this.value = "";
  });

  document.getElementById("exp-geo").addEventListener("click", function () {
    if (!navigator.geolocation) { alert("Your browser doesn't support location."); return; }
    const btn = this;
    btn.disabled = true; btn.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(
      pos => {
        btn.disabled = false; btn.textContent = "📍 Use my location";
        const lat = pos.coords.latitude, lng = pos.coords.longitude;
        const r = regionForPoint(lat, lng);
        if (r && regions.indexOf(r) !== -1) { state.region = r; regionSel.value = r; populateStays(); }
        setBase(lat, lng, "Your location");
      },
      () => {
        btn.disabled = false; btn.textContent = "📍 Use my location";
        alert("Couldn't get your location. Click the map to set a base instead.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  const reach = document.getElementById("exp-reach");
  const reachVal = document.getElementById("exp-reach-val");
  reach.value = state.maxKm;
  reachVal.textContent = state.maxKm + " km";
  // Variable step: 5-km increments at/above 5 km, but 1-km increments
  // below 5 (… 4, 3, 2, 1) — LDW wants fine control on short reaches.
  reach.addEventListener("input", () => {
    let v = parseInt(reach.value, 10) || 25;
    if (v >= 5) v = Math.round(v / 5) * 5;
    v = Math.max(1, Math.min(120, v));
    state.maxKm = v;
    reachVal.textContent = v + " km";
    saveState(); redraw(false);
  });

  const sportsEl = document.getElementById("exp-sports");
  const SPORTS = [["wave","Surf"],["wind","Windsurf"],["kite","Kitesurf"],["wing","Wingfoil"]];
  sportsEl.innerHTML = SPORTS.map(([k,label]) =>
    `<button type="button" class="exp-sport${state.sports[k]?" on":""}" data-sport="${k}">${label}</button>`).join("");
  sportsEl.querySelectorAll(".exp-sport").forEach(btn => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.sport;
      state.sports[k] = !state.sports[k];
      btn.classList.toggle("on", state.sports[k]);
      saveState(); redraw(false);
    });
  });

  // Click anywhere on the map → set/move the base there.
  map.on("click", e => setBase(e.latlng.lat, e.latlng.lng, "Your pin"));

  redraw(true);
}

/* ===== Discover page (discover.html) — top 5 spots per live country =====
   Each live country gets its five best spots for the chosen month, ranked
   by how in-season they are (peak > high > shoulder > unknown > off — the
   honest signal, no fabricated star score). Countries are ordered so the
   one firing hardest this month floats to the top. */
function discoverSeasonScore(klass) {
  return klass === "peak" ? 3 : klass === "high" ? 2
       : klass === "shoulder" ? 1 : klass === "off" ? -1 : 0;
}

function renderDiscover(month) {
  const live = [];
  if (typeof WAVEBASE_DESTINATIONS !== "undefined") {
    WAVEBASE_DESTINATIONS.forEach(cont => {
      cont.countries.forEach(co => { if (co.status === "live") live.push(co); });
    });
  }
  const monthLabel = WAVEBASE_MONTHS_FULL[month] || WAVEBASE_MONTHS[month] || "";
  const blocks = live.map(co => {
    const ranked = WAVEBASE_DATA
      .filter(e => e.type === "spot" && entryCountry(e) === co.name)
      .map(e => {
        const s = seasonForMonth(getStatsFor(e), month);
        return { e: e, klass: s ? s.klass : null };
      })
      .sort((a, b) => discoverSeasonScore(b.klass) - discoverSeasonScore(a.klass))
      .slice(0, 5);
    const total = ranked.reduce((sum, x) => sum + discoverSeasonScore(x.klass), 0);
    const inSeason = ranked.filter(x => x.klass === "peak" || x.klass === "high").length;
    return { co: co, ranked: ranked, total: total, inSeason: inSeason };
  }).filter(b => b.ranked.length);
  blocks.sort((a, b) => b.total - a.total);
  if (!blocks.length) return `<p class="muted">No spots to show yet — check back as new regions go live.</p>`;
  return blocks.map(b => {
    const sub = b.inSeason
      ? `${b.inSeason} ${b.inSeason === 1 ? "spot" : "spots"} in season in ${monthLabel}`
      : `Quieter side of the year — ${monthLabel} is low season here, but here's the best of it`;
    return `<section class="discover-country">
      <div class="discover-country-head">
        <h2><span class="discover-flag" aria-hidden="true">${b.co.flag}</span> ${escHTML(b.co.name)}</h2>
        <p class="discover-country-sub">${escHTML(sub)}</p>
      </div>
      <div class="grid">${b.ranked.map(x => cardHTML(x.e)).join("")}</div>
    </section>`;
  }).join("");
}

function initDiscover() {
  const root = document.getElementById("discover-root");
  const mSel = document.getElementById("disc-month");
  if (!root || !mSel) return;
  for (let i = 1; i <= 12; i++) {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = WAVEBASE_MONTHS_FULL[i] || WAVEBASE_MONTHS[i];
    mSel.appendChild(o);
  }
  mSel.value = String(userSelectedMonth());
  function render() {
    const month = parseInt(mSel.value, 10) || (new Date().getMonth() + 1);
    setMonthPref(month); // carry the choice to Compare / detail pages
    root.innerHTML = renderDiscover(month);
    wireCards(root);
  }
  mSel.addEventListener("change", render);
  render();
}

/* ---- router ----
   Page init runs in two phases now that data comes from the API
   (api-client.js) rather than synchronously from data.js:

   Phase 1 (DOMContentLoaded): chrome that doesn't need spot data —
     consent banner, nav, destinations menu, mobile tabbar, header
     search. Renders immediately so the page chrome isn't blank
     while we wait for the API.

   Phase 2 (wavebase:data-ready): page-specific renderers that read
     WAVEBASE_DATA / WAVEBASE_TOWNS. api-client.js dispatches this
     event after it has fetched + remapped the API response into the
     globals. If the fetch fails the event still fires (so pages can
     render an empty state) — see api-client.js. */
document.addEventListener("DOMContentLoaded", () => {
  initConsent();
  updateNav();
  initDestinations();   // uses WAVEBASE_DESTINATIONS (static, in data.js)
  initMobileTabbar();
  wireHeaderSearch();
});

window.addEventListener("wavebase:data-ready", () => {
  // Clean stale IDs out of localStorage. Saved + compare + surfed
  // lists can drift out of sync with WAVEBASE_DATA when an entry
  // gets renamed, removed or assigned a different ID (e.g. our
  // post-API-migration slug-vs-UUID shuffle). The Compare page
  // already byId-filters before render, so the cards display
  // correctly — but the nav badge reads .length, so a stale ID
  // sticks as a phantom "Compare (2)" with nothing inside. Same
  // hazard for the saved-count badge if we add one. Wipe once
  // here, right after data is loaded, then re-render the nav so
  // the count matches what the user actually sees.
  pruneStaleAccountIds();
  if (typeof updateNav === "function") updateNav();

  if (document.getElementById("results")) initIndex();
  if (document.getElementById("detail-root")) initSpot();
  if (document.getElementById("map")) initMap();
  if (document.getElementById("exp-map")) initExplorer();
  if (document.getElementById("discover-root")) initDiscover();
  if (document.getElementById("account-root")) renderAccount();
  if (document.getElementById("shared-trip-root")) renderSharedTrip();
  if (document.getElementById("compare-root")) renderCompare();
  if (document.getElementById("continent-root")) initContinent();
});

// Re-render the visible page when a server-sync brings in new items.
// syncSavedFromServer / syncSurfedFromServer / syncTripsFromServer are
// async — they fetch + merge AFTER renderAccount has already drawn the
// initial state. Without these listeners the user's new spots / trips
// from another device only appear after a manual refresh.
//
// Account page is the obvious one (it lists saved + trips + surf log
// + reviews). Compare page also reads getSaved. Other pages don't show
// these lists directly.
function _reRenderForChange() {
  if (document.getElementById("account-root") && typeof renderAccount === "function") {
    renderAccount();
  }
  if (document.getElementById("compare-root") && typeof renderCompare === "function") {
    renderCompare();
  }
  if (typeof updateNav === "function") updateNav();
}
["wavebase:saved-changed", "wavebase:surfed-changed", "wavebase:trips-changed"]
  .forEach(name => window.addEventListener(name, _reRenderForChange));

/* Drop saved / compare / surfed entries whose IDs no longer resolve
   to anything in WAVEBASE_DATA. Self-healing: runs once per page
   load after data is ready, so a phantom badge ("Compare (2)" with
   an empty page) gets wiped on the next load. Trips are NOT pruned
   here — a trip can legitimately contain a single stale stop the
   user still wants to remember, and the trip card already shows
   "<unknown>" for any missing entry rather than vanishing it. */
function pruneStaleAccountIds() {
  const isLive = id => !!byId(id);
  const account = WaveBaseAccount;
  if (!account) return;

  ["saved", "compare", "surfed"].forEach(listName => {
    const getter = ({ saved: "getSaved", compare: "getCompare", surfed: "getSurfed" })[listName];
    const ids = account[getter]();
    const stale = ids.filter(id => !isLive(id));
    if (!stale.length) return;
    // Use the existing toggle methods so we don't bypass any side-
    // effects (the saved-spots one also fires the server-sync delete
    // for signed-in users, which is exactly what we want — a stale
    // local ID is also stale on the server).
    const toggle = ({ saved: "toggleSave", compare: "toggleCompare", surfed: "toggleSurfed" })[listName];
    stale.forEach(id => {
      if (account[toggle]) account[toggle](id);  // present = remove
    });
    console.log(`[account] pruned ${stale.length} stale ${listName} id(s):`, stale);
  });
}
