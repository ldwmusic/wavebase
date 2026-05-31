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

// WAVEBASE_DATA + WAVEBASE_TOWNS are populated by api-client.js at boot
// from the API. They're declared here so they exist as globals from
// page load (before the API fetch completes); api-client.js reassigns
// them when the data arrives.
let WAVEBASE_DATA  = [];
let WAVEBASE_TOWNS = {};
