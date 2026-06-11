/* ============================================================
   SurfGoose · THE FLIGHT (design lab 02)
   A scroll-driven 3D film: you fly in formation with the goose
   over an endless golden-hour ocean, climb through cloud,
   dive, skim the water and land on real coordinates energy.
   three.js + GSAP + Lenis. Degrades to a static poster.
   ============================================================ */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.__flightBooted = true;

/* ---------- environment gates ---------- */
const reduced  = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const noMotion = /[?&]nomotion=1/.test(location.search);
const isTouch  = window.matchMedia && matchMedia("(hover: none), (pointer: coarse)").matches;

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

if (reduced || noMotion || !webglOK() || typeof gsap === "undefined") {
  document.body.classList.add("poster-mode");
} else {
  try { boot(); } catch (err) {
    console.error("[flight] boot failed:", err);
    document.body.classList.add("poster-mode");
  }
}

/* ============================================================ */
function boot() {

  /* ---------- data cards (same live pipeline as the site) ---------- */
  function onCatalog(fn) {
    if (typeof WAVEBASE_DATA !== "undefined" && Array.isArray(WAVEBASE_DATA) && WAVEBASE_DATA.length) fn();
    window.addEventListener("wavebase:data-ready", fn);
  }
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderCards() {
    const host = document.getElementById("flight-cards");
    if (!host) return;
    const now = new Date().getMonth() + 1;
    const ok = e => e && e.name && (e.coords || []).length === 2;
    const inSeason = e => (e.goodMonths || []).includes(now);
    const pickType = t => {
      const pool = WAVEBASE_DATA.filter(e => ok(e) && e.type === t);
      return pool.find(inSeason) || pool[0];
    };
    const picks = ["spot", "center", "stay"].map(pickType).filter(Boolean);
    if (!picks.length) {
      host.innerHTML = '<div class="waiting glass-thin">The catalog is waking up — the flight continues regardless.</div>';
      return;
    }
    host.innerHTML = picks.map(e => `
      <a class="flight-card glass-thin" href="spot.html?id=${encodeURIComponent(e.id)}">
        <div class="fc-top">
          <span class="fc-type ${esc(e.type)}">${esc(e.type)}</span>
          <span class="fc-place">${esc(e.town || "")}${e.country ? " · " + esc(e.country) : ""}</span>
        </div>
        <div class="fc-name">${esc(e.name)}</div>
        <p class="fc-line">${esc(e.tagline || "")}</p>
        <span class="fc-go">See it on the map &rarr;</span>
      </a>`).join("");
  }
  onCatalog(renderCards);
  renderCards();

  /* ---------- renderer / scene ---------- */
  const canvas = document.getElementById("stage");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const DPR_CAP = isTouch ? 1.5 : 1.75;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1500);
  camera.position.set(-9, 9, 3);

  /* ---------- palette helpers ---------- */
  const fogCool = new THREE.Color(0xc4cdc9);
  const fogWarm = new THREE.Color(0xf7a35e);
  const FOG = new THREE.Color();
  function warmOf(sunEl) { return THREE.MathUtils.clamp(1.25 - sunEl * 2.6, 0.35, 1); }

  /* ---------- sun + lights ---------- */
  const sunDir = new THREE.Vector3(-0.35, 0.3, -1).normalize();
  const sun = new THREE.DirectionalLight(0xffd9a0, 2.4);
  scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xbfd9e2, 0x16323a, 0.75);
  scene.add(hemi);
  const rim = new THREE.DirectionalLight(0x9fd0e8, 1.0);
  rim.position.set(-30, 16, 40);
  scene.add(rim);

  /* ---------- sky dome ---------- */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uSunDir: { value: sunDir }, uWarm: { value: 0.6 } },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 vDir;
      uniform vec3 uSunDir;
      uniform float uWarm;
      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, -0.12, 1.0);
        vec3 top  = mix(vec3(0.17, 0.34, 0.46), vec3(0.10, 0.20, 0.33), uWarm * 0.55);
        vec3 hor  = mix(vec3(0.74, 0.82, 0.85), vec3(0.99, 0.66, 0.36), uWarm);
        vec3 sky  = mix(hor, top, pow(smoothstep(0.0, 0.5, h), 0.75));
        vec3 sd = normalize(uSunDir);
        float az = pow(max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(sd.x, 0.0, sd.z))), 0.0), 3.0);
        sky += vec3(1.0, 0.50, 0.22) * az * uWarm * 0.30 * (1.0 - smoothstep(0.0, 0.55, h));
        float sa = max(dot(d, sd), 0.0);
        float disc = smoothstep(0.9993, 0.99975, sa);
        float glow = pow(sa, 700.0) * 0.9 + pow(sa, 48.0) * 0.28;
        sky += vec3(1.0, 0.84, 0.58) * (disc * 1.6 + glow);
        if (d.y < 0.0) sky = mix(sky, vec3(0.05, 0.14, 0.18), smoothstep(0.0, -0.12, d.y));
        gl_FragColor = vec4(sky, 1.0);
      }`
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(950, 36, 18), skyMat));

  /* ---------- ocean ---------- */
  const SEG = isTouch ? 96 : 144;
  const oceanGeo = new THREE.PlaneGeometry(900, 900, SEG, SEG);
  oceanGeo.rotateX(-Math.PI / 2);
  const oceanMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uFlow: { value: 0 },
      uSunDir: { value: sunDir }, uWarm: { value: 0.6 },
      uCamPos: { value: camera.position },
      uFogColor: { value: FOG }, uFogD: { value: 0.004 },
      uRippleO: { value: new THREE.Vector2(0, 0) }, uRippleT: { value: -1 }
    },
    vertexShader: `
      uniform float uTime, uFlow;
      varying vec3 vWorld;
      varying vec3 vNrm;
      float waveH(vec2 p) {
        float z = p.y + uFlow;
        // high-frequency chop fades with distance to kill moiré at the horizon
        float damp = exp(-length(p) * 0.0065);
        float h = sin(p.x * 0.105 + uTime * 0.65 + z * 0.06) * 0.52
                + sin(z * 0.155 - uTime * 0.9) * 0.45 * mix(0.4, 1.0, damp)
                + sin(p.x * 0.046 - z * 0.10 + uTime * 0.45) * 0.85
                + sin((p.x + z) * 0.32 + uTime * 1.7) * 0.10 * damp;
        return h;
      }
      void main() {
        vec3 pos = position;
        vec2 xz = pos.xz;
        float h = waveH(xz);
        float e = 0.65;
        float hx = waveH(xz + vec2(e, 0.0)) - waveH(xz - vec2(e, 0.0));
        float hz = waveH(xz + vec2(0.0, e)) - waveH(xz - vec2(0.0, e));
        pos.y += h;
        vNrm = normalize(vec3(-hx / (2.0 * e), 1.0, -hz / (2.0 * e)));
        vec4 w = modelMatrix * vec4(pos, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: `
      uniform float uTime, uWarm, uFogD, uRippleT;
      uniform vec3 uSunDir, uCamPos, uFogColor;
      uniform vec2 uRippleO;
      varying vec3 vWorld;
      varying vec3 vNrm;
      void main() {
        vec2 q = vWorld.xz * 1.9 + vec2(uTime * 0.32, -uTime * 0.21);
        float nd = exp(-distance(uCamPos.xz, vWorld.xz) * 0.012);   // micro-detail only near the camera
        vec3 n = normalize(vNrm + vec3(sin(q.x) * 0.5 + sin(q.y * 1.7), 0.0, cos(q.y) * 0.5 + cos(q.x * 1.3)) * 0.05 * nd);
        vec3 V = normalize(uCamPos - vWorld);
        float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
        vec3 deep = mix(vec3(0.045, 0.16, 0.20), vec3(0.06, 0.22, 0.26), uWarm * 0.35);
        vec3 lift = vec3(0.14, 0.38, 0.43);
        vec3 col = mix(deep, lift, fres * 0.6);
        vec3 skyRef = mix(vec3(0.72, 0.81, 0.84), vec3(1.0, 0.66, 0.38), uWarm);
        col = mix(col, skyRef, fres * 0.55);
        vec3 R = reflect(-normalize(uSunDir), n);
        float rv = max(dot(R, V), 0.0);
        col += vec3(1.0, 0.78, 0.5) * (pow(rv, 160.0) * 1.6 + pow(rv, 20.0) * 0.10);
        if (uRippleT >= 0.0) {
          float dd = distance(vWorld.xz, uRippleO);
          float ring = sin(dd * 6.5 - uRippleT * 5.5);
          float env = exp(-dd * 0.5) * exp(-uRippleT * 0.85);
          col += vec3(0.95, 0.97, 0.92) * max(ring, 0.0) * env * 0.55;
        }
        float fd = length(uCamPos - vWorld);
        float f = 1.0 - exp(-uFogD * uFogD * fd * fd);
        col = mix(col, uFogColor, clamp(f, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  scene.add(new THREE.Mesh(oceanGeo, oceanMat));

  /* ---------- clouds (billboarded soft sprites) ---------- */
  function cloudTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const blob = (x, y, r, a) => {
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,252,246," + a + ")");
      gr.addColorStop(0.55, "rgba(255,252,246," + a * 0.45 + ")");
      gr.addColorStop(1, "rgba(255,252,246,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
    };
    // keep every blob well inside the canvas so the plane edges never show
    blob(128, 138, 78, 0.8);
    for (let i = 0; i < 6; i++) {
      blob(88 + Math.random() * 80, 118 + Math.random() * 50, 24 + Math.random() * 34, 0.30 + Math.random() * 0.25);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const cloudTex = cloudTexture();
  const cloudGroup = new THREE.Group();
  scene.add(cloudGroup);
  const N_CLOUDS = isTouch ? 10 : 15;
  const clouds = [];
  for (let i = 0; i < N_CLOUDS; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 0.62),
      new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, opacity: 0.55, fog: false })
    );
    const s = 14 + Math.random() * 26;
    m.scale.set(s * 1.4, s * 0.5, 1);
    m.position.set((Math.random() - 0.5) * 110, 12 + Math.random() * 9, -30 - Math.random() * 150);
    m.userData.drift = 0.75 + Math.random() * 0.5;
    cloudGroup.add(m);
    clouds.push(m);
  }

  /* ---------- streaks + spray (speed cues) ---------- */
  function dotTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30);
    gr.addColorStop(0, "rgba(255,255,255,0.95)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const N_PTS = isTouch ? 110 : 170;
  const ptsGeo = new THREE.BufferGeometry();
  const ptsPos = new Float32Array(N_PTS * 3);
  for (let i = 0; i < N_PTS; i++) {
    ptsPos[i * 3] = (Math.random() - 0.5) * 22;
    ptsPos[i * 3 + 1] = 0.2 + Math.random() * 7;
    ptsPos[i * 3 + 2] = 12 - Math.random() * 60;
  }
  ptsGeo.setAttribute("position", new THREE.BufferAttribute(ptsPos, 3));
  const ptsMat = new THREE.PointsMaterial({
    size: 0.16, map: dotTexture(), transparent: true, opacity: 0,
    depthWrite: false, color: 0xfff3df, sizeAttenuation: true
  });
  const streaks = new THREE.Points(ptsGeo, ptsMat);
  scene.add(streaks);

  /* ---------- the goose ---------- */
  const birdGroup = new THREE.Group();
  scene.add(birdGroup);
  let mixer = null, flapAction = null, birdReady = false, flapLocked = false;

  const manager = new THREE.LoadingManager();
  const pctEl = document.getElementById("loader-pct");
  manager.onProgress = (url, loaded, total) => {
    if (pctEl) pctEl.textContent = Math.round((loaded / Math.max(total, 1)) * 100) + "%";
  };

  new GLTFLoader(manager).load("stork.glb", (gltf) => {
    const bird = gltf.scene;
    // Normalize size: wingspan ≈ 3.4 world units.
    const box = new THREE.Box3().setFromObject(bird);
    const size = box.getSize(new THREE.Vector3());
    const k = 3.4 / Math.max(size.x, size.z, 0.001);
    bird.scale.setScalar(k);
    // The model flies toward +Z; our world flows past toward +Z,
    // so the bird must face −Z.
    bird.rotation.y = Math.PI;
    bird.traverse(o => {
      if (o.isMesh) {
        o.frustumCulled = false;
        if (o.material) {
          o.material.roughness = 0.92;
          o.material.metalness = 0.0;
          o.material.color = new THREE.Color(1.0, 0.975, 0.92);  // warm snow-goose cream (multiplies vertex colors)
        }
      }
    });
    birdGroup.add(bird);
    mixer = new THREE.AnimationMixer(bird);
    if (gltf.animations && gltf.animations.length) {
      flapAction = mixer.clipAction(gltf.animations[0]);
      flapAction.play();
    }
    birdReady = true;
  }, undefined, (err) => {
    console.error("[flight] bird failed to load:", err);
    document.body.classList.add("poster-mode");
  });

  /* ============================================================
     CHOREOGRAPHY — one key per scene boundary
     cam/look are offsets from the bird. speed drives the world.
     ============================================================ */
  /* cam = [orbit angle°, radius, height] around the bird — angles run
     continuously so the camera circles the goose across the whole film
     and can never cut through it. 0° = behind, ±180° = ahead. */
  const KEYS = [
    { cam: [-75, 9.3, 1.0],   look: [0, 0.5, -2.5],  fov: 40, alt: 8.0,  speed: 1.0,  flap: 1.0,  bank: 0,     pitch: 0,     fog: 0.0050, sunEl: 0.30, cloudY: 16,   lb: 0 },
    { cam: [-150, 8.6, 1.5],  look: [0, 0.3, 0.5],   fov: 43, alt: 8.6,  speed: 0.92, flap: 0.9,  bank: 0.07,  pitch: 0,     fog: 0.0048, sunEl: 0.26, cloudY: 15,   lb: 0 },
    { cam: [-188, 9.0, -0.4], look: [0, 1.3, 0],     fov: 47, alt: 15.5, speed: 1.3,  flap: 1.25, bank: 0,     pitch: -0.17, fog: 0.0090, sunEl: 0.34, cloudY: 14.5, lb: 0 },
    { cam: [-228, 9.8, 3.1],  look: [0, -0.8, -2.5], fov: 55, alt: 3.4,  speed: 2.6,  flap: 1.5,  bank: -0.13, pitch: 0.33,  fog: 0.0030, sunEl: 0.12, cloudY: 20,   lb: 1 },
    { cam: [-262, 6.6, 0.85], look: [0.3, 0.15, -1.2], fov: 50, alt: 1.25, speed: 3.0, flap: 0.5, bank: 0.06,  pitch: 0.05,  fog: 0.0026, sunEl: 0.08, cloudY: 21,   lb: 1 },
    { cam: [-275, 6.0, 1.05], look: [0, 0.2, 0],     fov: 44, alt: 0.16, speed: 0.55, flap: 0,    bank: 0,     pitch: -0.10, fog: 0.0042, sunEl: 0.055, cloudY: 22,  lb: 0 },
    { cam: [-335, 6.8, 1.6],  look: [0, 0.25, 0],    fov: 42, alt: 0.16, speed: 0,    flap: 0,    bank: 0,     pitch: 0,     fog: 0.0046, sunEl: 0.045, cloudY: 22,  lb: 0 }
  ];
  const PARAMS = Object.keys(KEYS[0]);
  const cur = {};
  const smoothstep = t => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;

  function keyAt(p01, sceneIdx, localT) {
    const a = KEYS[sceneIdx], b = KEYS[Math.min(sceneIdx + 1, KEYS.length - 1)];
    const t = smoothstep(THREE.MathUtils.clamp(localT, 0, 1));
    for (const k of PARAMS) {
      if (Array.isArray(a[k])) {
        cur[k] = cur[k] || [0, 0, 0];
        for (let i = 0; i < 3; i++) cur[k][i] = lerp(a[k][i], b[k][i], t);
      } else {
        cur[k] = lerp(a[k], b[k], t);
      }
    }
  }

  /* ---------- scenes from the DOM ---------- */
  const sceneEls = Array.from(document.querySelectorAll(".scene"));
  let bounds = [];
  function measure() {
    bounds = sceneEls.map(el => ({ top: el.offsetTop, len: Math.max(el.offsetHeight - innerHeight, 1), el }));
  }

  function sceneProgress(y) {
    let idx = 0, local = 0;
    for (let i = 0; i < bounds.length; i++) {
      const b = bounds[i];
      if (y >= b.top - 1) { idx = i; local = (y - b.top) / b.len; }
    }
    return { idx, local: THREE.MathUtils.clamp(local, 0, 1) };
  }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    window.__flightLenis = lenis;
  }

  /* ---------- cinematic state ---------- */
  const clock = new THREE.Clock();
  let flow = 0, vel = 0, lastY = 0;
  let rippleStart = -1, splashDone = false;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!isTouch) {
    addEventListener("pointermove", e => {
      mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
    });
  }

  const camPos = new THREE.Vector3(), lookAt = new THREE.Vector3();
  const docEl = document.documentElement;

  function update(dt, t) {
    const y = window.scrollY;
    const rawV = (y - lastY) / Math.max(dt, 0.001);
    lastY = y;
    vel += (rawV - vel) * Math.min(dt * 6, 1);

    const sp = window.__flightP != null
      ? { idx: Math.min(Math.floor(window.__flightP * 6), 5), local: (window.__flightP * 6) % 1 }
      : sceneProgress(y);
    keyAt(0, sp.idx, sp.local);

    /* sun + atmosphere */
    const warm = warmOf(cur.sunEl);
    sunDir.set(-0.35, Math.max(cur.sunEl, 0.03), -1).normalize();
    sun.position.copy(sunDir).multiplyScalar(120);
    sun.intensity = 1.6 + warm * 1.3;
    hemi.intensity = 0.85 - warm * 0.25;
    FOG.copy(fogCool).lerp(fogWarm, warm * 0.85);
    renderer.setClearColor(FOG);
    skyMat.uniforms.uWarm.value = warm;
    oceanMat.uniforms.uWarm.value = warm;
    oceanMat.uniforms.uFogColor.value = FOG;
    oceanMat.uniforms.uFogD.value = cur.fog;
    renderer.toneMappingExposure = 1.0 + warm * 0.16;

    /* world flow (the flight) */
    flow += cur.speed * dt * 9;
    oceanMat.uniforms.uTime.value = t;
    oceanMat.uniforms.uFlow.value = flow;

    /* bird */
    const velRoll = THREE.MathUtils.clamp(vel * 0.00045, -0.16, 0.16);
    if (birdReady) {
      const flapNorm = THREE.MathUtils.clamp(cur.flap, 0, 2);
      const airborne = cur.alt > 0.5;
      const bob = airborne
        ? Math.sin(t * 1.9) * 0.07 * Math.min(flapNorm + 0.3, 1)
        : Math.sin(t * 1.1) * 0.035;
      birdGroup.position.set(0, cur.alt + bob, 0);
      birdGroup.rotation.z = -(cur.bank + velRoll) * 1.6;
      birdGroup.rotation.x = cur.pitch;
      if (mixer) {
        if (flapNorm < 0.06 && !flapLocked && flapAction) {
          flapAction.paused = true;
          flapAction.time = flapAction.getClip().duration * 0.34;  // wings mid-glide
          flapLocked = true;
        } else if (flapNorm >= 0.06 && flapLocked && flapAction) {
          flapAction.paused = false;
          flapLocked = false;
        }
        mixer.timeScale = Math.max(flapNorm, 0.001);
        mixer.update(dt);
      }
    }

    /* touchdown FX in the landing scene */
    if (sp.idx === 5) {
      if (sp.local > 0.42 && !splashDone) {
        splashDone = true;
        rippleStart = t;
        oceanMat.uniforms.uRippleO.value.set(0, 0);
      }
      if (sp.local < 0.25 && splashDone) { splashDone = false; rippleStart = -1; }
    }
    oceanMat.uniforms.uRippleT.value = rippleStart >= 0 ? (t - rippleStart) : -1;

    /* camera rig — cylindrical orbit around the bird (+ end-scene sweep) */
    let ang = cur.cam[0] * Math.PI / 180, rad = cur.cam[1], cy = cur.cam[2];
    if (sp.idx === 5 && sp.local > 0.55) {
      const o = smoothstep((sp.local - 0.55) / 0.45);
      ang -= o * Math.PI * 0.45;     // keep circling toward the face
      cy += o * 0.4;
    }
    const cx = Math.sin(ang) * rad;
    const cz = Math.cos(ang) * rad;
    mouse.x += (mouse.tx - mouse.x) * Math.min(dt * 4, 1);
    mouse.y += (mouse.ty - mouse.y) * Math.min(dt * 4, 1);
    camPos.set(
      cx + mouse.x * 0.7,
      Math.max(cur.alt + cy + mouse.y * -0.45, 0.45),
      cz
    );
    camera.position.lerp(camPos, Math.min(dt * 5.5, 1));
    // On portrait screens, pan less ahead of the bird so it stays framed.
    const aspectK = THREE.MathUtils.clamp(camera.aspect / 1.5, 0.5, 1);
    lookAt.set(cur.look[0] * aspectK, cur.alt + cur.look[1], cur.look[2] * aspectK);
    camera.up.set(0, 1, 0);
    camera.lookAt(lookAt);
    camera.rotation.z += -(cur.bank + velRoll) * 0.55;   // lean into the turn together
    if (Math.abs(camera.fov - cur.fov) > 0.01) {
      camera.fov = cur.fov;
      camera.updateProjectionMatrix();
    }

    /* clouds drift past */
    const drift = (cur.speed * 13 + 1.5) * dt;
    for (const c of clouds) {
      c.position.z += drift * c.userData.drift;
      if (c.position.z > camera.position.z + 26) {
        c.position.z -= 170 + Math.random() * 50;
        c.position.x = (Math.random() - 0.5) * 120;
        c.position.y = cur.cloudY + (Math.random() - 0.35) * 9;
      }
      // gently track the layer altitude so the climb scene flies through them
      c.position.y += (cur.cloudY + (c.userData.yJit || 0) - c.position.y) * dt * 0.4;
      if (c.userData.yJit == null) c.userData.yJit = (Math.random() - 0.35) * 9;
      c.quaternion.copy(camera.quaternion);
      const dz = Math.abs(c.position.z - camera.position.z);
      c.material.opacity = 0.85 * THREE.MathUtils.clamp(1.3 - dz / 150, 0.1, 1);
      c.material.color.setRGB(1, 0.93 + (1 - warm) * 0.06, 0.86 + (1 - warm) * 0.12);
    }

    /* streaks / spray */
    const speedCue = THREE.MathUtils.clamp((cur.speed - 1.5) / 1.5, 0, 1);
    ptsMat.opacity = speedCue * 0.5;
    if (speedCue > 0.01) {
      const arr = ptsGeo.attributes.position.array;
      const zPlus = cur.speed * 26 * dt;
      for (let i = 0; i < N_PTS; i++) {
        arr[i * 3 + 2] += zPlus;
        if (arr[i * 3 + 2] > camera.position.z + 8) {
          arr[i * 3] = (Math.random() - 0.5) * 22;
          arr[i * 3 + 1] = 0.2 + Math.random() * (cur.alt < 2 ? 2.2 : 7);
          arr[i * 3 + 2] -= 65;
        }
      }
      ptsGeo.attributes.position.needsUpdate = true;
    }

    /* DOM: scene activation + cine overlays */
    for (let i = 0; i < sceneEls.length; i++) {
      sceneEls[i].classList.toggle("is-on", i === sp.idx || (i === sp.idx + 1 && sp.local > 0.85));
    }
    docEl.style.setProperty("--lb", cur.lb.toFixed(3));
    docEl.style.setProperty("--vig", (0.42 + cur.lb * 0.3 + (1 - Math.min(cur.alt / 8, 1)) * 0.08).toFixed(3));
    // whiteout while punching through the cloud layer (scene 2)
    const cloudVeil = sp.idx === 2 ? Math.pow(Math.sin(sp.local * Math.PI), 1.6) * 0.92 : 0;
    docEl.style.setProperty("--cloudveil", cloudVeil.toFixed(3));
  }

  /* ---------- render loop ---------- */
  let running = false;
  function frame(now) {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (lenis) lenis.raf(now);
    update(dt, t);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  /* debug hooks (headless verification + tuning) */
  window.__flightP = null;
  window.__flightRender = function (p) {
    window.__flightP = (p == null ? null : THREE.MathUtils.clamp(p, 0, 0.999));
    const dt = 1 / 60;
    clock.getDelta();
    for (let i = 0; i < 3; i++) update(dt, clock.elapsedTime + i * dt);
    camera.position.copy(camPos);          // snap the rig for deterministic stills
    update(dt, clock.elapsedTime);
    camera.position.copy(camPos);
    renderer.render(scene, camera);
    return "rendered p=" + p;
  };
  window.__flightInfo = function () {
    return JSON.stringify({
      birdReady, scenes: bounds.length,
      cam: camera.position.toArray().map(v => +v.toFixed(2)),
      fov: +camera.fov.toFixed(1)
    });
  };

  /* ---------- sizing ---------- */
  function resize() {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    measure();
    // setSize wipes the buffer — repaint immediately so rotation /
    // window-resize never flashes an empty frame.
    renderer.render(scene, camera);
  }
  addEventListener("resize", resize);
  resize();

  /* ---------- loader → title card → film ---------- */
  const loader = document.getElementById("loader");
  const titleCard = document.getElementById("title-card");
  let filmStarted = false;

  function startFilm() {
    if (filmStarted) return;
    filmStarted = true;
    document.body.classList.add("film-on");
    gsap.to(loader, {
      autoAlpha: 0, duration: 0.9, ease: "power2.inOut",
      onComplete: () => loader.remove()
    });
  }

  function showTitleCard() {
    const inner = loader.querySelector(".loader-inner");
    gsap.timeline()
      .to(inner, { autoAlpha: 0, duration: 0.5, ease: "power2.in" })
      .set(titleCard, { opacity: 1 })
      .fromTo(titleCard.querySelector(".tc-presents"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, "<")
      .fromTo(titleCard.querySelector(".tc-title"),
        { opacity: 0, letterSpacing: "0.18em", scale: 0.97 },
        { opacity: 1, letterSpacing: "0em", scale: 1, duration: 1.3, ease: "power3.out" }, "-=0.25")
      .fromTo(titleCard.querySelector(".tc-sub"), { opacity: 0 }, { opacity: 1, duration: 0.7 }, "-=0.5")
      .add(startFilm, "+=1.1");
    // impatient viewers can cut straight to the scene
    addEventListener("pointerdown", startFilm, { once: true });
    addEventListener("wheel", startFilm, { once: true, passive: true });
    addEventListener("touchstart", startFilm, { once: true, passive: true });
  }

  manager.onLoad = () => {
    running = true;
    requestAnimationFrame(frame);
    setTimeout(showTitleCard, 350);
  };
  // If the bird somehow never resolves, the watchdog in flight.html
  // flips to the poster; nothing to do here.
}
