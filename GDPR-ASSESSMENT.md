# GDPR assessment — SurfGoose user data (June 2026)

*Requested by Michiel ("can/should we really save all of it?"), assessed against the
actual backend code (wavebase-api) + privacy.html, 12 June 2026.*

## Verdict

**Fundamentally: yes, this is fine to store.** The dataset is proportionate,
purpose-bound and unusually privacy-conscious for a travel product: opt-in
analytics, no IP storage, no fingerprinting, bcrypt passwords, admin
self-exclusion from stats, anonymous counters instead of tracking where
consent is refused. The real legal exposure is **not the amount of data — it's
the privacy policy lagging behind what the product actually does.** Under GDPR
the gap between stated and actual processing (Art. 13 transparency) is what
gets you in trouble, not the modest dataset itself.

## What we store (verified inventory)

| Data | Where | Legal basis (per policy) | OK? |
|---|---|---|---|
| email + bcrypt hash | users | contract 6(1)(b) | ✓ |
| optional profile (name, birth year, country, surf prefs…) | users | consent 6(1)(a) | ✓ |
| saved spots, surfed log, trips (incl. free-text day notes), reviews | per-user collections | contract | ✓ but policy outdated (see gap 1) |
| last-seen + total session time per account | users | legit. interest 6(1)(f) | ✓ disclosed |
| consented events (pageview/funnel/search/dwell, session-id + user-id) | events | consent | ✓ disclosed |
| anonymous counters: spot_view, page_time, consent tally | events | legit. interest | ✓ disclosed |
| **NEW 12 jun:** site_visit tally + visit_time (ephemeral visit key, cumulative seconds) | events | legit. interest | ⚠ must be added to policy (gap 2) |

## Gaps found (ranked)

1. **Policy says trips / surfed log / reviews "stay on your device only" — false since the
   API sync went live.** The policy §3 even promises "we'll tell you here when that
   changes". Fix: update §3 + retention list. *(Fixed in this commit — review the wording.)*
2. **Today's new visit counters aren't in the policy's anonymous-counters list.** The
   visit_time event carries a random per-visit key (dies with the tab session, never
   linked to an account, stores only a seconds total — no page trail). Defensible as
   legitimate-interest aggregate counting, but it MUST be disclosed, same as the other
   tallies. *(Fixed in this commit — review the wording.)* If you ever want zero gray
   zone: gate visit_time behind consent and accept a smaller sample.
3. **Cloudflare Web Analytics claim can't be verified from the repo.** §2 and the cookie
   banner say we count visits with CF Web Analytics, but no beacon script exists in the
   HTML. If it's the dashboard auto-inject: fine, leave as is. If it's switched off:
   remove it from policy + banner (we now have our own site_visit counter anyway).
   **→ Lode: check Cloudflare dashboard → Web Analytics toggle.**
4. **No retention limit on raw events.** Events accumulate forever. Recommendation: a
   Mongo TTL index on events.ts (e.g. 24 months) + one line in the policy's retention
   section. One-line backend change, do when convenient.
5. **No email verification at signup** — anyone can register a stranger's email, which
   means processing a third party's address without basis. Already on Michiel's list
   (item "Email verification at registration"); fixing that also closes this.
6. **Free-text fields (trip day notes, review text)** can contain whatever users type,
   including other people's data. Low risk; covered by the account-deletion cascade.
   No action needed beyond the §3 update.

## What's already solid (keep doing this)

- Deletion cascade (`DELETE /users/me`) + 30-day promise; reviews-survive policy is
  clearly explained and defensible.
- Rights section complete (access, rectification, erasure, objection, portability,
  GBA complaint).
- Processors listed with SCC/DPF status (Cloudflare, Render, MongoDB Atlas).
- Admin access disclosed by name; allowlist enforced server-side.
- Consent is real opt-in (default = no tracking until Accept).

## Bottom line for Michiel

Storing this data is fine and well within GDPR for a product of this scale, **provided
the policy keeps matching reality** — that's now corrected, with two open follow-ups:
the Cloudflare-toggle check (gap 3) and event retention (gap 4). The most legally
urgent item on the whole feedback list is the one Michiel already flagged himself:
**email verification at registration.**
