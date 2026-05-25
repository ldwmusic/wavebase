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
      if (i === -1) s.saved.push(id); else s.saved.splice(i, 1);
      write(s);
      return s.saved.indexOf(id) !== -1;
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
