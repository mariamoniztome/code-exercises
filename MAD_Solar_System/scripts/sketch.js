// Textura dos planetas
let planetTexture;

// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let soundButton;

// Estrelas
let stars = [];
const NUM_STARS = 300;
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

// Cursor shooting-star effect
let cursorParticles = [];
const MAX_CURSOR_PARTICLES = 80;

// ML5 Variables
let soundClassifier;
let faceApi;
let video;
let detections = [];
let poseNet;
let poses = [];

// Global atmosphere effects
let globalBrightness = 1.0;
let globalColorTint = null;

class CursorParticle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 40 + floor(random(0, 40));
    this.size = random(4, 12);
    this.hue = random(180, 255);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.94;
    this.vy *= 0.94;
    this.vy += 0.02;
    this.life--;
  }

  drawScreen() {
    push();
    resetMatrix();
    translate(-width / 2, -height / 2);
    blendMode(ADD);
    noStroke();
    const alpha = map(this.life, 0, 80, 0, 255);
    fill(255, 255, 255, alpha);
    ellipse(this.x, this.y, this.size);
    fill(255, 255, 255, alpha * 0.6);
    const tx = this.x - this.vx * 3;
    const ty = this.y - this.vy * 3;
    ellipse(tx, ty, max(1, this.size * 0.6));
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// Planet class
class Planet {
  constructor(orbitRadius, radius, speed, col, type) {
    this.orbitRadius = orbitRadius;
    this.radius = radius;
    this.speed = speed;
    this.col = col;
    this.type = type;
    this.angle = random(TWO_PI);
  }

  update() {
    if (!isPaused) {
      this.angle += this.speed;
    }
  }

  drawOrbit() {
    // Desenhar linha da órbita
    push();
    noFill();
    stroke(60, 70, 90, 100);
    strokeWeight(1);
    rotateX(PI / 2);
    circle(0, 0, this.orbitRadius * 2);
    pop();
  }

  display() {
    push();
    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;
    translate(x, 0, z);

    // Apply global effects
    if (globalColorTint) {
      tint(globalColorTint);
    }

    // Highlight if hovered
    if (this === hoveredPlanet) {
      push();
      noFill();
      stroke(255, 255, 0);
      strokeWeight(3);
      sphere(this.radius * 1.2);
      pop();
    }

    // Draw planet based on type
    switch (this.type) {
      case 0: // Lava
        push();
        texture(planetTextures[0]);
        emissiveMaterial(255 * globalBrightness, 100 * globalBrightness, 0);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 1: // Ringed Giant
        push();
        texture(planetTextures[1]);
        sphere(this.radius, 80, 60);
        pop();
        // Rings
        push();
        rotateX(PI / 4);
        noFill();
        strokeWeight(8);
        stroke(150 * globalBrightness, 100 * globalBrightness, 200 * globalBrightness, 150);
        circle(0, 0, this.radius * 2.5);
        pop();
        break;

      case 2: // Rainbow
        push();
        texture(planetTextures[2]);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 3: // Crystal
        push();
        texture(planetTextures[3]);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 4: // Ocean
        push();
        texture(planetTextures[4]);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 5: // Electric
        push();
        texture(planetTextures[5]);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 6: // Nebula
        push();
        texture(planetTextures[6]);
        emissiveMaterial(150 * globalBrightness, 100 * globalBrightness, 200 * globalBrightness);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 7: // Psychedelic
        push();
        texture(planetTextures[7]);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 8: // Shadow
        push();
        texture(planetTextures[8]);
        ambientMaterial(20 * globalBrightness, 15 * globalBrightness, 40 * globalBrightness);
        sphere(this.radius, 80, 60);
        pop();
        break;

      case 9: // Fragmented
        push();
        texture(planetTextures[9]);
        sphere(this.radius * 0.6, 32, 24);
        pop();
        break;
    }
    pop();
  }
}

// Basic planet info for the UI (titles + descriptions)
const planetInfos = [
  {
    title: "Lava World",
    desc: "A glowing planet of molten rock and fierce energy.",
  },
  { title: "Ringed Giant", desc: "A majestic world with colorful rings." },
  { title: "Rainbow Orb", desc: "A shimmering planet with many tiny moons." },
  {
    title: "Crystal Spire",
    desc: "Prismatic crystals float around this world.",
  },
  { title: "Blue Ocean", desc: "Vast seas with glowing waves and foam." },
  {
    title: "Electric Planet",
    desc: "Sparks and lightning dance across the surface.",
  },
  {
    title: "Nebula Core",
    desc: "A cloudy planet veiled in gas and soft light.",
  },
  { title: "Psychedelia", desc: "A world of swirling psychedelic colors." },
  { title: "Shadow", desc: "Dark landscapes and subtle mysterious glows." },
  { title: "Fragmented", desc: "Broken shards orbit a shrunken core." },
];

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
  targetZ = pz + p.radius * 2 + 200;

  showPlanetInfo(p);
  updatePlanetListSelection(idx);
  
  console.log(`✨ Planeta ${idx + 1} selecionado!`);
}

function unselectPlanet() {
  selectedPlanet = null;
  isZoomedIn = false;
  targetX = 0;
  targetY = -800;
  targetZ = 2000;
  hidePlanetInfo();
  updatePlanetListSelection(-1);
  
  console.log("🔙 Voltando à vista geral");
}

function updatePlanetListSelection(selectedIdx) {
  const items = document.querySelectorAll(".planet-item");
  items.forEach((btn) => {
    const idx = parseInt(btn.getAttribute("data-index"));
    if (idx === selectedIdx) btn.classList.add("selected");
    else btn.classList.remove("selected");
  });
}

function preload() {
  spaceSound = loadSound("assets/sounds/space.mp3");
  planetTextures[0] = loadImage(
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJzZDd6ZTExd3l0NW9iMnh3aDR3dnVoNHg5MWwwNXJhZm85NGowdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PidSzdflbzd1sksap9/giphy.gif"
  );
  planetTextures[1] = loadImage(
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTNtajRpZXMycmVqazk5b3p0eDBkNXI0YWRxNjlsdTR3YWZycXhubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26AHL0EG33tA1geoE/giphy.gif"
  );
  planetTextures[2] = loadImage(
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW83b2R0MHp0d29iMjEzaTk5bjA2d3gyOHo1YzhhcnE4b3d0NDM3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l5XVHJM3A4WSLrZY33/giphy.gif"
  );
  planetTextures[3] = loadImage(
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGtxNmF5dm5neGt1NjQ0am5xODk4dWxiZnd4bGg3ZWtmeXh0Zzl2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a01ExCirWIhB60rvbT/giphy.gif"
  );
  planetTextures[4] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTg1MXM0a2U4c3B4dWIxMnFxN3I5b3V6OHBjcm16em1nMGJ0NDA3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q2koSsz3l42ZIiboyW/giphy.gif"
  );
  planetTextures[5] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJyM3RzNTdjbGIxZzlzbXQwbnhraWU5eWZkMHFwbDh2NGxsZ2hvbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gjmSvyk6x7MTn63sN0/giphy.gif"
  );
  planetTextures[6] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzIzeW10MTZ2OGo4NW80M2g2ZmQwaGhlb3ptcDdjem1rN2I1bjJuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bLdgTj2jCKe9Wf94Km/giphy.gif"
  );
  planetTextures[7] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHpocGY2cHozNmNnNWttYjQyYTZ1NnFtd2dldTJvMnNtZDZ2dHBjNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kPfuCRO04fAiqrHrTV/giphy.gif"
  );
  planetTextures[8] = loadImage(
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnJmcGhmeGhxeml2NWdheGczaWx0c2Z6Zm8xNGU0YjMyNGc1b2JneSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3q3SUqPnxZGQpMNcjc/giphy.gif"
  );
  planetTextures[9] = loadImage(
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnV1ZmkxMGYyeXV4cTNhYmZtcGZmeWYxMHdoZmN3YnRsNGdha2FvNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d569ZaUubJSWwnVGDY/giphy.gif"
  );
}

function setup() {
  frameRate(60);
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  camera(0, -800, 2000);

  textureMode(NORMAL);
  textureWrap(REPEAT, REPEAT);
  noCursor();

  // Generate stars
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  let sizes = [30, 45, 32, 60, 35, 50, 33, 65, 48, 80];

  // Create planets
  for (let i = 0; i < NUM_PLANETS; i++) {
    let orbitRadius = 200 + i * 100;
    let planetRadius = sizes[i];
    let speed = random(0.002, 0.008);
    let c = color(random(80, 255), random(80, 255), random(80, 255));
    planets.push(new Planet(orbitRadius, planetRadius, speed, c, i));
  }

  // Start sound
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  // Sound button
  soundButton = document.getElementById("sound-toggle");
  if (soundButton) {
    soundButton.addEventListener("click", toggleSound);
  }

  // Planet list buttons
  const items = document.querySelectorAll(".planet-item");
  items.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(btn.getAttribute("data-index"));
      selectPlanetByIndex(idx);
    });
  });

  // Keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "Escape") {
      if (isZoomedIn) unselectPlanet();
    } else if (e.code === "Space") {
      isPaused = !isPaused;
      console.log(isPaused ? "⏸️ Pausado" : "▶️ A reproduzir");
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

  // Initialize ML5 features
  setupSoundClassifier();
  setupFaceApi();
  setupPoseNet();
}

function draw() {
  background(0)

  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.1); // volume mais baixo no zoom
    } else {
      let distFromCenter = dist(camX, camY, camZ, 0, 0, 0);
      let vol = map(distFromCenter, 400, 2800, 0.8, 0.05, true);
      spaceSound.setVolume(vol);
    }
  }

  // Detetar planeta sob o rato
  if (!isZoomedIn) {
    hoveredPlanet = null;
    let minDist = Infinity;

    for (let p of planets) {
      let px = cos(p.angle) * p.orbitRadius;
      let pz = sin(p.angle) * p.orbitRadius;
      let sx = width / 2 + px * 0.5;
      let sy = height / 2 + pz * 0.5;
      let d = dist(mouseX, mouseY, sx, sy);

      if (d < 120 && d < minDist) {
        minDist = d;
        hoveredPlanet = p;
      }
    }
  } else {
    hoveredPlanet = null;
  }

  // câmara segue o planeta quando está em zoom
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;

    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.radius * 2 + 200;
  }

  // movimento suave da câmara
  camX = lerp(camX, targetX, 0.05);
  camY = lerp(camY, targetY, 0.05);
  camZ = lerp(camZ, targetZ, 0.05);

  // câmara sempre olha para o alvo
  if (isZoomedIn && selectedPlanet) {
    let px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    let pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    camera(camX, camY, camZ, px, 0, pz, 0, 1, 0);
  } else {
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  }

  // campo de estrelas - ESCONDER no zoom
  if (!isZoomedIn) {
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
 
 ambientLight(60, 60, 80);
 directionalLight(255, 255, 255, -0.3, 1, 0.1);
 directionalLight(150, 150, 170, 0.4, -0.3, -0.2);

  
  // sol - ESCONDER no zoom
  if (!isZoomedIn) {
    push();
    noStroke();
    emissiveMaterial(255, 210, 80);
    sphere(SUN_RADIUS, 48, 36);
    pop();
  }

  // Desenhar órbitas - ESCONDER no zoom
  if (!isZoomedIn) {
    for (let p of planets) {
      p.drawOrbit();
    }
  }

  // planetas - mostrar APENAS o selecionado no zoom
  for (let p of planets) {
    if (!isPaused) p.update();

    if (isZoomedIn) {
      // No zoom: renderizar APENAS o planeta selecionado
      if (p === selectedPlanet) {
        p.display();
      }
    } else {
      // Fora do zoom: mostrar todos
      p.display();
    }
  }

  // Update and draw cursor particles (screen-space overlay)
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const ps = cursorParticles[i];
    ps.update();
    ps.drawScreen();
    if (ps.isDead()) cursorParticles.splice(i, 1);
  }

  // Lerp global effects back to normal (for ML5 face emotions)
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
}

function mousePressed() {
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  if (!isZoomedIn && hoveredPlanet) {
    // Click num planeta quando não está em zoom
    selectedPlanet = hoveredPlanet;
    isZoomedIn = true;
    
    const px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    const pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.radius * 2 + 200;
    
    showPlanetInfo(selectedPlanet);
    
    // Find index for updatePlanetListSelection
    const idx = planets.indexOf(selectedPlanet);
    updatePlanetListSelection(idx);
  } else if (isZoomedIn) {
    // Click para sair do zoom
    unselectPlanet();
  }
}

function showPlanetInfo(planet) {
  const infoDiv = document.getElementById("planet-info");
  const titleElement = document.getElementById("planet-title");
  const descElement = document.getElementById("planet-description");

  if (infoDiv && titleElement && descElement) {
    const info = planetInfos[planet.type] || {};
    titleElement.textContent = info.title || `Planet ${planet.type + 1}`;
    descElement.textContent = info.desc || "Explora o universo da criatividade digital";
    infoDiv.classList.remove("hidden");
  }
}

function hidePlanetInfo() {
  const infoDiv = document.getElementById("planet-info");
  if (infoDiv) {
    infoDiv.classList.add("hidden");
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
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

  if (soundEnabled) {
    if (spaceSound && !spaceSound.isPlaying()) {
      spaceSound.loop();
    }
    spaceSound.setVolume(0.5);
    if (soundButton) soundButton.textContent = "🔊";
  } else {
    spaceSound.setVolume(0);
    if (soundButton) soundButton.textContent = "🔇";
  }
}

function mouseMoved() {
  for (let i = 0; i < 2; i++) {
    if (cursorParticles.length >= MAX_CURSOR_PARTICLES) break;
    const vx = random(-2, 2) + (pmouseX - mouseX) * 0.05;
    const vy = random(-2, 2) + (pmouseY - mouseY) * 0.05;
    const p = new CursorParticle(mouseX, mouseY, -vx * 1.4, -vy * 1.4);
    cursorParticles.push(p);
  }
}

function touchMoved() {
  mouseMoved();
  return false;
}

// ==================== ML5.js SOUND CLASSIFIER ====================
function setupSoundClassifier() {
  if (typeof ml5 === "undefined") {
    console.warn("⚠️ ml5.js não carregado - Sound Classifier desativado");
    return;
  }

  console.log("🎤 A inicializar Sound Classifier...");
  const options = { probabilityThreshold: 0.85 };
  soundClassifier = ml5.soundClassifier("SpeechCommands18w", options, soundModelReady);
}

function soundModelReady() {
  console.log("✅ Sound Model pronto! Diz um número (0-9) ou 'stop'/'go'");
  soundClassifier.classify(gotCommand);
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  const label = results[0].label;
  const confidence = results[0].confidence;

  // Only act on high confidence
  if (confidence < 0.85) return;

  console.log(`🎤 Comando: "${label}" (${(confidence * 100).toFixed(0)}%)`);

  // Numbers 0-9 to select planets
  if (label === "zero") selectPlanetByIndex(9);
  else if (label === "one") selectPlanetByIndex(0);
  else if (label === "two") selectPlanetByIndex(1);
  else if (label === "three") selectPlanetByIndex(2);
  else if (label === "four") selectPlanetByIndex(3);
  else if (label === "five") selectPlanetByIndex(4);
  else if (label === "six") selectPlanetByIndex(5);
  else if (label === "seven") selectPlanetByIndex(6);
  else if (label === "eight") selectPlanetByIndex(7);
  else if (label === "nine") selectPlanetByIndex(8);
  // Special commands
  else if (label === "stop") unselectPlanet();
  else if (label === "go") {
    isPaused = !isPaused;
    console.log(isPaused ? "⏸️ Pausado por voz" : "▶️ A reproduzir por voz");
  }
}

// ==================== ML5.js FACE API ====================
function setupFaceApi() {
  if (typeof ml5 === "undefined") {
    console.warn("⚠️ ml5.js não carregado - Face API desativado");
    return;
  }

  console.log("😊 A inicializar Face API...");
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceApi = ml5.faceApi(
    video,
    { withLandmarks: true, withDescriptors: false },
    faceModelReady
  );
}

function faceModelReady() {
  console.log("✅ Face API pronto! Mostra expressões faciais");
  faceApi.detect(gotFace);
}

function gotFace(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  if (!result || result.length === 0) {
    faceApi.detect(gotFace);
    return;
  }

  detections = result;
  const expressions = result[0].expressions;

  // Find dominant emotion
  let maxEmotion = "";
  let maxValue = 0;
  for (let emotion in expressions) {
    if (expressions[emotion] > maxValue) {
      maxValue = expressions[emotion];
      maxEmotion = emotion;
    }
  }

  // Change atmosphere based on emotion
  if (maxValue > 0.7) {
    console.log(`😊 Emoção detetada: ${maxEmotion} (${(maxValue * 100).toFixed(0)}%)`);
    
    switch (maxEmotion) {
      case "happy":
        globalBrightness = 1.8;
        globalColorTint = color(255, 255, 200);
        break;
      case "sad":
        globalBrightness = 0.4;
        globalColorTint = color(100, 100, 150);
        break;
      case "angry":
        globalBrightness = 1.2;
        globalColorTint = color(255, 100, 100);
        break;
      case "surprised":
        globalBrightness = 2.0;
        globalColorTint = color(255, 255, 255);
        break;
    }
  }

  faceApi.detect(gotFace);
}

// ==================== ML5.js POSENET ====================
function setupPoseNet() {
  if (typeof ml5 === "undefined" || !video) {
    console.warn("⚠️ ml5.js ou video não disponível - PoseNet desativado");
    return;
  }

  console.log("🏃 A inicializar PoseNet...");
  poseNet = ml5.poseNet(video, poseModelReady);
  poseNet.on("pose", gotPoses);
}

function poseModelReady() {
  console.log("✅ PoseNet pronto! Move-te para controlar a câmara");
}

function gotPoses(results) {
  if (results.length === 0) return;
  poses = results;

  const nose = results[0].pose.nose;

  // Map nose position to camera rotation
  const noseX = map(nose.x, 0, 640, -200, 200);
  const noseY = map(nose.y, 0, 480, -200, 200);

  // Move camera smoothly when not zoomed
  if (!isZoomedIn) {
    targetX = lerp(targetX, noseX, 0.05);
    targetY = lerp(targetY, noseY - 800, 0.05);
  }
}