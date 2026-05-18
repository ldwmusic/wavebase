/* WaveBase — QnD logic (English). One script, routes per page:
   index (search + split lists), spot (detail), map, account, compare. */

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function byId(id) { return WAVEBASE_DATA.find(x => x.id === id); }

// Haversine — straight-line km between [lat, lon] pairs.
function distanceKm(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function fmtKm(km) {
  if (km == null || !isFinite(km)) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
function googleMapsHref(coords) {
  return `https://www.google.com/maps?q=${coords[0]},${coords[1]}&z=15`;
}
function bookingHref(e) {
  if (e.bookingUrl) return e.bookingUrl;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(e.name + " " + e.town)}`;
}
function typeLabel(t) {
  if (t === "spot") return "Surf spot";
  if (t === "center") return "Surf center";
  return "Stay";
}
// Build spot.html href; propagates current month filter so the chosen month
// carries through to the detail page's "Your month vs Best month" panel.
function spotHref(id) {
  const m = new URLSearchParams(window.location.search).get("month");
  return m && m !== "all" ? `spot.html?id=${id}&month=${m}` : `spot.html?id=${id}`;
}
// Shorter labels for the corner badge — fits the narrow list-view thumb.
// The entity type is clear; the sport pictogram tells you the discipline.
function typeBadge(t) {
  if (t === "spot") return "Spot";
  if (t === "center") return "Center";
  return "Stay";
}
function typeColor(t) {
  if (t === "spot") return "#3f6f7d";    // teal — surf spots
  if (t === "center") return "#e0a447";  // amber — surf centers
  return "#bd6242";                       // orange — stays
}
function crowdLabel(n) { return { rustig: "Quiet", gemiddeld: "Moderate", druk: "Busy" }[n] || n; }
function thumbStyle(e) { return e.photo ? ` style="background-image:url('${e.photo}')"` : ""; }

/* ---- nav: profile name + compare count ---- */
function updateNav() {
  const acc = document.getElementById("nav-account");
  if (acc) {
    const p = WaveBaseAccount.getProfile();
    const firstName = (p.name || "").trim().split(/\s+/)[0];
    acc.textContent = firstName ? ("Hi, " + firstName) : "My WaveBase";
  }
  const cmp = document.getElementById("nav-compare");
  if (cmp) {
    const n = WaveBaseAccount.getCompare().length;
    cmp.textContent = n ? `Compare (${n})` : "Compare";
  }
  // also sync the mobile bottom tab bar's compare count
  const cmpTab = document.querySelector('.mobile-tabbar a[data-tab="compare"] .tab-label');
  if (cmpTab) {
    const n = WaveBaseAccount.getCompare().length;
    cmpTab.textContent = n ? `Compare (${n})` : "Compare";
  }
}

/* ---- sport pictograms (v9 — locked 2026-05-16) ---- */
const WAVEBASE_SPORT_ICONS = {
  wave: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="40 80 230 160" fill="currentColor"><path d="M0 0 C2.438 2.125 2.438 2.125 4 5 C4.081 8.971 3.469 10.478 0.812 13.438 C-2 15 -2 15 -5.188 14.875 C-8 14 -8 14 -10 12 C-10.674 5.037 -10.674 5.037 -8.375 1.5 C-5.257 -0.469 -3.623 -0.679 0 0 Z " fill="currentColor" transform="translate(124,120)"/><path d="M0 0 C4.639 -0.306 7.112 -0.233 10.965 2.496 C14.385 7.62 14.962 14.419 15.965 20.371 C16.701 20.494 17.437 20.616 18.195 20.742 C20.858 21.347 22.872 22.17 25.277 23.434 C25.975 23.796 26.672 24.158 27.391 24.531 C27.91 24.808 28.43 25.086 28.965 25.371 C28.635 26.691 28.305 28.011 27.965 29.371 C21.78 28.921 16.236 27.81 10.965 24.371 C8.902 21.121 8.902 21.121 7.965 18.371 C7.305 18.371 6.645 18.371 5.965 18.371 C4.457 20.34 4.457 20.34 2.84 22.871 C2.301 23.706 1.762 24.542 1.207 25.402 C0.797 26.052 0.387 26.702 -0.035 27.371 C0.713 27.655 1.46 27.938 2.23 28.23 C5.933 29.775 9.063 31.578 11.965 34.371 C14.04 39.62 12.236 45.057 10.965 50.371 C11.555 50.191 11.555 50.191 14.543 49.277 C16.1 48.808 17.657 48.34 19.215 47.871 C19.992 47.633 20.769 47.394 21.57 47.148 C22.324 46.923 23.079 46.697 23.855 46.465 C24.547 46.255 25.238 46.046 25.95 45.83 C27.965 45.371 27.965 45.371 31.965 45.371 C27.648 55.435 16.532 62.721 6.965 67.371 C3.574 68.086 3.574 68.086 0.965 68.371 C0.965 69.031 0.965 69.691 0.965 70.371 C1.79 70.206 1.79 70.206 5.965 69.371 C5.965 70.031 5.965 70.691 5.965 71.371 C-1.263 77.516 -8.958 78.63 -18.16 78.246 C-24.946 77.695 -31.041 76.127 -37.559 74.227 C-42.128 73.102 -46.366 72.976 -51.035 73.371 C-51.035 72.051 -51.035 70.731 -51.035 69.371 C-46.871 65.755 -42.482 64.415 -37.207 62.984 C-35.035 62.371 -35.035 62.371 -33.035 61.371 C-31.036 61.331 -29.035 61.328 -27.035 61.371 C-26.985 60.662 -26.935 59.953 -26.883 59.223 C-25.926 56.003 -24.424 54.563 -22.036 52.275 C-17.831 48.164 -14.747 44.73 -14.555 38.648 C-14.621 36.157 -14.785 33.686 -14.96 31.2 C-15.328 24.757 -14.172 21.323 -9.859 16.328 C-9.257 15.682 -8.655 15.036 -8.035 14.371 C-7.197 13.18 -6.38 11.974 -5.598 10.746 C-5.082 9.962 -4.566 9.179 -4.035 8.371 C-11.14 9.029 -14.612 11.273 -19.211 16.691 C-21.035 18.371 -21.035 18.371 -25.035 18.371 C-24.234 11.696 -20.071 7.533 -15.035 3.371 C-10.14 1.139 -5.288 0.647 0 0 Z M-6.035 34.371 C-6.038 34.928 -6.04 35.485 -6.043 36.059 C-6.488 44.849 -11.04 49.376 -17.035 55.371 C-17.035 56.031 -17.035 56.691 -17.035 57.371 C-10.327 56.193 -3.673 54.895 2.965 53.371 C3.955 48.751 4.945 44.131 5.965 39.371 C4.542 38.546 3.119 37.721 1.652 36.871 C0.852 36.407 0.051 35.943 -0.773 35.465 C-3.035 34.371 -3.035 34.371 -6.035 34.371 Z " fill="currentColor" transform="translate(105.03515625,133.62890625)"/><path d="M0 0 C2.324 2.016 2.324 2.016 4 4 C4 4.66 4 5.32 4 6 C3.371 5.893 2.742 5.786 2.094 5.676 C-3.948 4.83 -8.686 4.745 -14 8 C-19.096 12.874 -20.683 17.517 -21.312 24.438 C-20.751 30.839 -18.665 36.458 -14 41 C-7.569 45.584 -0.651 47.408 7 49 C7 49.66 7 50.32 7 51 C-15.929 51.968 -15.929 51.968 -24.938 43.812 C-29.988 38.119 -32.694 31.862 -32.332 24.207 C-31.593 19.294 -29.758 15.137 -27 11 C-32.721 15.173 -36.89 20.23 -41.062 25.875 C-41.583 26.579 -42.104 27.284 -42.641 28.009 C-44.784 30.927 -46.901 33.858 -48.973 36.828 C-54.881 45.041 -63.18 49.711 -73 52 C-73.99 52 -74.98 52 -76 52 C-74.496 48.176 -72.331 46.535 -69.062 44.125 C-62.007 38.542 -55.057 31.115 -51 23 C-51.66 23 -52.32 23 -53 23 C-52.133 18.479 -49.521 15.882 -46.438 12.625 C-45.894 12.046 -45.35 11.466 -44.79 10.87 C-32.318 -2.202 -17.232 -8.792 0 0 Z " fill="currentColor" transform="translate(192,156)"/><path d="M0 0 C0.66 0 1.32 0 2 0 C2.098 0.664 2.196 1.328 2.297 2.012 C3.218 7.451 4.126 10.868 8 15 C8 15.66 8 16.32 8 17 C4.578 15.534 2.235 14.006 0 11 C-1.742 3.484 -1.742 3.484 0 0 Z " fill="currentColor" transform="translate(153,188)"/></svg>',
  wind: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="60 80 200 160" fill="currentColor"><path d="M0 0 C10.511 2.867 16.916 15.142 22 24 C30.73 40.318 41 60.088 41 79 C34.85 78.384 29.382 76.593 23.562 74.562 C17.415 72.434 11.339 70.475 5 69 C3.467 52.26 1.971 35.521 0.812 18.75 C0.729 17.551 0.645 16.352 0.559 15.116 C0.22 10.063 -0.04 5.066 0 0 Z " fill="currentColor" transform="translate(164,86)"/><path d="M0 0 C2 2.125 2 2.125 3 5 C2.188 8.312 2.188 8.312 1 11 C-5.374 12.323 -5.374 12.323 -7.938 11 C-9.579 7.911 -9.373 5.424 -9 2 C-5.526 -0.316 -4.086 -0.596 0 0 Z " fill="currentColor" transform="translate(149,139)"/><path d="M0 0 C4.299 0.496 5.436 2.191 8.25 5.375 C10.25 7.25 10.25 7.25 12.25 8.375 C16.394 8.157 19.619 6.269 23.25 4.375 C27.079 3.099 28.58 3.891 32.387 5.141 C33.604 5.536 34.822 5.932 36.076 6.34 C37.363 6.768 38.65 7.197 39.938 7.625 C41.192 8.034 42.447 8.442 43.74 8.863 C49.965 10.902 56.142 13.009 62.25 15.375 C62.415 16.695 62.415 16.695 63.25 23.375 C56.221 27.019 49.087 30.216 41.75 33.188 C40.763 33.594 39.775 34.001 38.758 34.42 C31.507 37.375 31.507 37.375 29.25 37.375 C29.25 38.695 29.25 40.015 29.25 41.375 C41.978 38.471 54.563 35.272 67.072 31.523 C68.081 31.229 69.09 30.936 70.129 30.633 C71.022 30.366 71.914 30.099 72.834 29.825 C75.367 29.353 76.838 29.544 79.25 30.375 C79.119 35.632 77.134 38.547 73.695 42.273 C69.275 46.073 61.215 52.375 55.25 52.375 C55.25 53.035 55.25 53.695 55.25 54.375 C61.438 54.009 67.279 53.197 73.312 51.75 C80.377 50.151 86.368 50.081 93.25 52.375 C93.25 53.035 93.25 53.695 93.25 54.375 C92.367 54.34 91.484 54.305 90.574 54.27 C84.697 54.137 79.344 54.089 73.688 55.812 C63.375 58.935 54.948 58.565 44.702 55.865 C34.55 53.282 25.213 53.555 15.195 56.695 C6.358 58.735 -2.905 58.061 -11.395 55.047 C-18.783 52.939 -27.239 54.463 -34.75 55.375 C-34.75 54.715 -34.75 54.055 -34.75 53.375 C-33.979 53.193 -33.208 53.011 -32.414 52.824 C-31.411 52.573 -30.408 52.321 -29.375 52.062 C-28.377 51.819 -27.38 51.575 -26.352 51.324 C-23.75 50.375 -23.75 50.375 -21.75 47.375 C-18.672 47.23 -15.756 47.245 -12.688 47.375 C-3.037 47.607 5.843 46.422 15.25 44.375 C14.74 39.993 14.028 36.852 11.25 33.375 C8.881 31.995 6.677 30.844 4.188 29.75 C-2.502 26.747 -2.502 26.747 -4.75 23.375 C-6.172 16.405 -7.297 7.843 -3.75 1.375 C-2.75 0.375 -2.75 0.375 0 0 Z M20.062 11.875 C16.008 13.72 12.661 13.607 8.25 13.375 C7.671 16.529 7.504 19.238 8.25 22.375 C10.043 24.039 10.043 24.039 12.375 25.562 C18.896 29.889 20.739 36.275 23.25 43.375 C23.91 43.21 23.91 43.21 27.25 42.375 C26.92 31.815 26.59 21.255 26.25 10.375 C23.25 10.375 23.25 10.375 20.062 11.875 Z M5.25 11.375 C5.25 12.035 5.25 12.695 5.25 13.375 C5.91 13.375 6.57 13.375 7.25 13.375 C7.25 12.715 7.25 12.055 7.25 11.375 C6.59 11.375 5.93 11.375 5.25 11.375 Z " fill="currentColor" transform="translate(143.75,153.625)"/></svg>',
  kite: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="60 80 200 160" fill="currentColor"><path d="M0 0 C8.254 5.749 12.768 13.22 15 23 C16.159 31.613 14.175 39.671 9.023 46.695 C7.097 48.931 5.219 51.054 3 53 C2.34 53 1.68 53 1 53 C1.046 52.117 1.093 51.234 1.141 50.324 C1.483 38.952 -0.725 29.002 -8 20 C-16.293 11.492 -23.344 8.603 -35 7 C-32.644 1.572 -28.42 -0.871 -23.188 -3.312 C-14.739 -5.135 -7.585 -4.214 0 0 Z " fill="currentColor" transform="translate(215,90)"/><path d="M0 0 C3.375 1.125 3.375 1.125 5.375 3.312 C6.612 6.793 6.517 8.622 5.375 12.125 C3.105 14.647 1.738 15.072 -1.625 15.562 C-4.625 15.125 -4.625 15.125 -7 13.5 C-9.138 10.375 -9.308 8.843 -8.625 5.125 C-5.934 1.292 -4.739 0.163 0 0 Z " fill="currentColor" transform="translate(98.625,146.875)"/><path d="M0 0 C0.332 0.182 0.332 0.182 2.012 1.102 C5.896 3.152 8.565 3.416 13.012 3.039 C13.963 2.96 14.914 2.882 15.895 2.801 C18.603 2.569 21.307 2.313 24.012 2.039 C24.342 1.049 24.672 0.059 25.012 -0.961 C26.332 -0.961 27.652 -0.961 29.012 -0.961 C28.867 -0.703 28.867 -0.703 28.137 0.602 C26.724 3.663 25.887 6.789 25.012 10.039 C27.982 9.379 30.952 8.719 34.012 8.039 C34.012 8.699 34.012 9.359 34.012 10.039 C33.022 10.039 32.032 10.039 31.012 10.039 C30.795 10.622 30.579 11.204 30.355 11.805 C28.566 14.78 26.454 15.977 23.512 17.789 C22.532 18.403 21.552 19.016 20.543 19.648 C18.012 21.039 18.012 21.039 16.012 21.039 C16.012 21.699 16.012 22.359 16.012 23.039 C16.61 23.111 16.61 23.111 19.637 23.477 C27.598 25.198 34.956 30.758 41.199 35.809 C45.964 39.044 54.546 36.748 60.012 36.039 C60.342 37.029 60.672 38.019 61.012 39.039 C58.206 40.083 55.395 41.099 52.574 42.102 C51.791 42.396 51.008 42.691 50.201 42.994 C44.406 45.021 40.014 45.154 34.012 44.039 C32.658 43.847 31.304 43.659 29.949 43.477 C28.98 43.332 28.01 43.188 27.012 43.039 C27.342 41.719 27.672 40.399 28.012 39.039 C27.29 38.771 26.568 38.503 25.824 38.227 C23.012 37.039 23.012 37.039 20.734 35.496 C17.512 33.772 15.271 33.643 11.637 33.539 C4.24 33.081 -0.253 32.16 -5.488 26.602 C-16.233 13.396 -16.233 13.396 -16.676 6.039 C-15.862 2.489 -14.892 1.196 -11.988 -0.961 C-7.738 -2.378 -4.075 -1.969 0 0 Z M15.074 9.602 C9.574 11.518 4.68 10.919 -0.988 10.039 C-0.988 10.699 -0.988 11.359 -0.988 12.039 C0.29 12.245 1.569 12.452 2.887 12.664 C5.113 13.199 5.113 13.199 7.012 14.039 C8.262 17.102 8.262 17.102 9.012 20.039 C10.762 20.938 10.762 20.938 13.012 21.039 C15.371 19.605 15.371 19.605 17.762 17.602 C18.161 17.272 18.161 17.272 20.184 15.605 C20.787 15.089 21.39 14.572 22.012 14.039 C21.682 12.059 21.352 10.079 21.012 8.039 C18.657 8.039 17.256 8.722 15.074 9.602 Z " fill="currentColor" transform="translate(107.98828125,165.9609375)"/><path d="M0 0 C0 0.99 0 1.98 0 3 C-1.438 2.69 -2.875 2.377 -4.312 2.062 C-5.113 1.888 -5.914 1.714 -6.738 1.535 C-9 1 -9 1 -12 0 C-21.069 -0.764 -28.685 0.531 -37.355 3.109 C-42.615 4.395 -47.626 4.36 -53 4 C-53 3.34 -53 2.68 -53 2 C-52.068 1.83 -51.136 1.66 -50.176 1.484 C-43.702 0.254 -37.507 -1.072 -31.25 -3.188 C-20.1 -6.714 -10.45 -5.225 0 0 Z " fill="currentColor" transform="translate(207,213)"/><path d="M0 0 C0.547 0.072 0.547 0.072 3.312 0.438 C6.788 0.865 10.266 1.265 13.75 1.625 C14.201 1.673 14.201 1.673 16.484 1.914 C18.955 1.998 20.629 1.606 23 1 C25.165 0.907 27.333 0.87 29.5 0.875 C30.624 0.872 31.748 0.87 32.906 0.867 C35.472 0.977 37.563 1.247 40 2 C40 2.66 40 3.32 40 4 C10.457 8.348 10.457 8.348 0 2 C0 1.34 0 0.68 0 0 Z " fill="currentColor" transform="translate(103,210)"/><path d="M138 158 C155 135 170 115 195 91" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M162 158 C174 150 188 142 205 134" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  wing: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="60 80 200 160" fill="currentColor"><path d="M0 0 C4.724 3.699 9.207 7.592 13.234 12.043 C13.234 12.703 13.234 13.363 13.234 14.043 C13.894 14.043 14.554 14.043 15.234 14.043 C21.031 20.734 24.558 27.727 25.672 36.48 C24.666 44.669 21.192 51.213 15.297 56.918 C13.234 58.043 13.234 58.043 10.812 57.844 C7.743 56.89 6.858 55.877 4.922 53.355 C-1.068 46.108 -8.812 40.531 -18.016 38.23 C-20.607 38.054 -22.305 38.34 -24.766 39.043 C-26.766 38.043 -26.766 38.043 -27.766 35.043 C-29.832 34.094 -29.832 34.094 -32.328 33.355 C-32.741 33.23 -32.741 33.23 -34.832 32.594 C-35.47 32.412 -36.108 32.23 -36.766 32.043 C-37.213 32.742 -37.66 33.44 -38.121 34.16 C-38.423 34.615 -38.423 34.615 -39.953 36.918 C-40.545 37.823 -41.136 38.728 -41.746 39.66 C-44.024 42.347 -45.347 43.26 -48.766 44.043 C-51.441 43.582 -51.441 43.582 -54.078 42.668 C-54.52 42.52 -54.52 42.52 -56.754 41.77 C-57.418 41.53 -58.082 41.29 -58.766 41.043 C-58.766 41.703 -58.766 42.363 -58.766 43.043 C-57.817 43.187 -56.868 43.332 -55.891 43.48 C-54.859 43.996 -53.828 44.512 -52.766 45.043 C-52.273 46.863 -52.273 46.863 -52.016 49.105 C-51.306 53.751 -49.623 55.413 -46.016 58.355 C-40.328 63.021 -37.385 68.219 -34.766 75.043 C-34.766 75.703 -34.766 76.363 -34.766 77.043 C-34.097 76.91 -33.428 76.777 -32.738 76.641 C-23.766 74.991 -14.861 74.452 -5.766 74.043 C-5.106 75.363 -4.446 76.683 -3.766 78.043 C-14.488 84.111 -24.655 86.313 -36.766 88.043 C-37.426 95.303 -38.086 102.563 -38.766 110.043 C-41.742 111.035 -43.493 111.089 -46.578 110.98 C-50.775 110.932 -53.802 111.609 -57.766 113.043 C-63.754 114.391 -67.822 113.917 -73.512 111.75 C-78.646 110.139 -83.956 110.895 -89.203 111.605 C-92.766 112.043 -92.766 112.043 -94.766 111.043 C-94.766 110.383 -94.766 109.723 -94.766 109.043 C-87.894 107.224 -80.834 105.583 -73.957 108.051 C-70.278 109.194 -67.233 109.24 -63.391 109.168 C-62.145 109.15 -60.9 109.132 -59.617 109.113 C-59.147 109.102 -59.147 109.102 -56.766 109.043 C-56.601 108.383 -56.601 108.383 -55.766 105.043 C-54.776 105.043 -53.786 105.043 -52.766 105.043 C-52.766 105.703 -52.766 106.363 -52.766 107.043 C-50.126 107.043 -47.486 107.043 -44.766 107.043 C-44.766 100.773 -44.766 94.503 -44.766 88.043 C-45.756 88.373 -46.746 88.703 -47.766 89.043 C-51.532 89.275 -55.305 89.228 -59.078 89.23 C-60.111 89.243 -61.144 89.255 -62.209 89.268 C-67.453 89.278 -71.869 89.175 -76.766 87.043 C-76.516 85.168 -76.516 85.168 -75.766 83.043 C-72.366 80.755 -69.033 80.659 -65.016 80.418 C-64.43 80.381 -64.43 80.381 -61.469 80.191 C-60.577 80.142 -59.685 80.093 -58.766 80.043 C-57.445 71.751 -60.06 67.666 -64.852 61.055 C-67.732 56.522 -68.411 52.33 -68.766 47.043 C-68.846 46.129 -68.925 45.215 -69.008 44.273 C-69.202 40.381 -69.185 37.827 -67.328 34.355 C-63.392 32.34 -59.981 33.074 -55.766 34.043 C-54.858 34.414 -53.951 34.785 -53.016 35.168 C-49.968 36.353 -48.818 36.278 -45.766 35.043 C-41.97 32.515 -39.208 30.003 -38.18 25.449 C-37.924 18.448 -39.41 11.813 -44.156 6.48 C-47.336 3.668 -50.92 1.783 -54.766 0.043 C-54.625 -1.758 -54.625 -1.758 -53.766 -3.957 C-51.219 -5.625 -51.219 -5.625 -48.016 -7.145 C-46.969 -7.654 -45.922 -8.163 -44.844 -8.688 C-29.799 -14.893 -12.646 -8.949 0 0 Z M-32.766 3.043 C-32.479 3.891 -32.193 4.739 -31.898 5.613 C-30.768 9.036 -29.696 12.471 -28.641 15.918 C-28.287 17.07 -27.934 18.223 -27.57 19.41 C-27.305 20.279 -27.039 21.148 -26.766 22.043 C-18.902 19.86 -11.349 17.05 -3.766 14.043 C-6.167 8.886 -9.497 6.352 -14.766 4.293 C-20.664 2.447 -26.653 2.788 -32.766 3.043 Z M-52.766 64.043 C-52.106 68.663 -51.446 73.283 -50.766 78.043 C-48.126 78.043 -45.486 78.043 -42.766 78.043 C-43.304 73.603 -44.841 69.458 -47.766 66.043 C-48.591 65.713 -48.591 65.713 -52.766 64.043 Z " fill="currentColor" transform="translate(179.765625,104.95703125)"/><path d="M0 0 C0.887 0.412 1.774 0.825 2.688 1.25 C3.438 4.5 3.438 4.5 3.688 8.25 C2.062 10.688 2.062 10.688 -0.312 12.25 C-3.219 12.746 -4.615 12.683 -7.125 11.125 C-8.911 8.305 -8.846 6.515 -8.312 3.25 C-5.438 -0.132 -4.413 -0.999 0 0 Z " fill="currentColor" transform="translate(122.3125,123.75)"/><path d="M0 0 C4.748 1.79 8.529 1.396 13.438 0.438 C14.448 0.252 15.459 0.066 16.5 -0.125 C17.139 -0.269 17.779 -0.414 18.438 -0.562 C18.602 -0.067 18.602 -0.067 19.438 2.438 C11.476 5.606 5.963 5.295 -2.273 3.223 C-8.551 1.724 -13.409 1.951 -19.5 4 C-24.749 5.764 -29.17 5.39 -34.562 4.438 C-34.562 3.778 -34.562 3.118 -34.562 2.438 C-33.621 2.316 -32.68 2.195 -31.711 2.07 C-31.088 1.987 -31.088 1.987 -27.938 1.562 C-26.708 1.4 -25.478 1.238 -24.211 1.07 C-5.642 -2.15 -5.642 -2.15 0 0 Z " fill="currentColor" transform="translate(177.5625,213.5625)"/></svg>'
};

const SPORT_LABEL = { wave: "Surf", wind: "Windsurf", kite: "Kitesurf", wing: "Wingfoil" };

function sportIconsHTML(sports) {
  if (!sports || !sports.length) return "";
  const icons = sports
    .filter(s => WAVEBASE_SPORT_ICONS[s])
    .map(s => `<span class="sport-icon" title="${SPORT_LABEL[s] || s}">${WAVEBASE_SPORT_ICONS[s]}</span>`)
    .join("");
  return `<div class="sport-icons">${icons}</div>`;
}

/* At-a-glance stats panel — first numeric block on spot/center pages.
   Spots store stats themselves; centers inherit from their linkedSpotId.
   Stays don't show this block (they're not condition-bound).
   Missing fields render as "—" rather than being invented. */
function getStatsFor(e) {
  if (e.type === "stay") return null;
  if (e.stats) return e.stats;
  if (e.linkedSpotId) {
    const linked = WAVEBASE_DATA.find(x => x.id === e.linkedSpotId);
    if (linked && linked.stats) return linked.stats;
  }
  return null;
}

function fmtRange(arr, unit) {
  if (!arr || !arr.length) return "—";
  if (arr.length === 1) return `${arr[0]} ${unit}`;
  return `${arr[0]}–${arr[1]} ${unit}`;
}

function crowdLabelText(c) {
  if (c === "low" || c === "laag")        return "low";
  if (c === "moderate" || c === "gemiddeld") return "moderate";
  if (c === "high" || c === "hoog")       return "high";
  return c || "—";
}

function crowdDotsHTML(c) {
  const map = { low: 1, laag: 1, moderate: 2, gemiddeld: 2, high: 3, hoog: 3 };
  const n = map[c] || 0;
  let html = "";
  for (let i = 1; i <= 3; i++) {
    html += `<span class="crowd-dot${i <= n ? " on" : ""}"></span>`;
  }
  return html;
}

const WAVEBASE_MONTH_LONG = ["", "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"];

// Find which period contains a given month (1-12). Returns null if no match.
function findPeriodForMonth(periods, month) {
  if (!periods || !periods.length) return null;
  return periods.find(p => Array.isArray(p.months) && p.months.includes(month)) || null;
}

// Average wind probability for a period — derived from monthlyWindProb where it
// exists, falls back to period.windProb (legacy structure).
function periodWindProb(period, monthlyWindProb) {
  if (!period) return null;
  if (Array.isArray(monthlyWindProb) && Array.isArray(period.months)) {
    const vals = period.months
      .map(m => monthlyWindProb[m - 1])
      .filter(v => typeof v === "number");
    if (vals.length) return vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  return (typeof period.windProb === "number") ? period.windProb : null;
}

// Pick the "best" period — only in-season periods compete; highest wind first.
function pickPeakPeriod(periods, monthlyWindProb) {
  if (!periods || !periods.length) return null;
  const inSeason = periods.filter(p => p.inSeason !== false);
  const pool = inSeason.length ? inSeason : periods;
  return [...pool].sort((a, b) => {
    const pa = periodWindProb(a, monthlyWindProb) || 0;
    const pb = periodWindProb(b, monthlyWindProb) || 0;
    if (pb !== pa) return pb - pa;
    return (b.months || []).length - (a.months || []).length;
  })[0];
}

// What month should the panel highlight as "yours"?
// Priority: ?month= URL param → localStorage pref → today's month.
// localStorage lets the chosen month carry over from Discover to Compare,
// detail pages, etc. — without it, internal nav resets to today.
function userSelectedMonth() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parseInt(params.get("month"), 10);
  if (fromUrl >= 1 && fromUrl <= 12) return fromUrl;
  try {
    const stored = parseInt(localStorage.getItem("wavebase_month_pref"), 10);
    if (stored >= 1 && stored <= 12) return stored;
  } catch (e) { /* localStorage unavailable */ }
  return new Date().getMonth() + 1;
}
function setMonthPref(month) {
  try {
    const m = parseInt(month, 10);
    if (m >= 1 && m <= 12) localStorage.setItem("wavebase_month_pref", String(m));
    else localStorage.removeItem("wavebase_month_pref");
  } catch (e) { /* ignore */ }
}

function periodColumnHTML(period, label, monthLabel, isPeak, stats, targetMonth) {
  if (!period) {
    return `<div class="period-col">
      <div class="period-head">
        <span class="period-tag">${label}</span>
        <span class="period-month">${monthLabel}</span>
      </div>
      <div class="period-empty">No reliable data for this month.</div>
    </div>`;
  }
  // Prefer per-month value where we have monthly arrays — more precise than
  // the period range. Falls back to period.windKn etc. when monthlies missing.
  const m = targetMonth - 1;
  const monthlyKn        = (stats && Array.isArray(stats.monthlyWindKn))      ? stats.monthlyWindKn[m]      : null;
  const monthlyGust      = (stats && Array.isArray(stats.monthlyGustKn))      ? stats.monthlyGustKn[m]      : null;
  const monthlyDailyPeak = (stats && Array.isArray(stats.monthlyDailyPeakKn)) ? stats.monthlyDailyPeakKn[m] : null;
  const monthlyGustPeak  = (stats && Array.isArray(stats.monthlyGustPeakKn))  ? stats.monthlyGustPeakKn[m]  : null;
  const monthlyWat       = (stats && Array.isArray(stats.monthlyWaterC))      ? stats.monthlyWaterC[m]      : null;

  const hasWindData = (typeof monthlyKn === "number") || period.windKn;
  const wind = (typeof monthlyKn === "number")
    ? `~${monthlyKn} kn`
    : (period.windKn ? fmtRange(period.windKn, "kn") : "—");

  // Gust note: avg gust · typical daily peak · 5-year absolute max
  const gustParts = [];
  if (typeof monthlyGust === "number")      gustParts.push(`gust ~${monthlyGust}`);
  if (typeof monthlyDailyPeak === "number") gustParts.push(`daily peak ~${monthlyDailyPeak}`);
  if (typeof monthlyGustPeak === "number")  gustParts.push(`max ${monthlyGustPeak}`);
  let gustNote = gustParts.length ? `${gustParts.join(" · ")} kn` : "";
  if (period.inSeason === false) {
    gustNote = gustNote ? `${gustNote} · centers closed` : "centers closed";
  }

  const wave = period.waveM ? fmtRange(period.waveM, "m") : "—";
  const water = (typeof monthlyWat === "number")
    ? `${monthlyWat} °C`
    : (period.waterC ? fmtRange(period.waterC, "°C") : "—");

  const windRow = hasWindData ? `<div class="period-stat"><span class="period-stat-label">Wind</span>
      <span class="period-stat-val">${wind}</span>
      ${gustNote ? `<span class="period-stat-note">${gustNote}</span>` : ""}
    </div>` : "";

  return `<div class="period-col${isPeak ? " is-peak" : ""}">
    <div class="period-head">
      <span class="period-tag">${label}</span>
      <span class="period-month">${monthLabel} · ${period.name}</span>
    </div>
    ${windRow}
    <div class="period-stat"><span class="period-stat-label">Wave</span>
      <span class="period-stat-val">${wave}</span></div>
    <div class="period-stat"><span class="period-stat-label">Water</span>
      <span class="period-stat-val">${water}</span></div>
  </div>`;
}

function statsPanelHTML(e) {
  const s = getStatsFor(e);
  if (!s) return "";

  const inherited = (e.type === "center" && e.linkedSpotId);
  const inheritedNote = inherited
    ? `<p class="stats-source">Conditions are for the beach this center sits on.</p>`
    : "";

  // Top "always" facts: wave character, wind direction, bottom, crowd, locals
  const topRows = [
    { label: "Wave",     main: s.waveType || "—",  note: "" },
    { label: "Bottom",   main: s.bottom   || "—",  note: "" },
    { label: "Wind dir", main: s.windDir  || "—",  note: "" },
    { label: "Crowd",
      main: `<span class="crowd-dots">${crowdDotsHTML(s.crowd)}</span>`,
      note: crowdLabelText(s.crowd) },
    { label: "Locals",
      main: s.localism || "No verified reports in recent reviews yet.",
      note: s.localism ? "⚠ Inferred from general spot character — not yet verified against recent reviews." : "" }
  ];
  const topFacts = `<div class="stats-grid">${topRows.map(r =>
    `<div class="stats-row">
      <span class="stats-label">${r.label}</span>
      <span class="stats-main">${r.main}</span>
      <span class="stats-note">${r.note}</span>
    </div>`).join("")}</div>`;

  // Period comparison
  let periodComparison = "";
  if (s.periods && s.periods.length) {
    const userMonth = userSelectedMonth();
    const userPeriod = findPeriodForMonth(s.periods, userMonth);
    const peakPeriod = pickPeakPeriod(s.periods, s.monthlyWindProb);
    const userIsPeak = userPeriod && peakPeriod && userPeriod.name === peakPeriod.name;
    const userLabel = WAVEBASE_MONTH_LONG[userMonth];
    // For "Best month" pick the single month inside the peak period with the
    // highest probability — gives a sharper target month for the right column.
    let peakMonth = peakPeriod && peakPeriod.months && peakPeriod.months[0];
    if (peakPeriod && Array.isArray(s.monthlyWindProb)) {
      peakMonth = peakPeriod.months.reduce((best, m) =>
        (s.monthlyWindProb[m - 1] || 0) > (s.monthlyWindProb[best - 1] || 0) ? m : best,
        peakPeriod.months[0]);
    }
    const peakLabel = (peakPeriod && peakPeriod.months || [])
      .map(m => WAVEBASE_MONTH_LONG[m]).join("/");
    periodComparison = `<div class="period-comparison">
      ${periodColumnHTML(userPeriod, "Your month", userLabel, userIsPeak, s, userMonth)}
      ${periodColumnHTML(peakPeriod, "Best months", peakLabel, true, s, peakMonth)}
    </div>`;
  }

  return `<section class="at-a-glance">
    <h2>At a glance</h2>
    ${inheritedNote}
    ${topFacts}
    ${periodComparison}
    ${monthlyChartHTML(e)}
  </section>`;
}

// Two side-by-side bars per month — used for temperature (air vs water).
function buildDualBarChart(opts) {
  // { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks,
  //   barA: { arr, label, colorClass }, barB: { arr, label, colorClass } }
  const { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks, barA, barB } = opts;
  const bars = monthLabels.map((m, i) => {
    const monthNum = i + 1;
    const isUser = monthNum === userMonth;
    const period = findPeriodForMonth(stats.periods, monthNum);
    const inSeason = !period || period.inSeason !== false;
    const seasonClass = inSeason ? "in-season" : "off-season";
    const va = barA.arr[i], vb = barB.arr[i];
    const pctA = (va != null && !isNaN(va)) ? Math.max(2, Math.min(100, (va / maxValue) * 100)) : 0;
    const pctB = (vb != null && !isNaN(vb)) ? Math.max(2, Math.min(100, (vb / maxValue) * 100)) : 0;
    const tip = `${m}: ${barA.label} ${va}${unit} · ${barB.label} ${vb}${unit}`;
    return `<div class="month-bar dual ${seasonClass}${isUser ? " is-user" : ""}" title="${tip}">
      <span class="dual-bars">
        <span class="dual-bar ${barA.colorClass}" style="height: ${pctA}%;"></span>
        <span class="dual-bar ${barB.colorClass}" style="height: ${pctB}%;"></span>
      </span>
      <span class="month-bar-label">${m}</span>
    </div>`;
  }).join("");
  const yAxis = `<div class="y-axis">${axisTicks.map(t =>
    `<span class="y-tick">${t}</span>`).join("")}</div>`;
  const gridlines = `<div class="y-gridlines" aria-hidden="true">${
    axisTicks.map(() => `<span class="y-gridline"></span>`).join("")
  }</div>`;
  const legend = `<div class="chart-legend">
    <span class="legend-item"><span class="legend-swatch ${barA.colorClass}"></span>${barA.label}</span>
    <span class="legend-item"><span class="legend-swatch ${barB.colorClass}"></span>${barB.label}</span>
  </div>`;
  return `<div class="single-chart">
    <h3>${label}${sublabel ? ` <span class="muted">— ${sublabel}</span>` : ""}</h3>
    ${legend}
    <div class="chart-body">
      ${yAxis}
      <div class="chart-plot">
        ${gridlines}
        <div class="month-bars">${bars}</div>
      </div>
    </div>
  </div>`;
}

function buildSingleMetricChart(metricArr, opts) {
  // opts: { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks, colorClass, tooltipFor, overlayArr }
  // axisTicks = array of values to show on the Y axis (top → bottom).
  // tooltipFor(monthNum, value, overlayValue?) → custom tooltip string (optional).
  // overlayArr (optional) → per-month secondary value (e.g. gust kn, air temp);
  //   rendered as a thin horizontal line on top of the bar at its scaled height.
  const { stats, userMonth, monthLabels, label, sublabel, unit, maxValue, axisTicks, colorClass, tooltipFor, overlayArr } = opts;
  const bars = monthLabels.map((m, i) => {
    const monthNum = i + 1;
    const isUser = monthNum === userMonth;
    const v = metricArr[i];
    const period = findPeriodForMonth(stats.periods, monthNum);
    const inSeason = !period || period.inSeason !== false;
    const seasonClass = inSeason ? "in-season" : "off-season";
    const pct = Math.max(2, Math.min(100, (v / maxValue) * 100));
    const ov = overlayArr ? overlayArr[i] : null;
    const ovPct = (ov != null && !isNaN(ov)) ? Math.max(2, Math.min(100, (ov / maxValue) * 100)) : null;
    const tip = tooltipFor ? tooltipFor(monthNum, v, ov) : `${m}: ${v}${unit}`;
    const overlay = ovPct != null
      ? `<span class="month-bar-overlay" style="bottom: ${ovPct}%;"></span>` : "";
    return `<div class="month-bar ${colorClass} ${seasonClass}${isUser ? " is-user" : ""}" title="${tip}">
      <span class="month-bar-fill" style="height: ${pct}%;"></span>
      ${overlay}
      <span class="month-bar-label">${m}</span>
    </div>`;
  }).join("");
  // Y-axis = labels on the left + dashed gridlines at each tick value.
  const yAxis = `<div class="y-axis">${axisTicks.map(t =>
    `<span class="y-tick">${t}</span>`).join("")}</div>`;
  const gridlines = `<div class="y-gridlines" aria-hidden="true">${
    axisTicks.map(() => `<span class="y-gridline"></span>`).join("")
  }</div>`;
  return `<div class="single-chart">
    <h3>${label}${sublabel ? ` <span class="muted">— ${sublabel}</span>` : ""}</h3>
    <div class="chart-body">
      ${yAxis}
      <div class="chart-plot">
        ${gridlines}
        <div class="month-bars">${bars}</div>
      </div>
    </div>
  </div>`;
}

function monthlyChartHTML(e) {
  const stats = getStatsFor(e);
  const userMonth = userSelectedMonth();
  const monthLabels = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  // Wave-type spots get a primary wave-height chart; wind-type spots have
  // no primary chart (avg wind / gust info is surfaced in the at-a-glance
  // facts above). All spots get the temperature chart.
  //   temperature chart: bar = daytime air °C (the value most surfers
  //   intuitively expect to be highest); overlay line = sea water °C.
  if (stats && Array.isArray(stats.monthlyWaterC)) {
    const chartType = stats.chartType || (Array.isArray(stats.monthlyWindKn) ? "wind" : null);
    let primaryChart = null;

    if (chartType === "wave" && Array.isArray(stats.monthlyWaveM)) {
      primaryChart = buildSingleMetricChart(stats.monthlyWaveM, {
        stats, userMonth, monthLabels,
        label: "Wave height",
        sublabel: "daytime avg, metres",
        unit: " m", maxValue: 3, axisTicks: ["3 m", "1.5 m", "0"],
        colorClass: "color-wind",
        tooltipFor: (mn, v) => {
          const i = mn - 1;
          const sp = Array.isArray(stats.monthlySwellProb)
            ? ` · ${Math.round(stats.monthlySwellProb[i] * 100)}% days ≥1 m` : "";
          return `${monthLabels[i]}: ${v} m${sp}`;
        }
      });
    }

    // Temperature chart always renders (whenever water data exists). When
    // air-temp data is present, render as paired bars (air | water) per month.
    const hasAir = Array.isArray(stats.monthlyAirC);
    const tempChart = hasAir
      ? buildDualBarChart({
          stats, userMonth, monthLabels,
          label: "Temperature",
          sublabel: "°C per month — daytime air vs sea water",
          unit: "°C", maxValue: 35, axisTicks: ["35°", "20°", "0°"],
          barA: { arr: stats.monthlyAirC,   label: "Air",   colorClass: "color-air" },
          barB: { arr: stats.monthlyWaterC, label: "Water", colorClass: "color-water" }
        })
      : buildSingleMetricChart(stats.monthlyWaterC, {
          stats, userMonth, monthLabels,
          label: "Temperature",
          sublabel: "°C — sea water",
          unit: " °C", maxValue: 35, axisTicks: ["35°", "20°", "0°"],
          colorClass: "color-water"
        });

    const hasOffSeason = stats.periods && stats.periods.some(p => p.inSeason === false);
    const notes = [];
    if (hasOffSeason) notes.push("Dimmed bars = off-season (centers closed).");
    if (stats.source) notes.push(`Source: ${stats.source}.`);
    const chartNote = notes.length
      ? `<p class="chart-note">${notes.join(" ")}</p>` : "";

    const charts = primaryChart ? `${primaryChart}${tempChart}` : tempChart;
    const wrapClass = primaryChart ? "monthly-chart split" : "monthly-chart single";
    return `<div class="${wrapClass}">
      <div class="chart-pair">${charts}</div>
      ${chartNote}
    </div>`;
  }

  // Fallback: binary "good months" (entries without monthly arrays yet)
  const good = new Set(Array.isArray(e.goodMonths) ? e.goodMonths : []);
  if (!good.size) return "";
  const bars = monthLabels.map((m, i) => {
    const isGood = good.has(i + 1);
    const isUser = (i + 1) === userMonth;
    const height = isGood ? 100 : 25;
    return `<div class="month-bar ${isGood ? "on" : "off"}${isUser ? " is-user" : ""}">
      <span class="month-bar-fill" style="height: ${height}%;"></span>
      <span class="month-bar-label">${m}</span>
    </div>`;
  }).join("");
  return `<div class="monthly-chart">
    <h3>Best months <span class="muted">— recommended months in sea-blue</span></h3>
    <div class="month-bars">${bars}</div>
  </div>`;
}

/* Connect-the-dots — every detail page shows the other entity types nearby
   by ACTUAL distance (Haversine). Keeps clicks inside WaveBase rather than
   leaking to Google: see a stay → click the nearby center → click that
   center's website. */
function nearbyEntriesHTML(currentEntry, targetType, labelPlural, labelSingular, intro, opts) {
  opts = opts || {};
  const maxKm = opts.maxKm != null ? opts.maxKm : 3;
  const limit = opts.limit != null ? opts.limit : 8;
  let scored;
  if (!currentEntry.coords) {
    // Fallback to town equality when this entry has no coords yet.
    scored = WAVEBASE_DATA
      .filter(c => c.type === targetType && c.id !== currentEntry.id &&
                   c.country === entryCountry(currentEntry) && c.town === currentEntry.town)
      .map(c => ({ entry: c, dist: null }));
  } else {
    scored = WAVEBASE_DATA
      .filter(c => c.type === targetType && c.id !== currentEntry.id && c.coords)
      .map(c => ({ entry: c, dist: distanceKm(currentEntry.coords, c.coords) }))
      .filter(x => x.dist <= maxKm)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit);
  }
  if (!scored.length) return "";
  const label = scored.length === 1 ? labelSingular : labelPlural;
  const headerLoc = currentEntry.coords ? `nearby` : `at ${escHTML(currentEntry.town)}`;
  const viewPref = getViewPref();
  const gridClass = viewPref === "list" ? "grid list-view" : "grid";
  return `<section class="related-entries">
    <header class="related-head">
      <h2>${label} ${headerLoc}</h2>
      ${viewToggleHTML(viewPref)}
    </header>
    ${intro ? `<p class="muted form-note">${intro}</p>` : ""}
    <div class="${gridClass}">${scored.map(x => cardHTML(x.entry, x.dist)).join("")}</div>
  </section>`;
}

// Section for a single explicitly-linked entry (used when a center should
// only ever surface ITS spot — not every nearby spot).
function linkedSpotSectionHTML(centerEntry) {
  if (!centerEntry.linkedSpotId) return "";
  const spot = byId(centerEntry.linkedSpotId);
  if (!spot) return "";
  const viewPref = getViewPref();
  const gridClass = viewPref === "list" ? "grid list-view" : "grid";
  return `<section class="related-entries">
    <header class="related-head">
      <h2>The spot this center sits on</h2>
      ${viewToggleHTML(viewPref)}
    </header>
    <p class="muted form-note">Where lessons and rentals happen.</p>
    <div class="${gridClass}">${cardHTML(spot, distanceKm(centerEntry.coords, spot.coords))}</div>
  </section>`;
}

// One-page view-toggle wireup: switches the .list-view class on every
// related-entries grid at once + persists the preference.
function wireDetailViewToggles(container) {
  container.querySelectorAll(".related-entries .view-toggle .view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      setViewPref(view);
      container.querySelectorAll(".related-entries .grid").forEach(g => {
        g.classList.toggle("list-view", view === "list");
      });
      container.querySelectorAll(".related-entries .view-toggle .view-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.view === view);
      });
    });
  });
}

// "More in [country]" — a wider net than the proximity-based "Nearby"
// section. Shows up to 6 other entries from the same country, mixing
// types so the user gets a sense of what else WaveBase has there.
function moreInCountryHTML(currentEntry) {
  const country = entryCountry(currentEntry);
  if (!country) return "";
  const pool = WAVEBASE_DATA.filter(c =>
    entryCountry(c) === country && c.id !== currentEntry.id
  );
  if (!pool.length) return "";
  // Mix types: try to surface a balance of spots / centers / stays
  const byType = { spot: [], center: [], stay: [] };
  pool.forEach(p => { if (byType[p.type]) byType[p.type].push(p); });
  // Round-robin pick to get a mix
  const picks = [];
  while (picks.length < 6 && (byType.spot.length || byType.center.length || byType.stay.length)) {
    for (const t of ["spot", "center", "stay"]) {
      if (byType[t].length && picks.length < 6) picks.push(byType[t].shift());
    }
  }
  if (!picks.length) return "";
  return `<section class="more-in-country">
    <header class="more-in-country-head">
      <h2>More in ${escHTML(country)}</h2>
      <a class="more-in-country-all" href="index.html?country=${encodeURIComponent(country)}">See all &rarr;</a>
    </header>
    <div class="grid list-view">${picks.map(p => cardHTML(p)).join("")}</div>
  </section>`;
}

function relatedSectionsForDetail(e) {
  if (e.type === "spot") {
    // Centers must be on the same beach (≤1km). Stays within easy walk/drive.
    return nearbyEntriesHTML(e, "center", "Centers", "Center",
      "Where to take lessons or rent gear at this beach.", { maxKm: 1, limit: 8 }) +
      nearbyEntriesHTML(e, "stay", "Stays", "Stay",
        "Places to base yourself within easy reach.", { maxKm: 3, limit: 8 });
  }
  if (e.type === "stay") {
    return nearbyEntriesHTML(e, "center", "Centers", "Center",
      "Where to take lessons or rent gear nearby.", { maxKm: 3, limit: 8 }) +
      nearbyEntriesHTML(e, "spot", "Spots", "Spot",
        "The breaks and beaches within easy reach.", { maxKm: 3, limit: 8 });
  }
  if (e.type === "center") {
    // Center pages: ONLY the spot the center sits on — never other nearby
    // spots, even if they're close. Per LDW: the center belongs to its beach.
    return linkedSpotSectionHTML(e) +
      nearbyEntriesHTML(e, "stay", "Stays", "Stay",
        "Places to base yourself within easy reach.", { maxKm: 3, limit: 8 });
  }
  return "";
}

/* ---- card ---- */
function cardHTML(e, distKm) {
  const pills = e.levels.map(l => `<span class="pill">${cap(l)}</span>`).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);
  const distHint = (distKm != null && isFinite(distKm))
    ? ` <span class="muted">· ${fmtKm(distKm)} away</span>` : "";
  return `
  <article class="card" data-href="${spotHref(e.id)}">
    <div class="thumb ${e.type}${e.photo ? " has-photo" : ""}"${thumbStyle(e)}>
      <span class="badge">${typeBadge(e.type)}</span>
      ${e.type === "stay" ? "" : sportIconsHTML(entrySports(e))}
      <button class="compare-btn ${comparing ? "on" : ""}" data-compare="${e.id}" aria-label="Compare" title="${comparing ? "In your compare list" : "Add to compare"}">⇄</button>
      <button class="save-btn ${saved ? "on" : ""}" data-save="${e.id}" aria-label="Save" title="${saved ? "Saved" : "Save this place"}">${saved ? "♥" : "♡"}</button>
    </div>
    <div class="body">
      <div class="place">${e.town}${distHint}</div>
      <h3>${e.name}</h3>
      <p class="tag">${e.tagline}</p>
      <div class="meta">${pills}</div>
    </div>
  </article>`;
}

function wireCards(container) {
  container.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", ev => {
      if (ev.target.closest(".save-btn") || ev.target.closest(".compare-btn")) return;
      window.location.href = card.dataset.href;
    });
  });
  container.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      const on = WaveBaseAccount.toggleSave(btn.dataset.save);
      btn.classList.toggle("on", on);
      btn.textContent = on ? "♥" : "♡";
      btn.title = on ? "Saved" : "Save this place";
    });
  });
  container.querySelectorAll(".compare-btn").forEach(btn => {
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      const on = WaveBaseAccount.toggleCompare(btn.dataset.compare);
      btn.classList.toggle("on", on);
      btn.title = on ? "In your compare list" : "Add to compare";
      updateNav();
    });
  });
}

/* ---- INDEX: country-driven search ---- */
function findCountry(name) {
  if (typeof WAVEBASE_DESTINATIONS === "undefined") return null;
  for (const c of WAVEBASE_DESTINATIONS) {
    for (const co of c.countries) {
      if (co.name === name) return co;
    }
  }
  return null;
}

/* Backward-compatible accessors — older Morocco entries lack country/sports fields */
function entryCountry(e) { return e.country || "Morocco"; }
function entrySports(e)  { return e.sports  || ["wave"]; }

/* HTML-escape user-supplied strings before injecting into innerHTML */
function escHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* Free-text matcher — checks name, town, country, tagline, summary, story and layer titles */
function searchMatch(e, q) {
  const ql = String(q || "").toLowerCase().trim();
  if (!ql) return true;
  const layerText = (e.lagen || []).map(l => l.titel + " " + (l.inhoud || []).map(b => b.kop + " " + b.tekst).join(" ")).join(" ");
  const haystack = [
    e.name, e.town, entryCountry(e), e.tagline,
    ...(e.samenvatting || []),
    ...(e.verhaal || []),
    layerText
  ].join(" ").toLowerCase();
  return haystack.includes(ql);
}

/* Derive live country×sport combos from the actual data, so COMING SOON copy
   updates automatically as new countries/sports get content. */
function getLiveCombos() {
  const map = {};
  WAVEBASE_DATA.forEach(e => {
    const c = entryCountry(e);
    if (!map[c]) map[c] = new Set();
    entrySports(e).forEach(s => map[c].add(s));
  });
  return Object.keys(map).map(country => {
    const dest = findCountry(country);
    return { country, flag: dest ? dest.flag : "", sports: Array.from(map[country]) };
  });
}

/* Friendly country headings: known clusters spelled out, others just the country name */
function countryHeading(country) {
  const map = {
    "Morocco": "Tamraght & Taghazout, Morocco",
    "Greece":  "East Crete, Greece"
  };
  return map[country] || country;
}

function townStripHTML(country) {
  if (typeof WAVEBASE_TOWNS === "undefined") return "";
  const names = Object.keys(WAVEBASE_TOWNS).filter(name => {
    const t = WAVEBASE_TOWNS[name];
    return !country || (t.country || "Morocco") === country;
  });
  if (!names.length) return "";
  const cards = names.map(name => {
    const t = WAVEBASE_TOWNS[name];
    return `<div class="town-card">
      <h3>${t.naam}</h3>
      <p>${t.intro}</p>
      <div class="town-card-facts">
        <span><strong>What to do:</strong> ${t.teDoen}</span>
      </div>
    </div>`;
  }).join("");
  const heading = country
    ? `The location in general: ${escHTML(country)}`
    : "The location in general";
  return `<section class="town-intro-section">
    <h2 class="town-intro-h2">${heading}</h2>
    <div class="town-intro-strip">${cards}</div>
  </section>`;
}

/* ---- view preference (cards vs list), persisted in localStorage ---- */
function getViewPref() {
  return localStorage.getItem("wavebase_view_pref") || "grid";
}
function setViewPref(pref) {
  localStorage.setItem("wavebase_view_pref", pref);
}
function viewToggleHTML(pref) {
  const gridIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
  const listIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
  return `<div class="view-toggle" role="group" aria-label="Result view">
    <button class="view-btn ${pref === "grid" ? "active" : ""}" data-view="grid" aria-label="Card view" title="Card view">${gridIcon}</button>
    <button class="view-btn ${pref === "list" ? "active" : ""}" data-view="list" aria-label="List view" title="List view">${listIcon}</button>
  </div>`;
}
function wireViewToggle(container) {
  container.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setViewPref(btn.dataset.view);
      runSearch();
    });
  });
}

/* ---- sport scope (all / wave / wind / kite / wing) — 'live' is derived from data ---- */
const WAVEBASE_SPORTS = [
  { key: "all",  label: "All"  },
  { key: "wave", label: "Wave" },
  { key: "wind", label: "Wind" },
  { key: "kite", label: "Kite" },
  { key: "wing", label: "Wing" }
];
function sportIsLive(key) {
  if (key === "all") return true;
  if (typeof WAVEBASE_DATA === "undefined") return key === "wave";
  return WAVEBASE_DATA.some(e => entrySports(e).includes(key));
}
function getSportPref() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("sport");
  if (fromUrl) return fromUrl;
  // One-time migration: "wave" used to be the implicit default in earlier
  // versions, so anyone with that stuck in localStorage shouldn't keep it.
  // Treat a stored "wave" as if no pref was set.
  const stored = localStorage.getItem("wavebase_sport_pref");
  if (stored === "wave") {
    localStorage.removeItem("wavebase_sport_pref");
    return "all";
  }
  return stored || "all";
}
function setSportPref(sport) {
  // Don't persist the default — "all" is the natural starting state, no need
  // to take up a slot in localStorage for it.
  if (sport === "all") localStorage.removeItem("wavebase_sport_pref");
  else localStorage.setItem("wavebase_sport_pref", sport);
}
function sportLabel(key) {
  const s = WAVEBASE_SPORTS.find(s => s.key === key);
  return s ? s.label : key;
}
function sportPillsHTML(active) {
  return `<div class="sport-pills" role="tablist" aria-label="Surf sport">
    ${WAVEBASE_SPORTS.map(s => {
      const live = sportIsLive(s.key);
      return `<button class="sport-pill ${s.key === active ? "active" : ""}${live ? "" : " soon"}" data-sport="${s.key}" role="tab" aria-selected="${s.key === active}">${s.label}${live ? "" : ' <span class="soon-tag">soon</span>'}</button>`;
    }).join("")}
  </div>`;
}
function wireSportPills(container) {
  container.querySelectorAll(".sport-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      setSportPref(btn.dataset.sport);
      const url = new URL(window.location.href);
      if (btn.dataset.sport === "all") url.searchParams.delete("sport");
      else url.searchParams.set("sport", btn.dataset.sport);
      window.history.replaceState(null, "", url.toString());
      runSearch();
    });
  });
}

/* Render the spots/centers/stays sections + sticky jumper bar shared between
   country-picker mode and free-text search mode. Returns the HTML string. */
function renderResultsSections(matches, gridClass) {
  if (!matches.length) return "";
  const spots   = matches.filter(e => e.type === "spot");
  const centers = matches.filter(e => e.type === "center");
  const stays   = matches.filter(e => e.type === "stay");
  const sections = [
    { key: "spots",   label: "Surf spots",   items: spots   },
    { key: "centers", label: "Surf centers", items: centers },
    { key: "stays",   label: "Stays",        items: stays   }
  ].filter(s => s.items.length);
  let html = "";
  if (sections.length >= 2) {
    html += `<nav class="section-jumper" aria-label="Jump to section">${sections.map(s =>
      `<a class="jumper-chip" href="#sec-${s.key}" data-jump="${s.key}">${s.label} <span class="jumper-count">${s.items.length}</span></a>`
    ).join("")}</nav>`;
  }
  sections.forEach(s => {
    html += `<section class="result-section" id="sec-${s.key}">
      <button class="section-toggle" type="button" aria-expanded="true" aria-controls="body-${s.key}">
        <span class="section-chev" aria-hidden="true">▾</span>
        <h2>${s.label} <span class="seccount">${s.items.length}</span></h2>
      </button>
      <div class="${gridClass} section-body" id="body-${s.key}">${s.items.map(e => cardHTML(e)).join("")}</div>
    </section>`;
  });
  return html;
}

function runSearch() {
  const country = document.getElementById("f-country").value;
  const level = document.getElementById("f-level").value;
  const month = document.getElementById("f-month").value;
  const type  = document.getElementById("f-type").value;
  const sport = getSportPref();
  const qEl   = document.getElementById("f-search");
  const query = qEl ? qEl.value.trim() : "";
  const results = document.getElementById("results");
  const longSport = { all: "All surf sports", wave: "Wave surfing", wind: "Windsurfing", kite: "Kitesurfing", wing: "Wing foiling" };

  // keep URL in sync — country + filters + sport + free-text query — so links are shareable AND back-navigation restores the state
  const url = new URL(window.location.href);
  const setParam = (k, v, isDefault) => {
    if (v && !isDefault) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  };
  setParam("country", country, !country);
  setParam("level", level, level === "all");
  setParam("type", type, type === "all");
  setParam("month", month, month === "all");
  setParam("sport", sport, sport === "all");
  setParam("q", query, !query);
  window.history.replaceState(null, "", url.toString());

  // Toggle the clear-search button based on whether there's a query
  const clearBtn = document.getElementById("f-search-clear");
  if (clearBtn) clearBtn.hidden = !query;

  // refresh sport pill active state to reflect current sport
  document.querySelectorAll(".sport-pill").forEach(btn => {
    const isActive = btn.dataset.sport === sport;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const pref = getViewPref();
  const gridClass = pref === "list" ? "grid list-view" : "grid";

  // ============ FREE-TEXT SEARCH MODE — overrides the country picker ============
  if (query) {
    const matches = WAVEBASE_DATA.filter(e => {
      if (!searchMatch(e, query)) return false;
      if (sport !== "all" && !entrySports(e).includes(sport)) return false;
      const okL = level === "all" || e.levels.includes(level);
      const okM = month === "all" || e.goodMonths.includes(parseInt(month, 10));
      const okT = type === "all" || e.type === type;
      return okL && okM && okT;
    });
    let html = `<div class="results-head"><h2>Search: &ldquo;${escHTML(query)}&rdquo; <span class="seccount">${matches.length}</span></h2>${matches.length ? viewToggleHTML(pref) : ""}</div>`;
    if (matches.length === 0) {
      html += `<div class="empty">
        <strong>Nothing matches &ldquo;${escHTML(query)}&rdquo; in <strong>${longSport[sport]}</strong>.</strong><br>
        Try a different spelling, a broader term, or another sport — or clear the search and browse by country.
      </div>`;
    } else {
      html += renderResultsSections(matches, gridClass);
    }
    results.innerHTML = html;
    wireCards(results);
    wireViewToggle(results);
    wireSectionToggle(results);
    wireSectionJumper(results);
    return;
  }

  // no country yet → make the whole empty box one big click target that
  // opens the country picker (per LDW: no link-in-text, the whole dotted
  // panel is the affordance).
  if (!country) {
    results.innerHTML = `<button type="button" class="empty empty-clickable" id="empty-open-destinations">
      <strong>Pick a country to begin.</strong>
      <span class="empty-sub">Tap here to open the country picker &mdash; or use the &ldquo;Where?&rdquo; field above, or type a place in the search bar.</span>
    </button>`;
    const openBtn = document.getElementById("empty-open-destinations");
    if (openBtn) {
      openBtn.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        openDestinationsMenu();
      });
    }
    return;
  }

  // Data-driven: filter entries by country (with default) and sport (with default)
  const liveCountrySportEntries = WAVEBASE_DATA.filter(e =>
    entryCountry(e) === country && (sport === "all" || entrySports(e).includes(sport))
  );

  // No entries for this country×sport combo → COMING SOON with smart hints
  if (liveCountrySportEntries.length === 0) {
    const dest = findCountry(country);
    const flag = dest ? dest.flag : "";
    const title = `${longSport[sport]} in ${country}`;

    // What is live for this country (other sports)?
    const combos = getLiveCombos();
    const thisCountry = combos.find(c => c.country === country);
    const otherSportsHere = thisCountry ? thisCountry.sports.filter(s => s !== sport) : [];

    // What countries are live for this sport?
    const otherCountriesForSport = combos
      .filter(c => c.country !== country && c.sports.includes(sport))
      .map(c => `${c.flag} ${c.country}`);

    let hint = "";
    if (otherSportsHere.length) {
      const list = otherSportsHere.map(s => longSport[s]).join(", ");
      hint += `<p>In <strong>${country}</strong>, <strong>${list}</strong> is already live — switch the sport pill above.</p>`;
    }
    if (otherCountriesForSport.length) {
      hint += `<p>For <strong>${longSport[sport]}</strong>, live countries: ${otherCountriesForSport.join(" &middot; ")}.</p>`;
    }
    if (!hint) {
      hint = `<p>WaveBase is rolling out worldwide and across all surf sports — more is on its way.</p>`;
    }

    results.innerHTML = `<section class="coming-soon">
      ${flag ? `<div class="coming-flag">${flag}</div>` : ""}
      <h2>Coming soon</h2>
      <p><strong>${title}</strong> is on its way.</p>
      ${hint}
    </section>`;
    return;
  }

  // Apply the secondary filters (level / month / type) inside the country×sport set
  const matches = liveCountrySportEntries.filter(e => {
    const okL = level === "all" || e.levels.includes(level);
    const okM = month === "all" || e.goodMonths.includes(parseInt(month, 10));
    const okT = type === "all" || e.type === type;
    return okL && okM && okT;
  });

  const heading = countryHeading(country);
  let html = "";

  if (matches.length === 0) {
    html += `<div class="results-head"><h2>${heading}</h2></div>`;
    html += townStripHTML(country);
    html += `<div class="empty"><strong>Nothing's a perfect match here.</strong><br>
      Try loosening a filter — the live region only has so many entries for now.</div>`;
  } else {
    html += `<div class="results-head"><h2>${heading}</h2>${viewToggleHTML(pref)}</div>`;
    html += townStripHTML(country);
    html += renderResultsSections(matches, gridClass);
  }

  results.innerHTML = html;
  wireCards(results);
  wireViewToggle(results);
  wireSectionToggle(results);
  wireSectionJumper(results);
}

function wireSectionToggle(container) {
  container.querySelectorAll(".section-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".result-section");
      const wasOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", wasOpen ? "false" : "true");
      section.classList.toggle("collapsed", wasOpen);
    });
  });
}

function wireSectionJumper(container) {
  container.querySelectorAll(".jumper-chip").forEach(chip => {
    chip.addEventListener("click", ev => {
      ev.preventDefault();
      const key = chip.dataset.jump;
      const section = document.getElementById("sec-" + key);
      if (!section) return;
      // Expand if currently collapsed so the user lands on visible content
      const btn = section.querySelector(".section-toggle");
      if (btn && btn.getAttribute("aria-expanded") === "false") btn.click();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initIndex() {
  const mSel = document.getElementById("f-month");
  for (let i = 1; i <= 12; i++) {
    const o = document.createElement("option");
    o.value = i; o.textContent = WAVEBASE_MONTHS[i];
    mSel.appendChild(o);
  }
  // populate the country picker — datalist gives native type-ahead autocomplete.
  // option.value = bare country name (clean URLs + clean state). The "— soon" hint
  // appears only in the suggestion display where the user picks.
  const cDl = document.getElementById("f-country-list");
  if (cDl && typeof WAVEBASE_DESTINATIONS !== "undefined") {
    WAVEBASE_DESTINATIONS.forEach(cont => {
      cont.countries.forEach(co => {
        const o = document.createElement("option");
        o.value = co.name;
        if (co.status !== "live") o.label = `${co.name} — soon`;
        cDl.appendChild(o);
      });
    });
  }
  // pre-select all filters from URL params (country + level/type/month + free-text q) — supports deep links and back-navigation
  const params = new URLSearchParams(window.location.search);
  [["country","f-country"],["level","f-level"],["type","f-type"],["month","f-month"],["q","f-search"]].forEach(([k, id]) => {
    const v = params.get(k);
    if (v) {
      const el = document.getElementById(id);
      if (el) el.value = v;
    }
  });
  ["f-level", "f-month", "f-type", "f-country"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", runSearch);
  });
  // Persist the picked month so it carries to Compare / detail pages.
  const fMonth = document.getElementById("f-month");
  if (fMonth) {
    // Save on load (handles deep links and the initial select-from-URL above)
    setMonthPref(fMonth.value === "all" ? null : fMonth.value);
    fMonth.addEventListener("change", () => {
      setMonthPref(fMonth.value === "all" ? null : fMonth.value);
    });
  }
  // Opening the Where field also opens the destinations menu so the user
  // sees the country grid (with flags + "soon" labels). Typing inside the
  // field filters the chips inline — a country whose name doesn't include
  // the typed substring fades out + becomes unclickable.
  const fCountry = document.getElementById("f-country");
  if (fCountry) {
    // Focus handler opens the menu WITHOUT scrolling — focus fires before
    // mouseup, so a scroll here would move the input out from under the
    // cursor and break the click. The click handler (which fires after
    // mouseup) is the one that scrolls.
    fCountry.addEventListener("focus", () => openDestinationsMenu({ scroll: false }));
    fCountry.addEventListener("click", ev => {
      ev.stopPropagation();
      openDestinationsMenu();
    });
    fCountry.addEventListener("input", () => {
      const q = fCountry.value.trim().toLowerCase();
      const panel = document.getElementById("destinations-menu");
      if (!panel) return;
      panel.querySelectorAll(".dest-chip").forEach(chip => {
        const name = (chip.dataset.country || "").toLowerCase();
        const hit = !q || name.includes(q);
        chip.classList.toggle("dimmed", !hit);
      });
      // Hide continent columns that no longer have any matching chips.
      panel.querySelectorAll(".dest-continent").forEach(col => {
        const anyHit = col.querySelector(".dest-chip:not(.dimmed)");
        col.classList.toggle("dimmed", !anyHit);
      });
    });
    fCountry.addEventListener("keydown", ev => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      // Pressing Enter selects the first visible (non-dimmed) chip
      const panel = document.getElementById("destinations-menu");
      const first = panel && panel.querySelector(".dest-chip:not(.dimmed)");
      if (first) first.click();
    });
  }
  document.getElementById("search-btn").addEventListener("click", runSearch);

  // live free-text search (debounced — small dataset, so 150 ms is plenty)
  const fSearch = document.getElementById("f-search");
  if (fSearch) {
    let t;
    fSearch.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(runSearch, 150);
    });
    fSearch.addEventListener("keydown", ev => {
      if (ev.key === "Escape") { fSearch.value = ""; runSearch(); fSearch.blur(); }
    });
  }
  const fClear = document.getElementById("f-search-clear");
  if (fClear && fSearch) {
    fClear.addEventListener("click", () => {
      fSearch.value = "";
      runSearch();
      fSearch.focus();
    });
  }

  // inject sport pills (Wave / Wind / Kite / Wing) above the searcher section
  const searcherEl = document.querySelector(".searcher");
  const searcherSection = searcherEl && searcherEl.closest("section");
  if (searcherSection && !document.querySelector(".sport-pills")) {
    const wrap = document.createElement("section");
    wrap.className = "wrap sport-pills-wrap";
    wrap.innerHTML = sportPillsHTML(getSportPref());
    searcherSection.parentNode.insertBefore(wrap, searcherSection);
    wireSportPills(wrap);
  }

  runSearch();
}

/* ---- SEO helpers ---- */
const SITE_ORIGIN = "https://wavebase.lode-b162.workers.dev";

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const m = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function applySpotSEO(e) {
  const typeLabelStr = typeLabel(e.type);
  const country = entryCountry(e);
  const title = `${e.name} — ${typeLabelStr} in ${e.town}, ${country} | WaveBase`;
  const desc = (e.tagline || `Honest analysis of ${e.name} (${typeLabelStr}) in ${e.town}, ${country}.`).slice(0, 300);
  const url = `${SITE_ORIGIN}/spot.html?id=${e.id}`;

  document.title = title;
  setMeta('meta[name="description"]', "content", desc);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", desc);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", desc);

  // canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);

  // JSON-LD structured data — schema.org type per entity type
  const schemaType = e.type === "spot" ? "TouristAttraction"
                   : e.type === "stay" ? "LodgingBusiness"
                   : "LocalBusiness";
  const ld = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": e.name,
    "description": desc,
    "url": url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": e.town,
      "addressCountry": country
    }
  };
  if (e.coords) {
    ld.geo = {
      "@type": "GeoCoordinates",
      "latitude": e.coords[0],
      "longitude": e.coords[1]
    };
  }
  if (e.bookingUrl) ld.sameAs = [e.bookingUrl];
  let ldEl = document.getElementById("ld-spot");
  if (!ldEl) {
    ldEl = document.createElement("script");
    ldEl.type = "application/ld+json";
    ldEl.id = "ld-spot";
    document.head.appendChild(ldEl);
  }
  ldEl.textContent = JSON.stringify(ld);
}

/* ---- SPOT: detail page ---- */
// Auto-link entry names in prose — turns "Tenda is a separate destination"
// into "<a href=...>Tenda</a> is a separate destination". Skips the current
// entry (so a page doesn't link to itself), prefers longer name matches
// first (so "Gone Surfing Crete" wins over a stray "Surfing"), and uses
// a zero-width marker to avoid re-matching text that's already inside a
// link we just inserted.
function autoLinkEntries(html, currentId) {
  if (!html || typeof html !== "string") return html || "";
  const entries = (typeof WAVEBASE_DATA === "undefined" ? [] : WAVEBASE_DATA)
    .filter(e => e && e.id !== currentId && e.name)
    .sort((a, b) => b.name.length - a.name.length);
  if (!entries.length) return html;
  const MARK = "​"; // zero-width space marker
  let out = html;
  for (const e of entries) {
    // Strip parentheticals so "Freak Surf (Freak Windsurf Station)" still matches "Freak Surf"
    const baseName = e.name.replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (!baseName) continue;
    const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Word boundary + skip if already wrapped (marker prefix/suffix).
    const re = new RegExp(`(?<!${MARK})\\b(${escaped})\\b(?!${MARK})`, "gi");
    out = out.replace(re, (match) =>
      `${MARK}<a class="entry-ref" href="${spotHref(e.id)}">${match}</a>${MARK}`);
  }
  return out.split(MARK).join("");
}

function laagHTML(laag, currentId) {
  const blokken = laag.inhoud.map(b =>
    `<div class="blok"><h3>${b.kop}</h3><p>${autoLinkEntries(b.tekst, currentId)}</p></div>`).join("");
  return `<section class="laag"><h2>${laag.titel}</h2>
    <span class="bron">Source: ${laag.bron}</span>${blokken}</section>`;
}

function vergelijkingHTML(v) {
  if (!v) return "";
  const rows = v.rijen.map(r =>
    `<tr><td class="mon">${r.label}</td><td class="surf">${r.a}</td><td class="host">${r.b}</td></tr>`).join("");
  return `<section class="vergelijking"><h2>${v.kop}</h2>
    <table class="cal"><tr><th>Period</th><th>Surf</th><th>Stay</th></tr>${rows}</table></section>`;
}

function druktelIndicator(niveau) {
  const order = ["rustig", "gemiddeld", "druk"];
  const idx = order.indexOf(niveau);
  const segs = [0, 1, 2].map(i =>
    `<span class="drukte-seg${i <= idx ? " on " + niveau : ""}"></span>`).join("");
  return `<span class="drukte-bar" title="${crowdLabel(niveau)}">${segs}</span>`;
}

function conditiesHTML(c) {
  if (!c) return "";
  return `<section class="condities">
    <h2>Conditions</h2>
    <div class="cond-grid">
      <div class="cond-item"><span class="cond-label">Wave type</span><span class="cond-val">${c.golftype}</span></div>
      <div class="cond-item"><span class="cond-label">Wave height</span><span class="cond-val">${c.golfhoogte}</span></div>
      <div class="cond-item"><span class="cond-label">Wind</span><span class="cond-val">${c.wind}</span></div>
      <div class="cond-item"><span class="cond-label">Water temperature</span><span class="cond-val">${c.water}</span></div>
      <div class="cond-item drukte-item">
        <span class="cond-label">Crowd &middot; ${crowdLabel(c.drukte.niveau)} ${druktelIndicator(c.drukte.niveau)}</span>
        <span class="cond-val">${c.drukte.tekst}</span>
      </div>
    </div>
  </section>`;
}

function verblijfHTML(v) {
  if (!v) return "";
  const rows = [
    ["Food", v.eten],
    ["Distance from surf spot", v.afstandSpot],
    ["Gear rental", v.verhuur],
    ["Lessons", v.lessen],
    ["Rating", v.rating],
    ["Vibe", v.sfeer],
    ["Other activities", v.activiteiten]
  ];
  const items = rows.map(([k, val]) =>
    `<div class="cond-item"><span class="cond-label">${k}</span><span class="cond-val">${val || "—"}</span></div>`
  ).join("");
  return `<section class="condities">
    <h2>The stay at a glance</h2>
    <div class="cond-grid verblijf-grid">${items}</div>
  </section>`;
}

function dienstenHTML(d) {
  if (!d) return "";
  const rows = [
    ["Lessons", d.lessen],
    ["Rental", d.rental],
    ["Gear brands", d.brands],
    ["Facilities", d.faciliteiten],
    ["Team & vibe", d.team]
  ];
  const items = rows.map(([k, val]) =>
    `<div class="cond-item"><span class="cond-label">${k}</span><span class="cond-val">${val || "—"}</span></div>`
  ).join("");
  return `<section class="condities">
    <h2>The center at a glance</h2>
    <div class="cond-grid verblijf-grid">${items}</div>
  </section>`;
}

function buurtHTML(b, currentId) {
  if (!b) return "";
  return `<section class="buurt">
    <h2>Nearby</h2>
    <div class="buurt-grid">
      <div class="buurt-item"><span class="buurt-label">Food</span><span>${autoLinkEntries(b.eten, currentId)}</span></div>
      <div class="buurt-item"><span class="buurt-label">Parking</span><span>${autoLinkEntries(b.parking, currentId)}</span></div>
      <div class="buurt-item"><span class="buurt-label">Gear rental</span><span>${autoLinkEntries(b.verhuur, currentId)}</span></div>
    </div>
  </section>`;
}

function townPanelHTML(townName) {
  const towns = (typeof WAVEBASE_TOWNS !== "undefined") ? WAVEBASE_TOWNS : null;
  const t = towns && towns[townName];
  if (!t) return "";
  return `<section class="town-panel">
    <h2>The town &middot; ${t.naam}</h2>
    <p class="town-intro-line">${t.intro}</p>
    <div class="town-grid">
      <div class="town-item"><span class="town-label">What to do</span><span>${t.teDoen}</span></div>
      <div class="town-item"><span class="town-label">Public transport</span><span>${t.vervoer}</span></div>
      <div class="town-item"><span class="town-label">Getting there</span><span>${t.afstand}</span></div>
    </div>
    ${t.bron ? `<span class="bron">Source: ${t.bron}</span>` : ""}
  </section>`;
}

// Mock surfer-reviews section — UI only, no storage. Lets us validate
// the design + collect "would you submit?" signal before any backend lands.
// All submissions are dropped on the floor with a "coming soon" confirmation.
function reviewsMockHTML(e) {
  const typeWord = e.type === "stay" ? "stay" : (e.type === "center" ? "center" : "spot");
  return `<section class="reviews-mock" id="reviews">
    <header class="reviews-head">
      <h2>Surfer reviews <span class="reviews-soon-tag">coming soon</span></h2>
      <p class="muted">Have you been to this ${typeWord}? Tell us how it matched our write-up.
        The form below works as a preview — your input won't be saved yet (backend is phase 2),
        but it shows what's coming.</p>
    </header>

    <form class="review-form" data-mock-target="${e.id}" autocomplete="off">
      <div class="review-field">
        <label>Your rating</label>
        <div class="review-stars" role="radiogroup" aria-label="Star rating">
          ${[1,2,3,4,5].map(n => `<button type="button" class="review-star" data-stars="${n}" role="radio" aria-label="${n} star${n>1?'s':''}">★</button>`).join("")}
        </div>
      </div>

      <div class="review-field">
        <label>Does our write-up match what you found?</label>
        <div class="review-radio-row">
          <label class="review-radio"><input type="radio" name="matches" value="yes"> Yes, on the nose</label>
          <label class="review-radio"><input type="radio" name="matches" value="partial"> Partly</label>
          <label class="review-radio"><input type="radio" name="matches" value="no"> No, my experience differed</label>
        </div>
      </div>

      <div class="review-field">
        <label for="review-text">Your honest take <span class="muted">(any month, any year — we'll show date + month with the review)</span></label>
        <textarea id="review-text" name="text" rows="4" placeholder="What surprised you? Anything off?"></textarea>
      </div>

      <div class="review-field review-field-row">
        <label class="review-name-field">First name or initials <input type="text" name="name" placeholder="e.g. Lode D."></label>
        <button type="submit" class="btn">Submit (preview)</button>
      </div>

      <p class="review-feedback" hidden></p>
    </form>

    <div class="review-empty">
      <em>No reviews yet — the list will fill up once the backend goes live and surfers start posting.</em>
    </div>
  </section>`;
}

function tripOptionsHTML(entryId) {
  // Trips that already contain this entry get a ✓ prefix so the user can see
  // at a glance where it sits without re-adding. The first such trip becomes
  // the selected default — so the dropdown shows the membership rather than
  // a flat "+ Add to a trip…" after a successful add.
  const trips = WaveBaseAccount.getTrips();
  const inTrips = new Set(trips.filter(t => Array.isArray(t.spotIds) && t.spotIds.includes(entryId)).map(t => t.id));
  const opts = trips.map(t => {
    const isIn = inTrips.has(t.id);
    const sel = isIn ? " selected" : "";
    const label = isIn ? `✓ In: ${t.name}` : t.name;
    return `<option value="${t.id}"${sel}>${label}</option>`;
  }).join("");
  const placeholderSel = inTrips.size ? "" : " selected";
  return `<option value=""${placeholderSel}>+ Add to a trip…</option>${opts}<option value="__new">➕ New trip…</option>`;
}

function tripViewLinkHTML(entryId) {
  // Inline link that opens whichever trip this entry sits in, on the account
  // page, scrolled to that trip. Empty when the entry isn't in any trip yet.
  const trips = WaveBaseAccount.getTrips();
  const containing = trips.filter(t => Array.isArray(t.spotIds) && t.spotIds.includes(entryId));
  if (!containing.length) return "";
  if (containing.length === 1) {
    const t = containing[0];
    return `<a class="trip-view-link" href="account.html#trip-${t.id}" title="Open ${escHTML(t.name)} on your account page">View trip ↗</a>`;
  }
  return `<a class="trip-view-link" href="account.html#trips" title="Open your trips on the account page">View ${containing.length} trips ↗</a>`;
}

function initSpot() {
  const root = document.getElementById("detail-root");
  const id = new URLSearchParams(window.location.search).get("id");
  const e = byId(id);
  if (!e) {
    root.innerHTML = `<p class="empty"><strong>Not found.</strong><br>
      <a href="index.html">Back to all places</a></p>`;
    return;
  }
  applySpotSEO(e);
  const verhaal = e.verhaal.map(p => `<p>${autoLinkEntries(p, e.id)}</p>`).join("");
  const samenvatting = e.samenvatting.map(s => `<li>${autoLinkEntries(s, e.id)}</li>`).join("");
  const lagen = e.lagen.map(l => laagHTML(l, e.id)).join("");
  const saved = WaveBaseAccount.isSaved(e.id);
  const comparing = WaveBaseAccount.isComparing(e.id);

  // Back link defaults to the entry's country on "All" sport — keeps the fallback
  // welcoming. history.back() restores the specific sport state when the user
  // came from inside the site (handled by the click listener further down).
  const backHref = `index.html?country=${encodeURIComponent(entryCountry(e))}`;
  root.innerHTML = `
    <a class="backlink" href="${backHref}">&larr; Back to all places</a>
    <div class="detail-photo ${e.type}${e.photo ? " has-photo" : ""}"${e.photo ? ` style="background-image:url('${e.photo}')"` : ""}>
      ${e.photo ? "" : `<span class="photo-placeholder">Photo coming soon</span>`}
    </div>
    <header class="detail-head">
      <div class="place">
        <a class="head-chip" href="index.html?type=${e.type}">${typeLabel(e.type)}</a>
        <span class="head-sep">&middot;</span>
        <a class="head-chip" href="index.html?country=${encodeURIComponent(entryCountry(e))}&amp;q=${encodeURIComponent(e.town)}">${e.town}</a>
        <span class="head-sep">&middot;</span>
        <a class="head-chip" href="index.html?country=${encodeURIComponent(entryCountry(e))}">${entryCountry(e)}</a>
      </div>
      <h1>${e.name}</h1>
      <p class="tag">${e.tagline}</p>
      ${e.coordsLabel ? `<p class="coords-note">About the location: ${e.coordsLabel}</p>` : ""}
      <div class="detail-actions">
        ${e.type === "stay" ? `<a class="btn btn-book" href="${bookingHref(e)}" target="_blank" rel="noopener">Book now ↗</a>` : ""}
        ${e.type === "center" && e.bookingUrl ? `<a class="btn btn-book" href="${e.bookingUrl}" target="_blank" rel="noopener">Visit website ↗</a>` : ""}
        <button class="btn ghost ${saved ? "on" : ""}" id="save-toggle">${saved ? "♥ Saved" : "♡ Save this place"}</button>
        <button class="btn ghost ${comparing ? "on" : ""}" id="compare-toggle">${comparing ? "✓ In compare" : "+ Compare"}</button>
        <span class="trip-picker">
          <select id="trip-select">${tripOptionsHTML(e.id)}</select>
          <span id="trip-view-link-slot">${tripViewLinkHTML(e.id)}</span>
        </span>
      </div>
    </header>

    ${e.coords ? `<div class="detail-map" id="detail-map"></div>
      <p class="map-actions"><a href="${googleMapsHref(e.coords)}" target="_blank" rel="noopener">Open in Google Maps ↗</a></p>` : ""}

    ${statsPanelHTML(e)}

    <div class="kort">
      <h2>In short</h2>
      <ul>${samenvatting}</ul>
    </div>

    ${conditiesHTML(e.condities)}
    ${verblijfHTML(e.verblijf)}
    ${dienstenHTML(e.diensten)}

    <div class="verhaal">
      <h2>The honest story</h2>
      ${verhaal}
    </div>

    ${lagen}
    ${buurtHTML(e.buurt, e.id)}
    ${vergelijkingHTML(e.vergelijking)}
    ${relatedSectionsForDetail(e)}
    ${townPanelHTML(e.town)}

    <section class="fit">
      <div class="box yes"><h3>Ideal for</h3><p>${e.ideaalVoor}</p></div>
      <div class="box no"><h3>Not ideal if</h3><p>${e.nietIdeaalAls}</p></div>
    </section>

    ${moreInCountryHTML(e)}

    ${reviewsMockHTML(e)}`;

  // mini-map showing this entry's location
  if (e.coords && typeof L !== "undefined" && document.getElementById("detail-map")) {
    const m = L.map("detail-map", { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
    }).addTo(m);
    L.circleMarker(e.coords, { radius: 10, color: "#fff", weight: 3, fillColor: typeColor(e.type), fillOpacity: 1 })
      .bindPopup(`<strong>${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}`)
      .addTo(m);
    m.setView(e.coords, 14);
  }

  // Wire embedded entry cards (related sections + "More in country") + the
  // per-section list/cards toggle.
  if (root.querySelector(".related-entries .grid") || root.querySelector(".more-in-country .grid")) {
    wireCards(root);
    wireDetailViewToggles(root);
  }

  document.getElementById("save-toggle").addEventListener("click", function () {
    const on = WaveBaseAccount.toggleSave(e.id);
    this.textContent = on ? "♥ Saved" : "♡ Save this place";
    this.classList.toggle("on", on);
  });
  document.getElementById("compare-toggle").addEventListener("click", function () {
    const on = WaveBaseAccount.toggleCompare(e.id);
    this.textContent = on ? "✓ In compare" : "+ Compare";
    this.classList.toggle("on", on);
    updateNav();
  });
  document.getElementById("trip-select").addEventListener("change", function () {
    const v = this.value;
    if (!v) return;
    let targetId = v;
    if (v === "__new") {
      const name = window.prompt("Name your new trip:");
      if (!name) { this.innerHTML = tripOptionsHTML(e.id); return; }
      const t = WaveBaseAccount.addTrip(name);
      WaveBaseAccount.addToTrip(t.id, e.id);
      targetId = t.id;
    } else {
      WaveBaseAccount.addToTrip(v, e.id);
    }
    // Rebuild options so the newly-containing trip is checkmarked + selected,
    // and refresh the inline "View trip ↗" link so the user can jump there.
    this.innerHTML = tripOptionsHTML(e.id);
    this.value = targetId;
    const slot = document.getElementById("trip-view-link-slot");
    if (slot) slot.innerHTML = tripViewLinkHTML(e.id);
  });

  // Reviews mock — stars highlight on click; submit persists the preview
  // locally (so it shows on My WaveBase → My reviews) and clears the form.
  // No data leaves the browser; real shared reviews land with the backend.
  const reviewForm = root.querySelector(".review-form");
  if (reviewForm) {
    let chosenStars = 0;
    reviewForm.querySelectorAll(".review-star").forEach(btn => {
      btn.addEventListener("click", () => {
        chosenStars = parseInt(btn.dataset.stars, 10);
        reviewForm.querySelectorAll(".review-star").forEach(b => {
          b.classList.toggle("on", parseInt(b.dataset.stars, 10) <= chosenStars);
        });
      });
    });
    reviewForm.addEventListener("submit", ev => {
      ev.preventDefault();
      const fb = reviewForm.querySelector(".review-feedback");
      if (!fb) return;
      const fd = new FormData(reviewForm);
      WaveBaseAccount.addReview({
        entryId: e.id,
        stars: chosenStars,
        matches: fd.get("matches") || "",
        text: fd.get("text") || "",
        name: fd.get("name") || ""
      });
      fb.hidden = false;
      fb.innerHTML = `Thanks — your preview review is saved on this device. See it on <a href="account.html#my-reviews">My WaveBase → My reviews</a>. Real, shared reviews land when the backend goes live.`;
      // Reset state so the user sees the form go back to blank after a moment.
      setTimeout(() => {
        chosenStars = 0;
        reviewForm.querySelectorAll(".review-star").forEach(b => b.classList.remove("on"));
        reviewForm.reset();
      }, 3000);
    });
  }

  // back link: if the user came from inside the site, use history.back() to restore their previous state.
  // The href fallback (set above) points to this entry's country + sport.
  const back = root.querySelector(".backlink");
  if (back) {
    back.addEventListener("click", ev => {
      if (document.referrer && document.referrer.startsWith(window.location.origin)) {
        ev.preventDefault();
        history.back();
      }
    });
  }
}

/* ---- MAP ---- */
function initMap() {
  const map = L.map("map");
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
  }).addTo(map);

  // One layer per entity-type (for the type toggles), and per-marker entry refs
  // (so the sport filter can hide individual markers within a layer).
  const layers = { spot: L.layerGroup(), stay: L.layerGroup(), center: L.layerGroup() };
  const markerEntries = []; // [{marker, entry, layer}]
  const allCoords = [];
  WAVEBASE_DATA.forEach(e => {
    if (!e.coords || !layers[e.type]) return;
    allCoords.push(e.coords);
    const m = L.circleMarker(e.coords, {
      radius: 8, color: "#fff", weight: 2, fillColor: typeColor(e.type), fillOpacity: 1
    });
    const note = e.coordsLabel ? "<br><em>Approximate location</em>" : "";
    m.bindPopup(`<strong>${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}${note}<br>
      <a href="spot.html?id=${e.id}">See the analysis →</a>`);
    markerEntries.push({ marker: m, entry: e, layer: layers[e.type] });
    m.addTo(layers[e.type]);
  });
  layers.spot.addTo(map);
  layers.stay.addTo(map);
  layers.center.addTo(map);
  if (allCoords.length) map.fitBounds(allCoords, { padding: [30, 30] });

  // ---- filter state ----
  const typeState = { spot: true, stay: true, center: true };
  const sportState = { wave: true, wind: true, kite: true, wing: true };

  function applyFilters() {
    // First, toggle the entity-type LayerGroups on/off (cheap when whole type is hidden)
    ["spot", "stay", "center"].forEach(t => {
      const on = typeState[t];
      if (on) layers[t].addTo(map); else map.removeLayer(layers[t]);
    });
    // Then within visible layers, hide markers whose sports don't intersect with the
    // active sport set. Stays have no real sport — always show them when type=stay is on.
    markerEntries.forEach(({ marker, entry, layer }) => {
      const typeOn = typeState[entry.type];
      let sportOn = true;
      if (entry.type === "spot" || entry.type === "center") {
        const sports = entrySports(entry);
        sportOn = sports.some(s => sportState[s]);
      }
      const shouldShow = typeOn && sportOn;
      if (shouldShow) {
        if (!layer.hasLayer(marker)) layer.addLayer(marker);
      } else {
        if (layer.hasLayer(marker)) layer.removeLayer(marker);
      }
    });
  }

  // Wire entity-type toggles
  ["spot", "stay", "center"].forEach(t => {
    const el = document.getElementById("t-" + t);
    if (!el) return;
    el.addEventListener("change", () => {
      typeState[t] = el.checked;
      applyFilters();
    });
  });
  // Wire sport toggles
  document.querySelectorAll(".t-sport").forEach(el => {
    el.addEventListener("change", () => {
      sportState[el.dataset.sport] = el.checked;
      applyFilters();
    });
  });
}

/* ---- trip maps (account) — a roadtrip-style map per trip ---- */
function initTripMaps(trips) {
  if (typeof L === "undefined") return;
  trips.forEach(t => {
    const el = document.getElementById("trip-map-" + t.id);
    if (!el) return;
    const items = t.spotIds.map(byId).filter(e => e && e.coords);
    if (!items.length) return;
    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
    }).addTo(map);
    const coords = [];
    items.forEach((e, i) => {
      coords.push(e.coords);
      const icon = L.divIcon({
        className: "trip-pin " + e.type,
        html: String(i + 1),
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      L.marker(e.coords, { icon: icon })
        .bindPopup(`<strong>${i + 1}. ${e.name}</strong><br>${typeLabel(e.type)} &middot; ${e.town}<br>
          <a href="spot.html?id=${e.id}">See the analysis →</a>`)
        .addTo(map);
    });
    if (coords.length > 1) {
      L.polyline(coords, { color: "#2a2723", weight: 2, opacity: 0.55, dashArray: "4,7" }).addTo(map);
    }
    map.fitBounds(coords, { padding: [30, 30], maxZoom: 13 });
  });
}

/* ---- ACCOUNT (fake, local) ---- */
function renderAccount() {
  const root = document.getElementById("account-root");
  const p = WaveBaseAccount.getProfile();
  const saved = WaveBaseAccount.getSaved().map(byId).filter(Boolean);
  const trips = WaveBaseAccount.getTrips();
  const reviews = WaveBaseAccount.getReviews();

  function opts(list, val) {
    return list.map(o => `<option value="${o}" ${val === o ? "selected" : ""}>${o}</option>`).join("");
  }
  const levelOpts = ["beginner", "intermediate", "advanced"]
    .map(l => `<option value="${l}" ${p.level === l ? "selected" : ""}>${cap(l)}</option>`).join("");
  const boardOpts = opts(["Shortboard", "Longboard", "Funboard", "Fish", "Foamie", "Other"], p.boardType);
  const styleOpts = opts(["Solo", "Couple", "Friends", "Family"], p.travelStyle);
  const intentOpts = opts(["Pure surf", "Learn", "Progress", "Surf + chill"], p.tripIntent);
  const foundOpts = opts(["Friend / word of mouth", "Social media", "Search engine", "Surf forum / community", "Press / article", "Other"], p.howDidYouFindUs);

  const surfTypes = [
    { key: "surfer",     label: "Surfer"     },
    { key: "windsurfer", label: "Windsurfer" },
    { key: "kitesurfer", label: "Kitesurfer" },
    { key: "wingfoiler", label: "Wingfoiler" }
  ];
  const disciplines = [
    { key: "freeride",  label: "Freeride"  },
    { key: "wave",      label: "Wave"      },
    { key: "freestyle", label: "Freestyle" },
    { key: "slalom",    label: "Slalom"    }
  ];
  const showDiscipline = (p.surfType || []).some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");
  const cb = (name, items, selected) => items.map(it =>
    `<label class="cb"><input type="checkbox" name="${name}" value="${it.key}" ${selected.indexOf(it.key) !== -1 ? "checked" : ""}> ${it.label}</label>`
  ).join("");

  const savedHTML = saved.length
    ? `<div class="grid">${saved.map(e => cardHTML(e)).join("")}</div>`
    : `<p class="muted">Nothing saved yet. Tap the heart on a spot or stay.</p>`;

  const tripsHTML = trips.length
    ? trips.map(t => {
        const items = t.spotIds.map(byId).filter(Boolean);
        const located = items.filter(e => e.coords);
        const list = items.length
          ? `<ol class="trip-items">${items.map((e, i) =>
              `<li><div class="trip-item-row" draggable="true" data-trip="${t.id}" data-idx="${i}" title="Drag to reorder">
                <span class="drag-grip" aria-hidden="true">⠿</span>
                <span class="trip-item-main"><a href="spot.html?id=${e.id}" draggable="false">${e.name}</a> <span class="muted">&middot; ${typeLabel(e.type)} &middot; ${e.town}</span></span>
                <span class="trip-item-ctrl">
                  <button class="tc-btn tc-del" data-remove data-trip="${t.id}" data-spot="${e.id}" aria-label="Remove from trip" title="Remove from trip">✕</button>
                </span>
              </div></li>`).join("")}</ol>`
          : `<p class="muted">Empty so far — add places from a detail page.</p>`;
        const mapDiv = located.length ? `<div class="trip-map" id="trip-map-${t.id}"></div>` : "";
        return `<div class="trip" id="trip-${t.id}">
          <div class="trip-head"><h3>${t.name}</h3><button class="link-btn" data-del="${t.id}">remove</button></div>
          ${list}
          ${mapDiv}</div>`;
      }).join("")
    : `<p class="muted">No trips yet.</p>`;

  const matchesLabel = { yes: "Matched our write-up", partial: "Partly matched", no: "Differed from our write-up" };
  const reviewsHTML = reviews.length
    ? `<ul class="my-reviews">${reviews.map(r => {
        const entry = byId(r.entryId);
        const where = entry
          ? `<a href="${spotHref(entry.id)}">${escHTML(entry.name)}</a> <span class="muted">&middot; ${typeLabel(entry.type)} &middot; ${escHTML(entry.town)}</span>`
          : `<span class="muted">(removed entry)</span>`;
        const date = r.when ? new Date(r.when).toISOString().slice(0, 10) : "";
        const stars = r.stars
          ? `<span class="my-review-stars" aria-label="${r.stars} stars">${"★".repeat(r.stars)}${"☆".repeat(Math.max(0, 5 - r.stars))}</span>` : "";
        const matchTag = r.matches && matchesLabel[r.matches]
          ? `<span class="my-review-match match-${r.matches}">${matchesLabel[r.matches]}</span>` : "";
        const author = r.name ? ` &mdash; ${escHTML(r.name)}` : "";
        return `<li class="my-review" data-review="${r.id}">
          <div class="my-review-head">
            <div class="my-review-where">${where}</div>
            <button class="link-btn" data-del-review="${r.id}" aria-label="Delete review">remove</button>
          </div>
          <div class="my-review-meta">${stars} ${matchTag} <span class="muted">${date}${author}</span></div>
          ${r.text ? `<p class="my-review-text">${escHTML(r.text)}</p>` : ""}
        </li>`;
      }).join("")}</ul>`
    : `<p class="muted">No reviews yet. Use any spot, center or stay page — the review form at the bottom saves a preview here.</p>`;

  root.innerHTML = `
    <h1>My WaveBase</h1>
    <p class="muted lead-note">This is a fake account — everything is stored locally in your browser. There's no real login or server yet; that's phase 2.</p>

    <section class="acc-block">
      <h2>Profile</h2>
      <p class="muted form-note">The more you fill in, the better WaveBase can match spots and stays to you.</p>
      <div class="profile-form">
        <label>Name<input type="text" id="p-name" value="${p.name || ""}" placeholder="Your name"></label>
        <label>Email<input type="email" id="p-email" value="${p.email || ""}" placeholder="you@example.com"></label>
        <label>Birth year<input type="number" id="p-birthyear" value="${p.birthYear || ""}" placeholder="1995" min="1920" max="2020"></label>
        <label>Home country<input type="text" id="p-country" value="${p.homeCountry || ""}" placeholder="e.g. Belgium"></label>
        <div class="form-checkset form-wide" id="p-surftype-set">
          <span class="form-checkset-label">What do you do? <span class="muted">(pick all that apply)</span></span>
          <div class="form-checkset-options">${cb("surfType", surfTypes, p.surfType || [])}</div>
        </div>
        <div class="form-checkset form-wide ${showDiscipline ? "" : "hidden"}" id="p-discipline-set">
          <span class="form-checkset-label">Discipline <span class="muted">(for wind / kite / wing)</span></span>
          <div class="form-checkset-options">${cb("discipline", disciplines, p.discipline || [])}</div>
        </div>
        <label>Surf level<select id="p-level"><option value="">—</option>${levelOpts}</select></label>
        <label>Years surfing<input type="number" id="p-years" value="${p.yearsSurfing || ""}" placeholder="3" min="0" max="80"></label>
        <label>Board<select id="p-board"><option value="">—</option>${boardOpts}</select></label>
        <label>Travel style<select id="p-style"><option value="">—</option>${styleOpts}</select></label>
        <label>What you want from a trip<select id="p-intent"><option value="">—</option>${intentOpts}</select></label>
        <label class="form-wide">How did you find us?<select id="p-found"><option value="">—</option>${foundOpts}</select></label>
        <button class="btn" id="p-save">Save profile</button>
      </div>
    </section>

    <section class="acc-block">
      <h2>Saved places <span class="seccount">${saved.length}</span></h2>
      ${savedHTML}
    </section>

    <section class="acc-block" id="trips">
      <div class="trip-section-head">
        <h2>My trips <span class="seccount">${trips.length}</span></h2>
        <button class="btn ghost" id="new-trip">+ New trip</button>
      </div>
      <p class="muted form-note">Drag locations to reorder them — each trip's map and its route line follow the order. Use ✕ to remove a stop.</p>
      ${tripsHTML}
    </section>

    <section class="acc-block" id="my-reviews">
      <h2>My reviews <span class="seccount">${reviews.length}</span></h2>
      <p class="muted form-note">Previews of reviews you wrote — saved locally on this device.
        They'll turn into real, shared reviews when the backend is live (phase 2).</p>
      ${reviewsHTML}
    </section>`;

  const readChecks = name => Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(el => el.value);

  document.getElementById("p-save").addEventListener("click", () => {
    WaveBaseAccount.setProfile({
      name: document.getElementById("p-name").value,
      email: document.getElementById("p-email").value,
      birthYear: document.getElementById("p-birthyear").value,
      homeCountry: document.getElementById("p-country").value,
      level: document.getElementById("p-level").value,
      yearsSurfing: document.getElementById("p-years").value,
      boardType: document.getElementById("p-board").value,
      travelStyle: document.getElementById("p-style").value,
      tripIntent: document.getElementById("p-intent").value,
      surfType: readChecks("surfType"),
      discipline: readChecks("discipline"),
      howDidYouFindUs: document.getElementById("p-found").value
    });
    updateNav();
    alert("Profile saved.");
  });

  // Toggle discipline fieldset live when surfType selection changes
  document.querySelectorAll('input[name="surfType"]').forEach(cbEl => {
    cbEl.addEventListener("change", () => {
      const picked = readChecks("surfType");
      const show = picked.some(t => t === "windsurfer" || t === "kitesurfer" || t === "wingfoiler");
      document.getElementById("p-discipline-set").classList.toggle("hidden", !show);
    });
  });
  document.getElementById("new-trip").addEventListener("click", () => {
    const name = window.prompt("Name your new trip:");
    if (name) { WaveBaseAccount.addTrip(name); renderAccount(); }
  });
  root.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => { WaveBaseAccount.deleteTrip(b.dataset.del); renderAccount(); });
  });
  let dragSrc = null;
  root.querySelectorAll(".trip-item-row[draggable='true']").forEach(row => {
    row.addEventListener("dragstart", e => {
      dragSrc = { tripId: row.dataset.trip, fromIndex: parseInt(row.dataset.idx, 10) };
      row.classList.add("dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", row.dataset.idx); } catch (err) {}
      }
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      root.querySelectorAll(".trip-item-row.drag-over").forEach(x => x.classList.remove("drag-over"));
      dragSrc = null;
    });
    row.addEventListener("dragover", e => {
      if (!dragSrc || dragSrc.tripId !== row.dataset.trip) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      row.classList.add("drag-over");
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over");
    });
    row.addEventListener("drop", e => {
      e.preventDefault();
      row.classList.remove("drag-over");
      if (!dragSrc || dragSrc.tripId !== row.dataset.trip) return;
      const toIndex = parseInt(row.dataset.idx, 10);
      if (dragSrc.fromIndex !== toIndex) {
        WaveBaseAccount.reorderTrip(row.dataset.trip, dragSrc.fromIndex, toIndex);
        renderAccount();
      }
    });
  });
  root.querySelectorAll("[data-remove]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.removeFromTrip(b.dataset.trip, b.dataset.spot);
      renderAccount();
    });
  });
  root.querySelectorAll("[data-del-review]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.deleteReview(b.dataset.delReview);
      renderAccount();
    });
  });
  if (root.querySelector(".grid")) wireCards(root);
  initTripMaps(trips);
}

/* ---- COMPARE ---- */
// Scoreboard above the text cards. Bar direction is always "less = left,
// more = right" — short bar for "less of this dimension", long for more.
// winnerDirection per dimension says which extreme is "better" for the
// clay accent: "higher" = longest bar wins, "lower" = shortest bar wins
// (e.g. distance to spot), null = no winner (preference-driven).
function compareScoreboardHTML(items) {
  if (items.length < 2) return "";
  const types = new Set(items.map(i => i.type));
  if (types.size > 1) return "";
  const type = items[0].type;
  if (type !== "spot" && type !== "center" && type !== "stay") return "";

  const m = userSelectedMonth() - 1;
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const v = (arr) => (Array.isArray(arr) && arr[m] != null && !isNaN(arr[m])) ? arr[m] : null;
  const crowdLow = c => ({ rustig: 1, low: 1, gemiddeld: 2, moderate: 2, druk: 3, high: 3 }[c] || null);

  // Count comma- or plus-separated chunks in a free-text field (proxy for
  // "how many things does this center offer in this category"). Used for
  // centers where the data is qualitative prose.
  const itemCount = (text) => {
    if (!text || typeof text !== "string") return null;
    const parts = text.split(/[,;]|\sand\s|\s\+\s/i).map(s => s.trim()).filter(Boolean);
    return parts.length || null;
  };

  // Parse a "Rating" prose string. Stays often have something like
  //   "TripAdvisor 4.7/5 over 23 reviews"
  //   "10+ Booking reviews 2023-2026 (most 9.0-10.0)"
  // Picks the first "/5" or "/10" pattern it sees and normalizes to a /5
  // scale. Returns null when nothing parseable is found.
  const parseRating = (text, structured) => {
    if (typeof structured === "number" && !isNaN(structured)) return structured;
    if (!text || typeof text !== "string") return null;
    // Explicit X.X/5
    const five = text.match(/(\d(?:\.\d+)?)\s*\/\s*5\b/);
    if (five) return Math.min(5, Math.max(0, parseFloat(five[1])));
    // Explicit X.X/10 — halve to /5
    const ten = text.match(/(\d(?:\.\d+)?)\s*\/\s*10\b/);
    if (ten) return Math.min(5, Math.max(0, parseFloat(ten[1]) / 2));
    // "TripAdvisor X.X" without explicit "/5" — TripAdvisor's scale IS /5
    const ta = text.match(/TripAdvisor\s+(\d(?:\.\d+)?)\b/i);
    if (ta) return Math.min(5, Math.max(0, parseFloat(ta[1])));
    // "Booking X.X" or "Google X.X" without explicit "/10" — assume /10
    const bg = text.match(/(?:Booking|Google|Hostelworld)\s*(?:\.com\s*)?(\d(?:\.\d+)?)\b/i);
    if (bg) return Math.min(5, Math.max(0, parseFloat(bg[1]) / 2));
    // "most 9.0-10.0" Booking range — assume /10
    const range = text.match(/most\s+(\d(?:\.\d+)?)[\s–-]+(\d(?:\.\d+)?)/i);
    if (range) {
      const mid = (parseFloat(range[1]) + parseFloat(range[2])) / 2;
      return Math.min(5, Math.max(0, mid / 2));
    }
    return null;
  };

  // Parse a distance string into meters. Returns null when nothing parseable.
  // Handles: explicit "X km" / "X m"; "Zero" or "middle of beach" or "On X
  // beach" → 0 m; "X-minute walk" → X * 80 m (~80 m / min walking pace);
  // "walking distance" / "short walk" → ~250 m fuzzy fallback. Stays can
  // also set verblijf.distanceM: <number> for an explicit override.
  const parseDistance = (text, structured) => {
    if (typeof structured === "number" && !isNaN(structured)) return structured;
    if (!text || typeof text !== "string") return null;
    if (/\bzero\b/i.test(text)) return 0;
    if (/\b(?:on|middle of)\b[^.,;]*\bbeach\b/i.test(text)) return 0;
    const mw = text.match(/(\d+)[\s-]+minute(?:s)?\s+walk/i);
    if (mw) return parseInt(mw[1], 10) * 80;
    const km = text.match(/(\d+(?:\.\d+)?)\s*km\b/i);
    if (km) return parseFloat(km[1]) * 1000;
    const mr = text.match(/(\d+(?:\.\d+)?)\s*m\b/i);
    if (mr) return parseFloat(mr[1]);
    if (/walking distance|short walk/i.test(text)) return 250;
    return null;
  };
  const fmtDistance = (mtrs) => mtrs >= 1000 ? `${(mtrs / 1000).toFixed(1)} km` : `${Math.round(mtrs)} m`;

  // mode: "fill" (default) | "range"
  // winnerDirection: "higher" → longest bar wins · "lower" → shortest wins ·
  //                  null → no winner (preference-driven)
  let all;
  const levelsDim = {
    icon: "🎓", label: "Levels welcome", mode: "range", max: 3,
    labelFor: r => {
      const map = ["", "B", "I", "A"];
      if (r.lo === r.hi) return cap(["", "beginner", "intermediate", "advanced"][r.lo] || "");
      return `${map[r.lo]} → ${map[r.hi]}`;
    },
    get: e => {
      if (!Array.isArray(e.levels) || !e.levels.length) return null;
      const pos = { beginner: 1, intermediate: 2, advanced: 3 };
      const ps = e.levels.map(l => pos[l]).filter(Boolean);
      if (!ps.length) return null;
      return { lo: Math.min(...ps), hi: Math.max(...ps) };
    }
  };

  if (type === "spot") {
    all = [
      // Typical wind = 9-hour daytime average. Honest "what blows on
      // average across the surf window" number, not a flattering peak.
      { icon: "🌬️", label: "Wind (typical)", max: 30, unit: " kn", winnerDirection: "higher",
        get: e => v((getStatsFor(e) || {}).monthlyWindKn) },
      // Typical peak gust = avg of daily max gust (the strongest moment of
      // a typical day). Not the 5-year storm extreme.
      { icon: "💨", label: "Gust (typical peak)", max: 40, unit: " kn", winnerDirection: "higher",
        get: e => v((getStatsFor(e) || {}).monthlyDailyPeakKn) },
      { icon: "🌊", label: "Wave height", max: 3, unit: " m", fmt: x => x.toFixed(1), winnerDirection: "higher",
        get: e => v((getStatsFor(e) || {}).monthlyWaveM) },
      { icon: "🌡️", label: "Water warmth", max: 30, unit: " °C",
        get: e => v((getStatsFor(e) || {}).monthlyWaterC) },
      { icon: "☀️", label: "Daytime air", max: 35, unit: " °C",
        get: e => v((getStatsFor(e) || {}).monthlyAirC) },
      { icon: "👥", label: "Crowd", max: 3, unit: "",
        labelFor: x => x === 1 ? "Quiet" : x === 2 ? "Moderate" : "Busy",
        get: e => {
          const c = (e.condities && e.condities.drukte && e.condities.drukte.niveau)
                 || (getStatsFor(e) && getStatsFor(e).crowd);
          return crowdLow(c);
        } },
      levelsDim
    ];
  } else if (type === "center") {
    all = [
      levelsDim,
      { icon: "🏄", label: "Sports taught", max: 4, unit: "", winnerDirection: "higher",
        labelFor: x => x + " sport" + (x > 1 ? "s" : ""),
        get: e => Array.isArray(e.sports) ? e.sports.length : null },
      { icon: "📚", label: "Lessons variety", max: 6, unit: " types", winnerDirection: "higher",
        get: e => itemCount(e.diensten && e.diensten.lessen) },
      { icon: "🛹", label: "Rental variety", max: 6, unit: " items", winnerDirection: "higher",
        get: e => itemCount(e.diensten && e.diensten.rental) },
      { icon: "🏷️", label: "Gear brands", max: 5, unit: "", winnerDirection: "higher",
        get: e => itemCount(e.diensten && e.diensten.brands) },
      { icon: "🛠️", label: "Facilities", max: 8, unit: " items", winnerDirection: "higher",
        get: e => itemCount(e.diensten && e.diensten.faciliteiten) }
    ];
  } else { // stay
    // Numeric scores (1-5) live on verblijf.scores, inferred from prose
    // (refine in data.js if you disagree). Essence labels (style/vibe) are
    // categorical chips, no bar.
    const numericDims = [
      { key: "food",        icon: "🍽️", label: "Food" },
      { key: "hosts",       icon: "🤝", label: "Hosts" },
      { key: "comfort",     icon: "🛏️", label: "Comfort" },
      { key: "cleanliness", icon: "🧼", label: "Cleanliness" },
      { key: "value",       icon: "💶", label: "Value for money" }
    ].map(sd => ({
      icon: sd.icon, label: sd.label, max: 5, unit: " / 5", winnerDirection: "higher",
      fmt: x => x.toFixed(1),
      get: e => {
        const s = e.verblijf && e.verblijf.scores;
        return (s && typeof s[sd.key] === "number") ? s[sd.key] : null;
      }
    }));
    const essenceDims = [
      { key: "style", icon: "🏠", label: "Style" },
      { key: "vibe",  icon: "✨", label: "Vibe" }
    ].map(sd => ({
      icon: sd.icon, label: sd.label, mode: "label",
      get: e => {
        const s = e.verblijf && e.verblijf.essence;
        return (s && typeof s[sd.key] === "string" && s[sd.key]) ? s[sd.key] : null;
      }
    }));

    all = [
      // Closer to the spot wins — short bar = close, long bar = far away.
      { icon: "📍", label: "Distance to surf spot", max: 5000, unit: "", winnerDirection: "lower",
        labelFor: mtrs => fmtDistance(mtrs),
        get: e => parseDistance(e.verblijf && e.verblijf.afstandSpot, e.verblijf && e.verblijf.distanceM) },
      // Aggregate review rating, parsed from the rating prose into a /5 scale.
      // Stays can override with verblijf.ratingScore: <0..5>.
      { icon: "⭐", label: "Review rating", max: 5, unit: " / 5", winnerDirection: "higher",
        fmt: x => x.toFixed(1),
        get: e => parseRating(e.verblijf && e.verblijf.rating, e.verblijf && e.verblijf.ratingScore) },
      // Things to do counts comma/and-separated items in activiteiten.
      { icon: "🗺️", label: "Things to do nearby", max: 8, unit: " items", winnerDirection: "higher",
        get: e => itemCount(e.verblijf && e.verblijf.activiteiten) },
      ...numericDims,
      ...essenceDims
    ];
  }

  const dims = all.filter(d => items.every(e => {
    const val = d.get(e);
    if (val == null) return false;
    if (d.mode === "range") return val.lo != null && val.hi != null;
    if (d.mode === "label") return typeof val === "string" && val.length > 0;
    return !isNaN(val);
  }));
  if (!dims.length) return "";

  const rows = dims.map(d => {
    const cells = items.map(e => ({ e, val: d.get(e) }));
    // Find the winner cell index based on winnerDirection. Range mode never
    // has a winner (it's a level span, not a single value).
    let winnerIdx = -1;
    if (d.mode !== "range" && d.winnerDirection) {
      const vals = cells.map(c => c.val);
      const ext = d.winnerDirection === "lower" ? Math.min(...vals) : Math.max(...vals);
      const hasContrast = vals.some(x => x !== ext);
      if (hasContrast) winnerIdx = vals.indexOf(ext);
    }
    const cellHtml = cells.map((c, ci) => {
      // Label mode: categorical chip, no bar.
      if (d.mode === "label") {
        return `<div class="sb-row-cell sb-row-cell-label">
          <span class="sb-entry-name">${escHTML(c.e.name)}</span>
          <span class="sb-chip">${escHTML(c.val)}</span>
        </div>`;
      }
      let barInner;
      if (d.mode === "range") {
        const loPct = ((c.val.lo - 1) / d.max) * 100;
        const hiPct = (c.val.hi / d.max) * 100;
        const widthPct = Math.max(8, hiPct - loPct);
        barInner = `<span class="sb-bar-fill" style="left:${loPct}%; width:${widthPct}%"></span>`;
      } else {
        const pct = Math.max(4, Math.min(100, (c.val / d.max) * 100));
        barInner = `<span class="sb-bar-fill" style="left:0; width:${pct}%"></span>`;
      }
      const winner = ci === winnerIdx;
      const fmt = d.fmt || (x => Math.round(x));
      const labelText = d.labelFor ? d.labelFor(c.val) : (fmt(c.val) + (d.unit || ""));
      return `<div class="sb-row-cell${winner ? " is-winner" : ""}">
        <span class="sb-entry-name">${escHTML(c.e.name)}</span>
        <span class="sb-bar">${barInner}</span>
        <span class="sb-value">${labelText}</span>
      </div>`;
    }).join("");
    return `<div class="sb-row">
      <div class="sb-dim">
        <span class="sb-dim-icon" aria-hidden="true">${d.icon}</span>
        <span class="sb-dim-label">${d.label}</span>
      </div>
      <div class="sb-row-cells">${cellHtml}</div>
    </div>`;
  }).join("");

  const monthHint = type === "spot"
    ? `${monthNames[m]} numbers from each entry's data. `
    : "";
  const inferredNote = type === "stay"
    ? `<p class="muted form-note">⚠ Food / Hosts / Comfort / Cleanliness / Value / Style / Vibe are inferred from the reviewer prose — not yet verified against fresh reviews. Refine if you disagree.</p>`
    : "";

  // Sources block at the bottom — same self-documentation as the at-a-glance
  // panel on detail pages. For spots/centers we surface stats.source; for
  // stays we describe how distance, rating, and scores were derived.
  let sourcesHTML = "";
  if (type === "spot" || type === "center") {
    const lines = items.map(e => {
      const s = (getStatsFor(e) || {}).source;
      return `<li><strong>${escHTML(e.name)}</strong> &mdash; ${escHTML(s || "no source listed")}</li>`;
    }).join("");
    sourcesHTML = `<div class="sb-sources">
      <h3>Sources</h3>
      <ul class="sb-sources-list">${lines}</ul>
    </div>`;
  } else if (type === "stay") {
    sourcesHTML = `<div class="sb-sources">
      <h3>Sources</h3>
      <ul class="sb-sources-list">
        <li><strong>Distance to surf spot</strong> &mdash; parsed from each stay's <code>verblijf.afstandSpot</code> prose.</li>
        <li><strong>Review rating</strong> &mdash; parsed from each stay's <code>verblijf.rating</code> prose (TripAdvisor / Booking / Google / Hostelworld figures).</li>
        <li><strong>Things to do</strong> &mdash; count of comma- or and-separated items in <code>verblijf.activiteiten</code>.</li>
        <li><strong>Food / Hosts / Comfort / Cleanliness / Value / Style / Vibe</strong> &mdash; inferred by Claude from each stay's samenvatting / verhaal / lagen reviewer prose. See per-stay bron-strength labels (SOLID / MOSTLY SOLID / STALE) on the detail page for confidence.</li>
      </ul>
    </div>`;
  }

  return `<section class="cmp-scoreboard">
    <header class="sb-head">
      <h2>Scoreboard</h2>
      <p class="muted form-note">${monthHint}Longer bar means more of that dimension. Clay accent marks the winner where "more" is unambiguously better.</p>
      ${inferredNote}
    </header>
    ${rows}
    ${sourcesHTML}
  </section>`;
}

function compareKeyPoints(e) {
  if (e.type === "spot") {
    const c = e.condities || {};
    return [
      ["Wave type", c.golftype || "—"],
      ["Wave height", c.golfhoogte || "—"],
      ["Crowd", c.drukte ? crowdLabel(c.drukte.niveau) : "—"],
      ["Levels", e.levels.map(cap).join(", ")],
      ["Water", c.water || "—"]
    ];
  }
  if (e.type === "center") {
    const d = e.diensten || {};
    return [
      ["Lessons", d.lessen || "—"],
      ["Rental", d.rental || "—"],
      ["Gear brands", d.brands || "—"],
      ["Facilities", d.faciliteiten || "—"],
      ["Team & vibe", d.team || "—"]
    ];
  }
  const v = e.verblijf || {};
  return [
    ["Food", v.eten || "—"],
    ["Distance from surf spot", v.afstandSpot || "—"],
    ["Gear rental", v.verhuur || "—"],
    ["Lessons available?", v.lessen || "—"],
    ["Rating", v.rating || "—"],
    ["Chill or party", v.sfeer || "—"],
    ["Other activities", v.activiteiten || "—"]
  ];
}

function renderCompare() {
  const root = document.getElementById("compare-root");
  const items = WaveBaseAccount.getCompare().map(byId).filter(Boolean);
  if (!items.length) {
    root.innerHTML = `<h1>Compare</h1>
      <p class="muted">Nothing to compare yet. Tap the "⇄" button on a spot or stay, then come back here.</p>`;
    return;
  }
  const cols = items.map(e => {
    const pts = compareKeyPoints(e).map(([k, v]) =>
      v ? `<div class="cmp-row"><span class="cmp-k">${k}</span><span class="cmp-v">${v}</span></div>` : "").join("");
    return `<div class="cmp-col">
      <div class="thumb ${e.type}${e.photo ? " has-photo" : ""}"${thumbStyle(e)}>
        <span class="badge">${typeBadge(e.type)}</span>
        <button class="cmp-remove" data-uncompare="${e.id}" aria-label="Remove from compare" title="Remove from compare">×</button>
        ${e.type === "stay" ? "" : sportIconsHTML(entrySports(e))}
      </div>
      <div class="cmp-body">
        <div class="place">${e.town}</div>
        <h3><a href="spot.html?id=${e.id}">${e.name}</a></h3>
        <p class="tag">${e.tagline}</p>
        ${pts}
      </div>
    </div>`;
  }).join("");
  root.innerHTML = `
    <div class="compare-head">
      <h1>Compare <span class="seccount">${items.length}</span></h1>
      <button class="btn ghost" id="clear-compare">Clear all</button>
    </div>
    ${compareScoreboardHTML(items)}
    <div class="cmp-grid">${cols}</div>`;
  document.getElementById("clear-compare").addEventListener("click", () => {
    WaveBaseAccount.clearCompare(); updateNav(); renderCompare();
  });
  root.querySelectorAll("[data-uncompare]").forEach(b => {
    b.addEventListener("click", () => {
      WaveBaseAccount.toggleCompare(b.dataset.uncompare);
      updateNav(); renderCompare();
    });
  });
}

/* ---- destinations mega-menu ---- */
// Open/close the destinations menu — exposed so the Where-field on Discover
// and the "pick a country to begin" empty-state link can also trigger it.
// The menu is positioned under the header (absolute). When opening from
// below the fold we need to scroll to top to make it visible — but ONLY
// from event handlers that fire AFTER mouseup (i.e. click handlers).
// Calling scroll from the focus handler (which fires BEFORE mouseup)
// shifts the page mid-click, so the mouseup target is wrong and bubbles
// to the document close-handler — the "flash" bug. Default opts.scroll=true
// is for click handlers; focus handlers pass {scroll:false}.
// Timestamp of the last open — used to ignore any "close" attempts that
// happen within the same click cycle (mousedown → focus → scroll → mouseup
// → click → bubble to document → close). 250 ms is enough to swallow the
// rogue event without disabling legitimate user clicks elsewhere.
let __destMenuOpenedAt = 0;
function openDestinationsMenu(opts) {
  const scroll = !opts || opts.scroll !== false;
  const panel = document.getElementById("destinations-menu");
  const trigger = document.getElementById("destinations-trigger");
  if (!panel || !trigger) return;
  panel.classList.add("open");
  trigger.classList.add("active");
  __destMenuOpenedAt = Date.now();
  if (scroll && window.scrollY > 4) window.scrollTo(0, 0);
}
function closeDestinationsMenu() {
  // Direct close (chip click, etc.) — no guard. The "race with opening"
  // guard lives in the document outside-click handler instead, so legit
  // manual closes still go through.
  const panel = document.getElementById("destinations-menu");
  const trigger = document.getElementById("destinations-trigger");
  if (!panel || !trigger) return;
  panel.classList.remove("open");
  trigger.classList.remove("active");
}

function initDestinations() {
  if (typeof WAVEBASE_DESTINATIONS === "undefined") return;
  const nav = document.querySelector(".site-nav");
  const header = document.querySelector(".site-header");
  if (!nav || !header || document.getElementById("destinations-trigger")) return;

  const trigger = document.createElement("button");
  trigger.id = "destinations-trigger";
  trigger.className = "nav-destinations";
  trigger.type = "button";
  trigger.textContent = "Destinations";
  nav.prepend(trigger);

  const cols = WAVEBASE_DESTINATIONS.map(c => {
    const chips = c.countries.map(co => {
      const href = `index.html?country=${encodeURIComponent(co.name)}`;
      const dataAttr = ` data-country="${co.name}" data-status="${co.status}"`;
      return co.status === "live"
        ? `<a class="dest-chip live" href="${href}"${dataAttr}>${co.flag} ${co.name}</a>`
        : `<a class="dest-chip soon" href="${href}"${dataAttr}>${co.flag} ${co.name}<span class="soon-tag">soon</span></a>`;
    }).join("");
    return `<div class="dest-continent"><h3>${c.continent}</h3><div class="dest-chips">${chips}</div></div>`;
  }).join("");

  const panel = document.createElement("div");
  panel.id = "destinations-menu";
  panel.className = "destinations-menu";
  panel.innerHTML = `<div class="wrap">
    <div class="dest-grid">${cols}</div>
    <p class="dest-note">WaveBase is rolling out worldwide — Morocco is live now, the rest are on the way.</p>
  </div>`;
  header.appendChild(panel);

  trigger.addEventListener("click", ev => {
    ev.stopPropagation();
    const panel = document.getElementById("destinations-menu");
    const open = panel.classList.toggle("open");
    trigger.classList.toggle("active", open);
  });
  panel.addEventListener("click", ev => ev.stopPropagation());
  // Close on any click that's NOT inside the panel, the trigger, the
  // Where-field, or the country-picker empty-state button. Plus a 250 ms
  // grace window after opening — any rogue close attempt during the click
  // cycle that opened the menu is ignored. Belt + suspenders against the
  // "open then immediately close" flash.
  document.addEventListener("click", (ev) => {
    if (Date.now() - __destMenuOpenedAt < 250) return;
    const t = ev.target;
    if (!t) return;
    if (t.closest && (
      t.closest("#destinations-menu") ||
      t.closest("#destinations-trigger") ||
      t.closest("#f-country") ||
      t.closest("#empty-open-destinations")
    )) return;
    closeDestinationsMenu();
  });

  // On Discover: clicking a country chip should fill the Where field and
  // re-run the search inline (no full reload). Off Discover: normal navigation.
  if (document.getElementById("f-country")) {
    panel.querySelectorAll(".dest-chip").forEach(chip => {
      chip.addEventListener("click", ev => {
        ev.preventDefault();
        const country = chip.dataset.country;
        const input = document.getElementById("f-country");
        if (input) input.value = country;
        closeDestinationsMenu();
        // Update URL so deep-links + back button still work.
        const url = new URL(window.location.href);
        url.searchParams.set("country", country);
        window.history.replaceState(null, "", url.toString());
        if (typeof runSearch === "function") runSearch();
      });
    });
  }
}

/* ---- mobile bottom tab bar (Discover / Map / Compare / Me) ---- */
function initMobileTabbar() {
  if (document.querySelector(".mobile-tabbar")) return;

  const path = window.location.pathname;
  const route =
    /kaart\.html$/.test(path) ? "map" :
    /compare\.html$/.test(path) ? "compare" :
    /account\.html$/.test(path) ? "me" :
    "discover";

  const ico = {
    discover: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="16,8 13,14 8,16 11,10"/></svg>',
    map: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    compare: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    me: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };
  const tabs = [
    { route: "discover", href: "index.html", label: "Discover" },
    { route: "map", href: "kaart.html", label: "Map" },
    { route: "compare", href: "compare.html", label: "Compare" },
    { route: "me", href: "account.html", label: "Me" }
  ];

  const html = tabs.map(t =>
    `<a href="${t.href}" class="tab${t.route === route ? ' active' : ''}" data-tab="${t.route}" aria-label="${t.label}">${ico[t.route]}<span class="tab-label">${t.label}</span></a>`
  ).join("");

  const nav = document.createElement("nav");
  nav.className = "mobile-tabbar";
  nav.setAttribute("aria-label", "Main navigation");
  nav.innerHTML = html;
  document.body.appendChild(nav);

  // sync the compare count if items already exist
  const cmpLabel = nav.querySelector('a[data-tab="compare"] .tab-label');
  if (cmpLabel && typeof WaveBaseAccount !== "undefined") {
    const n = WaveBaseAccount.getCompare().length;
    if (n) cmpLabel.textContent = `Compare (${n})`;
  }
}

/* ---- router ---- */
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  initDestinations();
  initMobileTabbar();
  if (document.getElementById("results")) initIndex();
  if (document.getElementById("detail-root")) initSpot();
  if (document.getElementById("map")) initMap();
  if (document.getElementById("account-root")) renderAccount();
  if (document.getElementById("compare-root")) renderCompare();
});
