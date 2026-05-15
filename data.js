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
          { kop: "Location", tekst: `In the centre of Taghazout, ~200 m from the village beach. Hash Point is a short walk; Panorama, Anchor Point, Mysteries and La Source are all within walking distance or a quick shuttle. Same regional pattern: winter bigger and more consistent, summer smaller and softer.` }
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
    buurt: {
      eten: "Cafés and shops in Aourir, close by.",
      parking: "Informal along the N1.",
      verhuur: "Via Tamraght/Aourir, ~10 min from the village centre."
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
    buurt: {
      eten: "Cafés and restaurants right on the seafront (incl. the Surf Berbere café).",
      parking: "In the village; everything is on the beach.",
      verhuur: "Surf schools and board rental along the seafront."
    },
    vergelijking: null,
    ideaalVoor: "Complete beginners and lessons — maximum convenience.",
    nietIdeaalAls: "You can already surf and want quality or quiet."
  }
];

const WAVEBASE_MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ===================== TOWNS — area-level context ===================== */
/* Town facts (what-to-do / transport / distances) from public travel &
   transport guides, 2025–26; distances cross-checked across sources. */
const WAVEBASE_TOWNS = {
  "Tamraght": {
    naam: "Tamraght",
    intro: "A sleepy surf-and-yoga village just up the coast from Agadir — quieter and cheaper than its famous neighbour Taghazout, with a strong little café scene.",
    teDoen: "Beyond the waves: a traditional hammam with an argan-oil scrub, yoga studios looking out over the bay, Moroccan cooking classes, and a small local market on Tuesdays in the upper village. Sandboarding on the dunes near Tamri is ~40 min north; Agadir's huge Souk El Had market is ~25 min away.",
    vervoer: "City bus 32 (Agadir's Place Salam → Taghazout) and bus L33 (Agadir → Tamraght → Taghazout → Tamri) both stop here — roughly every 20 min, ~10–15 dirham, paid to the driver. Grands taxis and the paid Souk-to-Surf shuttle are alternatives. Taghazout is about a 1-hour walk along the seafront.",
    afstand: "A short drive north of Agadir city — about 20–25 min by road (a few km closer in than Taghazout). Agadir Al Massira Airport is ~50 min. Marrakech, the next major city, is ~250 km / ~3 hours to Agadir via the A7.",
    bron: "Public travel & transport guides, 2025–26; distances cross-checked across multiple sources."
  },
  "Taghazout": {
    naam: "Taghazout",
    intro: "A once-sleepy fishing village turned Morocco's trendiest surf-and-wellness town — rooftop cafés, a busy yoga scene, and Anchor Point right on its doorstep.",
    teDoen: "Beyond the waves: a vegan-leaning café culture with rooftop tagine-and-tea spots, yoga classes all over town (~120 dirham a drop-in), hammams and massages, sunset from above Anchor Point, and the boardwalk down to Tamraght. Paradise Valley — palm gorges and natural pools — is a popular ~45-min day trip inland.",
    vervoer: "City bus 32 from Agadir's Place Salam terminates here; bus L33 runs Agadir–Tamraght–Taghazout–Tamri. Buses roughly every 20 min, ~10–15 dirham, paid to the driver. Grands taxis and the paid Souk-to-Surf shuttle also serve the village; once you're there it's small and walkable.",
    afstand: "About 19 km north of Agadir city — roughly 30–45 min by road. Agadir Al Massira Airport is ~60 min. Marrakech, the next major city, is ~250 km / ~3 hours to Agadir via the A7.",
    bron: "Public travel & transport guides, 2025–26; distances cross-checked across multiple sources."
  }
};

/* ===================== DESTINATIONS — worldwide rollout ===================== */
/* Surf destinations by continent. Morocco is live (the QnD region); the rest are
   real surf countries marked "soon" — the worldwide ambition, honestly staged. */
const WAVEBASE_DESTINATIONS = [
  {
    continent: "Europe",
    countries: [
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
