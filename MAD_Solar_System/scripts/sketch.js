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

let planetTextures = [];

// Cursor particles
let cursorParticles = [];
const MAX_CURSOR_PARTICLES = 60;

let globalBrightness = 1.0;
let globalColorTint = null;

// Image cycling
let currentImageIndex = 0;
let lastImageChange = 0;
const IMAGE_CHANGE_INTERVAL = 1000; // Change image every second

// ---------------------- FUNÇÕES GLOBAIS ----------------------
function autoAdjustStars() {
  const fps = frameRate();

  // Se o FPS está muito abaixo, remover algumas estrelas
  if (fps < TARGET_FPS * 0.8 && stars.length > STAR_MIN) {
    stars.splice(0, 20); // remove 20 por frame
  }

  // Se o FPS está ótimo, adicionar mais estrelas
  if (fps > TARGET_FPS * 0.95 && stars.length < STAR_MAX) {
    for (let i = 0; i < 30; i++) {
      // adiciona 30 por frame
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

  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  let sizes = [50, 55, 50, 70, 55, 60, 52, 75, 58, 90];
  for (let i = 0; i < NUM_PLANETS; i++) {
    planets.push(
      new Planet(200 + i * 100, sizes[i], random(0.002, 0.008), yearData[i], i)
    );
  }

  setTimeout(() => {
    if (spaceSound && !spaceSound.isPlaying()) {
      spaceSound.loop();
      spaceSound.setVolume(0.5);
    }
  }, 500);

  soundButton = document.getElementById("sound-toggle");
  if (soundButton) soundButton.addEventListener("click", toggleSound);

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

  setupSoundClassifier();
  setupFaceApi();
  setupPoseNet();
}

function drawStars() {
  push();
  noStroke();
  fill(255);

  for (let s of stars) {
    push();
    translate(s.x, s.y, s.z);
    sphere(1.5, 6, 4);
    pop();
  }

  pop();
}

function draw() {
  background(5, 5, 15);
  ambientLight(30); // luz ambiente suave
  pointLight(
    255,
    235,
    180, // cor quente do Sol
    0,
    0,
    0 // posição (mesmo no sol)
  );

  // Sound
  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.1);
    } else {
      let d = dist(camX, camY, camZ, 0, 0, 0);
      let v = map(d, 400, 2800, 0.8, 0.05, true);
      spaceSound.setVolume(v);
    }
  }

  // HOVER DETECTION
  if (!isZoomedIn) {
    hoveredPlanet = null;
    for (let p of planets) {
      let px = cos(p.angle) * p.orbitRadius;
      let py = 0;
      let pz = sin(p.angle) * p.orbitRadius;

      let cd = dist(camX, camY, camZ, 0, 0, 0);
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
  } else {
    hoveredPlanet = null;
  }

  // Camera
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

  // Stars
  if (!isZoomedIn) {
    push();
    noStroke();
    fill(255);
    pop();
  }

  autoAdjustStars();
  drawStars();
  // Lighting

  directionalLight(150, 150, 170, 0.4, -0.3, -0.2);

  // Sun
  if (!isZoomedIn) {
    push();
    noStroke();
    ambientMaterial(255, 200, 120); // base quente, sem explosão
    emissiveMaterial(80, 60, 20);
    sphere(SUN_RADIUS, 48, 36);
    pop();
  }

  // Orbits
  if (!isZoomedIn) {
    for (let p of planets) {
      p.drawOrbit();
    }
  }

  // Planets
  for (let p of planets) {
    if (!isPaused) p.update();
    if (isZoomedIn) {
      if (p === selectedPlanet) p.display();
    } else {
      p.display();
    }
  }

  // Cursor particles
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const ps = cursorParticles[i];
    ps.update();
    ps.drawScreen();
    if (ps.isDead()) cursorParticles.splice(i, 1);
  }

  // Global effects
  globalBrightness = lerp(globalBrightness, 1.0, 0.05);
  if (globalColorTint) {
    let r = lerp(red(globalColorTint), 255, 0.05);
    let g = lerp(green(globalColorTint), 255, 0.05);
    let b = lerp(blue(globalColorTint), 255, 0.05);
    if (abs(r - 255) < 5 && abs(g - 255) < 5 && abs(b - 255) < 5) {
      globalColorTint = null;
    } else {
      globalColorTint = color(r, g, b);
    }
  }

  // TOOLTIP HOVER
  if (hoveredPlanet && !isZoomedIn) {
    drawHoverTooltip();
  }

  // Webcam
  if (video && video.loadedmetadata) {
    push();
    resetMatrix();
    translate(-width / 2 + 90, height / 2 - 100);
    noStroke();
    texture(video);
    rect(0, 0, 160, 120);
    pop();
  }
}

function drawHoverTooltip() {
  push();
  resetMatrix();

  let tx = mouseX - width / 2;
  let ty = mouseY - height / 2 - 60;
  translate(tx, ty);

  // Background colorido
  fill(
    hoveredPlanet.yearData.color.r,
    hoveredPlanet.yearData.color.g,
    hoveredPlanet.yearData.color.b,
    230
  );
  stroke(255);
  strokeWeight(3);
  rectMode(CENTER);
  rect(0, 0, 180, 70, 12);

  // Ano
  noStroke();
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  text(hoveredPlanet.yearData.year, 0, -12);

  // Tema
  textSize(14);
  fill(255, 255, 255, 220);
  text(hoveredPlanet.yearData.theme, 0, 15);

  pop();
}

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

function showPlanetInfo(planet) {
  const info = document.getElementById("planet-info");
  const title = document.getElementById("planet-title");
  const desc = document.getElementById("planet-description");

  if (info && title && desc) {
    title.textContent = `${planet.yearData.year} — ${planet.yearData.theme}`;
    desc.textContent = planet.yearData.details;
    info.classList.remove("hidden");
  }
}

function hidePlanetInfo() {
  const info = document.getElementById("planet-info");
  if (info) info.classList.add("hidden");
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

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.querySelector("#sound-toggle .icon");

  if (soundEnabled) {
    if (spaceSound && !spaceSound.isPlaying()) spaceSound.loop();
    spaceSound.setVolume(0.5);
    if (soundButton) {
      const newIcon = document.createElement("i");
      newIcon.setAttribute("data-lucide", "volume-2");
      newIcon.className = "icon";
      newIcon.style.width = "1.2em";
      newIcon.style.height = "1.2em";
      newIcon.style.color = "white";
      icon.replaceWith(newIcon);
      lucide.createIcons();
    }
  } else {
    spaceSound.setVolume(0);
    if (soundButton) {
      const newIcon = document.createElement("i");
      newIcon.setAttribute("data-lucide", "volume-x");
      newIcon.className = "icon";
      newIcon.style.width = "1.2em";
      newIcon.style.height = "1.2em";
      newIcon.style.color = "white";
      icon.replaceWith(newIcon);
      lucide.createIcons();
    }
  }
}

function mouseMoved() {
  // Criar partículas do cursor
  if (cursorParticles.length < MAX_CURSOR_PARTICLES) {
    const vx = random(-2, 2) + (pmouseX - mouseX) * 0.05;
    const vy = random(-2, 2) + (pmouseY - mouseY) * 0.05;
    cursorParticles.push(
      new CursorParticle(mouseX, mouseY, -vx * 1.4, -vy * 1.4)
    );
  }
}

function touchMoved() {
  mouseMoved();
  return false;
}