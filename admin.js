/* WaveBase admin dashboard.

   Hits the /admin/* endpoints, renders KPIs + users table + popular
   content, and opens a drill-down modal for any selected user.

   Gating:
   - The backend already 403s every /admin/* call from a non-admin
     JWT. This file just adds a UX gate: instead of letting the user
     stare at an empty page + console 403s, we detect non-admin /
     not-signed-in on boot and replace the body with a friendly
     "Access denied" message.
   - The allowlist is duplicated client-side to make the redirect
     instant. Server is still the authoritative gate.

   XSS:
   - Every user-supplied string (name, email, trip name, day notes,
     home_country, etc.) goes through escHTML before rendering.
     Trip-name + day-note are user-controlled and could otherwise
     execute scripts in the admin's browser.
*/

const ADMIN_EMAILS = ["lode.b162@gmail.com", "michiel.decooman@gmail.com"];

// Friendly labels for the multi-select option keys stored in profile.
const SURF_TYPE_LABEL = {
  surfer: "Surf", windsurfer: "Windsurf", kitesurfer: "Kitesurf", wingfoiler: "Wing-foil",
};
const DISCIPLINE_LABEL = {
  freeride: "Freeride", wave: "Wave", freestyle: "Freestyle", slalom: "Slalom",
};
const TRAVEL_STYLE_LABEL = {
  Solo: "Solo / chill", Couple: "With partner", Family: "Family with kids", Friends: "Group of friends",
};
const TRIP_PRIORITY_LABEL = {
  "wave-time": "Wave time",
  "lessons":   "Lessons",
  "vibe-food": "Vibe + food",
  "hidden-gems": "Hidden gems",
  "affordable": "Budget",
  "comfort": "Comfort",
};

function _esc(s) {
  if (typeof escHTML === "function") return escHTML(s);
  return String(s == null ? "" : s).replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

function _fmtDate(iso, withTime) {
  if (!iso) return "&mdash;";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "&mdash;";
    const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    if (!withTime) return date;
    const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return `${date} ${time}`;
  } catch (e) { return "&mdash;"; }
}

function _typeEmoji(type) {
  return type === "stay" ? "🏠" : (type === "center" ? "🎓" : "🌊");
}

function _entryById(id) {
  if (typeof WAVEBASE_DATA === "undefined") return null;
  return WAVEBASE_DATA.find(e => e.id === id) || null;
}

/* ---------- gate ---------- */

function _isAdmin() {
  if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return false;
  const u = WaveBaseAuth.currentUser();
  if (!u || !u.email) return false;
  const e = u.email.toLowerCase();
  return ADMIN_EMAILS.some(a => a.toLowerCase() === e);
}

function _renderAccessDenied() {
  const root = document.getElementById("admin-root");
  const signedIn = (typeof WaveBaseAuth !== "undefined") && WaveBaseAuth.isLoggedIn();
  root.innerHTML = `
    <section class="admin-denied">
      <p class="kicker">Access denied</p>
      <h1>This page is for WaveBase editors only.</h1>
      <p class="lead">
        ${signedIn
          ? "You're signed in, but your account isn't on the editor allowlist."
          : "Sign in with an editor account to continue."}
      </p>
      <div class="admin-denied-actions">
        <a href="index.html" class="btn">Back to home</a>
        ${signedIn ? "" : `<button type="button" class="btn ghost" id="admin-signin-btn">Sign in</button>`}
      </div>
    </section>
  `;
  const btn = document.getElementById("admin-signin-btn");
  if (btn) btn.addEventListener("click", () => {
    if (typeof WaveBaseAuthModal !== "undefined") WaveBaseAuthModal.open({ mode: "login" });
  });
}

/* ---------- main render ---------- */

async function _loadOverview() {
  const res = await WaveBaseAuth.authFetch("/admin/overview");
  if (!res.ok) throw new Error("Overview failed: " + res.status);
  return res.json();
}
async function _loadPopularity() {
  const res = await WaveBaseAuth.authFetch("/admin/popularity");
  if (!res.ok) throw new Error("Popularity failed: " + res.status);
  return res.json();
}
async function _loadUserDetail(userId) {
  const res = await WaveBaseAuth.authFetch("/admin/users/" + encodeURIComponent(userId));
  if (!res.ok) throw new Error("User detail failed: " + res.status);
  return res.json();
}

// Sort state for the users table.
let _sortKey = "signed_up_at";
let _sortDesc = true;

function _sortUsers(users) {
  const sorted = users.slice();
  sorted.sort((a, b) => {
    let av = a[_sortKey], bv = b[_sortKey];
    if (av == null) av = "";
    if (bv == null) bv = "";
    if (av < bv) return _sortDesc ? 1 : -1;
    if (av > bv) return _sortDesc ? -1 : 1;
    return 0;
  });
  return sorted;
}

function _renderKpis(totals, today) {
  return `
    <div class="adm-kpis">
      <div class="adm-kpi">
        <div class="adm-kpi-label">Users</div>
        <div class="adm-kpi-value">${totals.users}</div>
        <div class="adm-kpi-sub">&nbsp;</div>
      </div>
      <div class="adm-kpi">
        <div class="adm-kpi-label">Saved spots</div>
        <div class="adm-kpi-value">${totals.saved}</div>
        <div class="adm-kpi-sub">today: +${today.saved}</div>
      </div>
      <div class="adm-kpi">
        <div class="adm-kpi-label">Trips</div>
        <div class="adm-kpi-value">${totals.trips}</div>
        <div class="adm-kpi-sub">today: +${today.trips}</div>
      </div>
      <div class="adm-kpi">
        <div class="adm-kpi-label">Surf log entries</div>
        <div class="adm-kpi-value">${totals.surfed}</div>
        <div class="adm-kpi-sub">today: +${today.surfed}</div>
      </div>
    </div>
  `;
}

function _renderUsersTable(users) {
  const rows = _sortUsers(users).map(u => `
    <tr data-user-id="${_esc(u.id)}" class="adm-user-row">
      <td>${_esc(u.name || "—")}</td>
      <td><span class="adm-mono">${_esc(u.email)}</span></td>
      <td>${_fmtDate(u.signed_up_at)}</td>
      <td class="adm-num">${u.saved_count}</td>
      <td class="adm-num">${u.surfed_count}</td>
      <td class="adm-num">${u.trips_count}</td>
    </tr>
  `).join("");

  const headCell = (key, label, numeric) => {
    const arrow = (_sortKey === key) ? (_sortDesc ? "↓" : "↑") : "";
    return `<th class="adm-sort ${numeric ? "adm-num" : ""}" data-sort="${key}">${label} <span class="adm-sort-arrow">${arrow}</span></th>`;
  };

  return `
    <section class="adm-section">
      <h2>Users</h2>
      <div class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr>
              ${headCell("name", "Name", false)}
              ${headCell("email", "Email", false)}
              ${headCell("signed_up_at", "Signed up", false)}
              ${headCell("saved_count", "Sav", true)}
              ${headCell("surfed_count", "Surf", true)}
              ${headCell("trips_count", "Trp", true)}
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="6" class="muted">No users yet.</td></tr>`}</tbody>
        </table>
      </div>
      <p class="muted adm-table-hint">Click a row to see that user's saved spots, trips and surf log.</p>
    </section>
  `;
}

function _renderPopularity(pop) {
  function row(item) {
    const entry = _entryById(item.spot_id);
    const name = entry ? entry.name : item.spot_id;
    const town = entry ? entry.town : "";
    const emoji = entry ? _typeEmoji(entry.type) : "·";
    const max = pop._max || 1;
    const pct = Math.round((item.count / max) * 100);
    return `
      <li class="adm-pop-row">
        <span class="adm-pop-name">${emoji} ${_esc(name)} <span class="muted">${_esc(town)}</span></span>
        <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${pct}%"></span></span>
        <span class="adm-pop-count">${item.count}</span>
      </li>`;
  }
  pop._max = Math.max(1, ...pop.top_saved.map(x => x.count));
  const savedHtml = pop.top_saved.length
    ? `<ol class="adm-pop-list">${pop.top_saved.map(row).join("")}</ol>`
    : `<p class="muted">No saves yet.</p>`;

  pop._max = Math.max(1, ...pop.top_surfed.map(x => x.count));
  const surfedHtml = pop.top_surfed.length
    ? `<ol class="adm-pop-list">${pop.top_surfed.map(row).join("")}</ol>`
    : `<p class="muted">No surf-log entries yet.</p>`;

  return `
    <section class="adm-section adm-pop">
      <h2>Popular content</h2>
      <div class="adm-pop-grid">
        <div>
          <h3>Top saved</h3>
          ${savedHtml}
        </div>
        <div>
          <h3>Top surfed</h3>
          ${surfedHtml}
        </div>
      </div>
    </section>
  `;
}

async function _renderDashboard() {
  const root = document.getElementById("admin-root");
  let overview, popularity;
  try {
    [overview, popularity] = await Promise.all([_loadOverview(), _loadPopularity()]);
  } catch (e) {
    root.innerHTML = `<p class="muted" style="color:var(--clay);">Failed to load admin data: ${_esc(e.message || e)}</p>`;
    return;
  }

  // Cache users for the detail modal handler.
  _adminUsersCache = overview.users;

  root.innerHTML = `
    <div class="admin-head">
      <p class="kicker">WaveBase admin</p>
      <h1>What&rsquo;s going on.</h1>
    </div>
    ${_renderKpis(overview.totals, overview.today)}
    ${_renderUsersTable(overview.users)}
    ${_renderPopularity(popularity)}
  `;

  _wireTableInteractions();
}

let _adminUsersCache = [];

function _wireTableInteractions() {
  // Click a row → open detail modal.
  document.querySelectorAll(".adm-user-row").forEach(row => {
    row.addEventListener("click", () => _openUserDetail(row.dataset.userId));
  });
  // Click a sort header → flip sort.
  document.querySelectorAll(".adm-sort").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (_sortKey === key) {
        _sortDesc = !_sortDesc;
      } else {
        _sortKey = key;
        // Default: numeric counts sort desc, strings + dates sort asc.
        _sortDesc = ["saved_count", "surfed_count", "trips_count", "signed_up_at"].indexOf(key) !== -1;
      }
      _renderDashboard();
    });
  });
}

/* ---------- user-detail modal ---------- */

async function _openUserDetail(userId) {
  let backdrop = document.getElementById("adm-detail-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "adm-detail-backdrop";
    backdrop.className = "adm-detail-backdrop";
    backdrop.innerHTML = `
      <div class="adm-detail">
        <button type="button" class="adm-detail-close" aria-label="Close">&times;</button>
        <div class="adm-detail-body">
          <p class="muted">Loading…</p>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    backdrop.querySelector(".adm-detail-close").addEventListener("click", _closeUserDetail);
    backdrop.addEventListener("click", ev => {
      if (ev.target === backdrop) _closeUserDetail();
    });
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape") _closeUserDetail();
    });
  }
  backdrop.removeAttribute("hidden");
  document.documentElement.style.overflow = "hidden";

  let detail;
  try {
    detail = await _loadUserDetail(userId);
  } catch (e) {
    backdrop.querySelector(".adm-detail-body").innerHTML =
      `<p style="color:var(--clay);">Failed to load: ${_esc(e.message || e)}</p>`;
    return;
  }
  _renderUserDetail(detail);
}

function _closeUserDetail() {
  const bd = document.getElementById("adm-detail-backdrop");
  if (bd) bd.setAttribute("hidden", "");
  document.documentElement.style.overflow = "";
}

function _labelList(arr, dict) {
  return (arr || []).map(k => dict[k] || k).filter(Boolean).join(", ") || "—";
}

function _renderUserDetail(detail) {
  const u = detail.user;
  const surfTypes = _labelList(u.surf_types, SURF_TYPE_LABEL);
  const disciplines = _labelList(u.discipline, DISCIPLINE_LABEL);
  const travelStyles = _labelList(u.travel_styles, TRAVEL_STYLE_LABEL);
  const tripPrios = _labelList(u.trip_priorities, TRIP_PRIORITY_LABEL);

  function entryLine(spotId) {
    const e = _entryById(spotId);
    if (!e) {
      return `<li class="adm-entry adm-entry-unknown">· ${_esc(spotId)} <span class="muted">(no longer in catalogue)</span></li>`;
    }
    return `<li class="adm-entry">
      ${_typeEmoji(e.type)} <a href="spot.html?id=${encodeURIComponent(e.id)}" target="_blank" rel="noopener">${_esc(e.name)}</a>
      <span class="muted">${_esc(e.town || "")}${e.country ? " · " + _esc(e.country) : ""}</span>
    </li>`;
  }

  const savedHtml = detail.saved.length
    ? `<ul class="adm-entry-list">${detail.saved.map(s => entryLine(s.spot_id)).join("")}</ul>`
    : `<p class="muted">No saves yet.</p>`;

  const surfedHtml = detail.surfed.length
    ? `<ul class="adm-entry-list">${detail.surfed.map(s => entryLine(s.spot_id)).join("")}</ul>`
    : `<p class="muted">No surf-log entries yet.</p>`;

  const tripsHtml = detail.trips.length
    ? detail.trips.map(t => {
        const stopRows = (t.spot_ids || []).map((sid, i) => {
          const e = _entryById(sid);
          const dateInfo = (t.dates || {})[sid] || {};
          const inOut = (dateInfo.in || dateInfo.out)
            ? `<div class="adm-trip-date">${dateInfo.in ? "in: " + _fmtDate(dateInfo.in) : ""}${dateInfo.out ? "  ·  out: " + _fmtDate(dateInfo.out) : ""}</div>`
            : "";
          if (!e) {
            return `<li class="adm-stop adm-stop-unknown">
              <span class="adm-stop-num">${i + 1}.</span>
              <span class="muted">${_esc(sid)} (no longer in catalogue)</span>
            </li>`;
          }
          return `<li class="adm-stop">
            <span class="adm-stop-num">${i + 1}.</span>
            <span class="adm-stop-name">${_typeEmoji(e.type)} <a href="spot.html?id=${encodeURIComponent(e.id)}" target="_blank" rel="noopener">${_esc(e.name)}</a>
              <span class="muted">${_esc(e.town || "")}</span>
            </span>
            ${inOut}
          </li>`;
        }).join("");

        const dayNoteKeys = Object.keys(t.day_notes || {}).sort();
        const noteRows = dayNoteKeys.map(dk => `
          <li class="adm-note"><span class="adm-note-date">${_fmtDate(dk)}</span> ${_esc(t.day_notes[dk])}</li>
        `).join("");
        const notesBlock = noteRows
          ? `<div class="adm-trip-notes"><h5>Day notes</h5><ul>${noteRows}</ul></div>`
          : "";

        return `
          <div class="adm-trip">
            <h4>${_esc(t.name || "Trip")}</h4>
            ${t.spot_ids.length
              ? `<ol class="adm-stops">${stopRows}</ol>`
              : `<p class="muted">No stops yet.</p>`}
            ${notesBlock}
          </div>
        `;
      }).join("")
    : `<p class="muted">No trips yet.</p>`;

  document.querySelector(".adm-detail-body").innerHTML = `
    <h2>${_esc(u.name || "(no name)")}</h2>
    <div class="adm-profile">
      <div><span class="adm-prof-k">📧</span> <span class="adm-mono">${_esc(u.email)}</span>${u.is_google ? ' <span class="adm-chip-sm">Google</span>' : ""}</div>
      <div><span class="adm-prof-k">🌍</span> ${_esc(u.home_country || "—")}${u.birth_year ? " · born " + _esc(u.birth_year) : ""}</div>
      <div><span class="adm-prof-k">🏄</span> ${_esc(surfTypes)} · ${_esc(u.surf_level || "—")}${u.discipline && u.discipline.length ? " · " + _esc(disciplines) : ""}</div>
      <div><span class="adm-prof-k">✈️</span> ${_esc(travelStyles)}</div>
      <div><span class="adm-prof-k">🎯</span> ${_esc(tripPrios)}</div>
      <div><span class="adm-prof-k">📍</span> Found us via: ${_esc(u.how_did_you_find_us || "—")}</div>
      <div><span class="adm-prof-k">📅</span> Signed up: ${_fmtDate(u.signed_up_at, true)}</div>
    </div>

    <h3>Saved (${detail.saved.length})</h3>
    ${savedHtml}

    <h3>Surf log (${detail.surfed.length})</h3>
    ${surfedHtml}

    <h3>Trips (${detail.trips.length})</h3>
    <div class="adm-trips">${tripsHtml}</div>
  `;
}

/* ---------- boot ---------- */

function _boot() {
  // Gate check is repeated on auth-changed so a sign-out from the
  // admin page itself flips us straight to the denied view.
  if (!_isAdmin()) {
    _renderAccessDenied();
    return;
  }
  // We need WAVEBASE_DATA loaded for spot-name resolution. If it's
  // not ready yet (api-client.js still fetching), wait for the
  // data-ready event before doing the heavier render.
  if (typeof WAVEBASE_DATA !== "undefined" && WAVEBASE_DATA.length > 0) {
    _renderDashboard();
  } else {
    window.addEventListener("wavebase:data-ready", _renderDashboard, { once: true });
  }
}

if (typeof window !== "undefined") {
  // Wait for the auth bootstrap (WaveBaseAuth.bootRefresh in account.js)
  // to fetch /users/me at least once — currentUser() is null until
  // then for fresh page loads, which would otherwise fail the
  // _isAdmin() check.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _boot);
  } else {
    _boot();
  }
  window.addEventListener("wavebase:auth-changed", _boot);
}
