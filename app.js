/* WaveBase — QnD logic (English). One script, routes per page:
   index (search + split lists), spot (detail), map, account, compare. */

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function byId(id) { return WAVEBASE_DATA.find(x => x.id === id); }
function bookingHref(e) {
  if (e.bookingUrl) return e.bookingUrl;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(e.name + " " + e.town)}`;
}
function typeLabel(t) {
  if (t === "spot") return "Surf spot";
  if (t === "centre") return "Surf centre";
  return "Stay";
}
function typeColor(t) {
  if (t === "spot") return "#3f6f7d";    // teal — surf spots
  if (t === "centre") return "#e0a447";  // amber — surf centres
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

/* ---- card ---- */
function cardHTML(e) {
  const pills = e.levels.map(l => `<span class="pill">${cap(l)}</span>`).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);
  return `
  <article class="card" data-href="spot.html?id=${e.id}">
    <div class="thumb ${e.type}${e.photo ? " has-photo" : ""}"${thumbStyle(e)}>
      <span class="badge">${typeLabel(e.type)}</span>
      <button class="compare-btn ${comparing ? "on" : ""}" data-compare="${e.id}" aria-label="Compare" title="${comparing ? "In your compare list" : "Add to compare"}">⇄</button>
      <button class="save-btn ${saved ? "on" : ""}" data-save="${e.id}" aria-label="Save" title="${saved ? "Saved" : "Save this place"}">${saved ? "♥" : "♡"}</button>
    </div>
    <div class="body">
      <div class="place">${e.town}</div>
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
        <span><strong>Getting there:</strong> ${t.afstand}</span>
        <span><strong>Public transport:</strong> ${t.vervoer}</span>
      </div>
    </div>`;
  }).join("");
  return `<div class="town-intro-strip">${cards}</div>`;
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

/* ---- sport scope (wave / wind / kite / wing) — 'live' is derived from data ---- */
const WAVEBASE_SPORTS = [
  { key: "wave", label: "Wave" },
  { key: "wind", label: "Wind" },
  { key: "kite", label: "Kite" },
  { key: "wing", label: "Wing" }
];
function sportIsLive(key) {
  if (typeof WAVEBASE_DATA === "undefined") return key === "wave";
  return WAVEBASE_DATA.some(e => entrySports(e).includes(key));
}
function getSportPref() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("sport");
  if (fromUrl) return fromUrl;
  return localStorage.getItem("wavebase_sport_pref") || "wave";
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
      if (btn.dataset.sport === "wave") url.searchParams.delete("sport");
      else url.searchParams.set("sport", btn.dataset.sport);
      window.history.replaceState(null, "", url.toString());
      runSearch();
    });
  });
}

function runSearch() {
  const country = document.getElementById("f-country").value;
  const level = document.getElementById("f-level").value;
  const month = document.getElementById("f-month").value;
  const type  = document.getElementById("f-type").value;
  const sport = getSportPref();
  const results = document.getElementById("results");
  const longSport = { wave: "Wave surfing", wind: "Windsurfing", kite: "Kitesurfing", wing: "Wing foiling" };

  // keep URL in sync — country + filters + sport — so links are shareable AND back-navigation restores the state
  const url = new URL(window.location.href);
  const setParam = (k, v, isDefault) => {
    if (v && !isDefault) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  };
  setParam("country", country, !country);
  setParam("level", level, level === "all");
  setParam("type", type, type === "all");
  setParam("month", month, month === "all");
  setParam("sport", sport, sport === "wave");
  window.history.replaceState(null, "", url.toString());

  // refresh sport pill active state to reflect current sport
  document.querySelectorAll(".sport-pill").forEach(btn => {
    const isActive = btn.dataset.sport === sport;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // no country yet → ask the user to pick one
  if (!country) {
    results.innerHTML = `<div class="empty"><strong>Pick a country to begin.</strong><br>
      Use the &ldquo;Where?&rdquo; picker above, or open the Destinations menu in the header.</div>`;
    return;
  }

  // Data-driven: filter entries by country (with default) and sport (with default)
  const liveCountrySportEntries = WAVEBASE_DATA.filter(e =>
    entryCountry(e) === country && entrySports(e).includes(sport)
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

  const pref = getViewPref();
  const gridClass = pref === "list" ? "grid list-view" : "grid";
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
    const spots   = matches.filter(e => e.type === "spot");
    const stays   = matches.filter(e => e.type === "stay");
    const centres = matches.filter(e => e.type === "centre");
    if (spots.length) {
      html += `<section class="result-section">
        <h2>Surf spots <span class="seccount">${spots.length}</span></h2>
        <div class="${gridClass}">${spots.map(cardHTML).join("")}</div></section>`;
    }
    if (centres.length) {
      html += `<section class="result-section">
        <h2>Surf centres <span class="seccount">${centres.length}</span></h2>
        <div class="${gridClass}">${centres.map(cardHTML).join("")}</div></section>`;
    }
    if (stays.length) {
      html += `<section class="result-section">
        <h2>Stays <span class="seccount">${stays.length}</span></h2>
        <div class="${gridClass}">${stays.map(cardHTML).join("")}</div></section>`;
    }
  }

  results.innerHTML = html;
  wireCards(results);
  wireViewToggle(results);
}

function initIndex() {
  const mSel = document.getElementById("f-month");
  for (let i = 1; i <= 12; i++) {
    const o = document.createElement("option");
    o.value = i; o.textContent = WAVEBASE_MONTHS[i];
    mSel.appendChild(o);
  }
  // populate the country picker from WAVEBASE_DESTINATIONS, grouped by continent
  const cSel = document.getElementById("f-country");
  if (cSel && typeof WAVEBASE_DESTINATIONS !== "undefined") {
    WAVEBASE_DESTINATIONS.forEach(cont => {
      const og = document.createElement("optgroup");
      og.label = cont.continent;
      cont.countries.forEach(co => {
        const o = document.createElement("option");
        o.value = co.name;
        o.textContent = `${co.flag}  ${co.name}` + (co.status === "live" ? "" : " — soon");
        og.appendChild(o);
      });
      cSel.appendChild(og);
    });
  }
  // pre-select all filters from URL params (country + level/type/month) — supports deep links and back-navigation
  const params = new URLSearchParams(window.location.search);
  [["country","f-country"],["level","f-level"],["type","f-type"],["month","f-month"]].forEach(([k, id]) => {
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
    ["Team & vibe", d.team],
    ["Contact", d.contact]
  ];
  const items = rows.map(([k, val]) =>
    `<div class="cond-item"><span class="cond-label">${k}</span><span class="cond-val">${val || "—"}</span></div>`
  ).join("");
  return `<section class="condities">
    <h2>The centre at a glance</h2>
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
  document.title = `${e.name} — WaveBase`;
  const verhaal = e.verhaal.map(p => `<p>${p}</p>`).join("");
  const samenvatting = e.samenvatting.map(s => `<li>${s}</li>`).join("");
  const lagen = e.lagen.map(laagHTML).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);

  const backCountry = entryCountry(e);
  const backSports = entrySports(e);
  const backSport = backSports.includes("wave") ? "wave" : backSports[0];
  const backHref = `index.html?country=${encodeURIComponent(backCountry)}` + (backSport !== "wave" ? `&sport=${backSport}` : "");
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
        ${e.type === "centre" && e.bookingUrl ? `<a class="btn btn-book" href="${e.bookingUrl}" target="_blank" rel="noopener">Visit website ↗</a>` : ""}
        <button class="btn ghost ${saved ? "on" : ""}" id="save-toggle">${saved ? "♥ Saved" : "♡ Save this place"}</button>
        <button class="btn ghost ${comparing ? "on" : ""}" id="compare-toggle">${comparing ? "✓ In compare" : "+ Compare"}</button>
        <select id="trip-select">${tripOptionsHTML()}</select>
      </div>
    </header>

    ${e.coords ? `<div class="detail-map" id="detail-map"></div>` : ""}

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

  const layers = { spot: L.layerGroup(), stay: L.layerGroup(), centre: L.layerGroup() };
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
    m.addTo(layers[e.type]);
  });
  layers.spot.addTo(map);
  layers.stay.addTo(map);
  layers.centre.addTo(map);
  if (allCoords.length) map.fitBounds(allCoords, { padding: [30, 30] });

  document.getElementById("t-spot").addEventListener("change", function () {
    if (this.checked) layers.spot.addTo(map); else map.removeLayer(layers.spot);
  });
  document.getElementById("t-stay").addEventListener("change", function () {
    if (this.checked) layers.stay.addTo(map); else map.removeLayer(layers.stay);
  });
  const tCentre = document.getElementById("t-centre");
  if (tCentre) {
    tCentre.addEventListener("change", function () {
      if (this.checked) layers.centre.addTo(map); else map.removeLayer(layers.centre);
    });
  }
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
        <label>Surf level<select id="p-level"><option value="">—</option>${levelOpts}</select></label>
        <label>Years surfing<input type="number" id="p-years" value="${p.yearsSurfing || ""}" placeholder="3" min="0" max="80"></label>
        <label>Board<select id="p-board"><option value="">—</option>${boardOpts}</select></label>
        <label>Travel style<select id="p-style"><option value="">—</option>${styleOpts}</select></label>
        <label>What you want from a trip<select id="p-intent"><option value="">—</option>${intentOpts}</select></label>
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
      tripIntent: document.getElementById("p-intent").value
    });
    updateNav();
    alert("Profile saved.");
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
  if (e.type === "centre") {
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
        <span class="badge">${typeLabel(e.type)}</span>
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
