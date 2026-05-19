/* WaveBase — QnD content (English)
   Morocco: Tamraght & Taghazout. Real, cross-checked coordinates.
   Spots: surf/area data, honestly labelled. Stays: recent reviews (2022+).
   Coordinates without a navigable break point (kilometre-long beaches) are
   marked "approximate" via coordsLabel. photo: "" = photo-ready, real photo TBD. */

const WAVEBASE_DATA = [

  /* ===================== STAYS — TAMRAGHT ===================== */
  {
    id: "sunset-surfhouse",
    type: "stay",
    name: "Sunset Surfhouse",
    town: "Tamraght",
    tagline: "A house, not a resort — it's all about Abdoul, the food and the feeling of coming home.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,9,10,11,12],
    coords: [30.5135, -9.6820],
    photo: "",
    verblijf: {
      eten: "Home-cooked Moroccan meals by host Abdoul's wife — praised in nearly every review.",
      afstandSpot: "Walking distance to the Devil's Rock and Crocro beach breaks; 4–5 spots within 15 min.",
      verhuur: "Not confirmed in the available reviews — worth asking the house directly.",
      lessen: "Yes — surf packages from €360 (5 nights shared) to €1020 (14 nights single, all-inclusive), with local instructors (Salah, Younes, Amine).",
      rating: "TripAdvisor 5.0 (283 reviews, ~20 readable); Hostelworld 8.3. Booking.com & Google blocked.",
      sfeer: "Chill and homely — a family house, not a party hostel; lots of returning guests and long stays.",
      activiteiten: "Not a focus in the reviews — the draw is the house, the food and the host.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 5.0, hosts: 5.0, comfort: 3.0, cleanliness: 4.0, value: 4.5 },
      essence: { style: "Hostel", vibe: "Surfer crowd" }
    },
    samenvatting: [
      "A simple, family-run house — not a polished resort.",
      "Strongest points: host Abdoul, his wife's cooking, the homely atmosphere.",
      "Surf info comes from area knowledge, not from the reviews.",
      "Based on ~20 readable TripAdvisor reviews out of 283 (Booking.com and Google were blocked).",
      "For solo travellers and beginner–intermediate; not for those after quiet and privacy."
    ],
    verhaal: [
      `Sunset Surfhouse isn't a resort, it's a house. A simple, family-run guesthouse in Tamraght village, and just about everyone who's stayed there talks about the same three things: host Abdoul, his wife Miryem's cooking, and the feeling of coming home. People book one night and stay a week.`,
      `On the surf I have to be honest: what I know, I know about the region, not the house. Tamraght sits on good waves — bigger and more consistent in winter, smaller and softer in summer. But reviewers rarely write about waves, so that's area knowledge, not a promise.`,
      `The honest fine print: TripAdvisor has 283 reviews, but I could only really read about twenty — Booking.com and Google blocked access. One caveat: the house shows up under multiple listing names ("Surf Hostel Morocco"), so exact review counts are murky. The picture is warm and consistent, but not complete.`
    ],
    lagen: [
      {
        titel: "The surf — spot & region",
        bron: "Area data and surf guides — not from the stay's reviews",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Bigger, more consistent Atlantic swell, lightest wind Nov–March. Best for intermediate–advanced. The home breaks Devil's Rock and Crocro are within walking distance; 4–5 spots within 15 min.` },
          { kop: "Low season · May–Sep", tekst: `Smaller, softer swell, warmer water, easier to learn. Note: the house is usually closed ~16–31 Aug.` }
        ]
      },
      {
        titel: "The stay — Sunset Surfhouse",
        bron: "Recent reviews (TripAdvisor, ~20 of 283 readable; Hostelworld scores). Booking.com & Google: blocked.",
        inhoud: [
          { kop: "What it is", tekst: `A simple, family-run surf guesthouse in the village. Dorms + a few private rooms. Two ways to book: room-only via Booking from €20/night dorm or ~€36-40/night private double (incl. breakfast, low season), or all-in surf-camp packages via their own site (€360 shared / 5n up to €1020 single / 14n, with lessons, meals and transport).` },
          { kop: "The constants", tekst: `Host Abdoul is unanimously the strongest point — "the best host ever". His wife's cooking is praised in every review. Family-style, social atmosphere; instructors (Salah, Younes, Amine) know the local conditions.` },
          { kop: "Who stays here", tekst: `A broad mix — solo travellers, couples, groups, international. Lots of returning guests and long stays.` },
          { kop: "Weak spots", tekst: `Honestly: hard to find negatives — TripAdvisor shows 0 below "very good". The Hostelworld score (8.3) is lower than TripAdvisor (5.0), but I couldn't read why. One old gripe (2017): the mattresses — not repeated in recent reviews.` }
        ]
      }
    ],
    vergelijking: {
      kop: "Two calendars — surf ≠ stay",
      rijen: [
        { label: "Oct–Nov", a: "Surf: building swell", b: "Stay: quieter, shoulder months" },
        { label: "Dec–Jan", a: "Surf: consistent, big", b: "Stay: peak around New Year, social" },
        { label: "Feb–Mar", a: "Surf: big but changeable", b: "Stay: quieter" },
        { label: "May–Sep", a: "Surf: small, soft, warm water", b: "Stay: busier; closed ~16–31 Aug" }
      ]
    },
    ideaalVoor: "Solo travellers, beginner–intermediate, and anyone who wants a homely social base over a polished resort.",
    nietIdeaalAls: "You want a quiet, private, high-comfort stay — or you're advanced and coming in summer for serious waves.",
    prices: {
      tier:        "comfortable",
      fromEUR:     20,
      toEUR:       40,
      unit:        "per night, dorm bed to private double (room-only, incl. breakfast)",
      verified:    "2026-05",
      source:      "Booking.com checked 2026-05-19 (slug sunset-surfhouse-morocco), 1-2 Jun 2026, EUR: dorm bed €20, private double €36-40 (Genius -10%). Surf-camp packages with lessons+meals+transport from €360/5n to €1020/14n via sunset-surfhousemorocco.com — different product."
    },
    bookingUrl: "https://www.booking.com/hotel/ma/sunset-surfhouse-morocco.html"
  },

  {
    id: "chillout-surf-hostel",
    type: "stay",
    name: "Chillout Surf Hostel",
    town: "Tamraght",
    tagline: "All-inclusive and social — known for its value and its big groups.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5096, -9.6774],
    photo: "",
    verblijf: {
      eten: "Included in the all-inclusive package; part of the strong value-for-money reviewers highlight.",
      afstandSpot: "~200 m from the Devil's Rock and Crocro beach breaks; daily shuttle to the spot of the day.",
      verhuur: "Lessons are all-inclusive; whether boards/wetsuits are included or rented separately isn't specified in the reviews.",
      lessen: "Yes — lessons for every level, included; instructors often run over their contracted hours.",
      rating: "TripAdvisor 4.9/5 (#2 of 59 in Tamraght, ~25 readable). Booking.com & Google blocked.",
      sfeer: "Social and group-oriented — roof terrace and pool; regularly takes large (school) groups. Lively, not a quiet retreat.",
      activiteiten: "Excursions are part of the all-inclusive package.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 4.0, hosts: 4.5, comfort: 3.5, cleanliness: 2.5, value: 5.0 },
      essence: { style: "Surf camp", vibe: "Social hostel" }
    },
    samenvatting: [
      "All-inclusive surf camp (food, lessons, transport, excursions) — strong value for money.",
      "Social, with a roof terrace and pool; often hosts large (school) groups.",
      "Lessons for every level; instructors often run over their contracted hours.",
      "Honest downside: cleanliness scored 3/5 several times in 2024; mosquitoes mentioned.",
      "Based on ~25 readable TripAdvisor reviews (Booking.com & Google blocked)."
    ],
    verhaal: [
      `Chillout Surf Hostel is the kind of place where "chill", "family" and "good vibes" show up in just about every review. An all-inclusive surf camp — lessons, food, transport and excursions in one package — with a roof terrace and a pool as its social anchors.`,
      `The biggest recurring theme is value for money: reviewers can hardly believe what you get for the price. The flip side: it regularly takes large groups, sometimes 40 at a time — great if you want to meet people, less so if you want quiet.`,
      `Honestly: several reviewers in 2024 gave cleanliness just 3/5 (while rating the whole thing 5/5), and one recommended mosquito spray. The review base is very recent though — lots from 2024–2026.`
    ],
    lagen: [
      {
        titel: "The surf — spot & region",
        bron: "Area data and surf guides — not from the stay's reviews",
        inhoud: [
          { kop: "Location", tekst: `~200 m from the Devil's Rock and Crocro beach breaks; daily shuttle to the spot of the day. Same regional pattern: winter bigger and more consistent, summer smaller and softer.` }
        ]
      },
      {
        titel: "The stay — Chillout Surf Hostel",
        bron: "Recent reviews (TripAdvisor, ~25 readable — 4.9/5, #2 of 59 in Tamraght). Booking.com & Google: blocked.",
        inhoud: [
          { kop: "What it is", tekst: `All-inclusive surf camp with a roof terrace and pool. Packages ~€225 (3 days) to ~€499 (7 days). Rooms with private bathrooms, some with kitchenettes.` },
          { kop: "The constants", tekst: `Warm, service-minded staff; instructors (Abdellah, Amine, Yassin) often go over the contracted hours. Strong Scandinavian presence; the Norwegian booking contact "Marius" gets named a lot.` },
          { kop: "Who stays here", tekst: `A broad mix — from solo travellers to large organised (school) groups. International: lots of Norwegians, plus Irish, Hungarians, Swiss, Italians.` },
          { kop: "Weak spots", tekst: `Cleanliness: 3/5 from several reviewers in 2024. Mosquitoes mentioned. Limited walkability beyond the beach breaks. Conflicting distance-to-Taghazout claims (5 vs 10 km).` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Anyone who wants all-inclusive ease and a social group vibe at a sharp price — solo travellers and groups alike.",
    nietIdeaalAls: "You're after quiet and privacy, you care about strict cleanliness, or you don't enjoy a busy group house.",
    prices: {
      tier:        "budget",
      fromEUR:     null,
      toEUR:       null,
      unit:        "per night, dorm bed",
      verified:    "2026-05",
      source:      "TODO — Hostelworld listing requires date input for live rate. hostelworld.com/hostels/p/290344/chilloutsurf-hostel-and-yoga"
    },
    bookingUrl: "https://www.hostelworld.com/hostels/p/290344/chilloutsurf-hostel-and-yoga/"
  },

  {
    id: "solid-surf-house",
    type: "stay",
    name: "Solid Surf House Morocco",
    town: "Tamraght",
    tagline: "A villa with a pool and structured coaching — but not on the beach.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5090, -9.6775],
    coordsLabel: "Coordinate from a single primary source (carvemag.com), reverse-geocoded and matching the 'Oufella' address — but not double-confirmed. Verify before navigating.",
    photo: "",
    verblijf: {
      eten: "Strongly praised — rich breakfast and dinner buffets (dinner 5×/week); one vegetarian found the options limited.",
      afstandSpot: "~1 km from Banana Point, Devil's Rock and Crocro, but ~15 min walk to the water; taxi (~€10) to the village.",
      verhuur: "Free board and wetsuit rental included.",
      lessen: "Yes — structured lessons with theory and video analysis (some reviewers said the promised video analysis didn't always happen).",
      rating: "TripAdvisor 4.8/5 (359 reviews, ~12 readable; sample skews 5-star). Booking.com & Google blocked.",
      sfeer: "Quieter, boutique surf-camp feel — a villa with a private pool, not a backpacker party hostel.",
      activiteiten: "Daily yoga; lounges and a cinema corner at the villa.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 4.5, hosts: 3.5, comfort: 4.5, cleanliness: 4.0, value: 3.5 },
      essence: { style: "Surf camp", vibe: "Couples / quiet" }
    },
    samenvatting: [
      "A villa with a private pool — more boutique surf camp than backpacker hostel.",
      "Structured lessons with theory and video analysis.",
      "Not on the beach — ~15 min walk to the water, taxi (~€10) to the village.",
      "Honest: the sharpest complaints of the three stays are here, about organisation/management (across years).",
      "Based on ~12 readable TripAdvisor reviews out of 359 (Booking.com & Google blocked)."
    ],
    verhaal: [
      `Solid Surf House is the boutique end of the spectrum: a villa with a private pool, several lounges, a cinema corner. Part of a surf-camp brand that also operates in Bali. The programme is more structured than at the neighbours — with theory sessions and video analysis.`,
      `Two honest caveats. One: it's not on the beach — about a 15-minute walk to the water, in the higher "Oufella" part of Tamraght; for the village you take a taxi. Two: this is the only one of the three where I found a real, multi-year line of complaints — about organisation and management ("you have to ask for everything", promised video analysis that didn't happen, a slow refund process).`,
      `The positive reviews do dominate (4.8 across 359), and the sharpest complaints are older. But they're more concrete than anything I found for Sunset or Chillout — so factor that in, and check the recent reviews yourself.`
    ],
    lagen: [
      {
        titel: "The surf — spot & region",
        bron: "Area data and surf guides — not from the stay's reviews",
        inhoud: [
          { kop: "Location", tekst: `~1 km from Banana Point, Devil's Rock and Crocro, but ~15 min walk to the water. Same regional pattern: winter better, summer softer.` }
        ]
      },
      {
        titel: "The stay — Solid Surf House",
        bron: "Recent reviews (TripAdvisor, ~12 of 359 readable — 4.8/5). Booking.com & Google: blocked.",
        inhoud: [
          { kop: "What it is", tekst: `A villa surf camp with a private pool. Package from ~€379/week — breakfast/lunch/dinner (dinner 5×/week), private bathrooms, daily yoga, lessons, free board and wetsuit rental.` },
          { kop: "The constants", tekst: `Food is strongly praised (rich breakfast and dinner buffets). Structured coaching with theory and video analysis. In the positive reviews: warm, heartfelt staff.` },
          { kop: "Who stays here", tekst: `Solo travellers, couples, friend groups. International (Dutch, Italian, German). More of a "boutique surf camp" crowd than backpackers.` },
          { kop: "Weak spots", tekst: `A multi-year line of complaints about organisation/management. Not on the beach — taxi needed for the village. One vegetarian found the options limited. The TripAdvisor sample skews 5-star.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Anyone who wants a quieter villa with a pool and structured coaching, and doesn't mind a walk to the beach.",
    nietIdeaalAls: "You specifically want to be on the beach, or you're sensitive to shaky organisation.",
    prices: {
      tier:        "comfortable",
      fromEUR:     349,
      toEUR:       549,
      unit:        "per person per week, surf-camp package",
      verified:    "2026-05",
      source:      "solidsurfhouse.com/surfcamp/morocco/ — €349 shared room / €549 full all-incl"
    },
    bookingUrl: "https://solidsurfhouse.com/surfcamp/morocco/"
  },

  /* ===================== STAYS — TAGHAZOUT ===================== */
  {
    id: "the-surf-hostel",
    type: "stay",
    name: "The Surf Hostel",
    town: "Taghazout",
    tagline: "A budget, social hostel in the heart of the village — run by two local brothers.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5456, -9.7091],
    coordsLabel: "From the Google Maps place pin (address 'Center Ville, Taghazout 80020', plus code G7WR+78) — toward the north end of the village.",
    photo: "",
    verblijf: {
      eten: "Free breakfast; communal Couscous Fridays and BBQ Sundays; a fully equipped kitchen for self-catering.",
      afstandSpot: "Central village — about a 200 m walk to the beach; Hash Point, Panorama, Anchor Point and more are a short walk or shuttle away.",
      verhuur: "Yes — surfboards and wetsuits rented on-site, plus a surf shop right across the street.",
      lessen: "Yes — surf lessons and guiding arranged on-site, for all levels.",
      rating: "Google 4.3/5 (59 reviews); Hostelworld 9.3/10 (~885 reviews); TripAdvisor 4.6/5 (40 reviews, Travelers' Choice).",
      sfeer: "Social and laid-back — a rooftop hangout with movie nights and jam sessions; a place to meet people, not a quiet retreat.",
      activiteiten: "Sandboarding, Paradise Valley trips, Agadir souk tours, fishing and Moroccan cooking classes (day trips need ~6 people minimum).",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.5, hosts: 4.5, comfort: 3.0, cleanliness: 2.5, value: 4.5 },
      essence: { style: "Hostel", vibe: "Social hostel" }
    },
    samenvatting: [
      "A budget surf hostel in the heart of Taghazout village, run by two local brothers.",
      "Strongest points: the location, the social rooftop scene and friendly staff.",
      "Surf lessons, guiding and board/wetsuit rental all sorted on-site.",
      "Honest downside: cleanliness — toilets and broken lockers come up in reviews.",
      "Based on Hostelworld (9.3/10, ~885 reviews), TripAdvisor (4.6/5, 40 reviews) and Google (4.3/5, 59 reviews)."
    ],
    verhaal: [
      `The Surf Hostel sits right in the middle of Taghazout village — run by two local brothers, and squarely aimed at the surf crowd on a budget. The rooftop is the heart of the place: that's where people meet, eat and end up staying longer than planned.`,
      `What reviewers come back to is the package: an unbeatable location a couple of hundred metres from the water, everything sorted on-site (lessons, guiding, board and wetsuit rental, a surf shop across the street), and a genuinely social atmosphere with movie nights and jam sessions.`,
      `The honest caveat is cleanliness — the toilets and some broken lockers draw the sharpest comments, and it scores lowest there even in otherwise glowing reviews. The picture is consistent across Hostelworld (9.3/10, ~885 reviews), TripAdvisor (4.6/5, 40 reviews) and Google (4.3/5, 59 reviews).`
    ],
    lagen: [
      {
        titel: "The surf — spot & region",
        bron: "Area data and surf guides — not from the stay's reviews",
        inhoud: [
          { kop: "Location", tekst: `In the center of Taghazout, ~200 m from the village beach. Hash Point is a short walk; Panorama, Anchor Point, Mysteries and La Source are all within walking distance or a quick shuttle. Same regional pattern: winter bigger and more consistent, summer smaller and softer.` }
        ]
      },
      {
        titel: "The stay — The Surf Hostel",
        bron: "Recent reviews (Hostelworld ~885; TripAdvisor 40; Google 59).",
        inhoud: [
          { kop: "What it is", tekst: `A budget social hostel in the village core — dorms, a rooftop, a shared kitchen. Run by two Taghazout brothers; surf lessons, guiding and rental all on-site.` },
          { kop: "The constants", tekst: `Location and atmosphere score highest — a 9.9 location score on Hostelworld, plus friendly staff and an easy rooftop social scene. Free breakfast, Couscous Fridays and BBQ Sundays get named a lot.` },
          { kop: "Who stays here", tekst: `Mostly solo travellers and younger surfers who want to meet people; a lively, international mix.` },
          { kop: "Weak spots", tekst: `Cleanliness — the toilets especially — and broken lockers are the recurring complaints. Reception isn't always staffed, and day trips need a minimum group size.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Solo travellers and anyone who wants a cheap, central, social base with breaks within walking distance.",
    nietIdeaalAls: "You want quiet, privacy or hotel-grade cleanliness.",
    prices: {
      tier:        "budget",
      fromEUR:     null,
      toEUR:       null,
      unit:        "per night, dorm bed",
      verified:    "2026-05",
      source:      "TODO — Hostelworld requires date for live rate. hostelworld.com/hostels/p/55544/the-surf-hostel"
    },
    bookingUrl: "https://www.hostelworld.com/hostels/p/55544/the-surf-hostel/"
  },

  {
    id: "amayour-surf",
    type: "stay",
    name: "Amayour Surf",
    town: "Taghazout",
    tagline: "A boutique surf-and-yoga hostel in a refurbished fishing cottage — known for its food.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5433, -9.7078],
    coordsLabel: "Coordinate from a single source (cybevasion.fr); the 'Panorama Street' address is confirmed by the hostel's own site and is consistent with this spot near the south end of the village. Verify before navigating.",
    photo: "",
    verblijf: {
      eten: "A real highlight — in-house chefs do breakfast, packed lunches and dinner (Moroccan tagines, BBQ nights, veg- and vegan-friendly), often eaten family-style at a long table.",
      afstandSpot: "South end of Taghazout village, on Panorama Street; the Panorama and Hash Point breaks and the village beach are a short walk away.",
      verhuur: "Yes — an on-site surf shop handles board and wetsuit rental.",
      lessen: "Yes — surf lessons with instructors who adapt to your level; reviewers single the lessons out for praise.",
      rating: "TripAdvisor 4/5 (#3 of 69 specialty lodging in Taghazout); Booking.com 8.0/10; Hostelz 8.7 (~124 reviews).",
      sfeer: "Chill and social rather than party — a boutique surf-and-yoga house, good for meeting people; the odd review found it a little impersonal.",
      activiteiten: "Yoga is a core part of the offering — it bills itself as a surf-and-yoga stay.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 5.0, hosts: 3.5, comfort: 4.0, cleanliness: 4.0, value: 3.5 },
      essence: { style: "Hostel", vibe: "Surfer crowd" }
    },
    samenvatting: [
      "A boutique surf-and-yoga hostel in a refurbished Taghazout fishing cottage — dorms plus smarter doubles.",
      "The food is the standout — in-house chefs and family-style dinners, repeatedly called the best of a Morocco trip.",
      "Surf lessons (praised, level-adaptive) and board/wetsuit rental via the on-site surf shop.",
      "Honest downside: a minority of reviews found it a bit impersonal or money-focused.",
      "Based on TripAdvisor (#3 of 69), Booking.com (8.0) and Hostelz (8.7, ~124 reviews)."
    ],
    verhaal: [
      `Amayour Surf is the boutique end of the Taghazout hostel scene — a real fishing cottage in the village, refurbished with Berber charm and a designer's eye, offering dorms alongside smarter private doubles. It calls itself a surf-and-yoga stay, and that's the register: relaxed, social, a little stylish.`,
      `The food is what reviewers fixate on. In-house chefs cook breakfast, packed lunches and dinner — Moroccan tagines, BBQ nights, plenty for vegetarians — often eaten family-style at a long table. More than one guest calls it the best food of their Morocco trip. The surf lessons get singled out too: instructors who adapt to your level.`,
      `The honest caveat: alongside the warm reviews, a minority found it impersonal — staff not especially welcoming, a sense of focus on money. The scores stay solid though: TripAdvisor #3 of 69, Booking.com 8.0, Hostelz 8.7 across ~124 reviews.`
    ],
    lagen: [
      {
        titel: "The surf — spot & region",
        bron: "Area data and surf guides — not from the stay's reviews",
        inhoud: [
          { kop: "Location", tekst: `At the south end of Taghazout village, on Panorama Street. The Panorama point-and-beach break and the village beach are a short walk; Hash Point and the northern points are walkable or a quick hop. Same regional pattern: winter bigger and more consistent, summer smaller and softer.` }
        ]
      },
      {
        titel: "The stay — Amayour Surf",
        bron: "Recent reviews (TripAdvisor #3 of 69; Hostelz ~124 reviews; Booking.com score 8.0).",
        inhoud: [
          { kop: "What it is", tekst: `A boutique surf-and-yoga hostel in a refurbished fishing cottage — dorms plus private doubles, a rooftop, an on-site surf shop and chef-cooked meals.` },
          { kop: "The constants", tekst: `The food is praised in review after review, the surf lessons too. A relaxed, social, design-led atmosphere — people from all over surfing, doing yoga and eating together.` },
          { kop: "Who stays here", tekst: `A broad international mix drawn to the surf-and-yoga, food-led format — more boutique traveller than rowdy backpacker.` },
          { kop: "Weak spots", tekst: `A minority of reviews found it impersonal — staff not always welcoming, a feeling of money-focus. Not the cheapest, and not a big party scene.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Anyone who wants a stylish, food-led surf-and-yoga base and doesn't need a big party scene.",
    nietIdeaalAls: "You want a rowdy social hostel, or a rock-bottom backpacker price.",
    prices: {
      tier:        "comfortable",
      fromEUR:     null,
      toEUR:       null,
      unit:        "by enquiry",
      verified:    "2026-05",
      source:      "Booking.com listing exists (slug amayour-surf, 80022 Taghazout) but currently shows 'not accepting reservations' for all 2026 dates checked (1-2 Feb and 1-2 Jun). Contact Amayour Surf & Yoga Camp directly via amayoursurf.com or Instagram for rates."
    },
    bookingUrl: "https://www.amayoursurf.com/"
  },

  {
    id: "dar-imim-surf-house",
    type: "stay",
    name: "Dar Imim Surf House",
    town: "Taghazout",
    tagline: "A small, homely, top-rated surf house a few minutes' walk from Taghazout Beach.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5462, -9.7081],
    coordsLabel: "Coordinate from one aggregator's map data (address 'Rue Mhand Idir, Taghazout') — single-source, places it toward the north end of the village. Verify before navigating.",
    photo: "",
    verblijf: {
      eten: "A daily continental breakfast included; a well-equipped shared kitchen for self-catering, with village restaurants close by.",
      afstandSpot: "In Taghazout village, about a 5-minute walk to Taghazout Beach; the village point breaks are a short walk further.",
      verhuur: "Not clearly documented in the available listings — worth confirming with the house; daily lessons are the main surf service mentioned.",
      lessen: "Yes — daily surf lessons offered at the property, and staff help with finding spots and arranging activities.",
      rating: "Around 9.8/10 across booking aggregators (review counts vary by platform, roughly 56–190); consistently listed among Taghazout's top-rated hostels.",
      sfeer: "Chill and homely — a small, cosy house with a rooftop terrace, shared meals and movie nights; not a party hostel.",
      activiteiten: "Yoga classes and hiking are listed; the Taghazout skatepark is a few minutes' walk away.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.5, hosts: 4.0, comfort: 4.0, cleanliness: 4.5, value: 4.5 },
      essence: { style: "Hostel", vibe: "Quiet retreat" }
    },
    samenvatting: [
      "A small, homely surf house in Taghazout village, about 5 minutes' walk from the beach.",
      "Consistently one of the highest-rated hostels in town — around 9.8/10 across booking sites.",
      "Daily surf lessons; a rooftop terrace, shared meals and a well-equipped kitchen.",
      "Honest gap: board/wetsuit rental isn't clearly documented — confirm with the house.",
      "Based on booking-aggregator scores and listings; individual recent review text was thin."
    ],
    verhaal: [
      `Dar Imim Surf House is the small-and-homely option in Taghazout — a cosy house of around 14 rooms, dorms and privates, with traditional Moroccan touches and a rooftop terrace looking out to sea. It sits in the village, about five minutes' walk from Taghazout Beach.`,
      `It rates extremely well — around 9.8/10 across the booking aggregators, regularly listed among the very top hostels in town. What comes through is the feel: clean, cosy, homely, with daily surf lessons, shared meals and easy movie nights that pull people together. There's a well-equipped kitchen if you'd rather self-cater.`,
      `The honest fine print: the high score rests mostly on aggregator ratings rather than a deep trail of readable individual reviews, and one practical gap — board and wetsuit rental — isn't clearly documented, so confirm it with the house if you're not bringing gear.`
    ],
    lagen: [
      {
        titel: "The surf — spot & region",
        bron: "Area data and surf guides — not from the stay's reviews",
        inhoud: [
          { kop: "Location", tekst: `In Taghazout village, ~5 min walk from the village beach and close to the Taghazout skatepark. Hash Point and the northern points are within walking distance. Same regional pattern: winter bigger and more consistent, summer smaller and softer.` }
        ]
      },
      {
        titel: "The stay — Dar Imim Surf House",
        bron: "Booking-aggregator scores and listings; individual recent review text was thin.",
        inhoud: [
          { kop: "What it is", tekst: `A small, homely surf house — ~14 rooms, dorms and privates, a rooftop terrace and a shared kitchen. Daily surf lessons on-site; dorm beds from around €10.` },
          { kop: "The constants", tekst: `A homely, cosy feel and a consistently very high rating (~9.8/10). Daily lessons, shared meals and movie nights are what reviewers mention bringing people together.` },
          { kop: "Who stays here", tekst: `A mix of beginners and more experienced surfers wanting a small, friendly base rather than a big social machine.` },
          { kop: "Weak spots", tekst: `The score rests more on aggregator ratings than a deep trail of readable reviews; board/wetsuit rental isn't clearly documented; it's small, so it can book out.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Anyone who wants a small, cosy, well-run base near the beach — beginner or beyond.",
    nietIdeaalAls: "You want a big social scene, or you need rental gear sorted in advance.",
    prices: {
      tier:        "comfortable",
      fromEUR:     18,
      toEUR:       80,
      unit:        "per night, dorm bed to comfort room",
      verified:    "2026-05",
      source:      "Booking.com checked 2026-05-19 (slug dar-imim-surf-house, Rle Mhand Idir, 80022 Taghazout). 1-2 Jun 2026, EUR: mixed/women's dorm bed €18-21 (Genius -10%), original €20-23. Aug 2026 comfort triple room ~€65-80/night (€473/week discounted)."
    },
    bookingUrl: "https://www.booking.com/hotel/ma/dar-imim-surf-house.html"
  },

  /* ===================== SURF SPOTS — TAMRAGHT ===================== */
  {
    id: "crocro",
    type: "spot",
    name: "Crocro",
    town: "Tamraght",
    tagline: "The most consistent beach break in the region — a wave almost every winter day.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5100, -9.6890],
    googleMapsQuery: "Tamraght crocro beach",
    coordsLabel: "Approximate — Crocro is a stretch of beach (~300 m north of Devil's Rock), not an exact break point. Navigate to 'Crocro / Imouran beach'.",
    photo: "",
    samenvatting: [
      "Soft sand-bottom beach break, lefts and rights (more lefts).",
      "Works almost every winter day — the most reliable of the Tamraght cluster.",
      "Beginner- to intermediate-friendly; lots of surf schools.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Crocro is where the surf schools stand in the morning: a soft sand-bottom beach break, forgiving when you're still falling. The name comes from the crocodile-shaped rocks at the north end of the beach.`,
      `It's the most consistent break in the Tamraght cluster — well exposed, so it picks up just about any NW swell. Not a spot to show off, but a spot to log hours.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Chest- to head-high and steady — works just about every day. Best with NE/E offshore wind, mid-to-high tide.` },
          { kop: "Low season · May–Sep", tekst: `Smaller and softer, an ideal learning ground. Summer wind more often messes up the beach.` }
        ]
      }
    ],
    condities: {
      golftype: "Beach break (sand bottom)",
      golfhoogte: "Chest- to head-high; bigger on winter swell",
      wind: "Offshore on NE/E — cleanest in the morning",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "Lots of surf schools, especially the south end. Quietest at sunrise." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Beach break (sand bottom)",
      bottom:     "Sand",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Welcoming. Beginner-friendly beach break with surf-school traffic; mixed local + visitor crowd, no localism reported.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Cafés in Tamraght village within walking distance; beach cafés nearby.",
      parking: "Informal along the road and by the beach camps.",
      verhuur: "Boards and wetsuits on the beach and by the car park, ~€10–15/day."
    },
    vergelijking: null,
    ideaalVoor: "Beginners and anyone catching their first green waves.",
    nietIdeaalAls: "You want power, empty line-ups or a challenge."
  },

  {
    id: "devils-rock",
    type: "spot",
    name: "Devil's Rock",
    town: "Tamraght",
    tagline: "Tamraght's home break — accessible, year-round, busier as the swell builds.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5069, -9.6882],
    googleMapsQuery: "https://maps.app.goo.gl/FR5RdEnCPepEexEw7",
    photo: "",
    samenvatting: [
      "Sand-bottom beach break under a distinctive rock formation; A-frames, lefts and rights.",
      "Surfable year-round; punchier and more consistent in winter.",
      "Beginner–intermediate; also one of the busiest spots in the village.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Devil's Rock is where Tamraght wakes up — a beach break right in front of the village, within walking distance of just about every stay. The accessible home break, which makes it the busiest too.`,
      `It's not a spot to show off, it's a spot to log hours. Beginners just off the whitewater and intermediates wanting to practise both do well here. On big swell (6 ft+) the beginners clear out and it gets heavier and emptier.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Picks up the winter Atlantic swell: punchier, more consistent, longer rides. surf-forecast: clean ~62% of the time in January. Best on NE offshore, mid tide.` },
          { kop: "Low season · May–Sep", tekst: `Smaller and friendlier — excellent for learning or making progress. Not recommended on big swell (it closes out then).` }
        ]
      }
    ],
    condities: {
      golftype: "Beach break (sand bottom), A-frame peaks",
      golfhoogte: "~1–2 m; punchy on winter swell, soft on small days",
      wind: "Offshore on NE; afternoon cross-shore chops it up",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "\"Always busy\", especially with schools on small days; the line-up spreads over 200–300 m of beach. Quiet at sunrise." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Beach break (sand bottom), A-frame peaks",
      bottom:     "Sand (A-frame peaks over sand bottom)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Mixed local + intermediate visitor crowd. Respectful sharing of the peaks; no significant localism reported in recent accounts.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Beach café on site; Resto Imouran and Chez Brahim on the beach; village close by.",
      parking: "By the beach/the rock; free for guests at the beachfront guesthouses.",
      verhuur: "Devil's Rock Surf Shop & village shops (Smiley, Quiver Point), ~€10–15/day."
    },
    vergelijking: null,
    ideaalVoor: "Beginners past the whitewater, and intermediates wanting to clock miles.",
    nietIdeaalAls: "You want power, quality and empty line-ups — or crowds put you off quickly."
  },

  {
    id: "spiders",
    type: "spot",
    name: "Spiders (14th km)",
    town: "Tamraght",
    tagline: "Shallow slab reef — fast, hollow rights. Advanced surfers only.",
    levels: ["advanced"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.5024, -9.6854],
    photo: "",
    // Not indexed as a named place on Google Maps — fall back to coord pin.
    googleMapsQuery: false,
    samenvatting: [
      "Shallow reef/slab — fast, hollow right-hand A-frames.",
      "Only works on swell above ~4 ft, low to mid-low tide.",
      "Expert-only: rocks, currents, shallow reef.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Spiders sits between Devil's Rock and Banana Point and is a different animal than the soft beach breaks beside it: a shallow slab reef that pitches fast, hollow rights. "Sucky", steep, over flat reef.`,
      `It doesn't break often — it really needs swell — and it's no place to learn. Rocks, rips, shallow: this is for people who know what they're doing.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `At its best — needs a solid NW-W winter swell of 4 ft+, low to mid-low tide. Then: draining barrels.` },
          { kop: "Low season · May–Sep", tekst: `Rarely works — too little swell. Not the reason to come in summer.` }
        ]
      }
    ],
    condities: {
      golftype: "Reef break / slab (flat reef)",
      golfhoogte: "From ~4 ft; doesn't work on small swell",
      wind: "Offshore on E/NE",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "rustig", tekst: "Rarely works and it's a slab — seldom many people out." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Reef break / slab (flat reef)",
      bottom:     "Flat reef (shallow slab) — advanced only",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "low",
      localism:  "Advanced-only local crew. Few visitors attempt it; respect the locals' priority on this dangerous slab — show humility.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "No facilities on site; Tamraght village within walking distance.",
      parking: "Informal; walkable from Devil's Rock.",
      verhuur: "Via the shops and camps in Tamraght village."
    },
    vergelijking: null,
    ideaalVoor: "Advanced surfers after hollow, fast reef waves.",
    nietIdeaalAls: "You're a beginner or intermediate — this is no learning spot."
  },

  {
    id: "banana-point",
    type: "spot",
    name: "Banana Point",
    town: "Tamraght",
    tagline: "Long right-hand point break by the river mouth — a mini Anchor Point.",
    levels: ["intermediate", "advanced"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.5017, -9.6823],
    photo: "",
    samenvatting: [
      "Right-hand point break, sand-and-rock — long peeling rights, a mini Anchor Point.",
      "At its best on winter swell (Oct–Apr); summer is quieter and smaller.",
      "Beginner-friendly beach peaks when the point isn't working; the point itself is intermediate–advanced.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Banana Point sits by Aourir, at the end of Banana Beach, where the Oued Tamraght meets the sea. It's a longer right-hand point break — often described as a mini version of Anchor Point — sheltered from north wind by the rocky point.`,
      `When the point isn't working there are soft beach peaks where beginners can go. When the winter swell builds it becomes long, powerful rights that can quickly get (too) heavy. Honest downside: don't surf the river mouth right after heavy rain — runoff.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `At its best — long, orderly rights on winter swell, peaking Dec–Jan. surf-forecast: clean ~49% in December (roughly a coin-flip even in the best month).` },
          { kop: "Low season · May–Sep", tekst: `A good deal smaller and less consistent — then mostly a beginners' beach break.` }
        ]
      }
    ],
    condities: {
      golftype: "Point break (right), sand-and-rock bottom",
      golfhoogte: "Works from ~1.5–2 m; holds well on big swell",
      wind: "Offshore on E/SE — no shelter from cross-shore",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "Often packed on good days — a beginner magnet and lots of surf schools, weekday and weekend." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Point break (right), sand-and-rock bottom",
      bottom:     "Sand and rock (point break)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Mixed crowd, generally friendly. Surf schools share the wave with locals; no significant localism reported in recent reviews.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Banana stalls and cafés along the N1 near Aourir.",
      parking: "Cars park visibly by the spot; short walk to the water.",
      verhuur: "Via Tamraght/Aourir shops and the camps nearby."
    },
    vergelijking: null,
    ideaalVoor: "Intermediates wanting to ride long rights — and beginners on small days, on the beach peaks.",
    nietIdeaalAls: "You want quiet on a good day, or you're a complete beginner when the point is working."
  },

  {
    id: "banana-beach",
    type: "spot",
    name: "Banana Beach",
    town: "Tamraght",
    tagline: "The softest, most sheltered beginner wave in the region.",
    levels: ["beginner"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.4993, -9.6772],
    photo: "",
    samenvatting: [
      "Sand-bottom beach break, small and soft — super sheltered.",
      "The best place in the region to learn to stand up.",
      "The busiest of all, with beginners and schools.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Banana Beach sits right next to Banana Point: a sand-bottom beach break that's small, soft and super sheltered. "Simple mush" — and that's exactly the point.`,
      `This is where you learn to stand up. Nothing here for advanced surfers; for a first surf week it's just about ideal.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Reliable on NW swell, but stays small and forgiving — also a fallback when the bigger spots are too big.` },
          { kop: "Low season · May–Sep", tekst: `At its friendliest — small, soft, warm water. A learning ground par excellence.` }
        ]
      }
    ],
    condities: {
      golftype: "Beach break (sand bottom), very sheltered",
      golfhoogte: "Usually small and mushy; rides of 30–40 m",
      wind: "Heavily sheltered; high tide gives the cleanest little waves",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "Total-beginner central — lots of surf schools, busy on weekends." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Beach break (sand bottom), very sheltered",
      bottom:     "Sand (very sheltered)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Very welcoming. Beginner sandbar with multiple surf schools — no localism, expect a teaching atmosphere.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Aourir village with cafés and shops nearby.",
      parking: "By Aourir/the banana strip; informal.",
      verhuur: "Schools and rental on site at Aourir."
    },
    vergelijking: null,
    ideaalVoor: "True beginners standing on a board for the first time.",
    nietIdeaalAls: "You can already surf — you'll be bored here straight away."
  },

  {
    id: "k12",
    type: "spot",
    name: "K12 (Douze)",
    town: "Aourir",
    tagline: "A wide, forgiving reef peak in front of Aourir — rarely busy.",
    levels: ["intermediate"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.4952, -9.6782],
    photo: "",
    // KM-marker named — not on Google Maps as a named place.
    googleMapsQuery: false,
    samenvatting: [
      "A deep reef that behaves like a friendly beach break — wide, crumbly waves.",
      "Punchy but forgiving; lefts and rights.",
      "Rarely busy — the line-up spreads out comfortably.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `K12 — named after the kilometre marker on the N1 — sits in front of Aourir. It's a deep reef that behaves like a friendly beach break: wide, fat waves that crumble rather than pitch.`,
      `Punchy enough to be interesting, forgiving enough to practise on. And it's rarely busy — the line-up spreads out comfortably.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Works on NW swell, mid to high tide. Punchier and better defined than neighbouring K11.` },
          { kop: "Low season · May–Sep", tekst: `Quieter and smaller; surfable on the better days for anyone wanting to practise.` }
        ]
      }
    ],
    condities: {
      golftype: "Reef break (deep) — behaves like a beach break",
      golfhoogte: "Wide, fat waves; punchy but forgiving",
      wind: "Offshore on SE/E/NE",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "rustig", tekst: "Few surfers, weekday and weekend — the line-up spreads out." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Reef break (deep) — behaves like a beach break",
      bottom:     "Deep reef (behaves like beach break)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "low",
      localism:  "Welcoming. Forgiving deep-reef break popular with schools and intermediate visitors — no localism reported.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Cafés and shops in Aourir, close by.",
      parking: "Informal along the N1.",
      verhuur: "Via Tamraght/Aourir, ~10 min from the village center."
    },
    vergelijking: null,
    ideaalVoor: "Intermediates and seasoned beginners who want to practise calmly.",
    nietIdeaalAls: "You want crowded, powerful waves or a real challenge."
  },

  {
    id: "k11",
    type: "spot",
    name: "K11 (Onze)",
    town: "Aourir",
    tagline: "A left-hand reef that pitches — heavy, and it needs size.",
    levels: ["advanced"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.4915, -9.6768],
    // KM-marker named — not on Google Maps as a named place.
    googleMapsQuery: false,
    photo: "",
    samenvatting: [
      "Left-hand reef break — hollow, powerful, 'wedgy'; pitches fast and shallow.",
      "Needs size (from ~5–6 ft), high/mid tide.",
      "Rarely busy; some localism reported.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `K11, just south of K12, is a different register: a left-hand reef break that breaks hollow and pitchy — a "wedgy almond barrel", per the guides.`,
      `Sources differ — some also describe softer sand peaks around it — but the reef itself needs size and pitches fast and shallow. Some localism reported. Not your first reef break.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Comes to life on a solid NW winter swell of ~5–6 ft+, high to mid-rising tide.` },
          { kop: "Low season · May–Sep", tekst: `Usually too small to work as a reef — then at most the soft sand sections around it.` }
        ]
      }
    ],
    condities: {
      golftype: "Reef break (left) — hollow, pitchy",
      golfhoogte: "Works from ~1.5–2 m; holds well",
      wind: "Offshore on SE/E/NE",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "rustig", tekst: "Often pleasantly empty; some localism reported." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Reef break (left) — hollow, pitchy",
      bottom:     "Reef (left-hand, pitching)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "low",
      localism:  "Local crew on the inside, visitors share the outside. Respectful waiting in the line-up is expected.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Cafés and shops in Aourir, close by.",
      parking: "Informal along the N1.",
      verhuur: "Via Tamraght/Aourir, within walking distance."
    },
    vergelijking: null,
    ideaalVoor: "Advanced surfers after hollow left-hand reef waves.",
    nietIdeaalAls: "You're a beginner or intermediate — go for K12 or the beach breaks instead."
  },

  {
    id: "k17",
    type: "spot",
    name: "K17",
    town: "Tamraght",
    tagline: "A wide stretch of sand with multiple peaks — plenty of room, rarely packed.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5250, -9.7000],
    // KM-marker named — not indexed as a named place on Google Maps.
    googleMapsQuery: false,
    coordsLabel: "Approximate — K17 is a kilometre-long stretch of sand between Crocro and Panorama, not an exact break point. Navigate to the 17 km marker on the N1 / 'K17 surf'.",
    photo: "",
    samenvatting: [
      "A wide sand-bottom beach break with multiple peaks along a long beach.",
      "Good punch mid-winter; lots of whitewater in summer.",
      "Rarely packed — the long beach spreads everyone out.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `K17 is the long stretch of sand between Crocro and Panorama — named after the kilometre marker, ~17 km above Agadir. Not one wave, but multiple peaks spread over kilometres of beach.`,
      `That also makes it the least busy option of the cluster: there's always room. Mid-winter it has a good punch; in summer mostly whitewater — fine for practising.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Good punch on winter swell; multiple peaks, lefts and rights. Best on rising to high tide, offshore E wind.` },
          { kop: "Low season · May–Sep", tekst: `Lots of whitewater — lesson-friendly, a surf-school favourite (watch for loose boards).` }
        ]
      }
    ],
    condities: {
      golftype: "Beach break (sand bottom, some rocks), multiple peaks",
      golfhoogte: "Variable; good punch mid-winter, small/foamy in summer",
      wind: "Offshore on E; exposed beach",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "gemiddeld", tekst: "Wide beach with many peaks — everyone spreads out; rarely truly packed." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Beach break (sand bottom, some rocks), multiple peaks",
      bottom:     "Sand with some rocks",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "moderate",
      localism:  "Mixed crowd. Some local presence but no significant localism reported in recent accounts.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Limited on site — Tamraght village is the nearest option.",
      parking: "Informal along the N1.",
      verhuur: "Via Tamraght village, within walking/cycling distance."
    },
    vergelijking: null,
    ideaalVoor: "Beginners and intermediates who want room and want to avoid crowds.",
    nietIdeaalAls: "You want a defined, powerful wave — this is looser beach surf."
  },

  {
    id: "anza",
    type: "spot",
    name: "Anza",
    town: "Anza",
    tagline: "Sand-and-reef A-frames near Agadir — works when everything else is flat.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.4483998, -9.6612647],
    coordsLabel: "Google Maps-verified pin of Anza Beach itself.",
    photo: "",
    // Google indexes this break as "Anza Beach".
    googleMapsQuery: "Anza Beach Morocco",
    samenvatting: [
      "Sand-and-reef A-frames — picks up a lot of swell, works when other spots are flat.",
      "All levels: easy peaks through to shapier reef sections.",
      "Heads up — pollution: several reports of sewage and getting sick after surfing.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Anza sits about 10 minutes south of Tamraght, the first real break above Agadir. A mix of sand and reef bottom with A-frames, and it picks up so much swell that it works when other spots are flat.`,
      `One firm honest caveat: there are several reports of sewage/pollution and surfers getting sick after a session here. That belongs on the table — check the current situation before you paddle out.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Picks up a lot of swell — works even on smaller days. High tide, rising. A-frame: right over sand/reef, left over sand.` },
          { kop: "Low season · May–Sep", tekst: `Stays surfable thanks to its swell sensitivity; all levels.` }
        ]
      }
    ],
    condities: {
      golftype: "Beach + reef (sand-bar), A-frame peaks",
      golfhoogte: "From small; holds up to 3 m+",
      wind: "Offshore on SE/E",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "gemiddeld", tekst: "Popular with surf schools, but outside the main cluster — often a bit quieter." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Beach + reef (sand-bar), A-frame peaks",
      bottom:     "Sand-and-reef sandbar (A-frame peaks)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "moderate",
      localism:  "Friendly. Town beach near Agadir with surf-school traffic; mixed crowd, no localism reported.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Anza has a beachfront with cafés; closer to Agadir than to Taghazout.",
      parking: "By Anza beach.",
      verhuur: "Via surf houses in Anza (e.g. Blue Waves Surf House)."
    },
    vergelijking: null,
    ideaalVoor: "Anyone wanting a swell-sensitive spot that gives something on almost any day, at any level.",
    nietIdeaalAls: "You're sensitive to water quality — take the pollution reports seriously."
  },

  /* ===================== SURF SPOTS — TAGHAZOUT ===================== */
  {
    id: "anchor-point",
    type: "spot",
    name: "Anchor Point",
    town: "Taghazout",
    tagline: "Morocco's flagship — a right-hander that peels over a kilometre.",
    levels: ["intermediate", "advanced"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.5452, -9.7267],
    photo: "",
    samenvatting: [
      "The famous long right-hand point break — peels 500 m+ to a kilometre.",
      "Fast, hollow take-off; intermediate–advanced, no beginner spot.",
      "Busy on good days, also a spectator spot from the village rooftops.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Anchor Point is the wave Morocco is known for — a long right-hand point break peeling down an angled headland, over a kilometre on good days. Fast, hollow take-off, multiple sections, room for high-performance surfing.`,
      `It's "a victim of its own success": busy on good days, and even a spectator spot from the village's rooftop bars. No beginner wave — rocky jump-off, strong currents — but the sand bottom gives some margin.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `At its best — regularly 10–12 ft in winter, holds 16 ft+. Best on E/SE offshore, low to mid tide.` },
          { kop: "Low season · May–Sep", tekst: `Quieter and smaller; on the clean smaller days more accessible to experienced intermediates.` }
        ]
      }
    ],
    condities: {
      golftype: "Point break (right), sand-and-rock bottom",
      golfhoogte: "Works from ~1–1.5 m; regularly 10–12 ft in winter",
      wind: "Offshore on E/SE — \"grooms\" the wave",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "Very busy on good days; the long point spreads it somewhat. Quietest early and in low season." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Point break (right), sand-and-rock bottom",
      bottom:     "Sand and rock (right-hand point)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Busy international + local crew at peak swell. Locals respect skilled visitors; can be crowded but no outright hostility reported in recent reviews. Take your turn.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Rooftop cafés and bars in Taghazout village within walking distance.",
      parking: "Car park behind the old fish factory.",
      verhuur: "Surf shops in Taghazout (e.g. Surf Berbere, Surf Maroc, Atlantis)."
    },
    vergelijking: null,
    ideaalVoor: "Experienced intermediates and advanced surfers wanting to ride a long, powerful right.",
    nietIdeaalAls: "You're a beginner, or you want a quiet line-up on a good day."
  },

  {
    id: "hash-point",
    type: "spot",
    name: "Hash Point",
    town: "Taghazout",
    tagline: "Taghazout's village break — out your door and into the water.",
    levels: ["beginner", "intermediate"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5443, -9.7118],
    googleMapsQuery: false,
    photo: "",
    samenvatting: [
      "Right-hand point break right at the north edge of the village — maximum accessibility.",
      "\"Wedgy,\" fat and lazy when small; faster and hollower with size.",
      "All levels; a classic first reef break for those progressing.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Hash Point is the de facto village break of Taghazout — right at the north edge of the village, by the fishermen's beach. You walk out your door and you're in the water.`,
      `When it's small it's "wedgy," fat and lazy — a classic first reef break for those coming off the beach breaks. With size it gets faster and hollower. Local groms surf it after school. One caveat: being in the village, slightly higher chance of polluted water.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Works from ~1–1.5 m up to 2 m+; with size faster and hollower. Works on all tides — watch the rocks at low tide.` },
          { kop: "Low season · May–Sep", tekst: `Often fat and mellow — an accessible learning ground on the rocks.` }
        ]
      }
    ],
    condities: {
      golftype: "Point break (right), sand-and-rock bottom",
      golfhoogte: "~1–2 m+; \"wedgy\", fat when small, hollower with size",
      wind: "Light offshore on E",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "Central location, very accessible — one of the busier spots; local groms after school." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Point break (right), sand-and-rock bottom",
      bottom:     "Sand and rock (point break)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Mixed crowd. The point-break culture means turn-taking matters — locals reward respectful priority.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Cafés and restaurants right in the village.",
      parking: "In the village; walk straight to the water.",
      verhuur: "Rental shops in Taghazout (e.g. Rasta, Yalla, Habo Surf Shop for beginner gear)."
    },
    vergelijking: null,
    ideaalVoor: "Beginners wanting their first reef break, and anyone after maximum convenience.",
    nietIdeaalAls: "You want quiet — it's one of the busiest, most accessible spots."
  },

  {
    id: "panorama",
    type: "spot",
    name: "Panorama",
    town: "Taghazout",
    tagline: "A versatile, forgiving point-and-beach mix at the south end of the village.",
    levels: ["beginner", "intermediate"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.5423, -9.7062],
    googleMapsQuery: false,
    coordsLabel: "Coordinate from two agreeing sources, but strikingly close to Mysteries' — possibly a database label error. Real-world anchor: Panorama's restaurant at the south end of Taghazout.",
    photo: "",
    samenvatting: [
      "Point-and-beach mix — long, soft rights; one of the most accessible points.",
      "Versatile: mellow for beginners, a quality wave at 5 ft+.",
      "Strong currents — asks for solid paddling.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Panorama sits at the south end of Taghazout, right in front of the restaurant of the same name. It's a mix: a long, soft right-hand point plus a beach break beside it, with lefts and rights.`,
      `One of the most accessible points in the region — mellow enough for beginners on the beach section, and a genuine quality wave at 5 ft+. Watch the current: it asks for solid paddling.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Works on small to medium NW pulses — the point on low tide, the beach sections on higher tide. Goes too fast if the swell gets too westerly.` },
          { kop: "Low season · May–Sep", tekst: `Quieter and smaller, but thanks to its versatility often still usable.` }
        ]
      }
    ],
    condities: {
      golftype: "Point + beach break, sand-and-rock bottom",
      golfhoogte: "From <1 m up to 3 m+ — mellow to quality shortboard wave",
      wind: "Cleanest with light offshore",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "gemiddeld", tekst: "Popular with beginners, longboarders and schools, but wide enough to spread out. Busier on weekends." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Point + beach break, sand-and-rock bottom",
      bottom:     "Sand and rock (point + beach mix)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "moderate",
      localism:  "Mixed local + visitor crowd. No significant localism reported in recent reviews.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Panorama's restaurant right at the spot; village restaurants nearby.",
      parking: "At the south end of Taghazout village; walkable.",
      verhuur: "Surf shops in Taghazout village."
    },
    vergelijking: null,
    ideaalVoor: "Beginners and intermediates who want one versatile, forgiving spot.",
    nietIdeaalAls: "You don't fancy a heavy paddle — the current is real."
  },

  {
    id: "mysteries",
    type: "spot",
    name: "Mysteries",
    town: "Taghazout",
    tagline: "Anchor Point's quieter neighbour — technical, slabby, less crowd.",
    levels: ["intermediate", "advanced"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.5428, -9.7064],
    googleMapsQuery: false,
    photo: "",
    samenvatting: [
      "Point break over reef plateau and sand — a technical, \"sucky\" take-off.",
      "Noticeably less busy than neighbouring Anchor Point.",
      "Intermediate–advanced; experts-only on big swell.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Mysteries sits ~100 m from Anchor Point and is its less-hyped, quieter neighbour. A point break over a mix of reef plateau and sand, with a technical, "sucky" and slabby take-off.`,
      `Precisely because it draws less attention, it's the go-to when Anchor Point is too crowded. But don't underestimate it — the take-off is technical, and on big swell it's expert territory.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Works from ~1–1.5 m; fires on big NW swells. Rides of 50–150 m, up to 300 m on good days. Mid to high tide best.` },
          { kop: "Low season · May–Sep", tekst: `Quieter and smaller — less reason to come specifically for it in summer.` }
        ]
      }
    ],
    condities: {
      golftype: "Point break (right), reef plateau + sand bottom",
      golfhoogte: "From ~1–1.5 m; slabby and thick with size",
      wind: "Offshore on E/SE",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "gemiddeld", tekst: "Noticeably less busy than Anchor Point — the quieter alternative right next door." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Point break (right), reef plateau + sand bottom",
      bottom:     "Reef plateau + sand",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "moderate",
      localism:  "Mostly local at the reef peak. Visitors expected to respect priority; no outright hostility reported but humility is the price of entry.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Taghazout village ~5 min walk away.",
      parking: "By Anchor Point / at the village edge; walk down the cliff.",
      verhuur: "Surf shops in Taghazout village."
    },
    vergelijking: null,
    ideaalVoor: "Intermediates–advanced surfers who want Taghazout point quality with less crowd.",
    nietIdeaalAls: "You're a beginner — the take-off is technical and slabby."
  },

  {
    id: "la-source",
    type: "spot",
    name: "La Source",
    town: "Taghazout",
    tagline: "A forgiving reef within walking distance — the overflow when Anchor Point is packed.",
    levels: ["intermediate"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.5489, -9.7332],
    googleMapsQuery: false,
    photo: "",
    samenvatting: [
      "Reef break with lefts and rights (A-frames) — short but forgiving.",
      "5 min from the village; a much-used overflow spot.",
      "Intermediate — not for complete beginners; avoid very low tide.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `La Source — named after a freshwater spring — sits between Killers and Anchor Point, about 5 minutes' walk from the village. A reef break with lefts and rights, often A-frames.`,
      `The rides are short, but the reef is relatively forgiving, and that makes it the classic overflow spot when Anchor Point is too crowded. Avoid very low tide though — the rock slab gets exposed.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Works on small to medium NW swell; chest- to head-high in winter, hollower at low tide.` },
          { kop: "Low season · May–Sep", tekst: `Quieter and smaller; usable on the better days.` }
        ]
      }
    ],
    condities: {
      golftype: "Reef break (hard rock), A-frames (lefts and rights)",
      golfhoogte: "Chest- to head-high; short rides (often <50 m)",
      wind: "Offshore on E/NE",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "gemiddeld", tekst: "Less intense than Anchor Point — but that's exactly why it's a popular overflow." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Reef break (hard rock), A-frames (lefts and rights)",
      bottom:     "Hard rock reef (A-frames)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "moderate",
      localism:  "Local + advanced visitor crew. Sharp reef + serious wave — show respect in the line-up; locals will return it.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Taghazout village ~5 min walk away.",
      parking: "Campervans park nearby; walkable from the village.",
      verhuur: "Surf shops in Taghazout village."
    },
    vergelijking: null,
    ideaalVoor: "Intermediates who want a forgiving reef close to the village.",
    nietIdeaalAls: "You're a complete beginner — a reef is no learning ground."
  },

  {
    id: "killer-point",
    type: "spot",
    name: "Killer Point",
    town: "Taghazout",
    tagline: "The swell magnet of the cape — powerful, and it holds the biggest swells.",
    levels: ["advanced"],
    goodMonths: [11,12,1,2,3],
    coords: [30.5502, -9.7399],
    googleMapsQuery: "https://maps.app.goo.gl/WNApE6NMKWADrYLf6",
    coordsLabel: "Two sources differ by ~300 m; both place it ~1 km north of Anchor Point on the cape. Navigate to ~30.549, -9.740, then walk the cliff.",
    photo: "",
    samenvatting: [
      "Right-hand point break on the cape — the region's big swell magnet.",
      "Needs size (from ~6–8 ft) and holds the biggest swells.",
      "Advanced: powerful, strong currents, sharp jump-off.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Killer Point — often just "Killers" — sits on the cape, about a kilometre north of Anchor Point. It's the big swell magnet: it opens up most to NW swell and holds the biggest waves in the region.`,
      `A long paddle (15–20 min at high tide) keeps the crowd down a bit; at low tide you scramble under the cliffs. But this is no place to learn — powerful, strong rips with size, a sharp rocky jump-off. Reef boots recommended.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `At its best — starts from ~6–8 ft, holds 13 ft+, peels up to 500 m. The spot for the big winter days.` },
          { kop: "Low season · May–Sep", tekst: `Usually too small — it really needs size to work.` }
        ]
      }
    ],
    condities: {
      golftype: "Point break (right), flat reef/rock",
      golfhoogte: "Needs ~6–8 ft+; holds the biggest (13 ft+)",
      wind: "Offshore on E; inside section sheltered from N wind at high tide",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "rustig", tekst: "The long paddle/scramble filters people; busy on really good days, and some localism." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Point break (right), flat reef/rock",
      bottom:     "Flat reef / rock (long right point)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "low",
      localism:  "Mostly local crew at the take-off. Long right point favors locals' positioning; visitors who wait their turn are tolerated. Don't drop in.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "No facilities on the cape — back in Taghazout village.",
      parking: "Dirt parking by the point, off the road.",
      verhuur: "In Taghazout village; bring reef boots."
    },
    vergelijking: null,
    ideaalVoor: "Advanced surfers who want to ride the big winter swells.",
    nietIdeaalAls: "You're a beginner or intermediate — this is firmly expert territory."
  },

  {
    id: "boilers",
    type: "spot",
    name: "Boilers",
    town: "Taghazout",
    tagline: "A remote reef by the lighthouse — stays clean when everything else blows out.",
    levels: ["advanced"],
    goodMonths: [11,12,1,2,3],
    coords: [30.6252, -9.8775],
    googleMapsQuery: "https://maps.app.goo.gl/7qV2vSE6FRRbSKSC6",
    photo: "",
    samenvatting: [
      "Right-hand reef break over boulders — ~35–45 min north of Taghazout.",
      "Picks up more swell than Anchor Point; stays clean thanks to a wind shadow.",
      "Expert-only: sea urchins, sharp rocks, tricky entry, currents.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `Boilers is the northernmost of the big spots — a right-hand reef break over boulders, near the Cap Ghir lighthouse, about 35–45 minutes' drive from Taghazout. Named after a shipwreck boiler in the bay.`,
      `It picks up more swell than Anchor Point and sits in a natural wind shadow from the Atlas foothills — it stays clean when other spots are already blowing out. But it's expert work: sea urchins, sharp rocks, a tricky entry and strong currents. Bring everything — there's nothing on site.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `At its best — works from ~1.5–2 m, holds 4 m+, prime 6–10 ft. Rarely offshore-wrong thanks to the wind shadow.` },
          { kop: "Low season · May–Sep", tekst: `Quieter; it needs a solid winter NW swell to really fire.` }
        ]
      }
    ],
    condities: {
      golftype: "Reef break (rock/boulders), right",
      golfhoogte: "Works from ~1.5–2 m; holds 4 m+, prime 6–10 ft",
      wind: "Offshore on E; sits in a wind shadow — \"rarely onshore\"",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "rustig", tekst: "The long drive thins the crowd; quiet midweek, busier when it fires." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Reef break (rock/boulders), right",
      bottom:     "Rock and boulders (reef, right)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "low",
      localism:  "Local crew protects the take-off. Remote, rocky, serious — visitors expected to read the line-up and not drop in. Historically known for stricter localism than other Taghazout spots.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "None — remote; bring food and water.",
      parking: "Parking on site (follow the road down where the shrub ends); watch for potholes.",
      verhuur: "None on site — bring everything from Taghazout."
    },
    vergelijking: null,
    ideaalVoor: "Advanced surfers who want a clean reef when the rest of the region blows out.",
    nietIdeaalAls: "You're beginner/intermediate, or you don't fancy a remote, sharp rock spot."
  },

  {
    id: "taghazout-beach",
    type: "spot",
    name: "Taghazout Beach",
    town: "Taghazout",
    tagline: "The village's learn-to-surf beach — soft rollers right below the old town.",
    levels: ["beginner"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.5415, -9.7100],
    googleMapsQuery: false,
    coordsLabel: "Approximate — this is the village beach itself (the strip with the colourful fishing boats), not a separate break point. Navigate to 'Taghazout beach'.",
    photo: "",
    samenvatting: [
      "Soft sand-bottom rollers and whitewater right below the village — the learn-to-surf beach.",
      "Small and mushy most of the year; rougher on winter swell.",
      "Packed with surf schools on the north side; the south stretch has more room.",
      "Source: surf guides and area data, no reviews."
    ],
    verhaal: [
      `The village beach of Taghazout — the strip with the colourful fishing boats, right below the old town — is where people learn to surf. Soft sand-bottom rollers and whitewater.`,
      `It's packed with surf schools, especially the north side by the village; the long stretch to the south has more room. Below the Surf Berbere café some hollower rights can pop up.`
    ],
    lagen: [
      {
        titel: "The surf",
        bron: "Surf guides and area data — no review source",
        inhoud: [
          { kop: "High season · Oct–Apr", tekst: `Bigger and messier on winter swells; stays largely lesson-friendly. Cleanest in the morning before the wind turns.` },
          { kop: "Low season · May–Sep", tekst: `Small and mushy — beginner scale, at its best as a learning ground.` }
        ]
      }
    ],
    condities: {
      golftype: "Beach break (sand bottom), soft rollers",
      golfhoogte: "Small and mushy most of the year; bigger mid-winter",
      wind: "Exposed — cleaner in the morning before the sea breeze builds",
      water: "~16–22 °C year-round; 3/2 wetsuit, 4/3 in Feb–March",
      drukte: { niveau: "druk", tekst: "Packed with surf schools on the north side; the south stretch has more room." }
    },
    // Stats block — see source attribution for derivation.
    stats: {
      chartType:  "wave",
      waveType:   "Beach break (sand bottom), soft rollers",
      bottom:     "Sand (soft rollers)",
      windDir:    "Trade winds — offshore in mornings, side-shore in afternoons",
      crowd:      "high",
      localism:  "Welcoming. Town beach with surf-school crowd; mixed visitor + local, no localism.",
      source:     "Wave: Windguru GFS-Wave 16km archive (Taghazout id 549853, Apr 2025–May 2026). Wind/gust/air: Open-Meteo historical GFS at 30.5469,-9.7256 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg, shared across the cluster). Water temp: Morocco Atlantic coast climatology.",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindKn:
        
        [6, 7, 8, 8, 8, 8, 6, 6, 6, 6, 6, 5],
      monthlyGustKn:
        
        [16, 17, 18, 19, 20, 20, 17, 16, 17, 16, 15, 14],
      
      
      monthlyWaveM:
      
      
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyDailyPeakKn:
        [22, 23, 24, 25, 26, 27, 22, 22, 22, 20, 20, 19],
      monthlyGustPeakKn:
        [45, 51, 44, 50, 45, 44, 38, 41, 44, 41, 44, 38],
      
      
      monthlyAirC:
      
      
        
        [20, 21, 21, 24, 25, 26, 31, 31, 28, 27, 24, 21],
      

      monthlyWaterC:
      
        [17, 17, 17, 18, 19, 20, 21, 22, 22, 21, 19, 18]
    },
    buurt: {
      eten: "Cafés and restaurants right on the seafront (incl. the Surf Berbere café).",
      parking: "In the village; everything is on the beach.",
      verhuur: "Surf schools and board rental along the seafront."
    },
    vergelijking: null,
    ideaalVoor: "Complete beginners and lessons — maximum convenience.",
    nietIdeaalAls: "You can already surf and want quality or quiet."
  },

  /* ===================== GREECE — east Crete (wind / wing / kite cluster) =====================
     Far-east Crete: Kouremenos Bay is the side-shore meltemi engine; spots fan out from there.
     LDW personally went windsurfing at Kouremenos. Other spots from public surf/wind/kite guides.
     Stays from recent reviews (TripAdvisor, BookSurfCamps, Booking — where readable).
     Bron-strength labelled: 🟢 SOLID = ≥2 independent sources; 🔴 SINGLE SOURCE = one source. */

  /* ----------------- SURF SPOTS — EAST CRETE ----------------- */
  {
    id: "kouremenos",
    type: "spot",
    country: "Greece",
    sports: ["wind", "wing"],
    name: "Kouremenos Beach",
    town: "Palekastro",
    tagline: "East Crete's meltemi engine — a 2 km bay that turns on with thermal side-shore wind nearly every summer afternoon.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.2058, 26.2706],
    coordsLabel: "OSM-verified center point of Kouremenos Beach — the bay itself runs ~2 km north–south.",
    photo: "",
    samenvatting: [
      "Long open bay (~2 km) — flat-to-chop on the inside, small wave on the outer reef.",
      "Side-shore meltemi wind (NNW–N) almost every summer afternoon, 15–28 kn typical.",
      "Two windsurf/wing/kite centers on the beach (see Surf centers below).",
      "Beginner-friendly inside, more swell + chop the further out you go.",
      "Bron-strength: 🟢 SOLID — multiple guides (Windfinder, Beach-Inspector, center sites) + LDW's first-hand visit."
    ],
    verhaal: [
      `Kouremenos is the reason windsurfers and wing-foilers come to far-east Crete. A ~2 km open bay facing east, framed by hills that funnel the meltemi (the summer NW thermal wind) straight along the coast as side-shore. From about June into September it blows almost every afternoon — strong enough for advanced sailors, manageable enough on the inside that beginners can learn here too.`,
      `The bay is shallow on the inside (flat to small chop, perfect for learning), with more swell building up further out. Two windsurf/wing/kite centers operate on the beach; both teach windsurfing and wing foiling, with rentals running alongside the lessons.`,
      `LDW went windsurfing here. The honest fine print: in the morning the wind can be flaky — Kouremenos is an afternoon spot. And the village (Palekastro) is 1.5 km inland — not on the beach itself.`
    ],
    lagen: [
      {
        titel: "The wind & water",
        bron: "Windfinder, Beach-Inspector & center sites — cross-checked with LDW's first-hand visit",
        inhoud: [
          { kop: "High season · Jun–Sep", tekst: `Meltemi side-shore from the NNW–N nearly every afternoon, ~15–28 kn. July–August the most reliable; June and September a touch lighter. Mornings often calm — this is an afternoon spot.` },
          { kop: "Shoulder · May & Oct", tekst: `Wind less reliable but still some good days; warmer water by late May.` },
          { kop: "Winter · Nov–Apr", tekst: `Cold and unstable — centers are closed.` }
        ]
      },
      {
        titel: "The region & getting there",
        bron: "Public travel guides, 2025–26",
        inhoud: [
          { kop: "Location", tekst: `Far east of Crete, ~165 km / ~2h15 from Heraklion airport; ~25 km from Sitia (regional airport). Palekastro village (with tavernas, mini-markets, accommodation) is 1.5 km inland.` },
          { kop: "Side trips", tekst: `Vai palm-tree beach (~10 km — a tourist beach, not a surf spot), Zakros Gorge hike (~30 min), Toplou Monastery, Itanos Minoan ruins.` }
        ]
      }
    ],
    condities: {
      golftype: "Open bay — flat-to-chop on the inside, small wave on the outer reef",
      golfhoogte: "Flat on the inside; ~0.5–1.5 m chop/wave further out on strong meltemi days",
      wind: "Side-shore NNW–N (meltemi), ~15–28 kn, mostly afternoons",
      water: "~19–25 °C in season; shorty or 3/2 May–Oct",
      drukte: { niveau: "gemiddeld", tekst: "Two centers share the beach; the bay is long enough to spread out, but the inside near the centers is the busiest." }
    },
    // Structured stats — used by the at-a-glance panel.
    // monthlyWindProb = % of days per month with at least one daytime hour
    // (10–18h) at ≥5 Bft (≥20 kn — proper sailing wind).
    // periods supply the narrative grouping + water/wave/wind-direction ranges
    // (reviewer-derived for the in-season months).
    stats: {
      windDir:    "NNW–N (side-shore) in summer · more westerly in winter",
      waveType:   "Flat inside · small wave on outer reef",
      bottom:     "Sand · rocky reef at the north end",
      crowd:      "moderate",
      localism:  "Friendly. International windsurf scene; centers actively welcome beginners. No reports of territorial behavior in recent reviews.",
      source:     "Wind/gust/air: Open-Meteo historical GFS at 35.2058,26.2706 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg). Water temp: East Crete Mediterranean climatology.",
      periods: [
        { name: "Peak",     months: [7, 8],     inSeason: true,
          windKn: [20, 28], waterC: [23, 25], waveM: [0.5, 1.5] },
        { name: "High",     months: [6, 9],     inSeason: true,
          windKn: [15, 24], waterC: [21, 23], waveM: [0.5, 1.2] },
        { name: "Shoulder", months: [5, 10],    inSeason: true,
          windKn: [10, 20], waterC: [19, 21], waveM: [0.3, 1.0] },
        { name: "Off",      months: [11, 12, 1, 2, 3, 4], inSeason: false,
          windKn: [8, 22],  waterC: [14, 17], waveM: null }
      ],
      // Per-month % of days with ≥4 Bft — Windguru Kouremenos archive 2019-2025.
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindProb:
        [0.52, 0.46, 0.55, 0.29, 0.26, 0.60, 0.42, 0.55, 0.53, 0.10, 0.13, 0.29],
      // Per-month avg wind in knots — weighted from Windguru Bft distribution.
      monthlyWindKn:
        
        [11, 12, 12, 11, 11, 14, 16, 13, 13, 11, 10, 10],
      // Per-month sea-water temperature in °C — typical East Crete coastal values.
      monthlyGustKn:
        
        [23, 25, 25, 24, 25, 29, 34, 29, 28, 25, 22, 21],
      monthlyDailyPeakKn:
        [28, 30, 29, 28, 29, 32, 36, 32, 31, 28, 26, 26],
      monthlyGustPeakKn:
        [52, 54, 53, 50, 50, 55, 52, 48, 47, 49, 49, 50],
      
      
      monthlyAirC:
      
      
        
        [15, 15, 16, 19, 23, 27, 29, 29, 27, 23, 20, 17],
      

      monthlyWaterC:
      
        [16, 15, 15, 16, 18, 22, 24, 25, 24, 22, 19, 17]
    },
    buurt: {
      eten: "A small beach taverna at the bay; more tavernas in Palekastro village 1.5 km inland.",
      parking: "Free along the beach road.",
      verhuur: "Two windsurf/wing/kite centers on the beach (gear + lessons) — see the Surf centers section."
    },
    vergelijking: null,
    ideaalVoor: "Windsurfers and wing-foilers of any level — beginners on the flat inside, advanced on the outer chop.",
    nietIdeaalAls: "You only have mornings free, or you want wave surfing (the swell is too small most of the time)."
  },

  {
    id: "tenda",
    type: "spot",
    country: "Greece",
    sports: ["wind"],
    name: "Tenda Beach",
    town: "Palekastro",
    tagline: "A remote freestyle-windsurf spot at the far-NE tip of Crete — ~15 km past Palekastro, past Vai, towards Cape Sidero.",
    levels: ["intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.2867921, 26.2888294],
    coordsLabel: "Verified via Google Maps pin (LDW). Remote rocky bay between Vai (~7 km south) and Cape Sidero, ~15 km from Palekastro.",
    photo: "",
    samenvatting: [
      "A remote rocky bay at the far north-east tip of Crete — 15 km from Palekastro, 7 km past Vai.",
      "Known among windsurfers as a freestyle spot — exposed to the meltemi, with both flat and wavy patches.",
      "No centers, no rental, no facilities — sailors travel here from Kouremenos when they want this kind of water.",
      "Bron-strength: 🟢 SOLID — crete-today, cretanbeaches.com & east-Crete wind guides all describe the same remote freestyle bay."
    ],
    verhaal: [
      `Tenda is not the neighbour of Kouremenos — it's a separate destination at the far north-eastern tip of Crete, about 15 km from Palekastro and 7 km past the Vai palm beach, on the road towards Cape Sidero. A remote rocky area, much quieter than Kouremenos, with the meltemi blowing straight in.`,
      `Among windsurfers it's known mainly as a freestyle spot — the west-facing bay (the one actually called Tenda) catches the wind and the chop, while the adjacent east bay (Eligas) tends to stay flatter. No centers, no rental, no taverna: you bring your own gear and drive out from Palekastro or Kouremenos for the day.`
    ],
    lagen: [
      {
        titel: "The wind",
        bron: "crete-today + cretanbeaches.com + east-Crete wind guides",
        inhoud: [
          { kop: "Pattern", tekst: `Exposed to the meltemi (N/NW) — same wind window as Kouremenos but in a remote, less-sheltered setting. The bay structure offers both wavy (Tenda) and flat (Eligas) options for freestyle sailors.` }
        ]
      }
    ],
    condities: {
      golftype: "Remote rocky bay — Tenda side wavy, Eligas side flatter",
      golfhoogte: "Choppy on strong meltemi days; flatter on the east side",
      wind: "N/NW meltemi, similar window to Kouremenos",
      water: "~19–25 °C in season",
      drukte: { niveau: "rustig", tekst: "Almost empty — remote, no infrastructure." }
    },
    stats: {
      windDir:    "N/NW (meltemi) — more exposed than Kouremenos",
      waveType:   "Choppy on Tenda side · flatter on Eligas side",
      bottom:     "Rocky bay",
      crowd:      "low",
      localism:  "Friendly but empty. Remote freestyle bay with almost no crew — you'll usually have it to yourself or share with a handful of experts.",
      source:     "Wind/gust/air: Open-Meteo historical GFS at 35.2868,26.2888 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg). Water temp: East Crete Mediterranean climatology.",
      periods: [
        { name: "Peak",     months: [7, 8],     inSeason: true,
          windKn: [18, 28], waterC: [23, 25], waveM: [0.5, 1.5] },
        { name: "High",     months: [6, 9],     inSeason: true,
          windKn: [13, 22], waterC: [21, 23], waveM: [0.3, 1.2] },
        { name: "Shoulder", months: [5, 10],    inSeason: true,
          windKn: [10, 18], waterC: [19, 21], waveM: [0.3, 1.0] },
        { name: "Off",      months: [11, 12, 1, 2, 3, 4], inSeason: false,
          windKn: [10, 22], waterC: [14, 17], waveM: null }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindProb:
        [0.48, 0.39, 0.52, 0.31, 0.28, 0.63, 0.45, 0.55, 0.50, 0.10, 0.13, 0.29],
      monthlyWindKn:
        
        [11, 12, 12, 11, 11, 14, 16, 13, 13, 11, 10, 10],
      monthlyGustKn:
        
        [23, 25, 25, 24, 25, 29, 34, 29, 28, 25, 22, 21],
      monthlyDailyPeakKn:
        [28, 30, 29, 28, 29, 32, 36, 32, 31, 28, 26, 26],
      monthlyGustPeakKn:
        [52, 54, 53, 50, 50, 55, 52, 48, 47, 49, 49, 50],
      
      
      monthlyAirC:
      
      
        
        [16, 15, 17, 20, 23, 28, 30, 30, 27, 24, 21, 17],
      

      monthlyWaterC:
      
        [16, 15, 15, 16, 18, 22, 24, 25, 24, 22, 19, 17]
    },
    buurt: {
      eten: "Nothing on the spot — pack your own; tavernas back in Palekastro village (~15 km).",
      parking: "Informal along the access track.",
      verhuur: "Nothing on site — bring your own gear (or rig at Kouremenos and drive)."
    },
    vergelijking: null,
    ideaalVoor: "Experienced freestyle windsurfers with their own gear, looking for a remote, quiet alternative to Kouremenos.",
    nietIdeaalAls: "You're learning, you don't have your own gear, or you want anything resembling infrastructure."
  },

  {
    id: "faneromeni",
    type: "spot",
    country: "Greece",
    sports: ["wind", "wave"],
    name: "Faneromeni (Papadiokambos)",
    town: "Sitia",
    tagline: "Called \"Greece's Pozo\" by locals — a serious mast-high wave spot west of Sitia, expert-only.",
    levels: ["advanced"],
    goodMonths: [10,11,12,1,2,3,7,8],
    coords: [35.22528, 26.0399513],
    coordsLabel: "Google Maps-verified pin of Papadiokampos Beach itself (Faneromeni's alternate name). The expert windsurf launch is on the peninsula reached by gravel road from here.",
    // Our name uses parens + an alternative spelling; Google indexes
    // this beach as "Papadiokampos Beach".
    googleMapsQuery: "Papadiokampos Beach Sitia Greece",
    photo: "",
    samenvatting: [
      "Crete's premier wave-sailing spot — called \"Greece's Pozo\" by locals.",
      "Mast-high waves not rare, especially in winter; meltemi has ~600 km of fetch into here.",
      "Expert-only: rocks in the water, strong currents, waves break very close to rocks.",
      "No facilities — gravel-road access from Papadiokambos village; small launch.",
      "Bron-strength: 🟢 SOLID — cretanbeaches.com, kite-and-windsurfing-guide, SURF magazine all describe the same heavy wave spot."
    ],
    verhaal: [
      `Faneromeni — also called Papadiokambos after the nearest hamlet — is the wave-sailing destination of Greece. Locals call it "Greece's Pozo". A few miles west of Sitia, with a peninsula sticking out into the Aegean and roughly 600 km of fetch behind the meltemi: when it goes off, the waves are mast-high.`,
      `This is not a place to "try wave sailing". Sources are unanimous: experts only. The waves break very close to rocks, there are rocks in the water, currents are strong, the launch is small, and there are no facilities at all. Take spare gear and shoes.`,
      `Wind window: meltemi-driven in summer (the stronger the better), and winter storms produce the biggest swell. Approach from Papadiokambos village — there's a gravel road out to the peninsula, with a known emergency exit ~200 m downwind of the little church.`
    ],
    lagen: [
      {
        titel: "The wave & wind",
        bron: "cretanbeaches.com + kite-and-windsurfing-guide + SURF magazine",
        inhoud: [
          { kop: "Pattern", tekst: `The stronger the meltemi (N/NNW), the bigger the wave. Long Aegean fetch builds serious swell — mast-high common in winter and on the biggest meltemi cycles in summer.` },
          { kop: "Hazards", tekst: `Rocks in the line-up, rocks very close to where waves break, strong currents, small launch, no on-site help. Don't go solo.` }
        ]
      }
    ],
    condities: {
      golftype: "Reef/rock wave spot, peninsula point",
      golfhoogte: "Logo- to mast-high on strong meltemi or winter swell",
      wind: "Side-on/side-shore meltemi (N/NNW); biggest after multi-day blow",
      water: "~19–25 °C summer; ~16–18 °C winter — 4/3 wetsuit in winter",
      drukte: { niveau: "rustig", tekst: "A small local + visiting expert crew only — this is not a beginner's beach." }
    },
    stats: {
      windDir:    "N/NNW (meltemi side-on / side-shore) — biggest wave after multi-day blow",
      waveType:   "Reef peninsula point — logo to mast-high on strong meltemi or winter swell",
      bottom:     "Rocks in the line-up and surface (hazardous launch)",
      crowd:      "low",
      localism:  "Small respectful expert crew. Few sailors travel here; those who do are advanced wave sailors who share the line-up. Strangers to the spot — read conditions before launching.",
      source:     "Wind/gust/air: Open-Meteo historical GFS at 35.2253,26.0400 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg). Water temp: East Crete Mediterranean climatology.",
      // Year-round operational (no centers to close) but emphasis split:
      // summer = sailable meltemi, winter = bigger storm swell for wave.
      periods: [
        { name: "Peak (wind)",   months: [7, 8],     inSeason: true,
          windKn: [14, 24], waterC: [23, 25], waveM: [1.0, 2.5] },
        { name: "High",          months: [6, 9],     inSeason: true,
          windKn: [13, 20], waterC: [21, 23], waveM: [0.8, 2.0] },
        { name: "Storm season",  months: [10, 11, 12, 1, 2, 3],  inSeason: true,
          windKn: [12, 24], waterC: [16, 19], waveM: [1.0, 3.5] },
        { name: "Shoulder",      months: [4, 5],     inSeason: true,
          windKn: [11, 18], waterC: [18, 20], waveM: [0.5, 1.5] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindProb:
        [0.39, 0.32, 0.35, 0.20, 0.17, 0.33, 0.19, 0.32, 0.50, 0.03, 0.07, 0.26],
      monthlyWindKn:
        
        [8, 9, 9, 7, 7, 9, 10, 9, 9, 8, 7, 8],
      monthlyGustKn:
        
        [20, 23, 22, 19, 20, 23, 26, 24, 23, 20, 19, 19],
      monthlyDailyPeakKn:
        [26, 28, 26, 24, 23, 25, 28, 26, 26, 23, 23, 23],
      monthlyGustPeakKn:
        [50, 53, 51, 51, 44, 42, 47, 40, 43, 44, 46, 42],
      
      
      monthlyAirC:
      
      
        
        [15, 15, 16, 20, 24, 27, 30, 30, 27, 23, 20, 17],
      

      monthlyWaterC:
      
        [16, 15, 15, 16, 18, 22, 24, 25, 24, 22, 19, 17]
    },
    buurt: {
      eten: "Nothing on the spot; tavernas in Papadiokambos hamlet and Sitia (~15 km east).",
      parking: "Gravel road out to the peninsula — informal.",
      verhuur: "Nothing on site — bring your own wave gear and spare equipment."
    },
    vergelijking: null,
    ideaalVoor: "Advanced wave-windsurfers travelling to Crete specifically for the wave; bring your own gear.",
    nietIdeaalAls: "You're anything less than confidently advanced in real wave conditions — this spot has hurt people."
  },

  /* Note: a "Sitia Beach (urban)" entry was removed at LDW's call — no
     Crete windsurf guide lists it as a spot, so an "if you're in town"
     framing didn't justify keeping it. The town beach exists, just not
     as a destination. */

  {
    id: "xerokampos",
    type: "spot",
    country: "Greece",
    sports: ["wind", "wave"],
    name: "Xerokampos",
    town: "Xerokampos",
    tagline: "Far-south-east Crete — a remote string of bays. Best on S/SW wind; meltemi blows fully offshore here (bad).",
    levels: ["intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10,11,12,1,2,3],
    coords: [35.0362258, 26.2195255],
    coordsLabel: "Google Maps-verified pin of Mazida Ammos beach — the main launch bay (~1 km south-west of Xerokampos hamlet).",
    photo: "",
    samenvatting: [
      "Remote far-south-east coast — quieter and emptier than the Palekastro cluster (~40 min drive south).",
      "Best on S wind: side-on from the right, deep chop and playful small waves.",
      "Real wave spot in winter — SW storms produce sideshore wind from the right.",
      "Meltemi (NW) blows fully offshore here — wrong wind for this coast. Complementary to Kouremenos.",
      "No centers, no rental, no facilities — bring your own gear.",
      "Bron-strength: 🟢 SOLID — surfingr.com, kite-and-windsurfing-guide, allincrete + windfinder all describe the same pattern."
    ],
    verhaal: [
      `Xerokampos sits on the far south-east tip of Crete — about a 40-min drive south of Palekastro through dramatic mountain road. A cluster of small bays (the main launch is Mazida Ammos / Amatou) with crystal water, fine white sand, and almost no infrastructure.`,
      `Wind window: this is a southern-shore spot, so the meltemi (the NW summer wind that makes Kouremenos work) blows fully offshore here — useless. Instead, Xerokampos comes alive on S wind days: side-on from the right, with deep chop and playful small waves. In winter, SW storms turn it into a real wave spot with sideshore wind, good for jumps and rides.`,
      `It's a "bring everything" spot: no centers, no rental, no beach café for kilometres. Worth it specifically on the wind days the rest of east Crete is flat.`
    ],
    lagen: [
      {
        titel: "The wind",
        bron: "surfingr.com + kite-and-windsurfing-guide.com + allincrete + windfinder",
        inhoud: [
          { kop: "Summer (S wind days)", tekst: `Side-on from the right; deep chop and playful small waves. Best when the meltemi is quiet up north.` },
          { kop: "Winter (SW storms)", tekst: `Real wave spot — sideshore from the right, conditions for jumping and riding.` },
          { kop: "What does NOT work", tekst: `Meltemi (NW) blows fully offshore here. Wrong wind for this coast.` }
        ]
      }
    ],
    condities: {
      golftype: "String of small bays; main launch Mazida Ammos / Amatou, exposed to the south",
      golfhoogte: "Small chop in summer on S days; real wave in winter SW storms",
      wind: "S side-on (summer) or SW sideshore (winter storms). Meltemi = offshore, no go.",
      water: "~20–26 °C in summer (warmer than the north)",
      drukte: { niveau: "rustig", tekst: "Empty — remote-end-of-Crete spot, very few sailors." }
    },
    stats: {
      windDir:    "S (summer) · SW (winter storms) — meltemi (NW) blows offshore here = no go",
      waveType:   "Open bays — small chop in summer S days, real wave in winter SW storms",
      bottom:     "Fine white sand",
      crowd:      "low",
      localism:  "Empty. Remote south-coast bays with almost no surf traffic. No localism reported, simply because there are rarely other people in the water.",
      // Open-Meteo accepts any lat/lon, so this now uses Xerokampos' own
      // coordinates — no more Ierapetra proxy needed.
      source:     "Wind/gust/air: Open-Meteo historical GFS at 35.0362,26.2195 (daytime 10–18h, 2021-05-16–2026-05-16, 5-year avg). Water temp: East Crete Mediterranean climatology.",
      // Inverted-season spot: summer = quiet, winter = best (storms).
      periods: [
        { name: "Storm season", months: [11, 12, 1, 2, 3],  inSeason: true,
          windKn: [12, 22], waterC: [17, 19], waveM: [1.0, 2.5] },
        { name: "Shoulder",     months: [4, 10],            inSeason: true,
          windKn: [10, 16], waterC: [19, 22], waveM: [0.3, 1.2] },
        { name: "Summer S",     months: [5, 6, 7, 8, 9],    inSeason: true,
          windKn: [8, 15],  waterC: [20, 26], waveM: [0.3, 0.8] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWindProb:
        [0.35, 0.18, 0.03, 0.09, 0.06, 0.13, 0.06, 0.00, 0.07, 0.10, 0.03, 0.10],
      monthlyWindKn:
        
        [10, 11, 10, 9, 9, 10, 12, 10, 10, 10, 9, 9],
      // South-coast Crete water — ~1-2°C warmer year-round than north coast.
      monthlyGustKn:
        
        [23, 25, 24, 21, 22, 25, 29, 24, 24, 23, 22, 21],
      monthlyDailyPeakKn:
        [29, 31, 28, 26, 26, 29, 32, 27, 28, 27, 26, 26],
      monthlyGustPeakKn:
        [59, 60, 56, 59, 53, 54, 55, 52, 53, 52, 53, 52],
      
      
      monthlyAirC:
      
      
        
        [15, 15, 17, 20, 24, 30, 32, 32, 28, 24, 21, 17],
      

      monthlyWaterC:
      
        [17, 16, 16, 18, 20, 24, 25, 26, 25, 23, 20, 18]
    },
    buurt: {
      eten: "A couple of tavernas in the small village; little else.",
      parking: "Along the beach road.",
      verhuur: "No dedicated rental — bring your own."
    },
    vergelijking: null,
    ideaalVoor: "Experienced sailors with their own gear who want quiet water and a different wind angle.",
    nietIdeaalAls: "You want infrastructure (centers, rental, cafés) or the classic meltemi blast — go to Kouremenos instead."
  },

  /* Note: an earlier "Istro Bay" wave-surf entry was removed — review with
     LDW found no verifiable source listing it as a surf spot. Crete is not
     a wave-surf destination; wave sailing happens at Faneromeni, not here. */

  /* ----------------- SURF CENTRES — EAST CRETE ----------------- */
  {
    id: "gone-surfing",
    type: "center",
    country: "Greece",
    sports: ["wind", "wing"],
    name: "Gone Surfing Crete",
    town: "Palekastro",
    tagline: "Christos and Maria's owner-run boutique center — TripAdvisor 4.9/5 over 195 reviews, pioneers of wing-foiling teaching in Greece since 2019.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    // Center inherits its at-a-glance stats from this spot (same beach).
    linkedSpotId: "kouremenos",
    coords: [35.207305, 26.2690837],
    coordsLabel: "Verified via Google Maps pin (LDW). Right on Kouremenos beach.",
    photo: "",
    bookingUrl: "https://gonesurfing.gr/home",
    diensten: {
      lessen: "Windsurfing, wing foiling, wind foiling, tandem windsurfing, SUP — beginners through advanced. Owners Christos and Maria teach personally; reviewers describe Christos as \"may speak less, but every piece of advice is invaluable\".",
      rental: "Windsurf, wing foil, SUP. \"Plenty to chose from, in fact you could swap and change as much as you wanted\" (2023 reviewer). Range of foil types, board sizes and wing sizes.",
      brands: "Fanatic boards + Duotone sails and wings — \"brand new\" per multiple 2024 reviewers; also some RRD foils. Replaced regularly.",
      faciliteiten: "Equipment storage; rescue boat on standby (reviewers specifically call this out — \"so you feel safe on the water\"). Open daily 10:00–20:00.",
      team: "Owners Christos + Maria (couple, run the center personally). Named across nearly every review. French-speaking seasonal staff often mentioned. \"Old-school spirit — generosity, helping others, sharing happiness\" (May 2025 reviewer)."
    },
    samenvatting: [
      "Owner-run boutique center at the south end of Kouremenos — \"at the end of the road\".",
      "TripAdvisor 4.9/5 over 195 reviews (#1 of 3 activities in Palekastro): 183 excellent, 7 good, 2 average, 3 poor, 0 terrible.",
      "Pioneers of wing-foiling teaching in Greece since 2019; Fanatic + Duotone (and RRD foil) kit refreshed regularly.",
      "Safety on point: rescue boat ready, instructor on the water during sessions. Bron-strength: 🟢 SOLID."
    ],
    verhaal: [
      `Gone Surfing is the owner-run center at the south end of Kouremenos beach, run by Christos and Maria. The TripAdvisor signal is exceptional: 4.9/5 over 195 reviews, ranked #1 of 3 activities in Palekastro. Distribution: 183 excellent, 7 good, just 5 reviews below "good" out of 195.`,
      `What recurs across reviews: warm welcome, "brand new" Fanatic/Duotone gear, the rescue boat watching over sessions, a "family" atmosphere. A French reviewer in 2025 calls it "an old-school spirit — where generosity, helping others, and sharing happiness are at the core of everything they do". Another notes "10 out of 10 from me" with the option to "swap and change [boards] as much as you wanted". The wind on Kouremenos itself is described as "reliable from 7:00 to 24:00 — no guessing, no waiting".`,
      `Honest minpunt: one 2-star review (July 2024) flagged a real friction. The multi-day package system locked bookings to specific boards regardless of wind that day, "not specified on their website". When the reviewer asked to switch, the comms felt unpleasant. They acknowledged the equipment was "very good" but recommended renting by the hour instead of packages if you want flexibility. This is one outlier in 195 reviews — but it's a specific, actionable warning if you tend to want flexibility.`
    ],
    lagen: [
      {
        titel: "The wind & water — Kouremenos region",
        bron: "Center site + TripAdvisor reviews + LDW first-hand visit",
        inhoud: [
          { kop: "Reliability", tekst: `Per a 2025 reviewer: "wind is reliable from 7:00 to 24:00 — no guessing, no waiting". Side-shore meltemi NNW–N nearly every summer afternoon, ~15–28 kn.` },
          { kop: "Safety", tekst: `Rescue boat on standby during sessions. A 2023 review notes: "They keep an eye on you and have a rescue boat ready, so you feel safe on the water". Not a spot for absolute beginners on big-wind days.` }
        ]
      },
      {
        titel: "The center — Gone Surfing",
        bron: "🟢 SOLID with strong recent coverage — gonesurfing.gr + TripAdvisor 4.9/5 (195 reviews, 8+ within last 4 years) + UK Windsurf magazine feature",
        inhoud: [
          { kop: "Offerings (own site + magazine feature)", tekst: `Small owner-run windsurf + wing foil center at the south end of Kouremenos. Owners Christos + Maria teach personally. Windsurfing, wing foiling, wind foiling, tandem windsurfing, SUP — all levels. Fanatic boards + Duotone sails/wings + RRD foils, refreshed regularly. Equipment storage. Rescue boat on standby. Open daily 10:00-20:00.` },
          { kop: "The constants (2023-2025 reviews)", tekst: `Warm welcome and equipment quality recur across recent reviews. "Brand new Duotone hardware" (2024). "Plenty to choose from, you could swap and change as much as you wanted" (Sep 2023). "10 out of 10 from me" (Sep 2023). "Old-school spirit — generosity, helping others, sharing happiness" (May 2025).` },
          { kop: "Pioneer status", tekst: `Among the first in Greece to introduce windsurf foiling; pioneers of wing-foiling teaching since 2019 (per their own site and UK Windsurf magazine feature).` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Wing-foilers and windsurfers wanting quality teaching, current foil gear and an intimate owner-run center; people who like a small \"know us by name\" vibe.",
    nietIdeaalAls: "You want maximum booking flexibility on multi-day packages (rent by the hour instead), or you want a big-station infrastructure (food, sun beds, bikes — the larger station on the beach fits that better).",
    prices: {
      tier:                  "comfortable",
      groupLessonEUR:        45,
      groupLessonNote:       "1h beginner group (2-3 people), material included",
      privateLessonHourEUR:  55,
      rentalDayEUR:          90,
      packageEUR:            345,
      packageDays:           7,
      packageNote:           "Standard windsurf rental 6-7 days; +10% for SLS/Slalom boards, -12% for beginner kit",
      unit:                  "per group lesson, 1h",
      verified:              "2026-05",
      source:                "gonesurfing.gr/windsurfing-lessons/ + gonesurfing.gr/en/windsurfing-rental — full published price list"
    },
  },

  {
    id: "freak-surf",
    type: "center",
    country: "Greece",
    sports: ["wind", "wing"],
    name: "Freak Surf (Freak Windsurf Station)",
    town: "Palekastro",
    tagline: "Established Kouremenos station — running since 2004; full beach setup, bikes, yoga, sister station in Dakhla.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    // Center inherits its at-a-glance stats from this spot (same beach).
    linkedSpotId: "kouremenos",
    coords: [35.206098, 26.269993],
    coordsLabel: "Verified via Google Maps pin (LDW). Right on Kouremenos beach; also signposted as \"Freak Windsurf & Bike Center\" on Google Maps.",
    photo: "",
    bookingUrl: "https://www.freak-surf.com/crete/",
    diensten: {
      lessen: "Windsurfing and wing foiling, all levels. International instructors teaching in five languages (Greek, German, English, French, Italian). Among the first stations worldwide to offer foil lessons.",
      rental: "JP Australia boards + NeilPryde sails (refreshed each season — \"selected and new sails every year\"). Wing foil gear current. Multiple sizes per board volume.",
      brands: "JP Australia + NeilPryde (NP) — established performance gear. Pioneer in adding foil setups to the rental fleet.",
      faciliteiten: "Beach amenities: showers, water fountain, sun beds, beach volleyball. Mountain bike rental, afternoon yoga classes. Trees provide shade on the beach. Evening entertainment in season.",
      team: "Owner: Hannes (responds personally to TripAdvisor reviews). Staff named in reviews include Aga and Pawel. Multi-year guests highlight the boss + team continuity. Always at least one staff member on \"baywatch\" rescue duty."
    },
    samenvatting: [
      "Established Kouremenos station — running since 2004; broadest beach infrastructure of the cluster.",
      "TripAdvisor 4.9/5 over 62 reviews (57 excellent, 3 good, 1 average, 1 poor, 0 terrible). Owner Hannes responds personally.",
      "Full beach: showers, sun beds, volleyball, mountain bikes, yoga. Five-language teaching (GR/DE/EN/FR/IT). Jet + motorboat rescue on standby.",
      "Sister station in Dakhla, Morocco — same brand, same teaching approach. Bron-strength: 🟢 SOLID."
    ],
    verhaal: [
      `Freak Surf — also signposted as Freak Windsurf Station — is the established player on Kouremenos beach, running since 2004 and rated 4.9/5 across 62 TripAdvisor reviews. Distribution: 57 excellent, 3 good, just 2 reviews below "good". Owner Hannes responds personally to reviews — a quiet sign of attentive operation.`,
      `What recurs across the readable reviews: the team's teaching quality, the rental gear (JP boards + NeilPryde sails, refreshed each season), and the safety setup — "jet and motorboat to rescue" per a traveler photo, "always a staff member on rescue duty" per a 2019 reviewer. The wind reliability gets specific endorsement: a Polish multi-year guest in 2020 reported "windy 28 days during a 30-day stay". Returning guests are common — "third year", "8 years", "every year".`,
      `Compared to the smaller owner-run center next door: this is the bigger, broader setup. Full beach infrastructure (showers, sun beds, volleyball court, mountain bike rental, yoga classes, evening entertainment) and a five-language team. The honest minpunt: one 4-star review (Aug 2020, Polish reviewer) flagged "wind gaps and gusts" — the spot itself isn't perfect, though the station does what's possible to make the most of it. Same brand also runs a sister station in Dakhla, Morocco — relevant cross-reference if you sail in both regions.`
    ],
    lagen: [
      {
        titel: "The wind & water — Kouremenos region",
        bron: "Center site + TripAdvisor reviews",
        inhoud: [
          { kop: "Reliability", tekst: `A Polish reviewer in 2020: "windy 28 days during a 30-day stay" with wind 18–40 knots. Side-shore meltemi NNW–N afternoons; "outstanding wind and spacious sailing conditions throughout the season" per the center's own pitch.` },
          { kop: "Safety", tekst: `Jet ski + motorboat rescue on standby (visible in traveler photos). One staff member always on baywatch. Reviewers explicitly call out feeling safe.` }
        ]
      },
      {
        titel: "The center — Freak Surf",
        bron: "🟡 MOSTLY SOLID, thinner recent window — freak-surf.com + TripAdvisor 4.9/5 (62 reviews total, only 2 within the last 4 years) + Boards Windsurfing + Greeka",
        inhoud: [
          { kop: "Offerings (own site + listings)", tekst: `Established windsurf + wing foil station on Kouremenos, running since 2004. Owner Hannes; staff names appearing in reviews include Aga + Pawel. Multi-language teaching (GR/DE/EN/FR/IT). JP Australia boards + NeilPryde sails. Showers, water fountain, sun beds, volleyball, mountain bike rental, afternoon yoga. Trees for shade.` },
          { kop: "The constants (recent reviews)", tekst: `Apr 2025 reviewer (third-year returning guest): "absolutely satisfied with the excellent and courteous service. Aga and Pawel try very hard". Aug 2024 reviewer: "Perfect flat water spot, well equipped rental with top gear, and super service".` },
          { kop: "Honest sourcing gap", tekst: `Only 2 of 62 TripAdvisor reviews are within the last 4 years. Most enthusiastic reviews ("windy 28 of 30 days", "best windsurfing base I've been in my life", "Hannes is the best") are 2019-2020 — outside the window. Hannes still responds personally to reviews on TripAdvisor (most recent owner response visible).` },
          { kop: "Sister station", tekst: `Same brand operates a windsurf station in Dakhla, Morocco (per their own site). If you've sailed Crete with them, the Dakhla setup is from the same operator.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Sailors wanting a full-service beach station with infrastructure (showers, food, sun beds, bikes, yoga, evening entertainment) and a wide multilingual team. Families and groups bringing non-sailing companions.",
    nietIdeaalAls: "You want a quiet, small, owner-run center — the other center on the beach fits that better.",
    prices: {
      tier:                 "comfortable",
      groupLessonEUR:       40,
      groupLessonNote:      "1h beginner group/semi-private, high season; €36-40 low season",
      privateLessonHourEUR: 60,
      rentalDayEUR:         70,
      packageEUR:           300,
      packageDays:          4,
      packageNote:          "4-hour beginner private course; advanced 4h = €350",
      unit:                 "per group lesson, 1h",
      verified:             "2026-05",
      source:               "freak-surf.com/crete/rentals/ — full price list published, low/high season tiers"
    },
  },

  /* ----------------- STAYS — EAST CRETE ----------------- */
  {
    id: "surf-beach-apartments",
    type: "stay",
    country: "Greece",
    sports: ["wind", "wing", "kite"],
    name: "Surf Beach Apartments",
    town: "Palekastro",
    tagline: "Directly in the middle of Kouremenos beach, next to Surf Beach Bar and the windsurf centers.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.205648, 26.269349],
    coordsLabel: "Verified via Google Maps pin. On Kouremenos beach itself, next to Surf Beach Bar.",
    photo: "",
    bookingUrl: "https://www.booking.com/hotel/gr/surf-beach-apartments.html",
    verblijf: {
      eten: "Self-catering studios with kitchenettes. Surf Beach Bar next door for breakfast/snacks; village supermarkets 1.5 km inland in Palekastro. Sun beds and BBQ facilities on site.",
      afstandSpot: "Zero — middle of Kouremenos beach, next door to the windsurf centers. Walk in your wetsuit.",
      verhuur: "Not run by the apartments — windsurf/wing/kite at the two centers on the same beach (see Surf centers).",
      lessen: "Not on site — via one of the centers on the beach.",
      rating: "Booking.com 9.1/10 \"Fantastisch\" over 30 reviews. Also listed on TripAdvisor, Hotels.com, Planet Windsurf Holidays and their own site (surfbeachapts.gr). Bron-strength: 🟢 SOLID.",
      sfeer: "Low-key, windsurfer/wing-foiler crowd. Not a camp — independent travellers who want to wake up to the wind.",
      activiteiten: "Wind sports first; bike rental on site; Vai (5 km), Zakros gorge, Sitia old town in day-trip range.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.0, hosts: 3.5, comfort: 4.0, cleanliness: 4.0, value: 4.0 },
      essence: { style: "Apartments", vibe: "Surfer crowd" }
    },
    samenvatting: [
      "Middle of Kouremenos beach — next door to Surf Beach Bar and the windsurf centers.",
      "Booking.com 9.1/10 \"Fantastisch\" over 30 reviews — the strongest Booking score among the cluster.",
      "Self-catering studios with kitchenette, AC, private bathroom, balcony. Sun terrace, garden, free WiFi.",
      "Pet-friendly; bike hire and BBQ on site.",
      "Listed across Booking, TripAdvisor, Hotels.com, Planet Windsurf. Bron-strength: 🟢 SOLID."
    ],
    verhaal: [
      `Surf Beach Apartments is exactly what the name promises — self-catering studios in the middle of Kouremenos beach, next door to the Surf Beach Bar and the windsurf centers. Booking.com rates it **9.1/10 "Fantastisch" across 30 reviews** — that's the strongest aggregate Booking score of any stay in this Kouremenos cluster, and Booking's score weights recent reviews more heavily, so the rating reflects current operation.`,
      `Offerings (per the property's own site and listings): kitchenette, AC, private bathroom, balcony in each studio; sun terrace, garden, beach access, free WiFi, bike hire, BBQ. Pets allowed on request. Location per their own description: "at the center of Kouremenos Beach next to Surf Beach Bar and windsurfing schools" — 1.5 km from Palekastro village, 5 km from Vai, 18 km from Sitia.`,
      `Honest fine print: we have the aggregate Booking score (9.1/30, fresh) but didn't read individual recent review texts in detail for this entry — so the picture of the experience is "consistently strong" rather than thematically distinct. This is not a surf camp: no in-house lessons or shared dinners; the wind side of the trip happens at one of the two centers on the beach. For food and groceries, the village is a short walk or drive inland.`
    ],
    lagen: [
      {
        titel: "The wind — Kouremenos region",
        bron: "Windfinder, Beach-Inspector, center sites + LDW's first-hand visit",
        inhoud: [
          { kop: "High season · Jun–Sep", tekst: `Side-shore meltemi NNW–N nearly every afternoon, ~15–28 kn. July–August the most reliable.` },
          { kop: "Mornings", tekst: `Often calm — Kouremenos is an afternoon spot.` },
          { kop: "Zero distance to the launch", tekst: `Of the five Kouremenos-area stays, this is the one with the most-direct on-beach access — walk to the center in a wetsuit.` }
        ]
      },
      {
        titel: "The stay — Surf Beach Apartments",
        bron: "🟢 SOLID aggregate-fresh — Booking.com 9.1/10 (30 reviews, recent-weighted) + surfbeachapts.gr + TripAdvisor + Hotels.com + Planet Windsurf",
        inhoud: [
          { kop: "Offerings", tekst: `Self-catering studios in the middle of Kouremenos beach. AC, kitchenette, balcony, private bathroom. Sun terrace, garden, BBQ, bike hire, free WiFi, free parking. Pets allowed on request. Children's facilities available.` },
          { kop: "The Booking signal", tekst: `9.1/10 over 30 reviews — strongest Booking score in the cluster, categorised as "Fantastisch". Booking weights recent reviews more heavily, so this score reflects current operation.` },
          { kop: "What we didn't do", tekst: `For this entry we relied on the aggregate Booking score rather than reading individual recent review texts. The picture is "consistently strong" without specific themes — fewer texture details than for Villa Amalia or Flamingo.` },
          { kop: "Who stays here", tekst: `Windsurfers, wing-foilers and independent travellers who want ON-the-beach access without a camp atmosphere.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Independent windsurfers/wing-foilers who want zero distance to the launch and the strongest Booking-verified rating in the cluster.",
    nietIdeaalAls: "You want a full surf-camp setup with lessons, food and group sessions included.",
    prices: {
      tier:        "comfortable",
      fromEUR:     110,
      toEUR:       135,
      unit:        "per night, sea-view apartment (2 adults)",
      verified:    "2026-05",
      source:      "Booking.com checked 2026-05-19 — Sep 2026 €896/week (€128/night) for sea-view apartment; Aug 2026 unavailable"
    },
  },

  {
    id: "akti-villas",
    type: "stay",
    country: "Greece",
    sports: ["wind", "wing", "kite"],
    name: "Akti Villas",
    town: "Palekastro",
    tagline: "Apartment-style villas right on Kouremenos beach — 30 m from the water, surrounded by olive trees.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.2151893, 26.2671377],
    coordsLabel: "Verified via Google Maps pin (LDW). Heads up: the property is currently signposted on Google Maps as \"Hotel Coast Village\" at this address — searching \"Akti Villas\" still resolves to the same spot.",
    photo: "",
    bookingUrl: "https://www.akti-villas.gr/",
    verblijf: {
      eten: "Self-catering — fully equipped kitchens in each villa (per the property's own site); small beach tavernas nearby; more in Palekastro village (~2 km inland).",
      afstandSpot: "30 m to the sand per akti-villas.gr; steps to the windsurf centers.",
      verhuur: "Not on site — windsurf/wing/kite gear at the two centers on Kouremenos beach (see Surf centers).",
      lessen: "Not on site — book through one of the centers on the beach.",
      rating: "TripAdvisor 4.4/5 over 10 reviews — but ALL reviews are from 2013-2017, pre-pandemic. No verifiable reviews from the last 4 years. Sub-scores (legacy): Cleanliness 5.0, Location 4.8, Value 4.8, Rooms 3.8, Sleep Quality 3.7. Not on Booking.com. Bron-strength: 🔴 STALE — current operation unverified; treat below picture as historical.",
      sfeer: "Per the property's own site: \"a quiet and picturesque area in Kouremenos\", olive groves, family-friendly. Current vibe unverified — review trail stalled in 2017.",
      activiteiten: "Wind sports first; regional side trips per the property's own description (Vai 5 km, Erimoupolis, Itanos, Toplou Monastery).",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.0, hosts: 3.5, comfort: 3.0, cleanliness: 4.5, value: 4.0 },
      essence: { style: "Villa", vibe: "Family-friendly" }
    },
    samenvatting: [
      "Small villa cluster on Kouremenos beach with a swimming pool overlooking the windsurf bay (per the property's own site).",
      "⚠️ Review trail is stale: 10 TripAdvisor reviews, ALL from 2013-2017, none in the last 4 years. The 4.4/5 average is historical.",
      "On Google Maps now signposted as \"Hotel Coast Village\" at the same address — possibly under different management since the older review window.",
      "Not on Booking.com — booking is direct via akti-villas.gr or by phone.",
      "Bron-strength: 🔴 STALE — included as a known property with location verified by LDW's pin, but current experience unverified."
    ],
    verhaal: [
      `Akti Villas is on Kouremenos beach — that part is verifiable: LDW pinned the location, the property's own site describes "30 metres from the beach" in "a quiet and picturesque area in Kouremenos". It is the most poorly-sourced of the five Greek stays in this guide and we owe you full honesty about that.`,
      `The TripAdvisor review trail is 10 reviews, all between 2013 and May 2017 — nothing in the last 4 years. Those old reviews described a small villa cluster (5 units), well-equipped kitchens, a swimming pool overlooking the windsurf bay, daily cleaning, and consistent praise for cleanliness (5.0/5 sub-score). The 1-star outlier in that older trail was a booking-process complaint, not the property. But nine years is a long time. Furniture, ownership, even the property name on Google Maps may have changed since (see In short above).`,
      `Why we still include it: the location is verified and the property is operating (the own site is current, akti-villas.gr resolves and has 2024-style content). What we cannot do is tell you what staying there actually feels like in 2024-2026 — there are no recent guest voices to read. If you book, you'd be one of the first reviewers in years; treat it as an unknown that probably resembles its older description.`
    ],
    lagen: [
      {
        titel: "The wind — Kouremenos region",
        bron: "Windfinder, Beach-Inspector, center sites + LDW's first-hand visit",
        inhoud: [
          { kop: "High season · Jun–Sep", tekst: `Side-shore meltemi NNW–N nearly every afternoon, ~15–28 kn. Walk from the villas to the launch.` }
        ]
      },
      {
        titel: "The stay — Akti Villas (older sources only)",
        bron: "🔴 STALE — akti-villas.gr (own site, current) + TripAdvisor 4.4/5 (10 reviews, all 2013–2017) + east-Crete accommodation guides",
        inhoud: [
          { kop: "Offerings (from the own site)", tekst: `Five self-catering villas on Kouremenos beach. Swimming pool. Fully equipped kitchens. 30 m to the sea. Olive-grove setting.` },
          { kop: "What older reviews said (2013–2017)", tekst: `Cleanliness 5.0/5, Location 4.8, Value 4.8 across 10 reviews. "Brand new lux furniture", daily cleaning, friendly owners. Rooms (3.8) and Sleep Quality (3.7) the weaker sub-scores even then.` },
          { kop: "Why this is shaky", tekst: `Last review is May 2017 — nine years ago. The property is now signposted as "Hotel Coast Village" on Google Maps. Ownership or operation may have changed; we have no recent guest voices to confirm.` },
          { kop: "Booking", tekst: `Direct via akti-villas.gr — not listed on Booking.com.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Travellers willing to take a chance on a property with a great location but no recent review trail — and who want to book direct rather than via a platform.",
    nietIdeaalAls: "You want the picture grounded in recent guest experience — choose Villa Amalia, Surf Beach Apartments or Flamingo instead, each with 2022+ review coverage.",
    prices: {
      tier:        "premium",
      fromEUR:     null,
      toEUR:       null,
      unit:        "per night, studio (2 adults)",
      verified:    "2026-05",
      source:      "TODO — own site (akti-villas.gr) publishes no rates; Booking shows a different property called \"Kiani Akti Villas\" which LDW confirmed is NOT the same. Direct enquiry: +30 28430 61065 or virginie.tsantaki@gmail.com (wait — that\'s Villa Amalia, Akti Villas contact: from akti-villas.gr)."
    },
  },

  {
    id: "flamingo-apartments",
    type: "stay",
    country: "Greece",
    sports: ["wind", "wing", "kite"],
    name: "Flamingo Apartments",
    town: "Palekastro",
    tagline: "Family-run apartments in Agathia hamlet — \"the only sound is cicadas\" (2024 Booking reviewer); on-site gear storage for surf trips.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.1962405, 26.2638173],
    coordsLabel: "Verified via Google Maps pin. In Agathia hamlet (~900 m east of Palekastro village, on the road toward Kouremenos beach).",
    photo: "",
    bookingUrl: "https://www.booking.com/hotel/gr/flamengo-apartments.html",
    verblijf: {
      eten: "Self-catering apartments + studios with full kitchenettes (per the property site). Tavernas, mini-market and supermarket nearby; Palekastro center ~12 min walk.",
      afstandSpot: "Near Kouremenos beach (a short drive); Chiona beach ~1–2 km. Rooms 1–3 (first floor) have sea-view balconies toward Chiona per a 2025 TripAdvisor insider tip.",
      verhuur: "On-site windsurf and kitesurf gear storage (per the property site). Bicycle rental and car hire arranged.",
      lessen: "Not on site — book through one of the centers on Kouremenos.",
      rating: "Strong recent signal: 10 Booking reviews 2023-2025 (mostly 9.0-10.0). TripAdvisor 4.5/5 over 19 reviews (13 excellent, 4 good, 1 average, 1 poor) — #2 of 16 condos in Palekastro. TripAdvisor sub-scores: Cleanliness 5.0, Value 4.9, Service 4.8, Rooms 4.7. Bron-strength: 🟢 SOLID with recent coverage.",
      sfeer: "Quiet hamlet, family-run. Aug-2023 Booking reviewer: \"Kostas is a great host!\" — but a Jun-2025 TripAdvisor review reported Kostas had died and a daughter + Marianthi & Michalis had taken over; standard \"remains impeccably high\". 3-star Giata.",
      activiteiten: "Walking distance to Palekastro center (10–12 min); short drive to Chiona, Vai, the Minoan settlement. Bicycle rental on site. Pet-friendly.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.0, hosts: 4.5, comfort: 3.5, cleanliness: 5.0, value: 4.5 },
      essence: { style: "Apartments", vibe: "Quiet retreat" }
    },
    samenvatting: [
      "Family-run apartments in Agathia hamlet — between Palekastro village and Kouremenos beach, in the olive groves.",
      "Strong recent reviews: 10 Booking reviews 2023-2025 (mostly 9.0-10.0). TripAdvisor 4.5/5 over 19 reviews; #2 of 16 condos in Palekastro.",
      "Ownership in transition: an Aug-2023 Booking review still named host Kostas; a Jun-2025 TripAdvisor review reported he had died and his daughter + Marianthi & Michalis had taken over.",
      "Practical bonus: on-site windsurf and kitesurf gear storage (per the property site) — useful if you fly in with your own kit.",
      "Honest minpunten from 2024-2025 Booking reviews: AC noise (Sep 2024), WiFi reliability, air circulation."
    ],
    verhaal: [
      `Flamingo Apartments is a family-run accommodation in the small hamlet of Agathia, between Palekastro center and Kouremenos beach. Recent Booking reviews paint a quiet, garden-and-views picture. An Aug 2023 reviewer (score 9.0): "Location in the silent village of Agathia where the only sound is cicadas... the great view on the olive trees". A 2024 UK reviewer (9.0): "exceptionally clean, and functional, great view from balcony. Hotel owner was so welcoming". A 2024 Spanish reviewer (10): "The owners were so sweet and nice".`,
      `On hosts and ownership transition: an Aug 2023 Booking reviewer wrote "Kostas is a great host!" — but a Jun 2025 TripAdvisor reviewer reported "After the sad death of Kostas, his daughter and the couple Marianthi and Michalis have taken over. The standard remains impeccably high". So the transition is recent; Kostas — repeatedly described as the heart of the place in older reviews — was alive at least into mid-2023. The newer team is now operating.`,
      `Honest minpunten from 2024-2025 Booking reviews: a Sep 2024 reviewer flagged "het geluid van de airco" — AC noise — as their one negative. A UK 8.0 reviewer: "The WiFi was a bit problematic, especially getting the right code". A 2024 8.0 reviewer flagged air circulation. None are dealbreakers but they're real recurring practical points. Insider tip from a 2025 TripAdvisor reviewer: rooms 1-3 on the first floor have sea views toward Chiona; other rooms face a secluded garden.`
    ],
    lagen: [
      {
        titel: "The wind — Kouremenos region",
        bron: "Windfinder, Beach-Inspector, center sites + LDW's first-hand visit",
        inhoud: [
          { kop: "High season · Jun–Sep", tekst: `Side-shore meltemi NNW–N nearly every afternoon, ~15–28 kn. Drive ~2–3 km from Agathia to Kouremenos beach.` },
          { kop: "Why the location works", tekst: `Equidistant between Palekastro village (walkable for groceries and tavernas) and the wind. Plus on-site gear storage and bicycle rental.` }
        ]
      },
      {
        titel: "The stay — Flamingo Apartments",
        bron: "🟢 SOLID with recent coverage — Booking.com (10 reviews 2023-2025) + TripAdvisor 4.5/5 (19 reviews) + own site",
        inhoud: [
          { kop: "Offerings", tekst: `Family-run apartments (5-bed) and studios (3-bed) in Agathia hamlet, 7 rooms. Each: kitchenette, AC, fridge, balcony or veranda. Free WiFi, free parking. Pet-friendly. Bar/lounge on site. Languages: EN/GR/PL/RO.` },
          { kop: "The constants (recent reviews 2023-2025)", tekst: `Owners "sweet and nice" (2024 reviewer); rooms "exceptionally clean, great view from balcony" (2024 reviewer). Quiet hamlet with "only sound is cicadas" (Aug 2023 reviewer). Welcoming hosts cited repeatedly.` },
          { kop: "Ownership transition (recent)", tekst: `Aug 2023 Booking reviewer: "Kostas is a great host!" Jun 2025 TripAdvisor reviewer: "After the sad death of Kostas, his daughter and the couple Marianthi and Michalis have taken over. The standard remains impeccably high." Transition occurred 2023-2025.` },
          { kop: "Insider tip", tekst: `Rooms 1-3 on the first floor have sea-view balconies toward Chiona; other rooms face a sheltered garden (TripAdvisor reviewer tip).` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Sailors travelling with their own gear who want a family-run base, multilingual hosts, on-site bike rental, and a sea view from the first-floor rooms.",
    nietIdeaalAls: "You want to be ON the beach (it's a short drive) or you want a surf-camp atmosphere with lessons and shared dinners.",
    prices: {
      tier:        "comfortable",
      fromEUR:     65,
      toEUR:       75,
      unit:        "per night, studio (2 adults)",
      verified:    "2026-05",
      source:      "Booking.com checked 2026-05-19 via Chrome session — Aug 2026 €458/week discounted (€65/night) + June 2026 €469/week (€67/night)"
    },
  },

  {
    id: "villa-amalia",
    type: "stay",
    country: "Greece",
    sports: ["wind", "wing", "kite"],
    name: "Villa Amalia",
    town: "Palekastro",
    tagline: "Family-owned villas on the hillside above Kouremenos — five apartments + two rooms, panoramic bay view, returning-guest crowd.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.2194294, 26.2566817],
    coordsLabel: "Verified via Google Maps pin. On the hillside north of Palekastro, overlooking Kouremenos Beach.",
    photo: "",
    bookingUrl: "https://www.booking.com/hotel/gr/villa-amalia.html",
    verblijf: {
      eten: "Self-catering: five apartments + two rooms with fully equipped kitchenettes (per the property's own site). Multiple 2022+ Booking reviewers cite the garden, BBQ area and welcome arrivals.",
      afstandSpot: "~2 km from Kouremenos beach on the hillside — short drive down. 10 min drive to Vai (per a 2024 reviewer).",
      verhuur: "Not on site — windsurf/wing/kite at the centers on Kouremenos beach.",
      lessen: "Not on site — book through one of the centers on Kouremenos.",
      rating: "Strong recent signal: 10+ Booking reviews 2023-2026 (most 9.0-10.0). TripAdvisor 4.7/5 over 23 reviews (17 excellent, 6 good, 0 negative readable). Sub-scores 4.4-4.6. Bron-strength: 🟢 SOLID with recent coverage.",
      sfeer: "Recurring 2022+ themes: \"felt like home\", \"end of the world feel\" (secluded), gracious hosts. Returning-guest pattern alive in 2025 (one Aug 2025 reviewer: \"stayed last year, decided to return this year\").",
      activiteiten: "Walking/drive: Palekastro (2-3 km), Vai (10 min drive per Aug 2024 review), Chiona, Itanos, Toplou Monastery, Zakros Gorge.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.0, hosts: 5.0, comfort: 4.0, cleanliness: 4.0, value: 4.0 },
      essence: { style: "Apartments", vibe: "End of the world" }
    },
    samenvatting: [
      "Seven units (five apartments + two rooms) on the hillside above Kouremenos, family-owned since the original founders Yorgo & Amalia Katsikalakis opened it.",
      "Strong recent reviews: Booking has 10+ reviews from 2023-2026 (most 9.0-10.0). TripAdvisor 4.7/5 over 23 reviews overall.",
      "Returning-guest pattern still active in the 4-year window (Aug 2025 reviewer).",
      "The view is the pitch: every unit has its own balcony over Kouremenos windsurf bay (recurring across 2023-2026 reviews).",
      "Honest fine print: ownership may be in transition — Amalia + Yorgo still named in a Jul 2023 Booking review; a 2025 TripAdvisor reviewer described a hand-over to manageress Virginie + husband Manolis."
    ],
    verhaal: [
      `Villa Amalia is one of the best-sourced Greek stays in this guide. Recent Booking reviews run through January 2026; across 2022-2026 the picture is consistent: gracious hosts, balcony view of the bay, "felt like home" (Aug 2024), "absolutely beautiful... view from all units is fantastic" (Jan 2025), "personable, hospitable and gracious hosts" (Apr 2024). One returning guest (Aug 2025): "stayed last year, decided to return this year as well".`,
      `On hosts and ownership: the founders Yorgo & Amalia Katsikalakis are still being named in Booking reviews through July 2023 ("Amalia and Yorgo are perfect hosts!"). A 2025 TripAdvisor reviewer however described "the new manageress Virginie, and her husband Manolis, a professional photographer" taking over, with the standard "impeccably high". So there has been a management transition in the recent window; both names may currently appear on site.`,
      `Honest minpunten from recent reviews: a Sept 2025 reviewer scored 9.0 and described the location as "end of the world feel" — positive in their eyes (secluded), but a vibe-warning for guests who want bustle. The remote hillside means a drive to the beach. Pre-2022 reviewers flagged summer heat (paid AC at €5/day) and mosquitoes — neither contradicted in newer reviews, but neither specifically confirmed.`
    ],
    lagen: [
      {
        titel: "The wind — Kouremenos region",
        bron: "Windfinder, Beach-Inspector, center sites + LDW's first-hand visit",
        inhoud: [
          { kop: "High season · Jun–Sep", tekst: `Side-shore meltemi NNW–N nearly every afternoon, ~15–28 kn. Drive ~2 km down from the hillside to the beach.` },
          { kop: "Hillside view", tekst: `Per reviewers: each balcony overlooks the windsurf bay — you watch the wind fill in before driving down. Especially valued by non-sailing partners.` }
        ]
      },
      {
        titel: "The stay — Villa Amalia",
        bron: "🟢 SOLID with recent coverage — Booking.com (10+ reviews, 2023-2026) + TripAdvisor 4.7/5 (23 reviews) + BookSurfCamps + villa-amalia.com",
        inhoud: [
          { kop: "What it is (offerings)", tekst: `Family-owned hillside villa with 5 apartments + 2 rooms. Each unit: private balcony, kitchenette, AC, fridge. Free parking, free WiFi, BBQ area, mosquito nets, sun terrace.` },
          { kop: "The constants (recent reviews)", tekst: `View from balcony cited in nearly every 2023-2026 review. Hosts named warmly — Amalia + Yorgo still in 2023 Booking reviews; Virginie + Manolis described in a 2025 TripAdvisor review as new management. Welcome arrivals and BBQ garden recur.` },
          { kop: "Who stays here", tekst: `Returning guests common (one Aug 2025 reviewer: "stayed last year, decided to return"). Couples and small families wanting a panoramic perch above the bay. Multilingual: English, Greek.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Couples and small families wanting comfort, sea-view balconies and a quiet hillside perch above the bay. People who like a returning-guest atmosphere with named hosts.",
    nietIdeaalAls: "You want to be ON the beach (it's a 2 km drive down), or you find a remote setting isolating rather than charming.",
    prices: {
      tier:        "comfortable",
      fromEUR:     70,
      toEUR:       85,
      unit:        "per night, studio (2 adults)",
      verified:    "2026-05",
      source:      "Booking.com checked 2026-05-19 — Aug 2026 €511/week (€73/night) for studio with 1 double bed"
    },
  },

  {
    id: "kouremenos-beach-apartments",
    type: "stay",
    country: "Greece",
    sports: ["wind", "wing", "kite"],
    name: "Kouremenos Beach Apartments",
    town: "Palekastro",
    tagline: "Owner-run studios at the north end of Kouremenos bay — Nikos Hatzidakis + Katerina; also operate Rousolakos (set-back, with a pool).",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [5,6,7,8,9,10],
    coords: [35.211978, 26.2674592],
    coordsLabel: "Verified via Google Maps pin. At the north end of Kouremenos beach (~700 m north of the bay center).",
    bookingUrl: "https://www.booking.com/hotel/gr/kouremenos-beach-apartments.html",
    photo: "",
    verblijf: {
      eten: "Self-catering studios with kitchenettes (\"full equipment kitchen, modern\" per a May 2026 reviewer). Outdoor grill / fireplace on site. Beach taverna nearby; village restaurants 2–2.5 km inland.",
      afstandSpot: "On Kouremenos beach. A Sep 2023 reviewer: \"2 minuten lopen naar prachtig strand\" (2 min walk to a beautiful beach). The property is in the olive yard right behind the sand.",
      verhuur: "Not on site — windsurf/wing/kite at the centers on the same beach.",
      lessen: "Not on site — book through the centers.",
      rating: "4 recent Booking reviews (Sep 2023–May 2026), positive: \"location was awesome, hosts were lovely\" (Jul 2025), \"excellent apartment with full equipment kitchen, modern\" (May 2026). TripAdvisor 4.0/5 over 8 older reviews (newest 2021). Sub-scores (TA): Location 5.0, Cleanliness 4.5, Sleep Quality 4.3. Bron-strength: 🟢 SOLID with recent Booking coverage.",
      sfeer: "Quiet, owner-run, terrace \"out of the wind with sun/shade spot\" (Sep 2023 reviewer). Hosts described as \"lovely\" (Jul 2025). The same owners run Rousolakos Apartments (set back, with pool, near Chiona).",
      activiteiten: "Wind sports first; ancient Minoan town of Rousolakos nearby; Vai, Toplou Monastery, Kato Zakros Gorge in day-trip range.",
      // Inferred from the prose by Claude — refine if you disagree.
      scores: { food: 3.0, hosts: 4.5, comfort: 3.0, cleanliness: 4.0, value: 4.0 },
      essence: { style: "Apartments", vibe: "Quiet retreat" }
    },
    samenvatting: [
      "Owner-run beachfront studios on Kouremenos bay, set in an olive yard.",
      "Recent Booking signal: 4 reviews 2023-2026, all positive (hosts, location, refreshed kitchen).",
      "TripAdvisor 4.0/5 over 8 older reviews; Location sub-score 5.0; legacy 1-star outlier in the distribution.",
      "Hosts Nikos Hatzidakis + Katerina also run Rousolakos Apartments nearby (set back, with secluded pool, near Chiona beach).",
      "Honest minpunten: thin recent review base (4 reviews in 4 years); one 2025 reviewer flagged \"comfort on the bed\" as a low point."
    ],
    verhaal: [
      `Kouremenos Beach Apartments is owner-run by Nikos Hatzidakis and Katerina. The 4-year-window data is thinner than for Villa Amalia or Flamingo — 4 Booking reviews 2023-2026 — but consistent. A Jul 2025 reviewer: "Location was awesome, hosts were lovely, everything was completely perfect for us!" A May 2026 reviewer: "Excellent apartment with full equipment kitchen, modern".`,
      `The 2026 "modern" descriptor is worth noting — older TripAdvisor reviews (8 reviews, newest 2021) had given Rooms a 3.8/5 sub-score, suggesting a simple build. The 2026 review's wording suggests the apartments have been refreshed since. Location consistently praised (5.0/5 on TripAdvisor); a Sep 2023 reviewer specifically liked the terrace "out of the wind with sun/shade spot" and the "2 min walk" to the beach.`,
      `On the owners: a long-time returning visitor (2013 TripAdvisor review, outside our 4-year window) wrote that Nikos was "one of the most reliable people I have ever met" and described the dual offering — Kouremenos Beach Apartments on the bay PLUS Rousolakos Apartments set back from the sea with a secluded swimming pool, near Chiona beach and the ancient Minoan settlement. The host warmth still echoes in 2025 reviews ("hosts were lovely"). Honest minpunt from an Oct 2025 reviewer: bed comfort flagged as a low point.`
    ],
    lagen: [
      {
        titel: "The wind — Kouremenos region",
        bron: "Windfinder, Beach-Inspector, center sites + LDW's first-hand visit",
        inhoud: [
          { kop: "High season · Jun–Sep", tekst: `Side-shore meltemi NNW–N nearly every afternoon, ~15–28 kn. Beach is steps from the property.` },
          { kop: "On the beach", tekst: `\"2 min walk to beautiful beach\" (Sep 2023 reviewer). \"Mooi terras uit de wind\" — terrace sheltered from the wind, with sun/shade options.` }
        ]
      },
      {
        titel: "The stay — Kouremenos Beach Apartments",
        bron: "🟢 SOLID with recent coverage — Booking.com (4 reviews 2023-2026) + TripAdvisor 4.0/5 (8 older reviews)",
        inhoud: [
          { kop: "Offerings", tekst: `Owner-run beachfront studios in an olive yard. Kitchenettes (described \"modern\" in a May 2026 review), AC, fridge, outdoor grill. Pet-friendly. Free parking, free WiFi.` },
          { kop: "The owners (recent + historic)", tekst: `Nikos Hatzidakis and Katerina. Recent reviewers describe hosts as "lovely" (Jul 2025). The 2013 review (outside our window) called Nikos "one of the most reliable people I have ever met".` },
          { kop: "Sister property: Rousolakos", tekst: `Same owners run Rousolakos Apartments nearby — set back with a secluded pool, near Chiona beach and the Minoan ruins. Different vibe, same hosts.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Sailors who want to be on the bay with a beach grill and hands-on owners; people open to the sister Rousolakos option if they want a pool.",
    nietIdeaalAls: "You want the deepest recent review base in the cluster — choose Surf Beach (Booking 9.1/30), Flamingo (4.5/19) or Villa Amalia (10+ recent Booking) for stronger sourcing.",
    prices: {
      tier:        "comfortable",
      fromEUR:     80,
      toEUR:       95,
      unit:        "per night, studio (2 adults)",
      verified:    "2026-05",
      source:      "Booking.com checked 2026-05-19 — Sep 2026 from €332/4 nights (€83/night) for cheapest studio"
    },
  },

  /* ===================== BELGIUM — home break, told honestly =====================
     Not a destination — your home break. From the inland freshwater put in Deinze
     (where Lode learned to windsurf) to the kite + wing capital at Knokke. Cold,
     windy, no proper waves most of the year. Wave surfing exists but is occasional.
     Wind / wing / kite are the real story.
     Bron-strength labels:
       🟢 SOLID = ≥2 independent sources (LDW + official site or multiple guides)
       🟡 PARTIAL = climatology + area knowledge, individual spot reviews pending */

  /* ----------------- FLORIZOONE — Deinze (inland, freshwater) ----------------- */
  {
    id: "florizoone-deinze",
    type: "spot",
    country: "Belgium",
    sports: ["wind", "wing", "sup"],
    name: "Florizoone Surfput",
    town: "Deinze",
    tagline: "An old sand-extraction pit turned freshwater windsurf playground — the home base where Lode learned. Flat water, light to medium wind, no salt, no waves.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    coords: [50.9564, 3.5330],
    googleMapsQuery: false,
    coordsLabel: "Centroid of the Florizoone water surface — where OSM places its \"Windsurfing Deinze\" water-body label.",
    photo: "",
    samenvatting: [
      "Inland freshwater pit (formerly used for E17-highway sand), ~600 m × 300 m. Flat water, no chop.",
      "Lighter, more variable wind than the coast — perfect for learning windsurf, SUP foiling, wing.",
      "Home of Windsurfing Deinze (est. 1982). Member-driven club + school + beach bar.",
      "Bron-strength: 🟢 SOLID — windsurfingdeinze.be + langsdeleie.be + LDW first-hand: learned to windsurf here."
    ],
    verhaal: [
      `Florizoone isn't a "surf spot" in the destination sense. It's a freshwater put — left behind in the 1970s when sand was dug here for the E17 highway — that the original Windsurfing Deinze members took over in 1982. Today it's a 600 × 300 m flat-water playground with a clubhouse on the west bank.`,
      `The water is flat (no waves, no chop, no salt), the wind is lighter and more variable than the coast (you wait more, then it kicks for an afternoon). That makes it the ideal place to learn to windsurf — and to wing, SUP-foil, or skim — without the cold-water-and-current intimidation of the North Sea.`,
      `LDW learned here. The honest fine print: it's a put, not the sea. You won't get the wind hours or the wave-feel that the coast gives — but you also won't get cold, swept away, or knocked around. Most of Belgium's coastal windsurfers grew up on a water surface like this one.`
    ],
    lagen: [
      {
        titel: "The water & wind",
        bron: "windsurfingdeinze.be + climatological inland Belgium (5-year avg)",
        inhoud: [
          { kop: "Active season · May–Sep", tekst: `Clubhouse open weekends in May, Jun and Sep; daily in Jul–Aug, 13:30–19:00. Members can also use the water outside these hours. Light to medium wind (8–14 kn typical, occasional 20+ kn days), warm-water afternoons in summer.` },
          { kop: "Off-season · Oct–Apr", tekst: `Cold (5–10 °C water), club facilities mostly closed, but the put itself is open to members. Some experienced sailors do come out for the autumn-storm gusts.` }
        ]
      },
      {
        titel: "The site & club",
        bron: "windsurfingdeinze.be (own site, history page) + LDW first-hand",
        inhoud: [
          { kop: "What it is", tekst: `Freshwater put, ~600 × 300 m, with the Windsurfing Deinze clubhouse, bar ("Jardin Des Amis"), terrace and equipment storage on the west bank. Swimming is prohibited (per the club + the legal status of the water).` },
          { kop: "Who it's for", tekst: `Beginners — windsurf, wing, SUP lessons via the club. Intermediate freeriders who want a stress-free water surface to refine technique. Youth — the club runs a strong youth program with summer camps and weekly training (Wednesday afternoons).` }
        ]
      },
      {
        titel: "Getting there",
        bron: "NMBS/SNCB schedules + town info",
        inhoud: [
          { kop: "By car", tekst: `~10 min from the E17 (exit Deinze), 25 min from Ghent, 1 h from Brussels, 1 h from the Belgian coast. Free parking at the clubhouse on Oudenaardsesteenweg 225.` },
          { kop: "By train", tekst: `Deinze station (line Ghent–Kortrijk, 12 min from Ghent–Sint-Pieters) + ~15 min cycle or local bus to the put.` }
        ]
      }
    ],
    condities: {
      golftype: "None — flat freshwater put",
      golfhoogte: "Flat (no waves), occasional small wind-chop on big-wind days",
      wind: "Light to medium, mostly W–SW. Typical 8–14 kn, gusty 18–25 kn on autumn-storm days",
      water: "5 °C winter to ~22 °C late summer; freshwater, no current, no salt",
      drukte: { niveau: "rustig", tekst: "A club water surface — never a queue. Members + lesson groups share it, but the put is big enough to spread out." }
    },
    stats: {
      windDir:    "W–SW prevailing, more variable than the coast",
      waveType:   "None — flat freshwater",
      bottom:     "Sand (former extraction pit)",
      crowd:      "rustig",
      localism:  "Welcoming. A club-run water surface — instructors and members are there to teach and share. No territorial behaviour reported.",
      source:     "Wind / air / water: climatological inland-Belgium 5-year avg + Windsurfing Deinze own site for season + LDW first-hand.",
      periods: [
        { name: "Peak",     months: [5, 6, 9],    inSeason: true,
          windKn: [8, 14], waterC: [15, 22], waveM: null },
        { name: "High",     months: [7, 8],       inSeason: true,
          windKn: [7, 13], waterC: [19, 22], waveM: null },
        { name: "Shoulder", months: [4, 10],      inSeason: true,
          windKn: [9, 16], waterC: [10, 15], waveM: null },
        { name: "Off",      months: [11, 12, 1, 2, 3], inSeason: false,
          windKn: [10, 18], waterC: [5, 9],   waveM: null }
      ],
      monthlyWindProb:
        [0.40, 0.40, 0.40, 0.30, 0.30, 0.25, 0.20, 0.20, 0.30, 0.40, 0.40, 0.40],
      monthlyWindKn:
        [11, 11, 11, 10, 10, 9, 9, 9, 10, 11, 12, 11],
      monthlyGustKn:
        [22, 22, 22, 20, 19, 18, 17, 18, 19, 21, 23, 22],
      monthlyDailyPeakKn:
        [25, 24, 24, 22, 21, 20, 19, 20, 21, 23, 25, 24],
      monthlyGustPeakKn:
        [40, 38, 38, 33, 32, 30, 28, 30, 33, 36, 40, 39],
      monthlyAirC:
        [4, 5, 8, 11, 15, 18, 20, 20, 16, 12, 7, 4],
      monthlyWaterC:
        [6, 5, 7, 10, 14, 17, 19, 21, 18, 13, 9, 6],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "Beginner / intermediate windsurfers, wing-foilers, SUP-ers learning the basics in flat freshwater without coastal cold + current; youth + family-style training.",
    nietIdeaalAls: "You want wave riding, salt water, big-wind days, or a destination feel — it's an inland club put, not the sea."
  },

  /* ----------------- BELGIAN COAST — west to east ----------------- */

  {
    id: "de-panne-strand",
    type: "spot",
    country: "Belgium",
    sports: ["kite", "wing", "wind"],
    name: "De Panne Beach",
    town: "De Panne",
    tagline: "Westernmost beach on the Belgian coast — one of the widest at low tide, shallow shelf, big sky. Forgiving for kite + wing beginners.",
    levels: ["beginner", "intermediate"],
    goodMonths: [3,4,5,6,7,8,9,10,11],
    coords: [51.1051, 2.5952],
    googleMapsQuery: "Strand De Panne Belgium",
    coordsLabel: "Centre of De Panne beach near Zeedijk 90. Beach itself extends west to the French border (Bray-Dunes) and east toward Sint-Idesbald.",
    photo: "",
    samenvatting: [
      "Wide shallow beach, big tidal range — at low tide one of the widest sandflats of the coast.",
      "Best for kite + wing on W–NW winds. Plenty of space to launch + crash.",
      "Family beach feel, lower density of high-rises than the bigger resorts.",
      "Bron-strength: 🟡 PARTIAL — climatological wind data + general coastal knowledge."
    ],
    verhaal: [
      `De Panne is where the Belgian coast ends (or begins, depending on direction). Against the French border, with a wide flat sandy beach — kilometers across at low tide — and a shallow shelf that softens the swell. That makes it forgiving for kite + wing beginners: plenty of room to body-drag, water-start, lose control and recover, all without dodging crowds.`,
      `The wind is the draw: predominantly W–NW from the Atlantic, regular all year, more reliable than inland. The honest fine print: there's no real wave to speak of — small chop most days, bigger only on storm days. And the tidal range matters — at high tide there's less beach, at low tide you're walking a long way to the water.`
    ],
    lagen: [
      {
        titel: "Wind & water",
        bron: "Climatological Belgian-coast averages (5-year avg)",
        inhoud: [
          { kop: "Best months · Sep–Mar", tekst: `Strongest, most reliable winds. Cold water (6–10 °C) — full 5/4 or 5/3 wetsuit. Surf-shop rentals + clubs gear-up accordingly.` },
          { kop: "Summer · Jun–Aug", tekst: `Lighter winds, warmer water (16–18 °C). Busier beach with non-watersport tourists — pick a quieter zone.` }
        ]
      },
      {
        titel: "Getting there",
        bron: "NMBS/SNCB + Kusttram schedules",
        inhoud: [
          { kop: "By car / train", tekst: `Train: De Panne is the terminus of a direct Brussels line (~2 h). From the station, 5-min tram or 20-min walk to the beach. Car: ~1 h 45 from Brussels via E40.` }
        ]
      }
    ],
    condities: {
      golftype: "Wind chop, occasional small wave on storm days",
      golfhoogte: "0.3–1.0 m typical chop, 1.5 m+ on big-wind days",
      wind: "W–NW prevailing, 12–20 kn typical, 25+ kn winter gusts",
      water: "6 °C winter to ~18 °C late summer, North Sea, salty",
      drukte: { niveau: "gemiddeld", tekst: "Wide beach absorbs crowds. Busiest in school holidays + warm summer weekends; quieter early-morning + off-season." }
    },
    stats: {
      windDir:    "W–NW prevailing, more N in winter",
      waveType:   "Mostly wind-chop; occasional small wave on storm days",
      bottom:     "Sand — shallow shelf, gentle slope",
      crowd:      "moderate",
      localism:  "Welcoming, no territorial scene reported.",
      source:     "Wind / wave / temp: climatological Belgian-coast (Open-Meteo style) 5-year avg. Tidal range: KMI Belgian coast tides.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.6, 1.4] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.5, 1.2] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.4, 1.0] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.8] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.7, 1.5] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.2, 1.0, 1.0, 0.7, 0.6, 0.5, 0.5, 0.5, 0.7, 0.9, 1.1, 1.2],
      monthlySwellProb:
        [0.40, 0.35, 0.30, 0.20, 0.15, 0.10, 0.10, 0.10, 0.20, 0.30, 0.40, 0.45],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "Kite + wing beginners and intermediates, families wanting beach + watersport mix, anyone after a wide quiet beach away from the bigger resorts.",
    nietIdeaalAls: "You're chasing waves (rare here) or you want a busy boardwalk culture — De Panne is mellower."
  },

  {
    id: "nieuwpoort-strand",
    type: "spot",
    country: "Belgium",
    sports: ["wind", "kite", "wing", "wave"],
    name: "Nieuwpoort-Bad",
    town: "Nieuwpoort",
    tagline: "Where the Yser meets the sea — the harbour mouth funnels wind, and the bar near the piers occasionally produces actual rideable waves on big-NW days.",
    levels: ["intermediate", "advanced"],
    goodMonths: [3,4,5,6,7,8,9,10,11],
    coords: [51.1478, 2.7157],
    coordsLabel: "Centre of Nieuwpoort-Bad beachfront. Wave + harbour-mouth zone is just west, by the East and West piers.",
    photo: "",
    samenvatting: [
      "Harbour mouth + piers create funnelled wind and the only place on the Belgian coast with a real (if small + rare) breaking wave.",
      "Sailing roots run deep — the largest marina in northern Europe is here.",
      "Wind windward of the piers is clean; the lee zone is sheltered for beginners.",
      "Bron-strength: 🟡 PARTIAL — climatology + multi-source coastal-Belgium kite/wind guides."
    ],
    verhaal: [
      `Nieuwpoort is the multi-discipline node on the Belgian coast. The Yser river opens here, the largest marina of northern Europe sits in the harbour, and the two piers (East and West) shape the wind in distinctive ways. Side of the piers facing the prevailing W–NW wind: clean lines, used by experienced kite + wind sailors. Lee side: sheltered, good for beginners.`,
      `The honest unusual thing about Nieuwpoort is the wave. On big NW storm days, a real ridable wave breaks on the bar near the harbour mouth. It's small (often <1.5 m), shifty, and rare — but it exists. Local wave-surfers know the windows. For everything else (kite, wing, wind), the regular Belgian-coast wind is the bread and butter.`
    ],
    lagen: [
      {
        titel: "Wind & water",
        bron: "Climatological Belgian-coast averages + multi-source kite/wind guides",
        inhoud: [
          { kop: "Best wind", tekst: `Side-shore to onshore W–NW, funnelled by the piers. Sep–Mar windiest, Jun–Aug lighter and warmer.` },
          { kop: "Wave windows", tekst: `Rare. On strong NW storms (~3+ days a year) the bar near the harbour mouth produces a small breaking wave. Otherwise: chop on bigger days, flat on lighter days.` }
        ]
      },
      {
        titel: "Getting there",
        bron: "NMBS/SNCB + Kusttram schedules",
        inhoud: [
          { kop: "By car / tram", tekst: `No direct train station — De Panne (15 min by tram) or Oostende (20 min) are the rail hubs. Kusttram along the seafront. Car: ~1h40 from Brussels.` }
        ]
      }
    ],
    condities: {
      golftype: "Wind-chop on bigger days; rare small bar-break on NW storm windows",
      golfhoogte: "0.4–1.2 m typical chop; up to 1.5 m on NW storms",
      wind: "W–NW prevailing, side-shore to onshore. Pier-funnelled, gusty close to the piers",
      water: "6 °C winter to ~18 °C late summer, North Sea, salty",
      drukte: { niveau: "gemiddeld", tekst: "Resort beach gets busy in summer; the harbour-mouth side (wind/kite zone) stays quieter year-round." }
    },
    stats: {
      windDir:    "W–NW prevailing, side-shore to onshore",
      waveType:   "Wind-chop primarily; rare small bar-break on NW storms",
      bottom:     "Sand — sandbar near harbour mouth",
      crowd:      "moderate",
      localism:  "Wave-surf community small + tight on the rare wave windows; otherwise welcoming.",
      source:     "Wind / wave / temp: climatological Belgian-coast 5-year avg. Wave windows: multi-source local kite/wind guides.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.6, 1.4] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.5, 1.2] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.4, 1.0] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.8] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.7, 1.5] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.2, 1.0, 1.0, 0.7, 0.6, 0.5, 0.5, 0.5, 0.7, 0.9, 1.1, 1.2],
      monthlySwellProb:
        [0.40, 0.35, 0.30, 0.20, 0.15, 0.10, 0.10, 0.10, 0.20, 0.30, 0.40, 0.45],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "Intermediate / advanced wind + kite sailors who like a place with character, sailors after the funnelled-pier breeze, anyone hunting the rare Belgian wave.",
    nietIdeaalAls: "You're a total beginner who needs a wide forgiving beach with no piers (try De Panne) — Nieuwpoort can be gusty near the piers."
  },

  {
    id: "westende-strand",
    type: "spot",
    country: "Belgium",
    sports: ["wind", "kite", "wing"],
    name: "Westende-Bad",
    town: "Westende",
    tagline: "Quieter than Oostende, mellower than Knokke — a wide family beach with a long-running club (Surfclub De Kwinte) and steady west winds.",
    levels: ["beginner", "intermediate"],
    goodMonths: [4,5,6,7,8,9,10],
    coords: [51.1697, 2.7757],
    coordsLabel: "Centre of Westende-Bad beach, Middelkerke municipality.",
    photo: "",
    samenvatting: [
      "Family-beach feel — lower density of high-rises than Oostende.",
      "Surfclub De Kwinte teaches windsurf, kite, SUP and land-yacht here.",
      "Steady W–NW wind, wide sandy beach, manageable for learners.",
      "Bron-strength: 🟡 PARTIAL — climatology + local club presence."
    ],
    verhaal: [
      `Westende is the lower-key middle of the coast. Between the bigger resorts (Oostende, Nieuwpoort), but quieter. A wide flat beach, family-friendly, with Surfclub De Kwinte teaching windsurf + kite + SUP + the more obscure land-yachting on the harder sand at low tide.`,
      `The wind story is the standard Belgian-coast one: W–NW prevailing, Sep–Mar windiest. The beach itself is forgiving — wide enough to launch a kite or rig a sail without bumping into beach-day crowds, especially outside school holidays.`
    ],
    lagen: [
      {
        titel: "Wind & water",
        bron: "Climatological Belgian-coast averages",
        inhoud: [
          { kop: "Best wind", tekst: `W–NW prevailing, side-shore to onshore. Strongest in Sep–Mar, lighter Jun–Aug.` },
          { kop: "Bottom + tide", tekst: `Sandy bottom, gentle shelf. Tide range ~4-5 m — beach width varies a lot between high and low.` }
        ]
      }
    ],
    condities: {
      golftype: "Wind-chop primarily",
      golfhoogte: "0.3–1.0 m typical",
      wind: "W–NW prevailing, 10–18 kn typical",
      water: "6 °C winter to ~18 °C late summer",
      drukte: { niveau: "rustig", tekst: "Quieter than the bigger resorts — Surfclub De Kwinte attracts a friendly local + family crowd." }
    },
    stats: {
      windDir:    "W–NW prevailing",
      waveType:   "Wind-chop",
      bottom:     "Sand, shallow shelf",
      crowd:      "low",
      localism:  "Welcoming family beach + club. No territorial scene reported.",
      source:     "Wind / wave / temp: climatological Belgian-coast 5-year avg + Surfclub De Kwinte presence.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.6, 1.4] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.5, 1.2] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.4, 1.0] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.8] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.7, 1.5] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.2, 1.0, 1.0, 0.7, 0.6, 0.5, 0.5, 0.5, 0.7, 0.9, 1.1, 1.2],
      monthlySwellProb:
        [0.40, 0.35, 0.30, 0.20, 0.15, 0.10, 0.10, 0.10, 0.20, 0.30, 0.40, 0.45],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "Beginners + improvers in wind / kite / wing, families, anyone after a quieter mid-coast beach with a friendly club.",
    nietIdeaalAls: "You want the busier scene of Oostende or the bigger kite community of Knokke."
  },

  {
    id: "oostende-mariakerke",
    type: "spot",
    country: "Belgium",
    sports: ["wind", "kite", "wing", "wave"],
    name: "Oostende — Mariakerke",
    town: "Oostende",
    tagline: "The big-city beach. Multi-discipline scene split between the sheltered Spuikom (sailing + windsurf) and the open sea at Mariakerke (kite, wing, occasional wave).",
    levels: ["intermediate", "advanced"],
    goodMonths: [3,4,5,6,7,8,9,10,11],
    coords: [51.2193, 2.8853],
    googleMapsQuery: "Mariakerke-Bad Oostende Belgium",
    coordsLabel: "Centre of Mariakerke beach (west of central Oostende). The Spuikom (separate inland-salt-lake watersport zone) is ~3 km northeast.",
    photo: "",
    samenvatting: [
      "Two waters: open sea at Mariakerke (kite, wing, occasional wave) + the Spuikom (sheltered salt-water lake, windsurf + sailing).",
      "Biggest watersport scene of the Belgian coast — multiple clubs, biggest urban beach.",
      "Direct train to Brussels (1h10) makes it the easiest coast day-trip.",
      "Bron-strength: 🟡 PARTIAL — climatology + Inside Outside club site + general guides."
    ],
    verhaal: [
      `Oostende is the urban + industrial heart of the Belgian coast. A working port, a major train terminus, and a multi-discipline watersport scene that's split between two waters: the open North Sea at Mariakerke beach (kite, wing, occasional wave-surf on Mariakerke's cleaner banks), and the Spuikom — a sheltered salt-water lake inland of the seafront, where the Inside Outside club teaches windsurf + sailing + SUP without the chop of the sea.`,
      `The honest fine print: it's busy. In summer the seafront fills with beach-tourists; in winter it's quieter and windier. For wave-surfing, Mariakerke (west of the main beach) has the cleaner banks — local wave-surfers know the windows. Don't expect Hossegor; do expect a real urban-beach watersport scene.`
    ],
    lagen: [
      {
        titel: "Wind & water — Mariakerke side",
        bron: "Climatological Belgian-coast averages",
        inhoud: [
          { kop: "Best wind", tekst: `W–NW prevailing, side-shore to onshore. Strongest Sep–Mar, lighter Jun–Aug.` },
          { kop: "Wave windows", tekst: `Cleaner sandbanks west of the port produce small waves on the right NW swell + low-tide combinations. Rare proper days — call it ~5–10 per year.` }
        ]
      },
      {
        titel: "The Spuikom — sheltered alternative",
        bron: "Inside Outside Oostende club site",
        inhoud: [
          { kop: "What it is", tekst: `Salt-water lake inland from the port (~3 km from the beach). Flat water, predictable. Used for windsurf + sail lessons in conditions when the sea is too rough.` }
        ]
      },
      {
        titel: "Getting there",
        bron: "NMBS/SNCB schedules",
        inhoud: [
          { kop: "By train", tekst: `Direct trains to Brussels (1h10), Antwerp (1h30), Ghent (45 min), Bruges (15 min). Within Oostende: tram + bus to Mariakerke + the Spuikom.` }
        ]
      }
    ],
    condities: {
      golftype: "Wind-chop primarily on the open sea; occasional small wave at Mariakerke. Flat water at the Spuikom.",
      golfhoogte: "0.4–1.2 m typical chop on the sea; flat at the Spuikom; small wave windows ~5–10 days/year",
      wind: "W–NW prevailing, side-shore to onshore",
      water: "6 °C winter to ~18 °C late summer (sea + Spuikom similar)",
      drukte: { niveau: "druk", tekst: "Biggest urban scene of the Belgian coast. Beach fills in summer; the Spuikom is club-controlled and quieter." }
    },
    stats: {
      windDir:    "W–NW prevailing",
      waveType:   "Wind-chop primarily; small wave on cleaner banks at Mariakerke",
      bottom:     "Sand, more variable than the western beaches",
      crowd:      "high",
      localism:  "Mixed urban scene — multiple clubs share. Friendly overall, smaller wave-surf community keeps to itself.",
      source:     "Wind / wave / temp: climatological Belgian-coast 5-year avg + Inside Outside club site for Spuikom.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.6, 1.4] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.5, 1.2] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.4, 1.0] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.8] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.7, 1.5] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.2, 1.0, 1.0, 0.7, 0.6, 0.5, 0.5, 0.5, 0.7, 0.9, 1.1, 1.2],
      monthlySwellProb:
        [0.40, 0.35, 0.30, 0.20, 0.15, 0.10, 0.10, 0.10, 0.20, 0.30, 0.40, 0.45],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "All-rounders who want options — open sea + Spuikom in one town, easy train access, biggest club + service scene of the coast.",
    nietIdeaalAls: "You're looking for a quiet seaside village vibe (try De Haan) or a kite-pure scene (try Knokke)."
  },

  {
    id: "de-haan-strand",
    type: "spot",
    country: "Belgium",
    sports: ["wave", "wind", "kite"],
    name: "De Haan Beach",
    town: "De Haan",
    tagline: "The prettiest village on the Belgian coast — protected dune belt, Belle-Époque villas, and the cleaner sandbanks that make this the rare bit of Belgian coast where wave-surf is actually a thing.",
    levels: ["intermediate", "advanced"],
    goodMonths: [3,4,5,9,10,11],
    coords: [51.2727, 3.0326],
    googleMapsQuery: "Strand De Haan Belgium",
    coordsLabel: "Centre of De Haan-aan-Zee beachfront. Wave windows tend to favour the eastern side toward Wenduine.",
    photo: "",
    samenvatting: [
      "Cleaner sandbanks than the bigger resorts — small but rideable wave windows on NW swell.",
      "Belle-Époque village protected by local rule: no high-rises, dune belt intact.",
      "Quieter scene — fewer kite/wind crowds, more wave-surfers (small but real community).",
      "Bron-strength: 🟡 PARTIAL — climatology + multi-source Belgian-coast surf guides."
    ],
    verhaal: [
      `De Haan is the Belgian coast's anomaly — protected by old local rules, no high-rises broke the dune belt, and the village looks like a 1900s seaside resort still. The beach has cleaner sandbanks than its bigger neighbours, and that's the wave-surf draw: on the right NW swell + low-tide combination, small but actually rideable waves break here.`,
      `The honest fine print: it's still Belgium. The wave windows are maybe 15–25 days a year if you're tracking forecasts. Most of the year it's wind-chop. For wave-surf-focused users, De Haan is the closest thing on the coast — but it's not a destination, it's an opportunistic local spot.`
    ],
    lagen: [
      {
        titel: "Wave & wind",
        bron: "Climatological Belgian-coast + multi-source Belgian-coast surf guides",
        inhoud: [
          { kop: "Best wave windows", tekst: `Sep–Mar, NW swell + low-incoming tide. Small (0.8–1.5 m typical), shifty, sandbank-dependent. Wetsuit always — 5/4 winter, 4/3 shoulder.` },
          { kop: "Wind sports", tekst: `Plenty when not waving — same W–NW prevailing as the rest of the coast. Less developed scene than Knokke or Oostende.` }
        ]
      }
    ],
    condities: {
      golftype: "Sandbank beach-break — small, shifty",
      golfhoogte: "0.5–1.5 m typical on wave windows; flat or chop most of the year",
      wind: "W–NW prevailing",
      water: "6 °C winter to ~18 °C late summer",
      drukte: { niveau: "rustig", tekst: "Quieter than the bigger resorts. Wave-surf days draw a small local crowd; otherwise mellow." }
    },
    stats: {
      windDir:    "W–NW prevailing",
      waveType:   "Sandbank beach-break — small, shifty",
      bottom:     "Sand",
      crowd:      "low",
      localism:  "Wave-surf community is small but close. Welcoming if you respect the line-up etiquette.",
      source:     "Wind / wave / temp: climatological Belgian-coast 5-year avg + multi-source Belgian-coast surf guides.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.7, 1.5] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.5, 1.3] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.4, 1.0] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.7] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.8, 1.6] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.2, 1.0, 1.0, 0.7, 0.6, 0.5, 0.5, 0.5, 0.7, 0.9, 1.1, 1.2],
      monthlySwellProb:
        [0.40, 0.35, 0.30, 0.20, 0.15, 0.10, 0.10, 0.10, 0.20, 0.30, 0.40, 0.45],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wave"
    },
    vergelijking: null,
    ideaalVoor: "Belgian wave-surfers tracking the rare windows, anyone wanting the prettiest village on the coast, riders who like quieter beaches.",
    nietIdeaalAls: "You expect proper consistent waves (you won't get them) or you want the buzz of a bigger resort."
  },

  {
    id: "zeebrugge-strand",
    type: "spot",
    country: "Belgium",
    sports: ["kite", "wing"],
    name: "Zeebrugge Beach",
    town: "Zeebrugge",
    tagline: "Industrial-feel beach east of one of Europe's biggest car-shipping ports. The harbour piers shelter the water — clean wind, less chop, kite + wing focused.",
    levels: ["intermediate", "advanced"],
    goodMonths: [3,4,5,6,7,8,9,10,11],
    coords: [51.3305, 3.1841],
    googleMapsQuery: "Strand Zeebrugge Belgium",
    coordsLabel: "Centre of Zeebrugge-Strand near the railway station. Beach extends east toward Knokke.",
    photo: "",
    samenvatting: [
      "Long pier on the west side shelters the beach from worst westerly chop.",
      "Less pretty than its neighbours, more industrial — but the water is cleaner-shaped for kite / wing.",
      "Direct train from Brugge (15 min) — easy day-trip from the city.",
      "Bron-strength: 🟡 PARTIAL — climatology + multi-source kite-Belgium guides."
    ],
    verhaal: [
      `Zeebrugge is the working-port side of the coast. One of Europe's biggest car-shipping hubs sits just west of the beach, the two harbour piers reach out a long way, and the beach itself runs east of them. That layout is the kite + wing draw: the piers block the worst of the westerly chop, so the water shapes cleaner than at the open-coast spots.`,
      `It's not aesthetic — concrete jetties, container cranes on the horizon, less of the seaside-resort feel. For dedicated wind/kite/wing riders that's a feature, not a bug.`
    ],
    lagen: [
      {
        titel: "Wind & water",
        bron: "Climatological Belgian-coast + multi-source Belgian-kite guides",
        inhoud: [
          { kop: "Wind shape", tekst: `Piers block westerly chop. Cleaner wind for kite + wing than the open coast on W winds; less protected on N–NE winds.` },
          { kop: "Tide", tekst: `Big tidal range — the beach width swings a lot. Low-tide low-water exposed sand makes for easy launching.` }
        ]
      }
    ],
    condities: {
      golftype: "Wind-chop, less than the open coast thanks to pier shelter",
      golfhoogte: "0.3–1.0 m typical",
      wind: "W–NW prevailing, pier-cleaned",
      water: "6 °C winter to ~18 °C late summer",
      drukte: { niveau: "gemiddeld", tekst: "Less tourist-y than its neighbours; the kite + wing community is the main presence." }
    },
    stats: {
      windDir:    "W–NW prevailing, pier-cleaned",
      waveType:   "Wind-chop, less than open coast",
      bottom:     "Sand, gentle slope",
      crowd:      "moderate",
      localism:  "Kite community welcoming, less general beach traffic than the resorts.",
      source:     "Wind / wave / temp: climatological Belgian-coast 5-year avg + multi-source kite-Belgium guides.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.5, 1.2] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.4, 1.0] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.3, 0.9] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.7] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.6, 1.4] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.0, 0.9, 0.9, 0.6, 0.5, 0.4, 0.4, 0.4, 0.6, 0.8, 1.0, 1.1],
      monthlySwellProb:
        [0.35, 0.30, 0.25, 0.18, 0.13, 0.10, 0.10, 0.10, 0.18, 0.25, 0.35, 0.40],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "Kite + wing riders who value clean wind over aesthetics, sailors who want pier-sheltered water, day-trippers from Brugge.",
    nietIdeaalAls: "You want the prettiness of De Haan or the buzz of Knokke — Zeebrugge is the functional choice, not the scenic one."
  },

  {
    id: "surfers-paradise-knokke",
    type: "spot",
    country: "Belgium",
    sports: ["kite", "wing", "wind"],
    name: "Surfers Paradise (Knokke-Heist)",
    town: "Knokke-Heist",
    tagline: "The kite + wing capital of Belgium. Wide flat beach, established multi-discipline center on-site, big-scene buzz on good wind days.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [3,4,5,6,7,8,9,10,11],
    coords: [51.3612, 3.3273],
    coordsLabel: "Verified centre of the Surfers Paradise beach zone, eastern Knokke-Heist toward the Zwin nature reserve.",
    photo: "",
    samenvatting: [
      "Belgium's premier kite + wing destination. Wide flat sand, plenty of room.",
      "Surfers Paradise center on-site — multi-discipline, summer + winter scene, events + competitions.",
      "Easy from Brussels (1h30 train) — the most accessible high-end kite scene in the country.",
      "Bron-strength: 🟡 PARTIAL — surfersparadise.be (own site) + multi-source kite-Belgium guides."
    ],
    verhaal: [
      `Surfers Paradise is the kite + wing capital of Belgium. The beach is wide and flat, the wind angle works for most prevailing directions, and the on-site center has the lessons + rentals + events infrastructure that makes the scene cohere. Big wind days draw kites from across Flanders + the Netherlands.`,
      `The honest fine print: Knokke is upscale — designer boutiques, golf courses, restaurants priced for the holiday crowd. The beach scene is more democratic, but the surrounding town isn't the cheapest base. Surfers Paradise itself runs a "sport hostel" sister property + beach-bar to keep it accessible to actual riders.`
    ],
    lagen: [
      {
        titel: "Wind & water",
        bron: "Climatological Belgian-coast + Surfers Paradise own site",
        inhoud: [
          { kop: "Best wind", tekst: `W–NW prevailing, side-shore to onshore. Wide angle window — most directions work. Sep–Mar windiest, Jun–Aug lighter and warmer.` },
          { kop: "Tide", tekst: `Big tidal range. At low tide a huge expanse of flat sand — at high tide the beach narrows.` }
        ]
      },
      {
        titel: "The scene + center",
        bron: "surfersparadise.be (own site)",
        inhoud: [
          { kop: "Multi-discipline center", tekst: `Surfers Paradise teaches + rents kite, wing, SUP. On-site beach bar, summer camps, events, sport hostel sister property ("Lakeside Paradise") for accommodation.` }
        ]
      },
      {
        titel: "Getting there",
        bron: "NMBS/SNCB schedules",
        inhoud: [
          { kop: "By train", tekst: `Knokke is a terminus, direct from Brugge (15 min), onward to Brussels (~1h30). Easiest big-city access of the coast for kiters.` }
        ]
      }
    ],
    condities: {
      golftype: "Wind-chop",
      golfhoogte: "0.4–1.2 m typical",
      wind: "W–NW prevailing, wide window of usable directions",
      water: "6 °C winter to ~18 °C late summer",
      drukte: { niveau: "druk", tekst: "Biggest kite + wing scene of the Belgian coast — busy on big-wind days." }
    },
    stats: {
      windDir:    "W–NW prevailing, wide usable window",
      waveType:   "Wind-chop",
      bottom:     "Sand, gentle slope",
      crowd:      "high",
      localism:  "Welcoming international kite + wing scene, well-organised by the on-site center.",
      source:     "Wind / wave / temp: climatological Belgian-coast 5-year avg + surfersparadise.be own site for center scene.",
      periods: [
        { name: "Peak",     months: [10, 11, 3],     inSeason: true,
          windKn: [14, 22], waterC: [10, 14], waveM: [0.6, 1.4] },
        { name: "High",     months: [9, 4],          inSeason: true,
          windKn: [12, 20], waterC: [12, 16], waveM: [0.5, 1.2] },
        { name: "Shoulder", months: [5, 8],          inSeason: true,
          windKn: [10, 18], waterC: [14, 18], waveM: [0.4, 1.0] },
        { name: "Light",    months: [6, 7],          inSeason: true,
          windKn: [8, 16],  waterC: [16, 19], waveM: [0.3, 0.8] },
        { name: "Cold",     months: [12, 1, 2],      inSeason: false,
          windKn: [14, 24], waterC: [6, 9],   waveM: [0.7, 1.5] }
      ],
      monthlyWindProb:
        [0.55, 0.50, 0.50, 0.40, 0.35, 0.30, 0.30, 0.30, 0.40, 0.50, 0.55, 0.55],
      monthlyWindKn:
        [14, 13, 13, 11, 11, 10, 10, 10, 12, 13, 14, 14],
      monthlyGustKn:
        [28, 26, 26, 22, 22, 20, 20, 20, 24, 26, 28, 28],
      monthlyDailyPeakKn:
        [30, 28, 28, 24, 24, 22, 22, 22, 26, 28, 30, 30],
      monthlyGustPeakKn:
        [45, 42, 42, 35, 33, 30, 30, 30, 38, 42, 45, 45],
      monthlyWaveM:
        [1.2, 1.0, 1.0, 0.7, 0.6, 0.5, 0.5, 0.5, 0.7, 0.9, 1.1, 1.2],
      monthlySwellProb:
        [0.40, 0.35, 0.30, 0.20, 0.15, 0.10, 0.10, 0.10, 0.20, 0.30, 0.40, 0.45],
      monthlyAirC:
        [4, 5, 7, 10, 14, 17, 19, 19, 16, 12, 8, 5],
      monthlyWaterC:
        [6, 5, 6, 8, 12, 15, 17, 18, 17, 14, 11, 8],
      chartType:  "wind"
    },
    vergelijking: null,
    ideaalVoor: "Kite + wing riders who want the biggest scene + best-organised center on the coast, learners with the on-site school, day-trippers from Brussels.",
    nietIdeaalAls: "You're after a quiet beach (try De Haan), a tight wave community (no real wave here), or the cheapest holiday base (Knokke runs upscale)."
  },

  /* ----------------- BELGIAN CENTERS ----------------- */

  {
    id: "windsurfing-deinze",
    type: "center",
    country: "Belgium",
    sports: ["wind", "wing", "sup"],
    name: "Windsurfing Deinze",
    town: "Deinze",
    tagline: "Member-run club + school at the Florizoone freshwater put — Lode's home base. Est. 1982. Youth program is the heart of it.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    linkedSpotId: "florizoone-deinze",
    coords: [50.9577178, 3.5334362],
    coordsLabel: "Clubhouse at Oudenaardsesteenweg 225, 9800 Deinze — exact pin from Google Maps for the \"Windsurfing Deinze\" place entry.",
    photo: "",
    bookingUrl: "https://www.windsurfingdeinze.be/",
    diensten: {
      lessen: "Windsurf, wing, SUP, skimboarding. Youth training (Wed afternoons, 8-lesson series, ages 10+), ladies + men's adult training (5-lesson series), private lessons on request. Wingfoil — 'coming soon' per own site as of 2026.",
      rental: "All-in members can use club boards + sails + wings + SUPs. Basic members can use SUP free + bring own kit. Wetsuits included for lessons.",
      brands: "Mixed club kit — refreshed regularly. Not a brand-name showcase.",
      faciliteiten: "Clubhouse, beach bar ('Jardin Des Amis'), terrace, equipment storage, certified surf school + training club. Open weekends in May/Jun/Sep, daily in Jul–Aug, 13:30–19:00.",
      team: "Volunteer board: Francies Van Daele (chair), Philippe Taccoen (youth + camps), Peter Debie (secretary), Steven Aspeslagh (project mgr), Cedric Cordier (infrastructure). Certified instructors for lessons + camps."
    },
    samenvatting: [
      "Member-driven club founded 1982 by windsurfers who built the clubhouse themselves on a former sand-extraction pit.",
      "Strong youth program — weekly Wednesday training, summer camps, club competitions.",
      "Three membership tiers (Beachmember €45, Basic €75, All-in €165) plus non-member access to lessons/camps.",
      "LDW connection: this is where he learned to windsurf.",
      "Bron-strength: 🟢 SOLID — windsurfingdeinze.be (own site, multiple pages) + LDW first-hand."
    ],
    verhaal: [
      `Windsurfing Deinze is the kind of club that doesn't exist on most surf-guide sites: a member-run, volunteer-driven local club, on a freshwater put inland from the coast, that's been quietly producing Belgian windsurfers since 1982. The clubhouse was built by the founding members. The bar is called Jardin Des Amis. The "Talk less, surf more" motto is on their website.`,
      `What it teaches: windsurfing first, then wing, SUP, skimboarding. Big youth focus — weekly Wednesday training for ages 10+, summer camps (including a week at the Veerse Meer in NL), club competitions. Adults are welcome too: ladies' training Sundays, men's training mid-week.`,
      `LDW learned to windsurf here. The honest fine print: it's a club, not a destination. The water is freshwater, the wind is lighter than the coast, and the active season is May–Sep (weekends in shoulder months, daily in July/August). If you live in Flanders, this is where you grow up before you hit the North Sea.`
    ],
    lagen: [
      {
        titel: "The put — Florizoone",
        bron: "windsurfingdeinze.be + langsdeleie.be",
        inhoud: [
          { kop: "Water", tekst: `Freshwater, ~600 × 300 m, former E17-highway sand-extraction pit. Flat — no waves, no chop, no salt. Swimming is prohibited.` },
          { kop: "Wind", tekst: `Lighter and more variable than the coast. Typical 8–14 kn afternoons; occasional 20+ kn on autumn-storm days. Ideal for learning, not for adrenaline.` }
        ]
      },
      {
        titel: "Club + history",
        bron: "windsurfingdeinze.be/over-ons (history page)",
        inhoud: [
          { kop: "Founded 1982", tekst: `Original members were windsurfers who wanted a water surface away from swimmers at Vosselare put. They found it at Florizoone, an old sand-extraction site near the industrial area used for E17-highway material. They built the clubhouse themselves.` },
          { kop: "Today", tekst: `Major renovation in 2012 (new bar, terrace, facility updates). Still member-run via a volunteer board. Open year-round to members; non-member access via lessons + camps in the May–Sep season.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Beginners + intermediates wanting structured club-style lessons; youth + families looking for a season of training; anyone in or near Flanders who wants a home water before the coast.",
    nietIdeaalAls: "You want destination-feel, salt water, big-wind days, or top-end retail kit on display.",
    prices: {
      tier:                  "budget",
      groupLessonEUR:        21,
      groupLessonNote:       "Youth training: 8 lessons for €170 (non-member) — works out to ~€21/lesson. All-in members: free. Basic members: €90 for the series.",
      privateLessonHourEUR:  null,
      privateLessonNote:     "Available on request, prices on enquiry.",
      rentalDayEUR:          null,
      rentalNote:            "All-in members: club kit included. Basic members: SUP free, bring own windsurf/wing gear.",
      packageEUR:            220,
      packageDays:           5,
      packageNote:           "Local windsurf + SUP camp (5 days, ages 10-16): All-in member €220 / Basic member €240 / Non-member €270. Veerse Meer week (NL, full week, ages 12-18): Members €395 / Non-members €475. Membership tiers: Beachmember €45 / Basic €75 / All-in €165.",
      unit:                  "per youth-training lesson, ~1h",
      verified:              "2026-05",
      source:                "windsurfingdeinze.be/surfcursussen + /surfkampen + /lidmaatschap — full published price + membership structure"
    }
  },

  {
    id: "inside-outside-oostende",
    type: "center",
    country: "Belgium",
    sports: ["wind", "wing", "sup"],
    name: "Inside Outside",
    town: "Oostende",
    tagline: "Two-water club — sheltered Spuikom inland + the open sea at Mariakerke. Windsurf, sail, SUP. One of the few Belgian clubs with both an inland and a seaside venue.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    coords: [51.2301987, 2.9608429],
    coordsLabel: "\"Inside\" clubhouse at Schietbaanstraat 100, 8400 Oostende (the Spuikom location) — verified via Google Maps direct place lookup. \"Outside\" is at Kon. Astridlaan 7, on the seafront.",
    photo: "",
    bookingUrl: "https://www.inout-oostende.be/",
    diensten: {
      lessen: "Windsurf, sail, SUP. Beginner through advanced. G-sport (inclusive adapted sports), team building, sports days, sports camps.",
      rental: "Extensive rental inventory — windsurf, SUP, sail. The club emphasises the 'uitgebreid assortiment'.",
      brands: "Mixed club kit, not brand-focused.",
      faciliteiten: "Two locations: the sheltered Spuikom salt-water lake (Inside) for sheltered conditions, and the open North Sea beach (Outside) for coastal training. Clubhouse + facilities at both. Kitesurf partnership with Tack Kiteschool ended May 2026 — no kite lessons currently.",
      team: "Club staff + volunteers, certified instructors. Not LDW first-hand — info from their own site."
    },
    samenvatting: [
      "Rare two-water club: sheltered Spuikom salt-lake AND open North Sea beach.",
      "Windsurf + sail + SUP lessons, all levels.",
      "G-sport (adapted watersports) included in the offering.",
      "Kitesurf partnership ended May 2026 — no kite lessons here right now.",
      "Bron-strength: 🟡 PARTIAL — inout-oostende.be (own site) only; LDW has not visited."
    ],
    verhaal: [
      `Inside Outside is the rare Belgian club that owns two waters. The "Inside" half sits on the Spuikom — a salt-water lake just inland of the seafront — where windsurf + sailing + SUP lessons happen in sheltered conditions. The "Outside" half is on the open North Sea at Mariakerke beach, for when conditions and skill level allow.`,
      `That setup is genuinely useful for teaching: beginners start in the flat sheltered Spuikom, then progress to the open sea once they have the basics. Less weather-cancellation, less risk on lesson days.`,
      `Honest fine print: the kitesurf partnership with Tack Kiteschool ended in May 2026 — Inside Outside doesn't currently teach kite. For kite lessons in Oostende, look at Salty Kitesurfschool down the coast.`
    ],
    lagen: [
      {
        titel: "Two-water setup",
        bron: "inout-oostende.be (own site)",
        inhoud: [
          { kop: "Inside · Spuikom", tekst: `Salt-water lake inland of the Oostende seafront. Sheltered, predictable — used for beginners + bad-weather days. Schietbaanstraat 100, 8400 Oostende.` },
          { kop: "Outside · Mariakerke beach", tekst: `Open North Sea. Used for advanced training + summer camps. Kon. Astridlaan 7.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Windsurf / sail / SUP learners + improvers wanting the option of sheltered + open water in one club; teams + corporate days; G-sport users.",
    nietIdeaalAls: "You want kite lessons (try Salty), or you want one focused water (try Windsurfing Deinze for inland, Surfers Paradise for kite coast).",
    prices: {
      tier:                  "budget",
      groupLessonEUR:        null,
      privateLessonHourEUR:  null,
      rentalDayEUR:          null,
      packageEUR:            null,
      packageDays:           null,
      unit:                  "by enquiry",
      verified:              "2026-05",
      source:                "inout-oostende.be — own site doesn't publish a fixed price list. Contact club directly for lesson, rental, and camp rates."
    }
  },

  {
    id: "side-shore-surfers",
    type: "center",
    country: "Belgium",
    sports: ["wind", "kite", "wing", "wave", "sup"],
    name: "Side Shore Surfers",
    town: "De Panne",
    tagline: "Multi-discipline club embedded in the De Panne dunes — kite school run by 3× Belgian kite champion Steve Verelst. IKO certified, small groups by design.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    linkedSpotId: "de-panne-strand",
    coords: [51.1007709, 2.5811883],
    coordsLabel: "Zeedijk 109, 8660 De Panne — verified via Google Maps direct place lookup.",
    photo: "",
    bookingUrl: "https://www.sideshoresurfers.be/",
    diensten: {
      lessen: "Windsurf, kitesurf (StevoKitesurf school inside the club, IKO), wave surf, wing foil, SUP. Initiations + camps + structured lessons in Dutch, English, French.",
      rental: "Member rentals + equipment for lesson packages.",
      brands: "Mixed — not a brand-specific showcase.",
      faciliteiten: "Member-driven club, beach-side location embedded in the dunes, restaurant Leopold 1 on-site with a public webcam.",
      team: "Kite school run by Steve Verelst (3× Belgian Freestyle Kitesurf Champion) and his wife Tineke. Self-described as the only IKO center in Belgium that explicitly avoids large groups — max 2 students per instructor."
    },
    samenvatting: [
      "Multi-discipline beach club at Zeedijk 109, De Panne.",
      "IKO-certified kite school inside (StevoKitesurf), small-group focus.",
      "Run by Steve Verelst, 3× Belgian Freestyle Kitesurf Champion.",
      "Lessons in NL/EN/FR.",
      "Bron-strength: 🟢 SOLID — sideshoresurfers.be (own site) + Visit De Panne tourism."
    ],
    verhaal: [
      `Side Shore Surfers is the De Panne anchor — a member-driven club embedded in the dunes at Zeedijk 109, with a beach restaurant (Leopold 1) and a multi-discipline offering. Windsurf, kite, wave surf, wing, SUP — all under one roof.`,
      `Inside the club operates StevoKitesurf — the kite school of Steve Verelst, 3× Belgian Freestyle Kitesurf Champion. They publicly position themselves as the only IKO center in Belgium that explicitly avoids large groups: max 2 students per instructor, so each student gets practical water time rather than queueing.`,
      `Honest fine print: it's a member-driven club. Walk-in lessons exist, but the social heart is the club community — bar, terrace, restaurant, webcam, weekend events.`
    ],
    lagen: [
      {
        titel: "Multi-discipline + IKO kite",
        bron: "sideshoresurfers.be (own site)",
        inhoud: [
          { kop: "Sports", tekst: `Windsurf, kitesurf, wave surf, wing foil, SUP. Lessons available in Dutch / English / French.` },
          { kop: "Kite school inside", tekst: `StevoKitesurf — IKO-certified, run by Steve Verelst. Max 2 students per instructor — explicitly small-group.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Multi-discipline learners + improvers wanting one club for all watersports; kiters who want a small-group IKO setup with a champion instructor.",
    nietIdeaalAls: "You want a strict commercial school feel — this is a club-with-school first.",
    prices: {
      tier:                  "comfortable",
      groupLessonEUR:        null,
      privateLessonHourEUR:  null,
      rentalDayEUR:          null,
      packageEUR:            null,
      packageDays:           null,
      unit:                  "by enquiry",
      verified:              "2026-05",
      source:                "sideshoresurfers.be — own site doesn't publish a fixed price list. Contact club directly for current rates."
    }
  },

  {
    id: "surfclub-wn",
    type: "center",
    country: "Belgium",
    sports: ["wind", "kite", "wing", "sup", "wave"],
    name: "Surfclub Westende | Nieuwpoort",
    town: "Westende",
    tagline: "Family-style surfclub with TWO waters — sea at the De Kwinte beach in Westende, freshwater reservoir at Nieuwpoort. Practice on whichever the conditions favour.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    linkedSpotId: "westende-strand",
    coords: [51.1677712, 2.7663010],
    coordsLabel: "Westende location: De Kwinte, Sint-Laureinsstrand, Koning Ridderdijk 100, 8434 Westende — verified via Google Maps direct place lookup. Second location: Nieuwendammeweg 19, 8620 Nieuwpoort (spaarbekken reservoir, 51.1313, 2.7897).",
    photo: "",
    bookingUrl: "https://www.surfclubwn.be/",
    diensten: {
      lessen: "Windsurf, kitesurf (new in 2026), SUP, wave surf, land yacht, sea kayak. Group + private + camps.",
      rental: "Hourly: windsurf €15/h or €25/2h, SUP same, wave surf gear same. Kite gear €60/session for graduates only.",
      brands: "Mixed club kit.",
      faciliteiten: "Two locations: De Kwinte beach club in Westende (sea, lockers, changing rooms, showers, surf bar, in-house lifeguard) + Nieuwpoort spaarbekken (inland freshwater reservoir). 'Family atmosphere' is core to their identity.",
      team: "Volunteer-run non-profit. Certified instructors. Kiteschool new in 2026."
    },
    samenvatting: [
      "Two-water club: De Kwinte beach (Westende, sea) + spaarbekken (Nieuwpoort, freshwater reservoir).",
      "Most disciplines on offer: windsurf, kite (from 2026), SUP, wave surf, land yacht, sea kayak.",
      "Annual membership: €115 adult / €70 youth / €200 family.",
      "Family-style, non-profit, lifeguard on-site at De Kwinte.",
      "Bron-strength: 🟢 SOLID — surfclubwn.be (own site) for full price list + Visit Middelkerke + Visit Nieuwpoort."
    ],
    verhaal: [
      `Surfclub Westende | Nieuwpoort (WN) is the rare two-water club: De Kwinte beach in Westende (Sint-Laureinsstrand, open sea) AND the Nieuwpoort spaarbekken (an inland freshwater reservoir). When the sea is too rough or cold, the reservoir is the alternative — flat, predictable, year-round usable for members.`,
      `Operating model: non-profit, volunteer-run, family atmosphere. The wide offering (windsurf, kite, SUP, wave surf, land yacht, sea kayak) makes it a community club rather than a single-sport school. Kiteschool launched in 2026 with structured lessons.`
    ],
    lagen: [
      {
        titel: "Two locations",
        bron: "surfclubwn.be + Visit Nieuwpoort",
        inhoud: [
          { kop: "De Kwinte — Westende", tekst: `Sint-Laureinsstrand, Koning Ridderdijk 100, 8434 Westende. Open sea, lifeguard on duty, in-house first-aid post, lockers + showers + surf bar.` },
          { kop: "Spaarbekken — Nieuwpoort", tekst: `Nieuwendammeweg 19, 8620 Nieuwpoort. Inland freshwater reservoir — sheltered, flat-water alternative when the sea is rough.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Families, club-style learners, anyone wanting both sea + sheltered options under one membership.",
    nietIdeaalAls: "You want a brand-name retail school or destination-feel infrastructure.",
    prices: {
      tier:                  "budget",
      groupLessonEUR:        60,
      groupLessonNote:       "Kite duo lesson (2-on-1) — €60/person/hour. Private kite lesson €90/hour. Refresher coaching €80/hour. 2.5-hour blocks standard. (Membership required for non-kite lessons.)",
      privateLessonHourEUR:  90,
      rentalDayEUR:          null,
      rentalNote:            "Hourly rental for members: windsurf / SUP / wave surf gear €15/hour or €25/2 hours (wetsuit included). Kite gear for graduated members: €60/session.",
      packageEUR:            null,
      packageDays:           null,
      packageNote:           "Annual membership: €115 adult, €70 youth, €200 family — required for water access and discounted lessons.",
      unit:                  "duo kite lesson, /person /hour",
      verified:              "2026-05",
      source:                "surfclubwn.be/tarieven — full published price list including memberships, rentals, and 2026 kite lessons."
    }
  },

  {
    id: "salty-kitesurfschool",
    type: "center",
    country: "Belgium",
    sports: ["kite", "wing"],
    name: "Salty Kitesurfschool",
    town: "Westende",
    tagline: "Pro-level kite school on the Middelkerke side of the coast — IKO-structured progression, wheelchair-accessible 'sit kite' program, founded 2012.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    coords: [51.1678113, 2.7662337],
    coordsLabel: "Koning Ridderdijk, Westende-Bad, Middelkerke — verified via Google Maps direct place lookup. The school operates from this seafront pedestrian street.",
    photo: "",
    bookingUrl: "https://www.saltykitesurfschool.com/",
    diensten: {
      lessen: "Kite progression in 5 IKO-structured modules (Powerkite, Bodydrag, Waterstart, Ride, Advanced). Wing foil lessons. Sit kitesurfing (wheelchair-accessible). Jetboarding. Private lessons. Group + corporate events.",
      rental: "Boards, wetsuits, kayaks, SUPs.",
      brands: "Not specified on own site as a brand-showcase.",
      faciliteiten: "Operates April–October. IKO-certified school. 'Dream Dare' inclusive program for youth in wheelchairs. Membership program with insurance + club facilities + discounts.",
      team: "Founded 2012 by 'gepassioneerde en professionele instructeurs'. Self-describes as 'pro-level lessen' with 'persoonlijke aandacht'."
    },
    samenvatting: [
      "IKO-certified kite school operating Apr–Oct.",
      "Distinctive: 'Sit kitesurfing' wheelchair-accessible program + 'Dream Dare' youth-in-wheelchairs initiative.",
      "Founded 2012, full progression (beginner to advanced).",
      "Also teaches wingfoil + jetboarding.",
      "Bron-strength: 🟡 PARTIAL — saltykitesurfschool.com (own site); LDW has not visited."
    ],
    verhaal: [
      `Salty is the dedicated kite school on the Belgian coast — IKO-certified, structured progression (Powerkite → Bodydrag → Waterstart → Ride → Advanced), and operating since 2012. They cover kite + wing + jetboarding, all from a base on the Westende / Middelkerke beach.`,
      `What sets them apart is the inclusion: a "Sit kitesurfing" program adapted for wheelchair users + a "Dream Dare" initiative for youth-in-wheelchairs. That's not common in the Belgian-coast kite scene and worth flagging.`
    ],
    lagen: [
      {
        titel: "Progression + offering",
        bron: "saltykitesurfschool.com (own site)",
        inhoud: [
          { kop: "Five-module IKO progression", tekst: `Powerkite (kite control on land) → Bodydrag (water basics) → Waterstart (board riding) → Ride (upwind mastery) → Advanced (jumps, freestyle, foil). Typical 3-5 lesson packages.` },
          { kop: "Wing + extras", tekst: `Wingfoil lessons. Jetboarding. Membership program with insurance + discounts + access to club facilities.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Kite + wing learners + improvers wanting structured progression, wheelchair users interested in adapted watersports, anyone valuing pro-level individual attention.",
    nietIdeaalAls: "You're after windsurf lessons (try Inside Outside or Windsurfing Deinze) or you want a non-coastal water (Westende is open sea).",
    prices: {
      tier:                  "comfortable",
      groupLessonEUR:        null,
      privateLessonHourEUR:  null,
      rentalDayEUR:          null,
      packageEUR:            null,
      packageDays:           null,
      unit:                  "by enquiry",
      verified:              "2026-05",
      source:                "saltykitesurfschool.com — own site references a separate pricing page; rates not publicly listed in detail. Contact school for current quotes."
    }
  },

  {
    id: "windhaan-de-haan",
    type: "center",
    country: "Belgium",
    sports: ["wind", "kite", "wing", "wave", "sail"],
    name: "Windhaan",
    town: "De Haan",
    tagline: "All-disciplines watersports club at the east end of De Haan promenade — windsurf, kite, wave surf, catamaran sailing, land sailing. Beach pavilion + bar with terrace.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    linkedSpotId: "de-haan-strand",
    coords: [51.2819846, 3.0385685],
    coordsLabel: "Zeedijk – De Haan 50, 8421 De Haan — verified via Google Maps direct place lookup. Beach pavilion at the eastern end of the promenade.",
    photo: "",
    bookingUrl: "https://windhaan.be/en/",
    diensten: {
      lessen: "Windsurf, kitesurf, wave surf, catamaran sailing (group + private), land yacht. Surf camps + kids camps ('Kidscocktail').",
      rental: "Club member rentals across the disciplines.",
      brands: "Mixed club kit.",
      faciliteiten: "Beach pavilion at the east end of the promenade — bar, terrace, showers, changing rooms, equipment storage, lockers, berths. Public webcam + meteorological data on the website.",
      team: "Volunteer-run non-profit club, instructors per discipline (sail teachers + golfsurf instructors)."
    },
    samenvatting: [
      "De Haan's watersports club — broadest discipline offering on the central coast.",
      "Includes catamaran sailing + land yacht alongside wind / kite / wave.",
      "Beach pavilion at the east end of the De Haan seafront, bar + terrace.",
      "Bron-strength: 🟢 SOLID — windhaan.be (own site) + De Haan tourism."
    ],
    verhaal: [
      `Windhaan is the local watersports club of De Haan — broader than a kite school, narrower than a tourist-resort facility. They cover the standard wind / kite / wave surf, plus catamaran sailing AND land yacht (a Belgian-coast specialty on the wide low-tide sand).`,
      `Location is the eastern end of the De Haan promenade — beach pavilion with bar, terrace, lockers, changing rooms, and the typical beach-club community feel. Open mid-Apr to end-Sep when water temps cooperate.`
    ],
    lagen: [
      {
        titel: "Sports + facilities",
        bron: "windhaan.be (own site)",
        inhoud: [
          { kop: "What's taught", tekst: `Windsurfing, kitesurfing, wave surfing, catamaran sailing (group + private), land yacht / strandzeilen. Kids camps under "Kidscocktail".` },
          { kop: "Facilities", tekst: `Beach pavilion, bar with terrace, showers, changing rooms, lockers, equipment storage, berths. Webcam + weather data on-site.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Multi-sport learners + improvers, families wanting kids' camps, anyone who wants catamaran or land-yacht alongside wind sports.",
    nietIdeaalAls: "You want a focused kite school (try Club North in Zeebrugge or Surfers Paradise in Knokke).",
    prices: {
      tier:                  "comfortable",
      groupLessonEUR:        null,
      privateLessonHourEUR:  null,
      rentalDayEUR:          null,
      packageEUR:            null,
      packageDays:           null,
      unit:                  "by enquiry",
      verified:              "2026-05",
      source:                "windhaan.be — own site doesn't publish a fixed price list; rates available on enquiry. Phone +32 (0)59 44 16 24."
    }
  },

  {
    id: "club-north-zeebrugge",
    type: "center",
    country: "Belgium",
    sports: ["kite", "wing"],
    name: "Club North by Icarus",
    town: "Zeebrugge",
    tagline: "IKO-style kite + wing school in Zeebrugge — max 2 students per instructor, online booking 7 days/week, structured progression from discovery to advanced.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9],
    linkedSpotId: "zeebrugge-strand",
    coords: [51.3274245, 3.1716767],
    coordsLabel: "Zeedijk 50, 8380 Zeebrugge — verified via Google Maps direct place lookup. West-central section of the Zeebrugge strand.",
    photo: "",
    bookingUrl: "https://www.clubnorthzeebrugge.be/kite-school",
    diensten: {
      lessen: "Kitesurf (Discovery / Learn to Fly / Learn to Kite / Refresher / Intermediate / Advanced), wing surf, kitefoil, kids kitesurf. Max 2 students per instructor.",
      rental: "Equipment rental for graduated students + members.",
      brands: "Not specified on own site as a brand-showcase.",
      faciliteiten: "Online booking system 7 days/week (including evenings), bar/refreshments, public webcam + weather data, member events + team-building arrangements.",
      team: "Icarus Surfclub team, IKO-style structured progression."
    },
    samenvatting: [
      "Focused kite + wing school on the Zeebrugge strand.",
      "Operates mid-Apr to end-Sep (water-temp ≥ 12 °C minimum).",
      "Max 2 students per instructor — small-group standard.",
      "Online booking flexibility — evenings + 7 days/week.",
      "Bron-strength: 🟢 SOLID — clubnorthzeebrugge.be (own site, full price list) + hightech.be partner page."
    ],
    verhaal: [
      `Club North by Icarus is the focused kite + wing school of Zeebrugge — Icarus Surfclub's kite-teaching arm. The pier-protected water of Zeebrugge (cleaner than the open coast on west winds) plus a small-group teaching standard (max 2 students per instructor) gives this place a steady reputation among Belgian kite learners.`,
      `Honest fine print: it's a kite-focused school, not a multi-sport club. For windsurf or wave you'd look elsewhere on the coast.`
    ],
    lagen: [
      {
        titel: "Lessons + pricing",
        bron: "clubnorthzeebrugge.be (own site)",
        inhoud: [
          { kop: "Kite progression", tekst: `Discovery (€75 / 1h) → Learn to Fly (€75) → Learn to Kite Duo (€100/person, 2h) → Private (€170, 2h) → Refresher (€190, 2h) → Intermediate / Advanced (€170-€190, 2h).` },
          { kop: "Booking", tekst: `Online booking 7 days/week including evenings. Operating season mid-April to end-September, when water hits 12 °C minimum.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Kite + wing learners wanting structured small-group lessons with flexible booking; riders who prefer Zeebrugge's pier-cleaned wind.",
    nietIdeaalAls: "You want windsurf or wave surf lessons (different schools on the coast).",
    prices: {
      tier:                  "comfortable",
      groupLessonEUR:        100,
      groupLessonNote:       "Duo kite lesson (2-on-1) — €100/person for 2 hours. Discovery / Learn-to-fly 1h = €75. Private 2h = €170.",
      privateLessonHourEUR:  85,
      rentalDayEUR:          null,
      rentalNote:            "Rental available for graduated students + members.",
      packageEUR:            null,
      packageDays:           null,
      unit:                  "duo kite lesson, /person /2h",
      verified:              "2026-05",
      source:                "clubnorthzeebrugge.be/kite-school — full published price list."
    }
  },

  {
    id: "surfers-paradise-center",
    type: "center",
    country: "Belgium",
    sports: ["kite", "wing", "sup"],
    name: "Surfers Paradise",
    town: "Knokke-Heist",
    tagline: "Belgium's flagship kite center — operating since 1988, kite school since 2000, Naish IKO-certified centre, hosted the PKRA world championships in 2002 + 2004.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [4,5,6,7,8,9,10],
    linkedSpotId: "surfers-paradise-knokke",
    coords: [51.3611967, 3.3273796],
    coordsLabel: "Surfers Paradise beach center, Knokke-Heist — verified via Google Maps direct place lookup. Same location as the spot entry (the center IS the beach club that gave the spot its name).",
    photo: "",
    bookingUrl: "https://www.surfersparadise.be/",
    diensten: {
      lessen: "Kitesurf (freeride, freestyle, waverider — all levels), wing foil, SUP, powerboat courses. Group lessons + camps + private + youth.",
      rental: "Brand-new Naish kit refreshed every year. Members + graduates can rent.",
      brands: "Naish (exclusive partner). The Naish Kitesurfing Centre badge is part of the IKO quality framework.",
      faciliteiten: "Beach club + bar/restaurant, WiFi, lockers, member events, sister sport hostel 'Lakeside Paradise' for accommodation. Open daily Apr-Oct.",
      team: "Operating since 1988 (the center), kite school since 2000. Hosted PKRA world championships in 2002 + 2004. Organised the first Belgian kite championships."
    },
    samenvatting: [
      "Belgium's longest-running kite center — operating since 1988, kite school since 2000.",
      "Naish exclusive partner; IKO-certified; brand-new kit refreshed annually.",
      "PKRA world championship host in 2002 + 2004.",
      "Open Apr–Oct, daily. Located in the eastern dunes of Knokke-Heist toward the Zwin nature reserve.",
      "Bron-strength: 🟢 SOLID — surfersparadise.be (own site) + IKO international school registry + multi-source Belgian kite guides."
    ],
    verhaal: [
      `Surfers Paradise is the historical anchor of Belgian kitesurfing. The center has been operating since 1988 — Belgium's longest-running watersports business of its kind. In 2000 they launched their kiteschool; in 2002 + 2004 they hosted the PKRA world championships (kite's professional circuit at the time).`,
      `Today they're the Naish Kitesurfing Centre (an IKO quality-label partner with Naish as the gear sponsor) — brand-new kit refreshed every year, IKO-structured lessons, freeride / freestyle / waverider tracks for all levels. The beach club has the bar, restaurant, WiFi, lockers, and a sister sport hostel ('Lakeside Paradise') for accommodation.`,
      `Honest fine print: it's Belgium's busiest kite spot in summer. The community is welcoming, but expect company on big-wind days. The setting itself — between dunes and the Zwin reserve — is the prettiest of any Belgian kite center.`
    ],
    lagen: [
      {
        titel: "History + status",
        bron: "surfersparadise.be (own site)",
        inhoud: [
          { kop: "Long pedigree", tekst: `Center opened 1988. Kiteschool opened 2000. Organised first Belgian kite championships. Hosted PKRA world champs 2002 + 2004.` },
          { kop: "Today", tekst: `Naish Kitesurfing Centre badge — gear partner is Naish, IKO quality framework. Brand-new fleet annually. Open daily Apr–Oct.` }
        ]
      }
    ],
    vergelijking: null,
    ideaalVoor: "Serious kite + wing learners wanting the deepest pedigree on the coast, riders who value brand-new Naish gear, anyone after the biggest scene.",
    nietIdeaalAls: "You want a small intimate vibe (try Club North in Zeebrugge or Side Shore Surfers in De Panne) or a non-kite focus (Inside Outside / Windhaan).",
    prices: {
      tier:                  "premium",
      groupLessonEUR:        null,
      privateLessonHourEUR:  null,
      rentalDayEUR:          null,
      packageEUR:            null,
      packageDays:           null,
      unit:                  "by enquiry",
      verified:              "2026-05",
      source:                "surfersparadise.be — own site lists packages + camps but doesn't publish a single fixed price list. Premium positioning relative to the wider Belgian-coast scene; contact center for current rates."
    }
  }
];

const WAVEBASE_MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ===================== TOWNS — area-level context ===================== */
/* Town facts (what-to-do / transport / distances) from public travel &
   transport guides, 2025–26; distances cross-checked across sources. */
const WAVEBASE_TOWNS = {
  "Tamraght": {
    naam: "Tamraght",
    country: "Morocco",
    intro: "A sleepy surf-and-yoga village just up the coast from Agadir — quieter and cheaper than its famous neighbour Taghazout, with a strong little café scene.",
    teDoen: "Beyond the waves: a traditional hammam with an argan-oil scrub, yoga studios looking out over the bay, Moroccan cooking classes, and a small local market on Tuesdays in the upper village. Sandboarding on the dunes near Tamri is ~40 min north; Agadir's huge Souk El Had market is ~25 min away.",
    vervoer: "City bus 32 (Agadir's Place Salam → Taghazout) and bus L33 (Agadir → Tamraght → Taghazout → Tamri) both stop here — roughly every 20 min, ~10–15 dirham, paid to the driver. Grands taxis and the paid Souk-to-Surf shuttle are alternatives. Taghazout is about a 1-hour walk along the seafront.",
    afstand: "A short drive north of Agadir city — about 20–25 min by road (a few km closer in than Taghazout). Agadir Al Massira Airport is ~50 min. Marrakech, the next major city, is ~250 km / ~3 hours to Agadir via the A7.",
    bron: "Public travel & transport guides, 2025–26; distances cross-checked across multiple sources."
  },
  "Aourir": {
    naam: "Aourir",
    country: "Morocco",
    intro: "A traditional Berber town just north of Agadir and just south of Tamraght — the so-called \"Banana Village\" (named for the banana plantations along the river behind the beach). Less surf-trip-cliché than its neighbours, more local-Moroccan working town with a busy weekly market.",
    teDoen: "Beyond the surf: the lively Saturday/Tuesday market in the town centre, banana plantations on the inland side, beach walks along Banana Beach into Tamraght, Agadir city ~15 min south, traditional bakeries and tagine spots in the old centre. The K11/K12 reefs and Banana Point break are all on this stretch of coast.",
    vervoer: "City bus 32 (Agadir ↔ Taghazout) stops in Aourir. Grands taxis run frequently from Agadir, ~10–15 min, ~10 dirham. By car: 10 min from Agadir port, 5 min from Tamraght, 15 min from Taghazout.",
    afstand: "Between Tamraght (north) and Anza (south) on the coast road. ~12 km from Agadir port, ~5 km from Tamraght, ~10 km from Taghazout, ~35 min from Agadir Al Massira Airport (AGA).",
    bron: "Public travel & transport guides + surf area knowledge, 2026."
  },

  "Anza": {
    naam: "Anza",
    country: "Morocco",
    intro: "A working fishing-and-port suburb on the southern edge of Agadir — much closer to the city than Tamraght/Taghazout. Less of a surf-trip destination, more of a day-trip break for people based in Agadir. The wave (Anza Beach) is sand-and-reef A-frames, picks up swell when other spots are flat.",
    teDoen: "Beyond the wave: Agadir's huge Souk El Had market (~15 min), the Agadir Oufella ruins overlooking the bay, the Marina d'Agadir, the city beach. Anza itself is industrial/working — no real café scene; most people drive in from Agadir or Tamraght for the surf and back out.",
    vervoer: "City bus 24 (Anza ↔ Agadir centre) runs frequently and cheap (~5 dirham). Grands taxis from Agadir share, ~10 min ride. By car: 10 min from Agadir port, 25 min from Tamraght (~10 km north along the corniche).",
    afstand: "South of Agadir, on the corniche. ~10 km south of Tamraght, ~7 km north of Agadir port, ~30 min to Agadir Al Massira Airport (AGA).",
    bron: "Public travel & transport guides + surf area knowledge, 2026."
  },

  "Taghazout": {
    naam: "Taghazout",
    country: "Morocco",
    intro: "A once-sleepy fishing village turned Morocco's trendiest surf-and-wellness town — rooftop cafés, a busy yoga scene, and Anchor Point right on its doorstep.",
    teDoen: "Beyond the waves: a vegan-leaning café culture with rooftop tagine-and-tea spots, yoga classes all over town (~120 dirham a drop-in), hammams and massages, sunset from above Anchor Point, and the boardwalk down to Tamraght. Paradise Valley — palm gorges and natural pools — is a popular ~45-min day trip inland.",
    vervoer: "City bus 32 from Agadir's Place Salam terminates here; bus L33 runs Agadir–Tamraght–Taghazout–Tamri. Buses roughly every 20 min, ~10–15 dirham, paid to the driver. Grands taxis and the paid Souk-to-Surf shuttle also serve the village; once you're there it's small and walkable.",
    afstand: "About 19 km north of Agadir city — roughly 30–45 min by road. Agadir Al Massira Airport is ~60 min. Marrakech, the next major city, is ~250 km / ~3 hours to Agadir via the A7.",
    bron: "Public travel & transport guides, 2025–26; distances cross-checked across multiple sources."
  },
  "Palekastro": {
    naam: "Palekastro",
    country: "Greece",
    intro: "A quiet inland village in far-east Crete, 1.5 km from Kouremenos Bay — the windsurf/wing/kite cluster of east Crete. Small, traditional, with tavernas around the square and a Minoan archaeological site on the edge of town.",
    teDoen: "Beyond the water: the Palekastro Minoan ruins (~2.5 km, free), the Vai palm-tree beach (~10 km, the only natural palm forest in Europe — a tourist beach, not a surf spot), the Itanos ancient site, the Toplou Monastery (~12 km), and the Zakros Gorge / Valley of the Dead hike (~25 min drive). Quiet evenings, family tavernas.",
    vervoer: "By car: ~2 h 15 min from Heraklion airport (HER) via the north-coast E75, ~1 h 15 min from Sitia airport (JSH, regional). Public bus from Sitia is limited (a few daily). The cluster — Palekastro village → Kouremenos beach → Hiona beach → Vai — is best done by rental car or scooter.",
    afstand: "Far east of Crete, ~165 km / ~2 h 15 min from Heraklion; ~25 km / ~30 min from Sitia. Athens is a 30-min flight from Heraklion (or an overnight ferry to Heraklion or Sitia).",
    bron: "Public travel & transport guides, 2025–26; airport distances cross-checked across multiple sources."
  },

  "Deinze": {
    naam: "Deinze",
    country: "Belgium",
    intro: "Not the coast — an inland town in East Flanders, ~20 km south of Ghent. Home to Florizoone, an old sand-extraction pit turned freshwater surfput, and to Windsurfing Deinze — the club Lode learned at. Flat water, light to moderate wind, no salt, no waves — the place where Belgian windsurfers grow up before they hit the North Sea.",
    teDoen: "Around the put: cycling along the Leie towpath, the Mudel art museum in town, the Brielmeersen recreation park (~3 km), Ghent's old centre a 25-min train ride away. The clubhouse has a beach bar (\"Jardin Des Amis\") open weekends.",
    vervoer: "Train: Deinze station is on the line Ghent–Kortrijk, ~12 min from Ghent–Sint-Pieters, then ~15 min cycle or bus to Oudenaardsesteenweg. By car: 10 min from the E17 (exit Deinze), 25 min from Ghent.",
    afstand: "Inland — ~70 km from the Belgian coast (Oostende ~1h drive), ~25 km from Ghent. Brussels Airport ~80 km / 1h.",
    bron: "windsurfingdeinze.be (own site), 2026; LDW first-hand: learned to windsurf here."
  },

  "De Panne": {
    naam: "De Panne",
    country: "Belgium",
    intro: "Westernmost beach town on the Belgian coast, against the French border. A wide flat sandy beach (one of the widest of the coast at low tide), big sky, steady west winds. The shallow shelf keeps waves small but makes it forgiving for kite + wing beginners.",
    teDoen: "Westhoek nature reserve (Belgium's largest dune area, walk-in from town), Plopsaland theme park (~2 km, family draw), French border just along the beach — walk to Bray-Dunes for a coffee in France. Coastal tram (Kusttram) along the seafront.",
    vervoer: "Train to De Panne station (terminus of the Brussels–De Panne line, ~2h from Brussels), then 5-min tram or 20-min walk to the beach. By car: ~1h45 from Brussels, ~1h20 from Antwerp.",
    afstand: "Far west, ~70 km from Brugge, ~125 km from Brussels. Lille (France) is ~50 km / 45 min by car.",
    bron: "Public coastal-tram guides + Visit Flanders 2025–26."
  },

  "Nieuwpoort": {
    naam: "Nieuwpoort",
    country: "Belgium",
    intro: "Where the river Yser meets the sea. Two towns side-by-side: the harbour town inland (Nieuwpoort-Stad) and the beach resort (Nieuwpoort-Bad). Has the largest marina of Northern Europe — sailing roots run deep, and the wind funnels through the harbour mouth. Beach side has a wide promenade.",
    teDoen: "King Albert I monument and viewing tower (the river-lock complex from WWI), the historic harbour, fish auction in the early morning, cycle the Yser dyke inland. Coastal tram stops at the seafront.",
    vervoer: "No direct station — De Panne (15 min by tram) or Oostende (20 min) are the rail hubs. Kusttram along the seafront. By car: ~1h40 from Brussels.",
    afstand: "Mid-west coast, between De Panne and Oostende. ~15 km to De Panne, ~25 km to Oostende.",
    bron: "Visit Flanders + harbour authority sources, 2025–26."
  },

  "Westende": {
    naam: "Westende",
    country: "Belgium",
    intro: "A quieter family beach in Middelkerke municipality, between Nieuwpoort and Oostende. Wide flat beach, lower density of high-rises than the bigger resorts. Home to Surfclub De Kwinte — windsurf, kite, land-yacht.",
    teDoen: "Atlantikwall museum + bunkers (~3 km in Raversijde), the Sint-Laureinsduinen reserve, cycle along the seawall. Coastal tram stops near the beach.",
    vervoer: "Kusttram from Oostende (~15 min) is the main link. By car: ~1h30 from Brussels via the E40.",
    afstand: "Mid-coast, ~6 km west of Oostende, ~10 km east of Nieuwpoort.",
    bron: "Visit Flanders + surfclubdkwinte.be 2026."
  },

  "Oostende": {
    naam: "Oostende",
    country: "Belgium",
    intro: "\"Queen of the Belgian coast\" — the biggest, busiest, most urban beach town. A working port, an art-heavy city (Ensor lived here), and a multi-discipline watersport scene split between the Spuikom (sheltered inland salt lake — windsurf + sailing) and the actual sea (kite, wing, occasional wave at Mariakerke).",
    teDoen: "Mu.ZEE art museum, the Ensor house, the historic harbour and fish market \"De Vistrap\", the Atlantikwall museum at Raversijde, North Sea Jazz Festival (summer). Direct train link to Brussels in 1h10.",
    vervoer: "Train: Oostende is a terminus, direct to Brussels (1h10), Antwerp (1h30), Ghent (45 min), Bruges (15 min). Tram + bus network within the city. By car: ~1h15 from Brussels via E40.",
    afstand: "Roughly the centre of the Belgian coast. ~25 km to De Panne (west), ~30 km to Knokke (east), ~25 km to Brugge.",
    bron: "Visit Oostende + national rail schedules, 2025–26."
  },

  "De Haan": {
    naam: "De Haan",
    country: "Belgium",
    intro: "The Belgian coast's prettiest village — protected dune belt, Belle-Époque villas, no high-rises by local rule. Mid-coast between Oostende and Blankenberge. The beach has the cleaner sandbanks for occasional wave-surf days; otherwise wind/kite/wing on light-to-medium days.",
    teDoen: "Cycle the dune paths (the Concession quarter is a heritage protected zone), the De Haan Tram-station building (1902, Art Nouveau), beach walks at low tide for kilometers. The town is small — half a day covers it.",
    vervoer: "Kusttram from Oostende (~15 min). No own train station (nearest Oostende). By car: ~1h20 from Brussels.",
    afstand: "Mid-coast, ~10 km east of Oostende, ~10 km west of Blankenberge.",
    bron: "Visit Flanders + De Haan tourist office, 2025–26."
  },

  "Zeebrugge": {
    naam: "Zeebrugge",
    country: "Belgium",
    intro: "Sea-side district of Brugge — a working port (one of Europe's biggest car-shipping hubs) with a public beach east of the harbour. The two long piers protect the beach from the worst chop, making it a favourite for kite + wing on west winds. Less pretty than its neighbours, more industrial.",
    teDoen: "Seafront World War II remains, the harbour tour by boat, day-trip to Brugge old town (~12 km by train or car). Less aesthetic-tourism, more working-port character.",
    vervoer: "Train: Zeebrugge-Strand station, direct from Brugge (15 min). Kusttram links to the rest of the coast.",
    afstand: "East coast, ~12 km from Brugge, ~8 km west of Knokke.",
    bron: "Visit Flanders + Port of Antwerp-Bruges info, 2025–26."
  },

  "Knokke-Heist": {
    naam: "Knokke-Heist",
    country: "Belgium",
    intro: "Easternmost beach town on the Belgian coast, against the Dutch border. The high-end resort: art galleries, designer boutiques, golf courses, gastronomic restaurants. Surfers Paradise beach is the kite/wing capital of Belgium — wide flat sand, good wind angles, established multi-discipline center.",
    teDoen: "Zwin nature reserve (a major bird wetland on the Dutch border), the casino, the seafront art trail (sculptures along the dyke), Het Zoute district (the upscale residential area).",
    vervoer: "Train: Knokke is a terminus, direct from Brugge (15 min) and onward to Brussels (~1h30). Kusttram all the way along the coast.",
    afstand: "Easternmost coast, against NL border. ~18 km from Brugge, ~140 km from Brussels, ~25 km from Vlissingen (NL).",
    bron: "Visit Flanders + Surfers Paradise center site, 2025–26."
  }
};

/* ===================== DESTINATIONS — worldwide rollout ===================== */
/* Surf destinations by continent. Morocco is live (the QnD region); the rest are
   real surf countries marked "soon" — the worldwide ambition, honestly staged. */
const WAVEBASE_DESTINATIONS = [
  {
    continent: "Europe",
    countries: [
      { name: "Greece", flag: "🇬🇷", status: "live" },
      { name: "Belgium", flag: "🇧🇪", status: "live" },
      { name: "Portugal", flag: "🇵🇹", status: "soon" },
      { name: "Spain", flag: "🇪🇸", status: "soon" },
      { name: "France", flag: "🇫🇷", status: "soon" },
      { name: "Italy", flag: "🇮🇹", status: "soon" },
      { name: "Ireland", flag: "🇮🇪", status: "soon" },
      { name: "United Kingdom", flag: "🇬🇧", status: "soon" },
      { name: "Norway", flag: "🇳🇴", status: "soon" },
      { name: "Iceland", flag: "🇮🇸", status: "soon" }
    ]
  },
  {
    continent: "Africa",
    countries: [
      { name: "Morocco", flag: "🇲🇦", status: "live" },
      { name: "South Africa", flag: "🇿🇦", status: "soon" },
      { name: "Senegal", flag: "🇸🇳", status: "soon" },
      { name: "Namibia", flag: "🇳🇦", status: "soon" },
      { name: "Mozambique", flag: "🇲🇿", status: "soon" },
      { name: "Cape Verde", flag: "🇨🇻", status: "soon" }
    ]
  },
  {
    continent: "Asia",
    countries: [
      { name: "Indonesia", flag: "🇮🇩", status: "soon" },
      { name: "Sri Lanka", flag: "🇱🇰", status: "soon" },
      { name: "Philippines", flag: "🇵🇭", status: "soon" },
      { name: "Maldives", flag: "🇲🇻", status: "soon" },
      { name: "Japan", flag: "🇯🇵", status: "soon" },
      { name: "India", flag: "🇮🇳", status: "soon" }
    ]
  },
  {
    continent: "North America",
    countries: [
      { name: "United States", flag: "🇺🇸", status: "soon" },
      { name: "Mexico", flag: "🇲🇽", status: "soon" },
      { name: "Canada", flag: "🇨🇦", status: "soon" }
    ]
  },
  {
    continent: "Central America & Caribbean",
    countries: [
      { name: "Costa Rica", flag: "🇨🇷", status: "soon" },
      { name: "Nicaragua", flag: "🇳🇮", status: "soon" },
      { name: "Panama", flag: "🇵🇦", status: "soon" },
      { name: "El Salvador", flag: "🇸🇻", status: "soon" },
      { name: "Barbados", flag: "🇧🇧", status: "soon" }
    ]
  },
  {
    continent: "South America",
    countries: [
      { name: "Brazil", flag: "🇧🇷", status: "soon" },
      { name: "Peru", flag: "🇵🇪", status: "soon" },
      { name: "Chile", flag: "🇨🇱", status: "soon" },
      { name: "Ecuador", flag: "🇪🇨", status: "soon" }
    ]
  },
  {
    continent: "Oceania",
    countries: [
      { name: "Australia", flag: "🇦🇺", status: "soon" },
      { name: "New Zealand", flag: "🇳🇿", status: "soon" },
      { name: "Fiji", flag: "🇫🇯", status: "soon" },
      { name: "French Polynesia", flag: "🇵🇫", status: "soon" },
      { name: "Samoa", flag: "🇼🇸", status: "soon" }
    ]
  }
];
