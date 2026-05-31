/* WaveBase — fake account.
   Everything is stored locally in the browser (localStorage). No real login, no server.
   The real version (database + auth) is phase 2.
   Key stays v1 so existing local data (profile, trips) is preserved. */

const WaveBaseAccount = (function () {
  const KEY = "wavebase_account_v1";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function write(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  /* Server-sync helper for saved spots. Slug -> API UUID translation
     via the maps that api-client.js exposes on window after the boot
     fetch. Fire-and-forget: localStorage is the offline truth and any
     network failure here is caught up by syncSavedFromServer() on the
     next page load. WaveBaseAuth is defined below this IIFE — the
     lazy lookup at call time is fine because toggleSave is only ever
     called after the user interacts (long after definition). */
  function _syncSpotToServer(slug, action) {
    try {
      if (typeof WaveBaseAuth === "undefined") return;
      if (!WaveBaseAuth.isLoggedIn()) return;
      const apiId = (typeof window !== "undefined" && window.WAVEBASE_API_ID_BY_SLUG)
        ? (window.WAVEBASE_API_ID_BY_SLUG[slug] || slug)
        : slug;
      const method = (action === "save") ? "POST" : "DELETE";
      WaveBaseAuth.authFetch(
        "/users/me/saved-spots/" + encodeURIComponent(apiId),
        { method: method }
      ).catch(function (e) {
        console.warn("[account] saved-spot " + method + " " + slug + " failed:", e.message || e);
      });
    } catch (e) { /* swallow — sync is best-effort */ }
  }
  function state() {
    const s = read();
    const p = s.profile || {};
    return {
      profile: {
        name: p.name || "",
        email: p.email || "",
        birthYear: p.birthYear || "",
        level: p.level || "",
        yearsSurfing: p.yearsSurfing || "",
        boardType: p.boardType || "",
        travelStyle: p.travelStyle || "",
        travelStyles: Array.isArray(p.travelStyles) ? p.travelStyles : [],
        tripIntent: p.tripIntent || "",
        homeCountry: p.homeCountry || "",
        surfType: Array.isArray(p.surfType) ? p.surfType : [],
        discipline: Array.isArray(p.discipline) ? p.discipline : [],
        tripPriorities: Array.isArray(p.tripPriorities) ? p.tripPriorities : [],
        howDidYouFindUs: p.howDidYouFindUs || "",
        currency: p.currency || ""
      },
      saved: s.saved || [],
      compare: s.compare || [],
      surfed: s.surfed || [],
      trips: (s.trips || []).map(t => ({
        id: t.id,
        name: t.name,
        spotIds: Array.isArray(t.spotIds) ? t.spotIds : [],
        dates: (t.dates && typeof t.dates === "object") ? t.dates : {},
        dayNotes: (t.dayNotes && typeof t.dayNotes === "object") ? t.dayNotes : {}
      })),
      reviews: Array.isArray(s.reviews) ? s.reviews : []
    };
  }

  return {
    /* profile */
    getProfile() { return state().profile; },
    setProfile(p) {
      const s = state();
      s.profile = {
        name: (p.name || "").trim(),
        email: (p.email || "").trim(),
        birthYear: (p.birthYear || "").toString().trim(),
        level: p.level || "",
        yearsSurfing: (p.yearsSurfing || "").toString().trim(),
        boardType: p.boardType || "",
        travelStyle: p.travelStyle || "",
        travelStyles: Array.isArray(p.travelStyles) ? p.travelStyles : [],
        tripIntent: p.tripIntent || "",
        homeCountry: (p.homeCountry || "").trim(),
        surfType: Array.isArray(p.surfType) ? p.surfType : [],
        discipline: Array.isArray(p.discipline) ? p.discipline : [],
        tripPriorities: Array.isArray(p.tripPriorities) ? p.tripPriorities : [],
        howDidYouFindUs: p.howDidYouFindUs || "",
        currency: p.currency || ""
      };
      write(s);
    },

    /* saved places */
    getSaved() { return state().saved; },
    isSaved(id) { return state().saved.indexOf(id) !== -1; },
    toggleSave(id) {
      const s = state();
      const i = s.saved.indexOf(id);
      const nowSaved = (i === -1);
      if (nowSaved) s.saved.push(id); else s.saved.splice(i, 1);
      write(s);
      // Server sync: fire-and-forget when signed in. Local is the
      // source of truth offline; the next syncSavedFromServer() call
      // catches the server up if this push failed.
      _syncSpotToServer(id, nowSaved ? "save" : "unsave");
      return nowSaved;
    },
    /* Pull server-side saved-spots (GET /users/me/saved-spots/) and
       merge into local. Also pushes any local-only spots up to the
       server, which makes this our automatic post-signup migration:
       a user with N saved spots in their browser when they create an
       account ends up with all N synced to their server account on
       the next page load, no prompt needed.

       Called from wavebase:data-ready (id maps ready) and
       wavebase:auth-changed (just logged in). Safe to call when
       not logged in or before data is ready — returns silently. */
    async syncSavedFromServer() {
      if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
      // Need the id maps from api-client.js. If they're not ready yet,
      // the data-ready event will retrigger this call.
      const slugMap = (typeof window !== "undefined" && window.WAVEBASE_SLUG_BY_API_ID) || null;
      if (!slugMap) return;

      let serverList;
      try {
        const res = await WaveBaseAuth.authFetch("/users/me/saved-spots/");
        if (!res.ok) return;
        serverList = await res.json();
      } catch (e) {
        console.warn("[account] syncSavedFromServer fetch failed:", e.message || e);
        return;
      }
      if (!Array.isArray(serverList)) return;

      const serverSlugs = serverList
        .map(x => slugMap[x.id] || x.id)  // UUID -> slug, fallback to UUID
        .filter(Boolean);

      const s = state();
      const localSet  = new Set(s.saved);
      const serverSet = new Set(serverSlugs);

      let changed = false;
      // Pull server-only into local.
      for (const sid of serverSlugs) {
        if (!localSet.has(sid)) {
          s.saved.push(sid);
          changed = true;
        }
      }
      // Push local-only up (post-signup migration + catch-up after offline).
      for (const lid of Array.from(localSet)) {
        if (!serverSet.has(lid)) {
          _syncSpotToServer(lid, "save");
        }
      }
      if (changed) {
        write(s);
        try {
          window.dispatchEvent(new CustomEvent("wavebase:saved-changed"));
        } catch (e) {}
      }
    },

    /* compare list */
    getCompare() { return state().compare; },
    isComparing(id) { return state().compare.indexOf(id) !== -1; },
    toggleCompare(id) {
      const s = state();
      const i = s.compare.indexOf(id);
      if (i === -1) s.compare.push(id); else s.compare.splice(i, 1);
      write(s);
      return s.compare.indexOf(id) !== -1;
    },
    clearCompare() {
      const s = state();
      s.compare = [];
      write(s);
    },

    /* surfed places — "Surfed it" marking. Drives the Explorer's
       new-vs-known dimming + the account scratch-map / surf log.
       Distinct from "saved" (saved = want to go; surfed = already done). */
    getSurfed() { return state().surfed; },
    isSurfed(id) { return state().surfed.indexOf(id) !== -1; },
    toggleSurfed(id) {
      const s = state();
      const i = s.surfed.indexOf(id);
      if (i === -1) s.surfed.push(id); else s.surfed.splice(i, 1);
      write(s);
      return s.surfed.indexOf(id) !== -1;
    },

    /* trips */
    getTrips() { return state().trips; },
    addTrip(name) {
      const s = state();
      const trip = { id: "t" + Date.now(), name: (name || "New trip").trim(), spotIds: [], dates: {} };
      s.trips.push(trip);
      write(s);
      return trip;
    },
    deleteTrip(tripId) {
      const s = state();
      s.trips = s.trips.filter(t => t.id !== tripId);
      write(s);
    },
    /* Rename a trip in place. Empty / whitespace-only names are
       ignored so a trip always keeps a usable name. */
    renameTrip(tripId, name) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (!t) return;
      const nm = (name || "").trim();
      if (nm) t.name = nm;
      write(s);
    },
    addToTrip(tripId, spotId) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (!t) { write(s); return; }
      if (t.spotIds.indexOf(spotId) === -1) {
        t.spotIds.push(spotId);
        // Smart default: if the freshly added entry is a STAY and the
        // most recent prior stay in this trip has a check-out date,
        // pre-fill the new stay's check-in from it (consecutive-trip
        // assumption). Only fills if the new stay has no check-in yet.
        const data = (typeof WAVEBASE_DATA !== "undefined") ? WAVEBASE_DATA : [];
        const newEntry = data.find(x => x.id === spotId);
        if (newEntry && newEntry.type === "stay") {
          for (let i = t.spotIds.length - 2; i >= 0; i--) {
            const prev = data.find(x => x.id === t.spotIds[i]);
            if (prev && prev.type === "stay") {
              const pd = (t.dates && t.dates[t.spotIds[i]]) || {};
              if (pd.out) {
                if (!t.dates) t.dates = {};
                const md = t.dates[spotId] || { in: "", out: "" };
                if (!md.in) {
                  md.in = pd.out;
                  t.dates[spotId] = md;
                }
              }
              break;
            }
          }
        }
      }
      write(s);
    },
    removeFromTrip(tripId, spotId) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (t) {
        t.spotIds = t.spotIds.filter(id => id !== spotId);
        if (t.dates) delete t.dates[spotId];
      }
      write(s);
    },
    /* Per-stay trip dates — check-in / check-out for one stay inside a
       trip. field is "in" or "out", value a YYYY-MM-DD string. Stored
       keyed by entry id; the entry is dropped when both ends are empty
       so the dates map stays tidy. */
    setStayDate(tripId, entryId, field, value) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (!t) return;
      if (!t.dates) t.dates = {};
      const cur = t.dates[entryId] || { in: "", out: "" };
      cur[field] = value || "";
      if (!cur.in && !cur.out) delete t.dates[entryId];
      else t.dates[entryId] = cur;
      write(s);
    },
    /* Per-day free-text note for the Day-by-day view, keyed by date
       (YYYY-MM-DD). An empty note is dropped so the map stays tidy. */
    setDayNote(tripId, dateStr, note) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (!t) return;
      if (!t.dayNotes) t.dayNotes = {};
      const txt = (note || "").trim().slice(0, 140);
      if (txt) t.dayNotes[dateStr] = txt;
      else delete t.dayNotes[dateStr];
      write(s);
    },
    reorderTrip(tripId, fromIndex, toIndex) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (!t) return;
      const ids = t.spotIds;
      if (fromIndex < 0 || fromIndex >= ids.length || toIndex < 0 || toIndex >= ids.length || fromIndex === toIndex) return;
      const moved = ids.splice(fromIndex, 1)[0];
      ids.splice(toIndex, 0, moved);
      write(s);
    },

    /* reviews — local previews of submissions. Persist the full review
       payload so the My-reviews page can display the rich tagged context
       a user wrote. Backend (phase 2) turns these into real shared reviews. */
    getReviews() { return state().reviews; },
    addReview(review) {
      const s = state();
      const entry = {
        id: "r" + Date.now() + Math.floor(Math.random() * 1000),
        entryId:   review.entryId,
        entryType: review.entryType || "spot",  // spot / center / stay
        stars:     Number(review.stars) || 0,
        yearVisited:  Number(review.yearVisited) || null,
        monthVisited: Number(review.monthVisited) || null,
        matches:   review.matches || "",
        text:      (review.text || "").trim(),
        name:      (review.name || "").trim(),
        // Type-specific tags live here as an open dict so we can add more
        // fields per type without changing the schema.
        details:   (review.details && typeof review.details === "object") ? review.details : {},
        when: new Date().toISOString()
      };
      s.reviews.unshift(entry);
      write(s);
      return entry;
    },
    deleteReview(reviewId) {
      const s = state();
      s.reviews = s.reviews.filter(r => r.id !== reviewId);
      write(s);
    }
  };
})();


/* ============================================================
   WaveBaseAuth — server-side accounts (email + password v1).

   Separate module from WaveBaseAccount (the localStorage store)
   because the two solve different problems and have different
   lifecycles:
     - WaveBaseAccount  = local-first prefs and bookmarks for the
                          anon visitor (works without an account).
     - WaveBaseAuth     = signed-in identity backed by the API.
                          Tokens live in localStorage too, but the
                          source of truth is the server.

   The two will converge once we sync saved-spots / profile / etc.
   to the server in follow-up tasks. For now WaveBaseAuth is
   self-contained: signup, login, logout, getMe, updateProfile,
   plus an authFetch() wrapper for any other call that needs the
   Authorization header.

   Public events (dispatched on `window`):
     - wavebase:auth-changed  { user }   — fires after signup, login,
                                            logout, fetchMe, and
                                            updateProfile so the nav
                                            and account page can
                                            re-render without polling.
   ============================================================ */
const WaveBaseAuth = (function () {
  // Same API host the data client uses. Defined in api-client.js but
  // that file is loaded after account.js, so we duplicate the literal
  // as a fallback. They MUST stay in sync; if you change one change
  // both. (Could be hoisted into constants.js later — leaving it here
  // for now to keep this module self-contained.)
  const API = (typeof WAVEBASE_API !== "undefined")
    ? WAVEBASE_API
    : "https://wavebase-api-qqwt.onrender.com";

  // localStorage keys. v1 in the name so we can migrate to a new
  // shape later without colliding with existing tokens in browsers.
  const TOKEN_KEY = "wavebase_auth_token_v1";
  const USER_KEY  = "wavebase_auth_user_v1";

  /* ---- token + cached-user storage ---- */
  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || null; }
    catch (e) { return null; }
  }
  function setToken(t) {
    try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
  }
  function clearAuth() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }
  function getCachedUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
    catch (e) { return null; }
  }
  function setCachedUser(u) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
    catch (e) {}
  }

  /* ---- announce auth state changes so nav etc. can re-render ---- */
  function broadcast(user) {
    try {
      window.dispatchEvent(new CustomEvent(
        "wavebase:auth-changed",
        { detail: { user: user } }
      ));
    } catch (e) { /* old browser without CustomEvent — silently skip */ }
  }

  /* ---- AuthResponse handler shared by signup + login ---- */
  function applyAuthResponse(data) {
    setToken(data.access_token);
    setCachedUser(data.user);
    broadcast(data.user);
    return data.user;
  }

  /* ---- core POST helper for unauth endpoints. Surfaces the API's
          {"detail": "..."} message as a JS Error so the modal can
          show it verbatim ("Invalid credentials", "An account with
          this email already exists", etc.) ---- */
  async function postJSON(path, body) {
    let res;
    try {
      res = await fetch(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (networkErr) {
      // Render cold-start, no internet, CORS preflight failure, etc.
      // Give the user something actionable rather than a stack trace.
      throw new Error("Can't reach the WaveBase server. Check your connection and try again.");
    }
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      // FastAPI uses {"detail": "..."} for HTTPException. Validation
      // errors are {"detail": [{...}, ...]} — flatten to a readable
      // string in that case.
      let msg = data.detail || `Request failed (${res.status})`;
      if (Array.isArray(msg)) {
        msg = msg.map(e => (e.loc ? e.loc.slice(-1)[0] + ": " : "") + (e.msg || "invalid")).join("; ");
      }
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  /* ---- public auth actions ---- */
  async function signup({ email, password }) {
    const data = await postJSON("/users/", { email, password });
    return applyAuthResponse(data);
  }
  async function login({ email, password }) {
    const data = await postJSON("/users/login", { email, password });
    return applyAuthResponse(data);
  }
  function logout() {
    clearAuth();
    broadcast(null);
  }
  function isLoggedIn() {
    return !!getToken();
  }
  function currentUser() {
    return getCachedUser();
  }

  /* ---- authenticated fetch wrapper. Use for any call that needs
          the Authorization: Bearer header. On 401 it auto-logs out
          and dispatches auth-changed so the UI returns to the
          anon state without leaving stale "logged in" chrome. ---- */
  async function authFetch(path, options) {
    options = options || {};
    const token = getToken();
    if (!token) {
      const err = new Error("Not signed in");
      err.status = 401;
      throw err;
    }
    const headers = Object.assign({}, options.headers || {}, {
      "Authorization": `Bearer ${token}`,
    });
    const res = await fetch(`${API}${path}`, Object.assign({}, options, { headers }));
    if (res.status === 401) {
      // Token expired, revoked, or signed with a different secret
      // (e.g. JWT_SECRET_KEY rotated on the server). Either way the
      // local session is no longer usable.
      logout();
      const err = new Error("Your session expired. Please sign in again.");
      err.status = 401;
      throw err;
    }
    return res;
  }

  /* ---- fetch the latest user from the server. Call on page boot
          when a token is present so we render with fresh data and
          catch revoked tokens early. ---- */
  async function fetchMe() {
    const res = await authFetch("/users/me");
    if (!res.ok) {
      const err = new Error(`Failed to fetch profile (${res.status})`);
      err.status = res.status;
      throw err;
    }
    const user = await res.json();
    setCachedUser(user);
    broadcast(user);
    return user;
  }

  /* ---- partial profile update. Pass only the fields you want to
          change; backend uses exclude_unset so omitted fields stay
          untouched. Used by the Profile-stap form (full flush of
          all fields the user touched) and by per-field editors on
          the account page later. ---- */
  async function updateProfile(patch) {
    const res = await authFetch("/users/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch || {}),
    });
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      let msg = data.detail || `Profile update failed (${res.status})`;
      if (Array.isArray(msg)) {
        msg = msg.map(e => (e.loc ? e.loc.slice(-1)[0] + ": " : "") + (e.msg || "invalid")).join("; ");
      }
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    setCachedUser(data);
    broadcast(data);
    return data;
  }

  /* ---- boot-time: if we have a token, refresh user from server.
          Runs without awaiting so it doesn't block page render.
          Failures are silent (logout already happened inside
          authFetch on 401; other errors leave the cached user in
          place so the UI doesn't flicker on a transient outage). ---- */
  function bootRefresh() {
    if (!isLoggedIn()) return;
    fetchMe().catch(function () { /* silent — see comment above */ });
  }

  return {
    signup: signup,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    currentUser: currentUser,
    fetchMe: fetchMe,
    updateProfile: updateProfile,
    authFetch: authFetch,
    bootRefresh: bootRefresh,
  };
})();

// Kick a fresh /users/me on every page load when a token is present.
// Cheap (one GET), and makes sure revoked tokens are cleaned up
// without waiting for the user to do something that hits the API.
if (typeof window !== "undefined") {
  WaveBaseAuth.bootRefresh();
}

// Saved-spots two-way sync. We need both the user being signed in
// AND the API id maps from api-client.js to be ready. Either event
// firing triggers the sync function, which guards on the other.
// Net effect:
//   - Fresh page load while logged in        -> data-ready triggers it
//   - User logs in on an already-loaded page -> auth-changed triggers it
//   - Logout                                 -> auth-changed sees no
//                                                token, returns silently
if (typeof window !== "undefined") {
  window.addEventListener("wavebase:data-ready",   function () { WaveBaseAccount.syncSavedFromServer(); });
  window.addEventListener("wavebase:auth-changed", function () { WaveBaseAccount.syncSavedFromServer(); });
}

/* One-shot profile backfill from localStorage to server. Runs after
   auth-changed fires (which happens once after bootRefresh's
   /users/me lands). Compares each tracked field: if the server has
   nothing (null / "" / []) AND localStorage has something, we push
   the local value up via PATCH /users/me/profile.

   Designed to catch up users who had their profile saved locally
   before some fields were tracked server-side — Lode's exact case
   after we added discipline, travel_styles, trip_priorities and
   how_did_you_find_us in v=331.

   Never overwrites server data: if the server already has a value
   for a field, we leave it alone. That makes this safe to run on
   every page load — at worst it's a no-op. */
function _backfillProfileFromLocalToServer() {
  if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
  if (typeof WaveBaseAccount === "undefined") return;
  const serverUser = WaveBaseAuth.currentUser();
  if (!serverUser) return;  // bootRefresh hasn't landed yet
  const local = WaveBaseAccount.getProfile();
  if (!local) return;

  const SURF_LEVEL_MAP = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
  const patch = {};

  function pushScalar(serverKey, localKey, transform) {
    const sv = serverUser[serverKey];
    if (sv !== null && sv !== undefined && sv !== "") return;  // server has it
    const lv = local[localKey];
    if (lv === null || lv === undefined || lv === "") return;  // local empty
    const out = transform ? transform(lv) : lv;
    if (out !== null && out !== undefined && out !== "") patch[serverKey] = out;
  }
  function pushList(serverKey, localKey) {
    const sv = serverUser[serverKey];
    if (Array.isArray(sv) && sv.length > 0) return;
    const lv = local[localKey];
    if (!Array.isArray(lv) || lv.length === 0) return;
    patch[serverKey] = lv;
  }

  pushScalar("name", "name");
  pushScalar("birth_year", "birthYear", function (v) {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  });
  pushScalar("home_country", "homeCountry");
  pushList  ("surf_types", "surfType");
  pushScalar("surf_level", "level", function (v) { return SURF_LEVEL_MAP[v] || null; });
  pushList  ("discipline", "discipline");
  pushList  ("travel_styles", "travelStyles");
  pushList  ("trip_priorities", "tripPriorities");
  pushScalar("how_did_you_find_us", "howDidYouFindUs");

  if (Object.keys(patch).length === 0) return;  // nothing to do

  WaveBaseAuth.updateProfile(patch)
    .then(function () {
      console.log("[account] Backfilled local profile -> server:", Object.keys(patch).join(", "));
    })
    .catch(function (e) {
      console.warn("[account] Profile backfill failed:", e.message || e);
    });
}

// Trigger backfill once per auth-changed firing — happens after
// bootRefresh's /users/me lands (with cached user populated) and
// after a successful login/signup. Skipped on logout (no user) by
// the guard inside the function.
if (typeof window !== "undefined") {
  window.addEventListener("wavebase:auth-changed", _backfillProfileFromLocalToServer);
}


/* ============================================================
   WaveBaseAuthModal — the login/signup popup.

   One DOM node, lazily injected into <body> on the first .open()
   call and re-used for every subsequent open. Two modes ("login"
   and "signup") share the same form fields; only the labels +
   submit button text + auth call change.

   Wired up by initAuthNav() below, which:
     - rewrites the header "My WaveBase" link to "Login" when the
       user isn't signed in;
     - intercepts the click in that state to open the modal instead
       of navigating to account.html (which would look broken when
       there's no account to view);
     - re-renders the nav when the auth state changes.
   ============================================================ */
const WaveBaseAuthModal = (function () {
  let rootEl = null;     // backdrop element, contains the card
  let cardEl = null;
  let formEl = null;
  let titleEl = null;
  let subtitleEl = null;
  let errorEl = null;
  let submitEl = null;
  let footerPromptEl = null;
  let footerToggleEl = null;
  let emailEl = null;
  let passwordEl = null;
  let tabsEl = null;
  let mode = "login";    // "login" | "signup"
  let onSuccess = null;  // optional callback fired after a successful auth

  /* Build the DOM once. Re-opens just toggle visibility + reset
     state, so focus stays inside an element the browser already
     knows about. */
  function build() {
    if (rootEl) return;

    rootEl = document.createElement("div");
    rootEl.className = "auth-modal-backdrop";
    rootEl.setAttribute("hidden", "");
    rootEl.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button type="button" class="auth-modal-close" aria-label="Close">&times;</button>

        <div class="auth-modal-tabs" role="tablist">
          <button type="button" class="auth-tab is-active" data-mode="login"  role="tab">Sign in</button>
          <button type="button" class="auth-tab"            data-mode="signup" role="tab">Create account</button>
        </div>

        <form class="auth-form" novalidate>
          <h2 class="auth-title"    id="auth-modal-title">Sign in to WaveBase</h2>
          <p  class="auth-subtitle">Save spots, plan trips, take your list with you.</p>

          <label class="auth-field">
            <span>Email</span>
            <input type="email" name="email" required autocomplete="email" inputmode="email" autocapitalize="none" />
          </label>

          <label class="auth-field">
            <span>Password</span>
            <input type="password" name="password" required minlength="6" autocomplete="current-password" />
          </label>

          <div class="auth-error" hidden></div>

          <button type="submit" class="auth-submit">Sign in</button>

          <p class="auth-footer">
            <span class="auth-toggle-prompt">Don&rsquo;t have an account?</span>
            <button type="button" class="auth-toggle-btn">Create one</button>
          </p>

          <p class="auth-fineprint">
            By creating an account you agree to our
            <a href="legal.html" target="_blank" rel="noopener">terms</a> and
            <a href="privacy.html" target="_blank" rel="noopener">privacy</a>.
            We store your email + a hashed password. We never sell it. You can delete the account any time.
          </p>
        </form>
      </div>
    `;

    document.body.appendChild(rootEl);

    cardEl          = rootEl.querySelector(".auth-modal");
    formEl          = rootEl.querySelector(".auth-form");
    titleEl         = rootEl.querySelector(".auth-title");
    subtitleEl      = rootEl.querySelector(".auth-subtitle");
    errorEl         = rootEl.querySelector(".auth-error");
    submitEl        = rootEl.querySelector(".auth-submit");
    footerPromptEl  = rootEl.querySelector(".auth-toggle-prompt");
    footerToggleEl  = rootEl.querySelector(".auth-toggle-btn");
    emailEl         = rootEl.querySelector('input[name="email"]');
    passwordEl      = rootEl.querySelector('input[name="password"]');
    tabsEl          = rootEl.querySelector(".auth-modal-tabs");

    // Close: X button, backdrop click, Escape key.
    rootEl.querySelector(".auth-modal-close").addEventListener("click", close);
    rootEl.addEventListener("click", function (ev) {
      if (ev.target === rootEl) close(); // clicked the backdrop, not the card
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && !rootEl.hasAttribute("hidden")) close();
    });

    // Tab + footer toggles between login / signup.
    tabsEl.addEventListener("click", function (ev) {
      const btn = ev.target.closest(".auth-tab");
      if (!btn) return;
      setMode(btn.dataset.mode);
    });
    footerToggleEl.addEventListener("click", function () {
      setMode(mode === "login" ? "signup" : "login");
    });

    // Submit handler.
    formEl.addEventListener("submit", onSubmit);
  }

  function setMode(next) {
    mode = next;
    // Tab visual state
    tabsEl.querySelectorAll(".auth-tab").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.mode === mode);
      b.setAttribute("aria-selected", b.dataset.mode === mode ? "true" : "false");
    });
    if (mode === "login") {
      titleEl.textContent     = "Sign in to WaveBase";
      subtitleEl.textContent  = "Save spots, plan trips, take your list with you.";
      passwordEl.setAttribute("autocomplete", "current-password");
      submitEl.textContent    = "Sign in";
      footerPromptEl.textContent = "Don’t have an account?";
      footerToggleEl.textContent = "Create one";
    } else {
      titleEl.textContent     = "Create your WaveBase account";
      subtitleEl.textContent  = "Just email and a password — that’s it. You can add your profile in the next step (or skip it).";
      passwordEl.setAttribute("autocomplete", "new-password");
      submitEl.textContent    = "Create account";
      footerPromptEl.textContent = "Already have an account?";
      footerToggleEl.textContent = "Sign in";
    }
    clearError();
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.removeAttribute("hidden");
  }
  function clearError() {
    errorEl.textContent = "";
    errorEl.setAttribute("hidden", "");
  }
  function setBusy(busy) {
    submitEl.disabled = busy;
    emailEl.disabled    = busy;
    passwordEl.disabled = busy;
    submitEl.textContent = busy
      ? (mode === "login" ? "Signing in…" : "Creating account…")
      : (mode === "login" ? "Sign in" : "Create account");
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    clearError();

    const email    = (emailEl.value    || "").trim();
    const password = (passwordEl.value || "");

    // Cheap client-side checks so we don't waste an API round-trip
    // on obviously-broken input. The server validates again.
    if (!email || email.indexOf("@") === -1) {
      showError("Please enter a valid email address.");
      emailEl.focus();
      return;
    }
    if (password.length < 6) {
      showError("Password should be at least 6 characters.");
      passwordEl.focus();
      return;
    }

    setBusy(true);
    try {
      const user = (mode === "login")
        ? await WaveBaseAuth.login({ email: email, password: password })
        : await WaveBaseAuth.signup({ email: email, password: password });
      // Success — close the modal and hand the user object to whoever
      // opened the modal (e.g. so signup can route into the Profile
      // step). If no callback was supplied, default to:
      //   - signup → account.html?onboarding=1 (Profile-stap with Skip)
      //   - login  → account.html              (their existing account)
      close();
      if (typeof onSuccess === "function") {
        try { onSuccess(user, mode); } catch (e) { console.error(e); }
      } else {
        const dest = (mode === "signup")
          ? "account.html?onboarding=1"
          : "account.html";
        // Only navigate if we're not already on the destination page.
        // Avoids a full reload when the user opens the modal from the
        // account page itself (e.g. via a "Sign in" prompt rendered
        // there for anon visitors).
        if (window.location.pathname.split("/").pop() !== "account.html"
            || mode === "signup") {
          window.location.href = dest;
        } else {
          // Already on account.html and logging in — just refresh in
          // place so the page picks up the new auth state.
          window.location.reload();
        }
      }
    } catch (e) {
      showError(e.message || "Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    setBusy(false);
  }

  function open(opts) {
    opts = opts || {};
    build();
    setMode(opts.mode || "login");
    onSuccess = opts.onSuccess || null;
    emailEl.value = "";
    passwordEl.value = "";
    clearError();
    rootEl.removeAttribute("hidden");
    // Lock background scroll while modal is up
    document.documentElement.style.overflow = "hidden";
    // Give the email field focus next tick so iOS picks it up
    setTimeout(function () { emailEl.focus(); }, 30);
  }

  function close() {
    if (!rootEl) return;
    rootEl.setAttribute("hidden", "");
    document.documentElement.style.overflow = "";
    onSuccess = null;
  }

  return { open: open, close: close };
})();


/* ============================================================
   Auth-aware header nav.

   Rewrites the existing #nav-account link to reflect auth state,
   and intercepts the click for anon users so they get the login
   modal instead of landing on the (currently empty for them)
   account page.

   Idempotent — runs on DOMContentLoaded once per page load and
   then re-runs whenever WaveBaseAuth dispatches auth-changed.
   ============================================================ */
function _renderAuthNav() {
  const link = document.getElementById("nav-account");
  if (!link) return;

  const user = WaveBaseAuth.currentUser();
  if (WaveBaseAuth.isLoggedIn()) {
    // Show the user's name (or just first part of email) so the nav
    // confirms "yes, you're signed in as ...". Falls back to a
    // generic label if both are missing for any reason.
    let label = "My WaveBase";
    if (user && user.name)  label = user.name.split(/\s+/)[0];
    else if (user && user.email) label = user.email.split("@")[0];
    link.textContent = label;
    link.setAttribute("href", "account.html");
    link.removeAttribute("data-anon");
  } else {
    link.textContent = "Login";
    // Keep href as account.html for graceful no-JS fallback, but
    // intercept the click below to open the modal.
    link.setAttribute("href", "account.html");
    link.setAttribute("data-anon", "1");
  }
}

function initAuthNav() {
  const link = document.getElementById("nav-account");
  if (!link) return;

  _renderAuthNav();

  // Intercept clicks: open modal instead of navigating when anon.
  // No onSuccess override needed — the modal's default behaviour
  // routes login -> account.html and signup -> account.html?onboarding=1,
  // which is exactly what we want here.
  link.addEventListener("click", function (ev) {
    if (link.getAttribute("data-anon") === "1") {
      ev.preventDefault();
      WaveBaseAuthModal.open({ mode: "login" });
    }
  });

  // Re-render when auth state changes (login / logout / profile update).
  window.addEventListener("wavebase:auth-changed", _renderAuthNav);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthNav);
  } else {
    initAuthNav();
  }
}
