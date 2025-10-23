// Textura dos planetas
let planetTexture;

// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let soundButton;

// Estrelas
let stars = [];
const NUM_STARS = 200;
const STAR_FIELD_SIZE = 2000;

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

// Basic planet info for the UI (titles + descriptions)
const planetInfos = [
  { title: 'Lava World', desc: 'A glowing planet of molten rock and fierce energy.' },
  { title: 'Ringed Giant', desc: 'A majestic world with colorful rings.' },
  { title: 'Rainbow Orb', desc: 'A shimmering planet with many tiny moons.' },
  { title: 'Crystal Spire', desc: 'Prismatic crystals float around this world.' },
  { title: 'Blue Ocean', desc: 'Vast seas with glowing waves and foam.' },
  { title: 'Electric Planet', desc: 'Sparks and lightning dance across the surface.' },
  { title: 'Nebula Core', desc: 'A cloudy planet veiled in gas and soft light.' },
  { title: 'Psychedelia', desc: 'A world of swirling psychedelic colors.' },
  { title: 'Shadow', desc: 'Dark landscapes and subtle mysterious glows.' },
  { title: 'Fragmented', desc: 'Broken shards orbit a shrunken core.' },
];

function selectPlanetByIndex(idx) {
  if (idx < 0 || idx >= planets.length) return;

  const p = planets[idx];

  // If already zoomed to this planet, toggle off
  if (isZoomedIn && selectedPlanet === p) {
    unselectPlanet();
    return;
  }

  selectedPlanet = p;
  isZoomedIn = true;

  // Compute immediate target so camera lerps toward it
  const px = cos(p.angle) * p.orbitRadius;
  const pz = sin(p.angle) * p.orbitRadius;
  targetX = px;
  targetY = 0;
  targetZ = pz + p.radius * 2 + 200;

  showPlanetInfo(p);
  updatePlanetListSelection(idx);
}

function unselectPlanet() {
  selectedPlanet = null;
  isZoomedIn = false;
  targetX = 0;
  targetY = -800;
  targetZ = 2000;
  hidePlanetInfo();
  updatePlanetListSelection(-1);
}

function updatePlanetListSelection(selectedIdx) {
  const items = document.querySelectorAll('.planet-item');
  items.forEach((btn) => {
    const idx = parseInt(btn.getAttribute('data-index'));
    if (idx === selectedIdx) btn.classList.add('selected');
    else btn.classList.remove('selected');
  });
}

function preload() {
  spaceSound = loadSound("assets/sounds/space.mp3");
  planetTextures[0] = loadImage(
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJzZDd6ZTExd3l0NW9iMnh3aDR3dnVoNHg5MWwwNXJhZm85NGowdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PidSzdflbzd1sksap9/giphy.gif"
  ); // Lava texture
  planetTextures[1] = loadImage(
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTNtajRpZXMycmVqazk5b3p0eDBkNXI0YWRxNjlsdTR3YWZycXhubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26AHL0EG33tA1geoE/giphy.gif"
  );
  planetTextures[2] = loadImage(
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW83b2R0MHp0d29iMjEzaTk5bjA2d3gyOHo1YzhhcnE4b3d0NDM3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l5XVHJM3A4WSLrZY33/giphy.gif"
  ); // Rainbow holographic
  planetTextures[3] = loadImage(
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGtxNmF5dm5neGt1NjQ0am5xODk4dWxiZnd4bGg3ZWtmeXh0Zzl2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a01ExCirWIhB60rvbT/giphy.gif"
  ); // Ice crystal texture
  planetTextures[4] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTg1MXM0a2U4c3B4dWIxMnFxN3I5b3V6OHBjcm16em1nMGJ0NDA3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q2koSsz3l42ZIiboyW/giphy.gif"
  ); // Deep ocean waves
  planetTextures[5] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJyM3RzNTdjbGIxZzlzbXQwbnhraWU5eWZkMHFwbDh2NGxsZ2hvbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gjmSvyk6x7MTn63sN0/giphy.gif"
  ); // Electric planet texture
  planetTextures[6] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzIzeW10MTZ2OGo4NW80M2g2ZmQwaGhlb3ptcDdjem1rN2I1bjJuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bLdgTj2jCKe9Wf94Km/giphy.gif"
  ); // Nebula gas clouds
  planetTextures[7] = loadImage(
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHpocGY2cHozNmNnNWttYjQyYTZ1NnFtd2dldTJvMnNtZDZ2dHBjNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kPfuCRO04fAiqrHrTV/giphy.gif"
  ); // Psychedelic colors
  planetTextures[8] = loadImage(
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnJmcGhmeGhxeml2NWdheGczaWx0c2Z6Zm8xNGU0YjMyNGc1b2JneSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3q3SUqPnxZGQpMNcjc/giphy.gif"
  ); // Dark mysterious
  planetTextures[9] = loadImage(
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnV1ZmkxMGYyeXV4cTNhYmZtcGZmeWYxMHdoZmN3YnRsNGdha2FvNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d569ZaUubJSWwnVGDY/giphy.gif"
  ); // Fragmented/cracked
}

function setup() {
  frameRate(60);
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  camera(0, -800, 2000);

  textureMode(NORMAL);
  textureWrap(REPEAT, REPEAT);

  // gerar estrelas
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      y: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
      z: random(-STAR_FIELD_SIZE, STAR_FIELD_SIZE),
    });
  }

  let sizes = [30, 45, 32, 60, 35, 50, 33, 65, 48, 80];

  // criar planetas
  for (let i = 0; i < NUM_PLANETS; i++) {
    let orbitRadius = 200 + i * 100;
    let planetRadius = sizes[i]; // tamanhos fixos
    let speed = random(0.008, 0.002);
    let c = color(random(80, 255), random(80, 255), random(80, 255));
    planets.push(new Planet(orbitRadius, planetRadius, speed, c, i));
  }

  // iniciar som
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  // botão de som
  soundButton = document.getElementById("sound-toggle");
  soundButton.addEventListener("click", toggleSound);

  // Planet list buttons wiring
  const items = document.querySelectorAll('.planet-item');
  items.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-index'));
      selectPlanetByIndex(idx);
    });
  });

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    // If focus is on an input or textarea, ignore
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      // Exit zoom
      if (isZoomedIn) unselectPlanet();
    } else if (e.code === 'Space') {
      // Toggle pause
      isPaused = !isPaused;
      e.preventDefault();
    } else {
      // Number keys 1-0 (0 maps to 10)
      const num = parseInt(e.key);
      if (!isNaN(num)) {
        let idx = num - 1;
        if (num === 0) idx = 9; // key '0' -> planet 10
        if (idx >= 0 && idx < NUM_PLANETS) selectPlanetByIndex(idx);
      }
    }
  });
}

function draw() {
  if (isPaused) {
    // still render a faded background so UI remains visible
    background(6, 7, 10);
    // do not advance frameCount dependent updates
  } else {
    background(11, 13, 20);
  }

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

  // luzes
  ambientLight(60);
  directionalLight(255, 255, 255, 0.6, -1, -0.2);

  // sol - ESCONDER no zoom
  if (!isZoomedIn) {
    push();
    noStroke();
    emissiveMaterial(255, 210, 80);
    sphere(SUN_RADIUS, 48, 36);
    pop();
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
}

// class Planet
class Planet {
  constructor(orbitRadius, radius, speed, c, type) {
    this.orbitRadius = orbitRadius;
    this.radius = radius;
    this.speed = speed;
    this.color = c;
    this.type = type;
    this.angle = random(TWO_PI);
  }

  update() {
    this.angle += this.speed;
  }

  display() {
    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;

    if (!isZoomedIn) {
      push();
      rotateX(HALF_PI);
      stroke(80, 90, 120, 80);
      noFill();
      circle(0, 0, this.orbitRadius * 2);
      pop();
    }

    if (this === hoveredPlanet) {
      push();
      translate(x, 0, z);
      noFill();
      stroke(255, 255, 0);
      strokeWeight(2);
      sphere(this.radius * 1.5, 16, 12);
      pop();
    }

    push();
    translate(x, 0, z);
    noStroke();

    switch (this.type) {
      case 0: // lava
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[0]);
        let lavaGlow = sin(frameCount * 0.08) * 100 + 155;
        emissiveMaterial(255, lavaGlow * 0.3, 0);
        sphere(this.radius, 80, 60);
        pop();
        // Crateras brilhantes (mantém o código existente)
        for (let i = 0; i < 8; i++) {
          let a = (i * TWO_PI) / 8 + frameCount * 0.01;
          let px = cos(a) * this.radius * 0.7;
          let pz = sin(a) * this.radius * 0.7;
          push();
          translate(px, 0, pz);
          emissiveMaterial(255, 100, 0);
          sphere(this.radius * 0.15, 8, 6);
          pop();
        }
        break;

      case 1: // saturno
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[1]);
        let hue1 = (frameCount * 0.5 + this.angle * 50) % 360;
        sphere(this.radius, 80, 60);
        pop();
        // Anéis (mantém o código existente)
        push();
        rotateX(HALF_PI);
        noFill();
        strokeWeight(2);
        for (let i = 0; i < 12; i++) {
          let ringHue = (hue1 + i * 30) % 360;
          let ringColor = color(`hsl(${ringHue}, 80%, 60%)`);
          stroke(red(ringColor), green(ringColor), blue(ringColor), 200);
          circle(0, 0, this.radius * (2.5 + i * 0.4));
        }
        pop();
        break;

      case 2: // luas arco iris
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[2]);
        let shimmer = sin(frameCount * 0.05) * 50 + 205;
        specularMaterial(shimmer, 180, 255);
        sphere(this.radius, 80, 60);
        pop();
        // Luas orbitantes (mantém o código existente)
        for (let i = 0; i < 8; i++) {
          let a = frameCount * 0.05 + (i * PI) / 4;
          let px = cos(a) * this.radius * 2;
          let pz = sin(a) * this.radius * 2;
          let moonHue = (i * 45 + frameCount) % 360;
          let moonC = color(`hsl(${moonHue}, 90%, 65%)`);
          push();
          translate(px, 0, pz);
          emissiveMaterial(red(moonC), green(moonC), blue(moonC));
          sphere(this.radius * 0.12, 8, 6);
          pop();
        }
        break;

      case 3: // cristal
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[3]);
        let crystal = sin(frameCount * 0.1) * 80 + 175;
        specularMaterial(crystal, 255, 255);
        sphere(this.radius, 80, 60);
        pop();
        // Cristais flutuantes (mantém o código existente)
        for (let i = 0; i < 6; i++) {
          let angle = (i * TWO_PI) / 6 + frameCount * 0.03;
          let dist = this.radius * 1.3;
          push();
          translate(
            cos(angle) * dist,
            sin(frameCount * 0.02 + i) * 10,
            sin(angle) * dist
          );
          rotateY(frameCount * 0.05);
          specularMaterial(200, 240, 255);
          shininess(250);
          box(this.radius * 0.2);
          pop();
        }
        break;

      case 4: // ocean
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[4]);
        let wave = noise(frameCount * 0.01, this.angle) * 50;
        specularMaterial(30, 120 + wave, 200 + wave);
        sphere(this.radius, 80, 60);
        pop();
        // Espuma brilhante (mantém o código existente)
        push();
        noFill();
        strokeWeight(1.5);
        for (let i = 0; i < 5; i++) {
          let waveSize = this.radius * (1.05 + i * 0.08);
          let alpha = 150 - i * 30;
          stroke(100, 200, 255, alpha);
          rotateY(frameCount * 0.02);
          circle(0, 0, waveSize * 2);
        }
        pop();
        break;

      case 5: // elétrico (já tem textura)
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[5]);
        sphere(this.radius, 80, 60);
        pop();
        // Raios (mantém o código existente)
        push();
        stroke(255, 255, 100, 200);
        strokeWeight(2);
        for (let i = 0; i < 12; i++) {
          let boltAngle = random(TWO_PI);
          let boltDist = this.radius * 1.2;
          let x1 = cos(boltAngle) * this.radius * 0.9;
          let z1 = sin(boltAngle) * this.radius * 0.9;
          let x2 = cos(boltAngle) * boltDist;
          let z2 = sin(boltAngle) * boltDist;
          if (frameCount % (10 + i) < 2) {
            line(x1, 0, z1, x2, random(-10, 10), z2);
          }
        }
        pop();
        break;

      case 6: // nebulosa
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[6]);
        for (let layer = 0; layer < 4; layer++) {
          let layerGlow = sin(frameCount * 0.1 + layer) * 80 + 175;
          push();
          emissiveMaterial(layerGlow, layerGlow * 0.5, layerGlow);
          sphere(this.radius * (1 - layer * 0.15), 32, 24);
          pop();
        }
        pop();
        break;

      case 7: // cores psicodélicas
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[7]);
        rotateY(frameCount * 0.02);
        sphere(this.radius, 80, 60);
        pop();
        // Patches coloridos (mantém o código existente)
        break;

      case 8: // sombrio
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[8]);
        ambientMaterial(20, 15, 40);
        sphere(this.radius, 80, 60);
        pop();
        // Fissuras (mantém o código existente)
        break;

      case 9: // fragmentado
        push();
        textureMode(NORMAL); // Coordenadas 0-1
        textureWrap(REPEAT, REPEAT); // Repetir textura
        texture(planetTextures[9]);
        sphere(this.radius * 0.4, 32, 24);
        pop();
        // Fragmentos orbitantes (mantém o código existente)
        break;
    }
    pop();
  }
}

function mousePressed() {
  if (spaceSound && !spaceSound.isPlaying()) {
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }

  if (!isZoomedIn && hoveredPlanet) {
    selectedPlanet = hoveredPlanet;
    isZoomedIn = true;
    showPlanetInfo(selectedPlanet);
  } else if (isZoomedIn) {
    selectedPlanet = null;
    targetX = 0;
    targetY = -800;
    targetZ = 2000;
    isZoomedIn = false;
    hidePlanetInfo();
  }
}

function showPlanetInfo(planet) {
  const infoDiv = document.getElementById("planet-info");
  const titleElement = document.getElementById("planet-title");
  const descElement = document.getElementById("planet-description");

  const info = planetInfos[planet.type] || {};
  titleElement.textContent = info.title || `Planet ${planet.type + 1}`;
  descElement.textContent = info.desc || "Explora o universo da criatividade digital";

  infoDiv.classList.remove("hidden");
}

function hidePlanetInfo() {
  const infoDiv = document.getElementById("planet-info");
  infoDiv.classList.add("hidden");
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
    soundButton.textContent = "🔊";
  } else {
    spaceSound.setVolume(0);
    soundButton.textContent = "🔇";
  }
}