/* SurfGoose — fake account.
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

  /* Same shape as _syncSpotToServer but for the surfed-log endpoint.
     Surfed stores slugs directly server-side (no UUID translation
     needed) so this is even simpler. */
  function _syncSurfedToServer(slug, action) {
    try {
      if (typeof WaveBaseAuth === "undefined") return;
      if (!WaveBaseAuth.isLoggedIn()) return;
      const method = (action === "add") ? "POST" : "DELETE";
      WaveBaseAuth.authFetch(
        "/users/me/surfed/" + encodeURIComponent(slug),
        { method: method }
      ).catch(function (e) {
        console.warn("[account] surfed " + method + " " + slug + " failed:", e.message || e);
      });
    } catch (e) { /* swallow */ }
  }

  /* Trip server sync — debounced PUT of the whole trip after any
     mutation. We coalesce rapid edits (typing a day-note, dragging
     to reorder stops) into one request per trip per 1.5s window.
     If the trip has no serverId yet (created while signed out, or
     before this feature shipped), the first sync POSTs to create
     and records the assigned id on the local trip for future PUTs. */
  const _tripSyncTimers = new Map();

  function _scheduleTripSync(tripId) {
    if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
    if (_tripSyncTimers.has(tripId)) {
      clearTimeout(_tripSyncTimers.get(tripId));
    }
    _tripSyncTimers.set(tripId, setTimeout(function () {
      _tripSyncTimers.delete(tripId);
      _doTripSync(tripId);
    }, 1500));
  }

  async function _doTripSync(tripId) {
    if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
    const s = state();
    const trip = s.trips.find(function (t) { return t.id === tripId; });
    if (!trip) return;  // deleted locally before the timer fired

    const body = {
      name:      (trip.name || "Trip").trim() || "Trip",
      spot_ids:  trip.spotIds  || [],
      dates:     trip.dates    || {},
      day_notes: trip.dayNotes || {},
      // Pass state through on every sync. On routine debounced auto-
      // saves this just reaffirms the current state — no flip. The
      // backend's PUT ignores invalid values, so this is safe even
      // if a future trip somehow has an unrecognised state.
      state:     trip.state === "saved" ? "saved" : "draft",
    };

    try {
      if (trip.serverId) {
        // PUT existing trip — full replace of mutable fields.
        const res = await WaveBaseAuth.authFetch(
          "/users/me/trips/" + encodeURIComponent(trip.serverId),
          { method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body) }
        );
        if (res.status === 404) {
          // Server lost it (manual delete, account reset). Recreate
          // by clearing serverId and re-syncing as POST.
          const fresh = state();
          const t2 = fresh.trips.find(function (t) { return t.id === tripId; });
          if (t2) { delete t2.serverId; write(fresh); }
          _scheduleTripSync(tripId);
        }
      } else {
        // POST new trip — server assigns a UUID, we record it
        // locally so subsequent edits hit PUT.
        const res = await WaveBaseAuth.authFetch(
          "/users/me/trips/",
          { method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body) }
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        const created = await res.json();
        // Re-read state — the user might have mutated more in the
        // few ms while we awaited. Stamp serverId on the same trip.
        const fresh = state();
        const t2 = fresh.trips.find(function (t) { return t.id === tripId; });
        if (t2) { t2.serverId = created.id; write(fresh); }
      }
    } catch (e) {
      console.warn("[account] trip sync " + tripId + " failed:", e.message || e);
    }
  }

  function _syncTripDelete(serverId) {
    if (!serverId) return;
    if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
    WaveBaseAuth.authFetch(
      "/users/me/trips/" + encodeURIComponent(serverId),
      { method: "DELETE" }
    ).catch(function (e) {
      console.warn("[account] trip delete " + serverId + " failed:", e.message || e);
    });
  }

  /* Review sync helpers — same shape as the trip helpers above:
     local id is "r" + timestamp + random; serverId is stamped on the
     local record after the first POST succeeds; subsequent edits use
     it. (Reviews aren't editable in v1 — only delete — but we keep
     the serverId for the delete-DELETE call.) */
  function _syncReviewCreate(localReview) {
    if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
    const body = {
      entry_id:      localReview.entryId,
      entry_type:    localReview.entryType || "spot",
      stars:         localReview.stars,
      year_visited:  localReview.yearVisited || null,
      month_visited: localReview.monthVisited || null,
      matches:       localReview.matches || null,
      text:          localReview.text || "",
      name:          localReview.name || null,
      details:       localReview.details || {},
    };
    WaveBaseAuth.authFetch("/reviews/", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (created) {
        if (!created) return;
        const fresh = state();
        const r = fresh.reviews.find(function (x) { return x.id === localReview.id; });
        if (r) { r.serverId = created.id; write(fresh); }
      })
      .catch(function (e) {
        console.warn("[account] review POST failed:", e.message || e);
      });
  }
  function _syncReviewDelete(serverId) {
    if (!serverId) return;
    if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
    WaveBaseAuth.authFetch(
      "/reviews/" + encodeURIComponent(serverId),
      { method: "DELETE" }
    ).catch(function (e) {
      console.warn("[account] review delete " + serverId + " failed:", e.message || e);
    });
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
        // serverId is set after the trip first syncs to /users/me/trips/.
        // Absent for trips the user created while signed out (they
        // get backfilled on the next syncTripsFromServer pass) or
        // before this feature shipped.
        serverId: t.serverId || undefined,
        name: t.name,
        spotIds: Array.isArray(t.spotIds) ? t.spotIds : [],
        dates: (t.dates && typeof t.dates === "object") ? t.dates : {},
        dayNotes: (t.dayNotes && typeof t.dayNotes === "object") ? t.dayNotes : {},
        // "draft" while editing; "saved" after the user clicks Save
        // trip — flips the renderer into the compact overview.
        // Legacy trips with no state default to "draft" so the user
        // gets one Save-trip tap to opt in to the new layout.
        state: t.state === "saved" ? "saved" : "draft",
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
      const nowSurfed = (i === -1);
      if (nowSurfed) s.surfed.push(id); else s.surfed.splice(i, 1);
      write(s);
      _syncSurfedToServer(id, nowSurfed ? "add" : "remove");
      return nowSurfed;
    },
    async syncSurfedFromServer() {
      if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
      let serverList;
      try {
        const res = await WaveBaseAuth.authFetch("/users/me/surfed/");
        if (!res.ok) return;
        serverList = await res.json();
      } catch (e) {
        console.warn("[account] syncSurfedFromServer failed:", e.message || e);
        return;
      }
      if (!Array.isArray(serverList)) return;
      // Server returns [{spot_id: slug}, ...]; surfed stores slugs
      // directly so no UUID translation needed.
      const serverSlugs = serverList.map(function (x) { return x.spot_id; }).filter(Boolean);
      const s = state();
      const localSet  = new Set(s.surfed);
      const serverSet = new Set(serverSlugs);
      let changed = false;
      // Pull server-only into local.
      for (const sid of serverSlugs) {
        if (!localSet.has(sid)) { s.surfed.push(sid); changed = true; }
      }
      // Push local-only up (post-signup migration + offline catch-up).
      for (const lid of Array.from(localSet)) {
        if (!serverSet.has(lid)) _syncSurfedToServer(lid, "add");
      }
      if (changed) {
        write(s);
        try { window.dispatchEvent(new CustomEvent("wavebase:surfed-changed")); } catch (e) {}
      }
    },

    /* trips */
    getTrips() { return state().trips; },
    addTrip(name) {
      const s = state();
      // New trips start in "draft" — the renderer shows the full
      // edit UI until the user clicks Save trip.
      const trip = { id: "t" + Date.now(), name: (name || "New trip").trim(), spotIds: [], dates: {}, state: "draft" };
      s.trips.push(trip);
      write(s);
      _scheduleTripSync(trip.id);  // POST on first sync, records serverId
      return trip;
    },
    deleteTrip(tripId) {
      const s = state();
      const trip = s.trips.find(t => t.id === tripId);
      const serverId = trip && trip.serverId;
      s.trips = s.trips.filter(t => t.id !== tripId);
      write(s);
      // Cancel any pending sync for this trip — pointless to PUT
      // something we're about to delete.
      if (_tripSyncTimers.has(tripId)) {
        clearTimeout(_tripSyncTimers.get(tripId));
        _tripSyncTimers.delete(tripId);
      }
      if (serverId) _syncTripDelete(serverId);
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
      _scheduleTripSync(tripId);
    },
    /* Flip a trip between "draft" (full edit UI) and "saved" (compact
       overview). Renderer reads .state to choose the layout. Fires
       wavebase:trips-changed so the account page re-renders without
       a full route reload. */
    setTripState(tripId, nextState) {
      if (nextState !== "draft" && nextState !== "saved") return;
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (!t || t.state === nextState) return;
      t.state = nextState;
      write(s);
      _scheduleTripSync(tripId);
      try { window.dispatchEvent(new CustomEvent("wavebase:trips-changed")); } catch (e) {}
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
      _scheduleTripSync(tripId);
    },
    removeFromTrip(tripId, spotId) {
      const s = state();
      const t = s.trips.find(x => x.id === tripId);
      if (t) {
        t.spotIds = t.spotIds.filter(id => id !== spotId);
        if (t.dates) delete t.dates[spotId];
      }
      write(s);
      _scheduleTripSync(tripId);
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
      _scheduleTripSync(tripId);
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
      _scheduleTripSync(tripId);
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
      _scheduleTripSync(tripId);
    },

    /* Force every pending debounced trip-sync to fire NOW. Called
       by the explicit "Save trips" button on the account page —
       user-testing showed people want a button to click for peace
       of mind even when auto-save is already running. Returns when
       all syncs have settled, so the caller can show "Saved" without
       lying. */
    async flushTripSyncs() {
      if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
      const s = state();
      // Cancel pending debounce timers — we'll fire each sync
      // synchronously below.
      for (const tid of Array.from(_tripSyncTimers.keys())) {
        clearTimeout(_tripSyncTimers.get(tid));
        _tripSyncTimers.delete(tid);
      }
      // Fire all in parallel. _doTripSync handles its own errors;
      // we await Promise.all so the caller knows when the last one
      // settled. Empty / missing serverId trips get POSTed; others
      // get PUT.
      await Promise.all(s.trips.map(t => _doTripSync(t.id)));
    },
    /* Pull server trips into local + push local trips without
       serverId up. Runs on data-ready and auth-changed, same as the
       saved-spots/surfed equivalents. */
    async syncTripsFromServer() {
      if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
      let serverList;
      try {
        const res = await WaveBaseAuth.authFetch("/users/me/trips/");
        if (!res.ok) return;
        serverList = await res.json();
      } catch (e) {
        console.warn("[account] syncTripsFromServer failed:", e.message || e);
        return;
      }
      if (!Array.isArray(serverList)) return;

      const s = state();
      const localByServerId = new Map();
      s.trips.forEach(function (t) {
        if (t.serverId) localByServerId.set(t.serverId, t);
      });

      let changed = false;
      // Pull server-only trips into local. Generate a fresh local id
      // (so URLs / collapsed-state keys stay unique even if two
      // server trips share the same name).
      for (const st of serverList) {
        if (!localByServerId.has(st.id)) {
          s.trips.push({
            id:       "t" + Date.now() + Math.floor(Math.random() * 1000),
            serverId: st.id,
            name:     st.name,
            spotIds:  st.spot_ids  || [],
            dates:    st.dates     || {},
            dayNotes: st.day_notes || {},
            state:    st.state === "saved" ? "saved" : "draft",
          });
          changed = true;
        } else {
          // Already have this trip locally — pull through any server-
          // side state change (e.g. user clicked Save on another device).
          const local = localByServerId.get(st.id);
          const serverState = st.state === "saved" ? "saved" : "draft";
          if (local.state !== serverState) {
            local.state = serverState;
            changed = true;
          }
        }
      }
      // Push local-only trips (no serverId) up. Debounced via the
      // scheduler — they'll POST 1.5s after this returns.
      s.trips.forEach(function (t) {
        if (!t.serverId) _scheduleTripSync(t.id);
      });

      if (changed) {
        write(s);
        try { window.dispatchEvent(new CustomEvent("wavebase:trips-changed")); } catch (e) {}
      }
    },

    /* reviews — submitted via the form on spot/center/stay pages.
       Stored locally for the My-reviews block on the account page;
       also POSTed to the server when the user is signed in so other
       visitors see them on the entry page as social proof.

       Anon submissions stay local-only until the user signs in;
       on auth-changed, _backfillReviewsToServer pushes them up. */
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
      // Fire-and-forget POST to server. _syncReviewCreate stamps
      // serverId on the local entry once the round-trip lands.
      _syncReviewCreate(entry);
      return entry;
    },
    deleteReview(reviewId) {
      const s = state();
      const review = s.reviews.find(r => r.id === reviewId);
      const serverId = review && review.serverId;
      s.reviews = s.reviews.filter(r => r.id !== reviewId);
      write(s);
      if (serverId) _syncReviewDelete(serverId);
    },
    /* Edit an existing review in place. Updates the local copy
       (used by the My-reviews block) AND PUTs to the server if the
       review has been synced. Returns the updated local record. */
    updateReview(reviewId, fields) {
      const s = state();
      const r = s.reviews.find(x => x.id === reviewId);
      if (!r) return null;
      const updated = Object.assign({}, r, {
        stars:        Number(fields.stars) || 0,
        yearVisited:  Number(fields.yearVisited) || null,
        monthVisited: Number(fields.monthVisited) || null,
        matches:      fields.matches || "",
        text:         (fields.text || "").trim(),
        name:         (fields.name || "").trim(),
        details:      (fields.details && typeof fields.details === "object") ? fields.details : {},
        when:         new Date().toISOString(),
      });
      Object.assign(r, updated);
      write(s);
      // Server PUT if we have a serverId — otherwise the next sync
      // will pick the new values up via a POST.
      if (r.serverId && typeof WaveBaseAuth !== "undefined" && WaveBaseAuth.isLoggedIn()) {
        const body = {
          entry_id:      r.entryId,
          entry_type:    r.entryType || "spot",
          stars:         r.stars,
          year_visited:  r.yearVisited || null,
          month_visited: r.monthVisited || null,
          matches:       r.matches || null,
          text:          r.text || "",
          name:          r.name || null,
          details:       r.details || {},
        };
        WaveBaseAuth.authFetch(
          "/reviews/" + encodeURIComponent(r.serverId),
          { method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body) }
        ).catch(function (e) {
          console.warn("[account] review PUT failed:", e.message || e);
        });
      }
      return r;
    },

    /* Pull the signed-in user's own reviews from the server and
       merge into local. Server is source-of-truth for reviews that
       already have a serverId; local-only reviews (no serverId) get
       pushed up so anon submissions survive the eventual login. */
    async syncReviewsFromServer() {
      if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
      let serverList;
      try {
        const res = await WaveBaseAuth.authFetch("/users/me/reviews/");
        if (!res.ok) return;
        serverList = await res.json();
      } catch (e) {
        console.warn("[account] syncReviewsFromServer failed:", e.message || e);
        return;
      }
      if (!Array.isArray(serverList)) return;

      const s = state();
      const localByServerId = new Map();
      s.reviews.forEach(function (r) {
        if (r.serverId) localByServerId.set(r.serverId, r);
      });

      let changed = false;

      // Pull server-only reviews into local (covers cross-device: a
      // review left on phone shows up on laptop).
      for (const sr of serverList) {
        if (!localByServerId.has(sr.id)) {
          s.reviews.unshift({
            id:             "r" + Date.now() + Math.floor(Math.random() * 1000),
            serverId:       sr.id,
            entryId:        sr.entry_id,
            entryType:      sr.entry_type || "spot",
            stars:          sr.stars,
            yearVisited:    sr.year_visited || null,
            monthVisited:   sr.month_visited || null,
            matches:        sr.matches || "",
            text:           sr.text || "",
            name:           sr.name || "",
            details:        sr.details || {},
            when:           sr.created_at || new Date().toISOString(),
            // Analyzed-by-admin marker — used by My-reviews block on
            // the account page to render a "Used in our write-up"
            // badge so the author can see their input was folded into
            // our write-up.
            analyzedAt:     sr.analyzed_at  || null,
            analyzedNote:   sr.analyzed_note || null,
            analyzedByName: sr.analyzed_by_name || null,
          });
          changed = true;
        } else {
          // Already have this review locally — keep analyzed_* in
          // sync so the badge appears/disappears across devices when
          // we mark/unmark on admin.
          const local = localByServerId.get(sr.id);
          if (local.analyzedAt   !== (sr.analyzed_at      || null) ||
              local.analyzedNote !== (sr.analyzed_note    || null) ||
              local.analyzedByName !== (sr.analyzed_by_name || null)) {
            local.analyzedAt     = sr.analyzed_at      || null;
            local.analyzedNote   = sr.analyzed_note    || null;
            local.analyzedByName = sr.analyzed_by_name || null;
            changed = true;
          }
        }
      }
      // Push local-only reviews up (anon submissions made before
      // login, or saves that failed to sync due to network).
      s.reviews.forEach(function (r) {
        if (!r.serverId) _syncReviewCreate(r);
      });

      if (changed) {
        write(s);
        try { window.dispatchEvent(new CustomEvent("wavebase:reviews-changed")); } catch (e) {}
      }
    },

    /* Wipe every WaveBaseAccount localStorage key. Called from
       WaveBaseAuth.logout() + WaveBaseAuth.deleteAccount() so a
       signed-out session starts clean: no leftover filled hearts
       on cards (the old saved-list belonged to whoever WAS signed
       in), no phantom trips, no compare badge from a previous user.
       Data isn't lost — when the user signs back in, syncSaved-
       FromServer + syncSurfedFromServer + syncTripsFromServer pull
       it all back from the server's source-of-truth copy. */
    clearLocalData() {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      // Also cancel any in-flight debounced trip syncs — pointless to
      // PUT a trip whose local body we just deleted (we'd recreate
      // it server-side).
      try {
        if (typeof _tripSyncTimers !== "undefined") {
          _tripSyncTimers.forEach(function (id) { clearTimeout(id); });
          _tripSyncTimers.clear();
        }
      } catch (e) {}
    },
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
      throw new Error("Can't reach the SurfGoose server. Check your connection and try again.");
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
    // Wipe local account-data too — the saved/surfed/compare/trips
    // in localStorage belonged to the user who's now signed out.
    // Leaving them lets stale "filled hearts" leak into the signed-
    // out UI, plus a returning user would see another person's
    // pretend-data on a shared device. Lossless: when the user
    // signs back in, syncFromServer restores everything from the
    // server copy.
    try { WaveBaseAccount.clearLocalData(); } catch (e) {}
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

  /* ---- permanent account delete. Hits DELETE /users/me (which
          cascades the user record + saved-spots server-side), then
          wipes the local token + cached user so the UI returns to
          the anon state. Throws on server failure — caller is
          expected to keep the user on the page and show the error
          so they can retry. ---- */
  async function deleteAccount() {
    const res = await authFetch("/users/me", { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
      let detail = "";
      try { detail = (await res.json()).detail || ""; } catch (e) {}
      const err = new Error(detail || ("Account delete failed (" + res.status + ")"));
      err.status = res.status;
      throw err;
    }
    // Wipe local auth state + account data. We don't go via
    // logout() so the timing of the broadcast stays under our
    // control (the caller may want to redirect first to avoid a
    // brief flash of the anon-gate). The account record + saved/
    // surfed/trips were just deleted server-side, so wiping local
    // is the consistent move.
    clearAuth();
    try { WaveBaseAccount.clearLocalData(); } catch (e) {}
    broadcast(null);
  }

  return {
    signup: signup,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    currentUser: currentUser,
    fetchMe: fetchMe,
    updateProfile: updateProfile,
    deleteAccount: deleteAccount,
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
  // Saved spots — needs the slug↔UUID id maps (data-ready).
  window.addEventListener("wavebase:data-ready",   function () { WaveBaseAccount.syncSavedFromServer(); });
  window.addEventListener("wavebase:auth-changed", function () { WaveBaseAccount.syncSavedFromServer(); });
  // Surfed — stores slugs directly, so no id-map dependency. Still
  // bound to data-ready so we don't fetch before the user is likely
  // to interact with the result.
  window.addEventListener("wavebase:data-ready",   function () { WaveBaseAccount.syncSurfedFromServer(); });
  window.addEventListener("wavebase:auth-changed", function () { WaveBaseAccount.syncSurfedFromServer(); });
  // Trips — no id-map dependency either; same trigger pattern.
  window.addEventListener("wavebase:data-ready",   function () { WaveBaseAccount.syncTripsFromServer(); });
  window.addEventListener("wavebase:auth-changed", function () { WaveBaseAccount.syncTripsFromServer(); });
  // Reviews — same pattern. Stores entry_id as a slug (no UUID map
  // needed), but bound to data-ready so the eventual re-render finds
  // entries in WAVEBASE_DATA when resolving names.
  window.addEventListener("wavebase:data-ready",   function () { WaveBaseAccount.syncReviewsFromServer(); });
  window.addEventListener("wavebase:auth-changed", function () { WaveBaseAccount.syncReviewsFromServer(); });
}

/* Pull the server profile down into local on every auth-changed.
   Required because logout's clearLocalData() wipes the local
   profile too — without this hydration, the next login lands the
   user on an empty form even though the server still holds their
   answers. Server is the source of truth when both have data;
   local-only fields survive (the backfill below pushes them up).

   Translates the server's snake_case + capitalised-enum shape
   back to local's camelCase + lowercase. */
function _hydrateLocalProfileFromServer() {
  if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
  if (typeof WaveBaseAccount === "undefined") return;
  const serverUser = WaveBaseAuth.currentUser();
  if (!serverUser) return;
  const local = WaveBaseAccount.getProfile() || {};

  const SURF_LEVEL_REVERSE = { Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced" };
  function _pickScalar(serverVal, localVal) {
    if (serverVal !== null && serverVal !== undefined && serverVal !== "") return serverVal;
    return localVal;
  }
  function _pickList(serverArr, localArr) {
    if (Array.isArray(serverArr) && serverArr.length > 0) return serverArr;
    return Array.isArray(localArr) ? localArr : [];
  }

  const merged = Object.assign({}, local, {
    name:            _pickScalar(serverUser.name,           local.name)            || "",
    email:           _pickScalar(serverUser.email,          local.email)           || "",
    birthYear:       _pickScalar(serverUser.birth_year,     local.birthYear)       || "",
    homeCountry:     _pickScalar(serverUser.home_country,   local.homeCountry)     || "",
    surfType:        _pickList  (serverUser.surf_types,     local.surfType),
    level:           _pickScalar(
                       SURF_LEVEL_REVERSE[serverUser.surf_level] || null,
                       local.level
                     ) || "",
    discipline:      _pickList  (serverUser.discipline,     local.discipline),
    travelStyles:    _pickList  (serverUser.travel_styles,  local.travelStyles),
    tripPriorities: _pickList  (serverUser.trip_priorities, local.tripPriorities),
    howDidYouFindUs: _pickScalar(serverUser.how_did_you_find_us, local.howDidYouFindUs) || "",
  });
  WaveBaseAccount.setProfile(merged);

  // Tell whoever's listening that the profile just got refreshed.
  // Same shape as the saved/surfed/trips change events so the
  // re-render listener in app.js can treat them uniformly.
  // Without this dispatch, an account.html page that already
  // rendered with an empty profile (because hydrate hadn't fired
  // yet) stays empty until the user manually reloads.
  try {
    window.dispatchEvent(new CustomEvent("wavebase:profile-changed"));
  } catch (e) {}
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
  // Order matters: hydrate FIRST (pull server profile down into
  // local), THEN backfill (push remaining local-only fields up).
  // If we ran backfill first, an empty local profile would do
  // nothing — and the user would stare at an empty form even
  // though their data is sitting on the server.
  window.addEventListener("wavebase:auth-changed", _hydrateLocalProfileFromServer);
  window.addEventListener("wavebase:auth-changed", _backfillProfileFromLocalToServer);
}


/* ============================================================
   WaveBaseTracking — 1st-party event tracker.

   POSTs to /events/ for the high-value signals (affiliate clicks,
   pageviews, signup-funnel steps, search queries). Anon-friendly:
   no JWT, server records the event without a user_id. Signed-in
   events carry the JWT; the server attaches user_id automatically.

   Three reasons an event might be silently dropped:
     1. User rejected analytics in the cookie banner.
     2. Signed-in user is in the admin allowlist (Lode / Michiel)
        — keeps our own testing out of the dataset. Server enforces
        the same rule as defence in depth.
     3. WaveBaseAuth/Account unavailable (would only happen pre-
        bootstrap; events get dropped silently rather than racing).
   ============================================================ */
const WaveBaseTracking = (function () {
  const API = (typeof WAVEBASE_API !== "undefined")
    ? WAVEBASE_API
    : "https://wavebase-api-qqwt.onrender.com";

  // Mirror of admin.js's allowlist. Kept duplicated rather than
  // imported because account.js loads before admin.js, and we want
  // the check to work on pages that don't load admin.js at all.
  // Add new admin emails to BOTH places if/when needed.
  const ADMIN_EMAILS_LC = ["lode.b162@gmail.com", "michiel.decooman@gmail.com"];

  const SESSION_KEY = "wavebase_session_id";

  function _sessionId() {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        // crypto.randomUUID exists in all modern browsers (2022+);
        // fallback to a Math.random-based id for ancient ones rather
        // than blocking tracking entirely.
        id = (typeof crypto !== "undefined" && crypto.randomUUID)
          ? crypto.randomUUID()
          : ("s-" + Math.random().toString(36).slice(2) + Date.now().toString(36));
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (e) {
      // sessionStorage blocked (rare — private mode in some old browsers).
      // Use a one-shot in-memory id so events still group within a single
      // page render at least.
      if (!_sessionId._fallback) {
        _sessionId._fallback = "mem-" + Math.random().toString(36).slice(2);
      }
      return _sessionId._fallback;
    }
  }

  function _consentAllowed() {
    // Same key the existing Cloudflare consent uses. If the user
    // hasn't decided yet (banner still up), default to NOT tracking
    // — opt-in is the GDPR-safer default. Once they Accept, tracking
    // starts. Once they Reject, it stays off.
    try {
      const raw = localStorage.getItem("wavebase_consent_v1");
      if (!raw) return false;
      const obj = JSON.parse(raw);
      return obj && obj.analytics === true;
    } catch (e) { return false; }
  }

  function _isAdminEmail(email) {
    if (!email) return false;
    return ADMIN_EMAILS_LC.indexOf(String(email).toLowerCase()) !== -1;
  }

  function _currentUserEmail() {
    if (typeof WaveBaseAuth === "undefined") return null;
    if (!WaveBaseAuth.isLoggedIn()) return null;
    const u = WaveBaseAuth.currentUser();
    return (u && u.email) || null;
  }

  function track(eventType, properties) {
    try {
      if (!_consentAllowed()) return;
      if (_isAdminEmail(_currentUserEmail())) return;

      const headers = { "Content-Type": "application/json" };
      // Attach the JWT if we have one — server uses it to link
      // events to the user (and to enforce the admin-drop rule on
      // its side too).
      if (typeof WaveBaseAuth !== "undefined" && WaveBaseAuth.isLoggedIn()) {
        // Pull the raw token via the private auth helper — there's
        // no public getter, but localStorage works.
        try {
          const tok = localStorage.getItem("wavebase_auth_token_v1");
          if (tok) headers["Authorization"] = "Bearer " + tok;
        } catch (e) {}
      }

      const body = JSON.stringify({
        event_type: String(eventType || "").slice(0, 80),
        properties: properties || {},
        session_id: _sessionId(),
      });

      // Fire-and-forget. keepalive=true tells the browser to let the
      // request complete even if the page unloads (so the pageview
      // for the OUTGOING page lands even after a navigation).
      fetch(API + "/events/", {
        method: "POST",
        headers: headers,
        body: body,
        keepalive: true,
      }).catch(function () { /* silent */ });
    } catch (e) { /* never let tracking break the page */ }
  }

  /* Anonymous, cookieless spot-view ping. Fired on a spot/center/stay
     detail page when the visitor has NOT accepted analytics cookies.
     Carries ONLY the spot_id — no session_id, no user_id, and we
     deliberately don't send the JWT, so the stored event is fully
     anonymous (a pure aggregate page-hit, like a server log line).
     Legitimate-interest basis: counting page loads in aggregate is not
     "tracking a person", so it doesn't need analytics consent.
     Admin self-views are still excluded — checked client-side here
     (since we don't send the token, the server can't tell it's an
     admin, so we filter before sending). */
  function spotView(spotId) {
    try {
      if (!spotId) return;
      if (_isAdminEmail(_currentUserEmail())) return;   // keep our own testing out
      fetch(API + "/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "spot_view",
          properties: { spot_id: spotId },
          // no session_id, no Authorization header → anonymous
        }),
        keepalive: true,
      }).catch(function () { /* silent */ });
    } catch (e) { /* never break the page */ }
  }

  /* Anonymous, cookieless event — same legitimate-interest basis as
     spotView (no session_id, no user_id, no Authorization header), but
     for arbitrary operational metrics that must be counted for EVERY
     visitor regardless of analytics-cookie consent. Used for:
       - consent_choice / consent_shown : the cookie accept-vs-reject
         rate. The "reject" event obviously can't be gated behind
         consent, so it rides this anonymous channel.
     Admin self is dropped client-side (we don't send a token, so the
     server can't tell, so we filter here). Never throws. */
  function anonEvent(type, props) {
    try {
      if (!type) return;
      if (_isAdminEmail(_currentUserEmail())) return;
      fetch(API + "/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: type, properties: props || {} }),
        keepalive: true,
      }).catch(function () { /* silent */ });
    } catch (e) { /* never break the page */ }
  }

  /* Convenience: pageview for the current page. Auto-detects spot_id
     from the URL when on spot.html so the admin "top viewed" report
     can group by spot.

     Two-layer model (June 2026, per LDW):
       - Consent given  → full rich "pageview" event (session_id +
         user_id link), as before. Powers funnel / per-user analysis.
       - No consent     → on spot/center/stay detail pages, fire the
         anonymous "spot_view" instead, so the admin Views column
         still counts every real visitor — just without identifiers.
     Exactly one of the two fires per page-load, so no double-count. */
  function pageview() {
    try {
      const path = (window.location.pathname || "/").split("/").pop() || "/";
      const params = new URLSearchParams(window.location.search);
      const props = { path: path };
      // The detail page for any spot/center/stay is spot.html?id=XYZ —
      // but Cloudflare serves it under the CLEAN URL "/spot" (no .html).
      // So the live pathname is "spot", not "spot.html". Match both, or
      // the spot_id never gets attached and views never count. (This
      // clean-URL mismatch was the real reason the Views column stayed
      // at 0 — found June 2026.)
      let spotId = null;
      if (path === "spot.html" || path === "spot") {
        spotId = params.get("id");
        if (spotId) props.spot_id = spotId;
      }
      if (_consentAllowed()) {
        track("pageview", props);          // rich, consented
      } else if (spotId) {
        spotView(spotId);                  // anonymous fallback (detail pages only)
      }
    } catch (e) {}
  }

  return {
    track:     track,
    pageview:  pageview,
    spotView:  spotView,
    anonEvent: anonEvent,
  };
})();

/* ============================================================
   Presence heartbeat — drives the admin "Last active" + "Online now".
   Distinct from WaveBaseTracking (analytics): this is a service-data
   signal (when was this account last on the site), legitimate-interest
   basis, so it is NOT gated by the analytics cookie consent. It only
   fires for logged-in users (needs a JWT) and only bumps a server-side
   timestamp — no analytics, no behavioural data.
   Fires: on page load, every 60s while the tab is visible, and when
   the tab becomes visible again after being backgrounded.
   ============================================================ */
const WaveBasePresence = (function () {
  const INTERVAL_MS = 60 * 1000;
  let timer = null;
  let lastPing = 0;

  function ping(force) {
    try {
      if (typeof WaveBaseAuth === "undefined" || !WaveBaseAuth.isLoggedIn()) return;
      const now = Date.now();
      // Throttle: don't ping more than once per 50s even if called
      // from multiple triggers (load + visibilitychange firing together).
      if (!force && now - lastPing < 50 * 1000) return;
      lastPing = now;
      WaveBaseAuth.authFetch("/users/me/heartbeat", { method: "POST", keepalive: true })
        .catch(function () { /* silent — presence is best-effort */ });
    } catch (e) { /* never break the page */ }
  }

  function start() {
    ping(true);                     // immediate ping on load
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
      // Only ping when the tab is actually visible — a backgrounded
      // tab isn't "active" presence, and skipping saves needless writes.
      if (document.visibilityState === "visible") ping(false);
    }, INTERVAL_MS);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") ping(false);
    });
  }

  return { start: start, ping: ping };
})();

// Fire one pageview per page load. Wait for DOMContentLoaded so the
// consent state + auth state are stable; pageview() guards on both
// anyway, so this is just to avoid an extra wasted attempt.

/* ============================================================
   Page-time (dwell) — how long visitors actually spend on a spot,
   center, stay or country page. Anonymous + cookieless (rides
   WaveBaseTracking.anonEvent: no session_id, no user_id, admin
   dropped), legitimate-interest basis like the Views counter.

   Honest measurement, two guards against the classic dwell-time lies:
     - ACTIVE time only: the timer pauses whenever the tab is hidden
       (backgrounded / switched away) and resumes on return, so
       "tab left open over lunch" doesn't inflate the number.
     - Capped at 30 min + floored at 2s: kills the long tail of
       walk-away outliers and ignores accidental bounces.
   Sent once, on pagehide, via keepalive (survives the unload). */
const WaveBasePageTime = (function () {
  const CAP_SECONDS = 1800;   // 30-min hard ceiling
  const FLOOR_SECONDS = 2;    // ignore sub-2s bounces
  let pageKey = null, activeMs = 0, lastResume = 0, running = false, sent = false;

  /* What are we timing? Detail pages → the entry id (same key the
     Views counter uses, so the admin resolves the name the same way).
     Country pages → "country:<Name>". Everything else is skipped. */
  function detectPageKey() {
    try {
      const path = (window.location.pathname || "/").split("/").pop() || "/";
      const params = new URLSearchParams(window.location.search);
      if (path === "spot.html" || path === "spot") {
        return params.get("id") || null;
      }
      if (path === "continent.html" || path === "continent") {
        const c = params.get("country") || params.get("name") || params.get("continent");
        return c ? ("country:" + c) : null;
      }
      return null;
    } catch (e) { return null; }
  }
  function resume() { if (!running) { running = true; lastResume = Date.now(); } }
  function pause()  { if (running)  { running = false; activeMs += Date.now() - lastResume; } }
  function flush() {
    if (sent || !pageKey) return;
    pause();
    let s = Math.round(activeMs / 1000);
    if (s > CAP_SECONDS) s = CAP_SECONDS;
    if (s < FLOOR_SECONDS) return;          // bounce — not worth recording
    sent = true;
    try {
      if (window.WaveBaseTracking && WaveBaseTracking.anonEvent) {
        WaveBaseTracking.anonEvent("page_time", { page_key: pageKey, seconds: s });
      }
    } catch (e) {}
  }
  function start() {
    pageKey = detectPageKey();
    if (!pageKey) return;                   // not a measured page
    resume();
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") pause(); else resume();
    });
    // pagehide is the reliable "leaving the page" signal on desktop +
    // modern mobile; keepalive in anonEvent makes the send survive it.
    window.addEventListener("pagehide", flush);
  }
  return { start: start, flush: flush };
})();

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      WaveBaseTracking.pageview();
      WaveBasePresence.start();
      WaveBasePageTime.start();
    });
  } else {
    WaveBaseTracking.pageview();
    WaveBasePresence.start();
    WaveBasePageTime.start();
  }

  /* Affiliate / "Book now" clicks. Delegated listener so every
     .btn-book on the page is auto-tracked without per-render
     wiring. spot_id comes from:
       - data-spot-id on the link (preferred — set at render time
         when we have the entry in hand), OR
       - ?id= URL parameter (works on spot.html detail pages),
       - else omitted (still tracked, just without per-spot
         grouping in the admin chart).
     Track happens BEFORE the navigation; keepalive=true on the
     fetch makes sure the event lands. */
  document.addEventListener("click", function (ev) {
    const a = ev.target && ev.target.closest && ev.target.closest("a.btn-book");
    if (!a) return;
    let spotId = a.getAttribute("data-spot-id") || null;
    if (!spotId) {
      try {
        const params = new URLSearchParams(window.location.search);
        const path   = window.location.pathname.split("/").pop();
        // Clean URL: live path is "spot" (no .html). Match both.
        if (path === "spot.html" || path === "spot") spotId = params.get("id") || null;
      } catch (e) {}
    }
    WaveBaseTracking.track("affiliate_click", {
      spot_id: spotId,
      href:    a.getAttribute("href") || "",
    });
  });
}


/* ============================================================
   WaveBaseAuthModal — the login/signup popup.

   One DOM node, lazily injected into <body> on the first .open()
   call and re-used for every subsequent open. Two modes ("login"
   and "signup") share the same form fields; only the labels +
   submit button text + auth call change.

   Wired up by initAuthNav() below, which:
     - rewrites the header "My SurfGoose" link to "Login" when the
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
  // Profile-view (step 2 after signup). Assigned in build().
  let authViewEl     = null;  // .auth-view-auth   — login / signup form
  let profileViewEl  = null;  // .auth-view-profile — full profile form
  let profileSlot    = null;
  let profileSkipBtn = null;
  let profileContBtn = null;
  let profileWired   = null;  // controller returned by WaveBaseProfileForm.wire()
  let mode = "login";    // "login" | "signup" | "profile"
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

        <!-- Login + Signup view (mode === "login" | "signup") -->
        <div class="auth-view auth-view-auth">
          <div class="auth-modal-tabs" role="tablist">
            <button type="button" class="auth-tab is-active" data-mode="login"  role="tab">Sign in</button>
            <button type="button" class="auth-tab"            data-mode="signup" role="tab">Create account</button>
          </div>

          <form class="auth-form" novalidate>
            <h2 class="auth-title"    id="auth-modal-title">Sign in to SurfGoose</h2>
            <p  class="auth-subtitle">Save spots, plan trips, take your list with you.</p>

            <label class="auth-field">
              <span>Email</span>
              <input type="email" name="email" required autocomplete="email" inputmode="email" autocapitalize="none" />
            </label>

            <label class="auth-field">
              <span>Password</span>
              <div class="auth-password-wrap">
                <input type="password" name="password" required minlength="6" autocomplete="current-password" />
                <button type="button" class="auth-password-toggle" aria-label="Show password" aria-pressed="false">
                  <!-- Eye (currently hidden — click to show) -->
                  <svg class="icon-show" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <!-- Eye with slash (currently shown — click to hide) -->
                  <svg class="icon-hide" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
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

        <!-- Profile view (mode === "profile") — step 2 of the popup
             right after a successful signup. Form HTML is injected
             by WaveBaseProfileForm.buildBlocksHTML() at open-time so
             it always reflects the latest options + the user's
             current localStorage profile (empty for a fresh signup,
             pre-filled if they had typed anything as an anon visitor
             before creating the account). -->
        <div class="auth-view auth-view-profile" hidden>
          <h2 class="auth-title">One last step — your <span class="ul">profile</span>.</h2>
          <p class="auth-subtitle">Tell us a bit about yourself and the home page starts showing the right spots for your level and trip style. You can skip and add it later.</p>
          <div class="auth-profile-slot profile-form-v2"></div>
          <div class="auth-profile-actions">
            <button type="button" class="btn ghost" data-action="skip">Skip for now</button>
            <button type="button" class="btn"       data-action="continue">Save and continue &rarr;</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(rootEl);

    cardEl          = rootEl.querySelector(".auth-modal");
    formEl          = rootEl.querySelector(".auth-form");
    titleEl         = formEl.querySelector(".auth-title");
    subtitleEl      = formEl.querySelector(".auth-subtitle");
    errorEl         = rootEl.querySelector(".auth-error");
    submitEl        = rootEl.querySelector(".auth-submit");
    footerPromptEl  = rootEl.querySelector(".auth-toggle-prompt");
    footerToggleEl  = rootEl.querySelector(".auth-toggle-btn");
    emailEl         = rootEl.querySelector('input[name="email"]');
    passwordEl      = rootEl.querySelector('input[name="password"]');
    tabsEl          = rootEl.querySelector(".auth-modal-tabs");
    // Profile-view elements — the modal's step 2 after signup.
    authViewEl     = rootEl.querySelector(".auth-view-auth");
    profileViewEl  = rootEl.querySelector(".auth-view-profile");
    profileSlot    = profileViewEl.querySelector(".auth-profile-slot");
    profileSkipBtn = profileViewEl.querySelector('[data-action="skip"]');
    profileContBtn = profileViewEl.querySelector('[data-action="continue"]');

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
      // Switching to signup mid-session counts as a "modal open" for
      // the funnel — the user reached the signup form, regardless of
      // which mode the modal opened in originally.
      if (btn.dataset.mode === "signup" && typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_modal_open", { via: "tab_switch" });
      }
    });
    footerToggleEl.addEventListener("click", function () {
      const next = mode === "login" ? "signup" : "login";
      setMode(next);
      if (next === "signup" && typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_modal_open", { via: "footer_link" });
      }
    });

    // Funnel: email / password field touched (non-empty on blur).
    // No client-side dedup — the server's funnel aggregation counts
    // distinct session_ids per step, so repeated blurs from the same
    // session collapse to one count automatically.
    emailEl.addEventListener("blur", function () {
      if (mode !== "signup") return;
      if (!emailEl.value || emailEl.value.indexOf("@") === -1) return;
      if (typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_email_filled", {});
      }
    });
    passwordEl.addEventListener("blur", function () {
      if (mode !== "signup") return;
      if (!passwordEl.value || passwordEl.value.length < 6) return;
      if (typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_password_filled", {});
      }
    });

    // Password show/hide toggle. Flips the input type between
    // "password" and "text" so the user can verify what they typed
    // (essential when entering a new password they just made up).
    // The two SVGs in the button (icon-show / icon-hide) swap via
    // the .is-visible class — CSS handles which one renders.
    const toggleBtn = rootEl.querySelector(".auth-password-toggle");
    toggleBtn.addEventListener("click", function () {
      const showing = passwordEl.type === "text";
      passwordEl.type = showing ? "password" : "text";
      toggleBtn.classList.toggle("is-visible", !showing);
      toggleBtn.setAttribute("aria-pressed", showing ? "false" : "true");
      toggleBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      // Keep focus on the input so the user can continue typing
      // without an extra tab/click.
      passwordEl.focus();
    });

    // Submit handler.
    formEl.addEventListener("submit", onSubmit);

    // Profile-step Skip + Continue. Both close the modal and land
    // the user on account.html where their full account UI lives.
    // Continue first flushes any pending debounced server-sync so
    // we don't navigate with unsaved field edits in flight.
    profileSkipBtn.addEventListener("click", function () {
      if (typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_profile_skipped", {});
      }
      close();
      window.location.href = "account.html";
    });
    profileContBtn.addEventListener("click", async function () {
      profileContBtn.disabled = true;
      profileContBtn.textContent = "Saving…";
      try {
        if (profileWired && typeof profileWired.flushPendingSave === "function") {
          await profileWired.flushPendingSave();
        }
      } catch (e) {
        // Surface the error inside the modal so the user can retry
        // without losing what they typed.
        alert("Couldn't save your profile: " + (e.message || e));
        profileContBtn.disabled = false;
        profileContBtn.textContent = "Save and continue →";
        return;
      }
      if (typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_profile_saved", {});
      }
      close();
      window.location.href = "account.html";
    });
  }

  function setMode(next) {
    mode = next;
    if (mode === "profile") {
      // Step 2 of the popup after a successful signup. Hide the
      // email/password view, show the profile form, and widen the
      // modal so the form blocks have room.
      authViewEl.setAttribute("hidden", "");
      profileViewEl.removeAttribute("hidden");
      cardEl.classList.add("is-profile-step");
      // Render the profile form inside the modal slot. Read fresh
      // profile state — a brand-new account has empty defaults; a
      // user who'd filled in profile fields as anon before signing
      // up sees their previous answers pre-filled.
      const p = WaveBaseAccount.getProfile();
      profileSlot.innerHTML = WaveBaseProfileForm.buildBlocksHTML(p);
      profileWired = WaveBaseProfileForm.wire(profileSlot, {
        // No flash badge or progress pill in the modal — neither
        // exists in this layout, and the auto-save is enough
        // feedback (fields stay where the user puts them).
      });
      profileContBtn.disabled = false;
      profileContBtn.textContent = "Save and continue →";
      return;
    }

    // login / signup view
    authViewEl.removeAttribute("hidden");
    profileViewEl.setAttribute("hidden", "");
    cardEl.classList.remove("is-profile-step");
    // Tear down the wired profile form if we were in profile mode
    // before — listeners stay until the slot is wiped on next render.
    if (profileWired) profileWired = null;

    // Tab visual state
    tabsEl.querySelectorAll(".auth-tab").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.mode === mode);
      b.setAttribute("aria-selected", b.dataset.mode === mode ? "true" : "false");
    });
    if (mode === "login") {
      titleEl.textContent     = "Sign in to SurfGoose";
      subtitleEl.textContent  = "Save spots, plan trips, take your list with you.";
      passwordEl.setAttribute("autocomplete", "current-password");
      submitEl.textContent    = "Sign in";
      footerPromptEl.textContent = "Don’t have an account?";
      footerToggleEl.textContent = "Create one";
    } else {
      titleEl.textContent     = "Create your SurfGoose account";
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
      const wasSignup = (mode === "signup");
      if (wasSignup && typeof WaveBaseTracking !== "undefined") {
        WaveBaseTracking.track("signup_submitted", {});
      }
      const user = wasSignup
        ? await WaveBaseAuth.signup({ email: email, password: password })
        : await WaveBaseAuth.login({ email: email, password: password });

      if (wasSignup) {
        // Signup success → transition the SAME modal to its profile
        // step. The user keeps the popup context (no page jump) and
        // can fill in the form or hit Skip — both close the modal
        // and land them on account.html.
        setBusy(false);
        setMode("profile");
        if (typeof onSuccess === "function") {
          try { onSuccess(user, "signup"); } catch (e) { console.error(e); }
        }
        return;
      }

      // Login success — close + navigate to the account page (or
      // refresh if we're already there) so the user lands on their
      // account UI.
      close();
      if (typeof onSuccess === "function") {
        try { onSuccess(user, "login"); } catch (e) { console.error(e); }
      } else {
        if (window.location.pathname.split("/").pop() !== "account.html") {
          window.location.href = "account.html";
        } else {
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
    // Track the modal-open event ONLY for signup-mode opens — login
    // is a different funnel and we'd swamp the signup signal otherwise.
    if ((opts.mode || "login") === "signup"
        && typeof WaveBaseTracking !== "undefined") {
      WaveBaseTracking.track("signup_modal_open", {});
    }
    onSuccess = opts.onSuccess || null;
    emailEl.value = "";
    passwordEl.value = "";
    // Always start with the password obscured — leaving it visible
    // from a previous open would be a small but real shoulder-surfing
    // hazard the next time someone opens the modal in a public place.
    passwordEl.type = "password";
    const toggleBtn = rootEl.querySelector(".auth-password-toggle");
    if (toggleBtn) {
      toggleBtn.classList.remove("is-visible");
      toggleBtn.setAttribute("aria-pressed", "false");
      toggleBtn.setAttribute("aria-label", "Show password");
    }
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

  // Strict check on isLoggedIn() FIRST — never look at the cached user
  // before confirming there's still a token. Otherwise a stale cached
  // user can leak the "Hi, …" greeting into the logged-out state
  // (which makes no sense — we can't greet someone we don't know).
  if (WaveBaseAuth.isLoggedIn()) {
    const user = WaveBaseAuth.currentUser();
    let firstName = "";
    if (user && user.name) {
      firstName = String(user.name).trim().split(/\s+/)[0];
      // Capitalise the first letter so "lode" displays as "Lode"
      // even if the user typed their name lowercase in the form.
      if (firstName) firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    // Friendly fallback when the account has no name yet (typical
    // right after a Skip-for-now signup). An email prefix like
    // "lode.b162" would look weird up there, so we skip it and use
    // the universal "surfer" greeting instead.
    link.textContent = firstName ? ("Hi, " + firstName) : "Hi, surfer";
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
