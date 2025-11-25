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
let solarColor = { r: 251, g: 217, b: 70 };
let sunHue = 30; // 0–360
let sunBright = 1.0; // 0–1

// Party Mode
let partyMode = false;
let partyHue = 0;
let showPartyModal = true;
let partyColors = [
  {r: 255, g: 0, b: 0},      // Red
  {r: 255, g: 127, b: 0},    // Orange
  {r: 255, g: 255, b: 0},    // Yellow
  {r: 0, g: 255, b: 0},      // Green
  {r: 0, g: 0, b: 255},      // Blue
  {r: 75, g: 0, b: 130},     // Indigo
  {r: 148, g: 0, b: 211}     // Violet
];
let currentColorIndex = 0;
let colorChangeSpeed = 0.05;

// Planetas
let planets = [];
const NUM_PLANETS = 10;
let selectedPlanet = null;
// let hoveredPlanet = null;
let isZoomedIn = false;
let isPaused = false;

// Câmara
let camX = 0,
  camY = -800,
  camZ = 2000;
let targetX = 0,
  targetY = -800,
  targetZ = 2000;

// Texturas procedurais
let textureIndexToUpdate = 0;

// ---------------------- FUNÇÕES GLOBAIS ----------------------
function autoAdjustStars() {
  const fps = frameRate();

  if (fps < TARGET_FPS * 0.8 && stars.length > STAR_MIN) {
    stars.splice(0, 20);
  }

  // Always ensure we have at least minStars
  while (stars.length < STAR_MIN) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
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
  console.log("Retorno à visão geral do sistema solar.");
}

// ---------------------- PRELOAD & SETUP ----------------------
function preload() {
  spaceSound = loadSound("assets/sounds/space.mp3");
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera(0, -800, 2000);
  createProceduralTextures();

  // Vídeo para PoseNet 
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
  setupPartyUI();
}

function setupPartyUI() {
  // Show party modal after a delay
  setTimeout(() => {
    if (showPartyModal && !localStorage.getItem('partyModalShown')) {
      select('#party-modal').removeClass('hidden');
      localStorage.setItem('partyModalShown', 'true');
    }
  }, 5000); // Show after 5 seconds
  
  // Add event listeners for modal buttons
  select('#party-yes').mousePressed(() => {
    select('#party-modal').addClass('hidden');
    togglePartyMode();
  });
  
  select('#party-no').mousePressed(() => {
    select('#party-modal').addClass('hidden');
  });
  
  // Add event listener for party toggle button
  select('#party-toggle').mousePressed(togglePartyMode);
}

function togglePartyMode() {
  partyMode = !partyMode;
  
  if (partyMode) {
    select('body').addClass('party-mode');
    let partyToggle = select('#party-toggle');
    partyToggle.addClass('party-active');
    partyToggle.attribute('title', 'Dançando com as Estrelas!');
    colorChangeSpeed = 0.05; // Reset speed
    currentColorIndex = 0;
    // Make planets spin faster
    for (let p of planets) {
      p.speed *= 2;
    }
  } else {
    select('body').removeClass('party-mode');
    let partyToggle = select('#party-toggle');
    partyToggle.removeClass('party-active');
    partyToggle.attribute('title', 'Alternar Modo de Celebração Cósmica');
    // Reset sun color to original
    sunHue = 30;
    let rgb = hslToRgb(sunHue / 360, 0.7, 0.5);
    solarColor = { r: rgb.r * 255, g: rgb.g * 255, b: rgb.b * 255 };
    // Reset planet speeds
    for (let p of planets) {
      p.speed /= 2;
    }
  }
}

function updatePartyColors() {
  if (!partyMode) return;
  
  // Update color index
  currentColorIndex += colorChangeSpeed;
  if (currentColorIndex >= partyColors.length - 1) {
    currentColorIndex = 0;
  }
  
  // Get current and next colors
  const color1 = partyColors[Math.floor(currentColorIndex)];
  const color2 = partyColors[Math.ceil(currentColorIndex) % partyColors.length];
  const amt = currentColorIndex % 1;
  
  // Interpolate between colors
  const r = lerp(color1.r, color2.r, amt);
  const g = lerp(color1.g, color2.g, amt);
  const b = lerp(color1.b, color2.b, amt);
  
  // Update sun color directly
  solarColor = { r, g, b };
  
  // Update the light colors for better effect in party mode
  // The main lights are now handled in the draw function for more control
  
  // Make planets spin faster in party mode
  if (!isPaused) {
    for (let p of planets) {
      p.rotationX += 0.02;
      p.rotationY += 0.03;
      p.rotationZ += 0.01;
    }
  }
}

// ---------------------- DRAW HELPERS ----------------------
function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: round(r * 255),
    g: round(g * 255),
    b: round(b * 255),
  };
}

function drawStars() {
  push();
  noStroke();

  // Increased star brightness and made it less dependent on sunProgress
  const starBrightness = map(1 - sunProgress, 0, 1, 80, 255, true);
  fill(starBrightness);

  // Make stars slightly bigger and more detailed
  for (let s of stars) {
    push();
    translate(s.x, s.y, s.z);
    sphere(3, 8, 6);  // Increased size and detail
    pop();
  }

  pop();
}

// ---------------------- MAIN DRAW ----------------------
function draw() {
  updateProceduralTextures(textureIndexToUpdate);
  textureIndexToUpdate = (textureIndexToUpdate + 1) % 10;

  // Atualiza ciclo solar pela mão
  updateSunCycle();
  updatePartyColors();
  background(5, 5, 15);

  // Only update solarColor from sunHue if not in party mode
  if (!partyMode) {
    let rgb = hslToRgb(sunHue / 360, 0.7, 0.5); // saturação 100%, luz 50%
    solarColor = { r: rgb.r, g: rgb.g, b: rgb.b }; // atualiza cor global do sol
  }

  let intensity = lerp(0.3, 2.5, sunProgress); // sol mais forte quando mão está no topo

  let lr = solarColor.r * intensity;
  let lg = solarColor.g * intensity;
  let lb = solarColor.b * intensity;

  // Luz ambiente - mais brilhante e colorida no modo festa
  if (partyMode) {
    // Usa uma cor complementar para o ambiente no modo festa
    let ambientHue = (solarColor.r * 0.3 + solarColor.g * 0.59 + solarColor.b * 0.11) % 360;
    ambientLight(
      color(
        solarColor.b * 0.1,  // Inverte as cores para criar contraste
        solarColor.r * 0.1,
        solarColor.g * 0.1,
        50  // Alpha para suavizar
      )
    );
    
    // Luz direcional mais intensa e colorida
    directionalLight(
      color(solarColor.r, solarColor.g * 0.8, solarColor.b * 0.8),
      0.5, -0.3, -0.4
    );
    
    // Luz pontual mais intensa e com cor vibrante
    pointLight(
      color(solarColor.r * 1.5, solarColor.g * 1.2, solarColor.b * 1.5, 200),
      0, 0, 0
    );
    
    // Adiciona luzes coloridas adicionais para um efeito mais festivo
    pointLight(
      color(solarColor.b * 1.5, solarColor.r * 1.2, solarColor.g * 1.5, 150),
      sin(frameCount * 0.01) * 1000,
      cos(frameCount * 0.007) * 1000,
      sin(frameCount * 0.005) * 1000
    );
  } else {
    // Iluminação normal quando não está no modo festa
    ambientLight(10);
    directionalLight(lr, lg, lb, 0.5, -0.3, -0.4);
    pointLight(lr * 2, lg * 2, lb * 2, 0, 0, 0);
  }

  // Som dinâmico
  if (spaceSound && spaceSound.isPlaying() && soundEnabled) {
    if (isZoomedIn) {
      spaceSound.setVolume(0.1);
    } else {
      let d = dist(camX, camY, camZ, 0, 0, 0);
      let v = map(d, 400, 2800, 0.8, 0.05, true);
      spaceSound.setVolume(v);
    }
  }

  // Camera tracking
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

  // Estrelas
  autoAdjustStars();
  drawStars();

  // Sol
  if (!isZoomedIn) {
    push();
    noStroke();

    let base = solarColor;

    // CAMADA 1 — núcleo super brilhante
    emissiveMaterial(base.r * 4, base.g * 4, base.b * 4);
    sphere(SUN_RADIUS, 64, 48);

    // CAMADA 2 — halo interno
    push();
    emissiveMaterial(base.r * 0.8, base.g * 0.8, base.b * 0.8);
    scale(1.3);
    sphere(SUN_RADIUS, 64, 48);
    pop();

    // CAMADA 3 — halo externo soft
    push();
    emissiveMaterial(base.r * 0.4, base.g * 0.4, base.b * 0.4);
    scale(1.6);
    sphere(SUN_RADIUS, 64, 48);
    pop();

    // CAMADA 4 — bloom falso muito suave
    push();
    emissiveMaterial(base.r * 0.25, base.g * 0.25, base.b * 0.25);
    scale(2.0);
    sphere(SUN_RADIUS, 64, 48);
    pop();

    pop();
  }

  // Órbitas
  if (!isZoomedIn) {
    for (let p of planets) {
      p.drawOrbit();
    }
  }

  // Planetas
  for (let p of planets) {
    if (!isPaused) p.update();
    if (!isZoomedIn || p === selectedPlanet) {
      p.display();
    }
  }
}

// ---------------------- INPUT ----------------------

function mousePressed() {
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  // Seleção simples por clique (SEM TOOLTIP)
  if (!isZoomedIn && hoveredPlanet) {
    selectedPlanet = hoveredPlanet;
    isZoomedIn = true;

    const px = cos(selectedPlanet.angle) * selectedPlanet.orbitRadius;
    const pz = sin(selectedPlanet.angle) * selectedPlanet.orbitRadius;

    targetX = px;
    targetY = 0;
    targetZ = pz + selectedPlanet.size * 1.5 + 150;

    showPlanetInfo(selectedPlanet); // se também quiseres remover, digo-te como
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