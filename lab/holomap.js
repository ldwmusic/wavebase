/* ============================================================
   SurfGoose · HOLO MAP (lab 03 companion)
   A holographic 3D local map that swaps in for the Leaflet map
   on lab spot pages: the place as a light beacon, every other
   catalog entry within 30 km as clickable beacons, live wind
   and swell from the entry's real stats. Lazy-loaded module.
   ============================================================ */

import * as THREE from "three";

const RANGE_KM = 30;
const DISC_R = 9;                    // world units for RANGE_KM
const KM = DISC_R / RANGE_KM;
const HOLO = 0x6ef3ff;
const TYPE_COLOR = { spot: 0x6ef3ff, center: 0xff8a4d, stay: 0xffc46a };

let built = false, visible = false, raf = 0;
let renderer, scene, camera, holoEl, tipEl, frameRef, btnRef;
let beacons = [], rings = [], clockT = 0, lastTs = 0;
let orbit = { ang: 0.6, drag: false, lastX: 0, vel: 0.12 };

function kmOffset(from, to) {
  const dxKm = (to[1] - from[1]) * 111.32 * Math.cos(from[0] * Math.PI / 180);
  const dzKm = (to[0] - from[0]) * 110.57;
  return { x: dxKm * KM, z: -dzKm * KM, km: Math.hypot(dxKm, dzKm) };
}

function glowTex(hex) {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d");
  const col = "#" + hex.toString(16).padStart(6, "0");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function labelSprite(text, color, size) {
  const c = document.createElement("canvas");
  const fs = 42;
  c.width = 512; c.height = 96;
  const g = c.getContext("2d");
  g.font = "700 " + fs + "px 'Space Grotesk', monospace";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = color; g.shadowBlur = 18;
  g.fillStyle = color;
  g.fillText(text, 256, 48);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set((size || 3) * (512 / 96), size || 3, 1).multiplyScalar(0.32);
  return s;
}

function statsOf(entry, all) {
  if (entry.stats) return entry.stats;
  if (entry.linkedSpotId) {
    const s = all.find(e => e.id === entry.linkedSpotId);
    if (s && s.stats) return s.stats;
  }
  return null;
}

const COMPASS = { N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
                  S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5 };

function build(opts) {
  const { frame, entry, all } = opts;
  frameRef = frame;

  holoEl = document.createElement("div");
  holoEl.id = "holo-map";
  const cv = document.createElement("canvas");
  holoEl.appendChild(cv);
  const legend = document.createElement("div");
  legend.className = "holo-legend";
  legend.innerHTML = "&#11041; HOLO &middot; " + RANGE_KM + " KM RADIUS &middot; N UP &middot; DRAG TO ORBIT";
  holoEl.appendChild(legend);
  tipEl = document.createElement("div");
  tipEl.className = "holo-tip";
  tipEl.hidden = true;
  holoEl.appendChild(tipEl);
  frame.appendChild(holoEl);

  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);

  /* holo ground: polar grid + range rings */
  const grid = new THREE.PolarGridHelper(DISC_R, 16, 3, 72, HOLO, HOLO);
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  scene.add(grid);
  [10, 20, 30].forEach(km => {
    const r = km * KM;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r - 0.02, r + 0.02, 96),
      new THREE.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: km === 30 ? 0.5 : 0.22, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);
    const lbl = labelSprite(km + " KM", "rgba(110,243,255,0.8)", 1.4);
    lbl.position.set(0.9, 0.32, -r - 0.45);
    scene.add(lbl);
  });
  const north = labelSprite("N", "#f4fbfd", 2.2);
  north.position.set(0, 0.8, -DISC_R - 1.1);
  scene.add(north);

  /* center beacon — the place itself */
  function beacon(color, scaleK) {
    const g = new THREE.Group();
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05 * scaleK, 0.13 * scaleK, 2.6 * scaleK, 8, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
    );
    pillar.position.y = 1.3 * scaleK;
    g.add(pillar);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(color), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.setScalar(1.1 * scaleK);
    glow.position.y = 0.18;
    g.add(glow);
    g.userData.glow = glow;
    return g;
  }
  const center = beacon(TYPE_COLOR[entry.type] || HOLO, 1.5);
  scene.add(center);
  const centerLbl = labelSprite(entry.name.toUpperCase(), "#f4fbfd", 1.9);
  centerLbl.position.set(0, 4.6, 0);
  scene.add(centerLbl);

  /* swell rings — speed from real monthly wave height */
  const st = statsOf(entry, all);
  const m = new Date().getMonth();
  const waveM = st && st.monthlyWaveM && st.monthlyWaveM[m] != null ? st.monthlyWaveM[m] : 0.6;
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.96, 1.0, 64),
      new THREE.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.userData = { phase: i / 3, speed: 0.25 + Math.min(waveM, 3) * 0.22 };
    scene.add(ring);
    rings.push(ring);
  }

  /* wind arrow — direction + this month's knots */
  if (st && st.windDir) {
    const dirTxt = String(st.windDir).toUpperCase().match(/[NESW]{1,3}/);
    const deg = dirTxt && COMPASS[dirTxt[0]] != null ? COMPASS[dirTxt[0]] : null;
    if (deg != null) {
      const kn = st.monthlyWindKn && st.monthlyWindKn[m] != null ? st.monthlyWindKn[m] : null;
      const len = 1.6 + (kn ? Math.min(kn, 35) / 35 * 2.6 : 1.2);
      const to = THREE.MathUtils.degToRad(deg + 180);          // wind blows toward
      const dir = new THREE.Vector3(Math.sin(to), 0, -Math.cos(to));
      const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(-dir.x * len / 2, 2.6, -dir.z * len / 2), len, 0x9ff5ff, 0.55, 0.3);
      arrow.line.material.transparent = arrow.cone.material.transparent = true;
      arrow.line.material.opacity = arrow.cone.material.opacity = 0.85;
      scene.add(arrow);
      const wl = labelSprite("WIND " + (kn ? "≈" + Math.round(kn) + " KN " : "") + dirTxt[0], "rgba(159,245,255,0.9)", 1.4);
      wl.position.set(0, 3.4, 0);
      scene.add(wl);
    }
  }

  /* nearby catalog entries */
  const here = entry.coords;
  all.forEach(e => {
    if (!e || e.id === entry.id || (e.coords || []).length !== 2) return;
    const off = kmOffset(here, e.coords);
    if (off.km > RANGE_KM || off.km < 0.01) return;
    const b = beacon(TYPE_COLOR[e.type] || HOLO, 0.7);
    b.position.set(off.x, 0, off.z);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 0.6;
    b.add(hit);
    b.userData.entry = e;
    b.userData.km = off.km;
    hit.userData.owner = b;
    scene.add(b);
    beacons.push({ group: b, hit, entry: e, km: off.km });
  });

  /* faint context disc */
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(DISC_R, 72),
    new THREE.MeshBasicMaterial({ color: 0x0a2a3a, transparent: true, opacity: 0.55, depthWrite: false })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = -0.02;
  scene.add(disc);

  /* interactions */
  const ray = new THREE.Raycaster();
  const rv = new THREE.Vector2();
  let hover = null;
  function pick(ev) {
    const r = cv.getBoundingClientRect();
    rv.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(rv, camera);
    const hits = ray.intersectObjects(beacons.map(b => b.hit), false);
    return hits.length ? hits[0].object.userData.owner : null;
  }
  cv.addEventListener("pointerdown", e => { orbit.drag = true; orbit.lastX = e.clientX; orbit.moved = 0; });
  addEventListener("pointermove", e => {
    if (orbit.drag) {
      const dx = e.clientX - orbit.lastX;
      orbit.lastX = e.clientX;
      orbit.ang -= dx * 0.006;
      orbit.vel = -dx * 0.02;
      orbit.moved = (orbit.moved || 0) + Math.abs(dx);
    }
  });
  addEventListener("pointerup", e => {
    const wasDrag = orbit.drag && (orbit.moved || 0) > 10;
    orbit.drag = false;
    if (!visible || wasDrag) return;
    const b = pick(e);
    if (b && b.userData.entry) location.href = "spot.html?id=" + encodeURIComponent(b.userData.entry.id);
  });
  cv.addEventListener("pointermove", e => {
    if (orbit.drag) { tipEl.hidden = true; return; }
    const b = pick(e);
    hover = b;
    cv.style.cursor = b ? "pointer" : "grab";
    if (b) {
      const en = b.userData.entry;
      tipEl.innerHTML = "<b>" + en.name.replace(/[<>&]/g, "") + "</b><span>" + en.type.toUpperCase() +
        " · " + b.userData.km.toFixed(1) + " KM · TAP TO OPEN</span>";
      const r = cv.getBoundingClientRect();
      tipEl.style.left = (e.clientX - r.left) + "px";
      tipEl.style.top = (e.clientY - r.top - 14) + "px";
      tipEl.hidden = false;
    } else {
      tipEl.hidden = true;
    }
  });

  function size() {
    const w = frame.clientWidth, h = frame.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    camera.position.set(Math.sin(orbit.ang) * 15.5 * Math.cos(0.62), Math.sin(0.62) * 15.5, Math.cos(orbit.ang) * 15.5 * Math.cos(0.62));
    camera.lookAt(0, 0.8, 0);
    renderer.render(scene, camera);    // repaint immediately — resize/headless safe
  }
  addEventListener("resize", size);
  size();

  function frameLoop(ts) {
    if (!visible) return;
    const dt = Math.min((ts - lastTs) / 1000 || 0.016, 0.05);
    lastTs = ts;
    clockT += dt;
    if (!orbit.drag) {
      orbit.vel += (0.12 - orbit.vel) * Math.min(dt, 1);
      orbit.ang += orbit.vel * dt;
    }
    const R = 15.5, EL = 0.62;
    camera.position.set(Math.sin(orbit.ang) * R * Math.cos(EL), Math.sin(EL) * R, Math.cos(orbit.ang) * R * Math.cos(EL));
    camera.lookAt(0, 0.8, 0);
    rings.forEach(rg => {
      const p = (clockT * rg.userData.speed + rg.userData.phase) % 1;
      rg.scale.setScalar(0.4 + p * 7.5);
      rg.material.opacity = 0.5 * (1 - p);
    });
    const pulse = 1 + Math.sin(clockT * 3) * 0.15;
    center.userData.glow.scale.setScalar(1.65 * pulse);
    beacons.forEach((b, i) => {
      b.group.userData.glow.scale.setScalar(0.77 * (b.group === hover ? 1.8 : 1 + Math.sin(clockT * 3 + i) * 0.12));
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frameLoop);
  }
  window.__holoLoop = frameLoop;
  built = true;
}

/* public: swap leaflet ↔ holo */
export function toggleHolo(opts) {
  if (!built) build(opts);
  btnRef = opts.btn;
  visible = !visible;
  frameRef.classList.toggle("holo-on", visible);
  if (btnRef) btnRef.innerHTML = visible ? "&#128506; MAP" : "&#11041; HOLO 3D";
  if (visible) {
    lastTs = 0;
    raf = requestAnimationFrame(window.__holoLoop);
  } else {
    cancelAnimationFrame(raf);
    if (tipEl) tipEl.hidden = true;
  }
  return visible;
}
