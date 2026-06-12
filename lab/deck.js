/* ============================================================
   SurfGoose · FLIGHT DECK (design lab 03)
   Interactive: steer the goose with your pointer, summon a
   holographic Earth with every real catalog destination, open
   live spot dossiers. Photoreal dusk via three.js Sky + Water
   + PMREM environment lighting. Degrades to a static poster.
   ============================================================ */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";

window.__deckBooted = true;

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
    console.error("[deck] boot failed:", err);
    document.body.classList.add("poster-mode");
  }
}

function boot() {
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const NOW_M = new Date().getMonth() + 1;
  const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  /* ============================================================
     SOUND — tiny synthesizer, no assets, opt-in
     ============================================================ */
  let AC = null, master = null, soundOn = false;
  function audioInit() {
    if (AC) return;
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    master.gain.value = 0.22;
    master.connect(AC.destination);
    // ambient dusk air: looped filtered noise
    const len = AC.sampleRate * 2;
    const buf = AC.createBuffer(1, len, AC.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {            // brown-ish noise
      last = (last + (Math.random() * 2 - 1) * 0.02) * 0.998;
      d[i] = last * 3;
    }
    const src = AC.createBufferSource();
    src.buffer = buf; src.loop = true;
    const lp = AC.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 420;
    const g = AC.createGain(); g.gain.value = 0.16;
    src.connect(lp); lp.connect(g); g.connect(master);
    src.start();
  }
  function tone(f0, f1, dur, type, vol, bend) {
    if (!soundOn || !AC) return;
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(f0, AC.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), AC.currentTime + dur * (bend || 1));
    g.gain.setValueAtTime(0, AC.currentTime);
    g.gain.linearRampToValueAtTime(vol, AC.currentTime + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.connect(g); g.connect(master);
    o.start(); o.stop(AC.currentTime + dur + 0.05);
  }
  const sBlip  = () => tone(1500, 1500, 0.05, "sine", 0.10);
  const sClick = () => tone(600, 1050, 0.12, "triangle", 0.18);
  const sHonk  = () => { tone(255, 185, 0.30, "sawtooth", 0.22, 0.8); tone(330, 250, 0.26, "square", 0.10, 0.8); };
  const sRise  = () => tone(140, 740, 1.4, "sine", 0.12);

  const soundChip = $("#sound-chip");
  soundChip.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn) { audioInit(); AC.resume && AC.resume(); }
    if (master) master.gain.value = soundOn ? 0.22 : 0;
    soundChip.setAttribute("aria-pressed", soundOn ? "true" : "false");
    $("#sound-label").textContent = soundOn ? "SOUND ON" : "SOUND OFF";
    if (soundOn) sClick();
  });
  document.addEventListener("mouseover", e => {
    if (e.target.closest && e.target.closest(".holo-btn, .holo-chip a, .town-item")) sBlip();
  });

  /* ============================================================
     DATA — same live pipeline as the site
     ============================================================ */
  function onCatalog(fn) {
    if (typeof WAVEBASE_DATA !== "undefined" && Array.isArray(WAVEBASE_DATA) && WAVEBASE_DATA.length) fn();
    window.addEventListener("wavebase:data-ready", fn);
  }
  const byId = id => WAVEBASE_DATA.find(e => e.id === id);
  function townGroups() {
    const map = new Map();
    WAVEBASE_DATA.forEach(e => {
      if (!e || !e.name || (e.coords || []).length !== 2 || !e.town) return;
      if (!map.has(e.town)) map.set(e.town, { town: e.town, country: e.country, coords: e.coords, entries: [] });
      map.get(e.town).entries.push(e);
    });
    return [...map.values()];
  }

  /* ============================================================
     RENDERER / SCENE — photoreal dusk
     ============================================================ */
  const canvas = $("#stage");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.55;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const DPR_CAP = isTouch ? 1.5 : 1.75;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 22000);
  camera.position.set(0, 18, 70);

  const manager = new THREE.LoadingManager();
  const pctEl = $("#boot-pct");
  manager.onProgress = (u, l, t) => { if (pctEl) pctEl.textContent = Math.round((l / Math.max(t, 1)) * 100) + "%"; };

  /* sky + sun */
  const sky = new Sky();
  sky.scale.setScalar(12000);
  scene.add(sky);
  const skyU = sky.material.uniforms;
  skyU.turbidity.value = 3.4;        // low haze = saturated dusk colors
  skyU.rayleigh.value = 3.0;
  skyU.mieCoefficient.value = 0.005;
  skyU.mieDirectionalG.value = 0.78;
  const sunDir = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - 2.4);     // sun 2.4° above horizon — deep golden dusk
  const theta = THREE.MathUtils.degToRad(196);
  sunDir.setFromSphericalCoords(1, phi, theta);
  skyU.sunPosition.value.copy(sunDir);

  /* photoreal water */
  const water = new Water(new THREE.PlaneGeometry(12000, 12000), {
    textureWidth: isTouch ? 256 : 512,
    textureHeight: isTouch ? 256 : 512,
    waterNormals: new THREE.TextureLoader(manager).load("waternormals.jpg", t => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: sunDir.clone().normalize(),
    sunColor: 0xffe6c0,
    waterColor: 0x07222e,
    distortionScale: 3.4,
    fog: false
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  /* environment lighting from the sky itself */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(sky);
  scene.environment = pmrem.fromScene(envScene).texture;
  scene.add(sky);

  const sunLight = new THREE.DirectionalLight(0xffd2a0, 2.0);
  sunLight.position.copy(sunDir).multiplyScalar(200);
  scene.add(sunLight);
  scene.add(new THREE.HemisphereLight(0x5c7d8e, 0x0a1c26, 0.5));

  /* ============================================================
     GOOSE — steerable
     ============================================================ */
  const goose = new THREE.Group();
  scene.add(goose);
  let mixer = null, flapAction = null, birdReady = false;
  new GLTFLoader(manager).load("stork.glb", gltf => {
    const bird = gltf.scene;
    const box = new THREE.Box3().setFromObject(bird);
    const size = box.getSize(new THREE.Vector3());
    bird.scale.setScalar(3.4 / Math.max(size.x, size.z, 0.001));
    bird.rotation.y = Math.PI;     // face −z
    bird.traverse(o => {
      if (o.isMesh && o.material) {
        o.frustumCulled = false;
        o.material.roughness = 0.85;
        o.material.metalness = 0.0;
        o.material.envMapIntensity = 1.15;
        o.material.color = new THREE.Color(1.0, 0.97, 0.91);
      }
    });
    goose.add(bird);
    mixer = new THREE.AnimationMixer(bird);
    if (gltf.animations.length) { flapAction = mixer.clipAction(gltf.animations[0]); flapAction.play(); }
    birdReady = true;
  }, undefined, err => {
    console.error("[deck] bird failed:", err);
    document.body.classList.add("poster-mode");
  });
  goose.position.set(-46, 12, -28);

  /* spray when skimming + boosting */
  function dotTex() {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30);
    gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const sprayN = 90;
  const sprayGeo = new THREE.BufferGeometry();
  const sprayPos = new Float32Array(sprayN * 3).fill(9999);
  const sprayVel = [];
  for (let i = 0; i < sprayN; i++) sprayVel.push(new THREE.Vector3());
  sprayGeo.setAttribute("position", new THREE.BufferAttribute(sprayPos, 3));
  const spray = new THREE.Points(sprayGeo, new THREE.PointsMaterial({
    size: 0.30, map: dotTex(), transparent: true, opacity: 0.85, depthWrite: false, color: 0xeafcff
  }));
  scene.add(spray);
  let sprayIdx = 0;
  function spawnSpray(p, n, up) {
    for (let i = 0; i < n; i++) {
      const k = sprayIdx++ % sprayN;
      sprayPos[k * 3] = p.x; sprayPos[k * 3 + 1] = p.y; sprayPos[k * 3 + 2] = p.z;
      sprayVel[k].set((Math.random() - .5) * 3, (up || 2) + Math.random() * 2.5, (Math.random() - .5) * 3 + 2);
    }
  }

  /* ============================================================
     HOLOGRAM EARTH
     ============================================================ */
  const GLOBE_R = 4.6;
  const GLOBE_POS = new THREE.Vector3(0, 10.6, -6);
  const globeGroup = new THREE.Group();      // rises/hides
  const globeSpin = new THREE.Group();       // user-rotated
  globeSpin.rotation.y = -1.35;              // open facing the Atlantic — where the catalog lives
  globeGroup.add(globeSpin);
  globeGroup.position.copy(GLOBE_POS);
  globeGroup.visible = false;
  scene.add(globeGroup);

  const earthTex = new THREE.TextureLoader(manager).load("earth_atmos.jpg");
  earthTex.colorSpace = THREE.SRGBColorSpace;
  earthTex.anisotropy = 4;
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_R, 64, 48),
    new THREE.MeshStandardMaterial({
      map: earthTex, roughness: 1, metalness: 0,
      emissive: 0xbfe9ff, emissiveMap: earthTex, emissiveIntensity: 0.75
    })
  );
  globeSpin.add(earth);

  /* fresnel hologram shell */
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_R * 1.035, 64, 48),
    new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
      uniforms: { uC: { value: new THREE.Color(0x6ef3ff) } },
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "varying vec3 vN; varying vec3 vV; uniform vec3 uC; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.6); gl_FragColor = vec4(uC, f * 0.65); }"
    })
  );
  globeSpin.add(shell);

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_R * 1.012, 36, 24),
    new THREE.MeshBasicMaterial({ color: 0x6ef3ff, wireframe: true, transparent: true, opacity: 0.05, depthWrite: false })
  );
  globeSpin.add(wire);

  /* projection cone + base ring on the water */
  const cone = new THREE.Mesh(
    new THREE.CylinderGeometry(GLOBE_R * 0.96, 0.9, GLOBE_POS.y, 40, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x6ef3ff, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  );
  cone.position.set(GLOBE_POS.x, GLOBE_POS.y / 2 - GLOBE_POS.y, 0);   // local: below globe center
  globeGroup.add(cone);
  const baseRing = new THREE.Mesh(
    new THREE.RingGeometry(1.1, 1.55, 48),
    new THREE.MeshBasicMaterial({ color: 0x6ef3ff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  );
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = -GLOBE_POS.y + 0.15;
  globeGroup.add(baseRing);

  /* rising holo dust inside the cone */
  const dustN = 160;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * GLOBE_R * 0.9;
    dustPos[i * 3] = Math.cos(a) * r;
    dustPos[i * 3 + 1] = -GLOBE_POS.y + Math.random() * (GLOBE_POS.y + GLOBE_R);
    dustPos[i * 3 + 2] = Math.sin(a) * r;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.045, color: 0x9ff5ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  globeGroup.add(dust);

  /* destination beacons — one per town, from live data */
  const pinTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30);
    gr.addColorStop(0, "rgba(110,243,255,1)"); gr.addColorStop(0.4, "rgba(110,243,255,.5)"); gr.addColorStop(1, "rgba(110,243,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const pins = [];
  function latLngToV3(lat, lng, r) {
    const ph = THREE.MathUtils.degToRad(90 - lat);
    const th = THREE.MathUtils.degToRad(lng + 180);
    return new THREE.Vector3(
      -r * Math.sin(ph) * Math.cos(th),
       r * Math.cos(ph),
       r * Math.sin(ph) * Math.sin(th)
    );
  }
  let pinsBuilt = false;
  function buildPins() {
    if (pinsBuilt || !WAVEBASE_DATA.length) return;
    pinsBuilt = true;
    townGroups().forEach(t => {
      const pos = latLngToV3(t.coords[0], t.coords[1], GLOBE_R * 1.01);
      const grp = new THREE.Group();
      grp.position.copy(pos);
      grp.lookAt(pos.clone().multiplyScalar(2));
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.03, 0.55, 6),
        new THREE.MeshBasicMaterial({ color: 0x9ff5ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      beacon.rotation.x = Math.PI / 2;
      beacon.position.z = 0.27;
      grp.add(beacon);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: pinTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      glow.scale.setScalar(0.34 + Math.min(t.entries.length, 9) * 0.03);
      glow.position.z = 0.1;
      grp.add(glow);
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.30, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      grp.add(hit);
      grp.userData = { town: t, glow, beacon };
      hit.userData.pin = grp;
      globeSpin.add(grp);
      pins.push({ grp, hit, glow, town: t });
    });
  }
  onCatalog(buildPins);

  /* ============================================================
     MODES
     ============================================================ */
  const hint = $("#hint");
  const HINTS = {
    fly: isTouch
      ? "<b>DRAG</b> — the goose follows · <b>HOLD</b> to boost · <b>TAP</b> to honk"
      : "<b>MOVE</b> the cursor — the goose follows · <b>HOLD</b> to boost · <b>CLICK</b> to honk",
    globe: isTouch
      ? "<b>DRAG</b> to spin the world · <b>TAP</b> a beacon — every light is a real place"
      : "<b>DRAG</b> to spin the world · <b>CLICK</b> a beacon — every light is a real place"
  };
  let mode = "arrive";
  const camTarget = new THREE.Vector3(0, 6.6, 25);
  const lookTarget = new THREE.Vector3(0, 8.6, -8);
  const camNow = { fov: 50 };

  function setHint(key) {
    if (!key) { hint.classList.remove("is-on"); return; }
    hint.innerHTML = HINTS[key];
    hint.classList.add("is-on");
  }

  function setMode(m) {
    if (m === mode) return;
    mode = m;
    $("#btn-fly").classList.toggle("is-on", m === "fly");
    $("#btn-globe").classList.toggle("is-on", m === "globe");
    closeDossier(); closeTownPanel(); hidePinCard();
    gsap.killTweensOf(globeGroup.position);    // never let mode tweens fight
    if (m === "fly") {
      camTarget.set(0, 6.6, 25); lookTarget.set(0, 8.6, -8); camNow.fovTo = 50;
      setHint("fly");
      if (globeGroup.visible) {
        gsap.to(globeGroup.position, { y: GLOBE_POS.y - 26, duration: 1.1, ease: "power2.in", onComplete: () => { globeGroup.visible = false; } });
      }
      sClick();
    }
    if (m === "globe") {
      camTarget.set(0, 9.5, 11); lookTarget.copy(GLOBE_POS); camNow.fovTo = 54;
      setHint("globe");
      buildPins();
      globeGroup.visible = true;
      globeGroup.position.y = GLOBE_POS.y - 26;
      gsap.to(globeGroup.position, { y: GLOBE_POS.y, duration: 1.6, ease: "power3.out" });
      sRise();
    }
  }
  $("#btn-fly").addEventListener("click", () => setMode("fly"));
  $("#btn-globe").addEventListener("click", () => setMode("globe"));
  window.__deckMode = setMode;

  /* ============================================================
     FLY — steering, boost, honk
     ============================================================ */
  const pointer = { x: 0, y: 0, nx: 0, ny: 0, down: false, downAt: 0, moved: 0 };
  const seek = new THREE.Vector3(0, 9, -6);
  const gooseVel = new THREE.Vector3();
  let boost = 0, honks = 0;

  addEventListener("pointermove", e => {
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.nx = (e.clientX / innerWidth - 0.5) * 2;
    pointer.ny = (e.clientY / innerHeight - 0.5) * 2;
    if (pointer.down) pointer.moved += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
  });
  addEventListener("pointerdown", e => {
    pointer.down = true; pointer.downAt = performance.now(); pointer.moved = 0;
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.nx = (e.clientX / innerWidth - 0.5) * 2;
    pointer.ny = (e.clientY / innerHeight - 0.5) * 2;
  });
  addEventListener("pointerup", e => {
    const quick = performance.now() - pointer.downAt < 240 && pointer.moved < 14;
    pointer.down = false;
    if (e.target.closest && e.target.closest(".holo-btn, .holo-chip, .holo-panel, #dock")) return;
    if (mode === "fly" && quick) honk();
    if (mode === "globe" && quick) tryPickPin(e.clientX, e.clientY);
  });

  const honkEl = $("#honk");
  function honk() {
    honks++;
    sHonk();
    const p = goose.position.clone().project(camera);
    honkEl.style.left = ((p.x * 0.5 + 0.5) * innerWidth) + "px";
    honkEl.style.top = ((-p.y * 0.5 + 0.5) * innerHeight - 60) + "px";
    honkEl.textContent = honks >= 6 ? "HONK?! 🪿" : "HONK!";
    gsap.fromTo(honkEl, { opacity: 1, y: 0, scale: 0.7 }, { opacity: 0, y: -46, scale: 1.15, duration: 0.9, ease: "power2.out" });
    gsap.fromTo(goose.scale, { y: 0.82 }, { y: 1, duration: 0.5, ease: "elastic.out(1.6, 0.4)" });
    if (honks === 6 && hint) {
      hint.innerHTML = "ok, that's plenty of honking. <b>HOLD</b> to boost instead.";
      setTimeout(() => mode === "fly" && setHint("fly"), 3500);
    }
  }

  /* ============================================================
     GLOBE — drag, hover, pick
     ============================================================ */
  const ray = new THREE.Raycaster();
  const rayV = new THREE.Vector2();
  let spinVel = 0.10, dragging = false, lastDragX = 0, lastDragY = 0, tiltX = 0.12;
  let hoverPin = null, uiLock = false;

  addEventListener("pointerdown", e => {
    if (mode !== "globe" || uiLock) return;
    if (e.target.closest && e.target.closest(".holo-btn, .holo-chip, .holo-panel, #dock")) return;
    dragging = true; lastDragX = e.clientX; lastDragY = e.clientY;
  });
  addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastDragX, dy = e.clientY - lastDragY;
    lastDragX = e.clientX; lastDragY = e.clientY;
    spinVel = dx * 0.0035;
    globeSpin.rotation.y += dx * 0.0042;
    tiltX = THREE.MathUtils.clamp(tiltX + dy * 0.0022, -0.35, 0.5);
  });
  addEventListener("pointerup", () => { dragging = false; });

  const pinCard = $("#pin-card");
  function hidePinCard() { pinCard.hidden = true; hoverPin = null; canvas.style.cursor = ""; }
  function showPinCard(pin, sx, sy) {
    const t = pin.town;
    pinCard.innerHTML =
      '<p class="pc-town">' + esc(t.town) + "</p>" +
      '<p class="pc-meta">' + esc(t.country || "") + " · " + t.entries.length + (t.entries.length === 1 ? " PLACE" : " PLACES") + "</p>" +
      '<p class="pc-tap">' + (isTouch ? "TAP" : "CLICK") + " TO BROWSE</p>";
    pinCard.style.left = sx + "px";
    pinCard.style.top = sy + "px";
    pinCard.hidden = false;
  }
  function pickPin(cx, cy) {
    rayV.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    ray.setFromCamera(rayV, camera);
    const hits = ray.intersectObjects(pins.map(p => p.hit), false);
    return hits.length ? hits[0].object.userData.pin : null;
  }
  function tryPickPin(cx, cy) {
    const pin = pickPin(cx, cy);
    if (pin) { sClick(); openTownPanel(pin.userData.town); }
  }

  const townPanel = $("#town-panel");
  function openTownPanel(t) {
    $("#town-name").textContent = t.town + " · " + (t.country || "");
    $("#town-list").innerHTML = t.entries.map(e =>
      '<button class="town-item" data-id="' + esc(e.id) + '">' +
        '<span class="t-type">' + esc(e.type) + "</span>" +
        '<span class="t-name">' + esc(e.name) + "</span>" +
      "</button>").join("");
    townPanel.hidden = false;
    uiLock = true;
    gsap.fromTo(townPanel, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
  }
  function closeTownPanel() { townPanel.hidden = true; uiLock = false; }
  $("#town-close").addEventListener("click", () => { closeTownPanel(); sClick(); });
  $("#town-list").addEventListener("click", e => {
    const btn = e.target.closest(".town-item");
    if (!btn) return;
    const entry = byId(btn.dataset.id);
    if (entry) { sClick(); closeTownPanel(); openDossier(entry); }
  });

  /* ============================================================
     DOSSIER — live data hologram
     ============================================================ */
  const dossier = $("#dossier");
  function statsOf(e) {
    if (e.stats) return e.stats;
    if (e.linkedSpotId) { const s = byId(e.linkedSpotId); if (s && s.stats) return s.stats; }
    return null;
  }
  function seasonDial(goodMonths) {
    const cx = 60, cy = 60, r0 = 34, r1 = 52;
    let segs = "";
    for (let m = 1; m <= 12; m++) {
      const a0 = ((m - 1) / 12) * Math.PI * 2 - Math.PI / 2 + 0.03;
      const a1 = (m / 12) * Math.PI * 2 - Math.PI / 2 - 0.03;
      const p = (a, r) => (cx + Math.cos(a) * r).toFixed(1) + "," + (cy + Math.sin(a) * r).toFixed(1);
      const on = (goodMonths || []).includes(m);
      const now = m === NOW_M;
      segs += '<path d="M' + p(a0, r0) + " L" + p(a0, r1) + " A" + r1 + "," + r1 + " 0 0 1 " + p(a1, r1) +
        " L" + p(a1, r0) + " A" + r0 + "," + r0 + " 0 0 0 " + p(a0, r0) + 'Z" fill="' +
        (on ? "rgba(110,243,255,0.78)" : "rgba(110,243,255,0.10)") + '"' +
        (now ? ' stroke="#ffc46a" stroke-width="2.4"' : "") + "/>";
    }
    const inSeason = (goodMonths || []).includes(NOW_M);
    segs += '<text x="60" y="56" text-anchor="middle" fill="#f4fbfd" font-family="Space Grotesk, monospace" font-weight="700" font-size="15">' + MONTH_ABBR[NOW_M - 1] + "</text>";
    segs += '<text x="60" y="72" text-anchor="middle" fill="' + (inSeason ? "#6ef3ff" : "rgba(244,251,253,0.45)") + '" font-family="Space Grotesk, monospace" font-size="7.5" letter-spacing="1.5">' + (inSeason ? "IN SEASON" : "OFF SEASON") + "</text>";
    return segs;
  }
  function openDossier(e) {
    $("#ds-type").textContent = e.type + " · live dossier";
    $("#ds-name").textContent = e.name;
    $("#ds-place").textContent = (e.town || "") + (e.country ? " · " + e.country : "");
    $("#ds-tagline").textContent = e.tagline || "";
    $("#ds-season").innerHTML = seasonDial(e.goodMonths);
    const st = statsOf(e);
    const rows = [];
    const mi = NOW_M - 1;
    const num = a => (a && a[mi] != null) ? a[mi] : null;
    if (st) {
      const w = num(st.monthlyWindKn);   if (w != null) rows.push(["wind " + MONTH_ABBR[mi], "≈ " + Math.round(w) + " kn"]);
      const wv = num(st.monthlyWaveM);   if (wv != null) rows.push(["wave " + MONTH_ABBR[mi], wv.toFixed(1) + " m"]);
      const wa = num(st.monthlyWaterC);  if (wa != null) rows.push(["water", Math.round(wa) + " °C"]);
      const ai = num(st.monthlyAirC);    if (ai != null) rows.push(["air", Math.round(ai) + " °C"]);
      if (st.crowd) rows.push(["crowd", String(st.crowd)]);
    }
    const p = e.prices;
    if (p) {
      if (p.fromEUR != null) rows.push(["stay", "€" + p.fromEUR + (p.toEUR ? "–" + p.toEUR : "") + " / night"]);
      else if (p.groupLessonEUR != null) rows.push(["lesson", "from €" + p.groupLessonEUR]);
      else if (p.rentalDayEUR != null) rows.push(["rental", "€" + p.rentalDayEUR + " / day"]);
    }
    $("#ds-stats").innerHTML = rows.slice(0, 5).map(r =>
      '<div class="ds-stat"><span>' + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>").join("") ||
      '<div class="ds-stat"><span>data</span><b>see full story</b></div>';
    $("#ds-levels").innerHTML = (e.levels || []).map(l => "<span>" + esc(l) + "</span>").join("");
    $("#ds-fit").textContent = e.ideaalVoor ? "Ideal for: " + e.ideaalVoor : "";
    $("#ds-open").href = "spot.html?id=" + encodeURIComponent(e.id);
    dossier.hidden = false;
    uiLock = true;
    gsap.fromTo(dossier, { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  }
  function closeDossier() { dossier.hidden = true; uiLock = false; }
  $("#ds-close").addEventListener("click", () => { closeDossier(); sClick(); });
  $("#ds-back").addEventListener("click", () => { closeDossier(); sClick(); });

  /* ============================================================
     FRAME LOOP
     ============================================================ */
  const clock = new THREE.Clock();
  let running = false;

  function update(dt, t) {
    /* water */
    water.material.uniforms.time.value += dt * (0.55 + boost * 0.7);

    /* goose behavior */
    if (birdReady) {
      if (mode === "fly") {
        seek.set(pointer.nx * 13, THREE.MathUtils.clamp(8.6 - pointer.ny * 5.6, 3.6, 13.5), -6 - boost * 5);
      } else if (mode === "globe") {
        const a = t * 0.22;
        seek.set(Math.cos(a) * 16, 7.5 + Math.sin(t * 0.7) * 0.8, -14 + Math.sin(a) * 6);
      } else {
        seek.set(0, 8.6, -6);
      }
      const prev = goose.position.clone();
      goose.position.lerp(seek, Math.min(dt * (mode === "fly" ? 2.6 : 1.1), 1));
      gooseVel.copy(goose.position).sub(prev).divideScalar(Math.max(dt, 0.001));

      const bank = THREE.MathUtils.clamp(-gooseVel.x * 0.075, -0.65, 0.65);
      const pitch = THREE.MathUtils.clamp(-gooseVel.y * 0.05, -0.45, 0.45);
      goose.rotation.z += (bank - goose.rotation.z) * Math.min(dt * 6, 1);
      goose.rotation.x += (pitch - goose.rotation.x) * Math.min(dt * 6, 1);
      goose.rotation.y = THREE.MathUtils.clamp(-gooseVel.x * 0.02, -0.3, 0.3);
      goose.position.y += Math.sin(t * 2.1) * 0.05 * (1 - boost * 0.5);

      /* boost */
      const wantBoost = pointer.down && mode === "fly" && performance.now() - pointer.downAt > 180;
      boost += ((wantBoost ? 1 : 0) - boost) * Math.min(dt * 4, 1);
      if (mixer) { mixer.timeScale = 0.9 + boost * 1.1 + Math.abs(bank) * 0.6; mixer.update(dt); }

      /* spray when low or boosting */
      if (goose.position.y < 5.0 || boost > 0.6) {
        if (Math.random() < (goose.position.y < 5.0 ? 0.5 : 0.25)) {
          spawnSpray(new THREE.Vector3(goose.position.x, Math.max(goose.position.y - 1.2, 0.3), goose.position.z), 2, goose.position.y < 5 ? 2.6 : 1.4);
        }
      }
    }

    /* spray physics */
    for (let i = 0; i < sprayN; i++) {
      if (sprayPos[i * 3 + 1] > 9000) continue;
      sprayVel[i].y -= 9.5 * dt;
      sprayPos[i * 3] += sprayVel[i].x * dt;
      sprayPos[i * 3 + 1] += sprayVel[i].y * dt;
      sprayPos[i * 3 + 2] += sprayVel[i].z * dt;
      if (sprayPos[i * 3 + 1] < 0) sprayPos[i * 3 + 1] = 9999;
    }
    sprayGeo.attributes.position.needsUpdate = true;

    /* globe */
    if (globeGroup.visible) {
      if (!dragging) {
        spinVel += (0.10 - spinVel) * Math.min(dt * 0.5, 1);
        globeSpin.rotation.y += spinVel * dt * (uiLock ? 0.25 : 1);
      }
      globeSpin.rotation.x += (tiltX - globeSpin.rotation.x) * Math.min(dt * 5, 1);
      dust.rotation.y += dt * 0.06;
      const pulse = 1 + Math.sin(t * 2.6) * 0.12;
      pins.forEach((p, i) => {
        const k = p === hoverPin ? 1.7 : pulse + Math.sin(t * 2.6 + i) * 0.06;
        p.glow.scale.setScalar((0.34 + Math.min(p.town.entries.length, 9) * 0.03) * k);
      });
      baseRing.scale.setScalar(1 + Math.sin(t * 1.8) * 0.06);

      /* hover picking (desktop, not while dragging) */
      if (!isTouch && !dragging && !uiLock) {
        const pin = pickPin(pointer.x, pointer.y);
        if (pin !== hoverPin) {
          hoverPin = pin;
          if (pin) { sBlip(); canvas.style.cursor = "pointer"; }
          else { hidePinCard(); }
        }
        if (hoverPin) {
          const wp = hoverPin.getWorldPosition(new THREE.Vector3()).project(camera);
          showPinCard(hoverPin.userData, (wp.x * 0.5 + 0.5) * innerWidth, (-wp.y * 0.5 + 0.5) * innerHeight);
        }
      }
    }

    /* camera */
    const px = isTouch ? 0 : pointer.nx, py = isTouch ? 0 : pointer.ny;
    const fovGoal = (camNow.fovTo || 50) + boost * 9;
    camNow.fov += (fovGoal - camNow.fov) * Math.min(dt * 3.5, 1);
    camera.fov = camNow.fov;
    camera.updateProjectionMatrix();
    const camGoal = new THREE.Vector3(
      camTarget.x + px * (mode === "globe" ? 0.9 : 2.2),
      camTarget.y + py * -0.9,
      camTarget.z
    );
    camera.position.lerp(camGoal, Math.min(dt * 2.8, 1));
    const lookGoal = lookTarget.clone();
    if (mode === "fly" && birdReady) lookGoal.lerp(goose.position, 0.35);
    camera.lookAt(lookGoal);
    camera.rotation.z += (mode === "fly" ? -goose.rotation.z * 0.18 : 0);
  }

  function frame() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    update(dt, clock.elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  /* debug hooks */
  window.__deckRender = function () {
    const dt = 1 / 60;
    clock.getDelta();
    for (let i = 0; i < 3; i++) update(dt, clock.elapsedTime + i * dt);
    camera.position.set(camTarget.x, camTarget.y, camTarget.z);
    update(dt, clock.elapsedTime);
    renderer.render(scene, camera);
    return "rendered mode=" + mode;
  };
  window.__deckDebug = () => JSON.stringify({
    globeVisible: globeGroup.visible,
    globeY: +globeGroup.position.y.toFixed(2),
    globeWorld: globeGroup.getWorldPosition(new THREE.Vector3()).toArray().map(v => +v.toFixed(1)),
    look: lookTarget.toArray().map(v => +v.toFixed(1)),
    cam: camera.position.toArray().map(v => +v.toFixed(1)),
    earthTexOK: !!(earthTex.image && earthTex.image.width)
  });
  window.__deckDossier = id => { const e = byId(id) || WAVEBASE_DATA[0]; if (e) openDossier(e); return e && e.name; };
  window.__deckTown = name => { const t = townGroups().find(t => t.town === name) || townGroups()[0]; if (t) openTownPanel(t); return t && t.town; };
  window.__deckInfo = () => JSON.stringify({
    mode, birdReady, pins: pins.length,
    data: typeof WAVEBASE_DATA !== "undefined" ? WAVEBASE_DATA.length : -1,
    cam: camera.position.toArray().map(v => +v.toFixed(1))
  });

  /* ============================================================
     SIZE + BOOT SEQUENCE
     ============================================================ */
  function resize() {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  addEventListener("resize", resize);
  resize();

  const bootEl = $("#boot");
  const bootLines = $("#boot-lines");
  const LINES = [
    "calibrating horizon — dusk locked",
    "spooling goose · feathers nominal",
    "syncing live catalog…",
    "deck ready. you have the controls."
  ];
  let lineIdx = 0;
  const lineTimer = setInterval(() => {
    if (lineIdx >= LINES.length) { clearInterval(lineTimer); return; }
    const div = document.createElement("div");
    div.textContent = LINES[lineIdx++];
    bootLines.appendChild(div);
  }, 420);

  let started = false;
  function startDeck() {
    if (started) return;
    started = true;
    running = true;
    requestAnimationFrame(frame);
    document.body.classList.add("deck-on");
    gsap.to(bootEl, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut", onComplete: () => bootEl.remove() });
    /* arrival: camera sweeps down while the goose flies in */
    camera.position.set(0, 26, 110);
    gsap.to(camera.position, { x: 0, y: 6.6, z: 25, duration: 3.2, ease: "power3.inOut" });
    if (birdReady) {
      goose.position.set(-46, 13, -30);
      gsap.to(goose.position, { x: 0, y: 8.6, z: -6, duration: 3.4, ease: "power2.inOut" });
    }
    mode = "arrive";
    setTimeout(() => { setMode("fly"); }, 3400);
  }
  manager.onLoad = () => setTimeout(startDeck, Math.max(0, 2300 - performance.now()));
}
