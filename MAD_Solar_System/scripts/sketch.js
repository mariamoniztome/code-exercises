// ===============================
// MAD SOLAR SYSTEM — sketch.js
// ===============================

// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let soundButton;

// Estrelas
let stars = [];
let TARGET_FPS = 60;
const STAR_MIN = 500;
const STAR_MAX = 5000;
const NUM_STARS = 5000;
const STAR_FIELD_SIZE = 3000;

// Sol
const SUN_RADIUS = 80;
// solarColor é global para também ser usado visualmente nos planetas
let solarColor = { r: 255, g: 210, b: 80 };

// Planetas
let planets = [];
const NUM_PLANETS = 10;
let selectedPlanet = null;
let hoveredPlanet = null;
let isZoomedIn = false;
let isPaused = false;

// Câmara
let camX = 0,
  camY = -800,
  camZ = 2000;
let targetX = 0,
  targetY = -800,
  targetZ = 2000;

// Texturas dos planetas
let planetTextures = [];

// ---------------------- FUNÇÕES GLOBAIS ----------------------

function autoAdjustStars() {
  const fps = frameRate();

  if (fps < TARGET_FPS * 0.8 && stars.length > STAR_MIN) {
    stars.splice(0, 20);
  }

  if (fps > TARGET_FPS * 0.95 && stars.length < STAR_MAX) {
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
        y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
        z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      });
    }
  }
}

function selectPlanetByIndex(idx) {
  if (idx < 0 || idx >= planets.length) return;
  const p = planets[idx];
  if (isZoomedIn && selectedPlanet === p) {
    unselectPlanet();
    return;
  }
  selectedPlanet = p;
  isZoomedIn = true;
  const px = cos(p.angle) * p.orbitRadius;
  const pz = sin(p.angle) * p.orbitRadius;
  targetX = px;
  targetY = 0;
  targetZ = pz + p.size * 1.5 + 150;
  showPlanetInfo(p);
  console.log(`✨ ${p.yearData.year} selecionado!`);
}

function unselectPlanet() {
  selectedPlanet = null;
  isZoomedIn = false;
  targetX = 0;
  targetY = -800;
  targetZ = 2000;
  hidePlanetInfo();
  console.log("🔙 Voltando");
}

// ---------------------- PRELOAD & SETUP ----------------------

function preload() {
  spaceSound = loadSound("assets/sounds/space.mp3");

  const urls = [
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJzZDd6ZTExd3l0NW9iMnh3aDR3dnVoNHg5MWwwNXJhZm85NGowdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PidSzdflbzd1sksap9/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTNtajRpZXMycmVqazk5b3p0eDBkNXI0YWRxNjlsdTR3YWZycXhubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26AHL0EG33tA1geoE/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW83b2R0MHp0d29iMjEzaTk5bjA2d3gyOHo1YzhhcnE4b3d0NDM3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l5XVHJM3A4WSLrZY33/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGtxNmF5dm5neGt1NjQ0am5xODk4dWxiZnd4bGg3ZWtmeXh0Zzl2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a01ExCirWIhB60rvbT/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTg1MXM0a2U4c3B4dWIxMnFxN3I5b3V6OHBjcm16em1nMGJ0NDA3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q2koSsz3l42ZIiboyW/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJyM3RzNTdjbGIxZzlzbXQwbnhraWU5eWZkMHFwbDh2NGxsZ2hvbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gjmSvyk6x7MTn63sN0/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzIzeW10MTZ2OGo4NW80M2g2ZmQwaGhlb3ptcDdjem1rN2I1bjJuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bLdgTj2jCKe9Wf94Km/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHpocGY2cHozNmNnNWttYjQyYTZ1NnFtd2dldTJvMnNtZDZ2dHBjNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kPfuCRO04fAiqrHrTV/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnJmcGhmeGhxeml2NWdheGczaWx0c2Z6Zm8xNGU0YjMyNGc1b2JneSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3q3SUqPnxZGQpMNcjc/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnV1ZmkxMGYyeXV4cTNhYmZtcGZmeWYxMHdoZmN3YnRsNGdha2FvNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d569ZaUubJSWwnVGDY/giphy.gif",
  ];

  urls.forEach((url, i) => {
    planetTextures[i] = loadImage(
      url,
      () => {},
      () => {
        console.warn(
          `Falha ao carregar textura do planeta ${i} de URL: ${url}`
        );
      }
    );
  });
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera(0, -800, 2000);
  textureMode(NORMAL);
  textureWrap(REPEAT, REPEAT);

  // Vídeo para PoseNet (o ml5.js já declara "let video")
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Estrelas
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  // Planetas
  let sizes = [50, 55, 50, 70, 55, 60, 52, 75, 58, 90];
  for (let i = 0; i < NUM_PLANETS; i++) {
    planets.push(
      new Planet(200 + i * 100, sizes[i], random(0.002, 0.006), yearData[i], i)
    );
  }

  // Som
  setTimeout(() => {
    if (spaceSound && !spaceSound.isPlaying()) {
      spaceSound.loop();
      spaceSound.setVolume(0.5);
    }
  }, 500);

  soundButton = document.getElementById("sound-toggle");
  if (soundButton) soundButton.addEventListener("click", toggleSound);

  // Atalhos de teclado
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "Escape") {
      if (isZoomedIn) unselectPlanet();
    } else if (e.code === "Space") {
      isPaused = !isPaused;
      e.preventDefault();
    } else if (e.key === "h" || e.key === "H") {
      const p = document.getElementById("shortcuts");
      if (p) p.classList.toggle("hidden");
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      if (selectedPlanet) {
        let idx = planets.indexOf(selectedPlanet);
        idx = (idx - 1 + NUM_PLANETS) % NUM_PLANETS;
        selectPlanetByIndex(idx);
      }
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      if (selectedPlanet) {
        let idx = planets.indexOf(selectedPlanet);
        idx = (idx + 1) % NUM_PLANETS;
        selectPlanetByIndex(idx);
      }
      e.preventDefault();
    } else {
      const num = parseInt(e.key);
      if (!isNaN(num)) {
        let idx = num - 1;
        if (num === 0) idx = 9;
        if (idx >= 0 && idx < NUM_PLANETS) selectPlanetByIndex(idx);
      }
    }
  });

  // ML5
  setupPoseNet();
  setupSoundClassifier();
}

// ---------------------- DRAW HELPERS ----------------------

function drawStars() {
  push();
  noStroke();

  // Estrelas brilham mais à noite
  const starBrightness = map(1 - sunProgress, 0, 1, 40, 255);
  fill(starBrightness);

  for (let s of stars) {
    push();
    translate(s.x, s.y, s.z);
    sphere(1.5, 6, 4);
    pop();
  }

  pop();
}

// ---------------------- MAIN DRAW ----------------------

function draw() {
  // 1) Atualiza ciclo solar pela mão (PoseNet em ml5.js)
  updateSunCycle();

  // 2) Fundo do espaço
  background(5, 5, 15);

  // 3) Cor do sol (noite → sunset → dia)
  const nightColor = { r: 40, g: 60, b: 120 };   // azul frio
  const sunsetColor = { r: 255, g: 140, b: 60 }; // laranja quente
  const dayColor = { r: 255, g: 210, b: 80 };    // amarelo sol

  if (sunProgress < 0.5) {
    // noite → pôr do sol
    const t = sunProgress * 2;
    solarColor = {
      r: lerp(nightColor.r, sunsetColor.r, t),
      g: lerp(nightColor.g, sunsetColor.g, t),
      b: lerp(nightColor.b, sunsetColor.b, t),
    };
  } else {
    // pôr do sol → dia
    const t = (sunProgress - 0.5) * 2;
    solarColor = {
      r: lerp(sunsetColor.r, dayColor.r, t),
      g: lerp(sunsetColor.g, dayColor.g, t),
      b: lerp(sunsetColor.b, dayColor.b, t),
    };
  }

  // 4) Luz solar dinâmica (apenas p5 3D real)
  let intensity = lerp(0.3, 2.5, sunProgress); // bem forte de dia
  let lr = solarColor.r * intensity;
  let lg = solarColor.g * intensity;
  let lb = solarColor.b * intensity;

  // Luz ambiente muito suave
  ambientLight(10);

  // Luz direcional (como um sol ao fundo)
  directionalLight(
    lr,
    lg,
    lb,
    0.5, -0.3, -0.4
  );

  // Luz pontual forte na posição do Sol (centro)
  pointLight(
    lr * 2,
    lg * 2,
    lb * 2,
    0, 0, 0
  );

  // 5) Som dinâmico
  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.1);
    } else {
      let d = dist(camX, camY, camZ, 0, 0, 0);
      let v = map(d, 400, 2800, 0.8, 0.05, true);
      spaceSound.setVolume(v);
    }
  }

  // 6) Hover detection
  if (!isZoomedIn) {
    hoveredPlanet = null;
    for (let p of planets) {
      let px = cos(p.angle) * p.orbitRadius;
      let py = 0;
      let pz = sin(p.angle) * p.orbitRadius;

      let pf = 1000 / (1000 + pz - camZ);
      let sx = width / 2 + (px - camX) * pf;
      let sy = height / 2 + (py - camY) * pf;

      let d = dist(mouseX, mouseY, sx, sy);
      let ha = p.size * pf * 1.5;

      if (d < ha) {
        hoveredPlanet = p;
        break;
      }
    }
  } else hoveredPlanet = null;

  // 7) Camera tracking
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.size * 1.5 + 150;
  }

  camX = lerp(camX, targetX, 0.05);
  camY = lerp(camY, targetY, 0.05);
  camZ = lerp(camZ, targetZ, 0.05);

  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    camera(camX, camY, camZ, px, 0, pz, 0, 1, 0);
  } else {
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  }

  // 8) Estrelas
  autoAdjustStars();
  drawStars();

  // 9) Sol 3D (sem glow 2D)
  if (!isZoomedIn) {
    push();
    noStroke();

    // Cor base do sol
    ambientMaterial(solarColor.r, solarColor.g, solarColor.b);

    // Emissão forte — faz o sol "queimar" a retina 😄
    emissiveMaterial(
      solarColor.r * 4,
      solarColor.g * 4,
      solarColor.b * 4
    );

    sphere(SUN_RADIUS, 64, 48);
    pop();
  }

  // 10) Órbitas
  if (!isZoomedIn) {
    for (let p of planets) {
      p.drawOrbit();
    }
  }

  // 11) Planetas
  for (let p of planets) {
    if (!isPaused) p.update();
    if (!isZoomedIn || p === selectedPlanet) {
      p.display();
    }
  }

  // 12) Tooltip hover
  if (hoveredPlanet && !isZoomedIn) {
    drawHoverTooltip();
  }
}

// ---------------------- INPUT ----------------------

function mousePressed() {
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  if (!isZoomedIn && hoveredPlanet) {
    selectedPlanet = hoveredPlanet;
    isZoomedIn = true;
    const px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    const pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.size * 1.5 + 150;
    showPlanetInfo(selectedPlanet);
  } else if (isZoomedIn) {
    unselectPlanet();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseWheel(event) {
  if (!isZoomedIn) {
    targetZ += event.delta * 2;
    targetZ = constrain(targetZ, 600, 5000);
  }
  return false;
}