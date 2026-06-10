/* SurfGoose admin dashboard.

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

/* Human "time ago" — for last-activity columns. Renders relative
   strings like "2u geleden", "3 dagen", "45 dagen", "no activity".
   Past 90 days drops to muted styling (caller wraps with a class).
   `iso` may be null → returns the no-activity marker. */
function _fmtAgo(iso) {
  if (!iso) return { text: "no activity", days: Infinity, stale: true };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { text: "no activity", days: Infinity, stale: true };
  const diffMs = Date.now() - d.getTime();
  const mins  = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days  = Math.floor(diffMs / 86400000);
  let text;
  if (mins < 60)        text = mins <= 1 ? "just now" : `${mins} min ago`;
  else if (hours < 24)  text = `${hours}h ago`;
  else if (days < 30)   text = `${days} day${days === 1 ? "" : "s"} ago`;
  else if (days < 365)  text = `${Math.floor(days/30)} month${Math.floor(days/30) === 1 ? "" : "s"} ago`;
  else                  text = `${Math.floor(days/365)}y ago`;
  return { text, days, stale: days >= 90 };
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
      <h1>This page is for SurfGoose editors only.</h1>
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
async function _loadEventsAffiliate() {
  const res = await WaveBaseAuth.authFetch("/admin/events/affiliate");
  if (!res.ok) throw new Error("Affiliate failed: " + res.status);
  return res.json();
}
async function _loadEventsPageviews() {
  const res = await WaveBaseAuth.authFetch("/admin/events/pageviews");
  if (!res.ok) throw new Error("Pageviews failed: " + res.status);
  return res.json();
}
async function _loadEventsFunnel() {
  const res = await WaveBaseAuth.authFetch("/admin/events/funnel");
  if (!res.ok) throw new Error("Funnel failed: " + res.status);
  return res.json();
}
async function _loadEventsSearch() {
  const res = await WaveBaseAuth.authFetch("/admin/events/search");
  if (!res.ok) throw new Error("Search failed: " + res.status);
  return res.json();
}
async function _loadEventsConsent() {
  const res = await WaveBaseAuth.authFetch("/admin/events/consent");
  if (!res.ok) throw new Error("Consent failed: " + res.status);
  return res.json();
}
async function _loadEventsDwell() {
  const res = await WaveBaseAuth.authFetch("/admin/events/dwell");
  if (!res.ok) throw new Error("Dwell failed: " + res.status);
  return res.json();
}
async function _loadRecentReviews() {
  const res = await WaveBaseAuth.authFetch("/admin/reviews/recent?limit=20");
  if (!res.ok) throw new Error("Recent reviews failed: " + res.status);
  return res.json();
}
async function _loadEngagement() {
  const res = await WaveBaseAuth.authFetch("/admin/engagement?limit=30");
  if (!res.ok) throw new Error("Engagement failed: " + res.status);
  return res.json();
}
async function _loadEngagementByCountry() {
  const res = await WaveBaseAuth.authFetch("/admin/engagement/by-country");
  if (!res.ok) throw new Error("By-country engagement failed: " + res.status);
  return res.json();
}
async function _loadStayAffinity() {
  const res = await WaveBaseAuth.authFetch("/admin/affinity/stays");
  if (!res.ok) throw new Error("Stay affinity failed: " + res.status);
  return res.json();
}
async function _loadConditionsMismatch() {
  const res = await WaveBaseAuth.authFetch("/admin/conditions-mismatch");
  if (!res.ok) throw new Error("Conditions mismatch failed: " + res.status);
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

function _renderKpis(totals, today, onlineNow, onlineWindowMin) {
  const online = onlineNow || 0;
  const windowMin = onlineWindowMin || 5;
  return `
    <div class="adm-kpis">
      <div class="adm-kpi">
        <div class="adm-kpi-label">Users</div>
        <div class="adm-kpi-value">${totals.users}</div>
        <div class="adm-kpi-sub">&nbsp;</div>
      </div>
      <div class="adm-kpi adm-kpi-online${online > 0 ? " is-live" : ""}">
        <div class="adm-kpi-label"><span class="adm-online-dot"></span>Online now</div>
        <div class="adm-kpi-value">${online}</div>
        <div class="adm-kpi-sub">seen in last ${windowMin} min</div>
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
      <div class="adm-kpi">
        <div class="adm-kpi-label">Reviews</div>
        <div class="adm-kpi-value">${totals.reviews != null ? totals.reviews : 0}</div>
        <div class="adm-kpi-sub">today: +${today.reviews != null ? today.reviews : 0}</div>
      </div>
    </div>
  `;
}

/* Dormant filter state — persisted in-module so flipping the
   toggle re-renders without losing the sort. */
let _dormantFilter = "all";   // "all" | "dormant30" | "never"

function _renderUsersTable(users) {
  // Apply the dormant filter. "dormant30" = no activity in the
  // last 30 days; "never" = no activity ever (signed up but no
  // saves/surfed/trips/reviews). Filtering happens client-side on
  // the already-loaded users array — no backend roundtrip needed.
  const now = Date.now();
  const isDormant30 = u => {
    if (!u.last_activity) return true;
    const ageMs = now - new Date(u.last_activity).getTime();
    return ageMs >= 30 * 86400000;
  };
  const isNever = u => !u.last_activity;
  let view = users;
  if (_dormantFilter === "dormant30") view = users.filter(isDormant30);
  if (_dormantFilter === "never")     view = users.filter(isNever);

  const rows = _sortUsers(view).map(u => {
    const ago = _fmtAgo(u.last_activity);
    // Green dot prefix on the name when the user is online (seen in
    // the last 5 min, per the backend's is_online flag).
    const onlineDot = u.is_online
      ? `<span class="adm-online-dot" title="Online now"></span>`
      : "";
    return `
      <tr data-user-id="${_esc(u.id)}" class="adm-user-row${u.is_online ? " is-online" : ""}">
        <td>${onlineDot}${_esc(u.name || "—")}</td>
        <td><span class="adm-mono">${_esc(u.email)}</span></td>
        <td>${_fmtDate(u.signed_up_at)}</td>
        <td class="adm-num">${u.saved_count}</td>
        <td class="adm-num">${u.surfed_count}</td>
        <td class="adm-num">${u.trips_count}</td>
        <td class="adm-num adm-onsite">${
          (u.total_seconds || 0) > 0
            ? `${_fmtDuration(u.total_seconds)}<span class="muted adm-onsite-sub" title="${u.session_count} session${u.session_count === 1 ? "" : "s"}, avg ${_fmtDuration(u.avg_session_seconds)}"> · ${u.session_count}×</span>`
            : `<span class="muted">—</span>`
        }</td>
        <td class="adm-eng-ago${ago.stale ? " is-stale" : ""}">${_esc(ago.text)}</td>
      </tr>
    `;
  }).join("");

  const headCell = (key, label, numeric) => {
    const arrow = (_sortKey === key) ? (_sortDesc ? "↓" : "↑") : "";
    return `<th class="adm-sort ${numeric ? "adm-num" : ""}" data-sort="${key}">${label} <span class="adm-sort-arrow">${arrow}</span></th>`;
  };

  const pillBtn = (val, label) =>
    `<button type="button" class="adm-filter-pill${_dormantFilter === val ? " is-active" : ""}" data-dormant-filter="${val}">${label}</button>`;

  return `
    <section class="adm-section">
      <h2>Users <span class="muted" style="font-size:14px;">(${view.length}${_dormantFilter !== "all" ? " of " + users.length : ""})</span></h2>
      <div class="adm-filter-row">
        ${pillBtn("all",       "All")}
        ${pillBtn("dormant30", "Dormant 30d+")}
        ${pillBtn("never",     "Never active")}
        <button type="button" class="adm-filter-pill${(_sortKey === "total_seconds" && _sortDesc) ? " is-active" : ""}" data-sort-preset="active">⏱️ Most active</button>
      </div>
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
              ${headCell("total_seconds", "On site", true)}
              ${headCell("last_activity", "Last active", false)}
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="8" class="muted">No users match this filter.</td></tr>`}</tbody>
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
  let overview, popularity, evAff, evViews, evFunnel, evSearch, recent, engagement, byCountry, affinity, mismatch, evConsent, evDwell;
  try {
    [overview, popularity, evAff, evViews, evFunnel, evSearch, recent, engagement, byCountry, affinity, mismatch, evConsent, evDwell] = await Promise.all([
      _loadOverview(),
      _loadPopularity(),
      _loadEventsAffiliate(),
      _loadEventsPageviews(),
      _loadEventsFunnel(),
      _loadEventsSearch(),
      _loadRecentReviews(),
      _loadEngagement(),
      _loadEngagementByCountry(),
      _loadStayAffinity(),
      _loadConditionsMismatch(),
      _loadEventsConsent(),
      _loadEventsDwell(),
    ]);
  } catch (e) {
    root.innerHTML = `<p class="muted" style="color:var(--clay);">Failed to load admin data: ${_esc(e.message || e)}</p>`;
    return;
  }

  // Cache users for the detail modal handler.
  _adminUsersCache = overview.users;

  root.innerHTML = `
    <div class="admin-head">
      <p class="kicker">SurfGoose admin</p>
      <h1>What&rsquo;s going on.</h1>
      <div class="adm-export-row">
        <span class="muted">Export to CSV:</span>
        <button type="button" class="link-btn" data-export="users">users</button>
        <button type="button" class="link-btn" data-export="reviews">reviews</button>
        <button type="button" class="link-btn" data-export="trips">trips</button>
      </div>
    </div>
    ${_renderKpis(overview.totals, overview.today, overview.online_now, overview.online_window_min)}
    ${_renderConsent(evConsent)}
    ${_renderConditionsMismatch(mismatch)}
    ${_renderRecentReviews(recent)}
    ${_renderEngagement(engagement, evViews, evAff)}
    ${_renderDwell(evDwell)}
    ${_renderStayAffinity(affinity)}
    ${_renderByCountry(byCountry)}
    ${_renderUsersTable(overview.users)}
    ${_renderPopularity(popularity)}
    ${_renderActivity(evAff, evViews, evFunnel, evSearch)}
  `;

  _wireTableInteractions();
  _wireRecentReviews();
  _wireSearchActions();
  _wireCsvExports();
  _wireReviewProcessed();
}

function _renderConsent(c) {
  c = c || {};
  const shown    = c.shown || 0;
  const accepted = c.accepted || 0;
  const rejected = c.rejected || 0;
  const ignored  = c.ignored || 0;
  const decided  = c.decided || (accepted + rejected);
  // Two denominators tell different stories:
  //  - of those who DECIDED, what split? (accept-vs-reject)
  //  - of those who were SHOWN, how many even chose? (engagement)
  const pct = (n, d) => (d > 0 ? Math.round((n / d) * 100) : 0);
  const accPctDecided = pct(accepted, decided);
  const rejPctDecided = pct(rejected, decided);
  if (shown === 0 && decided === 0) {
    return `
      <section class="adm-section">
        <h2>Cookie consent</h2>
        <p class="muted">No consent decisions recorded yet — this fills in once non-admin visitors see the cookie banner and click Accept or Reject.</p>
      </section>`;
  }
  // Stacked bar across everyone who was shown the banner.
  const aW = pct(accepted, shown), rW = pct(rejected, shown), iW = pct(ignored, shown);
  return `
    <section class="adm-section">
      <h2>Cookie consent <span class="muted" style="font-weight:400;font-size:.7em;">how much analytics data you actually get</span></h2>
      <div class="adm-consent">
        <div class="adm-consent-headline">
          <strong>${accPctDecided}%</strong> accept
          &middot; <strong>${rejPctDecided}%</strong> reject
          <span class="muted">(of ${decided} who chose)</span>
        </div>
        <div class="adm-consent-bar" role="img" aria-label="${aW}% accepted, ${rW}% rejected, ${iW}% ignored">
          <span class="adm-cbar adm-cbar-acc" style="width:${aW}%" title="Accepted: ${accepted}"></span>
          <span class="adm-cbar adm-cbar-rej" style="width:${rW}%" title="Rejected: ${rejected}"></span>
          <span class="adm-cbar adm-cbar-ign" style="width:${iW}%" title="Ignored: ${ignored}"></span>
        </div>
        <div class="adm-consent-legend">
          <span><span class="adm-dot adm-dot-acc"></span>Accept ${accepted}</span>
          <span><span class="adm-dot adm-dot-rej"></span>Reject ${rejected}</span>
          <span><span class="adm-dot adm-dot-ign"></span>Ignored ${ignored}</span>
          <span class="muted">${shown} shown the banner</span>
        </div>
        <p class="muted adm-table-hint">Visitors who accept get full analytics (rich pageviews, funnel). The rest are still counted anonymously in Views &mdash; this number tells you how much detail you trade away. A high reject rate means lean on the anonymous counters.</p>
      </div>
    </section>`;
}

function _fmtDuration(s) {
  s = Math.round(s || 0);
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60), rem = s % 60;
  return rem ? `${m}m ${rem}s` : `${m}m`;
}

function _renderDwell(evDwell) {
  const rows = (evDwell && evDwell.top) || [];
  if (!rows.length) {
    return `
      <section class="adm-section">
        <h2>Time on page</h2>
        <p class="muted">No dwell data yet — this fills in once non-admin visitors spend more than 2 seconds on a spot, center, stay or country page.</p>
      </section>`;
  }
  const maxAvg = Math.max(1, ...rows.map(r => r.avg_seconds || 0));
  const trs = rows.map((r, i) => {
    const key = r.page_key || "";
    let name, town = "", emoji;
    if (key.indexOf("country:") === 0) {
      name = key.slice(8); emoji = "🌍";
    } else {
      const entry = _entryById(key);
      name = entry ? entry.name : key;
      town = entry ? entry.town : "";
      emoji = entry ? _typeEmoji(entry.type) : "·";
    }
    const pct = Math.round(((r.avg_seconds || 0) / maxAvg) * 100);
    const isEntry = key.indexOf("country:") !== 0 && _entryById(key);
    const label = isEntry
      ? `<a href="spot.html?id=${encodeURIComponent(key)}" target="_blank" rel="noopener" class="adm-eng-name">${emoji} ${_esc(name)}</a>${town ? `<span class="muted"> · ${_esc(town)}</span>` : ""}`
      : `${emoji} ${_esc(name)}`;
    return `
      <tr>
        <td class="adm-eng-rank">${i + 1}</td>
        <td>${label}</td>
        <td class="adm-eng-num"><strong>${_fmtDuration(r.avg_seconds)}</strong></td>
        <td>
          <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${pct}%"></span></span>
        </td>
        <td class="adm-eng-num muted">${r.count}</td>
      </tr>`;
  }).join("");
  return `
    <section class="adm-section">
      <h2>Time on page <span class="muted" style="font-weight:400;font-size:.7em;">average active attention</span></h2>
      <div class="adm-table-wrap">
        <table class="adm-table adm-eng-table">
          <thead>
            <tr><th>#</th><th>Page</th><th class="adm-eng-num">Avg time</th><th>&nbsp;</th><th class="adm-eng-num">Views</th></tr>
          </thead>
          <tbody>${trs}</tbody>
        </table>
      </div>
      <p class="muted adm-table-hint">Average <em>active</em> seconds per visit &mdash; the timer pauses when the tab is hidden, so this is real attention, not tab-left-open. Capped at 30 min, bounces under 2s ignored. <strong>Views</strong> here = the dwell sample size (how many timed visits), so a high average on 2 visits means less than a modest one on 200.</p>
    </section>`;
}

function _renderActivity(evAff, evViews, evFunnel, evSearch) {
  function _spotRow(item, maxCount) {
    const entry = _entryById(item.spot_id);
    const name  = entry ? entry.name : (item.spot_id || "(unknown)");
    const town  = entry ? entry.town : "";
    const emoji = entry ? _typeEmoji(entry.type) : "·";
    const pct   = Math.round((item.count / maxCount) * 100);
    return `
      <li class="adm-pop-row">
        <span class="adm-pop-name">${emoji} ${_esc(name)} <span class="muted">${_esc(town)}</span></span>
        <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${pct}%"></span></span>
        <span class="adm-pop-count">${item.count}</span>
      </li>`;
  }

  // Top affiliate clicks
  const aff = evAff.top || [];
  const affMax = Math.max(1, ...aff.map(x => x.count));
  const affHtml = aff.length
    ? `<ol class="adm-pop-list">${aff.map(x => _spotRow(x, affMax)).join("")}</ol>`
    : `<p class="muted">No affiliate clicks yet.</p>`;

  // Top viewed pages
  const views = evViews.top || [];
  const viewsMax = Math.max(1, ...views.map(x => x.count));
  const viewsHtml = views.length
    ? `<ol class="adm-pop-list">${views.map(x => _spotRow(x, viewsMax)).join("")}</ol>`
    : `<p class="muted">No page views yet — every real visitor is counted (admin sessions excluded), so this fills in once non-admin visitors open spot pages.</p>`;

  // Signup funnel — relative bars vs. step 1, plus drop-off %.
  const steps = evFunnel.steps || [];
  const stepLabel = {
    signup_modal_open:       "1. Modal opened",
    signup_email_filled:     "2. Email entered",
    signup_password_filled:  "3. Password entered",
    signup_submitted:        "4. Submitted",
    signup_profile_saved:    "5a. Profile saved",
    signup_profile_skipped:  "5b. Skipped profile",
  };
  const firstCount = (steps[0] && steps[0].count) || 0;
  const funnelHtml = steps.length
    ? `<ol class="adm-pop-list">${steps.map(s => {
        const label = stepLabel[s.step] || s.step;
        const pct = firstCount ? Math.round((s.count / firstCount) * 100) : 0;
        return `
          <li class="adm-pop-row">
            <span class="adm-pop-name">${_esc(label)}</span>
            <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${pct}%"></span></span>
            <span class="adm-pop-count">${s.count}</span>
          </li>`;
      }).join("")}</ol>`
    : `<p class="muted">No signup activity yet.</p>`;

  // Search — top queries (frequency) + recent (raw, latest first).
  // Top queries get a status badge + action buttons so the dashboard
  // panel becomes a content roadmap. Status is one of: open (default),
  // planned (we're going to add this), dismissed (irrelevant / noise).
  const topSearch = evSearch.top || [];
  const topSearchMax = Math.max(1, ...topSearch.map(x => x.count));
  const _statusLabel = { open: "open", planned: "planned", dismissed: "dismissed" };
  const topSearchHtml = topSearch.length
    ? `<ol class="adm-pop-list adm-search-list">${topSearch.map(q => {
        const status = q.action_status || "open";
        const badge = `<span class="adm-search-badge adm-search-badge-${status}">${_statusLabel[status]}</span>`;
        // Two action buttons: cycle plan / dismiss / reopen depending
        // on current status. Encoded query goes in data-q for the wire
        // handler to send back to /admin/search-queries/action.
        const qEnc = _esc(q.query);
        const actions = status === "open"
          ? `<button class="link-btn" data-search-action="planned"   data-q="${qEnc}">plan</button>
             <button class="link-btn" data-search-action="dismissed" data-q="${qEnc}">dismiss</button>`
          : status === "planned"
          ? `<button class="link-btn" data-search-action="open"      data-q="${qEnc}">undo</button>
             <button class="link-btn" data-search-action="dismissed" data-q="${qEnc}">dismiss</button>`
          : `<button class="link-btn" data-search-action="open"      data-q="${qEnc}">reopen</button>`;
        return `
          <li class="adm-pop-row adm-search-row">
            <span class="adm-pop-name">${qEnc} ${badge}</span>
            <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${Math.round((q.count / topSearchMax) * 100)}%"></span></span>
            <span class="adm-pop-count">${q.count}</span>
            <span class="adm-search-actions">${actions}</span>
          </li>`;
      }).join("")}</ol>`
    : `<p class="muted">No searches yet.</p>`;

  const recentSearch = evSearch.recent || [];
  const recentSearchHtml = recentSearch.length
    ? `<ul class="adm-recent-search">${recentSearch.slice(0, 20).map(q => `
        <li>
          <span class="adm-mono">${_esc(q.query)}</span>
          <span class="muted adm-recent-ts">${_fmtDate(q.ts, true)}</span>
        </li>`).join("")}</ul>`
    : `<p class="muted">No searches yet.</p>`;

  return `
    <section class="adm-section adm-pop">
      <h2>Activity</h2>
      <p class="muted adm-table-hint">
        1st-party event tracking. Admin events (Lode, Michiel) are filtered out server-side
        so the numbers reflect real visitors only. Consent-gated via the cookie banner — visitors
        who reject analytics don&rsquo;t show up here either.
      </p>
      <div class="adm-pop-grid">
        <div>
          <h3>Top affiliate clicks</h3>
          ${affHtml}
        </div>
        <div>
          <h3>Top viewed pages</h3>
          ${viewsHtml}
        </div>
      </div>
      <div class="adm-pop-grid" style="margin-top: 24px;">
        <div>
          <h3>Signup funnel</h3>
          ${funnelHtml}
        </div>
        <div>
          <h3>Top searches</h3>
          ${topSearchHtml}
          <h3 style="margin-top: 18px;">Recent searches</h3>
          ${recentSearchHtml}
        </div>
      </div>
    </section>
  `;
}

/* ---------- recent reviews feed ---------- */

function _renderRecentReviews(payload) {
  const items = (payload && payload.recent) || [];
  const weekCount = (payload && payload.week_count) || 0;
  const hint = weekCount > 0
    ? `<span class="adm-pill adm-pill-sea">${weekCount} this week</span>`
    : `<span class="muted">none this week</span>`;
  if (!items.length) {
    return `<section class="adm-section">
      <h2>Recent reviews ${hint}</h2>
      <p class="muted">No reviews on the platform yet.</p>
    </section>`;
  }
  // Each row: stars + spot + author + truncated text + delete btn.
  // Clicking the spot link opens the spot page in a new tab so the
  // admin can read the full review in context.
  const rows = items.map(r => {
    const entry = _entryById(r.entry_id);
    const spotName = entry ? entry.name : (r.entry_id || "(unknown)");
    const spotType = entry ? _typeEmoji(entry.type) : "·";
    const stars = "★".repeat(Math.max(0, Math.min(5, r.stars || 0)))
                + "☆".repeat(Math.max(0, 5 - (r.stars || 0)));
    const text = (r.text || "").trim();
    const shortText = text.length > 200 ? text.slice(0, 197) + "…" : text;
    const author = r.name || "Anonymous";
    // Processed-flag UI. If analyzed_at is set, show a sea-soft
    // "✓ Analyzed" chip with the note + an "undo" link. If not, an
    // "Mark as analyzed" link that flips us into the note prompt.
    const isAnalyzed = !!r.analyzed_at;
    const noteText   = (r.analyzed_note || "").trim();
    const analyzedChip = isAnalyzed
      ? `<span class="adm-analyzed-chip" title="Marked ${_fmtDate(r.analyzed_at, true)}${noteText ? ' — ' + noteText.replace(/"/g, "&quot;") : ""}">
           ✓ analyzed${noteText ? ` — <i>${_esc(noteText.length > 60 ? noteText.slice(0,57) + "…" : noteText)}</i>` : ""}
         </span>`
      : "";
    const analyzedAction = isAnalyzed
      ? `<button class="link-btn" data-review-unprocess="${_esc(r.id)}">undo analyzed</button>`
      : `<button class="link-btn" data-review-process="${_esc(r.id)}">mark as analyzed</button>`;
    return `
      <li class="adm-review-row${isAnalyzed ? " is-analyzed" : ""}">
        <div class="adm-review-head">
          <span class="adm-review-stars">${stars}</span>
          <a href="spot.html?id=${encodeURIComponent(r.entry_id)}" target="_blank" rel="noopener" class="adm-review-spot">
            ${spotType} ${_esc(spotName)}
          </a>
          <span class="muted"> · by ${_esc(author)}</span>
          <span class="muted adm-review-ts"> · ${_fmtDate(r.created_at, true)}</span>
          ${analyzedChip}
        </div>
        ${shortText ? `<p class="adm-review-text">${_esc(shortText)}</p>` : ""}
        <div class="adm-review-actions">
          ${analyzedAction}
          <button class="link-btn admin-danger" data-admin-recent-del="${_esc(r.id)}">delete</button>
        </div>
      </li>`;
  }).join("");
  return `<section class="adm-section">
    <h2>Recent reviews ${hint}</h2>
    <p class="muted adm-table-hint">Newest first across every spot, center and stay. Click the spot to read in context. "Mark as analyzed" tags a review as already woven into the write-up — also surfaces a "Used in our write-up" badge to the author on the public page.</p>
    <ul class="adm-review-list">${rows}</ul>
  </section>`;
}

function _wireRecentReviews() {
  document.querySelectorAll("[data-admin-recent-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Admin-delete this review? This is permanent.")) return;
      try {
        const res = await WaveBaseAuth.authFetch(
          "/admin/reviews/" + encodeURIComponent(btn.dataset.adminRecentDel),
          { method: "DELETE" },
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        _renderDashboard();  // full reload — fast, keeps counts honest
      } catch (e) {
        alert("Couldn't delete review: " + (e && e.message || e));
      }
    });
  });
}

/* ---------- review "mark as analyzed" wiring ----------
   Both buttons (mark / undo) sit on every review-row in the recent
   feed. Mark prompts for an optional note via window.prompt — quick
   and good enough for now; a fancier modal could come later if
   we want richer formatting. Undo is one-click since it just clears
   the flag. */
function _wireReviewProcessed() {
  document.querySelectorAll("[data-review-process]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.reviewProcess;
      // Optional admin note — empty input is fine, just no badge note.
      // Null (Cancel) bails out entirely.
      const note = window.prompt(
        "Mark this review as analyzed.\n\nOptional note (shown publicly to the author under the 'Used in our write-up' badge):",
        "",
      );
      if (note === null) return;
      btn.disabled = true;
      try {
        const res = await WaveBaseAuth.authFetch(
          "/admin/reviews/" + encodeURIComponent(id) + "/processed",
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ note: (note || "").trim() }),
          },
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        _renderDashboard();
      } catch (e) {
        alert("Couldn't mark as analyzed: " + (e && e.message || e));
        btn.disabled = false;
      }
    });
  });
  document.querySelectorAll("[data-review-unprocess]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Clear the analyzed flag? The 'Used in our write-up' badge will disappear from the public page.")) return;
      const id = btn.dataset.reviewUnprocess;
      btn.disabled = true;
      try {
        const res = await WaveBaseAuth.authFetch(
          "/admin/reviews/" + encodeURIComponent(id) + "/processed",
          { method: "DELETE" },
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        _renderDashboard();
      } catch (e) {
        alert("Couldn't undo: " + (e && e.message || e));
        btn.disabled = false;
      }
    });
  });
}

/* ---------- stay ↔ spot affinity (admin only) ---------- */

function _renderStayAffinity(payload) {
  const rows = (payload && payload.rows) || [];
  if (!rows.length) {
    return `<section class="adm-section">
      <h2>Stay ↔ Spot affinity</h2>
      <p class="muted">No trips with stays yet — nothing to pair up.</p>
    </section>`;
  }
  const trs = rows.map((r, i) => {
    const stay = _entryById(r.stay_id);
    const stayName = stay ? stay.name : r.stay_id;
    const stayTown = stay ? stay.town : "";
    const pairings = r.pairings.length
      ? r.pairings.map(p => {
          const e = _entryById(p.spot_id);
          const n = e ? e.name : p.spot_id;
          const t = e ? _typeEmoji(e.type) : "·";
          return `<span class="adm-aff-pair">${t} <a href="spot.html?id=${encodeURIComponent(p.spot_id)}" target="_blank" rel="noopener">${_esc(n)}</a> <span class="muted">·${p.count}</span></span>`;
        }).join("")
      : `<span class="muted">no spots paired yet</span>`;
    return `
      <tr>
        <td class="adm-eng-rank">${i + 1}</td>
        <td>
          🏠 <a href="spot.html?id=${encodeURIComponent(r.stay_id)}&type=stay" target="_blank" rel="noopener" class="adm-eng-name">${_esc(stayName)}</a>
          ${stayTown ? `<span class="muted"> · ${_esc(stayTown)}</span>` : ""}
        </td>
        <td class="adm-eng-num">${r.trips}</td>
        <td>${pairings}</td>
      </tr>`;
  }).join("");
  return `<section class="adm-section">
    <h2>Stay ↔ Spot affinity</h2>
    <p class="muted adm-table-hint">For each stay: how many trips include it, plus the top 3 spots/centers that show up in the same trip. Hint at natural routes — "popular pairings" copy could come from here.</p>
    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Stay</th>
            <th class="adm-eng-num">Trips</th>
            <th>Top pairings (spot · times paired)</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  </section>`;
}

/* ---------- conditions vs reviews mismatch (admin only) ----------
   Renders the flagged spots first (where reviewer majority disagrees
   with our labelled crowd), then the rest as informational rows.
   "Sample" links jump to each contributing review on the spot page
   via the existing #review-{id} anchor so the admin can read the
   original text. */

function _renderConditionsMismatch(payload) {
  const rows = (payload && payload.rows) || [];
  const flagged = rows.filter(r => r.flagged);
  if (!flagged.length) {
    return `<section class="adm-section adm-mismatch">
      <h2>Conditions vs reviews</h2>
      <p class="muted">No conflicts detected — our crowd labels match what reviewers report. (Or there aren't enough reviews yet to disagree.)</p>
    </section>`;
  }
  const labelTxt = lvl => ({low: "Quiet", moderate: "Moderate", high: "Busy"})[lvl] || lvl;
  const trs = flagged.map(r => {
    const e = _entryById(r.spot_id);
    const name = e ? e.name : r.spot_id;
    const town = e ? e.town : "";
    const s = r.signals;
    const breakdown = `<span class="adm-mm-sig">L ${s.low} · M ${s.moderate} · H ${s.high}</span>`;
    return `
      <tr>
        <td>
          🌊 <a href="spot.html?id=${encodeURIComponent(r.spot_id)}" target="_blank" rel="noopener" class="adm-eng-name">${_esc(name)}</a>
          ${town ? `<span class="muted"> · ${_esc(town)}</span>` : ""}
        </td>
        <td><span class="adm-mm-label">${labelTxt(r.labelled)}</span></td>
        <td><span class="adm-mm-label adm-mm-label-alert">${labelTxt(r.majority)}</span></td>
        <td>${breakdown}</td>
      </tr>`;
  }).join("");
  return `<section class="adm-section adm-mismatch">
    <h2>Conditions vs reviews <span class="adm-pill adm-pill-clay">${flagged.length} flagged</span></h2>
    <p class="muted adm-table-hint">Reviewers are saying something different from our labelled crowd level. Mark a review as analyzed once you've updated the write-up — it drops out of this list automatically.</p>
    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr>
            <th>Spot</th>
            <th>Our label</th>
            <th>Reviewer majority</th>
            <th>Signals (L · M · H)</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  </section>`;
}

/* ---------- engagement scoreboard ---------- */

// Engagement scoreboard type filter: "all" | "spot" | "center" | "stay".
let _engTypeFilter = "all";
function _entryMatchesType(entry, filter) {
  if (filter === "all") return true;
  if (!entry) return false;                 // unknown entries drop out of typed views
  if (filter === "spot") return entry.type !== "center" && entry.type !== "stay";
  return entry.type === filter;
}

function _renderEngagement(payload, evViews, evAff) {
  const allRows = (payload && payload.rows) || [];
  if (!allRows.length) {
    return `<section class="adm-section">
      <h2>Engagement scoreboard</h2>
      <p class="muted">No engagement signals yet — give it a few users.</p>
    </section>`;
  }
  // Counts per type for the filter pills (computed on the full set).
  const typeCount = { all: allRows.length, spot: 0, center: 0, stay: 0 };
  allRows.forEach(r => {
    const e = _entryById(r.spot_id);
    if (e && e.type === "center") typeCount.center++;
    else if (e && e.type === "stay") typeCount.stay++;
    else typeCount.spot++;
  });
  const rows = allRows.filter(r => _entryMatchesType(_entryById(r.spot_id), _engTypeFilter));
  // Merge in "Book now" / affiliate-click counts so we can show a
  // view→book conversion rate per entry — the closest thing to a
  // revenue signal in an affiliate model. clicks ÷ views = CTR.
  const clicksBySpot = {};
  ((evAff && evAff.top) || []).forEach(a => {
    if (a && a.spot_id) clicksBySpot[a.spot_id] = a.count || 0;
  });
  // Merge in page-view counts from /admin/events/pageviews.
  // Pageviews are events fired on every spot.html load (gated by cookie
  // consent + admin-allowlist drop). The data lives in a separate aggregate;
  // here we just key it by spot_id so the engagement table can show
  // views as a leading-indicator column alongside saves/surfed/reviews.
  const viewsBySpot = {};
  ((evViews && evViews.top) || []).forEach(v => {
    if (v && v.spot_id) viewsBySpot[v.spot_id] = v.count || 0;
  });
  const maxScore = Math.max(1, ...rows.map(r => r.score));
  const trs = rows.map((r, i) => {
    const entry = _entryById(r.spot_id);
    const name = entry ? entry.name : (r.spot_id || "(unknown)");
    const town = entry ? entry.town : "";
    const emoji = entry ? _typeEmoji(entry.type) : "·";
    const pct = Math.round((r.score / maxScore) * 100);
    const ago = _fmtAgo(r.last_activity);
    const views = viewsBySpot[r.spot_id] || 0;
    const clicks = clicksBySpot[r.spot_id] || 0;
    // CTR only meaningful once there are views to divide by.
    const ctr = views > 0 ? Math.round((clicks / views) * 100) : null;
    const ctrCell = clicks === 0
      ? `<span class="muted">0</span>`
      : `${clicks}${ctr !== null ? ` <span class="adm-ctr">${ctr}%</span>` : ""}`;
    return `
      <tr>
        <td class="adm-eng-rank">${i + 1}</td>
        <td>
          <a href="spot.html?id=${encodeURIComponent(r.spot_id)}" target="_blank" rel="noopener" class="adm-eng-name">
            ${emoji} ${_esc(name)}
          </a>
          ${town ? `<span class="muted"> · ${_esc(town)}</span>` : ""}
        </td>
        <td class="adm-eng-num adm-eng-views">${views || `<span class="muted">0</span>`}</td>
        <td class="adm-eng-num adm-eng-book">${ctrCell}</td>
        <td class="adm-eng-num">${r.saves}</td>
        <td class="adm-eng-num">${r.surfed}</td>
        <td class="adm-eng-num">${r.reviews}</td>
        <td class="adm-eng-num">${r.helpful}</td>
        <td class="adm-eng-score">
          <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${pct}%"></span></span>
          <span class="adm-eng-score-num">${r.score}</span>
        </td>
        <td class="adm-eng-ago${ago.stale ? " is-stale" : ""}">${_esc(ago.text)}</td>
      </tr>`;
  }).join("");
  const engPill = (val, label) =>
    `<button type="button" class="adm-filter-pill${_engTypeFilter === val ? " is-active" : ""}" data-eng-type="${val}">${label} <span class="muted">${typeCount[val]}</span></button>`;
  return `<section class="adm-section">
    <h2>Engagement scoreboard</h2>
    <div class="adm-filter-row">
      ${engPill("all", "All")}
      ${engPill("spot", "🌊 Spots")}
      ${engPill("center", "🎓 Centers")}
      ${engPill("stay", "🏠 Stays")}
    </div>
    <p class="muted adm-table-hint">Combined score per spot = saves×1 + surfed×2 + reviews×5 + helpful×3. <strong>Views</strong> = how often the detail page got opened (every visitor, consented in full + the rest anonymously; admin dropped). <strong>Book&nbsp;now</strong> = "Book now"/affiliate clicks and the view→book conversion rate (clicks ÷ views) — the closest thing to a revenue signal: a spot with few views but a high % converts harder than a popular one nobody books. Last activity dims to muted when stale ≥ 90 days.</p>
    <div class="adm-table-wrap">
      <table class="adm-table adm-eng-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Spot</th>
            <th class="adm-eng-num">Views</th>
            <th class="adm-eng-num">Book&nbsp;now</th>
            <th class="adm-eng-num">Saves</th>
            <th class="adm-eng-num">Surfed</th>
            <th class="adm-eng-num">Reviews</th>
            <th class="adm-eng-num">Helpful</th>
            <th>Score</th>
            <th>Last activity</th>
          </tr>
        </thead>
        <tbody>${trs || `<tr><td colspan="10" class="muted">No ${_engTypeFilter === "all" ? "entries" : _engTypeFilter + "s"} with engagement signals yet.</td></tr>`}</tbody>
      </table>
    </div>
  </section>`;
}

/* ---------- engagement by country ---------- */

function _renderByCountry(payload) {
  const rows = (payload && payload.rows) || [];
  if (!rows.length) {
    return `<section class="adm-section">
      <h2>Engagement by country</h2>
      <p class="muted">No country-level signals yet.</p>
    </section>`;
  }
  const maxScore = Math.max(1, ...rows.map(r => r.score));
  const trs = rows.map((r, i) => {
    const pct = Math.round((r.score / maxScore) * 100);
    const rating = r.avg_rating_10 != null ? `${r.avg_rating_10}/10` : "—";
    return `
      <tr>
        <td class="adm-eng-rank">${i + 1}</td>
        <td><a href="index.html?country=${encodeURIComponent(r.country)}" target="_blank" rel="noopener" class="adm-eng-name">${_esc(r.country)}</a></td>
        <td class="adm-eng-num">${r.spots}</td>
        <td class="adm-eng-num">${r.saves}</td>
        <td class="adm-eng-num">${r.surfed}</td>
        <td class="adm-eng-num">${r.reviews}</td>
        <td class="adm-eng-num">${r.helpful}</td>
        <td class="adm-eng-num">${rating}</td>
        <td class="adm-eng-score">
          <span class="adm-pop-bar"><span class="adm-pop-bar-fill" style="width:${pct}%"></span></span>
          <span class="adm-eng-score-num">${r.score}</span>
        </td>
      </tr>`;
  }).join("");
  return `<section class="adm-section">
    <h2>Engagement by country</h2>
    <p class="muted adm-table-hint">Same score formula as the per-spot scoreboard, rolled up per country. Strategy view: where to deepen versus where to start.</p>
    <div class="adm-table-wrap">
      <table class="adm-table adm-eng-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Country</th>
            <th class="adm-eng-num">Spots</th>
            <th class="adm-eng-num">Saves</th>
            <th class="adm-eng-num">Surfed</th>
            <th class="adm-eng-num">Reviews</th>
            <th class="adm-eng-num">Helpful</th>
            <th class="adm-eng-num">Avg rating</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  </section>`;
}

/* ---------- search-miss action wiring ---------- */

function _wireSearchActions() {
  document.querySelectorAll("[data-search-action]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const status = btn.dataset.searchAction;
      const q = btn.dataset.q;
      if (!status || !q) return;
      btn.disabled = true;
      try {
        const res = await WaveBaseAuth.authFetch("/admin/search-queries/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, status }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        _renderDashboard();
      } catch (e) {
        alert("Couldn't update search action: " + (e && e.message || e));
        btn.disabled = false;
      }
    });
  });
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
        // Default: numeric counts + recent-first dates sort desc, names asc.
        _sortDesc = ["saved_count", "surfed_count", "trips_count", "signed_up_at", "last_activity", "total_seconds"].indexOf(key) !== -1;
      }
      _renderDashboard();
    });
  });
  // Dormant-filter pills above the users table.
  document.querySelectorAll("[data-dormant-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      _dormantFilter = btn.dataset.dormantFilter;
      _renderDashboard();
    });
  });
  // "Most active" preset — show everyone, sorted by time-on-site desc.
  document.querySelectorAll("[data-sort-preset='active']").forEach(btn => {
    btn.addEventListener("click", () => {
      _dormantFilter = "all";
      _sortKey = "total_seconds";
      _sortDesc = true;
      _renderDashboard();
    });
  });
  // Engagement scoreboard type filter (spot / center / stay).
  document.querySelectorAll("[data-eng-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      _engTypeFilter = btn.dataset.engType;
      _renderDashboard();
    });
  });
}

/* ---------- CSV export wiring ----------
   Each "users / reviews / trips" link in the admin head triggers a
   JWT-authed download. authFetch returns a Blob via response.blob(),
   which we wrap in an object URL and click programmatically. The
   browser saves it under the Content-Disposition filename the API
   sends ("surfgoose-users.csv" etc.). */
function _wireCsvExports() {
  document.querySelectorAll("[data-export]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const kind = btn.dataset.export;  // "users" | "reviews" | "trips"
      btn.disabled = true;
      const originalLabel = btn.textContent;
      btn.textContent = originalLabel + "…";
      try {
        const res = await WaveBaseAuth.authFetch("/admin/export/" + kind + ".csv");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const blob = await res.blob();
        // Extract filename from the Content-Disposition header if present;
        // fall back to a sane default.
        const cd = res.headers.get("Content-Disposition") || "";
        const m = cd.match(/filename="([^"]+)"/);
        const filename = m ? m[1] : `surfgoose-${kind}.csv`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } catch (e) {
        alert("Couldn't export " + kind + ": " + (e && e.message || e));
      } finally {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
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

  // Reviews block — same layout as the public reviews section on
  // a spot page, just resolved + listed here for admin context.
  const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const reviewsHtml = (detail.reviews || []).length
    ? `<ul class="adm-entry-list adm-reviews-list">${detail.reviews.map(r => {
        const e = _entryById(r.entry_id);
        const where = e
          ? `${_typeEmoji(e.type)} <a href="spot.html?id=${encodeURIComponent(e.id)}" target="_blank" rel="noopener">${_esc(e.name)}</a> <span class="muted">${_esc(e.town || "")}</span>`
          : `<span class="muted">${_esc(r.entry_id)}</span>`;
        const stars = "★".repeat(Math.max(0, Math.min(5, r.stars || 0))) + "☆".repeat(Math.max(0, 5 - (r.stars || 0)));
        const visited = (r.year_visited && r.month_visited)
          ? `${MONTHS[r.month_visited]} ${r.year_visited}`
          : (r.year_visited ? `${r.year_visited}` : "");
        const date = _fmtDate(r.created_at);
        return `<li class="adm-entry">
          <div>${where} · ${stars}${visited ? ' <span class="muted">visited ' + _esc(visited) + '</span>' : ''} <span class="muted">posted ${_esc(date)}</span></div>
          ${r.text ? `<p class="muted" style="margin: 4px 0 0; font-size: 13px;">${_esc(r.text)}</p>` : ""}
        </li>`;
      }).join("")}</ul>`
    : `<p class="muted">No reviews yet.</p>`;

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

  // Danger zone — only render the delete button when the action is
  // ALLOWED. Backend refuses self-delete + admin-delete; mirror those
  // rules here so the admin doesn't click a button that just errors.
  const myEmail = ((WaveBaseAuth.currentUser() || {}).email || "").toLowerCase();
  const isSelf  = (u.email || "").toLowerCase() === myEmail;
  const isAdmin = ADMIN_EMAILS.some(a => a.toLowerCase() === (u.email || "").toLowerCase());
  let dangerZoneHTML = "";
  if (isSelf) {
    dangerZoneHTML = `
      <h3>Danger zone</h3>
      <p class="muted">This is your own admin account — delete from "My SurfGoose &rarr; Delete my account" if you really need to.</p>`;
  } else if (isAdmin) {
    dangerZoneHTML = `
      <h3>Danger zone</h3>
      <p class="muted">${_esc(u.email)} is an admin. Demote to role=&quot;user&quot; in Mongo first if you really want to delete them.</p>`;
  } else {
    // Cascade summary so the admin sees exactly what they're nuking
    // before they confirm. Two-step UX: first click reveals the
    // confirmation, second click actually fires the DELETE.
    const reviewsN = (detail.reviews || []).length;
    dangerZoneHTML = `
      <h3>Danger zone</h3>
      <p class="muted">Permanently delete this user. Hard delete with full cascade — no undo. Routes through the same endpoint the in-app "Delete my account" uses, so all linked rows are cleaned up correctly.</p>
      <div class="adm-danger-zone">
        <button type="button" class="btn btn-danger" id="adm-delete-user-btn" data-user-id="${_esc(u.id)}" data-user-email="${_esc(u.email)}">
          Delete account…
        </button>
        <div id="adm-delete-user-confirm" hidden>
          <p class="adm-danger-summary">
            About to delete <strong>${_esc(u.email)}</strong>. This will:
          </p>
          <ul class="adm-danger-list">
            <li>permanently remove <strong>${detail.saved.length}</strong> saved spots</li>
            <li>permanently remove <strong>${detail.surfed.length}</strong> surf-log entries</li>
            <li>permanently remove <strong>${detail.trips.length}</strong> trips</li>
            <li>anonymise <strong>${reviewsN}</strong> reviews (left visible without author)</li>
            <li>delete the user record itself</li>
          </ul>
          <div class="adm-danger-confirm-row">
            <button type="button" class="btn btn-danger" id="adm-delete-user-confirm-btn">Yes, delete permanently</button>
            <button type="button" class="link-btn" id="adm-delete-user-cancel-btn">Cancel</button>
          </div>
        </div>
      </div>`;
  }

  // Time-on-site comes from the overview payload (cached), not the
  // user-detail endpoint — look the user up there for the session
  // totals so we don't need a second round-trip.
  const ov = (_adminUsersCache || []).find(x => x.id === u.id) || {};
  const onSiteHtml = (ov.total_seconds || 0) > 0
    ? `<strong>${_fmtDuration(ov.total_seconds)}</strong> <span class="muted">across ${ov.session_count} session${ov.session_count === 1 ? "" : "s"} &middot; avg ${_fmtDuration(ov.avg_session_seconds)}${ov.is_online ? " &middot; online now" : ""}</span>`
    : `<span class="muted">no tracked time yet</span>`;

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
      <div><span class="adm-prof-k">⏱️</span> Time on site: ${onSiteHtml}</div>
    </div>

    <h3>Saved (${detail.saved.length})</h3>
    ${savedHtml}

    <h3>Surf log (${detail.surfed.length})</h3>
    ${surfedHtml}

    <h3>Trips (${detail.trips.length})</h3>
    <div class="adm-trips">${tripsHtml}</div>

    <h3>Reviews (${(detail.reviews || []).length})</h3>
    ${reviewsHtml}

    ${dangerZoneHTML}
  `;

  // Wire the delete flow (only present when isSelf+isAdmin are both
  // false). First click reveals the confirmation panel; the confirm
  // button fires the actual DELETE and closes the modal on success.
  const deleteBtn   = document.getElementById("adm-delete-user-btn");
  const confirmPane = document.getElementById("adm-delete-user-confirm");
  const confirmBtn  = document.getElementById("adm-delete-user-confirm-btn");
  const cancelBtn   = document.getElementById("adm-delete-user-cancel-btn");
  if (deleteBtn && confirmPane) {
    deleteBtn.addEventListener("click", () => {
      deleteBtn.hidden = true;
      confirmPane.hidden = false;
    });
  }
  if (cancelBtn && confirmPane && deleteBtn) {
    cancelBtn.addEventListener("click", () => {
      confirmPane.hidden = true;
      deleteBtn.hidden = false;
    });
  }
  if (confirmBtn && deleteBtn) {
    confirmBtn.addEventListener("click", async () => {
      if (confirmBtn.disabled) return;
      confirmBtn.disabled = true;
      confirmBtn.textContent = "Deleting…";
      try {
        const res = await WaveBaseAuth.authFetch(
          "/admin/users/" + encodeURIComponent(deleteBtn.dataset.userId),
          { method: "DELETE" },
        );
        if (!res.ok) {
          // Backend refusal (self / admin / 404) lands here.
          let msg = "HTTP " + res.status;
          try { const j = await res.json(); msg = j.detail || msg; } catch (e) {}
          throw new Error(msg);
        }
        _closeUserDetail();
        _renderDashboard();
      } catch (e) {
        alert("Couldn't delete user: " + (e && e.message || e));
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Yes, delete permanently";
      }
    });
  }
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
