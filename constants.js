/* Static config — not data, not user state. Lives outside data.js (the
   legacy data-of-record file that's no longer loaded at runtime). Loaded
   before app.js so its constants are available at module load.
   - WAVEBASE_MONTHS         : short month labels for filters / pills
   - WAVEBASE_DESTINATIONS   : country list grouped by continent, drives
                               the destinations menu and the world-map
                               legend; lists countries that are "live"
                               (have data in the API) and "soon"
                               (placeholder for future regions).
   Note: the API has its own /countries/ endpoint that returns the same
   set of names + flags + status. We could fetch that at boot too, but
   the destinations menu needs the continent grouping which the API
   currently doesn't expose — so we keep this client-side for now. */

const WAVEBASE_MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Google Sign-In client ID (June 2026, Michiel's "Log in with Google"
   feedback). This value is PUBLIC by design — it's embedded in the
   Google Identity Services button on the client. The matching secret
   is never used by our flow (the backend verifies the ID token against
   Google's public keys), so nothing sensitive lives here.
   Empty string disables the Google button gracefully — the auth modal
   falls back to email/password, so the site never breaks if this is
   blanked or the GIS script is blocked.
   The SAME id must be set as GOOGLE_OAUTH_CLIENT_ID on the API (Render)
   so the backend accepts the tokens this id produces. */
const WAVEBASE_GOOGLE_CLIENT_ID = "962579470282-hb47tofas3lhrhi61bhtf8ndc5jo797m.apps.googleusercontent.com";

const WAVEBASE_DESTINATIONS = [
  {
    continent: "Europe",
    countries: [
      { name: "Greece", flag: "🇬🇷", status: "live" },
      { name: "Belgium", flag: "🇧🇪", status: "live" },
      { name: "Netherlands", flag: "🇳🇱", status: "live" },
      { name: "Germany", flag: "🇩🇪", status: "live" },
      { name: "Portugal", flag: "🇵🇹", status: "live" },
      { name: "Spain", flag: "🇪🇸", status: "live" },
      { name: "France", flag: "🇫🇷", status: "live" },
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

// WAVEBASE_DATA + WAVEBASE_TOWNS are populated by api-client.js at boot
// from the API. They're declared here so they exist as globals from
// page load (before the API fetch completes); api-client.js reassigns
// them when the data arrives.
let WAVEBASE_DATA  = [];
let WAVEBASE_TOWNS = {};
