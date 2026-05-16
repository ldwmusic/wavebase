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
      lessen: "Yes — surf packages from ~€490/week, with local instructors (Salah, Younes, Amine).",
      rating: "TripAdvisor 5.0 (283 reviews, ~20 readable); Hostelworld 8.3. Booking.com & Google blocked.",
      sfeer: "Chill and homely — a family house, not a party hostel; lots of returning guests and long stays.",
      activiteiten: "Not a focus in the reviews — the draw is the house, the food and the host."
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
          { kop: "What it is", tekst: `A simple, family-run surf guesthouse in the village. Dorms + a few private rooms. Budget — loose beds from ~€10–15/night, surf packages from ~€490/week.` },
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
    nietIdeaalAls: "You want a quiet, private, high-comfort stay — or you're advanced and coming in summer for serious waves."
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
      activiteiten: "Excursions are part of the all-inclusive package."
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
    nietIdeaalAls: "You're after quiet and privacy, you care about strict cleanliness, or you don't enjoy a busy group house."
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
      activiteiten: "Daily yoga; lounges and a cinema corner at the villa."
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
    nietIdeaalAls: "You specifically want to be on the beach, or you're sensitive to shaky organisation."
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
      activiteiten: "Sandboarding, Paradise Valley trips, Agadir souk tours, fishing and Moroccan cooking classes (day trips need ~6 people minimum)."
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
    nietIdeaalAls: "You want quiet, privacy or hotel-grade cleanliness."
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
      activiteiten: "Yoga is a core part of the offering — it bills itself as a surf-and-yoga stay."
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
    nietIdeaalAls: "You want a rowdy social hostel, or a rock-bottom backpacker price."
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
      activiteiten: "Yoga classes and hiking are listed; the Taghazout skatepark is a few minutes' walk away."
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
    nietIdeaalAls: "You want a big social scene, or you need rental gear sorted in advance."
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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
    town: "Tamraght",
    tagline: "A wide, forgiving reef peak in front of Aourir — rarely busy.",
    levels: ["intermediate"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.4952, -9.6782],
    photo: "",
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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
    town: "Tamraght",
    tagline: "A left-hand reef that pitches — heavy, and it needs size.",
    levels: ["advanced"],
    goodMonths: [10,11,12,1,2,3,4],
    coords: [30.4915, -9.6768],
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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
    town: "Tamraght",
    tagline: "Sand-and-reef A-frames near Agadir — works when everything else is flat.",
    levels: ["beginner", "intermediate", "advanced"],
    goodMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    coords: [30.4503, -9.6631],
    photo: "",
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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
    coords: [30.5490, -9.7400],
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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
    coords: [30.6249, -9.8785],
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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Windguru GFS-Wave 16km archive (Taghazout, id 549853 — Apr 2025–May 2026) + Morocco Atlantic coast water temp climatology",
      periods: [
        { name: "Peak winter swell", months: [11, 12, 1, 2],  inSeason: true,
          waveM: [1.5, 3.0], waterC: [16, 18] },
        { name: "Shoulder",          months: [3, 4, 9, 10],   inSeason: true,
          waveM: [1.0, 2.0], waterC: [17, 22] },
        { name: "Summer (smaller)",  months: [5, 6, 7, 8],    inSeason: true,
          waveM: [0.5, 1.2], waterC: [19, 22] }
      ],
      // J     F     M     A     M     J     J     A     S     O     N     D
      monthlyWaveM:
        [1.7, 1.6, 1.5, 1.3, 1.1, 1.0, 1.1, 0.9, 1.0, 0.8, 1.2, 1.6],
      monthlySwellProb:
        [0.81, 0.89, 0.90, 0.78, 0.72, 0.70, 0.87, 0.58, 0.77, 0.42, 0.70, 0.97],
      monthlyAirC:
        [19, 19, 20, 21, 22, 23, 24, 25, 25, 24, 22, 20],
      

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
      source:     "Wind/gust/reliability: Windguru GFS 13km archive (Kouremenos id 49261), daytime 10–18h, Apr 2025–May 2026. Water temp: East Crete Mediterranean climatology.",
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
        [16, 14, 16, 12, 12, 18, 15, 17, 18, 9, 11, 13],
      // Per-month sea-water temperature in °C — typical East Crete coastal values.
      monthlyGustKn:
        [19, 18, 17, 14, 14, 23, 17, 19, 20, 11, 12, 15],
      monthlyAirC:
        [15, 16, 15, 18, 21, 25, 28, 27, 25, 22, 20, 16],
      

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
      source:     "Wind/gust/reliability: Windguru GFS 13km archive (Tenda Bay id 49260), daytime 10–18h, Apr 2025–May 2026. Water temp: East Crete Mediterranean climatology.",
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
        [16, 14, 16, 13, 12, 19, 15, 17, 18, 9, 11, 14],
      monthlyGustKn:
        [19, 17, 17, 15, 15, 24, 19, 20, 21, 10, 12, 15],
      monthlyAirC:
        [15, 16, 15, 17, 20, 24, 26, 26, 24, 22, 20, 16],
      

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
      source:     "Wind/gust/reliability: Windguru GFS 13km archive (Faneromeni id 49259), daytime 10–18h, Apr 2025–May 2026. Water temp: East Crete Mediterranean climatology.",
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
        [14, 13, 15, 11, 11, 16, 13, 15, 16, 8, 9, 12],
      monthlyGustKn:
        [18, 16, 16, 13, 13, 20, 16, 17, 18, 10, 11, 13],
      monthlyAirC:
        [14, 15, 14, 17, 20, 23, 26, 25, 24, 21, 19, 16],
      

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
      // No Windguru station at Xerokampos itself. Numbers come from Ierapetra
      // (~50 km west, same south-coast meltemi-shadow climate). Honest proxy.
      source:     "Wind/gust/reliability: Windguru GFS 13km archive (Ierapetra id 49264 — ~50 km west, same south-coast pattern), daytime 10–18h, Apr 2025–May 2026. Water temp: East Crete Mediterranean climatology.",
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
        [14, 13, 8, 8, 8, 7, 7, 7, 7, 9, 8, 8],
      // South-coast Crete water — ~1-2°C warmer year-round than north coast.
      monthlyGustKn:
        [16, 16, 10, 10, 9, 11, 9, 9, 9, 10, 9, 10],
      monthlyAirC:
        [14, 15, 14, 18, 20, 27, 29, 28, 26, 22, 20, 16],
      

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
    bookingUrl: "https://gonesurfing.gr/",
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
      "Safety on point: rescue boat ready, instructor on the water during sessions.",
      "Honest minpunt: one 2-star review (Jul 2024) flagged the multi-day package booking as rigid — details in the story. Bron-strength: 🟢 SOLID."
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
    nietIdeaalAls: "You want maximum booking flexibility on multi-day packages (rent by the hour instead), or you want a big-station infrastructure (food, sun beds, bikes — the larger station on the beach fits that better)."
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
      "Per a 2020 Polish reviewer: \"It was windy 28 days during a 30-day stay\" — among the most wind-reliable spots reviewers have visited.",
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
    nietIdeaalAls: "You want a quiet, small, owner-run center — the other center on the beach fits that better."
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
    bookingUrl: "https://www.surfbeachapts.gr/",
    verblijf: {
      eten: "Self-catering studios with kitchenettes. Surf Beach Bar next door for breakfast/snacks; village supermarkets 1.5 km inland in Palekastro. Sun beds and BBQ facilities on site.",
      afstandSpot: "Zero — middle of Kouremenos beach, next door to the windsurf centers. Walk in your wetsuit.",
      verhuur: "Not run by the apartments — windsurf/wing/kite at the two centers on the same beach (see Surf centers).",
      lessen: "Not on site — via one of the centers on the beach.",
      rating: "Booking.com 9.1/10 \"Fantastisch\" over 30 reviews. Also listed on TripAdvisor, Hotels.com, Planet Windsurf Holidays and their own site (surfbeachapts.gr). Bron-strength: 🟢 SOLID.",
      sfeer: "Low-key, windsurfer/wing-foiler crowd. Not a camp — independent travellers who want to wake up to the wind.",
      activiteiten: "Wind sports first; bike rental on site; Vai (5 km), Zakros gorge, Sitia old town in day-trip range."
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
    nietIdeaalAls: "You want a full surf-camp setup with lessons, food and group sessions included."
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
      activiteiten: "Wind sports first; regional side trips per the property's own description (Vai 5 km, Erimoupolis, Itanos, Toplou Monastery)."
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
      `The TripAdvisor review trail is 10 reviews, all between 2013 and May 2017 — nothing in the last 4 years. Those old reviews described a small villa cluster (5 units), well-equipped kitchens, a swimming pool overlooking the windsurf bay, daily cleaning, and consistent praise for cleanliness (5.0/5 sub-score). The 1-star outlier in that older trail was a booking-process complaint, not the property. But nine years is a long time. Furniture, ownership, even the property name on Google Maps ("Hotel Coast Village" now) may have changed since.`,
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
    nietIdeaalAls: "You want the picture grounded in recent guest experience — choose Villa Amalia, Surf Beach Apartments or Flamingo instead, each with 2022+ review coverage."
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
    bookingUrl: "https://flamingo-apartments-palaikastro.gr/en/",
    verblijf: {
      eten: "Self-catering apartments + studios with full kitchenettes (per the property site). Tavernas, mini-market and supermarket nearby; Palekastro center ~12 min walk.",
      afstandSpot: "Near Kouremenos beach (a short drive); Chiona beach ~1–2 km. Rooms 1–3 (first floor) have sea-view balconies toward Chiona per a 2025 TripAdvisor insider tip.",
      verhuur: "On-site windsurf and kitesurf gear storage (per the property site). Bicycle rental and car hire arranged.",
      lessen: "Not on site — book through one of the centers on Kouremenos.",
      rating: "Strong recent signal: 10 Booking reviews 2023-2025 (mostly 9.0-10.0). TripAdvisor 4.5/5 over 19 reviews (13 excellent, 4 good, 1 average, 1 poor) — #2 of 16 condos in Palekastro. TripAdvisor sub-scores: Cleanliness 5.0, Value 4.9, Service 4.8, Rooms 4.7. Bron-strength: 🟢 SOLID with recent coverage.",
      sfeer: "Quiet hamlet, family-run. Aug-2023 Booking reviewer: \"Kostas is a great host!\" — but a Jun-2025 TripAdvisor review reported Kostas had died and a daughter + Marianthi & Michalis had taken over; standard \"remains impeccably high\". 3-star Giata.",
      activiteiten: "Walking distance to Palekastro center (10–12 min); short drive to Chiona, Vai, the Minoan settlement. Bicycle rental on site. Pet-friendly."
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
    nietIdeaalAls: "You want to be ON the beach (it's a short drive) or you want a surf-camp atmosphere with lessons and shared dinners."
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
    bookingUrl: "https://www.villa-amalia.com/",
    verblijf: {
      eten: "Self-catering: five apartments + two rooms with fully equipped kitchenettes (per the property's own site). Multiple 2022+ Booking reviewers cite the garden, BBQ area and welcome arrivals.",
      afstandSpot: "~2 km from Kouremenos beach on the hillside — short drive down. 10 min drive to Vai (per a 2024 reviewer).",
      verhuur: "Not on site — windsurf/wing/kite at the centers on Kouremenos beach.",
      lessen: "Not on site — book through one of the centers on Kouremenos.",
      rating: "Strong recent signal: 10+ Booking reviews 2023-2026 (most 9.0-10.0). TripAdvisor 4.7/5 over 23 reviews (17 excellent, 6 good, 0 negative readable). Sub-scores 4.4-4.6. Bron-strength: 🟢 SOLID with recent coverage.",
      sfeer: "Recurring 2022+ themes: \"felt like home\", \"end of the world feel\" (secluded), gracious hosts. Returning-guest pattern alive in 2025 (one Aug 2025 reviewer: \"stayed last year, decided to return this year\").",
      activiteiten: "Walking/drive: Palekastro (2-3 km), Vai (10 min drive per Aug 2024 review), Chiona, Itanos, Toplou Monastery, Zakros Gorge."
    },
    samenvatting: [
      "Seven units (five apartments + two rooms) on the hillside above Kouremenos, family-owned since the original founders Yorgo & Amalia Katsikalakis opened it.",
      "Strong recent reviews: Booking has 10+ reviews from 2023-2026 (most 9.0-10.0). TripAdvisor 4.7/5 over 23 reviews overall.",
      "Returning-guest pattern still active in the 4-year window: one Aug 2025 reviewer wrote \"stayed last year, decided to return this year\".",
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
    nietIdeaalAls: "You want to be ON the beach (it's a 2 km drive down), or you find a remote setting isolating rather than charming."
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
      activiteiten: "Wind sports first; ancient Minoan town of Rousolakos nearby; Vai, Toplou Monastery, Kato Zakros Gorge in day-trip range."
    },
    samenvatting: [
      "Owner-run beachfront studios on Kouremenos bay, set in an olive yard.",
      "Recent Booking signal: 4 reviews 2023-2026, positive — \"hosts were lovely\", \"completely perfect\" (Jul 2025), kitchen described as \"modern\" (May 2026).",
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
    nietIdeaalAls: "You want the deepest recent review base in the cluster — choose Surf Beach (Booking 9.1/30), Flamingo (4.5/19) or Villa Amalia (10+ recent Booking) for stronger sourcing."
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
